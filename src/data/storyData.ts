export interface StoryStage {
  id: string; // Corresponding roadmap stage id ('problem', 'customer', 'offer', etc.)
  number: number;
  stageBadge: string;
  stageName: string;
  title: string;
  paragraphs: string[];
  quote?: string;
  lesson: string;
  flow?: string[];
}

export const STORY_STAGES: StoryStage[] = [
  {
    id: "problem",
    number: 1,
    stageBadge: "Stage 1 — 🔍 Problem",
    stageName: "Problem Validation",
    title: "Customer ရဲ့ တကယ့်ပြဿနာကို ရှာခြင်း",
    paragraphs: [
      "Ko Moe မှာ AI ကိုသုံးပြီး Small Business တွေအတွက် Facebook Content Service တစ်ခုလုပ်မယ့် Idea ရှိတယ်။ ဒါပေမယ့် Website တည်ဆောက်တာကနေ မစဘူး။ Customer Problem ကို နားလည်တာကနေ စတယ်။",
      "Ko Moe က ဆိုင်ရှင် 10 ယောက်နဲ့ စကားပြောပြီး သူတို့ရဲ့ တကယ့် Problem က AI မရှိတာမဟုတ်ဘဲ Content လုပ်ဖို့ အချိန်နဲ့ Idea မရှိတာဆိုတာ သိလာတယ်."
    ],
    quote: "“မင်းမှာ Idea ရှိတာမှန်တယ်။ ဒါပေမယ့် Customer မှာ တကယ် Problem ရှိလား?”",
    lesson: "ကိုယ့် Idea ကိုချစ်တာထက် Customer Problem ကို နားလည်ပါ။"
  },
  {
    id: "customer",
    number: 2,
    stageBadge: "Stage 2 — 👤 Customer",
    stageName: "Customer & Positioning",
    title: "ဘယ်သူ့အတွက်လုပ်မှာလဲ?",
    paragraphs: [
      "Ko Moe က “Business အားလုံး” ကို Target မလုပ်တော့ဘဲ Facebook အသုံးပြုနေတဲ့ Myanmar Restaurant နဲ့ Small Retail Shop Owner တွေကို Focus လုပ်တယ်."
    ],
    lesson: "လူတိုင်းကို ရောင်းချင်ရင် ဘယ်သူ့ကိုမှ တိတိကျကျ မပြောနိုင်ဘူး။"
  },
  {
    id: "offer",
    number: 3,
    stageBadge: "Stage 3 — 🎁 Offer",
    stageName: "Offer & MVP",
    title: "Customer က ဘာကိုဝယ်မှာလဲ?",
    paragraphs: [
      "“AI Powered Marketing Solution” လို့မပြောတော့ဘဲ —",
      "“သင့် Product Information ပို့ပေးပါ။ တစ်လအတွက် Facebook Post Idea 30 ခုနဲ့ Caption 30 ခု ပြင်ဆင်ပေးမယ်။” လို့ တိကျတဲ့ Offer ပေးတယ်။"
    ],
    quote: "“သင့် Product Information ပို့ပေးပါ။ တစ်လအတွက် Facebook Post Idea 30 ခုနဲ့ Caption 30 ခု ပြင်ဆင်ပေးမယ်။”",
    lesson: "Customer က Technology ကို မဝယ်ဘူး။ Result ကို ဝယ်တယ်။"
  },
  {
    id: "leads",
    number: 4,
    stageBadge: "Stage 4 — 📣 Lead Generation",
    stageName: "Lead Generation",
    title: "Customer တွေကို ခေါ်လာခြင်း",
    paragraphs: [
      "Ko Moe က Facebook Post, Short Video, Free Template, Referral နဲ့ Website ကနေ Potential Customers ကို ခေါ်လာတယ်."
    ],
    lesson: "Lead Generation = မှန်ကန်တဲ့လူတွေကို ကိုယ့်ဆီ ခေါ်လာခြင်း။"
  },
  {
    id: "sales",
    number: 5,
    stageBadge: "Stage 5 — 💰 Sales",
    stageName: "Sales",
    title: "ဝယ်ယူဖို့ ကူညီခြင်း",
    paragraphs: [
      "Customer က “စျေးဘယ်လောက်လဲ?” လို့မေးတဲ့အခါ Ko Moe က စျေးပဲမပြောဘဲ Problem ကိုမေးတယ်, Sample ပြတယ်, သင့်တော်တဲ့ Package ကို အကြံပြုတယ်."
    ],
    lesson: "Sales = သင့်တော်တဲ့ Customer ကို ဝယ်ယူဖို့ ကူညီခြင်း။"
  },
  {
    id: "delivery",
    number: 6,
    stageBadge: "Stage 6 — 📦 Delivery",
    stageName: "Delivery & Success",
    title: "ကတိပေးထားတဲ့ Result ကို ပေးခြင်း",
    paragraphs: [
      "Customer ဝယ်ပြီးတာနဲ့ အလုပ်မပြီးသေးဘူး. Ko Moe က ကတိပေးထားတဲ့ Content နဲ့ Result ကို Quality ကောင်းကောင်းနဲ့ ပေးရတယ်."
    ],
    lesson: "Sales က Promise ပေးတယ်။ Delivery က Promise ကို ပြည့်စုံစေတယ်။"
  },
  {
    id: "operations",
    number: 7,
    stageBadge: "Stage 7 — ⚙️ Operations",
    stageName: "Operations & Scale",
    title: "Quality ကို ထပ်ခါတလဲလဲ ပေးနိုင်အောင် System တည်ဆောက်ခြင်း",
    paragraphs: [
      "Customer 10 ယောက်ဖြစ်လာတော့ Ko Moe က Template, Checklist, SOP, Folder Structure နဲ့ Automation တည်ဆောက်တယ်."
    ],
    flow: [
      "Customer Information",
      "Content Brief",
      "AI Draft",
      "Human Review",
      "Customer Approval",
      "Final Delivery"
    ],
    lesson: "Operations က Quality တူတူနဲ့ Result ကို ထပ်ခါတလဲလဲ ပေးနိုင်စေတယ်။"
  },
  {
    id: "retention",
    number: 8,
    stageBadge: "Stage 8 — 🚀 Growth",
    stageName: "Retention & Growth",
    title: "အလုပ်ဖြစ်ပြီးသား System ကို ချဲ့ထွင်ခြင်း",
    paragraphs: [
      "Ko Moe က Customer, Lead, Conversion, Cost နဲ့ Retention Data ကို သိလာပြီ. အခုတော့ Guess လုပ်နေတဲ့ Founder မဟုတ်တော့ဘဲ System တစ်ခုကို စီမံနေတဲ့ Business Owner ဖြစ်လာတယ်."
    ],
    lesson: "Growth ဆိုတာ အလုပ်မဖြစ်သေးတာကို ကြီးအောင်လုပ်တာမဟုတ်ဘူး။ အလုပ်ဖြစ်ပြီးသား System ကို ချဲ့တာ။"
  }
];

export const STORY_SUMMARY = {
  intro: "Ko Moe မှာ AI ကိုသုံးပြီး Small Business တွေအတွက် Facebook Content Service တစ်ခုလုပ်မယ့် Idea ရှိတယ်။ ဒါပေမယ့် Website တည်ဆောက်တာကနေ မစဘူး။ Customer Problem ကို နားလည်တာကနေ စတယ်။",
  quote: "“Startup ဆိုတာ App တစ်ခုတည်ဆောက်တာမဟုတ်ဘူး။ Customer ရဲ့ Problem ကို ဖြေရှင်းပြီး အဲဒီ Result ကို ထပ်ခါတလဲလဲ ပေးနိုင်တဲ့ System တစ်ခု တည်ဆောက်တာဖြစ်တယ်။”",
  flowSteps: [
    "IDEA",
    "PROBLEM",
    "CUSTOMER",
    "OFFER",
    "LEAD GENERATION",
    "SALES",
    "DELIVERY",
    "OPERATIONS",
    "GROWTH"
  ],
  oneLiner: "Problem ကိုရှာ → Customer ကိုရွေး → Offer ဖန်တီး → လူတွေကိုခေါ်လာ → ဝယ်ဖို့ကူညီ → Result ပေး → System တည်ဆောက် → အလုပ်ဖြစ်တာကို ချဲ့ထွင်"
};
