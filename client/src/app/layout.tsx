import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "PressPoint — Interactive 3D Pain Mapping",
  description:
    "PressPoint is a 3D-based pain mapping platform that bridges communication between patients, traditional therapists, and medical professionals. Get structured medical assessment and safe massage point guidance.",
  keywords: [
    "pain mapping",
    "3D visualization",
    "massage points",
    "traditional therapy",
    "acupressure",
    "health wellness",
    "3D model",
  ],
  authors: [{ name: "PressPoint Team" }],
  openGraph: {
    title: "PressPoint — Interactive 3D Pain Mapping",
    description:
      "Bridge communication between patients, traditional therapists, and medical professionals through AI-powered 3D pain visualization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 64px - 120px)" }}>
            {children}
          </main>
          <Disclaimer />
        </AuthProvider>
      </body>
    </html>
  );
}
