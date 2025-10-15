import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Frontend Template",
  description: "Frontend basic template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${montserrat.className} antialiased`}
      >
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </body>
    </html>
  );
}
