"use server";

import { createClient } from "@/lib/supabase/server";
import { analyzeText } from "@/lib/groq";
import type { TextAnalysis } from "@/lib/groq";

export interface AnalyzeActionState {
  success: boolean;
  error?: string;
  data?: TextAnalysis;
}

export async function analyzeAction(
  _prevState: AnalyzeActionState | null,
  formData: FormData
): Promise<AnalyzeActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to analyze text." };
  }

  const text = formData.get("text") as string;
  const responseLanguage = formData.get("responseLanguage") as string;

  if (!text || text.trim().length === 0) {
    return { success: false, error: "No text to analyze." };
  }

  try {
    const analysis = await analyzeText(text.trim(), responseLanguage || "en");
    return { success: true, data: analysis };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Analysis failed.";
    return { success: false, error: message };
  }
}
