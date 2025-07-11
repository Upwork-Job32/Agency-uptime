import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { StripeProvider } from "@/contexts/StripeContext";
import { ClientAuthProvider } from "@/contexts/ClientAuthContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agency Uptime - Website Monitoring for Digital Agencies",
  description:
    "Professional website monitoring and uptime tracking for digital agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <StripeProvider>
            <SubscriptionProvider>
              <ClientAuthProvider>
                {children}
                <Toaster />
              </ClientAuthProvider>
            </SubscriptionProvider>
          </StripeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
