"use client";

import { ReactNode } from "react";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div style={{ minHeight: "calc(100vh - 64px - 120px)" }}>
            {children}
        </div>
    );
}
