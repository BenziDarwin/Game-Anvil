'use client';

import { Button } from '@/components/ui/button';
import { Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            Discover, Collect & Sell  
            <span className="text-orange-500"> Game </span>
            NFTs
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the ultimate hub for crypto collectibles and one-of-a-kind digital assets, revolutionizing the way you game!
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <Link href="/explore">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Flame className="mr-2 h-5 w-5" />
                Explore
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create NFT
              </Button>
            </Link>
          </div>
          {/* <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-4xl font-bold">200K+</h3>
              <p className="mt-2 text-muted-foreground">Total Items</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">50K+</h3>
              <p className="mt-2 text-muted-foreground">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">10K+</h3>
              <p className="mt-2 text-muted-foreground">Collections</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">8.5 ETH</h3>
              <p className="mt-2 text-muted-foreground">Trading Volume</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}