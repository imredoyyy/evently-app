import { LogOutIcon } from "lucide-react";

import { signOut } from "@/actions/auth.action";
import { cn } from "@/lib/utils";

interface SignOutButtonProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
}

export const SignOutButton = ({ className, ...props }: SignOutButtonProps) => {
  return (
    <form action={signOut} className={cn(className)} {...props}>
      <button
        type="submit"
        className="w-full flex items-center gap-2 !cursor-pointer"
      >
        <LogOutIcon className="size-4" />
        <span>Sign Out</span>
      </button>
    </form>
  );
};
