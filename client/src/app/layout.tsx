import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
export const metadata: Metadata = {
  title: "PressPoint — Pemetaan Nyeri 3D Interaktif",
  description:
    "PressPoint adalah platform pemetaan nyeri berbasis 3D yang menjembatani komunikasi antara pasien, terapis tradisional, dan tenaga medis. Dapatkan assessment medis terstruktur dan panduan titik pijat yang aman.",
  keywords: [
    "pemetaan nyeri",
    "pain mapping",
    "titik pijat",
    "terapi tradisional",
    "akupresur",
    "kesehatan indonesia",
    "model 3D",
  ],
  authors: [{ name: "PressPoint Team" }],
  openGraph: {
    title: "PressPoint — Pemetaan Nyeri 3D Interaktif",
    description:
      "Jembatan komunikasi antara pasien, terapis tradisional, dan tenaga medis melalui visualisasi nyeri 3D berbasis AI.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 64px - 120px)" }}>
          {children}
        </main>
        <Disclaimer />
      </body>
    </html>
  );
}
