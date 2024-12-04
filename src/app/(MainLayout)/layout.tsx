import Navbar from "@/components/modules/Shared/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="w-full max-w-6xl mx-auto lg:px-0 px-4 mt-12">{children}</main>
    </div>
  );
}