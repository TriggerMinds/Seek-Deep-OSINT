import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
}

export function Loader({ className, size = 5 }: LoaderProps) {
  return (
    <Loader2
      className={cn(`h-${size} w-${size} animate-spin text-primary`, className)}
    />
  );
}
