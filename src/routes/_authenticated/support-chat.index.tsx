import { createFileRoute } from '@tanstack/react-router';
import { SupportAssistant } from '@/components/SupportAssistant';
export const Route=createFileRoute('/_authenticated/support-chat/')({component:SupportAssistant,head:()=>({meta:[{title:'Afromart AI Support'},{name:'description',content:'Get help from Afromart and revisit your saved support conversations.'},{property:'og:title',content:'Afromart AI Support'},{property:'og:description',content:'Private support for your Afromart experience.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]})});
