import type React from "react";
import { AppSidebar } from "@/components/Profile/SideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Anvil - Profile",
  description:
    "The ultimate NFT marketplace for video game assets, skins, and collectibles.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
