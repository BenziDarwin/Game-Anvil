"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hammer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { registerWithEmail } from "@/firebase/auth";
import { email } from "@web3-storage/w3up-client/types";
import { UserData } from "@/lib/types/user";
import { addDocument } from "@/firebase/firestore";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    bio: "",
    joinedDate: "",
    location: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateAccountForm = () => {
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateUserDetailsForm = () => {
    if (
      !formData.fullName.trim() ||
      !formData.bio.trim() ||
      !formData.joinedDate.trim() ||
      !formData.location.trim() ||
      !formData.website.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && validateAccountForm()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateUserDetailsForm()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      setIsLoading(true);
      try {
        await registerWithEmail(formData.email, formData.password);
        let userData: UserData = {
          name: formData.fullName,
          bio: formData.bio,
          joinedDate: new Date(formData.joinedDate).toISOString(),
          location: formData.location,
          website: formData.website,
          email: formData.email,
          verified: false,
        };
        await addDocument("users", userData);
        toast({
          title: "Success!",
          description: "Account created and details submitted successfully",
          variant: "default",
        });
        router.push("/profile");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit user details. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your Email..."
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password..."
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password..."
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name..."
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                placeholder="Enter your bio..."
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinedDate">Joined Date</Label>
              <Input
                id="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter your location..."
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="Enter your website..."
                value={formData.website}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 3:
        return (
          <div className="space-y-2">
            <p>Please review your information:</p>
            <p>Email: {formData.email}</p>
            <p>Full Name: {formData.fullName}</p>
            <p>Bio: {formData.bio}</p>
            <p>Joined Date: {formData.joinedDate}</p>
            <p>Location: {formData.location}</p>
            <p>Website: {formData.website}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Hammer className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join Game Anvil to start collecting and trading NFTs
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {currentStep < 3 ? (
              <Button
                type="button"
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Next"}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Complete Sign Up"}
              </Button>
            )}
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
            )}
            {currentStep === 1 && (
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-orange-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
