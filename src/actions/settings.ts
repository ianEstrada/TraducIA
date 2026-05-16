"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SettingsActionState {
  success: boolean;
  error?: string;
}

export async function saveSettingsAction(
  _prevState: SettingsActionState | null,
  formData: FormData
): Promise<SettingsActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const nativeLanguage = formData.get("nativeLanguage") as string;
  const targetLanguages = formData.getAll("targetLanguages") as string[];

  if (!nativeLanguage) {
    return { success: false, error: "Please select your native language." };
  }
  if (targetLanguages.length === 0) {
    return { success: false, error: "Please select at least one target language." };
  }

  const { error } = await supabase.from("user_settings").upsert({
    user_id: user.id,
    native_language: nativeLanguage,
    target_languages: targetLanguages,
  });

  if (error) {
    return { success: false, error: "Failed to save settings." };
  }

  revalidatePath("/settings");
  return { success: true };
}
