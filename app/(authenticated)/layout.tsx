import Providers from "./(providers)/Providers";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return <Providers>{children}</Providers>;
}
