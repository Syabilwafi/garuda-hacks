"use client";

import React, { useState } from "react";

interface Appointment {
    id: string;
    patientName: string;
    medicalRecordId: string;
    date: string;
    time: string;
    status: "Upcoming" | "Completed" | "Cancelled";
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
        date: "24 Juli 2026",
        time: "10:00 - 11:00 WIB",
        status: "Upcoming",
        notes: "Keluhan nyeri punggung bawah kronis sejak 3 minggu lalu.",
    },
    {
        id: "APT-003",
        patientName: "Ahmad Subarjo",
        medicalRecordId: "RM-2026-00891",
        date: "24 Juli 2026",
        time: "11:00 - 12:00 WIB",
        status: "Upcoming",
        notes: "Terapi pemulihan pasca stroke ringan.",
    },
    {
        id: "APT-002",
        patientName: "Budi Raharjo",
        medicalRecordId: "RM-2025-01244",
        date: "12 Juni 2026",
        time: "14:00 - 15:30 WIB",
        status: "Completed",
        notes: "Sesi akupunktur ke-4. Progres ketegangan leher membaik.",
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
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [slots, setSlots] = useState<TimeSlotSetting[]>(INITIAL_SLOTS);
    const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

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

    return (
        <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: "var(--color-white)" }}>
            {/* Header Banner */}
            <div style={{ backgroundColor: "var(--color-white)", borderBottom: "1px solid #E5E7EB", padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.5rem", fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}>Portal Praktisi / Terapis</h1>
                        <p style={{ color: "var(--color-moss-60)", fontSize: "0.9rem" }}>Kelola jadwal konsultasi harian dan pantau rekam medis pain mapping pasien.</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", backgroundColor: "#F0FDF4", color: "#15803D", borderRadius: "var(--radius-sm)", fontWeight: 600, border: "1px solid #BBF7D0" }}>
                            🟢 Aktif
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
                                grid-template-columns: 300px 1fr 380px !important;
                            }
                        }
                    `}} />

                    {/* Left Column: Therapist Profile Card */}
                    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ textAlign: "center", borderBottom: "1px solid #E5E7EB", paddingBottom: "1.25rem" }}>
                            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--color-martini)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: "600", margin: "0 auto 1rem" }}>
                                LA
                            </div>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.25rem" }}>Dr. Lana Arisandi</h3>
                            <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem", backgroundColor: "var(--color-sunflower)", color: "var(--color-martini)", borderRadius: "999px", fontWeight: 600 }}>Spesialis Akupunktur</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>NPA ID (IDI)</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)", fontWeight: "600" }}>IDI-99412582</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Spesialisasi</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)" }}>Kebidanan & Akupunktur Medis</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Jadwal Rutin</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)" }}>Senin - Jumat</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Schedule List & Configuration Management */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                        {/* Session Management */}
                        <div className="card">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid #E5E7EB", paddingBottom: "0.75rem" }}>Jadwal Konsultasi Hari Ini</h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {appointments.map((apt) => (
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
                                                <span>📅 {apt.date}</span>
                                                <span>⏰ {apt.time}</span>
                                            </p>
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
                                ))}
                            </div>
                        </div>

                        {/* Live Availability Management */}
                        <div className="card">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>Atur Ketersediaan Jam Kerja</h2>
                            <p style={{ color: "var(--color-moss-60)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>Klik pada slot jam untuk mengubah status operasional Anda secara real-time.</p>

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
                                            {slot.isAvailable ? "● Dibuka" : "✕ Ditutup"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Dynamic Patient Case Viewer */}
                    <div className="card" style={{ position: "sticky", top: "20px" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid #E5E7EB", paddingBottom: "0.75rem" }}>Detail Rekam Medis Sesi</h2>

                        {selectedApt ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Pasien</label>
                                    <h3 style={{ fontSize: "1.2rem", margin: "0.15rem 0 0 0" }}>{selectedApt.patientName}</h3>
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-moss-60)" }}>Nomor RM: {selectedApt.medicalRecordId}</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Waktu Sesi</label>
                                    <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.9rem" }}>📅 {selectedApt.date} ({selectedApt.time})</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Catatan Awal Pasien</label>
                                    <div className="card-linen" style={{ padding: "0.75rem", fontSize: "0.85rem", marginTop: "0.25rem", fontStyle: "italic" }}>
                                        "{selectedApt.notes || "Tidak ada catatan kustom."}"
                                    </div>
                                </div>

                                {/* Integration Link to Dashboard Pain Mapping */}
                                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "1.25rem" }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                                        Anatomi & Data Pemetaan Nyeri
                                    </label>
                                    <a
                                        href={`/dashboard/client/painMapping?patientId=${selectedApt?.medicalRecordId}`}
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
                                        🔍 Buka Berkas Pain Mapping
                                    </a>
                                </div>

                                {selectedApt.status === "Upcoming" && (
                                    <button
                                        onClick={() => handleCompleteAppointment(selectedApt.id)}
                                        className="btn-primary"
                                        style={{ width: "100%", marginTop: "0.5rem" }}
                                    >
                                        Selesaikan Sesi Konsultasi
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-moss-60)" }}>
                                <p style={{ fontSize: "0.9rem" }}>Silakan pilih salah satu jadwal janji temu untuk memuat berkas rekam medis pasien.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}