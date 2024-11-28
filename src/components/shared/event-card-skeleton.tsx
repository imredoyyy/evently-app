import { SkeletonWrapper, Skeleton } from "@/components/shared/skeleton";

export const EventCardSkeleton = () => {
  return (
    <SkeletonWrapper className="w-full max-w-[350px]">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[170px]" />

        <div className="flex flex-col gap-3">
          <div className="space-y-2.5">
            <Skeleton className="w-full h-2.5" />
            <Skeleton className="w-3/4 h-2.5" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="w-2/3 h-2" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-2 w-[105px]" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-2 w-[90px]" />
            <Skeleton className="w-[120px] h-2.5" />
          </div>
          <Skeleton className="px-4 py-2 h-10 rounded-md w-[110px]" />
        </div>
      </div>
    </SkeletonWrapper>
  );
};
