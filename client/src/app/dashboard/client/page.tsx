"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { bookingApi } from "@/api/bookingApi";
import { useAuth } from "@/context/AuthContext";

interface Appointment {
    id: string;
    professionalName: string;
    role: string;
    date: string;
    time: string;
    status: "Upcoming" | "Completed" | "Cancelled";
}

interface TimeSlot {
    time: string;
    isAvailable: boolean;
}

interface Professional {
    id: string;
    name: string;
    specialty: string;
    availability: string;
    rating: number;
    slots: TimeSlot[];
}

const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: "APT-001",
        professionalName: "Dr. Lana Arisandi",
        role: "Spesialis Akupunktur & Medis",
        date: "24 Juli 2026",
        time: "10:00 - 11:00 WIB",
        status: "Upcoming",
    },
    {
        id: "APT-002",
        professionalName: "Prof. Budi Raharjo",
        role: "Praktisi Terapi Tradisional",
        date: "12 Juni 2026",
        time: "14:00 - 15:30 WIB",
        status: "Completed",
    },
];

const PROFESSIONALS: Professional[] = [
    {
        id: "P-1",
        name: "Dr. Lana Arisandi",
        specialty: "Spesialis Kebidanan & Akupunktur",
        availability: "Senin - Jumat",
        rating: 4.9,
        slots: [
            { time: "08:00 - 09:00 WIB", isAvailable: true },
            { time: "09:00 - 10:00 WIB", isAvailable: false },
            { time: "10:00 - 11:00 WIB", isAvailable: true },
            { time: "11:00 - 12:00 WIB", isAvailable: true },
            { time: "14:00 - 15:00 WIB", isAvailable: false },
            { time: "15:00 - 16:00 WIB", isAvailable: true },
        ]
    },
    {
        id: "P-2",
        name: "Prof. Budi Raharjo",
        specialty: "Herbalis & Terapi Meridian",
        availability: "Selasa & Kamis",
        rating: 4.8,
        slots: [
            { time: "09:00 - 10:30 WIB", isAvailable: true },
            { time: "10:30 - 12:00 WIB", isAvailable: false },
            { time: "13:30 - 15:00 WIB", isAvailable: true },
            { time: "15:00 - 16:30 WIB", isAvailable: false },
        ]
    },
    {
        id: "P-3",
        name: "Hendra Wijaya, L.Ac",
        specialty: "Ahli Jarum Tradisional (TCM)",
        availability: "Setiap Hari",
        rating: 4.7,
        slots: [
            { time: "08:30 - 09:30 WIB", isAvailable: true },
            { time: "09:30 - 10:30 WIB", isAvailable: true },
            { time: "13:00 - 14:00 WIB", isAvailable: true },
            { time: "14:00 - 15:00 WIB", isAvailable: false },
            { time: "15:00 - 16:00 WIB", isAvailable: false },
            { time: "16:00 - 17:00 WIB", isAvailable: true },
        ]
    },
];

export default function ClientDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isApiAvailable, setIsApiAvailable] = useState(true);
    const [isFetchingTherapists, setIsFetchingTherapists] = useState(false);

    // Fetch therapists when modal opens
    useEffect(() => {
        if (!isModalOpen) return;

        const loadTherapists = async () => {
            setIsFetchingTherapists(true);
            try {
                const therapists = await bookingApi.getAllTherapists();
                if (therapists && therapists.length > 0) {
                    const mapped: Professional[] = therapists.map(t => ({
                        id: t.id,
                        name: t.name,
                        specialty: t.specialty,
                        availability: t.availability,
                        rating: t.rating,
                        slots: [
                            { time: "08:00 - 09:00 WIB", isAvailable: true },
                            { time: "09:00 - 10:00 WIB", isAvailable: false },
                            { time: "10:00 - 11:00 WIB", isAvailable: true },
                            { time: "11:00 - 12:00 WIB", isAvailable: true },
                            { time: "14:00 - 15:00 WIB", isAvailable: false },
                            { time: "15:00 - 16:00 WIB", isAvailable: true },
                        ],
                    }));
                    setProfessionals(mapped);
                    setIsApiAvailable(true);
                } else {
                    // If no therapists returned, use fallback
                    setProfessionals(PROFESSIONALS);
                }
            } catch (error) {
                console.warn('Failed to load therapists from API, using fallback data');
                setProfessionals(PROFESSIONALS);
                setIsApiAvailable(false);
            } finally {
                setIsFetchingTherapists(false);
            }
        };

        loadTherapists();
    }, [isModalOpen]);

    useEffect(() => {
        const loadAppointments = async () => {
            if (!user?.id) return;

            try {
                const bookings = await bookingApi.getUserBookings(user.id);
                if (bookings && bookings.length > 0) {
                    const mapped = bookings.map(b => ({
                        id: b.id,
                        professionalName: b.therapistName,
                        role: b.therapistSpecialization,
                        date: b.date,
                        time: `${b.startTime} - ${b.endTime}`,
                        status: b.status as "Upcoming" | "Completed" | "Cancelled",
                    }));
                    setAppointments([...mapped, ...INITIAL_APPOINTMENTS]);
                    setIsApiAvailable(true);
                }
            } catch (error) {
                console.warn('API unavailable, using fallback data');
                setIsApiAvailable(false);
            }
        };

        loadAppointments();
    }, [user?.id]);

    const filteredProfessionals = professionals.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProf || !bookingDate || !bookingTime) return;

        setIsLoading(true);

        try {
            if (isApiAvailable && user?.id) {
                const timeParts = bookingTime.split(' - ');
                const result = await bookingApi.createBooking({
                    userId: user.id,
                    therapistId: selectedProf.id,
                    date: bookingDate,
                    startTime: timeParts[0],
                    endTime: timeParts[1],
                });

                if (result) {
                    const formattedDate = new Date(bookingDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });

                    const newApt: Appointment = {
                        id: result.id,
                        professionalName: selectedProf.name,
                        role: selectedProf.specialty,
                        date: formattedDate,
                        time: bookingTime,
                        status: "Upcoming",
                    };

                    setAppointments([newApt, ...appointments]);
                } else {
                    throw new Error('Booking failed');
                }
            } else {
                // Fallback: use mock booking
                const formattedDate = new Date(bookingDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

                const newApt: Appointment = {
                    id: `APT-00${appointments.length + 1}`,
                    professionalName: selectedProf.name,
                    role: selectedProf.specialty,
                    date: formattedDate,
                    time: bookingTime,
                    status: "Upcoming",
                };

                setAppointments([newApt, ...appointments]);
            }

            setIsModalOpen(false);
            setSelectedProf(null);
            setBookingDate("");
            setBookingTime("");
            setSearchTerm("");

            router.push("/dashboard/client/painMapping");
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Gagal membuat janji temu. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute requiredRole="CLIENT">
        <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: "var(--color-white)" }}>
            {/* Header Banner */}
            <div style={{ backgroundColor: "var(--color-white)", borderBottom: "1px solid #E5E7EB", padding: "2.5rem 1.5rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.5rem", fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}>Dashboard Pasien</h1>
                        <p style={{ color: "var(--color-moss-60)", fontSize: "0.9rem" }}>Kelola profil medis Anda dan atur jadwal janji temu dengan praktisi profesional.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Buat Janji Temu
                    </button>
                </div>
            </div>

            {/* Main Content Dashboard Layout */}
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
                <div className="responsive-dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>

                    <style dangerouslySetInnerHTML={{__html: `
                        @media (min-width: 1024px) {
                            .responsive-dashboard-grid {
                                grid-template-columns: 320px 1fr !important;
                            }
                        }
                    `}} />

                    {/* Left Column: User Profile Card */}
                    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ textAlign: "center", borderBottom: "1px solid #E5E7EB", paddingBottom: "1.25rem" }}>
                            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--color-martini)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: "600", margin: "0 auto 1rem" }}>
                                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                            </div>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.25rem" }}>{user?.fullName || 'Pengguna'}</h3>
                            <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem", backgroundColor: "var(--color-sunflower)", color: "var(--color-martini)", borderRadius: "999px", fontWeight: 600 }}>Pasien</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Email</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)" }}>{user?.email || '-'}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>Nomor Telepon</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)" }}>{user?.phoneNumber || '-'}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-moss-60)", textTransform: "uppercase" }}>ID Pengguna</label>
                                <p style={{ fontSize: "0.9rem", color: "var(--color-moss)", fontWeight: "600" }}>{user?.id || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Appointment History List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div className="card">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid #E5E7EB", paddingBottom: "0.75rem" }}>Riwayat Janji Temu</h2>

                            {appointments.length === 0 ? (
                                <div className="card-linen" style={{ textAlign: "center", padding: "3rem" }}>
                                    <p style={{ color: "var(--color-moss-60)", fontSize: "0.95rem" }}>Belum ada jadwal janji temu aktif.</p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {appointments.map((apt) => (
                                        <div key={apt.id} className="card-linen" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", padding: "1.25rem" }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                    <h3 style={{ fontSize: "1rem", margin: 0 }}>{apt.professionalName}</h3>
                                                    <span style={{ fontSize: "0.75rem", color: "var(--color-moss-60)" }}>• {apt.role}</span>
                                                </div>
                                                <p style={{ fontSize: "0.85rem", color: "var(--color-moss-80)", display: "flex", gap: "2rem", margin: 0 }}>
                                                    <span><span style={{fontWeight: 700}}>Date: </span>{apt.date}</span>
                                                    <span><span style={{fontWeight: 700}}>Time: </span>{apt.time}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <span style={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    padding: "0.25rem 0.75rem",
                                                    borderRadius: "var(--radius-sm)",
                                                    backgroundColor: apt.status === "Upcoming" ? "var(--color-sunflower)" : apt.status === "Completed" ? "#F0FDF4" : "#FEF2F2",
                                                    color: apt.status === "Upcoming" ? "var(--color-martini)" : apt.status === "Completed" ? "#15803D" : "#DC2626",
                                                    border: `1px solid ${apt.status === "Upcoming" ? "var(--color-martini)" : apt.status === "Completed" ? "#BBF7D0" : "#FCA5A5"}`
                                                }}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Micro Modal Overlay & Window Component */}
            {isModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(31, 41, 55, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }} className="animate-fade-in">
                    <div className="card" style={{ width: "100%", maxWidth: "520px", maxHeight: "85vh", overflowY: "auto", position: "relative" }}>

                        {/* Close Modal Button */}
                        <button onClick={() => { setIsModalOpen(false); setSelectedProf(null); setSearchTerm(""); }} style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-moss-60)" }}>&times;</button>

                        <h2 style={{ fontSize: "1.35rem", marginBottom: "1rem" }}>Cari & Pilih Profesional</h2>

                        {!selectedProf ? (
                            <>
                                {isFetchingTherapists ? (
                                    <div style={{
                                        padding: "2rem",
                                        textAlign: "center",
                                        color: "var(--color-moss-60)"
                                    }}>
                                        <div style={{
                                            display: "inline-block",
                                            width: "40px",
                                            height: "40px",
                                            border: "4px solid #E5E7EB",
                                            borderTop: "4px solid var(--color-martini)",
                                            borderRadius: "50%",
                                            animation: "spin 1s linear infinite",
                                            marginBottom: "1rem"
                                        }} />
                                        <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>Memuat daftar terapis...</p>
                                        <style>{`
                                            @keyframes spin {
                                                0% { transform: rotate(0deg); }
                                                100% { transform: rotate(360deg); }
                                            }
                                        `}</style>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: "1.25rem" }}>
                                            <input type="text" className="input" placeholder="Cari berdasarkan nama ahli atau spesialisasi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isFetchingTherapists} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                            {filteredProfessionals.map((prof) => (
                                                <div key={prof.id} onClick={() => setSelectedProf(prof)} style={{ cursor: "pointer", border: "1px solid #E5E7EB", padding: "1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-martini)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}>
                                                    <div>
                                                        <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.95rem" }}>{prof.name}</h4>
                                                        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-moss-60)" }}>{prof.specialty}</p>
                                                        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "var(--color-martini)" }}>📅 {prof.availability}</p>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#EAB308" }}>★ {prof.rating}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {filteredProfessionals.length === 0 && !isFetchingTherapists && (
                                                <p style={{ fontSize: "0.85rem", color: "var(--color-moss-60)", textAlign: "center" }}>Profesional tidak ditemukan.</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            /* Final Configuration Form Step */
                            <form onSubmit={handleCreateAppointment} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div className="card-linen" style={{ padding: "1rem" }}>
                                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-moss-60)" }}>Profesional Terpilih:</p>
                                    <h4 style={{ margin: "0.15rem 0", fontSize: "1rem" }}>{selectedProf.name}</h4>
                                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-martini)" }}>{selectedProf.specialty}</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                                        Tanggal Janji Temu
                                    </label>
                                    <input
                                        type="date"
                                        className="input"
                                        required
                                        value={bookingDate}
                                        onChange={(e) => {
                                            setBookingDate(e.target.value);
                                            setBookingTime("");
                                        }}
                                        style={{
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
                                        Pilih Jam Operasional yang Tersedia
                                    </label>

                                    {!bookingDate ? (
                                        <div style={{
                                            padding: "1rem",
                                            textAlign: "center",
                                            border: "1px dashed var(--color-slate-300, #D1D5DB)",
                                            borderRadius: "var(--radius-sm)",
                                            backgroundColor: "var(--color-linen)",
                                            color: "var(--color-moss-60)",
                                            fontSize: "0.85rem"
                                        }}>
                                            Silakan pilih tanggal terlebih dahulu untuk melihat jadwal yang tersedia.
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                                            gap: "0.5rem"
                                        }}>
                                            {selectedProf.slots.map((slot) => {
                                                const isSelected = bookingTime === slot.time;

                                                return (
                                                    <button
                                                        key={slot.time}
                                                        type="button"
                                                        disabled={!slot.isAvailable}
                                                        onClick={() => setBookingTime(slot.time)}
                                                        style={{
                                                            padding: "0.65rem 0.5rem",
                                                            fontSize: "0.75rem",
                                                            fontWeight: 500,
                                                            textAlign: "center",
                                                            borderRadius: "var(--radius-sm)",
                                                            cursor: slot.isAvailable ? "pointer" : "not-allowed",
                                                            transition: "all 0.2s ease",
                                                            border: "1px solid",

                                                            backgroundColor: !slot.isAvailable
                                                                ? "var(--color-linen)"
                                                                : isSelected
                                                                    ? "var(--color-martini)"
                                                                    : "var(--color-white)",

                                                            borderColor: !slot.isAvailable
                                                                ? "#E5E7EB"
                                                                : isSelected
                                                                    ? "var(--color-martini)"
                                                                    : "#D1D5DB",

                                                            color: !slot.isAvailable
                                                                ? "var(--color-moss-60)"
                                                                : isSelected
                                                                    ? "var(--color-white)"
                                                                    : "var(--color-moss)",

                                                            opacity: !slot.isAvailable ? 0.55 : 1,
                                                        }}
                                                    >
                                                        {slot.time.replace(" WIB", "")}
                                                        <span style={{ display: "block", fontSize: "0.65rem", marginTop: "2px", opacity: 0.8 }}>
                                                            {slot.isAvailable ? "Tersedia" : "Penuh"}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* Native validation validation fallback */}
                                    <input type="hidden" required value={bookingTime} name="bookingTime" />
                                </div>

                                {!isApiAvailable && (
                                    <div style={{
                                        padding: "0.65rem",
                                        borderRadius: "var(--radius-sm)",
                                        backgroundColor: "#FFF5F5",
                                        borderLeft: "3px solid #DC2626",
                                        fontSize: "0.75rem",
                                        color: "#991B1B",
                                        lineHeight: 1.4
                                    }}>
                                        ⚠️ Mode Demo: Koneksi backend tidak tersedia, menggunakan data simulasi.
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => { setSelectedProf(null); setBookingTime(""); }}
                                        disabled={isLoading}
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ flex: 2 }}
                                        disabled={!bookingDate || !bookingTime || isLoading}
                                    >
                                        {isLoading ? 'Memproses...' : 'Konfirmasi Jadwal'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
        </ProtectedRoute>
    );
}