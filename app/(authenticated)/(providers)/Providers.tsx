import ProtectedRouteProvider from "./ProtectedRouteProvider";
import VideoPlayerProvider from "./VideoPlayerContextProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ProtectedRouteProvider>
      <VideoPlayerProvider>{children}</VideoPlayerProvider>
    </ProtectedRouteProvider>
  );
}
