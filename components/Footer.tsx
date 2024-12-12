"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Twitter, 
  Instagram, 
  Github 
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: <Twitter className="h-5 w-5 hover:text-orange-500 transition-colors" />, 
      href: "#" 
    },
    { 
      icon: <Instagram className="h-5 w-5 hover:text-orange-500 transition-colors" />, 
      href: "#" 
    },
    { 
      icon: <Github className="h-5 w-5 hover:text-orange-500 transition-colors" />, 
      href: "#" 
    },
  ];

  return (
    <footer className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-orange-500">Game Anvil</h2>
          </div>

          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link 
              href="/marketplace" 
              className="text-sm text-muted-foreground hover:text-orange-500 transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-muted-foreground hover:text-orange-500 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-orange-500 transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <Link 
                key={index} 
                href={social.href}
                className="text-muted-foreground hover:text-orange-500 transition-colors"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-gray-700" />

        <div className="text-center text-sm text-gray-400">
          © {currentYear} Game Anvil. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;