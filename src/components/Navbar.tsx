import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import MobileNav from "./MobileNav";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-surface/70 border-b border-brand-teal/15">
      <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/logo.svg"
            alt="TraducIA"
            width={400}
            height={100}
            className="h-14 sm:h-16 w-auto"
            unoptimized
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/" className="btn-ghost text-sm">Translate</Link>
          {user && (
            <>
              <Link href="/history" className="btn-ghost text-sm">History</Link>
              <Link href="/settings" className="btn-ghost text-sm">Settings</Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-surface-400 truncate max-w-[130px]">
                {user.user_metadata?.full_name || user.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>

        {/* Mobile: user name + hamburger */}
        <div className="flex lg:hidden items-center gap-1">
          {user ? (
            <span className="text-xs text-surface-400 truncate max-w-[70px]">
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </span>
          ) : (
            <SignInButton />
          )}
          <MobileNav user={user} />
        </div>
      </div>
    </nav>
  );
}
