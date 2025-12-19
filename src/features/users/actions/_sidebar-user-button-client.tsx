"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronsUpDownIcon, LogOut, Settings, UserIcon } from "lucide-react";
import { IUser } from "@/types";
import { AuthStatus } from "@/features/auth/components/sign-in-status";
import { UserAvatar } from "@/components/shared/avatar";
import { useRouter } from "next/navigation";

type Props = {
  user: IUser;
};

export function SidebarUserButtonClient({ user }: Props) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open[:text-sidebar-accent-foreground"
        >
          <UserInfo user={user} />
          <ChevronsUpDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={4}
        align="end"
        side={isMobile ? "bottom" : "right"}
        className="min-w-64 max-w-80"
      >
        <UserInfo user={user} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setOpenMobile(false);
            router.push(`/profile/${user.username}`);
          }}
        >
          <UserIcon className="mr-1" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/user-settings/notifications"}>
            <Settings className="mr-1" /> Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AuthStatus status="sign-out">
          <DropdownMenuItem>
            <LogOut className="mr-1" /> Log out
          </DropdownMenuItem>
        </AuthStatus>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserInfo({ user }: Props) {
  const { email, name, avatar } = user;

  return (
    <div className="flex items-center gap-2 p-2">
      <UserAvatar src={avatar} size={"sm"} name={name} />

      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{name}</span>
        <span className="truncate text-sm xs">{email}</span>
      </div>
    </div>
  );
}
