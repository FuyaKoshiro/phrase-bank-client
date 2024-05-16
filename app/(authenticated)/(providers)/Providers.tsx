import FirebaseAuthProvider from "@/app/(authenticated)/(providers)/FirebaseAuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}
