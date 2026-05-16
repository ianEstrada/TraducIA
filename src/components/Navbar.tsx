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
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/logo-icono.png"
            alt="TraducIA"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8"
            priority
          />
          <Image
            src="/logo-texto.png"
            alt="TraducIA"
            width={100}
            height={24}
            className="hidden sm:block h-5 w-auto"
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
