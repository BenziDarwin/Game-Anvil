'use client';

import { Button } from '@/components/ui/button';
import { Edit, LogOut, PlusSquare, Settings, User } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  isMobile?: boolean;
}

export default function UserMenu({ isMobile = false }: UserMenuProps) {
  const isAuthenticated = true; // Replace with actual auth state

  if (isAuthenticated) {
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
      <li className="block py-2 px-4 hover:bg-gray-100">
        <Link href="/profile" className="cursor-pointer flex items-center">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </li>
      <li className="block py-2 px-4 hover:bg-gray-100">
        <Link href="/profile/create-nft" className="cursor-pointer flex items-center">
          <PlusSquare className="mr-2 h-4 w-4" />
          Create NFT
        </Link>
      </li>
      <li className="block py-2 px-4 hover:bg-gray-100">
        <Link href="/profile/edit" className="cursor-pointer flex items-center">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Link>
      </li>
      <li className="block py-2 px-4 hover:bg-gray-100">
        <Link href="/settings" className="cursor-pointer flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </li>
      <li className="block py-2 px-4 hover:bg-gray-100 text-red-600">
        <Link href="/" className="cursor-pointer flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Link>
      </li>
    </>
  );
  
  

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        <ul style={{ color: "black", listStyleType: "none", padding: 0, marginTop: 8 }}>
          {menuItems}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative md:hidden">
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <img
          src="https://github.com/shadcn.png"
          alt="Avatar"
          className="rounded-full"
        />
      </Button>
      <ul style={{ color: "black", listStyleType: "none", padding: 0, marginTop: 8 }}>
        {menuItems}
      </ul>
    </div>
  );
}
