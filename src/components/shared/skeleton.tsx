import { cn } from "@/lib/utils";

const SkeletonWrapper = ({
  className,
  children,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/20 relative overflow-hidden p-4 before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:animate-shimmer isolate shadow-xl shadow-muted/10 before:rounded-xl before:border-y before:border-y-primary/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const Skeleton = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("bg-primary/10 rounded-lg", className)} {...props} />
  );
};

export { SkeletonWrapper, Skeleton };
