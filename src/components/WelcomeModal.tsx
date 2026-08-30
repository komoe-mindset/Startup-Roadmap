import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-[#d9d5ca] bg-[#fbfaf7] text-[#14213d] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-[#14213d] px-6 py-6 text-white sm:px-7">
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
              onClick={handleDismiss}
              className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <h2 className="mt-3 text-xl font-black sm:text-2xl">
            AI Startup Roadmap မှ ကြိုဆိုပါတယ် 👋
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="space-y-3 text-sm leading-relaxed text-[#4d566b]">
            <p className="font-bold text-[#14213d]">
              ဒီ Roadmap ကို 8 Stages အဖြစ် လေ့လာနိုင်ပါတယ်။ Startup Idea ရှိရုံနဲ့ မလုံလောက်ပါဘူး။
            </p>

            <div className="rounded-xl border border-[#dfdcd3] bg-[#f0eee8] p-3 text-center text-xs font-black text-[#14213d]">
              Problem → Customer → Offer → Leads → Sales → Delivery → Operations → Growth
            </div>

            <p className="font-medium text-[#14213d]">
              ဆိုတဲ့ Business System တစ်ခုလုံးကို နားလည်ဖို့ ဒီ Website က ကူညီပေးပါမယ်။
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2.5 pt-2">
            <Button
              className="w-full justify-between rounded-xl bg-[#14213d] text-white hover:bg-[#203156] py-5 font-extrabold"
              onClick={() => handleAction(onStartIntroduction)}
            >
              <span className="flex items-center gap-2">
                <Rocket className="size-4 text-[#f6c85f]" />
                2-Minute Introduction ဖတ်မယ်
              </span>
              <ArrowRight className="size-4" />
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                className="justify-center rounded-xl border-[#d0cbbe] bg-white font-bold text-[#14213d] hover:bg-[#f3f1eb]"
                onClick={() => handleAction(onStartStage1)}
              >
                <Compass className="mr-1.5 size-4 text-[#e8693e]" />
                Start Stage 1
              </Button>

              <Button
                variant="outline"
                className="justify-center rounded-xl border-[#d0cbbe] bg-white font-bold text-[#14213d] hover:bg-[#f3f1eb]"
                onClick={() => handleAction(onReadStory)}
              >
                <BookOpen className="mr-1.5 size-4 text-[#4f7cff]" />
                Read Ko Moe Story
              </Button>
            </div>
          </div>

          {/* Don't show again checkbox */}
          <div className="mt-4 flex items-center justify-between border-t border-[#dfdcd3] pt-4 text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-[#687085]">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#14213d] focus:ring-0"
              />
              <span>နောက်တစ်ခါ မပြတော့ပါ</span>
            </label>
            <button
              onClick={handleDismiss}
              className="font-bold text-[#687085] hover:text-[#14213d]"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
