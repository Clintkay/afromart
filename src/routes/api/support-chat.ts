import { createFileRoute } from '@tanstack/react-router';
export const Route=createFileRoute('/api/support-chat')({server:{handlers:{POST:async({request})=>{
 const {supportChatResponse}=await import('@/lib/support-ai.server');
 try{return await supportChatResponse(request);}catch(error){if(error instanceof Error&&error.name==='AbortError')return new Response(null,{status:499});return new Response('Support is temporarily unavailable. Your saved conversations are safe.',{status:500});}
}}});
