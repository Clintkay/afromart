import { createFileRoute } from '@tanstack/react-router';
import { SupportAssistant } from '@/components/SupportAssistant';
export const Route=createFileRoute('/_authenticated/support-chat/$threadId')({component:Page,head:()=>({meta:[{title:'Your support conversation | Afromart'},{name:'description',content:'Continue your private Afromart support conversation.'},{property:'og:title',content:'Your support conversation | Afromart'},{property:'og:description',content:'Get assistance with your Afromart account and purchases.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]})});
function Page(){const {threadId}=Route.useParams();return <SupportAssistant threadId={threadId}/>;}
