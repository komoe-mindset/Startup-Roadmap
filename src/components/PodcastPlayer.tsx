import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Compass,
  Layers,
  AlertCircle,
  X,
  Radio,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import {
  PODCAST_AUDIO_URL,
  PODCAST_TOPICS,
  PODCAST_METADATA_BADGES,
} from "../data/podcastData";

const STORAGE_KEY = "ai_startup_podcast_progress_v1";

interface PodcastPlayerProps {
  onScrollToFocusFinder: () => void;
  onScrollToRoadmap: () => void;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  onScrollToFocusFinder,
  onScrollToRoadmap,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedPosition, setSavedPosition] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);
  const [isMainCardVisible, setIsMainCardVisible] = useState(true);
  const [isMiniPlayerDismissed, setIsMiniPlayerDismissed] = useState(false);

  // Restore saved playback position from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentTime === "number" && parsed.currentTime > 5) {
          setSavedPosition(parsed.currentTime);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // IntersectionObserver to detect when the main Podcast section is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainCardVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Format time in MM:SS or HH:MM:SS
  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const totalSeconds = Math.floor(secs);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Throttled save of playback position
  const saveProgress = useCallback((time: number, dur: number) => {
    if (time > 5 && dur > 0 && time < dur - 5) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentTime: Math.floor(time),
            duration: Math.floor(dur),
            updatedAt: Date.now(),
          })
        );
      } catch {
        // Ignore localStorage errors
      }
    }
  }, []);

  // Audio Event Handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      setDuration(dur);
      setHasError(false);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || duration;
      setCurrentTime(cur);

      // Save every few seconds
      saveProgress(cur, dur);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
    setIsMiniPlayerDismissed(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setSavedPosition(null);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
    setErrorMessage("Audio ဖိုင်ကို ဖွင့်ရန် အခက်အခဲရှိနေပါသည်။ အောက်ပါ Direct Link ဖြင့်လည်း နားဆင်နိုင်ပါသည်။");
  };

  // User Actions
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setHasError(false);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio playback error:", err);
          setHasError(true);
          setErrorMessage("Playback ကို စတင်၍မရပါ။ Browser settings သို့မဟုတ် အင်တာနက်ချိတ်ဆက်မှုကို စစ်ဆေးပါ။");
        });
      }
    }
  };

  const handleResumeSavedPosition = () => {
    if (!audioRef.current || savedPosition === null) return;
    audioRef.current.currentTime = savedPosition;
    setCurrentTime(savedPosition);
    audioRef.current.play().catch(() => {});
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsCompleted(false);
    audioRef.current.play().catch(() => {});
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Hidden/Native Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        onError={handleError}
        className="hidden"
      >
        <source src={PODCAST_AUDIO_URL} type="audio/mpeg" />
        သင့် Browser မှာ Audio Player ကို အသုံးပြု၍မရပါ။
      </audio>

      {/* Main Podcast Card */}
      <section
        aria-label="Myanmar Startup Roadmap Podcast"
        className="relative overflow-hidden rounded-[28px] border border-[#d9d5ca] bg-gradient-to-br from-[#14213d] via-[#1a2b50] to-[#0f182d] p-6 sm:p-8 text-white shadow-lg transition-all"
      >
        {/* Background decorative ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#f6c85f]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-[#8c70db]/15 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f6c85f]/30 bg-[#f6c85f]/10 px-3.5 py-1 text-xs font-black tracking-wide text-[#f6c85f]">
              <Headphones className="size-4 animate-pulse" />
              <span>🎧 မြန်မာဘာသာ PODCAST</span>
            </div>

            <p className="text-xs font-semibold text-[#a8b8d8]">
              စာမဖတ်ခင် အရင်နားထောင်ပြီး နားလည်ချင်သူများအတွက်
            </p>
          </div>

          {/* Heading and Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-black leading-snug sm:text-3xl sm:leading-normal text-white">
              စာမဖတ်ခင် Podcast နားထောင်ပြီး Startup Roadmap ကို နားလည်ပါ
            </h3>
            <p className="max-w-3xl text-sm leading-relaxed text-[#c7d0e4]">
              Startup စိတ်ကူးကနေ Customer ရရှိခြင်း၊ ရောင်းချခြင်း၊ ရလဒ်ပေးခြင်းနဲ့ စနစ်တကျချဲ့ထွင်ခြင်းအထိ အဆင့် ၈ ဆင့်ကို မြန်မာဘာသာနဲ့ ရိုးရှင်းစွာ ရှင်းပြထားပါတယ်။
            </p>
            <p className="max-w-3xl text-xs font-semibold leading-relaxed text-[#9bb0d8]">
              အသေးစိတ်စာတွေကို မဖတ်ခင် Roadmap တစ်ခုလုံးကို အရင်နားထောင်နိုင်ပါတယ်။ နားထောင်ပြီးရင် သင့်လုပ်ငန်းအတွက် အခုအရင်လုပ်သင့်တဲ့အဆင့်ကို ဆက်လက်ရှာဖွေပါ။
            </p>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {PODCAST_METADATA_BADGES.map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-[#e1e7f5]"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Player Controls Container */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 sm:p-6 backdrop-blur-sm space-y-4">
            {/* Error Message if any */}
            {hasError && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-200">
                <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <p>{errorMessage}</p>
                  <a
                    href={PODCAST_AUDIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-rose-300 underline hover:text-white"
                  >
                    <span>Audio Player အလုပ်မလုပ်ပါက MP3 ကို တိုက်ရိုက်ဖွင့်နားထောင်ပါ</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Custom Interactive Scrubber / Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#bcd3ff]">
                <span>{formatTime(currentTime)}</span>
                <span className="text-[#8fa0c2]">
                  {duration > 0 ? formatTime(duration) : "--:--"}
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Podcast audio progress scrubber"
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#f6c85f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6c85f]"
                  style={{
                    background: `linear-gradient(to right, #f6c85f ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%)`,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Main Play / Pause CTA */}
                <button
                  type="button"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? "Podcast ခေတ္တရပ်မယ်" : "Podcast စနားထောင်မယ်"}
                  className="inline-flex min-h-[44px] items-center gap-2.5 rounded-xl bg-[#f6c85f] px-5 py-2.5 text-xs font-black text-[#14213d] shadow-md transition hover:bg-[#e0b347] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f6c85f] cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="size-4 fill-current" />
                      <span>⏸ ခေတ္တရပ်မယ်</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-4 fill-current" />
                      <span>▶ Podcast စနားထောင်မယ်</span>
                    </>
                  )}
                </button>

                {/* Resume from saved position button (if available) */}
                {savedPosition !== null && savedPosition > 10 && !isPlaying && (
                  <button
                    type="button"
                    onClick={handleResumeSavedPosition}
                    aria-label={`နောက်ဆုံးနားထောင်ခဲ့သောနေရာ ${formatTime(savedPosition)} မှ ဆက်လက်နားထောင်မည်`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-[#bcd3ff] transition hover:bg-white/20 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white cursor-pointer"
                  >
                    <Bookmark className="size-3.5 text-[#f6c85f]" />
                    <span>နောက်ဆုံးနားထောင်ခဲ့တဲ့နေရာကနေ ဆက်မယ် ({formatTime(savedPosition)})</span>
                  </button>
                )}

                {/* Restart button if progress exists */}
                {currentTime > 10 && (
                  <button
                    type="button"
                    onClick={handleRestart}
                    aria-label="အစကနေ ပြန်နားထောင်မည်"
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-[#91a2c7] transition hover:bg-white/15 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>အစကနေ ပြန်နားထောင်မယ်</span>
                  </button>
                )}
              </div>

              {/* Secondary CTA to Focus Finder */}
              <button
                type="button"
                onClick={onScrollToFocusFinder}
                aria-label="ကျွန်တော့် လက်ရှိအဆင့်ကို ရှာမည်"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#8c70db]/40 bg-[#8c70db]/20 px-4 py-2 text-xs font-extrabold text-[#d8cbff] transition hover:bg-[#8c70db]/40 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8c70db] cursor-pointer"
              >
                <Compass className="size-4 text-[#f6c85f]" />
                <span>ကျွန်တော့် လက်ရှိအဆင့်ကို ရှာမယ်</span>
              </button>
            </div>

            {/* Native HTML5 Audio Controls Fallback/Option */}
            <div className="pt-2">
              <audio
                controls
                preload="metadata"
                className="w-full h-10 opacity-90 brightness-95"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onError={handleError}
                aria-label="Native audio controls for Startup Roadmap podcast"
              >
                <source src={PODCAST_AUDIO_URL} type="audio/mpeg" />
                သင့် Browser မှာ Audio Player ကို အသုံးပြု၍မရပါ။
                <a
                  href={PODCAST_AUDIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline text-[#f6c85f]"
                >
                  Audio Player အလုပ်မလုပ်ပါက MP3 ကို တိုက်ရိုက်ဖွင့်နားထောင်ပါ
                </a>
              </audio>
            </div>
          </div>

          {/* Post-listening Completion Card (Appears after audio finishes) */}
          {isCompleted && (
            <div className="rounded-2xl border-2 border-[#1da98a] bg-[#123626] p-5 sm:p-6 text-white shadow-md animate-in fade-in slide-in-from-top-3">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#1da98a] text-white">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-lg font-black text-[#a3f0c4]">
                    🎉 Podcast နားထောင်ပြီးပါပြီ
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#e0f7ec]">
                    Startup Roadmap တစ်ခုလုံးကို အခြေခံနားလည်သွားပြီဆိုရင် သင့်လုပ်ငန်းက လက်ရှိဘယ်အဆင့်မှာ ရပ်နေလဲ ဆက်ရှာကြည့်ပါ။
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onScrollToFocusFinder}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#f6c85f] px-4 py-2 text-xs font-black text-[#14213d] hover:bg-[#e0b347] transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f6c85f] cursor-pointer"
                    >
                      <Compass className="size-4" />
                      <span>၆၀ စက္ကန့်နဲ့ လက်ရှိအဆင့်ကို ရှာမယ်</span>
                    </button>
                    <button
                      type="button"
                      onClick={onScrollToRoadmap}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white cursor-pointer"
                    >
                      <Layers className="size-4 text-[#1da98a]" />
                      <span>အဆင့် ၈ ဆင့်ကို အသေးစိတ်ကြည့်မယ်</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible "ဒီ Podcast မှာ ဘာတွေသိရမလဲ?" Summary Section */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
              aria-expanded={isTopicsExpanded}
              aria-label="ဒီ Podcast မှာ ဘာတွေသိရမလဲ? ခေါင်းစဉ်များ ဖွင့်ရန်/ပိတ်ရန်"
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-white/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="size-4 text-[#f6c85f]" />
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  ဒီ Podcast မှာ ဘာတွေသိရမလဲ? (အဓိက အကြောင်းအရာ ၈ ချက်)
                </span>
              </div>
              {isTopicsExpanded ? (
                <ChevronUp className="size-4 text-[#bcd3ff]" />
              ) : (
                <ChevronDown className="size-4 text-[#bcd3ff]" />
              )}
            </button>

            {isTopicsExpanded && (
              <div className="border-t border-white/10 p-4 sm:p-5 space-y-4 text-xs sm:text-sm leading-relaxed text-[#c7d0e4]">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {PODCAST_TOPICS.map((topic) => (
                    <div
                      key={topic.number}
                      className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f6c85f] text-[10px] font-black text-[#14213d]">
                        {topic.number}
                      </span>
                      <span className="font-semibold text-white">
                        {topic.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#f6c85f]/30 bg-[#f6c85f]/10 p-3.5 text-xs font-semibold leading-relaxed text-[#ffe8a3]">
                  💡 <strong>အဓိက သတိပြုရန် -</strong> Podcast နားထောင်ပြီးတာနဲ့ အဆင့်အားလုံးကို တစ်ခါတည်းလုပ်ဖို့ မလိုပါဘူး။ သင့်လုပ်ငန်းကို လက်ရှိတားနေတဲ့အဆင့်ကို အရင်ရှာပြီး အဲဒီအဆင့်အတွက် လက်တွေ့သက်သေတစ်ခု ရအောင်စလုပ်ပါ။
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Mini Player (appears when main card is scrolled out of view and audio is active) */}
      {!isMainCardVisible && (isPlaying || currentTime > 0) && !isMiniPlayerDismissed && (
        <div
          role="region"
          aria-label="Sticky Podcast Mini Player"
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-xl rounded-2xl border border-white/20 bg-[#14213d]/95 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5"
        >
          <div className="flex items-center justify-between gap-3">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "ခေတ္တရပ်ရန်" : "ဆက်လက်နားထောင်ရန်"}
              className="grid size-11 min-h-[44px] min-w-[44px] shrink-0 place-items-center rounded-xl bg-[#f6c85f] text-[#14213d] shadow-sm hover:bg-[#e0b347] transition outline-none focus-visible:ring-2 focus-visible:ring-[#f6c85f] cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Info & Scrubber */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-black text-white">
                  🎧 Myanmar Podcast • Startup Roadmap
                </p>
                <span className="text-[11px] font-mono text-[#bcd3ff]">
                  {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "--:--"}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                aria-label="Sticky podcast progress scrubber"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#f6c85f] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #f6c85f ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%)`,
                }}
              />
            </div>

            {/* Close / Minimize Button */}
            <button
              type="button"
              onClick={() => setIsMiniPlayerDismissed(true)}
              aria-label="Mini player ကို ပိတ်မည်"
              className="grid size-9 min-h-[44px] min-w-[44px] shrink-0 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
