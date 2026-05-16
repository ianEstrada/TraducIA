"use client";

import { useState, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import TranslateForm from "@/components/TranslateForm";
import TranslationOutput from "@/components/TranslationOutput";
import CulturalCard from "@/components/CulturalCard";
import { translateAction } from "@/actions/translate";
import { resumeAction } from "@/actions/resume";
import type { TranslateActionState } from "@/actions/translate";
import type { ResumeData } from "@/actions/resume";

const initialState: TranslateActionState = { success: false };

export default function HomeClient() {
  const [state, formAction] = useFormState(translateAction, initialState);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const fromOauth = searchParams.get("from") === "oauth";

  useEffect(() => {
    if (fromOauth) {
      const t = setTimeout(() => { router.replace("/"); router.refresh(); }, 200);
      return () => clearTimeout(t);
    }
  }, [fromOauth, router]);

  const resumeId = searchParams.get("resume");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeLoading, setResumeLoading] = useState(!!resumeId);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    if (!resumeId) { setResumeData(null); setResumeLoading(false); setResumeError(""); return; }
    setResumeLoading(true);
    resumeAction(resumeId)
      .then((r) => { if (r.success && r.data) { setResumeData(r.data); setRefreshKey((k) => k + 1); } else setResumeError(r.error || "Failed"); })
      .catch(() => setResumeError("Failed"))
      .finally(() => setResumeLoading(false));
  }, [resumeId]);

  useEffect(() => {
    if (state.success && resultsRef.current) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [state.success]);

  useEffect(() => { if (state.success || state.error) setSubmitting(false); }, [state]);

  function handleAction(formData: FormData) { setSubmitting(true); formAction(formData); }

  const resultData = state.success ? state.data : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-surface-800 mb-1">
          Translation Learning Assistant
        </h1>
        <p className="text-surface-400 text-sm max-w-xl mx-auto">
          Translate text and discover culture, history, and grammar behind every language.
        </p>
      </div>

      {resumeId && (
        <div className="mb-4 p-2.5 sm:p-3 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <svg className="w-4 h-4 text-brand-olive shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-surface-700 truncate">
              Resumed{resumeData && <span className="hidden sm:inline"> from history</span>}
            </span>
            {resumeData && (
              <span className="text-xs text-surface-400 truncate hidden sm:inline">
                &mdash; {new Date(resumeData.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {resumeLoading && <span className="text-xs text-surface-300">Loading...</span>}
          </div>
          <button onClick={() => { setResumeData(null); setRefreshKey((k) => k + 1); router.push("/"); }} className="text-xs font-medium text-brand-olive hover:text-surface-800 transition-colors shrink-0">
            New
          </button>
        </div>
      )}

      {resumeError && <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{resumeError}</div>}
      {state.error && <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{state.error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card min-h-[380px] flex flex-col">
          {resumeLoading && resumeId ? (
            <div className="animate-pulse flex-1 space-y-4 p-2">
              <div className="h-48 bg-surface-100 rounded-2xl" />
              <div className="flex gap-4">
                <div className="h-10 flex-1 bg-surface-100 rounded-xl" />
                <div className="h-10 flex-1 bg-surface-100 rounded-xl" />
              </div>
            </div>
          ) : (
            <TranslateForm key={refreshKey} action={handleAction} isLoading={submitting}
              initialText={resumeData?.originalText} initialSourceLanguage={resumeData?.sourceLanguage} initialTargetLanguage={resumeData?.targetLanguage} />
          )}
        </div>

        <div className="card min-h-[380px] flex flex-col">
          <TranslationOutput
            translatedText={resultData?.translatedText || ""}
            targetLanguage={resultData?.targetLanguage || (resumeData?.targetLanguage || "en")}
            confidence={resultData?.confidence}
            isLoading={submitting}
            originalText={resultData?.originalText}
            responseLanguage={resultData?.settingsLanguage}
          />
        </div>
      </div>

      {resultData && (
        <div ref={resultsRef}>
          <CulturalCard notes={resultData.culturalNotes} targetLanguage={resultData.targetLanguage} sourceLanguage={resultData.sourceLanguage} />
        </div>
      )}
    </div>
  );
}
