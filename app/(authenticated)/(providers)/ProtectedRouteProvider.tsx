"use client";

import useAuth from "@/app/(hooks)/useAuth";
import { TypographySmall } from "@/components/ui/typographySmall";
import { Loading } from "@lemonsqueezy/wedges";
import { useRouter } from "next/navigation";
import React from "react";

interface ProtectedRouteProviderProps {
  children: React.ReactNode;
}

function ProtectedRouteProvider({ children }: ProtectedRouteProviderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <Loading type="dots" size="xs" />
        <TypographySmall>Authenticating...</TypographySmall>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
  } else {
    return <>{children}</>;
  }
}

export default ProtectedRouteProvider;
