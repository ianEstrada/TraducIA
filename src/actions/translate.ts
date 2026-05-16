"use server";

import { createClient } from "@/lib/supabase/server";
import { translateText } from "@/lib/mymemory";
import { generateCulturalNotes, classifyTextType, correctText } from "@/lib/groq";

export interface TranslateActionState {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    settingsLanguage: string;
    confidence: number;
    culturalNotes: {
      fun_facts: string[];
      cultural_context: string;
      language_official_year: string;
      demographics: string;
      grammar_tips: string[];
      reading_recommendation: string;
    };
    createdAt: string;
  };
}

export async function translateAction(
  _prevState: TranslateActionState | null,
  formData: FormData
): Promise<TranslateActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to translate." };
  }

  const text = formData.get("text") as string;
  const sourceLanguage = formData.get("sourceLanguage") as string;
  const targetLanguage = formData.get("targetLanguage") as string;

  if (!text || text.trim().length === 0) {
    return { success: false, error: "Please enter some text to translate." };
  }
  if (!sourceLanguage) {
    return { success: false, error: "Please select a source language." };
  }
  if (!targetLanguage) {
    return { success: false, error: "Please select a target language." };
  }

  try {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("native_language, target_languages")
      .eq("user_id", user.id)
      .single();

    // Default response language: native language from settings, fallback to source
    const defaultResponseLang = settings?.native_language || sourceLanguage;

    // Step 1: normalize typos/accents (tiny Groq call, ~200ms)
    const correctedText = await correctText(text.trim(), sourceLanguage);

    // Step 2: translate + enrich + classify in parallel using corrected text
    const [textType, translation, culturalNotes] = await Promise.all([
      settings ? classifyTextType(text.trim()) : ("casual" as const),
      translateText(correctedText, targetLanguage, sourceLanguage),
      generateCulturalNotes(sourceLanguage, targetLanguage, text.trim(), defaultResponseLang),
    ]);

    const isProfessional = settings && textType === "professional" && (settings.target_languages?.length ?? 0) > 0;
    const settingsLanguage = isProfessional
      ? settings!.target_languages[0]
      : defaultResponseLang;

    const { data: saved, error: dbError } = await supabase
      .from("translations")
      .insert({
        user_id: user.id,
        original_text: text.trim(),
        translated_text: translation.translatedText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        cultural_notes: culturalNotes,
      })
      .select("id, created_at")
      .single();

    if (dbError) {
      return { success: false, error: "Failed to save translation." };
    }

    return {
      success: true,
      data: {
        id: saved.id,
        originalText: text.trim(),
        translatedText: translation.translatedText,
        sourceLanguage,
        targetLanguage,
        settingsLanguage: settingsLanguage,
        confidence: translation.confidence,
        culturalNotes,
        createdAt: saved.created_at,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Translation failed.";
    return { success: false, error: message };
  }
}
