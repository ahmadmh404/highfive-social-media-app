import { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebarClient } from "@/components/shared/_app-sidebar-client";
import Link from "next/link";
import { AuthStatus } from "@/features/auth/components/sign-in-status";
import { SidebarUserButton } from "@/features/users/actions/sidebar-user-button";

type Props = {
  children: ReactNode;
  content: ReactNode;
};

export function AppSidebar({ children, content }: Props) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar className="overflow-hidden" collapsible="icon">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <Link href={"/"} className="text-nowrap text-xl text-primary">
              Highfive
            </Link>
          </SidebarHeader>

          <SidebarContent>{content}</SidebarContent>

          <AuthStatus status="sign-in">
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarUserButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </AuthStatus>
        </Sidebar>

        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
