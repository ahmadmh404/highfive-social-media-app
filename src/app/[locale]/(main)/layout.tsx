import { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import SidebarNavMenuGroup from "@/components/shared/sidebar-navmenu-group";

import { BsPersonPlus } from "react-icons/bs";

import { Bookmark, Home, MessageSquare } from "lucide-react";

export type Item = {
  href: string;
  label: string;
  icon: ReactNode;
  authStatus?: "signed-in" | "signed-out";
};

const navItems: Item[] = [
  { label: "Home", href: "/", icon: <Home /> },
  {
    label: "Friends",
    href: "/requests",
    icon: <BsPersonPlus />,
  },
  {
    label: "Messenger",
    href: "/messenger",
    icon: <MessageSquare />,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: <Bookmark />,
  },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar content={<SidebarNavMenuGroup items={navItems} />}>
      <main className="flex-1 h-full">{children}</main>
    </AppSidebar>
  );
}
