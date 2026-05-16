"use server";

import { createClient } from "@/lib/supabase/server";
import type { CulturalNote } from "@/lib/groq";

export interface ResumeData {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  culturalNotes: CulturalNote;
  createdAt: string;
}

export async function resumeAction(translationId: string): Promise<{
  success: boolean;
  error?: string;
  data?: ResumeData;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const { data: translation, error: dbError } = await supabase
    .from("translations")
    .select("*")
    .eq("id", translationId)
    .eq("user_id", user.id)
    .single();

  if (dbError || !translation) {
    return { success: false, error: "Translation not found." };
  }

  return {
    success: true,
    data: {
      id: translation.id,
      originalText: translation.original_text,
      translatedText: translation.translated_text,
      sourceLanguage: translation.source_language,
      targetLanguage: translation.target_language,
      confidence: 0,
      culturalNotes: translation.cultural_notes || {
        fun_facts: [],
        cultural_context: "",
        language_official_year: "",
        demographics: "",
        grammar_tips: [],
        reading_recommendation: "",
      },
      createdAt: translation.created_at,
    },
  };
}
