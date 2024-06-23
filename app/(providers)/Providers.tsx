"use client";

import FirebaseAuthProvider from "./FirebaseAuthProvider";
import { ClientProvider } from "./QueryClientProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClientProvider>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </ClientProvider>
  );
}
