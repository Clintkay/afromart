import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Plus, Headphones, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';
import { listSupportChats, newSupportChat, getSupportChat } from '@/lib/support-chat.functions';
import { createSupportTicket } from '@/lib/support.functions';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo-mark.png';

export function SupportAssistant({threadId}:{threadId?:string}) {
 const list=useServerFn(listSupportChats),create=useServerFn(newSupportChat),get=useServerFn(getSupportChat);
 const navigate=useNavigate(),qc=useQueryClient();const [error,setError]=useState(''),[creating,setCreating]=useState(false);
 const threads=useQuery({queryKey:['support-chats'],queryFn:()=>list()});
 const thread=useQuery({queryKey:['support-chat',threadId],queryFn:()=>get({data:{id:threadId??''}}),enabled:!!threadId});
 async function start(){setCreating(true);try{const chat=await create();await qc.invalidateQueries({queryKey:['support-chats']});await navigate({to:'/support-chat/$threadId',params:{threadId:chat.id}});}catch{setError('Could not start a chat. Please try again.');}finally{setCreating(false);}}
 return <div className="mx-auto max-w-6xl px-4 py-6"><div className="mb-5 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><img src={logo} alt="Afromart" className="h-10 w-10 object-contain"/><div><h1 className="font-heading text-xl font-bold">Afromart assistant</h1><p className="text-xs text-muted-foreground">AI support</p></div></div><Button variant="ghost" asChild><Link to="/support"><ArrowLeft/>Support</Link></Button></div>
 <div className="grid min-w-0 gap-5 md:grid-cols-[220px_minmax(0,1fr)]"><aside className="min-w-0 border-b pb-4 md:border-b-0 md:border-r md:pr-4"><Button onClick={start} disabled={creating} className="w-full"><Plus/>New chat</Button><nav aria-label="Support conversations" className="mt-3 flex max-h-64 gap-2 overflow-auto md:flex-col">{threads.data?.map(t=><Button variant={t.id===threadId?'secondary':'ghost'} className="shrink-0 justify-start md:w-full" asChild key={t.id}><Link to="/support-chat/$threadId" params={{threadId:t.id}}><span className="truncate">{t.title}</span></Link></Button>)}</nav>{threads.isError&&<p role="alert">Could not load conversations.</p>}</aside>
 <section className="min-w-0">{error&&<p role="alert">{error}</p>}{!threadId?<div className="py-16 text-center"><h2 className="font-heading text-2xl font-bold">How can we help?</h2><p className="my-4 text-muted-foreground">Orders, deliveries, payments or your account.</p><Button onClick={start} disabled={creating}>Start a support chat</Button></div>:thread.isPending?<Shimmer>Loading conversation…</Shimmer>:thread.isError?<p role="alert">This conversation could not be loaded.</p>:thread.data?<ChatWindow key={threadId} id={threadId} initialMessages={thread.data.messages as unknown as UIMessage[]} ticketId={thread.data.ticket_id}/>:null}</section></div></div>;
}
function ChatWindow({id,initialMessages,ticketId}:{id:string;initialMessages:UIMessage[];ticketId:string|null}) {
 const qc=useQueryClient(),createTicket=useServerFn(createSupportTicket);const input=useRef<HTMLTextAreaElement>(null);const [draft,setDraft]=useState(''),[escalating,setEscalating]=useState(false),[ticket,setTicket]=useState(ticketId),[ticketError,setTicketError]=useState('');
 const transport=useMemo(()=>new DefaultChatTransport({api:'/api/support-chat',headers:async()=>{const {data}=await supabase.auth.getSession();return {Authorization:`Bearer ${data.session?.access_token??''}`};}}),[]);
 const {messages,sendMessage,status,error,stop}=useChat({id,messages:initialMessages,transport,onFinish:()=>{void qc.invalidateQueries({queryKey:['support-chats']});}});
 const busy=status==='submitted'||status==='streaming';
 useEffect(()=>{if(!busy)input.current?.focus();},[busy]);
 async function escalate(){setEscalating(true);setTicketError('');try{const transcript=messages.map(m=>`${m.role==='user'?'Customer':'AI assistant'}: ${m.parts.filter(p=>p.type==='text').map(p=>p.text).join('\n')}`).join('\n\n');const t=await createTicket({data:{subject:'AI support conversation',topic:'general',message:(transcript||'Please help with my account.').slice(-1900)}});setTicket(t.id);const {error:e}=await supabase.from('ai_support_threads').update({ticket_id:t.id}).eq('id',id);if(e)setTicketError('Request sent, but the conversation link could not be saved. Find it in Support.');}catch{setTicketError('Could not send your request. Please try again.');}finally{setEscalating(false);}}
 return <><Conversation className="h-[48dvh] min-h-64 md:h-[55dvh]"><ConversationContent>{messages.length===0&&<div className="py-10"><h2 className="font-heading text-2xl font-bold">Hello, how can I help?</h2><p className="mt-2 text-muted-foreground">What’s happening with your Afromart experience?</p></div>}{messages.map(m=><Message key={m.id} from={m.role}><MessageContent className={m.role==='user'?'bg-primary! text-primary-foreground!':'bg-transparent!'}>{m.parts.map((p,i)=>p.type==='text'?<MessageResponse key={i}>{p.text}</MessageResponse>:p.type==='reasoning'?<Reasoning key={i} isStreaming={busy} defaultOpen={false}><ReasoningTrigger/><ReasoningContent>{p.text}</ReasoningContent></Reasoning>:null)}</MessageContent></Message>)}{status==='submitted'&&<Shimmer>Thinking…</Shimmer>}</ConversationContent><ConversationScrollButton/></Conversation>
 {error&&<p role="alert" className="my-3 text-sm text-destructive">{error.message}</p>}
 <PromptInput onSubmit={async({text})=>{if(!text.trim()||busy)return;setDraft('');await sendMessage({text:text.trim()});input.current?.focus();}}><PromptInputTextarea ref={input} autoFocus aria-label="Message Afromart assistant" placeholder="Ask Afromart support…" value={draft} maxLength={4000} onChange={e=>setDraft(e.target.value)}/><PromptInputFooter className="justify-end"><PromptInputSubmit status={status} onStop={()=>void stop()} disabled={!busy&&!draft.trim()}/></PromptInputFooter></PromptInput>
 <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">AI answers may be inaccurate. Never share passwords or verification codes.</p>{ticket?<Button variant="outline" asChild><Link to="/support">View human support request</Link></Button>:<Button variant="outline" onClick={escalate} disabled={busy||escalating}><Headphones/>{escalating?'Sending…':'Talk to human support'}</Button>}</div>{ticketError&&<p role="alert" className="text-sm text-destructive">{ticketError}</p>}</>;
}
