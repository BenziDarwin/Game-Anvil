'use client';

import MainNav from './MainNav';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentChain } from "@/utils/ethereum";

const ethereumChains = [
  { id: 1, name: 'Ethereum Mainnet' },
  { id: 5, name: 'Goerli Testnet' },
  { id: 137, name: 'Polygon Mainnet' },
  { id: 80001, name: 'Mumbai Testnet' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  // Use effect to set the initial selected chain based on the current chain
  useEffect(() => {
    const fetchCurrentChain = async () => {
      const chainId = await getCurrentChain();
      if (chainId) {
        setSelectedChain(chainId);
      }
    };

    fetchCurrentChain();
  }, []); // Run this effect once when the component mounts

  // Handle chain change
  const handleChainChange = async (event: any) => {
    const chainId = parseInt(event.target.value, 10);
    setSelectedChain(chainId);

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }], // Convert to hexadecimal
        });
      } catch (switchError) {
        console.error('Failed to switch chain:', switchError);
        // Optionally handle adding a chain if it isn't available
      }
    } else {
      alert('Please install a Web3 wallet (e.g., MetaMask)');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <MainNav />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {/* Dropdown for Chain Selection */}
            <select
              className="border rounded-md px-2 py-1 bg-background text-foreground"
              value={selectedChain || ''}
              onChange={handleChainChange}
              disabled={selectedChain === null}
            >
              {ethereumChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
            <UserMenu />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {/* Dropdown for Chain Selection in Mobile View */}
                <select
                  className="border rounded-md px-2 py-1 bg-background text-foreground"
                  value={selectedChain || ''}
                  onChange={handleChainChange}
                  disabled={selectedChain === null}
                >
                  {ethereumChains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
                <UserMenu />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
