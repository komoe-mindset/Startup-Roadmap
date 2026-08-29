import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  Layers,
  Lightbulb,
  ListOrdered,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { STORY_STAGES, STORY_SUMMARY, StoryStage } from "@/data/storyData";
import { GeminiGemIcon } from "@/components/GeminiGemIcon";

const GEMINI_ASSISTANT_URL = "https://gemini.google.com/gem/10aOjpzRICEEWbY6Z3ICDQRr88mlg3Lc1?usp=sharing";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stageId: string) => void;
  initialStageId?: string;
}

export function StoryModal({
  isOpen,
  onClose,
  onSelectStage,
  initialStageId,
}: StoryModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"stepper" | "all">("stepper");

  useEffect(() => {
    if (initialStageId) {
      const idx = STORY_STAGES.findIndex((s) => s.id === initialStageId);
      if (idx !== -1) setCurrentIdx(idx);
    }
  }, [initialStageId, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        setCurrentIdx((prev) => (prev + 1) % STORY_STAGES.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentIdx(
          (prev) => (prev - 1 + STORY_STAGES.length) % STORY_STAGES.length
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStage: StoryStage = STORY_STAGES[currentIdx];
  const percent = Math.round(((currentIdx + 1) / STORY_STAGES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-[#26304a] bg-[#0b1020] text-[#eef3ff] shadow-[0_25px_70px_rgba(0,0,0,0.7)]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#26304a] bg-[#121a2f]/90 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#4f7cff] text-white shadow-md shadow-blue-500/20">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#8ea8df]">
                AI STARTUP STORY MODE
              </p>
              <h2 className="text-sm font-extrabold sm:text-base">
                Ko Moe ရဲ့ AI Startup Journey
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="hidden items-center rounded-xl border border-[#26304a] bg-[#0b1020] p-0.5 sm:flex">
              <button
                onClick={() => setViewMode("stepper")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  viewMode === "stepper"
                    ? "bg-[#253250] text-white"
                    : "text-[#8ea8df] hover:text-white"
                }`}
              >
                <Compass className="size-3.5" /> အဆင့်လိုက်
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  viewMode === "all"
                    ? "bg-[#253250] text-white"
                    : "text-[#8ea8df] hover:text-white"
                }`}
              >
                <ListOrdered className="size-3.5" /> အကုန်ဖတ်ရန်
              </button>
            </div>

            <a
              href={GEMINI_ASSISTANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-[#7c3aed]/50 bg-gradient-to-r from-[#4f46e5]/40 to-[#7c3aed]/40 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:border-[#a78bfa] hover:from-[#4f46e5]/60 hover:to-[#7c3aed]/60"
              title="Open Gemini Custom Gem for personalized AI Startup guidance"
            >
              <GeminiGemIcon className="size-3.5" />
              <span className="hidden sm:inline">AI Gem Mentor</span>
              <ExternalLink className="size-3 opacity-75" />
            </a>

            <a
              href="./story.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-xl border border-[#26304a] bg-[#18223b] px-3 py-1.5 text-xs font-bold text-[#bcd3ff] transition hover:bg-[#253250] hover:text-white md:flex"
              title="Open standalone offline HTML page in new tab"
            >
              <ExternalLink className="size-3.5" /> Standalone HTML
            </a>

            <button
              onClick={onClose}
              className="grid size-9 place-items-center rounded-xl border border-[#26304a] bg-[#18223b] text-[#aeb9d6] transition hover:bg-[#253250] hover:text-white"
              aria-label="Close story modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          {/* Introductory Hero Quote */}
          <div className="mb-6 rounded-2xl border border-[#26304a] bg-[#121a2f] p-5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#8ea8df]">
              <Sparkles className="size-3.5 text-[#f6c85f]" />
              Storytelling Explanation
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#c7d0e4]">
              Idea တစ်ခုကနေ Customer ရလာတဲ့အထိ၊ Result ပေးနိုင်တဲ့ System တစ်ခုတည်ဆောက်ပြီး Growth ထိ သွားမယ့် Startup ခရီးစဉ်ကို Story နဲ့ လွယ်လွယ်ကူကူ နားလည်နိုင်အောင် ရေးထားပါတယ်။
            </p>
            <div className="mt-4 rounded-xl border-l-4 border-[#6ea8fe] bg-[#18223b] p-4 text-xs font-semibold leading-6 text-[#eef3ff]">
              {STORY_SUMMARY.quote}
            </div>
          </div>

          {viewMode === "stepper" ? (
            /* STEPPER VIEW */
            <div className="space-y-6">
              {/* Stepper Controls Bar */}
              <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#26304a] bg-[#0b1020]/95 p-3 backdrop-blur">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-[#26304a] bg-[#18223b] text-white hover:bg-[#253250]"
                    onClick={() =>
                      setCurrentIdx(
                        (prev) =>
                          (prev - 1 + STORY_STAGES.length) % STORY_STAGES.length
                      )
                    }
                  >
                    <ArrowLeft className="size-4" /> Previous
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-xl bg-[#4f7cff] text-white shadow hover:bg-[#3b66e3]"
                    onClick={() =>
                      setCurrentIdx((prev) => (prev + 1) % STORY_STAGES.length)
                    }
                  >
                    Next <ArrowRight className="size-4" />
                  </Button>
                </div>

                <div className="flex min-w-[160px] flex-1 items-center gap-3 sm:max-w-xs">
                  <div className="w-full">
                    <div className="mb-1 flex justify-between text-[10px] font-bold text-[#8ea8df]">
                      <span>STAGE PROGRESS</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress
                      value={percent}
                      className="h-2 bg-[#26304a] [&_[data-slot=progress-indicator]]:bg-[#6ea8fe]"
                    />
                  </div>
                </div>

                <div className="text-right text-xs font-black text-[#bcd3ff]">
                  {currentIdx + 1} / {STORY_STAGES.length}
                </div>
              </div>

              {/* Stage Quick Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {STORY_STAGES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition ${
                      idx === currentIdx
                        ? "bg-[#6ea8fe] text-[#0b1020]"
                        : "border border-[#26304a] bg-[#121a2f] text-[#8ea8df] hover:text-white"
                    }`}
                  >
                    Stage {s.number}
                  </button>
                ))}
              </div>

              {/* Active Stage Story Card */}
              <div className="rounded-[24px] border border-[#26304a] bg-[#121a2f] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-block rounded-full bg-[#1b2b4a] px-3.5 py-1 text-xs font-extrabold text-[#bcd3ff]">
                    {currentStage.stageBadge}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-xl border border-[#26304a] bg-[#18223b] text-xs font-bold text-[#8ea8df] hover:bg-[#253250] hover:text-white"
                    onClick={() => {
                      onSelectStage(currentStage.id);
                      onClose();
                    }}
                  >
                    Roadmap မှာ စစ်ဆေးမယ် <ArrowRight className="size-3.5" />
                  </Button>
                </div>

                <h3 className="mt-4 text-xl font-black text-white sm:text-2xl">
                  {currentStage.title}
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#c7d0e4]">
                  {currentStage.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {currentStage.quote && (
                  <div className="mt-5 rounded-xl border-l-4 border-[#6ea8fe] bg-[#18223b] p-4 text-xs font-semibold leading-6 text-[#eef3ff]">
                    {currentStage.quote}
                  </div>
                )}

                {currentStage.flow && (
                  <div className="mt-5 rounded-xl border border-[#26304a] bg-[#090e1a] p-4 font-mono text-xs leading-6 text-[#8ea8df]">
                    <p className="mb-2 font-sans text-[10px] font-black uppercase tracking-widest text-[#6ea8fe]">
                      Standard Operating Workflow
                    </p>
                    <div className="space-y-1">
                      {currentStage.flow.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[#4f7cff]">
                            {idx + 1 < currentStage.flow!.length ? "↓" : "✓"}
                          </span>
                          <span className="font-bold text-white">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#245b41] bg-[#123626] p-4 text-xs font-semibold leading-relaxed text-[#a3f0c4]">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#f6c85f]" />
                  <div>
                    <span className="font-black text-white">Lesson: </span>
                    {currentStage.lesson}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-[#26304a] pt-4">
                  <button
                    onClick={() =>
                      setCurrentIdx(
                        (prev) =>
                          (prev - 1 + STORY_STAGES.length) % STORY_STAGES.length
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-[#8ea8df] transition hover:text-white"
                  >
                    <ArrowLeft className="size-4" /> Previous Stage
                  </button>

                  <Button
                    onClick={() => {
                      if (currentIdx === STORY_STAGES.length - 1) {
                        onClose();
                      } else {
                        setCurrentIdx((prev) => prev + 1);
                      }
                    }}
                    className="rounded-xl bg-[#4f7cff] font-bold text-white hover:bg-[#3b66e3]"
                  >
                    {currentIdx === STORY_STAGES.length - 1
                      ? "Finish & Open Roadmap"
                      : "Next Stage"}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* ALL STAGES VIEW */
            <div className="space-y-6">
              {STORY_STAGES.map((s) => (
                <div
                  key={s.id}
                  className="rounded-[24px] border border-[#26304a] bg-[#121a2f] p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-block rounded-full bg-[#1b2b4a] px-3.5 py-1 text-xs font-extrabold text-[#bcd3ff]">
                      {s.stageBadge}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-xl border border-[#26304a] bg-[#18223b] text-xs font-bold text-[#8ea8df] hover:bg-[#253250] hover:text-white"
                      onClick={() => {
                        onSelectStage(s.id);
                        onClose();
                      }}
                    >
                      Open in Roadmap <ArrowRight className="size-3.5" />
                    </Button>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-white sm:text-xl">
                    {s.title}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-[#c7d0e4]">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {s.quote && (
                    <div className="mt-4 rounded-xl border-l-4 border-[#6ea8fe] bg-[#18223b] p-3 text-xs font-semibold leading-6 text-[#eef3ff]">
                      {s.quote}
                    </div>
                  )}

                  {s.flow && (
                    <div className="mt-4 rounded-xl border border-[#26304a] bg-[#090e1a] p-3 font-mono text-xs leading-5 text-[#8ea8df]">
                      <div className="space-y-1">
                        {s.flow.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[#4f7cff]">
                              {idx + 1 < s.flow!.length ? "↓" : "✓"}
                            </span>
                            <span className="text-white">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl border border-[#245b41] bg-[#123626] p-3 text-xs font-semibold leading-relaxed text-[#a3f0c4]">
                    <b className="text-white">💡 Lesson: </b>
                    {s.lesson}
                  </div>
                </div>
              ))}

              {/* Summary Section */}
              <div className="rounded-[24px] border border-[#26304a] bg-[#18223b] p-6 sm:p-7">
                <h3 className="text-base font-black text-white sm:text-lg">
                  🧭 Ko Moe ရဲ့ Startup Journey တစ်ကြောင်းတည်းနဲ့
                </h3>

                <div className="mt-4 rounded-xl border border-[#26304a] bg-[#090e1a] p-4 font-mono text-xs text-[#8ea8df]">
                  <div className="flex flex-wrap items-center gap-2">
                    {STORY_SUMMARY.flowSteps.map((step, i) => (
                      <span key={step} className="flex items-center gap-2">
                        <span className="rounded bg-[#253250] px-2 py-0.5 font-bold text-white">
                          {step}
                        </span>
                        {i < STORY_SUMMARY.flowSteps.length - 1 && (
                          <span className="text-[#4f7cff]">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border-l-4 border-[#6ea8fe] bg-[#121a2f] p-4 text-xs font-bold leading-6 text-[#eef3ff]">
                  {STORY_SUMMARY.oneLiner}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#7c3aed]/40 bg-gradient-to-r from-[#4f46e5]/20 to-[#7c3aed]/20 p-4">
                  <div className="flex items-center gap-3">
                    <GeminiGemIcon className="size-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">AI Startup Mentor Gem ဖြင့် ဆွေးနွေးပါ</p>
                      <p className="text-[11px] text-[#c7d0e4]">ဒီခရီးစဉ်အတိုင်း သင့်ကိုယ်ပိုင် Idea ကို Gemini Custom Gem ထံ အဆင့်လိုက် တိုင်ပင်နိုင်ပါသည်</p>
                    </div>
                  </div>
                  <a
                    href={GEMINI_ASSISTANT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-400/50 bg-[#4f46e5] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#4338ca]"
                  >
                    <span>Gemini Gem ဖွင့်မည်</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#26304a] bg-[#121a2f] px-5 py-3.5 sm:px-7">
          <p className="text-xs text-[#8ea8df]">
            💡 ကီးဘုတ်မြှား (← / →) ဖြင့် အဆင့်များကို ကူးပြောင်းဖတ်ရှုနိုင်ပါသည်။
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[#26304a] bg-[#18223b] text-white hover:bg-[#253250]"
              onClick={onClose}
            >
              ပိတ်မည်
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
