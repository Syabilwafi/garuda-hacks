"use client";

import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { bookingApi } from "@/api/bookingApi";
import ClinicalNoteModal from "@/components/ClinicalNoteModal";

type TriageStatus = "GREEN" | "YELLOW" | "RED_URGENT" | "RED_EMERGENCY";

interface Appointment {
    id: string;
    patientName: string;
    medicalRecordId: string;
    date: string;
    time: string;
    status: "Upcoming" | "Completed" | "Cancelled";
    triageStatus: TriageStatus;
    notes?: string;
}

interface TimeSlotSetting {
    time: string;
    isAvailable: boolean;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: "APT-001",
        patientName: "Jane Doe",
        medicalRecordId: "RM-2026-00412",
        date: "July 24, 2026",
        time: "10:00 - 11:00",
        status: "Upcoming",
        triageStatus: "RED_EMERGENCY",
        notes: "Chronic lower back pain for the past 3 weeks. Experiencing numbness around genitals and inner thighs after heavy lifting incident.",
    },
    {
        id: "APT-003",
        patientName: "Ahmad Subarjo",
        medicalRecordId: "RM-2026-00891",
        date: "July 24, 2026",
        time: "11:00 - 12:00",
        status: "Upcoming",
        triageStatus: "YELLOW",
        notes: "Recovery therapy after mild stroke. Taking blood thinners regularly.",
    },
    {
        id: "APT-002",
        patientName: "Budi Raharjo",
        medicalRecordId: "RM-2025-01244",
        date: "June 12, 2026",
        time: "14:00 - 15:30",
        status: "Completed",
        triageStatus: "GREEN",
        notes: "4th acupuncture session. Neck tension improving.",
    },
];

const INITIAL_SLOTS: TimeSlotSetting[] = [
    { time: "08:00 - 09:00 WIB", isAvailable: true },
    { time: "09:00 - 10:00 WIB", isAvailable: false },
    { time: "10:00 - 11:00 WIB", isAvailable: true },
    { time: "11:00 - 12:00 WIB", isAvailable: true },
    { time: "14:00 - 15:00 WIB", isAvailable: false },
    { time: "15:00 - 16:00 WIB", isAvailable: true },
];

export default function TherapistDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [slots, setSlots] = useState<TimeSlotSetting[]>(INITIAL_SLOTS);
    const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
    const [isSavingAvailability, setIsSavingAvailability] = useState(false);
    const [isClinicalNoteModalOpen, setIsClinicalNoteModalOpen] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Debounce effect to save availability changes to server
    useEffect(() => {
        if (!user?.id) return;

        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer to save after 2 seconds of idle time
        setIsSavingAvailability(true);
        debounceTimer.current = setTimeout(async () => {
            try {
                const slotsToSave = slots.map(slot => ({
                    time: slot.time,
                    isAvailable: slot.isAvailable,
                }));

                const success = await bookingApi.updateTherapistAvailability(user.id, slotsToSave);
                if (success) {
                    console.log('Availability saved successfully');
                } else {
                    console.error('Failed to save availability');
                }
            } catch (error) {
                console.error('Error saving availability:', error);
            } finally {
                setIsSavingAvailability(false);
            }
        }, 2000);

        // Cleanup timer on unmount
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [slots, user?.id]);

    // Toggle slot availability status
    const toggleSlotAvailability = (index: number) => {
        const updatedSlots = [...slots];
        updatedSlots[index].isAvailable = !updatedSlots[index].isAvailable;
        setSlots(updatedSlots);
    };

    // Complete an appointment
    const handleCompleteAppointment = (id: string) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: "Completed" as const } : apt
        ));
        if (selectedApt?.id === id) {
            setSelectedApt({ ...selectedApt, status: "Completed" as const });
        }
    };

    // Helper to extract styling properties for each specific screening classification badge
    const getTriageBadgeStyles = (status: TriageStatus) => {
        switch (status) {
            case "RED_EMERGENCY":
                return {
                    bg: "#FEF2F2",
                    text: "#991B1B",
                    border: "#FCA5A5",
                    label: "EMERGENCY"
                };
            case "RED_URGENT":
                return {
                    bg: "#FFF7ED",
                    text: "#C2410C",
                    border: "#FFEDD5",
                    label: "URGENT"
                };
            case "YELLOW":
                return {
                    bg: "var(--color-sunflower)",
                    text: "var(--color-martini-dark)",
                    border: "var(--color-martini)",
                    label: "YELLOW"
                };
            case "GREEN":
            default:
                return {
                    bg: "#F0FDF4",
                    text: "#16A34A",
                    border: "#BBF7D0",
                    label: "GREEN"
                };
        }
    };

    return (
        <ProtectedRoute requiredRole="THERAPIST">
        <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: "var(--color-white)" }}>
            {/* Header Banner */}
            <div style={{ backgroundColor: "var(--color-white)", borderBottom: "1px solid #E5E7EB", padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.5rem", fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}>Your Dashboard</h1>
                        <p style={{ color: "var(--color-moss-60)", fontSize: "0.9rem" }}>Manage your daily consultation schedule and monitor patient safety screening triage urgency levels.</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", backgroundColor: "#F0FDF4", color: "#15803D", borderRadius: "var(--radius-sm)", fontWeight: 600, border: "1px solid #BBF7D0" }}>
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Dashboard Workspace */}
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
                <div className="responsive-therapist-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>

                    <style dangerouslySetInnerHTML={{__html: `
                        @media (min-width: 1024px) {
                            .responsive-therapist-grid {
                                grid-template-columns: 280px 1fr 400px !important;
                            }
                        }
                    `}} />

                    {/* Left Column: Therapist Profile Card */}
                    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ textAlign: "center", borderBottom: "1px solid #E5E7EB", paddingBottom: "1.25rem" }}>
                            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--color-martini)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: "600", margin: "0 auto 1rem" }}>
                                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T'}
                            </div>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.25rem" }}>{user?.fullName || 'Therapist'}</h3>
                            <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem", backgroundColor: "var(--color-sunflower)", color: "var(--color-martini)", borderRadius: "999px", fontWeight: 600 }}>{user?.specialization || 'Professional Therapist'}</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Email</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)", fontWeight: "600" }}>{user?.email || '-'}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Specialization</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)" }}>{user?.specialization || '-'}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>User ID</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)" }}>{user?.id || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Schedule List & Configuration Management */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                        {/* Session Management */}
                        <div className="card">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid #E5E7EB", paddingBottom: "0.75rem" }}>Today's Consultation Schedule</h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {appointments.map((apt) => {
                                    const triageConfig = getTriageBadgeStyles(apt.triageStatus);

                                    return (
                                        <div
                                            key={apt.id}
                                            onClick={() => setSelectedApt(apt)}
                                            className="card-linen"
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                gap: "1rem",
                                                padding: "1.25rem",
                                                cursor: "pointer",
                                                borderLeft: selectedApt?.id === apt.id ? "4px solid var(--color-martini)" : "1px solid #E5E7EB",
                                                transition: "all 0.15s ease"
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                    <h3 style={{ fontSize: "1rem", margin: 0 }}>{apt.patientName}</h3>
                                                    <span style={{ fontSize: "0.75rem", color: "var(--color-moss-60)" }}>ID: {apt.medicalRecordId}</span>
                                                </div>
                                                <p style={{ fontSize: "0.85rem", color: "var(--color-moss-80)", display: "flex", gap: "1rem", margin: 0 }}>
                                                    <span>{apt.date}</span>
                                                    <span>{apt.time} </span>
                                                    <br/>
                                                </p>
                                                {/* Mini Triage Preview Indicator Tag */}
                                                <span style={{
                                                    display: "inline-block",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    marginTop: "0.5rem",
                                                    padding: "0.1rem 0.4rem",
                                                    borderRadius: "4px",
                                                    backgroundColor: triageConfig.bg,
                                                    color: triageConfig.text,
                                                    border: `1px solid ${triageConfig.border}`
                                                }}>
                                                    {apt.triageStatus.replace("_", " ")}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    padding: "0.25rem 0.75rem",
                                                    borderRadius: "var(--radius-sm)",
                                                    backgroundColor: apt.status === "Upcoming" ? "var(--color-sunflower)" : "#F0FDF4",
                                                    color: apt.status === "Upcoming" ? "var(--color-martini)" : "#15803D",
                                                    border: `1px solid ${apt.status === "Upcoming" ? "var(--color-martini)" : "#BBF7D0"}`
                                                }}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Live Availability Management */}
                        <div className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Set Work Hour Availability</h2>
                                {isSavingAvailability && (
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-martini)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{
                                            display: "inline-block",
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: "var(--color-martini)",
                                            animation: "pulse 1.5s ease-in-out infinite"
                                        }} />
                                        Saving...
                                    </span>
                                )}
                            </div>
                            <p style={{ color: "var(--color-moss-60)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>Click on time slots to change your operational status. Changes will be saved automatically.</p>
                            <style>{`
                                @keyframes pulse {
                                    0%, 100% { opacity: 1; }
                                    50% { opacity: 0.5; }
                                }
                            `}</style>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                                gap: "0.5rem"
                            }}>
                                {slots.map((slot, index) => (
                                    <button
                                        key={slot.time}
                                        type="button"
                                        onClick={() => toggleSlotAvailability(index)}
                                        style={{
                                            padding: "0.75rem 0.5rem",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            textAlign: "center",
                                            borderRadius: "var(--radius-sm)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            border: "1px solid",
                                            backgroundColor: slot.isAvailable ? "var(--color-white)" : "var(--color-linen)",
                                            borderColor: slot.isAvailable ? "var(--color-martini)" : "#D1D5DB",
                                            color: slot.isAvailable ? "var(--color-martini)" : "var(--color-moss-60)",
                                        }}
                                    >
                                        {slot.time.replace(" WIB", "")}
                                        <span style={{
                                            display: "block",
                                            fontSize: "0.65rem",
                                            marginTop: "4px",
                                            color: slot.isAvailable ? "#16A34A" : "#DC2626"
                                        }}>
                                            {slot.isAvailable ? "● Open" : "✕ Closed"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Dynamic Patient Case Viewer & Triage Inspector */}
                    <div className="card" style={{ position: "sticky", top: "20px" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid #E5E7EB", paddingBottom: "0.75rem" }}>Medical Record Details</h2>

                        {selectedApt ? (
                            (() => {
                                const triageConfig = getTriageBadgeStyles(selectedApt.triageStatus);
                                const isEmergency = selectedApt.triageStatus === "MERAH_DARURAT" || selectedApt.triageStatus === "MERAH_MENDESAK";

                                return (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                        <div>
                                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Patient</label>
                                            <h3 style={{ fontSize: "1.2rem", margin: "0.15rem 0 0 0" }}>{selectedApt.patientName}</h3>
                                            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-moss-60)" }}>Record No: {selectedApt.medicalRecordId}</p>
                                        </div>

                                        {/* Dynamic Triage Emergency Level Component Block */}
                                        <div>
                                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase", display: "block", marginBottom: "0.35rem" }}>
                                                Self-Screening Emergency Level
                                            </label>
                                            <div style={{
                                                padding: "0.85rem",
                                                borderRadius: "var(--radius-sm)",
                                                backgroundColor: triageConfig.bg,
                                                color: triageConfig.text,
                                                border: `1px solid ${triageConfig.border}`,
                                                fontSize: "0.85rem",
                                                fontWeight: 700,
                                                textAlign: "center"
                                            }}>
                                                {triageConfig.label}
                                            </div>

                                            {isEmergency && (
                                                <div style={{
                                                    marginTop: "0.5rem",
                                                    padding: "0.65rem",
                                                    borderRadius: "var(--radius-sm)",
                                                    backgroundColor: "#FFF5F5",
                                                    borderLeft: "3px solid #DC2626",
                                                    fontSize: "0.75rem",
                                                    color: "#991B1B",
                                                    lineHeight: 1.4
                                                }}>
                                                    ⚠️ <strong>Warning:</strong> Patient answered "YES" to safety Red Flag indicators. Thoroughly evaluate contraindications for physical manipulation before starting intervention.
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Session Time</label>
                                            <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.9rem" }}>{selectedApt.date} ({selectedApt.time})</p>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Patient Initial Notes & Symptoms</label>
                                            <div className="card-linen" style={{ padding: "0.75rem", fontSize: "0.85rem", marginTop: "0.25rem", fontStyle: "italic" }}>
                                                "{selectedApt.notes || "No custom notes."}"
                                            </div>
                                        </div>

                                        {/* Clinical Note Viewer */}
                                        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "1.25rem" }}>
                                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                                                Clinical Notes (SOAP)
                                            </label>
                                            <button
                                                onClick={() => setIsClinicalNoteModalOpen(true)}
                                                className="btn-primary"
                                                style={{
                                                    width: "100%",
                                                    fontSize: "0.85rem",
                                                    textAlign: "center"
                                                }}
                                            >
                                                📋 View Clinical Notes
                                            </button>
                                        </div>

                                        {/* Integration Link to Dashboard Pain Mapping */}
                                        <div style={{ paddingTop: "1rem" }}>
                                            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                                                Anatomy & Pain Mapping Data
                                            </label>
                                            <a
                                                href="/painMapping"
                                                className="btn-secondary"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "0.5rem",
                                                    fontSize: "0.85rem",
                                                    textDecoration: "none",
                                                    textAlign: "center"
                                                }}
                                            >
                                                View Assessment Result
                                            </a>
                                        </div>

                                        {selectedApt.status === "Upcoming" && (
                                            <button
                                                onClick={() => handleCompleteAppointment(selectedApt.id)}
                                                className="btn-primary"
                                                style={{ width: "100%", marginTop: "0.5rem" }}
                                            >
                                                Finish Consultation
                                            </button>
                                        )}
                                    </div>
                                );
                            })()
                        ) : (
                            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-moss-60)" }}>
                                <p style={{ fontSize: "0.9rem" }}>Select a consultation schedule to load medical records and visualize patient triage assessment urgency levels.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Clinical Note Modal */}
            {selectedApt && (
                <ClinicalNoteModal
                    isOpen={isClinicalNoteModalOpen}
                    appointmentId={selectedApt.id}
                    patientName={selectedApt.patientName}
                    onClose={() => setIsClinicalNoteModalOpen(false)}
                />
            )}
        </div>
        </ProtectedRoute>
    );
}