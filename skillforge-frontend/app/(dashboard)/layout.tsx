"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@/services/auth.service";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { setAccessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    setAccessToken(null);
    router.push("/login");
  };

  const navItem = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`text-sm transition ${
          active
            ? "text-black font-medium"
            : "text-neutral-600 hover:text-black"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100">

      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold text-neutral-900">
              SkillForge
            </h1>

            <nav className="flex items-center gap-6">
              {navItem("/dashboard", "Dashboard")}
              {navItem("/activity", "Log Activity")}
              {navItem("/goals", "Goals")}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-neutral-600 hover:text-black transition"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {children}
      </main>

    </div>
  );
}