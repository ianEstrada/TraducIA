"use client";

import { useState } from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function MobileNav({ user }: { user: { email?: string; user_metadata?: { full_name?: string } } | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl hover:bg-surface-100 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-5 h-5 text-surface-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-surface-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-40 bg-surface-800/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-brand-teal/15 shadow-soft-lg animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              <Link href="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-xl text-surface-700 hover:bg-surface-100 text-sm font-medium transition-colors">
                Translate
              </Link>
              {user && (
                <>
                  <Link href="/history" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-xl text-surface-700 hover:bg-surface-100 text-sm font-medium transition-colors">
                    History
                  </Link>
                  <Link href="/settings" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-xl text-surface-700 hover:bg-surface-100 text-sm font-medium transition-colors">
                    Settings
                  </Link>
                  <hr className="my-2 border-brand-teal/15" />
                  <div className="px-3 py-2 text-red-500">
                    <SignOutButton />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
