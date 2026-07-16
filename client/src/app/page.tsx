import React from 'react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfa] text-[#111111] font-sans relative overflow-x-hidden selection:bg-indigo-100">
            {/* Subtle Grid Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.5]"
                 style={{
                     backgroundImage: `
            linear-gradient(to right, #e2e2e0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e2e0 1px, transparent 1px)
          `,
                     backgroundSize: '40px 40px'
                 }}
            />
        </div>
    );
}