import { cn } from "@/lib/utils";

interface TypographySmallProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographySmall({ children, className }: TypographySmallProps) {
  return (
    <small className={cn(className, "text-sm font-medium leading-none")}>
      {children}
    </small>
  );
}
