// components/ui/box.tsx
import { cn } from "@/lib/utils";

export function Box({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
