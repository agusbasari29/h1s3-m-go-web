import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import { LayoutShell } from "./layout-shell";

export const metadata: Metadata = {
  title: "ONT Device Manager",
  description: "ONT Device Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
