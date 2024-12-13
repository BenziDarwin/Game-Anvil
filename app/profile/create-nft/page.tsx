"use client";

import NFTForms from '@/components/NFTForms'
import { AppSidebar } from '@/components/Profile/SideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react'

export default function Page() {
  return (
    <SidebarProvider>
        <AppSidebar/>
       <div className="bg-card p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-6">Create New NFT</h2>
                  <NFTForms />
                </div>
    </SidebarProvider>
)}
