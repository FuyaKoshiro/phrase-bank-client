import ProtectedRouteProvider from "./ProtectedRouteProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ProtectedRouteProvider>{children}</ProtectedRouteProvider>;
}
