import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, Bot, Boxes, Check, CheckCircle2, ChevronRight, CircleDollarSign,
  ClipboardCheck, CloudCheck, CloudOff, Compass, ExternalLink, Gauge, Handshake, Headphones, Layers, Lightbulb, Loader2,
  Megaphone, RefreshCw, Rocket, Scale, Search, Settings2, ShieldCheck, Sparkles, Target, Users, Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeminiGemIcon } from "@/components/GeminiGemIcon";
import { StartHereIntro } from "@/components/StartHereIntro";
import { PodcastPlayer } from "@/components/PodcastPlayer";
import { STORY_STAGES } from "@/data/storyData";

// Lazy-loaded modal components to reduce initial bundle size and boost LCP/FCP performance
const StoryModal = lazy(() => import("@/components/StoryModal"));
const WelcomeModal = lazy(() => import("@/components/WelcomeModal"));
const AuthModal = lazy(() => import("@/components/AuthModal"));

import { useAuth } from "@/context/AuthContext";
import {
  saveUserProgress,
  subscribeToUserProgress,
  getLocalLastSavedTimestamp,
  type SyncStatus,
} from "@/lib/firestoreSync";

export const GEMINI_ASSISTANT_URL = "https://gemini.google.com/gem/10aOjpzRICEEWbY6Z3ICDQRr88mlg3Lc1?usp=sharing";

type Stage = {
  id: string; number: string; title: string; mm: string; phase: string; color: string; pale: string;
  icon: typeof Search; question: string; what: string; why: string[]; actions: {title:string; detail:string}[];
  gate: string[]; kpis: string[]; ai: string[]; human: string[]; mistake: string; example: string;
};

const stages: Stage[] = [
  {
    id: "problem", number: "01", title: "Problem Validation", mm: "ဖြေရှင်းသင့်သော ပြဿနာ ဟုတ်မဟုတ် သက်သေပြခြင်း", phase: "DISCOVER", color: "#e8693e", pale: "#fff0e9", icon: Search,
    question: "လူတွေ တကယ်ကြုံနေရပြီး ဖြေရှင်းဖို့ အရေးကြီးတဲ့ ပြဿနာကို သက်သေပြထားပြီလား?",
    what: "ကိုယ့်စိတ်ကူးကိုသာ သဘောကျနေခြင်းမဟုတ်ဘဲ Customer ၏ တကယ့်အပြုအမူ၊ လက်ရှိကြုံတွေ့နေရသော အခက်အခဲနှင့် ငွေပေးစမ်းသပ်လိုမှုဖြင့် ပြဿနာတကယ်ရှိကြောင်း သက်သေပြခြင်း ဖြစ်ပါသည်။",
    why: [
      "Customer မလိုချင်သော Product ကို အချိန်ကုန်ခံပြီး မတည်ဆောက်မိစေရန် ကာကွယ်ပေးပါသည်။",
      "ပြဿနာ၏ မကြာခဏဖြစ်ပွားမှု၊ ထိခိုက်မှုနှင့် အရေးတကြီး လိုအပ်မှုကို တိကျစွာ နားလည်စေပါသည်။",
      "Customer ကိုယ်တိုင်ပြောသော စကားလုံးများသည် နောက်ပိုင်း Marketing နှင့် Sales အတွက် အလွန်ထိရောက်ပါသည်။"
    ],
    actions: [
      { title: "Customer ၁၀ ဦး ရွေးချယ်ပါ", detail: "ဖြေရှင်းနည်း မပြောမီ သင် အဓိက ကူညီလိုသော Customer အုပ်စုကို သတ်မှတ်ပါ။" },
      { title: "ပြဿနာအကြောင်း မေးမြန်းပါ", detail: "လက်ရှိ ဖြေရှင်းနည်း၊ နောက်ဆုံး ကြုံခဲ့ရချိန်၊ ဆုံးရှုံးမှုနှင့် အခက်အခဲများကို မေးမြန်းပါ။" },
      { title: "တူညီသော အချက်များကို ရှာဖွေပါ", detail: "ထပ်တလဲလဲ တွေ့ရသော အခက်အခဲ၊ အစပျိုးရခြင်း အကြောင်းရင်း၊ ကုန်ကျစရိတ်နှင့် စကားလုံးများကို စုစည်းပါ။" },
      { title: "ငွေပေးစမ်းသပ်လိုမှုကို စစ်ဆေးပါ", detail: "အနည်းဆုံး ဖြေရှင်းပေးမည့် စမ်းသပ်မှု (Paid Pilot) ကို စိတ်ဝင်စားမှု ရှိမရှိ စမ်းသပ်ပါ။" }
    ],
    gate: [
      "အနည်းဆုံး Customer ၁၀ ဦးနှင့် စကားပြောပြီးဖြစ်ခြင်း",
      "အလားတူ နာကျင်မှုပြဿနာကို အများစုက အတည်ပြုပြောဆိုခြင်း",
      "လက်ရှိတွင် အချိန် သို့မဟုတ် ငွေကုန်ခံပြီး ဖြေရှင်းနေရမှုရှိခြင်း",
      "Paid Pilot အတွက် လက်တွေ့စမ်းသပ်လိုသည့် အပြုသဘော လက္ခဏာရှိခြင်း"
    ],
    kpis: ["Customer Interviews", "Pain Frequency", "Current Cost", "Payment Signal"],
    ai: ["Interview မေးခွန်းများ ရေးဆွဲခြင်း", "မှတ်စုများမှ အဓိကအချက်များ ခွဲထုတ်ခြင်း", "ပြိုင်ဘက်များ စျေးကွက်လေ့လာခြင်း"],
    human: ["လူချင်း တိုက်ရိုက်စကားပြောခြင်း", "ခံစားချက်နှင့် အမူအရာကို နားလည်ခြင်း", "လက်တွေ့သက်သေကို အတည်ပြုခြင်း"],
    mistake: "AI ထုတ်ပေးသည့် Persona ကိုသာ အားကိုးပြီး Customer အစစ်အမှန်နှင့် စကားမပြောဘဲ စတင်ခြင်း။",
    example: "“AI App သုံးချင်ပါသလား?” ဟု မမေးဘဲ “ပြီးခဲ့သည့်အပတ်က ဤအလုပ်ကို လုပ်ဆောင်ရာတွင် မည်သည့် အခက်အခဲများ ကြုံခဲ့ရပါသလဲ?” ဟု မေးပါ။"
  },
  {
    id: "customer", number: "02", title: "Customer & Positioning", mm: "ပထမဆုံး ကူညီမည့် Customer ကို ရွေးချယ်ခြင်း", phase: "FOCUS", color: "#d79a24", pale: "#fff8df", icon: Target,
    question: "ဘယ်သူ့ရဲ့ ဘယ်ပြဿနာကို အရင်ဆုံး ဖြေရှင်းပေးမလဲ?",
    what: "လူတိုင်းအတွက် မလုပ်ဘဲ ပြဿနာ၊ ဘတ်ဂျက်၊ ဆုံးဖြတ်ပိုင်ခွင့်နှင့် ဆက်သွယ်ရ လွယ်ကူမှု တူညီသော ကနဦး Customer အုပ်စုတစ်ခုတည်းကို ရွေးချယ်သတ်မှတ်ခြင်း ဖြစ်ပါသည်။",
    why: [
      "သတင်းစကားတစ်ခုသည် သတ်မှတ်ထားသော ဖောက်သည်တစ်မျိုးတည်းအတွက် ပိုမိုထိရောက်စေပါသည်။",
      "တည်ဆောက်ရမည့် နယ်ပယ်နှင့် ရောင်းချရမည့် အချိန်ကို သိသာစွာ လျှော့ချပေးနိုင်ပါသည်။",
      "Customer များ ရှိသောနေရာကို ရှာဖွေပြီး ဆက်သွယ်ရ ပိုမိုလွယ်ကူစေပါသည်။"
    ],
    actions: [
      { title: "ကနဦး Customer အုပ်စုကို ရွေးပါ", detail: "လုပ်ငန်းအမျိုးအစား၊ ရာထူး၊ ကုမ္ပဏီအရွယ်အစား သို့မဟုတ် အခြေအနေတစ်ခုဖြင့် ကျဉ်းမြောင်းစွာ သတ်မှတ်ပါ။" },
      { title: "အသုံးပြုသူနှင့် ငွေပေးသူကို ခွဲခြားပါ", detail: "တကယ် အသုံးပြုမည့်သူ (User) နှင့် ငွေပေးဆုံးဖြတ်မည့်သူ (Buyer) ကို ရှင်းလင်းစွာ သိရှိပါစေ။" },
      { title: "Positioning စာကြောင်း ရေးသားပါ", detail: "“ကျွန်ုပ်တို့သည် [Customer] များ [Pain] ကို ဖြေရှင်းပြီး [Result] ရရှိစေရန် [Approach] ဖြင့် ကူညီပေးသည်။”" },
      { title: "၅ စက္ကန့် စမ်းသပ်မှု ပြုလုပ်ပါ", detail: "မိတ်ဆွေတစ်ဦးကို ဖတ်ပြပြီး ဘယ်သူ့အတွက် ဘာလုပ်ပေးတာလဲဆိုတာ ချက်ချင်း ပြန်ပြောနိုင်မလား စစ်ဆေးပါ။" }
    ],
    gate: [
      "Customer အုပ်စုတစ်ခုတည်းကို တိကျစွာ ရွေးချယ်ထားခြင်း",
      "Buyer နှင့် User ၏ ကွာခြားချက်ကို ရှင်းလင်းစွာ သိရှိခြင်း",
      "ပြဿနာနှင့် ရလဒ်ကို စာတစ်ကြောင်းတည်းဖြင့် ရှင်းပြနိုင်ခြင်း",
      "Customer များထံ တိုက်ရိုက်ရောက်ရှိနိုင်သည့် လမ်းကြောင်း (Channel) ရှိခြင်း"
    ],
    kpis: ["Segment Clarity", "Buyer Access", "Problem Relevance", "Message Recall"],
    ai: ["Customer Segment များကို နှိုင်းယှဉ်လေ့လာခြင်း", "Positioning စာကြောင်း ပုံစံအမျိုးမျိုး ရေးသားခြင်း", "Persona မူကြမ်း ရေးဆွဲခြင်း"],
    human: ["Niche စျေးကွက်ကို ရွေးချယ်ဆုံးဖြတ်ခြင်း", "Customer နှင့် တိုက်ရိုက်ချိတ်ဆက်ခြင်း", "Brand ၏ ရပ်တည်ချက်ကို သတ်မှတ်ခြင်း"],
    mistake: "“လုပ်ငန်းရှင်အားလုံး” သို့မဟုတ် “AI စိတ်ဝင်စားသူအားလုံး” ကို ပစ်မှတ်ထားခြင်း။",
    example: "“SME အားလုံးအတွက်” ဟု ပြောမည့်အစား “Customer Message ပြန်ရန် အချိန်မလောက်သော မြန်မာ အထည်အရောင်းဆိုင်ပိုင်ရှင်များ” ဟု ကျဉ်းမြောင်းစွာ သတ်မှတ်ပါ။"
  },
  {
    id: "offer", number: "03", title: "Offer & MVP", mm: "ငွေပေးဝယ်ယူရကျိုးနပ်သော အနည်းဆုံးဖြေရှင်းချက်", phase: "CREATE", color: "#8c70db", pale: "#f2edff", icon: Boxes,
    question: "Customer ငွေပေးချင်လောက်အောင် ရလဒ်ရှင်းတဲ့ Offer ရှိပြီလား?",
    what: "MVP ဆိုသည်မှာ Feature နည်းသော Software တစ်ခုတည်း မဟုတ်ပါ။ Customer ၏ အရေးကြီးဆုံး လိုအပ်ချက်ကို အမြန်ဆုံးနှင့် ကုန်ကျစရိတ် အနည်းဆုံးဖြင့် စမ်းသပ်ပေးနိုင်သော ဖြေရှင်းချက် ဖြစ်ပါသည်။",
    why: [
      "ချီးကျူးစကားထက် Customer ၏ ငွေပေးချေမှုက အကောင်းဆုံး သက်သေပြချက် ဖြစ်ပါသည်။",
      "Customer နှင့် လက်တွဲလုပ်ဆောင်ရင်း တကယ့် Product လိုအပ်ချက်ကို သင်ယူနိုင်ပါသည်။",
      "Software အကြီးကြီး မတည်ဆောက်မီ ဝန်ဆောင်မှုပေးနိုင်မှုနှင့် စီးပွားရေးတွက်ခြေကို စမ်းသပ်နိုင်ပါသည်။"
    ],
    actions: [
      { title: "လိုချင်သော ရလဒ် (Dream Outcome) သတ်မှတ်ပါ", detail: "Feature များအကြောင်း မဟုတ်ဘဲ Customer ရရှိသွားမည့် အကျိုးရလဒ်ကို အဓိကထား ရေးသားပါ။" },
      { title: "အသေးငယ်ဆုံး ပေးပို့နည်းကို ရွေးပါ", detail: "ဝန်ဆောင်မှု၊ အလုပ်ရုံဆွေးနွေးပွဲ သို့မဟုတ် လက်တွေ့ကူညီပေးသော Pilot Project တစ်ခုဖြင့် စတင်ပါ။" },
      { title: "အတိုင်းအတာနှင့် အချိန်ကာလကို သတ်မှတ်ပါ", detail: "ပါဝင်သောအရာ၊ မပါဝင်သောအရာ၊ ပထမအပတ်တွင် ရရှိမည့်အရာနှင့် အပြီးသတ် သတ်မှတ်ချက်ကို ရှင်းလင်းစွာ ရေးပါ။" },
      { title: "ဈေးနှုန်းနှင့် ကမ်းလှမ်းချက်ကို စမ်းသပ်ပါ", detail: "Customer ၃ ဦးကို တိကျသော Offer ပေးပြီး ဝယ်ယူစမ်းသပ်ရန် ကမ်းလှမ်းပါ။" }
    ],
    gate: [
      "Customer ရရှိမည့် ရလဒ်တစ်ခု ရှင်းလင်းစွာ သတ်မှတ်ထားခြင်း",
      "ပါဝင်မည့် Scope နှင့် အချိန်ကာလ ရှင်းလင်းခြင်း",
      "ငွေပေးဝယ်ယူနိုင်သော Paid Pilot Offer ရှိခြင်း",
      "အနည်းဆုံး Customer တစ်ဦးထံမှ ငွေပေးချေမှု သို့မဟုတ် ခိုင်မာသော ကတိကဝတ် ရရှိခြင်း"
    ],
    kpis: ["Pilot Offers Made", "Paid Pilot Signups", "Time to Deliver", "Expected Value"],
    ai: ["Offer မူကြမ်း အမျိုးမျိုး ရေးသားခြင်း", "Prototype ပြုလုပ်ရာတွင် အထောက်အကူယူခြင်း", "Proposal စာလွှာ မူကြမ်း ရေးသားခြင်း"],
    human: ["လုပ်ဆောင်မည့် Scope ကို အတည်ပြုခြင်း", "သင့်တော်သော ဈေးနှုန်း သတ်မှတ်ခြင်း", "ကတိကဝတ်နှင့် အာမခံချက် ပေးခြင်း"],
    mistake: "Customer တစ်ဦးမျှ မရှိသေးဘဲ Platform၊ Mobile App သို့မဟုတ် SaaS အကြီးကြီး တည်ဆောက်ခြင်း။",
    example: "Software မရေးမီ “လုပ်ငန်းသုံး AI Chatbot ရက် ၃၀ စမ်းသပ်ဝန်ဆောင်မှု” ကို အရင်ရောင်းချပြီး လက်တွေ့လိုအပ်ချက်မှ Software စတင်ပါ။"
  },
  {
    id: "leads", number: "04", title: "Lead Generation", mm: "ဖြေရှင်းချက်လိုအပ်သူများထံ ရောက်ရှိခြင်း", phase: "ATTRACT", color: "#ef7d32", pale: "#fff1e3", icon: Megaphone,
    question: "သင့် Offer လိုအပ်သူတွေကို အပတ်စဉ် ပုံမှန်ရောက်ရှိနိုင်ပြီလား?",
    what: "Follower သို့မဟုတ် View များရုံသက်သက် မဟုတ်ဘဲ ပြဿနာရှိပြီး ဝန်ဆောင်မှုနှင့် ကိုက်ညီသော လူများထံမှ စကားစမြည် ပြောဆိုမှုများ ပုံမှန်ရရှိစေခြင်း ဖြစ်ပါသည်။",
    why: [
      "မည်မျှပင် ကောင်းမွန်သော Offer ရှိစေကာမူ လူမသိပါက အရောင်းဖြစ်ပေါ်လာမည် မဟုတ်ပါ။",
      "အသုံးဝင်သော အကြောင်းအရာများသည် Customer ၏ ယုံကြည်မှုကို တည်ဆောက်ပေးပါသည်။",
      "Lead ရရှိသော လမ်းကြောင်းကို တိုင်းတာခြင်းဖြင့် စီးပွားရေး တိုးတက်မှုကို ကြိုတင်ခန့်မှန်းနိုင်ပါသည်။"
    ],
    actions: [
      { title: "Customer သိရှိမှုအဆင့် (Awareness Map) ခွဲပါ", detail: "ပြဿနာကို လုံးဝမသိသေးသူမှ စတင်ပြီး အဖြေရှာနေသူအထိ ခွဲခြားနားလည်ပါ။" },
      { title: "အဓိက ချန်နယ် ၂ ခု ရွေးချယ်ပါ", detail: "Founder Content၊ တိုက်ရိုက်မိတ်ဆက်ခြင်း သို့မဟုတ် မိတ်ဆွေညွှန်းဆိုခြင်း စသည့် Channel ၂ ခုဖြင့်သာ စတင်ပါ။" },
      { title: "အသုံးဝင်သော ကမ်းလှမ်းချက် (Useful CTA) ဖန်တီးပါ", detail: "Checklist၊ အခမဲ့စစ်ဆေးပေးမှု သို့မဟုတ် တိုင်ပင်ဆွေးနွေးမှုတစ်ခု ပေးအပ်ပါ။" },
      { title: "အပတ်စဉ် ပုံမှန်လုပ်ဆောင်မှု သတ်မှတ်ပါ", detail: "Content တင်ခြင်း၊ ဆက်သွယ်ခြင်း၊ Follow-up ပြုလုပ်ခြင်းတို့ကို အပတ်စဉ် ပုံမှန် စာရင်းစစ်ပါ။" }
    ],
    gate: [
      "ကိုက်ညီသော စိတ်ဝင်စားသူ (Qualified Lead) စံနှုန်း သတ်မှတ်ထားခြင်း",
      "အဓိက Channel ၁–၂ ခုကို ပုံမှန်အသုံးပြုနေခြင်း",
      "ရှင်းလင်းသော Call to Action (CTA) တစ်ခု ရှိခြင်း",
      "အပတ်စဉ် Lead အရေအတွက်ကို တိုင်းတာစောင့်ကြည့်နေခြင်း"
    ],
    kpis: ["Qualified Leads", "Reply Rate", "Meeting Booking Rate", "Cost Per Lead"],
    ai: ["Content နှင့် အကြောင်းအရာ မူကြမ်း ရေးသားခြင်း", "Content များကို ပုံစံအမျိုးမျိုး ပြောင်းလဲဖန်တီးခြင်း", "Lead များကို စိစစ်ခွဲခြားခြင်း"],
    human: ["ကိုယ်ပိုင် အတွေ့အကြုံနှင့် အမြင်ကို ထည့်သွင်းခြင်း", "အချက်အလက် မှန်ကန်မှုကို စစ်ဆေးခြင်း", "Customer များနှင့် ရင်းနှီးမှု တည်ဆောက်ခြင်း"],
    mistake: "AI ဖြင့် Content အများကြီး တင်နေသော်လည်း ကိုယ်ပိုင်အမြင်နှင့် တိကျသော CTA မပါဝင်ခြင်း။",
    example: "“AI သင်တန်းဖွင့်သည်” ဟု ကြော်ငြာမည့်အစား “တစ်ပတ်အတွင်း အချိန်ကုန်သက်သာစေမည့် ၅ မိနစ် စစ်ဆေးရန် Checklist” ကို အခမဲ့ ပေးအပ်ပါ။"
  },
  {
    id: "sales", number: "05", title: "Sales", mm: "ယုံကြည်စိတ်ချစွာ ဝယ်ယူဆုံးဖြတ်နိုင်အောင် ကူညီခြင်း", phase: "CONVERT", color: "#b75fbd", pale: "#faedfb", icon: CircleDollarSign,
    question: "Customer ရဲ့ လိုအပ်ချက်ကို နားလည်ပြီး မှန်ကန်တဲ့ ဝယ်ယူဆုံးဖြတ်ချက် ချနိုင်အောင် ကူညီနိုင်ပြီလား?",
    what: "ဖိအားပေး ရောင်းချခြင်း မဟုတ်ပါ။ Customer ၏ လက်ရှိအခြေအနေ၊ လိုချင်သော ရလဒ်၊ ထိခိုက်မှုနှင့် Offer ကို ရှင်းလင်းစွာ နားလည်စေပြီး မှန်ကန်စွာ ဆုံးဖြတ်နိုင်အောင် ကူညီပေးခြင်း ဖြစ်ပါသည်။",
    why: [
      "Customer ဘာကြောင့် ဝယ်ယူသည် သို့မဟုတ် မဝယ်ယူသည်ကို Founder ကိုယ်တိုင် သင်ယူနိုင်ပါသည်။",
      "ကိုက်ညီမှုမရှိသော Customer (Wrong-fit) များကို ကြိုတင်ရှောင်ရှားနိုင်ပါသည်။",
      "မျှော်လင့်ချက် မှန်ကန်သွားသည့်အတွက် ဝန်ဆောင်မှုပေးရာတွင် ပိုမိုချောမွေ့စေပါသည်။"
    ],
    actions: [
      { title: "မေးခွန်းများ ကြိုတင်ပြင်ဆင်ပါ (Discovery Questions)", detail: "လက်ရှိအခြေအနေ၊ လိုချင်သောရလဒ်၊ အခက်အခဲ၊ လက်ရှိဖြေရှင်းနည်းနှင့် ဆုံးဖြတ်ချက်ချမည့်ပုံစံကို မေးမြန်းပါ။" },
      { title: "ရောင်းချခြင်းမပြုမီ သေချာနားထောင်ပါ", detail: "Customer ပြောပြသော အခက်အခဲကို သူတို့၏ စကားလုံးများဖြင့် ပြန်လည်အတည်ပြုပါ။" },
      { title: "ကိုက်ညီသော ကမ်းလှမ်းချက်ကို ရှင်းပြပါ", detail: "Feature အားလုံး မဟုတ်ဘဲ သူတို့၏ ပြဿနာနှင့် တိုက်ရိုက်သက်ဆိုင်သော ရလဒ်၊ သက်သေ၊ အချိန်နှင့် စိုက်ထုတ်ရမှုကို ရှင်းပြပါ။" },
      { title: "ဆုံးဖြတ်ချက် အကြောင်းရင်းကို မှတ်တမ်းတင်ပါ", detail: "ဝယ်ယူခြင်း၊ ငြင်းပယ်ခြင်း သို့မဟုတ် နောက်မှဝယ်ယူမည့် အကြောင်းရင်းများကို မှတ်စုထဲ ရေးမှတ်ပါ။" }
    ],
    gate: [
      "မေးခွန်းများဖြင့် လေ့လာသည့် စနစ် (Discovery Process) ရှိခြင်း",
      "သင့်တော်သော Customer ကို ရွေးချယ်သည့် စံနှုန်းရှိခြင်း",
      "Offer ကို ဈေးနှုန်း၊ အတိုင်းအတာ၊ အချိန်ကာလဖြင့် ရှင်းပြနိုင်ခြင်း",
      "ဝယ်ယူမှုနှုန်း (Close Rate) နှင့် အကြောင်းရင်းများကို တိုင်းတာခြင်း"
    ],
    kpis: ["Discovery Call Rate", "Close Rate", "Sales Cycle Length", "Average Deal Value"],
    ai: ["Customer အကြောင်း ကြိုတင်လေ့လာခြင်း", "အစည်းအဝေး မှတ်စု အကျဉ်းချုပ်ခြင်း", "Follow-up စာလွှာများ မူကြမ်းရေးဆွဲခြင်း"],
    human: ["ဂရုတစိုက် နားထောင်ပေးခြင်း", "ဈေးနှုန်းနှင့် အခြေအနေ ညှိနှိုင်းခြင်း", "နောက်ဆုံး ဆုံးဖြတ်ချက်ကို တာဝန်ယူကတိပြုခြင်း"],
    mistake: "Customer ၏ လိုအပ်ချက်ကို နားမထောင်ဘဲ Product အကြောင်းကိုသာ အတင်းရှင်းပြခြင်း။",
    example: "“ကျွန်တော့် Software မှာ Feature ၂၀ ပါသည်” ဟု ပြောမည့်အစား “လာမည့် ၃ လအတွင်း သင့်လုပ်ငန်းတွင် မည်သည့် ရလဒ်ကို အဓိက ရယူလိုပါသလဲ?” ဟု မေးပါ။"
  },
  {
    id: "delivery", number: "06", title: "Delivery & Success", mm: "ကတိပေးထားသော ရလဒ်ကို အမှန်တကယ် ပေးအပ်ခြင်း", phase: "PROVE", color: "#1da98a", pale: "#e8fbf5", icon: ClipboardCheck,
    question: "ကတိပေးထားတဲ့ ရလဒ်ကို အချိန်မီ၊ အရည်အသွေး ကောင်းကောင်း ပေးနိုင်ပြီလား?",
    what: "Product သို့မဟုတ် ဝန်ဆောင်မှု ပို့ပေးရုံဖြင့် အလုပ်မပြီးသေးပါ။ စနစ်တကျ စတင်စေခြင်း (Onboarding)၊ အမြန်ဆုံး ရလဒ်တစ်ခု ခံစားရစေခြင်း (Quick Win) နှင့် အရည်အသွေး စစ်ဆေးမှုများဖြင့် Customer ကို အမှန်တကယ် အောင်မြင်စေခြင်း ဖြစ်ပါသည်။",
    why: [
      "အရောင်းတွင် ပေးခဲ့သော ကတိကို လက်တွေ့ရလဒ်အဖြစ် သက်သေပြနိုင်ပါသည်။",
      "ပထမဆုံး ရလဒ်အမြန်ရရှိခြင်းက Customer ၏ စိတ်အားထက်သန်မှုကို တိုးတက်စေပါသည်။",
      "ရလဒ်ကောင်းများသည် တကယ့် Case Study များ၊ မိတ်ဆက်ပေးမှုများနှင့် Product တိုးတက်မှုကို ဖြစ်စေပါသည်။"
    ],
    actions: [
      { title: "မျှော်လင့်ချက်များကို ကြိုတင်ညှိနှိုင်းပါ", detail: "ပန်းတိုင်၊ လုပ်ဆောင်မည့် အတိုင်းအတာ၊ အချိန်ဇယား၊ တာဝန်များနှင့် ပြီးစီးမှု သတ်မှတ်ချက်ကို အတည်ပြုပါ။" },
      { title: "ပထမအပတ်အတွင်း Quick Win ရလဒ်တစ်ခု ပေးပါ", detail: "ပထမ ၇ ရက်အတွင်း Customer မျက်မြင်တွေ့နိုင်သော အကျိုးရလဒ်တစ်ခုကို အမြန်ဆုံး ဖန်တီးပေးပါ။" },
      { title: "အဆင့်လိုက် တိုးတက်မှုကို စစ်ဆေးပါ", detail: "သတ်မှတ်ရက်တိုင်းတွင် လုပ်ငန်းတိုးတက်မှု၊ အခက်အခဲနှင့် စိန်ခေါ်မှုများကို အတူတကွ သုံးသပ်ပါ။" },
      { title: "ရရှိလာသော ရလဒ်ကို တိုင်းတာပါ", detail: "မတိုင်မီနှင့် နောက်ပိုင်း ကွာခြားချက်၊ သက်သာသွားသော အချိန်နှင့် စီးပွားရေး တိုးတက်မှုကို မှတ်တမ်းတင်ပါ။" }
    ],
    gate: [
      "ရှင်းလင်းသော Onboarding စနစ် ရှိခြင်း",
      "ပထမဆုံး တန်ဖိုးခံစားရသည့်အချိန် (Time to Value) ကို သိရှိခြင်း",
      "အဆင့်လိုက် တိုးတက်မှုနှင့် စိန်ခေါ်မှုများကို စစ်ဆေးသည့် စနစ်ရှိခြင်း",
      "Customer ရရှိသွားသော ရလဒ်ကို သက်သေအထောက်အထားဖြင့် ပြသနိုင်ခြင်း"
    ],
    kpis: ["Time to First Value", "Completion Rate", "Outcome Achievement Rate", "Customer Satisfaction (CSAT)"],
    ai: ["Onboarding လမ်းညွှန်များ ပြုစုခြင်း", "တိုးတက်မှု အကျဉ်းချုပ် အစီရင်ခံစာ ရေးသားခြင်း", "Customer အမေးအဖြေများကို စိစစ်ပေးခြင်း"],
    human: ["တိုက်ရိုက် အကြံဉာဏ်ပေးခြင်း", "အရည်အသွေးကို ကိုယ်တိုင် စစ်ဆေးအတည်ပြုခြင်း", "စာနာနားလည်မှုဖြင့် အခက်အခဲ ဖြေရှင်းပေးခြင်း"],
    mistake: "ဖိုင်ပို့ပေးလိုက်ရုံ သို့မဟုတ် သင်တန်းပြီးသွားရုံဖြင့် Customer Success ရရှိပြီဟု ထင်မှတ်ခြင်း။",
    example: "သင်တန်းပြီးမှ အလုပ်မစဘဲ ပထမဆုံး အပတ်မှာပင် အမှန်တကယ် အသုံးပြုနိုင်မည့် AI Gem တစ်ခုကို အတူတကွ လက်တွေ့ ဖန်တီးပေးပါ။"
  },
  {
    id: "retention", number: "07", title: "Retention & Referral", mm: "ဆက်လက်သုံးစွဲ၊ ပြန်လည်ဝယ်ယူ၊ မိတ်ဆက်ပေးစေခြင်း", phase: "GROW", color: "#247ebf", pale: "#eaf5ff", icon: Handshake,
    question: "ရလဒ်ရပြီးတဲ့ Customer က ဆက်သုံး၊ ပြန်ဝယ် ဒါမှမဟုတ် တခြားသူကို မိတ်ဆက်ပေးနေပြီလား?",
    what: "ပထမအကြိမ် ရောင်းချပြီးနောက် Customer ၏ ရေရှည်အောင်မြင်မှုကို ကူညီပေးပြီး ဆက်လက်သုံးစွဲခြင်း (Renewal)၊ ထပ်မံဝယ်ယူခြင်း၊ ထောက်ခံချက်နှင့် မိတ်ဆွေများထံ ညွှန်းဆိုပေးခြင်းများ ဖြစ်ပေါ်လာစေခြင်း ဖြစ်ပါသည်။",
    why: [
      "ရှိပြီးသား Customer ၏ ယုံကြည်မှုကို အခြေခံပြီး စီးပွားရေးကို တိုးတက်အောင် လုပ်ဆောင်နိုင်ပါသည်။",
      "ပုံမှန်ဝင်ငွေ (Recurring Revenue) သည် လုပ်ငန်း၏ ငွေကြေးလည်ပတ်မှုကို တည်ငြိမ်စေပါသည်။",
      "မိတ်ဆက်ပေးမှု (Referral) သည် ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် အခိုင်မာဆုံး ဖောက်သည်ရရှိနည်း ဖြစ်ပါသည်။"
    ],
    actions: [
      { title: "အောင်မြင်မှု သုံးသပ်ချက် ပြုလုပ်ပါ (Success Review)", detail: "ရရှိခဲ့သော ရလဒ်များ၊ လိုအပ်နေသေးသော အချက်များနှင့် နောက်ထပ် ပန်းတိုင်များကို အတူတကွ ဆွေးနွေးပါ။" },
      { title: "ရေရှည်တန်ဖိုးရှိမည့် အစီအစဉ်ကို ကမ်းလှမ်းပါ", detail: "ထိန်းသိမ်းစောင့်ရှောက်မှု၊ ဆက်လက်ကူညီပေးမှု သို့မဟုတ် နောက်တစ်ဆင့် အဆင့်မြှင့်တင်မှု အစီအစဉ်ကို ရွေးချယ်ပေးပါ။" },
      { title: "မိတ်ဆက်ပေးရန် သင့်တော်သော အချိန်ကို သတ်မှတ်ပါ", detail: "Customer ထံ ရလဒ်ကောင်း ရရှိပြီးမှသာ အလားတူ လိုအပ်မည့် မိတ်ဆွေများကို မိတ်ဆက်ပေးနိုင်မလား မေးမြန်းပါ။" },
      { title: "ရရှိသော အကြံပြုချက်များကို ပြန်လည်အသုံးချပါ", detail: "Customer တုံ့ပြန်ချက်များကို Offer၊ Marketing နှင့် Product ထဲသို့ ပြန်လည်ထည့်သွင်း ပိုမိုကောင်းမွန်အောင် ပြင်ဆင်ပါ။" }
    ],
    gate: [
      "Customer အောင်မြင်မှု သုံးသပ်ချက် (Success Review) ပြုလုပ်ခြင်း",
      "ဆက်လက်အသုံးပြုရန် နောက်ထပ် Offer ရှိခြင်း",
      "ရလဒ်ကောင်း ရရှိပြီးမှသာ Testimonial နှင့် Referral တောင်းဆိုခြင်း",
      "လက်လွှတ်ရသည့် အကြောင်းရင်းများ (Churn Reasons) ကို စနစ်တကျ မှတ်တမ်းတင်ခြင်း"
    ],
    kpis: ["Retention / Renewal Rate", "Churn Rate", "Referral Rate", "Customer Lifetime Value (LTV)"],
    ai: ["အသုံးပြုမှု အချက်အလက်များ အကျဉ်းချုပ်ခြင်း", "Follow-up ဆက်သွယ်ရန် မူကြမ်း ရေးသားခြင်း", "Customer တုံ့ပြန်ချက်များမှ Theme ရှာဖွေခြင်း"],
    human: ["ရေရှည် ရင်းနှီးမှု တည်ဆောက်ခြင်း", "တန်ဖိုးရှိသော ဆုံးဖြတ်ချက်များ ချမှတ်ပေးခြင်း", "ယုံကြည်စိတ်ချရမှု ထိန်းသိမ်းခြင်း"],
    mistake: "Customer ရလဒ်ကောင်း မရရှိသေးမီ Testimonial သို့မဟုတ် Referral တောင်းဆိုခြင်း။",
    example: "Project ပြီးပြီးချင်း အဆက်အသွယ် မပြတ်သွားဘဲ ရက် ၃၀ အောင်မြင်မှု သုံးသပ်ချက်နှင့် နောက်ထပ် တိုးတက်စေမည့် အစီအစဉ်ကို ပေးအပ်ပါ။"
  },
  {
    id: "operations", number: "08", title: "Operations & Scale", mm: "အရည်အသွေး မကျဘဲ စနစ်တကျ ချဲ့ထွင်ခြင်း", phase: "SCALE", color: "#3156a3", pale: "#ebf0ff", icon: Settings2,
    question: "သင်မပါလည်း Team နဲ့ System က တူညီတဲ့ အရည်အသွေးကို ပေးနိုင်ပြီလား?",
    what: "လူ၊ လုပ်ငန်းစဉ်၊ Tool၊ Data၊ အရည်အသွေးစံနှုန်းများနှင့် KPI များကို ချိတ်ဆက်ပြီး ရလဒ်ကောင်းကို ခန့်မှန်းရ လွယ်ကူစွာဖြင့် ထပ်ခါတလဲလဲ ပေးနိုင်သော စီးပွားရေးစနစ် တည်ဆောက်ခြင်း ဖြစ်ပါသည်။",
    why: [
      "Founder တစ်ဦးတည်းအပေါ် ဝန်ပိနေမှုကို လျှော့ချပေးနိုင်ပါသည်။",
      "အရည်အသွေး၊ ကုန်ကျစရိတ်နှင့် လုပ်ဆောင်နိုင်စွမ်းကို ရှင်းလင်းစွာ မြင်တွေ့စေပါသည်။",
      "စျေးကွက်လိုအပ်ချက် သက်သေရရှိပြီးမှသာ စနစ်တကျ ဘေးကင်းစွာ လုပ်ငန်းချဲ့ထွင်နိုင်ပါသည်။"
    ],
    actions: [
      { title: "လုပ်ငန်းစဉ် အဆင့်ဆင့်ကို ရေးဆွဲပါ (Process Map)", detail: "စတင်ချိန်မှ ရလဒ်ရရှိချိန်အထိ အဆင့်များ၊ တာဝန်လွှဲပြောင်းမှုများ၊ ဆုံးဖြတ်ချက်များနှင့် ခြွင်းချက်များကို မြင်သာအောင် ရေးဆွဲပါ။" },
      { title: "စံသတ်မှတ်ချက်များ ပြုစုပါ (Standardize)", detail: "လုပ်ငန်းစဉ်လမ်းညွှန် (SOP)၊ စစ်ဆေးရန် Checklist၊ တာဝန်ခံနှင့် ပြီးစီးမှု စံနှုန်းများကို သတ်မှတ်ပါ။" },
      { title: "တည်ငြိမ်ပြီးမှ စက်စနစ် ထည့်သွင်းပါ (Automate)", detail: "ထပ်တလဲလဲ ပြုလုပ်ရသော စည်းမျဉ်းကျသည့် အပိုင်းများကိုသာ AI နှင့် Automation ဖြင့် အစားထိုးပါ။" },
      { title: "စဉ်ဆက်မပြတ် သုံးသပ်တိုးတက်ပါ (PDCA Review)", detail: "Plan → Do → Check → Act နည်းလမ်းဖြင့် ကုန်ကျစရိတ်၊ အရည်အသွေးနှင့် အမြန်နှုန်းကို အမြဲတိုးတက်စေပါ။" }
    ],
    gate: [
      "အဓိက လုပ်ငန်းစဉ်များကို စာဖြင့် မှတ်တမ်းတင်ထားပြီးဖြစ်ခြင်း (Documented Core Process)",
      "လုပ်ငန်းတာဝန်ခံနှင့် အရည်အသွေးစံနှုန်းများ ရှင်းလင်းစွာ သတ်မှတ်ထားခြင်း",
      "ယူနစ်အလိုက် ကုန်ကျစရိတ်နှင့် ဝန်ဆောင်မှုပေးနိုင်စွမ်းကို တိကျစွာ သိရှိခြင်း",
      "Automation မထည့်သွင်းမီ လုပ်ငန်းစဉ်ကိုယ်တိုင် တည်ငြိမ်နေခြင်း"
    ],
    kpis: ["Process Cycle Time", "Cost Per Delivery", "Error / Rework Rate", "Capacity & Profit Margin"],
    ai: ["SOP လမ်းညွှန်များ မူကြမ်းရေးသားခြင်း", "အစီရင်ခံစာများ အလိုအလျောက် ထုတ်ယူခြင်း", "လုပ်ငန်းစဉ် လမ်းကြောင်းချိတ်ဆက်မှုများ ပြုလုပ်ခြင်း"],
    human: ["စီးပွားရေးစနစ် တစ်ခုလုံးကို ဒီဇိုင်းဆွဲခြင်း", "စွန့်စားရမှုနှင့် လုံခြုံရေးကို ထိန်းသိမ်းခြင်း", "တာဝန်ယူမှု၊ တာဝန်ခံမှု သတ်မှတ်ခြင်း"],
    mistake: "လုပ်ငန်းစဉ် မရှင်းလင်းသေးမီ Automation ချက်ချင်းလုပ်ဆောင်ပြီး အမှားများကို ပိုမိုမြန်ဆန်သွားစေခြင်း။",
    example: "ငွေပေးချေမှု → ကြိုဆိုမှု → စတင်ပြင်ဆင်မှု → ပေးပို့မှု → သုံးသပ်မှု အဆင့်များကို SOP အရင် သေချာရေးဆွဲပြီးမှ Automation စနစ် ထည့်သွင်းပါ။"
  },
];

const finderQuestions = [
  ["problem", "Customer ၁၀ ဦးနှင့် ပြဿနာအကြောင်း စကားပြောပြီးပြီလား?"],
  ["customer", "ပထမဆုံးဝယ်မည့် Customer ကို တိတိကျကျ သတ်မှတ်ထားလား?"],
  ["offer", "Customer ငွေပေးချင်လောက်အောင် ရှင်းလင်းသော Offer ရှိပြီလား?"],
  ["leads", "သင့် Offer လိုအပ်သူများထံ အပတ်စဉ် ပုံမှန်ရောက်ရှိနေပြီလား?"],
  ["sales", "သင့်တော်သော Customer များ ဝယ်ယူဆုံးဖြတ်အောင် ကူညီနိုင်နေပြီလား?"],
  ["delivery", "Customer များ ကတိပေးထားသော ရလဒ် အမှန်တကယ် ရရှိနေပြီလား?"],
  ["retention", "ရလဒ်ရပြီးသော Customer က ဆက်သုံး၊ ပြန်ဝယ် သို့မဟုတ် မိတ်ဆက်ပေးနေပြီလား?"],
  ["operations", "သင်မပါလည်း Team နှင့် System က တူညီသော အရည်အသွေးကို ပေးနိုင်ပြီလား?"],
] as const;

export default function Home() {
  const { user, isConfigured } = useAuth();
  const [activeId, setActiveId] = useState("problem");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [finder, setFinder] = useState<Record<string, "yes" | "no">>({});
  const [finderOpen, setFinderOpen] = useState(true);
  const [storyOpen, setStoryOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(() => getLocalLastSavedTimestamp());

  const active = stages.find((s) => s.id === activeId) ?? stages[0];
  const activeStory = STORY_STAGES.find((s) => s.id === active.id) ?? STORY_STAGES[0];

  useEffect(() => {
    try {
      const a = localStorage.getItem("startup-roadmap-progress");
      const b = localStorage.getItem("startup-roadmap-stage");
      const dismissed = localStorage.getItem("startup-onboarding-dismissed");

      if (a) setDone(JSON.parse(a));
      if (b) setActiveId(b);
      if (!dismissed) {
        setWelcomeOpen(true);
      }
    } catch {}
  }, []);

  // Sync with Firestore in real-time when user is authenticated
  useEffect(() => {
    if (!user?.uid) {
      setSyncStatus("offline");
      return;
    }
    setSyncStatus(isConfigured ? "synced" : "offline");
    const unsubscribe = subscribeToUserProgress(user.uid, (data) => {
      if (data.doneTasks) {
        setDone((prev) => ({ ...prev, ...data.doneTasks }));
      }
      if (data.activeStageId) {
        setActiveId(data.activeStageId);
      }
      if (data.finderAnswers) {
        setFinder((prev) => ({ ...prev, ...data.finderAnswers }));
      }
      if (data.updatedAt) {
        setLastSavedTimestamp(data.updatedAt);
        setSyncStatus("synced");
      }
    });
    return () => unsubscribe();
  }, [user?.uid, isConfigured]);

  const handleStatusChange = (status: SyncStatus, timestamp?: number) => {
    setSyncStatus(status);
    if (timestamp) {
      setLastSavedTimestamp(timestamp);
    }
    if (status === "synced") {
      setTimeout(() => {
        setSyncStatus((s) => (s === "synced" ? "idle" : s));
      }, 3000);
    }
  };

  const setStage = (id: string) => {
    setActiveId(id);
    try {
      localStorage.setItem("startup-roadmap-stage", id);
    } catch {}
    if (user?.uid) {
      saveUserProgress(
        user.uid,
        {
          doneTasks: done,
          activeStageId: id,
          finderAnswers: finder,
        },
        handleStatusChange
      );
    }
  };

  const toggle = (key: string, value: boolean) => {
    const next = { ...done, [key]: value };
    setDone(next);
    try {
      localStorage.setItem("startup-roadmap-progress", JSON.stringify(next));
    } catch {}
    if (user?.uid) {
      saveUserProgress(
        user.uid,
        {
          doneTasks: next,
          activeStageId: activeId,
          finderAnswers: finder,
        },
        handleStatusChange
      );
    }
  };

  const handleFinderAnswer = (id: string, answer: "yes" | "no") => {
    const next = { ...finder, [id]: answer };
    setFinder(next);
    if (user?.uid) {
      saveUserProgress(
        user.uid,
        {
          doneTasks: done,
          activeStageId: activeId,
          finderAnswers: next,
        },
        handleStatusChange
      );
    }
  };

  const scrollToRoadmap = () => {
    const el = document.getElementById("roadmap-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToStartHere = () => {
    const el = document.getElementById("start-here-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPodcast = () => {
    const el = document.getElementById("podcast-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFocusFinder = () => {
    setFinderOpen(true);
    setTimeout(() => {
      const el = document.getElementById("focus-finder-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const doneCount = Object.values(done).filter(Boolean).length;
  const total = stages.reduce((n, s) => n + s.actions.length, 0);
  const percent = Math.round((doneCount / total) * 100);
  const focus = useMemo(
    () => stages.find((s) => finder[s.id] === "no") ?? (Object.keys(finder).length === 8 ? stages[7] : null),
    [finder]
  );
  const idx = stages.findIndex((s) => s.id === activeId);

  return (
    <main className="min-h-screen bg-[#f3f1eb] text-[#14213d]">
      {/* Welcome / Onboarding Modal for First Time Visitors */}
      <Suspense fallback={null}>
        <WelcomeModal
          isOpen={welcomeOpen}
          onClose={() => setWelcomeOpen(false)}
          onStartIntroduction={() => {
            setWelcomeOpen(false);
            setTimeout(scrollToStartHere, 100);
          }}
          onStartStage1={() => {
            setStage("problem");
            setWelcomeOpen(false);
            setTimeout(scrollToRoadmap, 100);
          }}
          onReadStory={() => {
            setWelcomeOpen(false);
            setStoryOpen(true);
          }}
          onListenPodcast={() => {
            setWelcomeOpen(false);
            setTimeout(scrollToPodcast, 100);
          }}
        />
      </Suspense>

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#d9d5ca] bg-[#f3f1eb]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-7 sm:py-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="grid size-9 sm:size-10 place-items-center rounded-xl bg-[#14213d] text-white shadow-lg shrink-0">
              <Rocket className="size-4 sm:size-5" />
            </span>
            <div className="hidden sm:block">
              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#687085]">
                Founder Learning OS
              </p>
              <h1 className="text-base font-extrabold sm:text-lg">
                AI Startup Roadmap
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden w-36 lg:block" aria-label="Action progress summary">
              <div className="mb-1 flex justify-between text-[10px] font-bold text-[#687085]">
                <span>ACTION PROGRESS</span>
                <span>{percent}%</span>
              </div>
              <Progress
                value={percent}
                className="h-1.5 bg-[#dcd8ce] [&_[data-slot=progress-indicator]]:bg-[#1da98a]"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              aria-label="Scroll to Start Here Guide"
              className="hidden sm:inline-flex min-h-[44px] rounded-xl border-[#ccc7bb] bg-white/90 font-bold text-[#14213d] shadow-xs hover:bg-white hover:text-[#14213d]"
              onClick={scrollToStartHere}
            >
              <Rocket className="size-3.5 text-[#e8693e]" /> Start Here
            </Button>

            <a
              href={GEMINI_ASSISTANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask Gemini Custom Gem - Startup Mentor in new tab"
              title="Ask Gemini Custom Gem - Startup Mentor"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#d9d0ea] bg-gradient-to-r from-[#f5f0ff] to-[#eef4ff] px-2.5 py-1.5 text-xs font-extrabold text-[#53389e] shadow-xs transition hover:border-[#bfa8eb] hover:shadow-sm sm:px-3 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8c70db]"
            >
              <GeminiGemIcon className="size-4 shrink-0" />
              <span className="hidden sm:inline">AI Gem Mentor</span>
              <ExternalLink className="size-3 opacity-60 hidden sm:inline" />
            </a>

            <Button
              variant="outline"
              size="sm"
              aria-label="Open Story Mode modal"
              title="Story Mode (ဥပမာ Story)"
              className="min-h-[44px] rounded-xl border-[#ccc7bb] bg-white/90 px-2.5 font-bold text-[#14213d] shadow-xs hover:bg-white hover:text-[#14213d] sm:px-3"
              onClick={() => setStoryOpen(true)}
            >
              <BookOpen className="size-4 text-[#4f7cff] shrink-0" />
              <span className="hidden sm:inline">ဥပမာ Story</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              aria-expanded={finderOpen}
              aria-label={finderOpen ? "၆၀ စက္ကန့် စစ်ဆေးချက် သိမ်းဆည်းရန်" : "၆၀ စက္ကန့် စစ်ဆေးချက် ဖွင့်ရန်"}
              title="၆၀ စက္ကန့်နဲ့ သင်အရင်လုပ်သင့်တဲ့အဆင့်ကို ရှာပါ"
              className="min-h-[44px] rounded-xl border-[#ccc7bb] bg-white/90 px-2.5 font-bold text-[#14213d] shadow-xs hover:bg-white hover:text-[#14213d] sm:px-3"
              onClick={() => setFinderOpen((v) => !v)}
            >
              <Gauge className="size-4 shrink-0" />
              <span className="hidden sm:inline">Focus Finder</span>
            </Button>

            {/* Founder Auth / Profile Button */}
            <div className="relative group shrink-0">
              <Button
                variant="outline"
                size="sm"
                aria-label={user ? `Founder Profile: ${user.displayName}` : "Founder အကောင့် ချိတ်ဆက်ရန်"}
                className="min-h-[44px] max-w-[120px] sm:max-w-[180px] rounded-xl border-[#ccc7bb] bg-white/90 px-2 sm:px-3 font-bold text-[#14213d] shadow-xs hover:bg-white hover:text-[#14213d] gap-1.5 sm:gap-2 transition"
                onClick={() => setAuthOpen(true)}
              >
                <Users className="size-4 text-[#1da98a] shrink-0" />
                <span className="max-w-[50px] truncate text-xs sm:max-w-[120px]">
                  {user ? user.displayName : "Sign In"}
                </span>

                {/* Cloud Sync Status Icon */}
                {syncStatus === "saving" ? (
                  <span className="inline-flex items-center text-blue-600" title="Saving changes to Cloud...">
                    <Loader2 className="size-3.5 animate-spin" />
                  </span>
                ) : user && isConfigured ? (
                  <span
                    className="inline-flex items-center text-[#1da98a]"
                    title={
                      lastSavedTimestamp
                        ? `Data saved to Cloud • ${new Date(lastSavedTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                        : "Data saved to Cloud"
                    }
                  >
                    <CloudCheck className="size-3.5" />
                  </span>
                ) : user && !isConfigured ? (
                  <span
                    className="inline-flex items-center text-[#8a8f9b]"
                    title="Local Offline Mode (Saved on this device)"
                  >
                    <CloudOff className="size-3.5" />
                  </span>
                ) : null}
              </Button>

              {/* Floating Tooltip showing sync state */}
              {user && (
                <div className="pointer-events-none absolute right-0 top-full mt-1.5 hidden whitespace-nowrap rounded-lg border border-[#14213d]/10 bg-[#14213d] px-2.5 py-1 text-[10px] font-semibold text-white shadow-md group-hover:block z-50">
                  {syncStatus === "saving" ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="size-3 animate-spin text-blue-300" />
                      Cloud သို့ သိမ်းဆည်းနေပါသည်...
                    </span>
                  ) : isConfigured ? (
                    <span className="flex items-center gap-1">
                      <CloudCheck className="size-3 text-[#1da98a]" />
                      Cloud တွင် အောင်မြင်စွာ သိမ်းထားပြီးဖြစ်သည်
                      {lastSavedTimestamp && (
                        <span className="text-white/70">
                          ({new Date(lastSavedTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CloudOff className="size-3 text-[#f6c85f]" />
                      ဤ Browser ထဲတွင်သာ သိမ်းထားသည်
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 sm:py-7 space-y-6">
        {/* Hero Section */}
        <section className="overflow-hidden rounded-[28px] bg-[#14213d] text-white shadow-[0_24px_70px_rgba(20,33,61,.18)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end lg:p-8">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#91a2c7]">
                <Sparkles className="size-4 text-[#f6c85f]" /> စိတ်ကူးမှ အလုပ်ဖြစ်သော စီးပွားရေးစနစ်အထိ
              </p>
              <h2 className="max-w-4xl text-2xl font-black leading-snug sm:text-4xl sm:leading-normal">
                Startup စိတ်ကူးရှိပေမယ့် ဘယ်ကစရမလဲ မသိသေးဘူးလား?
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c7d0e4]">
                Customer ရဲ့ ပြဿနာကို ရှာဖွေခြင်းကနေ ရောင်းအား၊ ရလဒ်ပေးခြင်းနဲ့ လုပ်ငန်းချဲ့ထွင်ခြင်းအထိ အဆင့် ၈ ဆင့်နဲ့ လက်တွေ့လုပ်ဆောင်ပါ။
              </p>
              <p className="mt-2 text-xs font-semibold leading-6 text-[#91a2c7]">
                💡 အဆင့်အားလုံးကို တစ်ပြိုင်နက်တည်း မလုပ်ပါနှင့်။ သင့်လုပ်ငန်းကို လက်ရှိတားဆီးနေသော အဆင့်ကို အရင်ရှာဖွေပြီး လက်တွေ့သက်သေရရှိမှ နောက်အဆင့်သို့ ဆက်လက်သွားပါ။
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  aria-label="Myanmar Podcast နားထောင်ရန်"
                  onClick={scrollToPodcast}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#f6c85f]/50 bg-[#f6c85f]/20 px-4 py-2 text-xs font-black text-[#f6c85f] shadow-sm transition hover:bg-[#f6c85f] hover:text-[#14213d] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f6c85f] cursor-pointer"
                >
                  <Headphones className="size-3.5" />
                  <span>Podcast နားထောင်မည်</span>
                </button>

                <Button
                  aria-label="Start Here Introduction"
                  onClick={scrollToStartHere}
                  className="min-h-[44px] rounded-xl bg-[#f6c85f] px-4 py-2 text-xs font-black text-[#14213d] hover:bg-[#e0b347]"
                >
                  <Rocket className="size-3.5" /> Start Here (စတင်ရန် လမ်းညွှန်)
                </Button>

                <button
                  type="button"
                  aria-label="Ko Moe Story Modal ဖတ်ရန်"
                  onClick={() => setStoryOpen(true)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-[#bcd3ff] transition hover:bg-white/20 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f6c85f] cursor-pointer"
                >
                  <BookOpen className="size-4 text-[#f6c85f]" /> ဥပမာ Story ဖတ်မည်{" "}
                  <ArrowRight className="size-3.5" />
                </button>

                <Button
                  variant="outline"
                  aria-label="Explore 8 Stages Roadmap"
                  onClick={scrollToRoadmap}
                  className="min-h-[44px] rounded-xl border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/15"
                >
                  <Layers className="size-3.5 text-[#1da98a]" /> အဆင့် ၈ ဆင့်ကို လေ့လာမည်
                </Button>

                <a
                  href={GEMINI_ASSISTANT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Gemini Custom Gem ဖြင့် တိုင်ပင်ရန် in new tab"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-indigo-400/40 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:border-indigo-400/80 hover:from-indigo-900/80 hover:to-purple-900/80 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                >
                  <GeminiGemIcon className="size-4" />
                  <span>Gemini Mentor နှင့် တိုင်ပင်မည်</span>
                  <ExternalLink className="size-3.5 opacity-80" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniStat n="8" label="Stages" />
              <MiniStat n="32" label="Actions" />
              <MiniStat n="1" label="Next focus" />
            </div>
          </div>

          {/* Quick Stage Bar */}
          <div className="border-t border-white/10 bg-white/[.04] p-3 sm:p-5">
            <div
              role="tablist"
              aria-label="Quick stage navigation"
              className="grid grid-cols-4 gap-2 lg:grid-cols-8"
            >
              {stages.map((s, i) => {
                const Icon = s.icon;
                const selected = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Stage ${s.number}: ${s.title}`}
                    onClick={() => {
                      setStage(s.id);
                      scrollToRoadmap();
                    }}
                    className={`group relative rounded-2xl border p-3 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white cursor-pointer ${
                      selected
                        ? "border-white bg-white text-[#14213d] shadow-xl"
                        : "border-white/10 bg-white/[.04] hover:bg-white/[.09]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black tracking-widest opacity-50">
                        {s.number}
                      </span>
                      <Icon
                        className="size-4"
                        style={{ color: selected ? s.color : undefined }}
                      />
                    </div>
                    <p className="mt-3 truncate text-[11px] font-extrabold sm:text-xs">
                      {s.title}
                    </p>
                    <p
                      className={`mt-1 hidden text-[9px] font-bold tracking-wider lg:block ${
                        selected ? "text-[#687085]" : "text-[#8fa0c2]"
                      }`}
                    >
                      {s.phase}
                    </p>
                    {i < 7 && (
                      <ChevronRight className="absolute -right-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-white/30 lg:block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 1. PODCAST: LISTEN FIRST SECTION */}
        <div id="podcast-section">
          <PodcastPlayer
            onScrollToFocusFinder={scrollToFocusFinder}
            onScrollToRoadmap={scrollToRoadmap}
          />
        </div>

        {/* 2. 60-SECOND FOCUS FINDER WIDGET */}
        {finderOpen && (
          <section
            id="focus-finder-section"
            className="grid gap-5 rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5 shadow-sm lg:grid-cols-[1.35fr_.65fr] lg:p-7"
          >
            <div>
              <div className="flex items-center gap-2">
                <Gauge className="size-5 text-[#8c70db]" />
                <h3 className="font-extrabold">၆၀ စက္ကန့်နဲ့ သင်အရင်လုပ်သင့်တဲ့အဆင့်ကို ရှာပါ</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#687085]">
                မေးခွန်းတွေကို အပေါ်ကနေ အစဉ်လိုက်ဖြေပါ။ ပထမဆုံး “မရသေး” လို့ဖြေတဲ့နေရာက သင့်လုပ်ငန်းကို လက်ရှိတားနေတဲ့ အဓိကအဆင့် ဖြစ်နိုင်ပါတယ်။
              </p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {finderQuestions.map(([id, q], i) => (
                  <div
                    key={id}
                    className="flex items-center gap-3 rounded-2xl border border-[#dfdcd3] bg-white p-3"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f0eee8] text-[10px] font-black">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 text-xs font-semibold leading-5">
                      {q}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`မေးခွန်း ${i + 1} အတွက် 'ရပြီ' ဟု ဖြေပါ`}
                        onClick={() => handleFinderAnswer(id, "yes")}
                        className={`grid size-11 min-h-[44px] min-w-[44px] place-items-center rounded-lg border text-xs transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1da98a] cursor-pointer ${
                          finder[id] === "yes"
                            ? "border-[#1da98a] bg-[#1da98a] text-white"
                            : "border-[#ddd8cc] bg-white text-[#374151]"
                        }`}
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`မေးခွန်း ${i + 1} အတွက် 'မရသေး' ဟု ဖြေပါ`}
                        onClick={() => handleFinderAnswer(id, "no")}
                        className={`min-h-[44px] rounded-lg border px-2.5 text-xs font-bold transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#e8693e] cursor-pointer ${
                          finder[id] === "no"
                            ? "border-[#e8693e] bg-[#e8693e] text-white"
                            : "border-[#ddd8cc] bg-white text-[#374151]"
                        }`}
                      >
                        မရသေး
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: focus?.pale ?? "#f0eee8" }}
            >
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#374151]">
                အခု အရင်လုပ်သင့်တဲ့အဆင့်
              </p>
              {focus ? (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className="grid size-11 place-items-center rounded-xl text-white font-black"
                      style={{ background: focus.color }}
                    >
                      {focus.number}
                    </span>
                    <div>
                      <p className="font-extrabold text-[#14213d]">{focus.title}</p>
                      <p className="text-xs font-semibold text-[#374151]">{focus.mm}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-[#14213d]">{focus.question}</p>
                  <Button
                    aria-label={`Start Stage ${focus.number}: ${focus.title}`}
                    className="mt-5 min-h-[48px] w-full rounded-xl bg-[#14213d] text-white font-bold hover:bg-[#203156]"
                    onClick={() => {
                      setStage(focus.id);
                      setFinderOpen(false);
                      scrollToRoadmap();
                    }}
                  >
                    ဒီအဆင့်ကို စလုပ်မယ် <ArrowRight className="size-4" />
                  </Button>
                </>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[#374151]">
                  မေးခွန်းတွေကို ဖြေပြီးရင် သင်လက်ရှိ အရင်ဆုံး လုပ်ဆောင်သင့်တဲ့အဆင့်ကို ဖော်ပြပေးပါမယ်။
                </p>
              )}
            </div>
          </section>
        )}

        {/* 3. BEGINNER START HERE INTRODUCTION SECTION */}
        <div id="start-here-section">
          <StartHereIntro
            onSelectStage={(id) => setStage(id)}
            onOpenStory={() => setStoryOpen(true)}
            onScrollToRoadmap={scrollToRoadmap}
          />
        </div>

        {/* 8-Stage Roadmap Explorer Layout */}
        <div
          id="roadmap-section"
          className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]"
        >
          {/* Aside Navigator */}
          <aside className="h-fit rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-3 lg:sticky lg:top-24">
            <p className="px-3 pb-2 pt-2 text-[10px] font-black uppercase tracking-[.2em] text-[#4b5563]">
              The 8-stage map
            </p>
            <nav role="tablist" aria-label="8-stage roadmap list" className="space-y-1">
              {stages.map((s) => {
                const Icon = s.icon;
                const selected = s.id === activeId;
                const n = s.actions.filter((_, i) => done[`${s.id}-${i}`]).length;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Stage ${s.number}: ${s.title} (${n} of 4 tasks completed)`}
                    onClick={() => setStage(s.id)}
                    className={`flex min-h-[48px] w-full items-center gap-3 rounded-2xl p-3 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14213d] cursor-pointer ${
                      selected
                        ? "bg-[#14213d] text-white shadow-lg"
                        : "hover:bg-[#f0eee8]"
                    }`}
                  >
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-lg"
                      style={{
                        background: selected ? s.color : s.pale,
                        color: selected ? "white" : s.color,
                      }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-extrabold">
                        {s.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold tracking-wider ${
                          selected ? "text-slate-300" : "text-[#4b5563]"
                        }`}
                      >
                        {s.phase}
                      </span>
                    </span>
                    <span className={`text-[9px] font-black ${selected ? "text-white/80" : "text-[#4b5563]"}`}>
                      {n}/4
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="m-2 mt-4 rounded-2xl bg-[#f0eee8] p-4">
              <div className="flex justify-between text-xs font-extrabold text-[#14213d]">
                <span>တိုးတက်မှု အခြေအနေ</span>
                <span>
                  {doneCount}/{total}
                </span>
              </div>
              <Progress
                value={percent}
                className="mt-3 h-2 bg-[#d8d3c7] [&_[data-slot=progress-indicator]]:bg-[#1da98a]"
              />
              <Button
                variant="ghost"
                size="sm"
                aria-label="Reset all task progress"
                className="mt-2 min-h-[44px] h-auto w-full rounded-lg text-xs font-bold text-[#4b5563] hover:bg-[#e4e1d7] hover:text-[#14213d]"
                onClick={() => {
                  setDone({});
                  try {
                    localStorage.removeItem("startup-roadmap-progress");
                  } catch {}
                }}
              >
                <RefreshCw className="size-3.5" /> ပြန်လည်စတင်မည်
              </Button>
            </div>
          </aside>

          {/* Main Stage Detail Article */}
          <article className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-[28px] border border-[#d9d5ca] bg-[#fbfaf7] shadow-sm">
              <div
                className="relative p-6 sm:p-8"
                style={{
                  background: `linear-gradient(120deg,${active.pale},#fbfaf7 72%)`,
                }}
              >
                <span className="absolute right-7 top-2 text-8xl font-black opacity-[.045]">
                  {active.number}
                </span>
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-[10px] font-black uppercase tracking-[.2em]"
                      style={{ color: active.color }}
                    >
                      {active.phase} · STAGE {active.number}
                    </p>
                    <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                      {active.title}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-[#687085]">
                      {active.mm}
                    </p>
                  </div>
                  <span className="rounded-full border border-[#d9d5ca] bg-white/75 px-3 py-1.5 text-[10px] font-bold">
                    Stage {idx + 1} of 8
                  </span>
                </div>
                <div className="relative mt-6 flex gap-3 rounded-2xl border border-white bg-white/70 p-4 shadow-sm">
                  <Compass
                    className="mt-0.5 size-5 shrink-0"
                    style={{ color: active.color }}
                  />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#8a8f9b]">
                      အဓိက ဖြေဆိုရမည့် မေးခွန်း
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6">
                      {active.question}
                    </p>
                  </div>
                </div>
              </div>

              <Tabs
                key={active.id}
                defaultValue="understand"
                className="p-5 sm:p-8"
              >
                <TabsList className="flex overflow-x-auto no-scrollbar w-full justify-start items-center p-1 space-x-2 rounded-2xl bg-[#ece9e1]">
                  <TabsTrigger
                    value="understand"
                    aria-label="Understand stage concepts tab"
                    className="h-12 whitespace-nowrap flex-shrink-0 rounded-xl px-4 text-xs font-bold sm:flex-1"
                  >
                    📖 နားလည်ရန်
                  </TabsTrigger>
                  <TabsTrigger
                    value="story"
                    aria-label="Ko Moe Story tab"
                    className="flex h-12 items-center gap-1.5 whitespace-nowrap flex-shrink-0 rounded-xl px-4 text-xs font-bold sm:flex-1"
                  >
                    <BookOpen className="size-3.5 text-[#4f7cff] shrink-0" /> 📖 ဥပမာ Story
                  </TabsTrigger>
                  <TabsTrigger
                    value="do"
                    aria-label="Action items tab"
                    className="h-12 whitespace-nowrap flex-shrink-0 rounded-xl px-4 text-xs font-bold sm:flex-1"
                  >
                    ✅ လက်တွေ့လုပ်ရန် ({active.actions.filter((_, i) => done[`${active.id}-${i}`]).length}/4)
                  </TabsTrigger>
                  <TabsTrigger
                    value="gate"
                    aria-label="Pass the Gate criteria tab"
                    className="h-12 whitespace-nowrap flex-shrink-0 rounded-xl px-4 text-xs font-bold sm:flex-1"
                  >
                    ⚖️ စစ်ဆေးရန်
                  </TabsTrigger>
                </TabsList>

                {/* Understand Tab */}
                <TabsContent value="understand" className="mt-6">
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
                    <div className="rounded-2xl border border-[#dfdcd3] bg-white p-5">
                      <p
                        className="flex items-center gap-2 text-xs font-black"
                        style={{ color: active.color }}
                      >
                        <Lightbulb className="size-4" /> 📖 ဘာလဲ? (WHAT IS THIS?)
                      </p>
                      <p className="mt-4 text-sm leading-7 text-[#4d566b]">
                        {active.what}
                      </p>
                      <div
                        className="mt-5 rounded-xl p-4"
                        style={{ background: active.pale }}
                      >
                        <p
                          className="text-[9px] font-black uppercase tracking-widest"
                          style={{ color: active.color }}
                        >
                          💡 လက်တွေ့ဥပမာ (EXAMPLE)
                        </p>
                        <p className="mt-2 text-xs font-semibold leading-6">
                          {active.example}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#dfdcd3] bg-white p-5">
                      <p className="flex items-center gap-2 text-xs font-black text-[#3156a3]">
                        <ShieldCheck className="size-4" /> 🧠 ဘာကြောင့် အရေးကြီးသလဲ? (WHY IT MATTERS)
                      </p>
                      <ul className="mt-4 space-y-3">
                        {active.why.map((v) => (
                          <li
                            key={v}
                            className="flex gap-3 text-xs leading-6 text-[#4d566b]"
                          >
                            <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#1da98a]" />
                            {v}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 rounded-xl bg-[#fff0e9] p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#e8693e]">
                          ❌ မကြာခဏလုပ်မိတဲ့ အမှား (COMMON MISTAKE)
                        </p>
                        <p className="mt-2 text-xs font-semibold leading-6 text-[#7a3b22]">
                          {active.mistake}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Ko Moe Story Tab */}
                <TabsContent value="story" className="mt-6">
                  <div className="rounded-2xl border border-[#26304a] bg-[#0b1020] p-6 text-[#eef3ff] shadow-sm sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-block rounded-full bg-[#1b2b4a] px-3.5 py-1 text-xs font-extrabold text-[#bcd3ff]">
                        {activeStory.stageBadge}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Open full Story Mode modal"
                        className="h-8 rounded-xl border border-[#26304a] bg-[#18223b] text-xs font-bold text-[#bcd3ff] hover:bg-[#253250] hover:text-white"
                        onClick={() => setStoryOpen(true)}
                      >
                        Story အပြည့်အစုံဖတ်မည် <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                    <h3 className="mt-4 text-xl font-black text-white sm:text-2xl">
                      {activeStory.title}
                    </h3>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#c7d0e4]">
                      {activeStory.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    {activeStory.quote && (
                      <div className="mt-5 rounded-xl border-l-4 border-[#6ea8fe] bg-[#18223b] p-4 text-xs font-semibold leading-6 text-[#eef3ff]">
                        {activeStory.quote}
                      </div>
                    )}
                    {activeStory.flow && (
                      <div className="mt-5 rounded-xl border border-[#26304a] bg-[#090e1a] p-4 font-mono text-xs leading-6 text-[#8ea8df]">
                        <p className="mb-2 font-sans text-[10px] font-black uppercase tracking-widest text-[#6ea8fe]">
                          Operating Workflow
                        </p>
                        <div className="space-y-1">
                          {activeStory.flow.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-[#4f7cff]">
                                {idx + 1 < activeStory.flow!.length ? "↓" : "✓"}
                              </span>
                              <span className="font-bold text-white">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#245b41] bg-[#123626] p-4 text-xs font-semibold leading-relaxed text-[#a3f0c4]">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#f6c85f]" />
                      <div>
                        <span className="font-black text-white">💡 အဓိက သင်ခန်းစာ - </span>
                        {activeStory.lesson}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#26304a] bg-[#121a2f] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <GeminiGemIcon className="size-4 shrink-0" />
                        <p className="text-xs text-[#c7d0e4]">
                          ဒီ <span className="font-bold text-white">{active.title}</span> အဆင့်ကို သင့်ရဲ့ကိုယ်ပိုင် Idea နှင့် Gemini Custom Gem ထံ မေးမြန်းတိုင်ပင်ပါ။
                        </p>
                      </div>
                      <a
                        href={GEMINI_ASSISTANT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ask Gemini Gem about stage ${active.title} in new tab`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#4f7cff]/40 bg-[#4f7cff]/20 px-3 py-1 text-xs font-bold text-[#bcd3ff] transition hover:bg-[#4f7cff] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4f7cff]"
                      >
                        <span>Gemini Gem မေးမည်</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </TabsContent>

                {/* Do It Tab */}
                <TabsContent value="do" className="mt-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase tracking-wider text-[#4b5563] whitespace-nowrap">
                      ✅ လက်တွေ့လုပ်ဆောင်ရန် အချက်များ (STAGE ACTION ITEMS)
                    </p>
                    <span className="text-xs font-bold text-[#1da98a] whitespace-nowrap">
                      အမှန်ခြစ်ပြီး တိုးတက်မှုကို သိမ်းဆည်းပါ
                    </span>
                  </div>
                  <div className="space-y-3">
                    {active.actions.map((a, i) => {
                      const key = `${active.id}-${i}`;
                      const checked = !!done[key];
                      const inputId = `action-task-${key}`;
                      return (
                        <label
                          htmlFor={inputId}
                          key={a.title}
                          className={`flex min-h-[48px] cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                            checked
                              ? "border-transparent bg-[#eeeee9] opacity-65"
                              : "border-[#dfdcd3] bg-white hover:shadow-sm"
                          }`}
                        >
                          <Checkbox
                            id={inputId}
                            aria-label={`Task ${i + 1}: ${a.title}`}
                            checked={checked}
                            onCheckedChange={(v) => toggle(key, v === true)}
                            className="mt-1 size-5 shrink-0"
                          />
                          <span
                            className="grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black"
                            style={{ background: active.pale, color: active.color }}
                          >
                            {i + 1}
                          </span>
                          <span>
                            <span
                              className={`block text-sm font-extrabold text-[#14213d] ${
                                checked ? "line-through" : ""
                              }`}
                            >
                              {a.title}
                            </span>
                            <span className="mt-1 block text-xs leading-6 text-[#4b5563]">
                              {a.detail}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Pass The Gate Tab */}
                <TabsContent value="gate" className="mt-6">
                  <div className="grid gap-5 xl:grid-cols-[1fr_.7fr]">
                    <div className="rounded-2xl border border-[#dfdcd3] bg-white p-5">
                      <p className="flex items-center gap-2 text-xs font-black text-[#14213d]">
                        <Scale className="size-4" style={{ color: active.color }} />
                        ⚖️ နောက်အဆင့်မတက်ခင် စစ်ဆေးရန် (PASS THE GATE CRITERIA)
                      </p>
                      <div className="mt-4 space-y-3">
                        {active.gate.map((g) => (
                          <div
                            key={g}
                            className="flex gap-3 rounded-xl bg-[#f7f6f2] p-3 text-xs font-semibold leading-5 text-[#14213d]"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-[#1da98a]" />
                            {g}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: active.pale }}
                    >
                      <p
                        className="text-[10px] font-black uppercase tracking-[.18em]"
                        style={{ color: active.color }}
                      >
                        ထင်မြင်ချက်ထက် လက်တွေ့သက်သေကို ယုံပါ
                      </p>
                      <p className="mt-3 text-sm font-extrabold leading-6 text-[#14213d]">
                        Gate ကို လက်တွေ့သက်သေ မရှိဘဲ မဖြတ်ပါနှင့်။ မသေချာသေးပါက နောက်အဆင့် မတက်ဘဲ စမ်းသပ်မှု ထပ်မံပြုလုပ်ပါ။
                      </p>
                      <Button
                        aria-label="Go to next stage"
                        className="mt-5 min-h-[48px] w-full rounded-xl bg-[#14213d] text-white font-bold hover:bg-[#203156]"
                        onClick={() => {
                          setStage(stages[(idx + 1) % 8].id);
                          scrollToRoadmap();
                        }}
                      >
                        နောက်အဆင့်ကို ကြည့်မည် <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {/* AI + Human Team & Metrics */}
            <section className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#14213d] text-white">
                      <Bot className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-[#14213d]">AI + Human Team</p>
                      <p className="text-[10px] font-bold text-[#4b5563]">
                        နည်းပညာအမြန်နှုန်း + လူသားဆုံးဖြတ်ချက်
                      </p>
                    </div>
                  </div>
                  <a
                    href={GEMINI_ASSISTANT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ask Gemini Custom Gem mentor in new tab"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#d9d0ea] bg-white px-3 py-1.5 text-xs font-bold text-[#53389e] shadow-xs transition hover:border-[#bfa8eb] hover:bg-[#fcfaff] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8c70db]"
                    title="Ask Gemini Custom Gem"
                  >
                    <GeminiGemIcon className="size-3.5" />
                    <span>Gemini Gem</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Role
                    title="AI က ကူညီမည်"
                    values={active.ai}
                    color="#8c70db"
                  />
                  <Role
                    title="လူက တာဝန်ယူမည်"
                    values={active.human}
                    color="#1da98a"
                  />
                </div>
              </div>
              <div className="rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 place-items-center rounded-xl font-bold"
                    style={{ background: active.pale, color: active.color }}
                  >
                    <Gauge className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-[#14213d]">Startup Health Metrics</p>
                    <p className="text-[10px] font-bold text-[#4b5563]">
                      လုပ်ခဲ့တာကိုမဟုတ်ဘဲ ရလာတဲ့သက်သေကို တိုင်းပါ
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {active.kpis.map((k) => (
                    <div
                      key={k}
                      className="rounded-xl border border-[#dfdcd3] bg-white p-3"
                    >
                      <span
                        className="mb-2 block h-1 w-8 rounded-full"
                        style={{ background: active.color }}
                      />
                      <p className="text-xs font-extrabold text-[#14213d]">{k}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* The Founder Rule */}
            <section className="rounded-[24px] bg-[#14213d] p-6 text-white">
              <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#bcd3ff]">
                    The founder rule (တည်ထောင်သူ စည်းမျဉ်း)
                  </p>
                  <p className="mt-2 max-w-3xl text-lg font-black leading-7 text-white">
                    Problem ကို သက်သေပြပါ၊ အနည်းဆုံး Offer ကို ရောင်းချပါ၊ Result ကို ကိုယ်တိုင်ပေးအပ်ပါ၊ ပြီးမှ System ဖြင့် Scale လုပ်ပါ။
                  </p>
                </div>
                <Button
                  aria-label="Advance to Next Stage"
                  className="shrink-0 min-h-[48px] rounded-xl bg-white font-black text-[#14213d] hover:bg-[#f3f1eb]"
                  onClick={() => {
                    setStage(stages[(idx + 1) % 8].id);
                    scrollToRoadmap();
                  }}
                >
                  Next stage (နောက်အဆင့်) <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>

            {/* 30-Day Quick Start */}
            <section className="rounded-[24px] border border-[#d9d5ca] bg-[#fbfaf7] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#14213d]">30-Day Quick Start (ရက် ၃၀ စတင်လမ်းကြောင်း)</p>
                  <p className="mt-1 text-xs font-semibold text-[#4b5563]">
                    ပထမဆုံး Customer သက်သေရရှိရန် ရိုးရှင်းသော အစီအစဉ်
                  </p>
                </div>
                <Workflow className="size-5 text-[#8c70db]" />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <Week
                  n="၁"
                  title="Validate"
                  body="Customer ၁၀ ဦးနှင့် ပြဿနာအကြောင်း တွေ့ဆုံမေးမြန်းပါ"
                />
                <Week
                  n="၂"
                  title="Offer"
                  body="Paid Pilot ရလဒ်နှင့် လုပ်ဆောင်မည့် အတိုင်းအတာ သတ်မှတ်ပါ"
                />
                <Week
                  n="၃"
                  title="Sell"
                  body="အလားအလာရှိသူ ၂၀ ထံ ဆက်သွယ်ပြီး တွေ့ဆုံဆွေးနွေးကာ Offer ပေးပါ"
                />
                <Week
                  n="၄"
                  title="Deliver"
                  body="Quick Win ပေးအပ်ပြီး အကြံပြုချက်ရယူကာ SOP စတင်ရေးဆွဲပါ"
                />
              </div>
            </section>
          </article>
        </div>
      </div>

      {/* Full Screen Interactive Story Modal */}
      <Suspense fallback={null}>
        <StoryModal
          isOpen={storyOpen}
          onClose={() => setStoryOpen(false)}
          onSelectStage={(id) => {
            setStage(id);
            scrollToRoadmap();
          }}
          initialStageId={activeId}
        />
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          lastSavedTimestamp={lastSavedTimestamp}
        />
      </Suspense>
    </main>
  );
}

function MiniStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.06] px-3 py-3">
      <p className="text-xl font-black">{n}</p>
      <p className="text-[9px] font-bold uppercase tracking-wider text-[#91a2c7]">
        {label}
      </p>
    </div>
  );
}

function Role({
  title,
  values,
  color,
}: {
  title: string;
  values: string[];
  color: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black" style={{ color }}>
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {values.map((v) => (
          <li key={v} className="flex gap-2 text-[11px] leading-5 text-[#687085]">
            <span
              className="mt-1 grid size-3.5 shrink-0 place-items-center rounded-full text-white"
              style={{ background: color }}
            >
              <Check className="size-2" />
            </span>
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Week({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[#dfdcd3] bg-white p-4">
      <p className="text-[9px] font-black uppercase tracking-widest text-[#8c70db]">
        Week {n} (ရက်သတ္တပတ် {n})
      </p>
      <p className="mt-2 text-sm font-extrabold">{title}</p>
      <p className="mt-2 text-[11px] leading-5 text-[#687085]">{body}</p>
    </div>
  );
}
