'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { useWallet } from '@/hooks/useWallet'
import { Paintbrush, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-b px-4 mt-[10vh]">
      <SidebarContent>
        <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/create-nft'}>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/create-nft'}>
              <Link href="/profile/create-nft">
                <Paintbrush className="mr-2 h-4 w-4" />
                Create NFT
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/create-nft'}>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

