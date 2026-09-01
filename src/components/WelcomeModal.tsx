import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Rocket,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartIntroduction: () => void;
  onStartStage1: () => void;
  onReadStory: () => void;
}

export function WelcomeModal({
  isOpen,
  onClose,
  onStartIntroduction,
  onStartStage1,
  onReadStory,
}: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(true);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("startup-onboarding-dismissed", "true");
      } catch {}
    }
    onClose();
  };

  const handleAction = (actionFn: () => void) => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("startup-onboarding-dismissed", "true");
      } catch {}
    }
    actionFn();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-black/60 backdrop-blur-sm md:items-center md:p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl border-t border-x border-[#d9d5ca] bg-[#fbfaf7] text-[#14213d] shadow-2xl md:rounded-[28px] md:border animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-[#14213d] px-6 pb-6 pt-3.5 text-white sm:px-7 md:pt-6">
          {/* Mobile Drag Handle */}
          <div className="mx-auto mb-3.5 h-1.5 w-12 rounded-full bg-white/25 md:hidden" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-white/10 text-[#f6c85f]">
                <Sparkles className="size-4" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-[#91a2c7]">
                Quick Orientation
              </span>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white cursor-pointer"
              aria-label="ပိတ်မည် (Close)"
            >
              <X className="size-4" />
            </button>
          </div>
          <h2 id="welcome-modal-title" className="mt-3 text-xl font-black sm:text-2xl">
            AI Startup Roadmap မှ ကြိုဆိုပါတယ် 👋
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="space-y-3 text-sm leading-relaxed text-[#4d566b]">
            <p className="font-semibold text-[#14213d]">
              Startup စိတ်ကူးရှိပေမယ့် ဘယ်ကစရမလဲ မသိသေးသူတွေအတွက် ဒီ Roadmap ကို ဖန်တီးထားပါတယ်။
            </p>

            <p className="text-xs leading-6 text-[#4d566b]">
              Website သို့မဟုတ် App အရင်တည်ဆောက်ဖို့ထက် Customer ရဲ့ ပြဿနာကို အရင်နားလည်ရပါမယ်။ အဲဒီနောက် ရောင်းချနိုင်တဲ့ ဖြေရှင်းချက်၊ Customer ရရှိရေး၊ ရလဒ်ပေးရေးနဲ့ စနစ်တကျချဲ့ထွင်ရေးအထိ အဆင့်လိုက် လုပ်ဆောင်နိုင်ပါတယ်။
            </p>

            <div className="rounded-xl border border-[#dfdcd3] bg-[#f0eee8] p-3 text-center text-xs font-black text-[#14213d]">
              Problem → Customer → Offer → Leads → Sales → Delivery → Retention → Operations
            </div>

            <p className="font-medium text-[#14213d]">
              အရင်ဆုံး မေးခွန်းတိုတွေကို ဖြေပြီး သင်လက်ရှိစတင်သင့်တဲ့အဆင့်ကို ရှာကြည့်ပါ။
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2.5 pt-2">
            <Button
              className="w-full justify-between rounded-xl bg-[#14213d] text-white hover:bg-[#203156] py-5 font-extrabold"
              onClick={() => handleAction(onStartIntroduction)}
              aria-label="လက်ရှိအဆင့်ကို ရှာမယ်"
            >
              <span className="flex items-center gap-2">
                <Rocket className="size-4 text-[#f6c85f]" />
                လက်ရှိအဆင့်ကို ရှာမယ်
              </span>
              <ArrowRight className="size-4" />
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                className="justify-center rounded-xl border-[#d0cbbe] bg-white font-bold text-[#14213d] hover:bg-[#f3f1eb]"
                onClick={() => handleAction(onStartStage1)}
                aria-label="Stage 1 ကနေ စမယ်"
              >
                <Compass className="mr-1.5 size-4 text-[#e8693e]" />
                Stage 1 ကနေ စမယ်
              </Button>

              <Button
                variant="outline"
                className="justify-center rounded-xl border-[#d0cbbe] bg-white font-bold text-[#14213d] hover:bg-[#f3f1eb]"
                onClick={() => handleAction(onReadStory)}
                aria-label="Ko Moe ရဲ့ Story ဖတ်မယ်"
              >
                <BookOpen className="mr-1.5 size-4 text-[#4f7cff]" />
                Ko Moe Story ဖတ်မယ်
              </Button>
            </div>
          </div>

          {/* Don't show again checkbox */}
          <div className="mt-4 flex items-center justify-between border-t border-[#dfdcd3] pt-4 text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-[#687085]">
              <input
                type="checkbox"
                aria-label="နောက်တစ်ခါ မပြတော့ပါ"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#14213d] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14213d]"
              />
              <span>နောက်တစ်ခါ မပြတော့ပါ</span>
            </label>
            <button
              type="button"
              onClick={handleDismiss}
              className="font-bold text-[#687085] hover:text-[#14213d] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14213d] rounded px-1 cursor-pointer"
              aria-label="ကျော်မည်"
            >
              ကျော်မည်
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;
