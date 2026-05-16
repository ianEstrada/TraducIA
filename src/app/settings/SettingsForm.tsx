"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { saveSettingsAction } from "@/actions/settings";
import type { SettingsActionState } from "@/actions/settings";

interface Language {
  code: string;
  name: string;
}

interface Props {
  languages: Language[];
  defaultNative: string;
  defaultTargets: string[];
  isOnboarding?: boolean;
}

const initialState: SettingsActionState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary text-sm"
    >
      {pending ? "Saving..." : "Save Settings"}
    </button>
  );
}

export default function SettingsForm({
  languages,
  defaultNative,
  defaultTargets,
  isOnboarding,
}: Props) {
  const [state, formAction] = useFormState(saveSettingsAction, initialState);
  const [selectedTargets, setSelectedTargets] = useState<string[]>(defaultTargets);
  const router = useRouter();

  useEffect(() => {
    if (state.success && isOnboarding) {
      const t = setTimeout(() => router.push("/"), 800);
      return () => clearTimeout(t);
    }
  }, [state.success, isOnboarding, router]);

  function toggleTarget(code: string) {
    setSelectedTargets((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="nativeLanguage" className="block text-sm font-medium text-surface-700 mb-2">
          Native language
        </label>
        <select
          id="nativeLanguage"
          name="nativeLanguage"
          defaultValue={defaultNative}
          className="select w-full"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="block text-sm font-medium text-surface-700 mb-3">
          Target languages (select at least one)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <label
              key={lang.code}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-150
                ${selectedTargets.includes(lang.code)
                  ? "border-brand-gold bg-brand-gold/10 text-surface-800"
                  : "border-brand-teal/20 hover:border-brand-teal/40 text-surface-500"
                }`}
            >
              <input
                type="checkbox"
                name="targetLanguages"
                value={lang.code}
                checked={selectedTargets.includes(lang.code)}
                onChange={() => toggleTarget(lang.code)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                  ${selectedTargets.includes(lang.code)
                    ? "border-brand-gold bg-brand-gold"
                    : "border-brand-teal/30"
                  }`}
              >
                {selectedTargets.includes(lang.code) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm">{lang.name}</span>
            </label>
          ))}
        </div>
      </div>

      {state.success && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm animate-fade-in">
          Settings saved successfully.
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
