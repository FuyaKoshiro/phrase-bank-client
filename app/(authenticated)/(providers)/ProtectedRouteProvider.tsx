"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React from "react";

interface ProtectedRouteProviderProps {
  children: React.ReactNode;
}

function ProtectedRouteProvider({ children }: ProtectedRouteProviderProps) {
  const userStore = useUserStore();

  const router = useRouter();

  if (!userStore.user) {
    console.log("User not found, redirecting to login");
    router.push("/login", { scroll: false });
    return;
  }

  console.log("User found, rendering children");
  return <>{children}</>;
}

export default ProtectedRouteProvider;
