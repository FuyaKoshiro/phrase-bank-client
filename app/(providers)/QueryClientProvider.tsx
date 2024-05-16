"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export function ClientProvider({ children }: QueryClientProviderProps) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
