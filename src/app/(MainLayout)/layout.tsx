import Navbar from "@/components/modules/Shared/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <div>
      <Navbar />
      </div>
      <main className="w-full max-w-6xl mx-auto lg:px-0 px-4 mt-20">{children}</main>
    </div>
  );
}