import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  let supabaseResponse = NextResponse.redirect(`${origin}/?from=oauth`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  // Check if user has settings — if not, redirect to onboarding
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("native_language")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!settings?.native_language) {
      return NextResponse.redirect(`${origin}/settings?onboarding=1`);
    }
  }

  return supabaseResponse;
}
