"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthStatus } from "@/features/auth/components/sign-in-status";

export type Item = {
  href: string;
  label: string;
  icon: ReactNode;
  authStatus?: "signed-in" | "signed-out";
};

type Props = {
  items: Item[];
  className?: string;
};

export default function SidebarNavMenuGroup({ items, className = "" }: Props) {
  const pathname = usePathname();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item, key) => {
          const html = (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          if (item.authStatus === "signed-out") {
            return (
              <AuthStatus key={key} status="sign-out">
                {html}
              </AuthStatus>
            );
          }

          if (item.authStatus === "signed-in") {
            return (
              <AuthStatus key={key} status="sign-in">
                {html}
              </AuthStatus>
            );
          }

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
