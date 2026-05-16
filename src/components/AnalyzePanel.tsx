"use client";

import { useState } from "react";
import { analyzeAction } from "@/actions/analyze";
import type { TextAnalysis } from "@/lib/groq";

interface Props {
  text: string;
  responseLanguage: string;
}

export default function AnalyzePanel({ text, responseLanguage }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TextAnalysis | null>(null);

  async function handleAnalyze() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (data) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("text", text);
    formData.set("responseLanguage", responseLanguage);

    try {
      const res = await analyzeAction(null, formData);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Analysis failed.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const trigger = (
    <button
      onClick={handleAnalyze}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
        open
          ? "bg-brand-gold/10 text-brand-olive border border-brand-gold/20"
          : "bg-gradient-to-r from-brand-gold to-brand-olive text-white hover:from-brand-gold/90 hover:to-brand-olive/90 shadow-soft hover:shadow-glow active:scale-[0.98]"
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
      {open ? "Close Analysis" : "Analyze with AI"}
    </button>
  );

  const content = (
    <div className="animate-fade-in">
      {loading && <AnalysisSkeleton />}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {data && <AnalysisResult data={data} />}
    </div>
  );

  return (
    <>
      {/* Mobile: inline collapsible */}
      <div className="lg:hidden">
        {trigger}
        {open && <div className="mt-2">{content}</div>}
      </div>

      {/* Desktop: slide-out overlay from right */}
      <div className="hidden lg:block">
        {trigger}

        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
            <div className="fixed top-0 right-0 z-50 h-full w-[420px] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-800">Text Analysis</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">{content}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4 rounded-xl border border-gray-100 bg-white">
      <div className="h-5 w-24 bg-gray-100 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="h-3 w-3/4 bg-gray-100 rounded" />
      </div>
      <div className="h-5 w-32 bg-gray-100 rounded-full" />
    </div>
  );
}

function AnalysisResult({ data }: { data: TextAnalysis }) {
  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-4">
      {/* Summary */}
      {data.summary && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Summary</span>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      )}

      {data.recommendations.filter(r => r?.trim()).length > 0 && (
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Recommendations</span>
            <ul className="space-y-1">
              {data.recommendations.filter(r => r?.trim()).map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                  <span className="text-primary-500 mt-0.5 shrink-0">&#8226;</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data.tone && (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Tone</span>
            <span className="text-sm text-gray-700 capitalize">{data.tone}</span>
          </div>
        </div>
      )}
    </div>
  );
}
