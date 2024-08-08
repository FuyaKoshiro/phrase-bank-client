"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React from "react";

interface ProtectedRouteProviderProps {
  children: React.ReactNode;
}

function ProtectedRouteProvider({ children }: ProtectedRouteProviderProps) {
  const router = useRouter();

  if (!_checkUserAuthStatus()) {
    router.push("/login");
  } else {
    return <>{children}</>;
  }
}

export default ProtectedRouteProvider;

const _checkUserAuthStatus = () => {
  const user = useUserStore((state) => state.user);
  console.log("_checkUserAuthStatus", !!user);
  return !!user;
};
