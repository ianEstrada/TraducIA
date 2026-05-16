"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="text-sm font-medium hover:text-red-600 transition-colors">
      Sign Out
    </button>
  );
}
