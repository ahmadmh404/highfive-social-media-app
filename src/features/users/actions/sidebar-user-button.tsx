import { Suspense } from "react";
import { SidebarUserButtonClient } from "./_sidebar-user-button-client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { currentUser } from "@/lib/current-auth";
import { AuthStatus } from "@/features/auth/components/sign-in-status";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const user = await currentUser();

  if (user == null) {
    return (
      <AuthStatus status="sign-out">
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log Out</span>
        </SidebarMenuButton>
      </AuthStatus>
    );
  }

  return <SidebarUserButtonClient user={user} />;
}
