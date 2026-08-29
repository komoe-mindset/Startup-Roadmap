import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, Bot, Boxes, Check, CheckCircle2, ChevronRight, CircleDollarSign,
  ClipboardCheck, Compass, Gauge, Handshake, Lightbulb, Megaphone, RefreshCw,
  Rocket, Scale, Search, Settings2, ShieldCheck, Sparkles, Target, Users, Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryModal } from "@/components/StoryModal";
import { STORY_STAGES } from "@/data/storyData";

type Stage = {
  id: string; number: string; title: string; mm: string; phase: string; color: string; pale: string;
  icon: typeof Search; question: string; what: string; why: string[]; actions: {title:string; detail:string}[];
  gate: string[]; kpis: string[]; ai: string[]; human: string[]; mistake: string; example: string;
};

const stages: Stage[] = [
  {
    id:"problem", number:"01", title:"Problem Validation", mm:"Customer ပြဿနာကို သက်သေပြခြင်း", phase:"DISCOVER", color:"#e8693e", pale:"#fff0e9", icon:Search,
    question:"လူအစစ်တွေမှာ မကြာခဏဖြစ်ပြီး ဖြေရှင်းဖို့ အရေးကြီးတဲ့ ပြဿနာရှိသလား?",
    what:"Idea ကောင်းတယ်လို့ထင်ခြင်းမဟုတ်ဘဲ Customer ရဲ့ အပြုအမူ၊ လက်ရှိဖြေရှင်းနည်းနဲ့ ငွေပေးလိုမှုက ပြဿနာတကယ်ရှိကြောင်း ပြသခြင်းဖြစ်သည်။",
    why:["Customer မလိုချင်သော Product ကို မတည်ဆောက်မိစေဘူး။","Problem ရဲ့ Frequency၊ Impact နဲ့ Urgency ကို နားလည်စေတယ်။","Customer အသုံးပြုတဲ့စကားလုံးတွေက နောက်ပိုင်း Marketing နဲ့ Sales ကို တိကျစေတယ်။"],
    actions:[{title:"Customer 10 ယောက်ရွေးပါ",detail:"Solution မပြောခင် သင်စိတ်ဝင်စားတဲ့ Customer segment ကို သတ်မှတ်ပါ။"},{title:"Problem Interview လုပ်ပါ",detail:"လက်ရှိ Process၊ နောက်ဆုံးကြုံခဲ့ချိန်၊ သက်ရောက်မှုနဲ့ ဖြေရှင်းနည်းကို မေးပါ။"},{title:"Pattern ရှာပါ",detail:"ထပ်တလဲလဲဖြစ်သော Pain၊ Trigger၊ Cost နဲ့ Words ကို စုပါ။"},{title:"Payment Signal စမ်းပါ",detail:"Paid diagnostic သို့မဟုတ် Pilot ကို လက်ခံမလား စစ်ပါ။"}],
    gate:["အနည်းဆုံး Customer 10 ယောက်နှင့် စကားပြောပြီးပြီ","အလားတူ Pain ကို Customer အများစု ပြောတယ်","လက်ရှိ Alternative သို့မဟုတ် Cost ရှိတယ်","Paid Pilot အတွက် အပြုသဘော Signal ရှိတယ်"],
    kpis:["Interviews","Pain frequency","Current cost","Payment signal"], ai:["Interview guide draft","Notes ကို themes ခွဲခြင်း","Competitor research"], human:["စကားပြောခြင်း","အမူအရာနားလည်ခြင်း","Evidence အတည်ပြုခြင်း"],
    mistake:"AI-generated Persona ကို Customer Research အစစ်လို့ ယူဆခြင်း။", example:"“AI လိုချင်လား?” မမေးဘဲ “ပြီးခဲ့တဲ့အပတ် ဒီအလုပ်ကို ဘယ်လိုလုပ်ခဲ့လဲ?” လို့မေးပါ။"
  },
  {
    id:"customer", number:"02", title:"Customer & Positioning", mm:"ပထမဆုံးဝယ်မည့် Customer ကို ရွေးခြင်း", phase:"FOCUS", color:"#d79a24", pale:"#fff8df", icon:Target,
    question:"ပထမဆုံး ဘယ်သူအတွက် ဘယ် Pain ကို ဖြေရှင်းမယ်ဆိုတာ ရှင်းလင်းသလား?",
    what:"လူတိုင်းအတွက် Product မလုပ်ဘဲ Pain၊ Budget၊ Authority နဲ့ Access တူသော Initial Customer Segment တစ်ခုကို ရွေးခြင်းဖြစ်သည်။",
    why:["Message တစ်ခုက လူတစ်မျိုးအတွက် ပိုတိကျလာတယ်။","Product scope နဲ့ Sales cycle ကို လျှော့ချနိုင်တယ်။","Customer ကို ရှာဖို့ Channel ရွေးရလွယ်လာတယ်။"],
    actions:[{title:"Initial Segment ရွေးပါ",detail:"Industry၊ role၊ company size သို့မဟုတ် situation တစ်ခုနဲ့ ကျဉ်းပါ။"},{title:"Buyer နဲ့ User ခွဲပါ",detail:"အသုံးပြုသူ၊ ငွေပေးသူနဲ့ အတည်ပြုသူ ဘယ်သူလဲ သိပါ။"},{title:"Positioning Sentence ရေးပါ",detail:"We help [customer] solve [pain] to achieve [result] through [approach]."},{title:"Five-second Test လုပ်ပါ",detail:"သူငယ်ချင်းတစ်ယောက်ဖတ်ပြီး ဘယ်သူအတွက်လဲ ပြန်ပြောနိုင်မလား စစ်ပါ။"}],
    gate:["Customer segment တစ်ခုတည်း ရွေးထားတယ်","Buyer နဲ့ User ကို သိတယ်","Pain နဲ့ Result ကို တစ်ကြောင်းတည်းပြောနိုင်တယ်","Customer ဆီရောက်နိုင်သော Channel ရှိတယ်"],
    kpis:["Segment clarity","Buyer access","Problem relevance","Message recall"], ai:["Segment comparison","Positioning variants","Persona draft"], human:["Niche ရွေးချယ်ခြင်း","Customer access","Brand point of view"],
    mistake:"“All businesses” သို့မဟုတ် “AI စိတ်ဝင်စားသူအားလုံး” ကို Target လုပ်ခြင်း။", example:"“SME အားလုံး” ထက် “Customer Reply မှာ အချိန်ကုန်နေတဲ့ Yangon retail owner” က ပိုရှင်းသည်။"
  },
  {
    id:"offer", number:"03", title:"Offer & MVP", mm:"အနည်းဆုံး Paid Solution တည်ဆောက်ခြင်း", phase:"CREATE", color:"#8c70db", pale:"#f2edff", icon:Boxes,
    question:"Product အကြီးမတည်ဆောက်ခင် Result ပေးနိုင်တဲ့ Paid Pilot ရှိသလား?",
    what:"MVP သည် Feature နည်းတဲ့ App တစ်ခုတည်းမဟုတ်ပါ။ Customer ရဲ့ အရေးကြီးဆုံး Assumption ကို အမြန်ဆုံး၊ ကုန်ကျစရိတ်နည်းစွာ စမ်းသပ်ပေးတဲ့ Solution ဖြစ်သည်။",
    why:["Payment က compliment ထက် ပိုကောင်းသော Validation ဖြစ်တယ်။","Customer နဲ့အတူလုပ်ရင်း Product လိုအပ်ချက်ကို သင်ယူနိုင်တယ်။","Software မတည်ဆောက်ခင် Delivery နဲ့ Economics ကို စမ်းနိုင်တယ်။"],
    actions:[{title:"Dream Outcome သတ်မှတ်ပါ",detail:"Customer ရမယ့် ပြောင်းလဲမှုကို Feature မဟုတ်ဘဲ Result အနေနဲ့ရေးပါ။"},{title:"Smallest Delivery ရွေးပါ",detail:"Service၊ workshop၊ prototype သို့မဟုတ် concierge pilot ကို ရွေးပါ။"},{title:"Scope နဲ့ Timeline ရှင်းပါ",detail:"ပါဝင်တာ၊ မပါဝင်တာ၊ Quick Win နဲ့ Definition of Done ရေးပါ။"},{title:"Price နဲ့ Ask စမ်းပါ",detail:"Customer သုံးယောက်ကို အတိအကျ Offer ပေးပြီး Decision တောင်းပါ။"}],
    gate:["Outcome တစ်ခု ရှင်းတယ်","Scope နဲ့ Timeline ရှင်းတယ်","Paid Pilot Offer ရှိတယ်","Customer အနည်းဆုံးတစ်ယောက် ငွေပေး သို့မဟုတ် Commitment ပေးတယ်"],
    kpis:["Pilot offers","Paid pilots","Time to build","Expected value"], ai:["Offer variants","Prototype assistance","Proposal draft"], human:["Scope decision","Pricing","Promise နဲ့ risk"],
    mistake:"Customer မရှိခင် Platform၊ Mobile App သို့မဟုတ် SaaS အပြည့်တည်ဆောက်ခြင်း။", example:"အရင်ဆုံး “30-Day AI Business Upgrade Sprint” ရောင်းပြီး ထပ်တလဲလဲလိုအပ်ချက်မှ Software တည်ဆောက်ပါ။"
  },
  {
    id:"leads", number:"04", title:"Lead Generation", mm:"သင့်တော်သော Prospect ကို ခေါ်လာခြင်း", phase:"ATTRACT", color:"#ef7d32", pale:"#fff1e3", icon:Megaphone,
    question:"စကားပြောရန်သင့်တော်သော Qualified Leads တစ်သမတ်တည်း ရရှိသလား?",
    what:"Follower သို့မဟုတ် View များခြင်းမဟုတ်ဘဲ Problem၊ Fit နဲ့ စိတ်ဝင်စားမှုရှိတဲ့ လူတွေဆီက Conversation ရရှိစေခြင်းဖြစ်သည်။",
    why:["ကောင်းတဲ့ Offer ရှိပေမဲ့ လူမသိရင် Sale မဖြစ်ဘူး။","Awareness အလိုက် Content က Trust တည်ဆောက်တယ်။","Lead source ကိုတိုင်းတာလို့ Growth ကို ခန့်မှန်းနိုင်တယ်။"],
    actions:[{title:"Awareness Map ရေးပါ",detail:"Unaware မှ Most Aware အထိ Customer သိထားမှုကို ခွဲပါ။"},{title:"Channel နှစ်ခုရွေးပါ",detail:"Founder content၊ outreach၊ referral၊ partnership စတဲ့ Channel နှစ်ခုသာ စပါ။"},{title:"Useful CTA ဖန်တီးပါ",detail:"Checklist၊ diagnostic သို့မဟုတ် meeting အတွက် next step တစ်ခု ပေးပါ။"},{title:"Weekly Rhythm ထားပါ",detail:"Content၊ outreach၊ follow-up နဲ့ review ကို အပတ်စဉ် သတ်မှတ်ပါ။"}],
    gate:["Qualified Lead ကို သတ်မှတ်ထားတယ်","Channel 1–2 ခုရွေးထားတယ်","CTA တစ်ခု ရှင်းတယ်","အပတ်စဉ် Lead flow တိုင်းတာနေတယ်"],
    kpis:["Qualified leads","Reply rate","Booking rate","Cost per lead"], ai:["Research နဲ့ draft","Content repurposing","Lead classification"], human:["Original insight","Proof စစ်ခြင်း","Relationship"],
    mistake:"AI နဲ့ Content အများကြီးထုတ်ပေမဲ့ Point of View နဲ့ CTA မရှိခြင်း။", example:"“AI သင်တန်းဖွင့်တယ်” ထက် “တစ်ပတ်အချိန်ဆုံးရှုံးမှု စစ်ရန် 5-minute checklist” ပေးပါ။"
  },
  {
    id:"sales", number:"05", title:"Sales", mm:"Fit နဲ့ Value ကို အတည်ပြုခြင်း", phase:"CONVERT", color:"#b75fbd", pale:"#faedfb", icon:CircleDollarSign,
    question:"သင့်တော်တဲ့ Prospect က Problem၊ Value နဲ့ Next Step ကို နားလည်ပြီး ဆုံးဖြတ်နိုင်သလား?",
    what:"ဖိအားပေးခြင်းမဟုတ်ပါ။ Customer ရဲ့ Current Situation၊ Desired Outcome၊ Impact၊ Fit နဲ့ Offer ကို ရှင်းလင်းစေတဲ့ Decision Process ဖြစ်သည်။",
    why:["ဝယ်မဝယ်ရတဲ့ အကြောင်းရင်းကို Founder ကိုယ်တိုင် သင်ယူနိုင်တယ်။","Wrong-fit Customer ကို ရှောင်နိုင်တယ်။","Expectation မှန်ကန်လို့ Delivery နဲ့ Retention ပိုကောင်းတယ်။"],
    actions:[{title:"Discovery Questions ပြင်ပါ",detail:"Current state၊ desired result၊ impact၊ alternatives နဲ့ decision process ကို မေးပါ။"},{title:"Listen before Pitch",detail:"Customer ပြောတဲ့ Pain ကို သူ့စကားနဲ့ ပြန်အတည်ပြုပါ။"},{title:"Relevant Offer ပေးပါ",detail:"Feature အားလုံးမဟုတ်ဘဲ သူ့ Pain နဲ့ကိုက်တဲ့ Outcome၊ Proof၊ Time နဲ့ Effort ကို ရှင်းပါ။"},{title:"Decision မှတ်တမ်းတင်ပါ",detail:"Yes၊ No သို့မဟုတ် Not now ရဲ့ အကြောင်းရင်းကို CRM/notes ထဲရေးပါ။"}],
    gate:["Discovery process ရှိတယ်","Fit criteria ရှိတယ်","Offer ကို Price/Scope/Timeline နဲ့ပြောနိုင်တယ်","Close rate နဲ့ reasons ကို တိုင်းတာတယ်"],
    kpis:["Show rate","Close rate","Sales cycle","Average value"], ai:["Meeting research","Call summary","Proposal/follow-up"], human:["Deep listening","Negotiation","Promise နဲ့ final decision"],
    mistake:"Script ကို တိုက်ရိုက်ဖတ်ပြီး Customer မပြောခင် Product အကြောင်းစပြောခြင်း။", example:"“Tool 20 ခုပါ” မပြောခင် “သုံးလအတွင်း ဘယ် Business Result ရချင်လဲ?” မေးပါ။"
  },
  {
    id:"delivery", number:"06", title:"Delivery & Success", mm:"ကတိပေးထားသော Result ကို ပေးခြင်း", phase:"PROVE", color:"#1da98a", pale:"#e8fbf5", icon:ClipboardCheck,
    question:"Customer က ပထမဆုံးတန်ဖိုးကို မြန်မြန်ခံစားပြီး နောက်ဆုံး Result ရနေသလား?",
    what:"Product ပေးပြီးဆုံးခြင်းမဟုတ်ဘဲ Expectation၊ Onboarding၊ Quick Win၊ Milestone နဲ့ Quality Check တို့မှ Customer Outcome ရရှိစေခြင်းဖြစ်သည်။",
    why:["Delivery က Sales မှာပေးထားတဲ့ Promise ကို Proof အဖြစ်ပြောင်းတယ်။","Quick Win က Customer momentum တိုးစေတယ်။","Real Result က Case Study၊ Referral နဲ့ Product improvement ဖြစ်စေတယ်။"],
    actions:[{title:"Expectation Align လုပ်ပါ",detail:"Goal၊ Scope၊ Timeline၊ Responsibilities နဲ့ Done ကို အတည်ပြုပါ။"},{title:"Quick Win ပေးပါ",detail:"ပထမအပတ်အတွင်း မြင်နိုင်တဲ့တန်ဖိုးတစ်ခု ဖန်တီးပါ။"},{title:"Milestones စစ်ပါ",detail:"Progress၊ Risk နဲ့ Blocker ကို သတ်မှတ်အချိန်တိုင်း review လုပ်ပါ။"},{title:"Outcome တိုင်းပါ",detail:"Before/After၊ time saved၊ quality သို့မဟုတ် business result ကို မှတ်တမ်းတင်ပါ။"}],
    gate:["Onboarding ရှိတယ်","Time to First Value သိတယ်","Milestones နဲ့ risk checks ရှိတယ်","Customer outcome ကို evidence နဲ့ပြနိုင်တယ်"],
    kpis:["Time to value","Completion","Outcome rate","Satisfaction"], ai:["Onboarding guide","Progress summary","Support triage"], human:["Coaching","Quality approval","Empathy နဲ့ exceptions"],
    mistake:"Course ပြီးခြင်း၊ File ပို့ခြင်းကို Customer Success လို့ယူဆခြင်း။", example:"သင်တန်းပြီးမှ Project မစဘဲ Week 1 မှာ Working Gemini Gem တစ်ခု ဖန်တီးစေပါ။"
  },
  {
    id:"retention", number:"07", title:"Retention & Referral", mm:"Customer Value ကို ဆက်လက်တိုးခြင်း", phase:"GROW", color:"#247ebf", pale:"#eaf5ff", icon:Handshake,
    question:"Result ရပြီးတဲ့ Customer က ဆက်သုံး၊ ပြန်ဝယ် သို့မဟုတ် တခြားသူကို မိတ်ဆက်ပေးသလား?",
    what:"ပထမ Sale ပြီးနောက် Customer ရဲ့ ဆက်လက်အောင်မြင်မှုကို ကူညီပြီး Renewal၊ Expansion၊ Testimonial နဲ့ Referral ဖြစ်လာစေခြင်းဖြစ်သည်။",
    why:["Existing Customer ရဲ့ Knowledge နဲ့ Trust ကို ဆက်အသုံးချနိုင်တယ်။","Recurring Revenue က Cash flow ကို တည်ငြိမ်စေတယ်။","Referral က အားကောင်းတဲ့ low-friction Lead source ဖြစ်တယ်။"],
    actions:[{title:"Success Review လုပ်ပါ",detail:"ရခဲ့တဲ့ Result၊ ကျန်တဲ့ Gap နဲ့ Next Goal ကို ဆွေးနွေးပါ။"},{title:"Ongoing Value Offer ပေးပါ",detail:"Maintenance၊ support၊ training သို့မဟုတ် next-level package ရွေးပါ။"},{title:"Referral Moment သတ်မှတ်ပါ",detail:"Result ပြီးမှ သင့်တော်တဲ့လူကို မိတ်ဆက်ပေးနိုင်မလား မေးပါ။"},{title:"Learning Loop ပိတ်ပါ",detail:"Feedback ကို Offer၊ Marketing နဲ့ Product ထဲ ပြန်ထည့်ပါ။"}],
    gate:["Customer success review ရှိတယ်","Renewal/next offer ရှိတယ်","Result ရပြီးမှ testimonial/referral မေးတယ်","Churn reasons ကို မှတ်တမ်းတင်တယ်"],
    kpis:["Renewal","Churn","Referral rate","Lifetime value"], ai:["Usage summary","Follow-up draft","Feedback themes"], human:["Relationship","Value decision","Permission နဲ့ trust"],
    mistake:"Customer Result မရခင် Testimonial သို့မဟုတ် Referral တောင်းခြင်း။", example:"Project ပြီးပြီးချင်းမပျောက်ဘဲ 30-day outcome review နဲ့ next improvement plan ပေးပါ။"
  },
  {
    id:"operations", number:"08", title:"Operations & Scale", mm:"Quality ကို ထပ်ခါတလဲလဲ ပေးနိုင်ခြင်း", phase:"SCALE", color:"#3156a3", pale:"#ebf0ff", icon:Settings2,
    question:"Founder မပါဘဲ Team နဲ့ System က Quality၊ Cost နဲ့ Speed ကို ထိန်းနိုင်သလား?",
    what:"လူ၊ Process၊ Tool၊ Data၊ Quality Standard နဲ့ KPI တို့ကို ချိတ်ဆက်ပြီး Result ကို predictable အဖြစ်ထပ်ပေးနိုင်သော Business System ဖြစ်သည်။",
    why:["Founder bottleneck ကို လျှော့တယ်။","Quality၊ cost၊ capacity ကို မြင်နိုင်တယ်။","Demand သက်သေရှိပြီးမှ Safe scaling လုပ်နိုင်တယ်။"],
    actions:[{title:"Process Map ရေးပါ",detail:"Trigger မှ Result အထိ steps၊ handoffs၊ decisions နဲ့ exceptions ကို မြင်အောင်ရေးပါ။"},{title:"Standardize လုပ်ပါ",detail:"SOP၊ checklist၊ owner နဲ့ Definition of Done သတ်မှတ်ပါ။"},{title:"Automate after stable",detail:"Repeatable၊ rule-based portion ကိုသာ AI/automation ထည့်ပါ။"},{title:"PDCA Review လုပ်ပါ",detail:"Plan → Do → Check → Act နဲ့ cost၊ quality၊ speed ကို တိုးတက်ပါ။"}],
    gate:["Core process documented ဖြစ်တယ်","Owner နဲ့ quality standard ရှိတယ်","Unit economics နဲ့ capacity သိတယ်","Automation မတိုင်ခင် process stable ဖြစ်တယ်"],
    kpis:["Cycle time","Cost/delivery","Error rate","Capacity & margin"], ai:["SOP draft","Reporting","Routing/automation"], human:["System design","Risk/privacy","Accountability"],
    mistake:"Process မရှင်းသေးခင် Automation လုပ်ပြီး Error ကို ပိုမြန်အောင်လုပ်ခြင်း။", example:"Payment → Welcome → Setup → Delivery → Review ကို SOP ပြီးမှ automation ထည့်ပါ။"
  },
];

const finderQuestions = [
  ["problem","Customer 10 ယောက်နဲ့ ပြဿနာအကြောင်း စကားပြောပြီးပြီလား?"],
  ["customer","ပထမဆုံးဝယ်မယ့် Customer ကို တိတိကျကျ သတ်မှတ်ထားလား?"],
  ["offer","တစ်ယောက်ယောက်က Paid Pilot အတွက် ငွေပေးထားလား?"],
  ["leads","Qualified Leads အပတ်စဉ် ရနေသလား?"],
  ["sales","သင့်တော်တဲ့ Leads တွေထဲက တချို့ ဝယ်နေသလား?"],
  ["delivery","Customer က ကတိပေးထားတဲ့ Result ရနေသလား?"],
  ["retention","Customer က ပြန်ဝယ် သို့မဟုတ် မိတ်ဆက်ပေးသလား?"],
  ["operations","Founder မပါဘဲ Process ကို ထပ်လုပ်နိုင်သလား?"],
] as const;

export default function Home() {
  const [activeId,setActiveId]=useState("problem");
  const [done,setDone]=useState<Record<string,boolean>>({});
  const [finder,setFinder]=useState<Record<string,"yes"|"no">>({});
  const [finderOpen,setFinderOpen]=useState(true);
  const [storyOpen,setStoryOpen]=useState(false);
  const active=stages.find(s=>s.id===activeId)??stages[0];
  const activeStory=STORY_STAGES.find(s=>s.id===active.id)??STORY_STAGES[0];
  useEffect(()=>{try{const a=localStorage.getItem("startup-roadmap-progress"),b=localStorage.getItem("startup-roadmap-stage");if(a)setDone(JSON.parse(a));if(b)setActiveId(b)}catch{}},[]);
  const setStage=(id:string)=>{setActiveId(id);localStorage.setItem("startup-roadmap-stage",id)};
  const toggle=(key:string,value:boolean)=>{const next={...done,[key]:value};setDone(next);localStorage.setItem("startup-roadmap-progress",JSON.stringify(next))};
  const doneCount=Object.values(done).filter(Boolean).length,total=stages.reduce((n,s)=>n+s.actions.length,0),percent=Math.round(doneCount/total*100);
  const focus=useMemo(()=>stages.find(s=>finder[s.id]==="no")??(Object.keys(finder).length===8?stages[7]:null),[finder]);
  const idx=stages.findIndex(s=>s.id===activeId);
  return <main className="min-h-screen bg-[#f3f1eb] text-[#14213d]">
    <header className="sticky top-0 z-40 border-b border-[#d9d5ca] bg-[#f3f1eb]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3.5 sm:px-7">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#14213d] text-white shadow-lg"><Rocket className="size-5"/></span><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#687085]">Founder Learning OS</p><h1 className="text-base font-extrabold sm:text-lg">AI Startup Roadmap</h1></div></div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden w-36 md:block"><div className="mb-1 flex justify-between text-[10px] font-bold text-[#687085]"><span>ACTION PROGRESS</span><span>{percent}%</span></div><Progress value={percent} className="h-1.5 bg-[#dcd8ce] [&_[data-slot=progress-indicator]]:bg-[#1da98a]"/></div>
          <Button variant="outline" size="sm" className="rounded-xl border-[#ccc7bb] bg-white/70 font-bold shadow-xs hover:bg-white" onClick={()=>setStoryOpen(true)}><BookOpen className="size-4 text-[#4f7cff]"/> Story Mode</Button>
          <Button variant="outline" size="sm" className="rounded-xl border-[#ccc7bb] bg-white/60 font-bold" onClick={()=>setFinderOpen(v=>!v)}><Gauge className="size-4"/> Focus Finder</Button>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 sm:py-7">
      <div className="overflow-hidden rounded-[28px] bg-[#14213d] text-white shadow-[0_24px_70px_rgba(20,33,61,.18)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end lg:p-8">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#91a2c7]"><Sparkles className="size-4 text-[#f6c85f]"/> Idea မှ Scale အထိ</p>
            <h2 className="max-w-4xl text-2xl font-black leading-tight sm:text-4xl">Startup ကို မှတ်သားဖို့မလိုဘဲ<br className="hidden sm:block"/> အဆင့်လိုက် နားလည်ပြီး လုပ်ကြည့်ပါ</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c7d0e4]">အဆင့် ၈ ခုကို တစ်ခါတည်းမလုပ်ပါနဲ့။ လက်ရှိ Bottleneck ကိုရှာ၊ Action ကိုစမ်း၊ Evidence ရမှ နောက် Gate ကိုဖြတ်ပါ။</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={()=>setStoryOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-[#bcd3ff] transition hover:bg-white/20 hover:text-white">
                <BookOpen className="size-4 text-[#f6c85f]"/> Ko Moe ရဲ့ AI Startup Journey ဖတ်ရန် <ArrowRight className="size-3.5"/>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center"><MiniStat n="8" label="Stages"/><MiniStat n="32" label="Actions"/><MiniStat n="1" label="Next focus"/></div>
        </div>
        <div className="border-t border-white/10 bg-white/[.04] p-3 sm:p-5">
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-8">{stages.map((s,i)=>{const Icon=s.icon,selected=s.id===activeId;return <button key={s.id} onClick={()=>setStage(s.id)} className={`group relative rounded-2xl border p-3 text-left transition-all ${selected?"border-white bg-white text-[#14213d] shadow-xl":"border-white/10 bg-white/[.04] hover:bg-white/[.09]"}`}><div className="flex items-center justify-between"><span className="text-[9px] font-black tracking-widest opacity-50">{s.number}</span><Icon className="size-4" style={{color:selected?s.color:undefined}}/></div><p className="mt-3 truncate text-[11px] font-extrabold sm:text-xs">{s.title}</p><p className={`mt-1 hidden text-[9px] font-bold tracking-wider lg:block ${selected?"text-[#687085]":"text-[#8fa0c2]"}`}>{s.phase}</p>{i<7&&<ChevronRight className="absolute -right-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-white/30 lg:block"/>}</button>})}</div>
        </div>
      </div>

      {finderOpen&&<section className="mt-5 grid gap-5 rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5 shadow-sm lg:grid-cols-[1.35fr_.65fr] lg:p-7">
        <div><div className="flex items-center gap-2"><Gauge className="size-5 text-[#8c70db]"/><h3 className="font-extrabold">60-Second Startup Focus Finder</h3></div><p className="mt-2 text-sm leading-6 text-[#687085]">အပေါ်ကနေ အစဉ်လိုက်ဖြေပါ။ ပထမဆုံး “မရသေး” က သင့်လက်ရှိ Bottleneck ဖြစ်နိုင်ပါတယ်။</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">{finderQuestions.map(([id,q],i)=><div key={id} className="flex items-center gap-3 rounded-2xl border border-[#dfdcd3] bg-white p-3"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f0eee8] text-[10px] font-black">{i+1}</span><p className="min-w-0 flex-1 text-xs font-semibold leading-5">{q}</p><div className="flex gap-1"><button aria-label="ရပြီ" onClick={()=>setFinder({...finder,[id]:"yes"})} className={`grid size-8 place-items-center rounded-lg border text-xs transition ${finder[id]==="yes"?"border-[#1da98a] bg-[#1da98a] text-white":"border-[#ddd8cc] bg-white"}`}><Check className="size-4"/></button><button aria-label="မရသေး" onClick={()=>setFinder({...finder,[id]:"no"})} className={`rounded-lg border px-2 text-[10px] font-bold transition ${finder[id]==="no"?"border-[#e8693e] bg-[#e8693e] text-white":"border-[#ddd8cc] bg-white"}`}>မရသေး</button></div></div>)}</div>
        </div>
        <div className="rounded-2xl p-5" style={{background:focus?.pale??"#f0eee8"}}><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#687085]">Your next focus</p>{focus?<><div className="mt-4 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl text-white" style={{background:focus.color}}>{focus.number}</span><div><p className="font-extrabold">{focus.title}</p><p className="text-xs text-[#687085]">{focus.mm}</p></div></div><p className="mt-4 text-sm leading-6">{focus.question}</p><Button className="mt-5 w-full rounded-xl bg-[#14213d]" onClick={()=>{setStage(focus.id);setFinderOpen(false)}}>ဒီ Stage ကိုစမယ် <ArrowRight className="size-4"/></Button></>:<p className="mt-4 text-sm leading-7 text-[#687085]">မေးခွန်းတွေဖြေပြီးရင် အခုအရင်လုပ်သင့်တဲ့ Startup Stage ကို ပြပေးပါမယ်။</p>}</div>
      </section>}

      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-3 lg:sticky lg:top-24">
          <p className="px-3 pb-2 pt-2 text-[10px] font-black uppercase tracking-[.2em] text-[#8a8f9b]">The 8-stage map</p>
          <nav className="space-y-1">{stages.map(s=>{const Icon=s.icon,selected=s.id===activeId,n=s.actions.filter((_,i)=>done[`${s.id}-${i}`]).length;return <button key={s.id} onClick={()=>setStage(s.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selected?"bg-[#14213d] text-white shadow-lg":"hover:bg-[#f0eee8]"}`}><span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{background:selected?s.color:s.pale,color:selected?"white":s.color}}><Icon className="size-4"/></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-extrabold">{s.title}</span><span className={`text-[9px] font-bold tracking-wider ${selected?"text-white/55":"text-[#9498a2]"}`}>{s.phase}</span></span><span className="text-[9px] font-black opacity-60">{n}/4</span></button>})}</nav>
          <div className="m-2 mt-4 rounded-2xl bg-[#f0eee8] p-4"><div className="flex justify-between text-xs font-extrabold"><span>Progress</span><span>{doneCount}/{total}</span></div><Progress value={percent} className="mt-3 h-2 bg-[#d8d3c7] [&_[data-slot=progress-indicator]]:bg-[#1da98a]"/><Button variant="ghost" size="sm" className="mt-2 h-8 w-full rounded-lg text-[10px] text-[#687085]" onClick={()=>{setDone({});localStorage.removeItem("startup-roadmap-progress")}}><RefreshCw className="size-3"/> Reset</Button></div>
        </aside>

        <article className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-[28px] border border-[#d9d5ca] bg-[#fbfaf7] shadow-sm">
            <div className="relative p-6 sm:p-8" style={{background:`linear-gradient(120deg,${active.pale},#fbfaf7 72%)`}}>
              <span className="absolute right-7 top-2 text-8xl font-black opacity-[.045]">{active.number}</span>
              <div className="relative flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.2em]" style={{color:active.color}}>{active.phase} · STAGE {active.number}</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{active.title}</h2><p className="mt-2 text-sm font-semibold text-[#687085]">{active.mm}</p></div><span className="rounded-full border border-[#d9d5ca] bg-white/75 px-3 py-1.5 text-[10px] font-bold">Stage {idx+1} of 8</span></div>
              <div className="relative mt-6 flex gap-3 rounded-2xl border border-white bg-white/70 p-4 shadow-sm"><Compass className="mt-0.5 size-5 shrink-0" style={{color:active.color}}/><div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#8a8f9b]">Question that matters</p><p className="mt-1 text-sm font-bold leading-6">{active.question}</p></div></div>
            </div>

            <Tabs key={active.id} defaultValue="understand" className="p-5 sm:p-8">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-[#ece9e1] p-1.5 sm:grid-cols-4 sm:gap-0">
                <TabsTrigger value="understand" className="h-11 rounded-xl text-xs">Understand</TabsTrigger>
                <TabsTrigger value="story" className="flex h-11 items-center gap-1.5 rounded-xl text-xs"><BookOpen className="size-3.5 text-[#4f7cff]"/> Story (Ko Moe)</TabsTrigger>
                <TabsTrigger value="do" className="h-11 rounded-xl text-xs">Do it</TabsTrigger>
                <TabsTrigger value="gate" className="h-11 rounded-xl text-xs">Pass the Gate</TabsTrigger>
              </TabsList>
              <TabsContent value="understand" className="mt-6">
                <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
                  <div className="rounded-2xl border border-[#dfdcd3] bg-white p-5">
                    <p className="flex items-center gap-2 text-xs font-black" style={{color:active.color}}><Lightbulb className="size-4"/> WHAT IS IT?</p>
                    <p className="mt-4 text-sm leading-7 text-[#4d566b]">{active.what}</p>
                    <div className="mt-5 rounded-xl p-4" style={{background:active.pale}}><p className="text-[9px] font-black uppercase tracking-widest" style={{color:active.color}}>Example</p><p className="mt-2 text-xs font-semibold leading-6">{active.example}</p></div>
                  </div>
                  <div className="rounded-2xl border border-[#dfdcd3] bg-white p-5">
                    <p className="flex items-center gap-2 text-xs font-black text-[#3156a3]"><ShieldCheck className="size-4"/> WHY IT MATTERS</p>
                    <ul className="mt-4 space-y-3">{active.why.map(v=><li key={v} className="flex gap-3 text-xs leading-6 text-[#4d566b]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#1da98a]"/>{v}</li>)}</ul>
                    <div className="mt-5 rounded-xl bg-[#fff0e9] p-4"><p className="text-[9px] font-black uppercase tracking-widest text-[#e8693e]">Common mistake</p><p className="mt-2 text-xs font-semibold leading-6">{active.mistake}</p></div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="story" className="mt-6">
                <div className="rounded-2xl border border-[#26304a] bg-[#0b1020] p-6 text-[#eef3ff] shadow-sm sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-block rounded-full bg-[#1b2b4a] px-3.5 py-1 text-xs font-extrabold text-[#bcd3ff]">
                      {activeStory.stageBadge}
                    </span>
                    <Button size="sm" variant="ghost" className="h-8 rounded-xl border border-[#26304a] bg-[#18223b] text-xs font-bold text-[#8ea8df] hover:bg-[#253250] hover:text-white" onClick={()=>setStoryOpen(true)}>
                      Story Mode အပြည့်ဖွင့်မည် <ArrowRight className="size-3.5"/>
                    </Button>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-white sm:text-2xl">{activeStory.title}</h3>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#c7d0e4]">
                    {activeStory.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
                  </div>
                  {activeStory.quote && (
                    <div className="mt-5 rounded-xl border-l-4 border-[#6ea8fe] bg-[#18223b] p-4 text-xs font-semibold leading-6 text-[#eef3ff]">
                      {activeStory.quote}
                    </div>
                  )}
                  {activeStory.flow && (
                    <div className="mt-5 rounded-xl border border-[#26304a] bg-[#090e1a] p-4 font-mono text-xs leading-6 text-[#8ea8df]">
                      <p className="mb-2 font-sans text-[10px] font-black uppercase tracking-widest text-[#6ea8fe]">Operating Workflow</p>
                      <div className="space-y-1">
                        {activeStory.flow.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[#4f7cff]">{idx + 1 < activeStory.flow!.length ? "↓" : "✓"}</span>
                            <span className="font-bold text-white">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#245b41] bg-[#123626] p-4 text-xs font-semibold leading-relaxed text-[#a3f0c4]">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#f6c85f]"/>
                    <div><span className="font-black text-white">💡 Lesson: </span>{activeStory.lesson}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="do" className="mt-6"><div className="space-y-3">{active.actions.map((a,i)=>{const key=`${active.id}-${i}`,checked=!!done[key];return <label key={a.title} className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${checked?"border-transparent bg-[#eeeee9] opacity-65":"border-[#dfdcd3] bg-white hover:shadow-sm"}`}><Checkbox checked={checked} onCheckedChange={v=>toggle(key,v===true)} className="mt-1 size-5"/><span className="grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black" style={{background:active.pale,color:active.color}}>{i+1}</span><span><span className={`block text-sm font-extrabold ${checked?"line-through":""}`}>{a.title}</span><span className="mt-1 block text-xs leading-6 text-[#687085]">{a.detail}</span></span></label>})}</div></TabsContent>
              <TabsContent value="gate" className="mt-6"><div className="grid gap-5 xl:grid-cols-[1fr_.7fr]"><div className="rounded-2xl border border-[#dfdcd3] bg-white p-5"><p className="flex items-center gap-2 text-xs font-black"><Scale className="size-4" style={{color:active.color}}/> BEFORE MOVING ON</p><div className="mt-4 space-y-3">{active.gate.map(g=><div key={g} className="flex gap-3 rounded-xl bg-[#f7f6f2] p-3 text-xs font-semibold leading-5"><Check className="mt-0.5 size-4 shrink-0 text-[#1da98a]"/>{g}</div>)}</div></div><div className="rounded-2xl p-5" style={{background:active.pale}}><p className="text-[10px] font-black uppercase tracking-[.18em]" style={{color:active.color}}>Evidence over opinion</p><p className="mt-3 text-sm font-extrabold leading-6">Gate ကို Evidence မရှိဘဲ မဖြတ်ပါနဲ့။ မသေချာရင် နောက် Stage မတက်ဘဲ အသေးစား Experiment ပြန်လုပ်ပါ။</p><Button className="mt-5 w-full rounded-xl bg-[#14213d]" onClick={()=>setStage(stages[(idx+1)%8].id)}>နောက် Stage ကိုကြည့်မယ် <ArrowRight className="size-4"/></Button></div></div></TabsContent>
            </Tabs>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#14213d] text-white"><Bot className="size-5"/></span><div><p className="text-sm font-extrabold">AI + Human Team</p><p className="text-[10px] text-[#687085]">Speed + judgment</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Role title="AI က ကူညီမယ်" values={active.ai} color="#8c70db"/><Role title="လူက တာဝန်ယူမယ်" values={active.human} color="#1da98a"/></div></div>
            <div className="rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl" style={{background:active.pale,color:active.color}}><Gauge className="size-5"/></span><div><p className="text-sm font-extrabold">Startup Health Metrics</p><p className="text-[10px] text-[#687085]">Activity မဟုတ်ဘဲ Evidence ကိုတိုင်းပါ</p></div></div><div className="mt-5 grid grid-cols-2 gap-2">{active.kpis.map(k=><div key={k} className="rounded-xl border border-[#dfdcd3] bg-white p-3"><span className="mb-2 block h-1 w-8 rounded-full" style={{background:active.color}}/><p className="text-xs font-extrabold">{k}</p></div>)}</div></div>
          </section>

          <section className="rounded-[24px] bg-[#14213d] p-6 text-white">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#91a2c7]">The founder rule</p><p className="mt-2 max-w-3xl text-lg font-black leading-7">Problem ကို သက်သေပြ၊ အနည်းဆုံး Offer ကို ရောင်း၊ Result ကို ကိုယ်တိုင်ပေး၊ ပြီးမှ System နဲ့ Scale လုပ်ပါ။</p></div><Button className="shrink-0 rounded-xl bg-white text-[#14213d] hover:bg-[#f3f1eb]" onClick={()=>setStage(stages[(idx+1)%8].id)}>Next stage <ArrowRight className="size-4"/></Button></div>
          </section>

          <section className="rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-extrabold">30-Day Quick Start</p><p className="mt-1 text-xs text-[#687085]">ပထမဆုံး Customer Evidence ရဖို့ ရိုးရှင်းတဲ့လမ်းကြောင်း</p></div><Workflow className="size-5 text-[#8c70db]"/></div><div className="mt-5 grid gap-3 md:grid-cols-4"><Week n="1" title="Validate" body="Customer 10 ယောက်နဲ့ Problem Interview"/><Week n="2" title="Offer" body="Paid Pilot နဲ့ Result/Scope သတ်မှတ်"/><Week n="3" title="Sell" body="20 Prospects၊ Meetings၊ Offer Decisions"/><Week n="4" title="Deliver" body="Quick Win၊ Feedback၊ SOP Draft"/></div></section>
        </article>
      </div>
    </section>

    <StoryModal
      isOpen={storyOpen}
      onClose={()=>setStoryOpen(false)}
      onSelectStage={(id)=>setStage(id)}
      initialStageId={activeId}
    />
  </main>
}

function MiniStat({n,label}:{n:string;label:string}){return <div className="rounded-xl border border-white/10 bg-white/[.06] px-3 py-3"><p className="text-xl font-black">{n}</p><p className="text-[9px] font-bold uppercase tracking-wider text-[#91a2c7]">{label}</p></div>}
function Role({title,values,color}:{title:string;values:string[];color:string}){return <div><p className="text-[10px] font-black" style={{color}}>{title}</p><ul className="mt-3 space-y-2">{values.map(v=><li key={v} className="flex gap-2 text-[11px] leading-5 text-[#687085]"><span className="mt-1 grid size-3.5 shrink-0 place-items-center rounded-full text-white" style={{background:color}}><Check className="size-2"/></span>{v}</li>)}</ul></div>}
function Week({n,title,body}:{n:string;title:string;body:string}){return <div className="rounded-2xl border border-[#dfdcd3] bg-white p-4"><p className="text-[9px] font-black uppercase tracking-widest text-[#8c70db]">Week {n}</p><p className="mt-2 text-sm font-extrabold">{title}</p><p className="mt-2 text-[11px] leading-5 text-[#687085]">{body}</p></div>}
