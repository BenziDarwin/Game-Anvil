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

export default function UserMenu() {
  const isAuthenticated = false; // Replace with actual auth state

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/auth/signup">
          <Button className="bg-orange-500 hover:bg-orange-600">Sign Up</Button>
        </Link>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}