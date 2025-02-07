import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils"; // Ensure you have a utility for class merging

export function Notification({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "error" | "success";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-0 transform -translate-x-1/2 z-50 w-full max-w-sm">
      <Alert
        variant={type === "error" ? "destructive" : "default"}
        className={cn("shadow-lg rounded-lg px-4 py-3 text-white", {
          "bg-red-500": type === "error",
          "bg-green-500": type === "success",
        })}
      >
        <AlertTitle>{type === "error" ? "Error" : "Success"}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
