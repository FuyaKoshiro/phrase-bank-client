"use client";

import { ClientProvider } from "./QueryClientProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ClientProvider>{children}</ClientProvider>;
}
