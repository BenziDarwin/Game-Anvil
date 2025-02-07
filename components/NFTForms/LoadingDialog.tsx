import type React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog-no-close";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  isOpen: boolean;
  message: string;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({
  isOpen,
  message,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-center text-sm font-medium">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
