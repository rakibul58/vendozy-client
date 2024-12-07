import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen bg-gray-900/10 fixed inset-0 z-[9999] backdrop-blur-md flex justify-center items-center">
      <div className="flex items-center gap-2 text-primary">
        <Loader2 className="animate-spin h-6 w-6" />
        <span>Loading...</span>
      </div>
    </div>
  );
}
