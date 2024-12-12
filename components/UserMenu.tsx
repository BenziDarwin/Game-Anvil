'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Wallet } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  isMobile?: boolean;
}

export default function UserMenu({ isMobile = false }: UserMenuProps) {
  const isAuthenticated = false; // Replace with actual auth state

  if (!isAuthenticated) {
    return (
      <div className={`flex ${isMobile ? 'flex-col w-full' : 'gap-2'}`}>
        <Link href="/auth/login" className={isMobile ? 'w-full' : ''}>
          <Button variant={isMobile ? 'outline' : 'ghost'} className={isMobile ? 'w-full' : ''}>
            Login
          </Button>
        </Link>
        <Link href="/auth/signup" className={isMobile ? 'w-full mt-2' : ''}>
          <Button className={`bg-orange-500 hover:bg-orange-600 ${isMobile ? 'w-full' : ''}`}>
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  const menuItems = (
    <>
      <DropdownMenuItem asChild>
        <Link href="/profile" className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        {menuItems}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <img
            src="https://github.com/shadcn.png"
            alt="Avatar"
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

