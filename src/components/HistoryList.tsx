"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Translation {
  id: string;
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
}

interface Props {
  translations: Translation[];
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "\u2026";
}

export default function HistoryList({ translations }: Props) {
  const router = useRouter();

  if (translations.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-surface-400 text-lg mb-2">No translations yet</p>
        <p className="text-surface-300 text-sm">
          Start translating to build your personal glossary!
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-brand-gold hover:text-brand-olive font-medium"
        >
          Go to Translator
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {translations.map((t) => {
        const dateStr = new Date(t.created_at).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={t.id}
            onClick={() => router.push(`/?resume=${t.id}`)}
            className="card hover:shadow-md transition-shadow duration-200 group cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/?resume=${t.id}`);
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-surface-100 text-surface-500">
                    {t.source_language.toUpperCase()}
                  </span>
                  <span className="text-xs text-surface-300">&rarr;</span>
                  <span className="badge bg-brand-gold/10 text-brand-olive">
                    {t.target_language.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5 block">
                      Original
                    </span>
                    <p className="text-sm text-gray-700 leading-snug">
                      {truncate(t.original_text, 50)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-primary-500 uppercase tracking-wider mb-0.5 block">
                      Translation
                    </span>
                    <p className="text-sm text-gray-800 font-medium leading-snug">
                      {truncate(t.translated_text, 50)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                <time className="text-xs text-gray-400">{dateStr}</time>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-all duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
