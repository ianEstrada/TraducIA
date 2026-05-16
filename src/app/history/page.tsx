import { createClient } from "@/lib/supabase/server";
import HistoryList from "@/components/HistoryList";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: translations } = await supabase
    .from("translations")
    .select(
      "id, original_text, translated_text, source_language, target_language, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Translation History
        </h1>
        <p className="text-gray-500">
          Your personal glossary. Every translation you make is saved here.
        </p>
      </div>

      <HistoryList translations={translations || []} />
    </div>
  );
}
