import { cn } from "../../lib/utils";

/**
 * Generic Skeleton block for graceful loading states
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-architect-card", className)}
      {...props}
    />
  );
}
