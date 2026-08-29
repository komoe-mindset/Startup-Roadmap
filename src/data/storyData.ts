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
      "Ko Moe မှာ Idea တစ်ခုရှိတယ် — “AI ကိုသုံးပြီး Small Business တွေအတွက် Facebook Content ရေးပေးတဲ့ Service တစ်ခုလုပ်မယ်။”",
      "အစမှာ Logo လုပ်ချင်တယ်၊ Website တည်ဆောက်ချင်တယ်၊ AI App တောင် Coding စလုပ်ချင်တယ်။ ဒါပေမယ့် Roadmap က မေးတယ် —"
    ],
    quote: "“မင်းမှာ Idea ရှိတာမှန်တယ်။ ဒါပေမယ့် Customer မှာ တကယ် Problem ရှိလား?”",
    lesson: "ကိုယ့် Idea ကို ချစ်တာထက် Customer ရဲ့ Problem ကို နားလည်တာ ပိုအရေးကြီးတယ်။",
    flow: undefined
  },
  {
    id: "customer",
    number: 2,
    stageBadge: "Stage 2 — 👤 Customer",
    stageName: "Customer & Positioning",
    title: "ဘယ်သူ့အတွက်လုပ်မှာလဲ?",
    paragraphs: [
      "အစမှာ Ko Moe က “Business အားလုံးကို ရောင်းမယ်” လို့စဉ်းစားတယ်။ ဒါပေမယ့် Target က အရမ်းကျယ်တယ်။",
      "ဒါကြောင့် Facebook ကို အသုံးပြုပြီး ရောင်းနေတဲ့ Myanmar Restaurant နဲ့ Small Retail Shop Owner တွေကို Focus လုပ်တယ်။"
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
      "Ko Moe က အစမှာ “AI Powered Digital Marketing Solution” လို့ရေးတယ်။ ဒါပေမယ့် Customer က “အဲဒါက ကျွန်တော့်အတွက် ဘာလုပ်ပေးမှာလဲ?” လို့မေးတယ်။"
    ],
    quote: "“သင့် Product Information ပို့ပေးပါ။ တစ်လအတွက် Facebook Post Idea 30 ခုနဲ့ Caption 30 ခု ပြင်ဆင်ပေးမယ်။”",
    lesson: "Customer က Technology ကို မဝယ်ဘူး။ Customer က Result ကို ဝယ်တယ်။"
  },
  {
    id: "leads",
    number: 4,
    stageBadge: "Stage 4 — 📣 Lead Generation",
    stageName: "Lead Generation",
    title: "Customer တွေကို ခေါ်လာခြင်း",
    paragraphs: [
      "Ko Moe က Facebook Post, Short Video, Free Template, Referral နဲ့ Simple Website ကိုသုံးပြီး လူတွေကို ကိုယ့် Service ဆီ ခေါ်လာတယ်။"
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
      "Restaurant Owner တစ်ယောက်က “Service ဘယ်လောက်လဲ?” လို့မေးတယ်။ Ko Moe က စျေးပဲမပြောဘဲ Customer ရဲ့ Problem ကိုမေးတယ်၊ Sample Result ပြတယ်၊ သင့်တော်တဲ့ Package အကြံပြုတယ်။"
    ],
    lesson: "Lead Generation က လူတွေကို ခေါ်လာတယ်။ Sales က သင့်တော်တဲ့ Customer ကို ဝယ်ယူဖို့ ကူညီတယ်။"
  },
  {
    id: "delivery",
    number: 6,
    stageBadge: "Stage 6 — 📦 Delivery",
    stageName: "Delivery & Success",
    title: "ကတိပေးထားတဲ့ Result ကို ပေးခြင်း",
    paragraphs: [
      "Customer က ပိုက်ဆံပေးပြီ။ ဒါပေမယ့် Finish Line မဟုတ်ဘူး။ Ko Moe က Post Idea 30 ခု၊ Caption 30 ခု၊ Promotion Idea နဲ့ Monthly Content Plan ကို Quality ကောင်းကောင်းနဲ့ ပေးရမယ်။"
    ],
    lesson: "Sales က Promise ပေးတယ်။ Delivery က Promise ကို အကောင်အထည်ဖော်တယ်။"
  },
  {
    id: "operations",
    number: 7,
    stageBadge: "Stage 7 — ⚙️ Operations",
    stageName: "Operations & Scale",
    title: "Quality ကို ထပ်ခါတလဲလဲ ပေးနိုင်အောင် System တည်ဆောက်ခြင်း",
    paragraphs: [
      "Customer 10 ယောက်ရှိလာတော့ Ko Moe တစ်ယောက်တည်း မှတ်ထားလို့ မရတော့ဘူး။ ဒါကြောင့် Workflow တည်ဆောက်တယ်။",
      "Template, Checklist, Folder Structure, SOP နဲ့ Automation ကို ထည့်တယ်။"
    ],
    flow: [
      "Customer Information",
      "Content Brief",
      "AI Draft",
      "Human Review",
      "Customer Approval",
      "Final Delivery"
    ],
    lesson: "Operations က Result ကို တူညီတဲ့ Quality နဲ့ ထပ်ခါတလဲလဲ ပေးနိုင်စေတယ်။"
  },
  {
    id: "retention",
    number: 8,
    stageBadge: "Stage 8 — 🚀 Growth",
    stageName: "Retention, Referral & Growth",
    title: "အလုပ်ဖြစ်ပြီးသား System ကို ချဲ့ထွင်ခြင်း",
    paragraphs: [
      "Ko Moe က ဘယ် Customer ကအကောင်းဆုံးလဲ၊ Lead ဘယ်ကလာလဲ၊ Conversion ဘယ်လောက်လဲ၊ Delivery Cost ဘယ်လောက်လဲ၊ Customer ဘာကြောင့် ဆက်သုံးလဲဆိုတဲ့ Data ကို သိလာတယ်။",
      "အခုတော့ Guess လုပ်နေတဲ့ Founder မဟုတ်တော့ဘူး။ System တစ်ခုကို စီမံနေတဲ့ Business Owner ဖြစ်လာပြီ။"
    ],
    lesson: "Growth ဆိုတာ အလုပ်မဖြစ်သေးတာကို ကြီးအောင်လုပ်တာမဟုတ်ဘူး။ အလုပ်ဖြစ်ပြီးသား System ကို ချဲ့တာ။"
  }
];

export const STORY_SUMMARY = {
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
  oneLiner: "Problem ကိုရှာ → Customer ကိုရွေး → Offer ဖန်တီး → လူတွေကိုခေါ်လာ → ဝယ်ဖို့ကူညီ → Result ပေး → System တည်ဆောက် → အလုပ်ဖြစ်တာကိုချဲ့ထွင်"
};
