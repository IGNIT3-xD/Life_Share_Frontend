import { Providers } from "@/providers/queryProviders";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const Graphik = localFont({
  src: [
    {
      path: "./fonts/Graphik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-graphik",
});

const FinancierDisplay = localFont({
  src: [
    {
      path: "./fonts/FinancierDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/FinancierDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/FinancierDisplay-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-financier",
});

export const metadata: Metadata = {
  title: "LifeShare - Blood Donation & Emergency Services Platform",
  description: "Life Share was born from a simple belief: no one should lose their life waiting for blood. We bridge the gap between those who need help and those willing to give it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "overflow-x-hidden",
        "antialiased",
        Graphik.variable,
        FinancierDisplay.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <Providers>
            <div className="flex-1">{children}</div>
          </Providers>
          <Toaster position="top-right" closeButton richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
