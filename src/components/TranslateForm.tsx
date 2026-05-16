"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { LANGUAGES } from "@/lib/languages";

interface Props {
  action: (formData: FormData) => void;
  isLoading?: boolean;
  initialText?: string;
  initialSourceLanguage?: string;
  initialTargetLanguage?: string;
}

function SubmitButton({ isLoading }: { isLoading?: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || isLoading;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn-primary w-full text-sm"
    >
      {disabled ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
      ) : (
        "Translate"
      )}
    </button>
  );
}

export default function TranslateForm({
  action,
  isLoading,
  initialText,
  initialSourceLanguage,
  initialTargetLanguage,
}: Props) {
  const [charCount, setCharCount] = useState(initialText?.length || 0);
  const maxChars = 500;

  return (
    <form action={action} className="flex flex-col h-full">
      <div className="flex-1 relative">
        <textarea
          id="text"
          name="text"
          rows={9}
          required
          defaultValue={initialText}
          placeholder="Enter text to translate..."
          className="input flex-1 resize-none text-sm h-full"
          onChange={(e) => setCharCount(e.target.value.length)}
        />
        <span className={`absolute bottom-2 right-2 text-2xs px-1.5 py-0.5 rounded-full ${charCount > maxChars ? "bg-red-100 text-red-600" : "bg-surface-100 text-surface-400"}`}>
          {charCount}/{maxChars}
        </span>
      </div>

      <div className="flex gap-2 mt-3">
        <select
          id="sourceLanguage"
          name="sourceLanguage"
          required
          defaultValue={initialSourceLanguage || "es"}
          className="select flex-1"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>

        <svg className="w-5 h-5 text-brand-teal self-center shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>

        <select
          id="targetLanguage"
          name="targetLanguage"
          required
          defaultValue={initialTargetLanguage || "en"}
          className="select flex-1"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
