import { cn } from "@/lib/utils";

function BlurredSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-md bg-muted", className)} {...props} />;
}

export { BlurredSkeleton };
