import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CodeProvider } from "@/context/context";
import { Toaster } from "@/components/ui/sonner"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodePilot | Learn with AI",
  description: "Your AI powered coding space",
  icons: {
    icon: "/CodePilotIcon.png",        // Default favicon
    shortcut: "CodePilotIcon",    // For browser tab
    apple: "/CodePilotIcon.png",       // For iOS devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CodeProvider>
          {children}
          <Toaster />
        </CodeProvider>
      </body>
    </html>
  );
}
