import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2 text-primary">
        <Loader2 className="animate-spin h-6 w-6" />
        <span>Loading...</span>
      </div>
    </div>
  );
}
