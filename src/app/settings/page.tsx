"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGES } from "@/lib/languages";
import SettingsForm from "./SettingsForm";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const onboarding = searchParams.get("onboarding") === "1";
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/"; return; }
      setUser(data.user);
      supabase.from("user_settings").select("native_language, target_languages").eq("user_id", data.user.id).single()
        .then(({ data: s }) => { setSettings(s); setLoading(false); });
    });
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><div className="animate-spin h-6 w-6 border-2 border-brand-gold border-t-transparent rounded-full mx-auto" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      {onboarding && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-xl">&#x1F44B;</span>
            <div>
              <h3 className="text-sm font-semibold text-brand-olive mb-1">Welcome to TraducIA!</h3>
              <p className="text-xs text-surface-600">Please configure your language preferences below. The AI will use these to personalize your experience.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-800 mb-2">Language Settings</h1>
        <p className="text-sm text-surface-400">Customize your translation experience.</p>
      </div>

      <div className="card">
        <SettingsForm
          languages={LANGUAGES}
          defaultNative={settings?.native_language || "es"}
          defaultTargets={settings?.target_languages || ["en"]}
          isOnboarding={onboarding}
        />
      </div>
    </div>
  );
}
