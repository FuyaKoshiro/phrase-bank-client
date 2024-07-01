"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

interface ProtectedRouteProviderProps {
  children: React.ReactNode;
}

function ProtectedRouteProvider({ children }: ProtectedRouteProviderProps) {
  const userStoreRef = useRef(useUserStore());

  const routerRef = useRef(useRouter());

  useEffect(() => {
    if (!userStoreRef.current.user) {
      routerRef.current.push("/login", { scroll: false });
      return;
    }
  }, [routerRef, userStoreRef]);

  return <>{children}</>;
}

export default ProtectedRouteProvider;
