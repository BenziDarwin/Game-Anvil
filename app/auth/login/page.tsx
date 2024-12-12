'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hammer } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Hammer className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Welcome back to Game Anvil</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-orange-500 hover:underline block text-right"
          >
            Forgot password?
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            Sign In
          </Button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-orange-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}