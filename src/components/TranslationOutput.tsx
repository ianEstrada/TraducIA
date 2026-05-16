"use client";

import { useState } from "react";
import AnalyzePanel from "./AnalyzePanel";

interface Props {
  translatedText: string;
  targetLanguage: string;
  confidence?: number;
  isLoading?: boolean;
  originalText?: string;
  responseLanguage?: string;
}

export default function TranslationOutput({
  translatedText,
  targetLanguage,
  confidence,
  isLoading,
  originalText,
  responseLanguage,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <svg className="animate-spin h-6 w-6 text-brand-gold" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-surface-300">Translating...</span>
        </div>
      </div>
    );
  }

  if (!translatedText) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <svg className="w-10 h-10 text-brand-teal/30 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <p className="text-xs text-surface-300">Translation will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="badge bg-brand-gold/15 text-brand-olive">
          {targetLanguage.toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          {confidence !== undefined && confidence > 0 && (
            <span className="text-2xs text-surface-400 bg-surface-100/80 px-2 py-0.5 rounded-full">
              {Math.round(confidence)}%
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-brand-cream/40 to-white/50 rounded-2xl p-4 overflow-y-auto border border-brand-teal/15 relative">
        <p className="text-surface-800 leading-relaxed whitespace-pre-wrap text-sm pb-8">
          {translatedText}
        </p>

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white
              border border-brand-teal/15 text-surface-400 hover:text-brand-gold transition-all shadow-soft"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {originalText && (
        <div className="mt-2">
          <AnalyzePanel text={originalText} responseLanguage={responseLanguage || targetLanguage} />
        </div>
      )}
    </div>
  );
}
