"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardRootPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<"client" | "therapist" | null>(null);

    useEffect(() => {
        // TODO: Replace with actual session/auth check
        const role = (typeof window !== "undefined"
            ? sessionStorage.getItem("userRole")
            : null) as "client" | "therapist" | null || "client";

        setUserRole(role);

        if (role === "therapist") {
            router.replace("/dashboard/therapist");
        } else {
            router.replace("/dashboard/client");
        }
    }, [router]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--color-white)"
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    width: "48px",
                    height: "48px",
                    border: "3px solid #E5E7EB",
                    borderTopColor: "var(--color-martini)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 1rem"
                }} />
                <p style={{ color: "var(--color-moss-60)", fontSize: "0.9rem" }}>
                    Redirecting to your dashboard
                </p>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
