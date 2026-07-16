"use client";

import Link from "next/link";
import { useState } from "react";

const ASSETS = [
  { id: 1, title: "Model Anatomi Manusia Lengkap", type: "3D Model", likes: 245 },
  { id: 2, title: "Titik Akupresur Telapak Kaki", type: "Texture", likes: 120 },
  { id: 3, title: "Sistem Saraf Pusat 3D", type: "3D Model", likes: 532 },
  { id: 4, title: "Peta Otot Punggung Bawah", type: "3D Model", likes: 89 },
  { id: 5, title: "Tulang Belakang Servikal", type: "3D Model", likes: 154 },
  { id: 6, title: "Alat Pijat Tradisional Kayu", type: "3D Model", likes: 76 },
  { id: 7, title: "Peta Refleksi Tangan", type: "Texture", likes: 211 },
  { id: 8, title: "Jalur Meridian Kepala", type: "3D Model", likes: 302 },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: "var(--color-sunflower)" }}>
      {/* Top Navbar (Relebook style internal navbar for the landing page) */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-[0_2px_16px_rgba(68,67,5,0.05)] sticky top-0 z-50 border-b-2" style={{ borderBottomColor: "var(--color-linen)" }}>
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "var(--color-martini)" }}>
              P
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: "var(--color-moss)" }}>
              Press<span className="font-normal italic" style={{ color: "var(--color-moss)" }}>Point</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "var(--color-moss)", opacity: 0.8 }}>
            <Link href="#" className="transition-colors hover:opacity-100 hover:text-[var(--color-martini)]">3D Models</Link>
            <Link href="/articles" className="transition-colors hover:opacity-100 hover:text-[var(--color-martini)]">Articles</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-semibold transition-colors" style={{ color: "var(--color-moss)" }}>
            Log in
          </Link>
          <Link 
            href="/dashboard" 
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-martini)" }}
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 pt-10 flex-1">
        {/* Categories */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide justify-center">
          {["Semua Model", "Anatomi", "Titik Akupresur", "Kerangka", "Sistem Saraf", "Alat Medis"].map((category, idx) => (
            <button 
              key={category}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border-2`}
              style={{
                backgroundColor: idx === 0 ? "var(--color-moss)" : "white",
                color: idx === 0 ? "white" : "var(--color-moss)",
                borderColor: idx === 0 ? "transparent" : "var(--color-linen)"
              }}
              onMouseOver={(e) => {
                if(idx !== 0) e.currentTarget.style.borderColor = "var(--color-martini)";
              }}
              onMouseOut={(e) => {
                if(idx !== 0) e.currentTarget.style.borderColor = "var(--color-linen)";
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid of Models */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ASSETS.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col border border-[var(--color-linen)]"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-linen)]">
                <img 
                  src="/blank.jpg" 
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply opacity-90"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" style={{ color: "var(--color-moss)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              </div>
              
              {/* Asset Info */}
              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-bold truncate text-[1.05rem]" style={{ color: "var(--color-moss)" }} title={asset.title}>
                  {asset.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ backgroundColor: "var(--color-linen)", color: "var(--color-moss)" }}>
                    {asset.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold opacity-60" style={{ color: "var(--color-moss)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {asset.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
