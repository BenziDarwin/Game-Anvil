'use client'

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Chain, ethereumChains, useChain } from "@/context/ChainContext";
import { signOutUser } from '@/firebase/auth';
import { auth } from '@/firebase/config';
import { Coins, Menu, Paintbrush, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainNav from './MainNav';
import UserMenu from './UserMenu';

// Define the paths where the chain selector should be shown
const CHAIN_SELECTOR_PATHS = ['/profile/create-nft'];

export default function Navbar() {
  const { state, dispatch } = useChain();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const showChainSelector = CHAIN_SELECTOR_PATHS.includes(pathname);

  useEffect(() => {
    const fetchCurrentChain = async () => {
      const storedChainId = localStorage.getItem('chainId');
      if (storedChainId) {
        dispatch({ type: 'SET_CHAIN', payload: parseInt(storedChainId, 10) });
      }
    };

    fetchCurrentChain();
  }, [dispatch]);

  const handleChainChange = async (value: string) => {
    const chainId = parseInt(value, 10);
    dispatch({ type: 'SET_CHAIN', payload: chainId });
    localStorage.setItem('chainId', chainId.toString());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <MainNav />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {showChainSelector && (
              <ChainSelector selectedChain={state.currentChain} onChainChange={handleChainChange} />
            )}
            {auth.currentUser?      <Button variant={'outline'} className={'w-full'} onClick={() => {
            signOutUser();
            router.push('/');
            }}>
            Log out
          </Button> : <UserMenu />}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4 bg-white rounded-lg shadow-lg">
              <nav className="flex flex-col gap-4">
                {showChainSelector && (
                  <ChainSelector selectedChain={state.currentChain} onChainChange={handleChainChange} />
                )}
                {auth.currentUser? <>
                <Link href="/profile">
                  <Button variant="link" className="text-gray-900 hover:text-blue-500 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
                <Link href="/profile/create-nft">
                  <Button variant="link" className="text-gray-900 hover:text-blue-500 flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Create NFT
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="link" className="text-gray-900 hover:text-blue-500 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link></>
                  :null}
              </nav>
              {auth.currentUser?    
          <Button variant={'outline'} className={'w-full'} onClick={() => {
            signOutUser();
            router.push('/');
            }}>
            Log out
          </Button>
        : <UserMenu />}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ChainSelector({ selectedChain, onChainChange }: { selectedChain: Chain | null, onChainChange: (value: string) => void }) {
  if (!selectedChain) return null;

  return (
    <Select onValueChange={onChainChange} value={selectedChain.id.toString()}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a chain" />
      </SelectTrigger>
      <SelectContent>
        {ethereumChains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full`} />
              <span className="flex items-center gap-2"><Coins className={`${chain.color} h-4 w-4`} /> {chain.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
