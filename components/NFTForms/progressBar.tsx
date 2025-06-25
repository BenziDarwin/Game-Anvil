"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProgressBarProps {
  isVisible: boolean;
  currentStep: string;
  progress: number;
  step: number;
  totalSteps: number;
}

export default function ProgressBar({
  isVisible,
  currentStep,
  progress,
  step,
  totalSteps,
}: ProgressBarProps) {
  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-sm font-medium">Processing NFT</span>
            <span className="text-xs text-gray-500 ml-auto">
              {step}/{totalSteps}
            </span>
          </div>

          {/* Custom Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">{currentStep}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
