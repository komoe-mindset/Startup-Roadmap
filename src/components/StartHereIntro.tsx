import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Compass,
  Layers,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartHereIntroProps {
  onSelectStage: (stageId: string) => void;
  onOpenStory: () => void;
  onScrollToRoadmap: () => void;
}

const QUESTIONS = [
  { id: "problem", number: "01", question: "လူတွေ တကယ်ကြုံနေရပြီး ဖြေရှင်းဖို့ အရေးကြီးတဲ့ ပြဿနာကို သက်သေပြထားပြီလား?", tag: "Problem", color: "#e8693e", pale: "#fff0e9" },
  { id: "customer", number: "02", question: "ဘယ်သူ့ရဲ့ ဘယ်ပြဿနာကို အရင်ဆုံး ဖြေရှင်းပေးမလဲ?", tag: "Customer", color: "#d79a24", pale: "#fff8df" },
  { id: "offer", number: "03", question: "Customer ငွေပေးချင်လောက်အောင် ရလဒ်ရှင်းတဲ့ Offer ရှိပြီလား?", tag: "Offer", color: "#8c70db", pale: "#f2edff" },
  { id: "leads", number: "04", question: "သင့် Offer လိုအပ်သူတွေကို အပတ်စဉ် ပုံမှန်ရောက်ရှိနိုင်ပြီလား?", tag: "Leads", color: "#ef7d32", pale: "#fff1e3" },
  { id: "sales", number: "05", question: "Customer ရဲ့လိုအပ်ချက်ကို နားလည်ပြီး မှန်ကန်တဲ့ ဝယ်ယူဆုံးဖြတ်ချက်ချနိုင်အောင် ကူညီနိုင်ပြီလား?", tag: "Sales", color: "#b75fbd", pale: "#faedfb" },
  { id: "delivery", number: "06", question: "ကတိပေးထားတဲ့ရလဒ်ကို အချိန်မီ၊ အရည်အသွေးကောင်းကောင်း ပေးနိုင်ပြီလား?", tag: "Delivery", color: "#1da98a", pale: "#e8fbf5" },
  { id: "retention", number: "07", question: "ရလဒ်ရပြီးတဲ့ Customer က ဆက်သုံး၊ ပြန်ဝယ် ဒါမှမဟုတ် တခြားသူကို မိတ်ဆက်ပေးနေပြီလား?", tag: "Retention", color: "#247ebf", pale: "#eaf5ff" },
  { id: "operations", number: "08", question: "သင်မပါလည်း Team နဲ့ System က တူညီတဲ့အရည်အသွေးကို ပေးနိုင်ပြီလား?", tag: "Operations", color: "#3156a3", pale: "#ebf0ff" },
];

const SIMPLE_FLOW = [
  { name: "PROBLEM", desc: "ပြဿနာအစစ်ရှာ" },
  { name: "CUSTOMER", desc: "ဖောက်သည်ရွေး" },
  { name: "OFFER", desc: "ဖြေရှင်းချက်တည်ဆောက်" },
  { name: "LEAD GEN", desc: "လိုအပ်သူထံရောက်ရှိ" },
  { name: "SALES", desc: "ဝယ်ယူဆုံးဖြတ်ကူညီ" },
  { name: "DELIVERY", desc: "ကတိရလဒ်ပေး" },
  { name: "RETENTION", desc: "ဆက်သုံး/ပြန်ဝယ်" },
  { name: "OPERATIONS", desc: "စနစ်တကျချဲ့ထွင်" },
];

const MACHINE_FLOW = [
  { label: "MARKET", sub: "စျေးကွက်" },
  { label: "LEAD GEN", sub: "လူခေါ်" },
  { label: "SALES", sub: "ဝယ်ယူ" },
  { label: "CUSTOMER", sub: "ဖောက်သည်" },
  { label: "DELIVERY", sub: "ပေးပို့" },
  { label: "RESULT", sub: "ရလဒ်" },
  { label: "RETENTION", sub: "ဆက်သုံး" },
  { label: "OPERATIONS", sub: "စနစ်တကျချဲ့ထွင်" },
];

export function StartHereIntro({
  onSelectStage,
  onOpenStory,
  onScrollToRoadmap,
}: StartHereIntroProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);

  return (
    <section id="start-here-section" className="space-y-6">
      {/* 3 Clear Entry Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d9d5ca] bg-[#fbfaf7] p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#14213d] text-white">
            <Compass className="size-4" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#14213d]">
            Quick Navigation
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              const el = document.getElementById("start-here-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="min-h-[44px] rounded-xl bg-[#14213d] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#203156]"
          >
            <Rocket className="size-3.5 text-[#f6c85f]" />
            Start Here (ဘယ်ကစရမလဲ)
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenStory}
            className="min-h-[44px] rounded-xl border-[#d0cbbe] bg-white px-3.5 py-1.5 text-xs font-bold text-[#14213d] shadow-xs hover:bg-[#f3f1eb]"
          >
            <BookOpen className="size-3.5 text-[#4f7cff]" />
            Ko Moe Story (ဥပမာ Story)
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onScrollToRoadmap}
            className="min-h-[44px] rounded-xl border-[#d0cbbe] bg-white px-3.5 py-1.5 text-xs font-bold text-[#14213d] shadow-xs hover:bg-[#f3f1eb]"
          >
            <Layers className="size-3.5 text-[#1da98a]" />
            Explore 8 Stages (အဆင့် ၈ ဆင့်)
          </Button>
        </div>
      </div>

      {/* Main Start Here Introduction Card */}
      <div className="overflow-hidden rounded-[28px] border border-[#d9d5ca] bg-[#fbfaf7] shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfdcd3] pb-5">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[#8c70db]">
                <Sparkles className="size-3.5 text-[#f6c85f]" />
                Beginner-Friendly Guide
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#14213d] sm:text-3xl">
                🚀 AI Startup Roadmap ကို ဘယ်လို အသုံးပြုမလဲ?
              </h2>
            </div>
            <button
              type="button"
              aria-expanded={detailsOpen}
              aria-label={detailsOpen ? "အကျဉ်းချုံ့မည်" : "အသေးစိတ်ဖွင့်မည်"}
              onClick={() => setDetailsOpen((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#d9d5ca] bg-white px-3.5 py-1.5 text-xs font-bold text-[#374151] transition hover:bg-[#f3f1eb] hover:text-[#14213d] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14213d] cursor-pointer"
            >
              <span>{detailsOpen ? "အကျဉ်းချုံ့မည်" : "အသေးစိတ်ဖွင့်မည်"}</span>
              <ChevronDown
                className={`size-4 transition-transform ${detailsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="mt-5 max-w-4xl space-y-3 text-sm leading-relaxed text-[#374151]">
            <p className="font-semibold text-[#14213d]">
              ဒီ Website က Startup တစ်ခု စတင်လိုသူများအတွက် စိတ်ကူးတစ်ခုကနေ တကယ့်စီးပွားရေးစနစ်တစ်ခု ဖြစ်လာတဲ့အထိ အဆင့်ဆင့် လေ့ကျင့်လုပ်ဆောင်နိုင်အောင် လမ်းညွှန်ပေးထားတာ ဖြစ်ပါတယ်။
            </p>
            <p>
              Startup ဆိုတာ App သို့မဟုတ် Website တစ်ခုတည်ဆောက်တာသက်သက် မဟုတ်ပါဘူး။ Customer ရဲ့ အရေးကြီးတဲ့ပြဿနာကို ဖြေရှင်းပြီး အဲဒီရလဒ်ကို ထပ်ခါတလဲလဲ ပေးနိုင်တဲ့ စီးပွားရေးစနစ်တစ်ခု တည်ဆောက်ခြင်း ဖြစ်ပါတယ်။
            </p>
            <p className="font-medium text-[#14213d]">
              သင့်လုပ်ငန်း စနစ်တကျ အလုပ်ဖြစ်စေဖို့ အောက်ပါ မေးခွန်း ၈ ခုကို အဆင့်လိုက် ဖြေဆိုနိုင်ဖို့ လိုအပ်ပါတယ်။
            </p>
          </div>

          {/* 8 Core Questions Cards */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                aria-label={`Stage ${q.number}: ${q.tag} - ${q.question}`}
                onClick={() => {
                  onSelectStage(q.id);
                  onScrollToRoadmap();
                }}
                className="group flex flex-col justify-between rounded-2xl border border-[#dfdcd3] bg-white p-4 text-left shadow-xs transition-all hover:border-[#14213d] hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14213d] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="grid size-6 place-items-center rounded-md text-[10px] font-black"
                      style={{ background: q.pale, color: q.color }}
                    >
                      {q.number}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a8f9b] group-hover:text-[#14213d]">
                      {q.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-bold leading-5 text-[#14213d]">
                    {q.question}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#687085] group-hover:text-[#14213d]">
                  Stage {q.number} သွားမည် <ArrowRight className="size-2.5" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {detailsOpen && (
          <div className="border-t border-[#dfdcd3] bg-[#f5f3ec] p-6 sm:p-8 space-y-8">
            {/* 2. SIMPLE STARTUP FLOW */}
            <div className="rounded-2xl border border-[#d9d5ca] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-[#8c70db] text-white">
                  <Zap className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#14213d]">
                    Startup စီးဆင်းမှု လုပ်ငန်းစဉ် (Startup Flow)
                  </h3>
                  <p className="text-[11px] text-[#687085]">
                    စိတ်ကူးမှ လုပ်ငန်းချဲ့ထွင်ရေးအထိ အဆင့်ဆင့် စီးဆင်းပုံ
                  </p>
                </div>
              </div>

              {/* Horizontal on desktop, wrapped on mobile */}
              <div className="mt-4 overflow-x-auto pb-2">
                <div className="flex min-w-[720px] items-center justify-between gap-1.5 sm:min-w-0">
                  {SIMPLE_FLOW.map((item, index) => (
                    <React.Fragment key={item.name}>
                      <div className="flex-1 rounded-xl border border-[#e2ded5] bg-[#faf8f4] px-2 py-3 text-center transition hover:border-[#14213d] hover:bg-white">
                        <p className="text-[10px] font-black tracking-tight text-[#14213d]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[9px] font-medium text-[#7a8294]">
                          {item.desc}
                        </p>
                      </div>
                      {index < SIMPLE_FLOW.length - 1 && (
                        <span className="text-[#a5abb7] font-black text-xs">
                          →
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Under the flow memorable summary */}
              <div className="mt-4 rounded-xl border border-[#cbe4d8] bg-[#f0f9f5] p-3.5 text-center text-xs font-extrabold text-[#126b54] sm:text-sm">
                ပြဿနာအစစ်ကိုရှာ → ကူညီမယ့် Customer ကိုရွေး → ဝယ်ယူရကျိုးနပ်တဲ့ Offer တည်ဆောက် → လိုအပ်သူများထံ ရောက်အောင်လုပ် → ဝယ်ယူဆုံးဖြတ်နိုင်အောင် ကူညီ → ကတိပေးထားတဲ့ရလဒ်ကို ပေး → ဆက်သုံး၊ ပြန်ဝယ်၊ မိတ်ဆက်ပေးစေ → စနစ်တကျ ချဲ့ထွင်
              </div>
            </div>

            {/* 3. HOW TO USE THIS WEBSITE */}
            <div className="rounded-2xl border border-[#d9d5ca] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-[#3156a3] text-white">
                  <Compass className="size-4" />
                </span>
                <h3 className="text-sm font-extrabold text-[#14213d]">
                  🧭 ဒီ Website ကို ဘယ်လို အသုံးပြုမလဲ?
                </h3>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
                {[
                  { step: "အဆင့် ၁", text: "Stage 1 (Problem Validation) ကနေ စတင်ပါ။" },
                  { step: "အဆင့် ၂", text: "Stage တစ်ခုချင်းစီရဲ့ ရှင်းလင်းချက်နဲ့ လက်တွေ့ဥပမာကို ဖတ်ပါ။" },
                  { step: "အဆင့် ၃", text: "သင့်ကိုယ်ပိုင် စီးပွားရေးစိတ်ကူးနဲ့ နှိုင်းယှဉ်စဉ်းစားပါ။" },
                  { step: "အဆင့် ၄", text: "Stage ထဲက လက်တွေ့လုပ်ဆောင်ရန် အချက်များကို လုပ်ကြည့်ပါ။" },
                  { step: "အဆင့် ၅", text: "စစ်ဆေးရန် သက်သေရမှသာ နောက် Stage ကို ဆက်သွားပါ။" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex flex-col justify-between rounded-xl border border-[#e2ded5] bg-[#faf8f4] p-3.5"
                  >
                    <span className="inline-block rounded-md bg-[#14213d] px-2 py-0.5 text-[10px] font-black text-white w-fit">
                      {item.step}
                    </span>
                    <p className="mt-2.5 text-xs font-bold leading-5 text-[#14213d]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Important Note */}
              <div className="mt-4 rounded-xl border-l-4 border-[#e8693e] bg-[#fff6f2] p-4 text-xs leading-relaxed text-[#7a3b22]">
                <p className="font-extrabold text-[#c04318]">⚠️ အရေးကြီးသော လမ်းညွှန်ချက်:</p>
                <p className="mt-1 font-semibold">
                  “ဒီ Roadmap ကို Checklist တစ်ခုလို အမြန်ပြီးအောင် ဖြတ်သန်းဖို့ မလိုပါဘူး။ Stage တစ်ခုအတွက် ခိုင်မာတဲ့ သက်သေမရသေးရင် အဲဒီအဆင့်မှာပဲ သေချာစမ်းသပ်ပါ။”
                </p>
                <p className="mt-1 text-[11px] text-[#8e482d]">
                  ဥပမာ: Customer Problem အစစ်အမှန် မရှင်းလင်းသေးဘဲ အချိန်ကုန်ခံပြီး Website သို့မဟုတ် App အကြီးကြီး တည်ဆောက်ခြင်းမျိုးကို ရှောင်ကြဉ်ပါ။
                </p>
              </div>
            </div>

            {/* 6. STARTUP MACHINE EXPLANATION */}
            <div className="rounded-2xl border border-[#d9d5ca] bg-[#14213d] p-5 sm:p-7 text-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-white/10 text-[#f6c85f]">
                    <Sparkles className="size-4" />
                  </span>
                  <h3 className="text-sm font-extrabold tracking-wide text-white sm:text-base">
                    The Startup Engine Concept (စီးပွားရေးစက်ယန္တရား)
                  </h3>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-bold text-[#bcd3ff]">
                  Business Engine
                </span>
              </div>

              {/* Machine Pipeline visual */}
              <div className="mt-4 overflow-x-auto pb-2">
                <div className="flex min-w-[700px] items-center justify-between gap-1 sm:min-w-0">
                  {MACHINE_FLOW.map((m, idx) => (
                    <React.Fragment key={m.label}>
                      <div className="flex-1 rounded-xl border border-white/15 bg-white/5 p-2 text-center">
                        <p className="text-[10px] font-extrabold text-white">
                          {m.label}
                        </p>
                        <p className="text-[8px] text-[#91a2c7]">{m.sub}</p>
                      </div>
                      {idx < MACHINE_FLOW.length - 1 && (
                        <span className="text-white/40 text-[10px] font-bold">
                          →
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 3 memorable questions */}
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold text-[#bcd3ff]">
                    “Customer တွေကို ကိုယ့်ဆီ ရောက်လာအောင် ခေါ်နိုင်ပြီလား?”
                  </p>
                  <p className="mt-2 text-xs font-black text-[#f6c85f]">
                    → Marketing / Lead Generation
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold text-[#bcd3ff]">
                    “Customer တွေ ယုံကြည်စိတ်ချစွာ ဝယ်ယူအောင် ကူညီနိုင်ပြီလား?”
                  </p>
                  <p className="mt-2 text-xs font-black text-[#a3f0c4]">
                    → Sales
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold text-[#bcd3ff]">
                    “ကတိပေးထားတဲ့ ရလဒ်ကို တူညီတဲ့ အရည်အသွေးနဲ့ ထပ်ခါတလဲလဲ ပေးနိုင်ပြီလား?”
                  </p>
                  <p className="mt-2 text-xs font-black text-[#c58af9]">
                    → Delivery + Operations
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/10 p-3.5 text-center text-xs font-bold text-[#eef3ff]">
                💡 “ဒီ အဓိက ၃ ချက် အလုပ်ဖြစ်လာတဲ့အခါ ရေရှည်ခိုင်မာတဲ့ Business Engine တစ်ခု စတင်ဖြစ်ပေါ်လာပါပြီ။”
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
