"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  const isLoginPage = pathname === "/login";
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (loading) return;
    if (isLoginPage) {
      if (user) router.replace("/");
      return;
    }
    if (!user) {
      router.replace("/login");
      return;
    }
    if (isAdminRoute && !isAdmin) {
      router.replace("/");
    }
  }, [loading, user, isAdmin, isLoginPage, isAdminRoute, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bettr-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-bettr-lime border-t-transparent" />
      </div>
    );
  }

  if (isLoginPage && !user) return <>{children}</>;
  if (!user) return null;
  if (isAdminRoute && !isAdmin) return null;

  return <>{children}</>;
}
