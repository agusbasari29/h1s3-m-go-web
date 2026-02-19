"use client";

import { Header, Sidebar, Footer } from "@/components/layout";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
