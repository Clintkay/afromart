import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

const orderInput = z.object({ orderId: z.string().uuid() });
export const getMyBankAccount = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({context}) => {
  const {data,error} = await context.supabase.from('seller_bank_accounts').select('*').maybeSingle();
  if(error) throw error;
  return data;
});
export const saveBankAccount = createServerFn({method:'POST'}).middleware([requireSupabaseAuth])
.inputValidator((input:{bankName:string;accountName:string;accountNumber:string})=>z.object({bankName:z.string().trim().min(2).max(100),accountName:z.string().trim().min(2).max(120),accountNumber:z.string().trim().regex(/^\d{10}$/, 'Enter a 10-digit Nigerian account number.')}).parse(input))
.handler(async({data,context})=>{
 const {data:store,error:storeError}=await context.supabase.from('stores').select('id').eq('owner_id',context.userId).single();
 if(storeError || !store) throw new Error('Create your store first.');
 const {error}=await context.supabase.from('seller_bank_accounts').upsert({store_id:store.id,bank_name:data.bankName,account_name:data.accountName,account_number:data.accountNumber,updated_at:new Date().toISOString()});
 if(error) throw error;
 return {ok:true};
});
export const getOrderTransfers = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).inputValidator((input:{orderId:string})=>orderInput.parse(input)).handler(async({data,context})=>{
 const {data:rows,error}=await context.supabase.from('order_bank_transfers').select('*').eq('order_id',data.orderId).order('store_id');
 if(error) throw error;
 return rows ?? [];
});
export const prepareTransfers = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:{orderId:string})=>orderInput.parse(input)).handler(async({data,context})=>{
 const {data:order}=await context.supabase.from('orders').select('payment_method').eq('id',data.orderId).eq('user_id',context.userId).single();
 if(order?.payment_method!=='bank_transfer') throw new Error('Not a bank-transfer order.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error}=await supabaseAdmin.rpc('prepare_bank_transfers',{p_order:data.orderId,p_user:context.userId});
 if(error) throw new Error('Bank details are not ready for this order. Contact the seller and try again.');
 return {ok:true};
});
export const reportTransfer = createServerFn({method:'POST'}).middleware([requireSupabaseAuth])
.inputValidator((input:{transferId:string;reference:string})=>z.object({transferId:z.string().uuid(),reference:z.string().trim().min(3).max(120)}).parse(input))
.handler(async({data,context})=>{
 const {data:t}=await context.supabase.from('order_bank_transfers').select('*').eq('id',data.transferId).single();
 if(!t) throw new Error('Transfer not found.');
 const {data:o}=await context.supabase.from('orders').select('id,status,payment_status').eq('id',t.order_id).eq('user_id',context.userId).single();
 if(!o || o.status==='cancelled' || o.payment_status!=='pending') throw new Error('Order cannot accept a transfer report.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:updated,error}=await supabaseAdmin.from('order_bank_transfers').update({status:'submitted',sender_reference:data.reference,submitted_at:new Date().toISOString()}).eq('id',t.id).eq('status','awaiting_transfer').select('id');
 if(error) throw error;
 if(updated?.length){
  const {data:s}=await supabaseAdmin.from('stores').select('owner_id').eq('id',t.store_id).single();
  if(s?.owner_id) await supabaseAdmin.from('notifications').insert({user_id:s.owner_id,kind:'order',title:'Bank transfer reported',body:'A buyer reported a bank transfer. Check your bank statement before confirming receipt in your seller dashboard.'});
 }
 return {ok:true};
});
export const confirmTransfer = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:{transferId:string})=>z.object({transferId:z.string().uuid()}).parse(input)).handler(async({data,context})=>{
 const {data:t}=await context.supabase.from('order_bank_transfers').select('store_id').eq('id',data.transferId).single();
 if(!t) throw new Error('Transfer not found.');
 const {data:s}=await context.supabase.from('stores').select('id').eq('id',t.store_id).eq('owner_id',context.userId).single();
 if(!s) throw new Error('Forbidden');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error}=await supabaseAdmin.rpc('confirm_bank_transfer',{p_transfer:data.transferId,p_user:context.userId});
 if(error) throw new Error('Could not confirm receipt. Refresh and try again.');
 return {ok:true};
});
