import { Loader2Icon } from "lucide-react";

export const Spinner = () => {
  return (
    <div className="min-h-[90vh] w-full grid place-items-center">
      <Loader2Icon className="animate-spin size-10" />
    </div>
  );
};
