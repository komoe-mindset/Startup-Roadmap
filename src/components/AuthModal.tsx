import React, { useState } from "react";
import {
  User, LogIn, LogOut, Sparkles, CheckCircle2, ShieldAlert, X, AlertCircle,
  CloudCheck, CloudOff, Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSavedTimestamp?: number | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lastSavedTimestamp }) => {
  const {
    user,
    loading,
    isConfigured,
    error,
    signInAnonymouslyWithName,
    signInWithGoogle,
    updateUserDisplayName,
    signOutUser,
    clearError,
  } = useAuth();

  const [inputName, setInputName] = useState(user?.displayName || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnonymousSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!inputName.trim()) {
      setFormError("ကျေးဇူးပြု၍ သင့်နာမည် သို့မဟုတ် Startup အမည် ထည့်ပါ");
      return;
    }

    try {
      if (user) {
        await updateUserDisplayName(inputName);
        setIsEditingName(false);
      } else {
        await signInAnonymouslyWithName(inputName);
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    clearError();
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs md:items-center md:p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl border-t border-x border-[#d9d5ca] bg-white p-6 shadow-2xl transition-all md:rounded-3xl md:border animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="mx-auto -mt-2 mb-3.5 h-1.5 w-12 rounded-full bg-[#d0cbbe] md:hidden" />

        {/* Close Button */}
        <button
          type="button"
          aria-label="ပိတ်ရန် (Close)"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#687085] hover:bg-[#f0eee8] hover:text-[#14213d] outline-none focus-visible:ring-2 focus-visible:ring-[#14213d] cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-[#14213d] text-white shadow-sm">
            <User className="size-5 text-[#f6c85f]" />
          </div>
          <div>
            <h2 id="auth-modal-title" className="text-lg font-black text-[#14213d]">
              {user ? "Founder Profile & Sync" : "Founder အကောင့် ချိတ်ဆက်ရန်"}
            </h2>
            <p className="text-xs text-[#687085]">
              {user
                ? "တိုးတက်မှုများကို အလိုအလျောက် သိမ်းဆည်းထားသည်"
                : "အမည်ထည့်ပြီး ချက်ချင်း သို့မဟုတ် Google ဖြင့် စတင်ပါ"}
            </p>
          </div>
        </div>

        {/* Offline notice if not configured */}
        {!isConfigured && (
          <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#f6c85f]/50 bg-[#fffdf0] p-3 text-xs text-[#825c00]">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-[#b58100]" />
            <div>
              <span className="font-bold">Offline / Local Mode Active:</span> Firebase keys are not yet configured in environment variables. Local progress will be saved in your browser storage.
            </div>
          </div>
        )}

        {/* Error message if any */}
        {(error || formError) && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <div className="flex-1">{error || formError}</div>
          </div>
        )}

        {/* Logged in state */}
        {user ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e4e1d7] bg-[#f9f8f5] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#687085]">
                  Status
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1da98a]/10 px-2.5 py-0.5 text-xs font-extrabold text-[#1da98a]">
                  <CheckCircle2 className="size-3" />
                  {user.isAnonymous ? "Anonymous Founder" : "Google Linked"}
                </span>
              </div>

              {/* Display Name section */}
              <div className="mt-3">
                <label className="text-xs font-bold text-[#687085]">Founder / Startup Name</label>
                {isEditingName ? (
                  <form onSubmit={handleAnonymousSubmit} className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="သင့်အမည် သို့မဟုတ် Startup အမည်"
                      className="flex-1 rounded-xl border border-[#ccc7bb] bg-white px-3 py-1.5 text-xs font-semibold text-[#14213d] outline-none focus:border-[#14213d] focus:ring-1 focus:ring-[#14213d]"
                    />
                    <Button size="sm" type="submit" className="rounded-xl bg-[#14213d] text-xs font-bold text-white">
                      သိမ်းမည်
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="rounded-xl text-xs"
                    >
                      ပယ်ဖျက်
                    </Button>
                  </form>
                ) : (
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-black text-[#14213d]">{user.displayName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputName(user.displayName);
                        setIsEditingName(true);
                      }}
                      className="text-xs font-bold text-[#4f7cff] hover:underline"
                    >
                      အမည်ပြောင်းရန်
                    </button>
                  </div>
                )}
              </div>

              {/* Cloud Sync Status info */}
              <div className="mt-3 flex items-center justify-between border-t border-[#e4e1d7] pt-2.5 text-xs">
                <span className="font-bold text-[#687085]">Cloud Sync</span>
                <span className="inline-flex items-center gap-1.5 font-bold">
                  {isConfigured ? (
                    <>
                      <CloudCheck className="size-4 text-[#1da98a]" />
                      <span className="text-[#1da98a]">Synced to Firestore</span>
                    </>
                  ) : (
                    <>
                      <CloudOff className="size-4 text-[#8a8f9b]" />
                      <span className="text-[#687085]">Local Mode (Offline)</span>
                    </>
                  )}
                </span>
              </div>
              {lastSavedTimestamp && (
                <div className="mt-1 text-right text-[10px] text-[#8a8f9b]">
                  Last saved: {new Date(lastSavedTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
              )}

              {/* UID info */}
              <div className="mt-2 text-[10px] text-[#8a8f9b]">
                <span className="font-semibold">User ID:</span> {user.uid}
              </div>
            </div>

            {/* If anonymous and Firebase configured, offer Google Linking */}
            {user.isAnonymous && isConfigured && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Sparkles className="size-4 text-blue-600" />
                  <span>အကောင့်အမြဲသိမ်းဆည်းရန် Google ဖြင့် ချိတ်ပါ</span>
                </div>
                <p className="mt-1 text-[11px] text-blue-700">
                  စက်ပစ္စည်းအစုံမှ သင်၏ Checklist နှင့် Roadmap တိုးတက်မှုကို ဆက်လက်သုံးနိုင်မည်။
                </p>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="mt-2.5 w-full rounded-xl border-blue-200 bg-white text-xs font-bold text-blue-900 hover:bg-blue-50"
                >
                  <svg className="mr-1.5 size-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google အကောင့်ဖြင့် ချိတ်ဆက်မည်
                </Button>
              </div>
            )}

            {/* Sign Out Button */}
            <Button
              variant="outline"
              onClick={signOutUser}
              disabled={loading}
              className="w-full rounded-2xl border-[#d9d5ca] text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-2 size-4" />
              အကောင့်မှ ထွက်မည် (Sign Out)
            </Button>
          </div>
        ) : (
          /* Not logged in state */
          <div className="space-y-4">
            {/* Quick Anonymous Sign-in Form */}
            <form onSubmit={handleAnonymousSubmit} className="space-y-3 rounded-2xl border border-[#e4e1d7] bg-[#fbfaf7] p-4">
              <div>
                <label className="text-xs font-bold text-[#14213d]">
                  သင့်အမည် သို့မဟုတ် Startup အမည် (Password မလိုပါ)
                </label>
                <input
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="ဥပမာ - Ko Moe / Mandalay Tech"
                  className="mt-1.5 w-full rounded-xl border border-[#ccc7bb] bg-white px-3.5 py-2 text-xs font-semibold text-[#14213d] outline-none transition focus:border-[#14213d] focus:ring-1 focus:ring-[#14213d]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#14213d] text-xs font-bold text-white hover:bg-[#203156]"
              >
                <LogIn className="mr-2 size-4" />
                {loading ? "စတင်နေပါသည်..." : "Password မလိုဘဲ ချက်ချင်း စတင်မည်"}
              </Button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d9d5ca]" />
              </div>
              <span className="relative bg-white px-2 text-[10px] font-bold uppercase text-[#8a8f9b]">
                သို့မဟုတ်
              </span>
            </div>

            {/* Google Sign-in button */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full rounded-2xl border-[#ccc7bb] bg-white text-xs font-bold text-[#14213d] shadow-xs hover:bg-[#f3f1eb]"
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google အကောင့်ဖြင့် ဝင်မည်
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
