"use client";

import { ThemeProvider } from "@material-tailwind/react";
import { ClientProvider } from "./QueryClientProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ClientProvider>{children}</ClientProvider>
    </ThemeProvider>
  );
}
