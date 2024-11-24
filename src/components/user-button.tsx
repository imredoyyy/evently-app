import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import type { Session } from "@/types/index";
import { User_Button_Links } from "@/constants";

export const UserButton = ({ session }: { session: Session }) => {
  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="size-9">
          {session?.user?.image && (
            <AvatarImage src={session.user.image} alt={session?.user.name} />
          )}
          <AvatarFallback>
            {session?.user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="hover:!bg-background">
          <div className="flex items-center gap-2">
            <Avatar>
              {session?.user?.image && (
                <AvatarImage
                  src={session?.user.image}
                  alt={session?.user.name || "user avatar"}
                />
              )}
              <AvatarFallback>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">
                {session?.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {User_Button_Links[session.user?.role]?.map((link) => (
          <DropdownMenuItem key={link.href}>
            <Link href={link.href} className="flex w-full items-center gap-2">
              <link.icon className="size-4" />
              <span>{link.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
