-- Link each conversation to the store owner so sellers can read and reply
create or replace function private.set_conversation_seller()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.seller_id is null then
    select s.owner_id into new.seller_id from public.stores s where s.id = new.store_id;
  end if;
  return new;
end;
$$;

revoke all on function private.set_conversation_seller() from public;

drop trigger if exists set_conversation_seller on public.product_conversations;
create trigger set_conversation_seller
before insert on public.product_conversations
for each row execute function private.set_conversation_seller();

update public.product_conversations c
set seller_id = s.owner_id
from public.stores s
where s.id = c.store_id and c.seller_id is null;

-- Notify the other participant whenever a message arrives
create or replace function private.notify_chat_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient uuid;
begin
  select case when c.buyer_id = new.sender_id then c.seller_id else c.buyer_id end
  into recipient
  from public.product_conversations c
  where c.id = new.conversation_id;

  if recipient is not null and recipient <> new.sender_id then
    insert into public.notifications (user_id, kind, title, body)
    values (recipient, 'message', 'New message on Afromart',
            left(new.body, 160));
  end if;

  update public.product_conversations
  set last_message_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;

revoke all on function private.notify_chat_message() from public;

drop trigger if exists notify_chat_message on public.product_messages;
create trigger notify_chat_message
after insert on public.product_messages
for each row execute function private.notify_chat_message();