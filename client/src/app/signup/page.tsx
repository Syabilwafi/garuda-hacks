"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image"

type SignupRole = "CLIENT" | "THERAPIST" | null;

interface ClientFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface TherapistFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: string;
}

const inputStyle = {
  width: "100%",
  padding: "0.875rem 1rem",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "0.95rem",
  boxSizing: "border-box" as const,
  transition: "border-color 0.3s ease",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block" as const,
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#111111",
  marginBottom: "0.75rem",
};

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isLoading, error, clearError } = useAuth();

  const initialRole = (searchParams.get("role")?.toUpperCase() as SignupRole) || null;
  const [selectedRole, setSelectedRole] = useState<SignupRole>(initialRole);
  const [formError, setFormError] = useState("");

  const [clientForm, setClientForm] = useState<ClientFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  const [therapistForm, setTherapistForm] = useState<TherapistFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
  });

  const handleRoleSelect = (role: SignupRole) => {
    setSelectedRole(role);
    setFormError("");
    clearError();
  };

  const validateClientForm = (): boolean => {
    if (!clientForm.fullName.trim()) {
      setFormError("Full name is required");
      return false;
    }
    if (!clientForm.email.trim()) {
      setFormError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientForm.email)) {
      setFormError("Invalid email format");
      return false;
    }
    if (!clientForm.password) {
      setFormError("Password is required");
      return false;
    }
    if (clientForm.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }
    if (!clientForm.confirmPassword) {
      setFormError("Password confirmation is required");
      return false;
    }
    if (clientForm.password !== clientForm.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateTherapistForm = (): boolean => {
    if (!therapistForm.fullName.trim()) {
      setFormError("Full name is required");
      return false;
    }
    if (!therapistForm.email.trim()) {
      setFormError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(therapistForm.email)) {
      setFormError("Invalid email format");
      return false;
    }
    if (!therapistForm.password) {
      setFormError("Password is required");
      return false;
    }
    if (therapistForm.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }
    if (!therapistForm.confirmPassword) {
      setFormError("Password confirmation is required");
      return false;
    }
    if (therapistForm.password !== therapistForm.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    if (!therapistForm.specialization) {
      setFormError("Specialization is required");
      return false;
    }
    if (!therapistForm.licenseNumber.trim()) {
      setFormError("License number is required");
      return false;
    }
    return true;
  };

  const isClientFormValid =
    clientForm.fullName.trim() &&
    clientForm.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email) &&
    clientForm.password &&
    clientForm.password.length >= 6 &&
    clientForm.confirmPassword &&
    clientForm.password === clientForm.confirmPassword;

  const isTherapistFormValid =
    therapistForm.fullName.trim() &&
    therapistForm.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(therapistForm.email) &&
    therapistForm.password &&
    therapistForm.password.length >= 6 &&
    therapistForm.confirmPassword &&
    therapistForm.password === therapistForm.confirmPassword &&
    therapistForm.specialization &&
    therapistForm.licenseNumber.trim();

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateClientForm()) return;

    try {
      await signup(
        {
          email: clientForm.email,
          password: clientForm.password,
          fullName: clientForm.fullName,
          phoneNumber: clientForm.phoneNumber || undefined,
          dateOfBirth: clientForm.dateOfBirth || undefined,
        },
        "CLIENT"
      );
      router.push("/dashboard/client");
    } catch (err) {
      setFormError(error || "Registration failed");
    }
  };

  const handleTherapistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTherapistForm()) return;

    try {
      await signup(
        {
          email: therapistForm.email,
          password: therapistForm.password,
          fullName: therapistForm.fullName,
          phoneNumber: therapistForm.phoneNumber || undefined,
          specialization: therapistForm.specialization,
          licenseNumber: therapistForm.licenseNumber,
          yearsOfExperience: therapistForm.yearsOfExperience
            ? parseInt(therapistForm.yearsOfExperience)
            : undefined,
        },
        "THERAPIST"
      );
      router.push("/dashboard/therapist");
    } catch (err) {
      setFormError(error || "Registration failed");
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-white)",
        }}
      >
        <LoadingSpinner message="Processing registration..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFCF8",
        }}
      >
        <LoadingSpinner message="Processing registration..." />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FDFCF8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 2rem 3rem",
        position: "relative",
        fontFamily: "var(--font-primary, system-ui, sans-serif)",
      }}
    >
      {/* Subtle Grid Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            padding: "3rem 2rem 2rem",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
              marginBottom: "1.5rem",
            }}
          >
              <div style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
              }}
              >
                  <Image src="/logo.png" alt="Logo" width={48} height={48} />
              </div>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#111111" }}>
            Sign Up
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#4B5563", margin: 0 }}>
            Create a new account to get started
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: "2.5rem 2rem" }}>
          {!selectedRole ? (
            /* Role Selection */
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2rem", color: "#111111" }}>
                Choose your role
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Client Button */}
                <button
                  onClick={() => handleRoleSelect("CLIENT")}
                  style={{
                    padding: "1.5rem",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--color-martini)";
                    (e.target as HTMLElement).style.backgroundColor = "#FAFDF9";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "#E5E7EB";
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111111", marginBottom: "0.5rem" }}>
                    Sign up as Client
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", margin: 0 }}>
                    Access 3D pain mapping and therapy recommendations
                  </p>
                </button>

                {/* Therapist Button */}
                <button
                  onClick={() => handleRoleSelect("THERAPIST")}
                  style={{
                    padding: "1.5rem",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--color-martini)";
                    (e.target as HTMLElement).style.backgroundColor = "#FAFDF9";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "#E5E7EB";
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111111", marginBottom: "0.5rem" }}>
                      Sign up as Therapist
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", margin: 0 }}>
                    Manage therapy sessions and evaluate your techniques
                  </p>
                </button>
              </div>
            </div>
          ) : selectedRole === "CLIENT" ? (
            /* Client Signup Form */
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
                <button
                  onClick={() => handleRoleSelect(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-martini)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    marginRight: "1rem",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ←
                </button>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                  Sign up as Client
                </h2>
              </div>

              <form onSubmit={handleClientSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={clientForm.fullName}
                    onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="example@email.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    value={clientForm.phoneNumber}
                    onChange={(e) => setClientForm({ ...clientForm, phoneNumber: e.target.value })}
                    placeholder="1234567890"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <input
                    type="date"
                    value={clientForm.dateOfBirth}
                    onChange={(e) => setClientForm({ ...clientForm, dateOfBirth: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password *</label>
                  <input
                    type="password"
                    value={clientForm.password}
                    onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={labelStyle}>Confirm Password *</label>
                  <input
                    type="password"
                    value={clientForm.confirmPassword}
                    onChange={(e) => setClientForm({ ...clientForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Error Messages - Client */}
                {(formError || error) && (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FECACA",
                      borderRadius: "8px",
                      color: "#DC2626",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formError || error}
                  </div>
                )}

                {/* Submit Button - Client */}
                <button
                  type="submit"
                  disabled={isLoading || !isClientFormValid}
                  style={{
                    padding: "0.95rem",
                    backgroundColor: isLoading || !isClientFormValid ? "#D1D5DB" : "var(--color-martini)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isLoading || !isClientFormValid ? "not-allowed" : "pointer",
                    marginTop: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isClientFormValid) {
                      (e.target as HTMLElement).style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isClientFormValid) {
                      (e.target as HTMLElement).style.opacity = "1";
                    }
                  }}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </button>
              </form>

              {/* Login Link - Client */}
              <div style={{ marginTop: "2rem", textAlign: "center", paddingTop: "2rem", borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: "0.95rem", color: "#4B5563", margin: 0 }}>
                  Already have an account?{" "}
                  <Link href="/login" style={{ color: "var(--color-martini)", textDecoration: "none", fontWeight: 600 }}>
                    Sign in now
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Therapist Signup Form */
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
                <button
                  onClick={() => handleRoleSelect(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-martini)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    marginRight: "1rem",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ←
                </button>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                  Sign up as Therapist
                </h2>
              </div>

              <form onSubmit={handleTherapistSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={therapistForm.fullName}
                    onChange={(e) => setTherapistForm({ ...therapistForm, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={therapistForm.email}
                    onChange={(e) => setTherapistForm({ ...therapistForm, email: e.target.value })}
                    placeholder="example@email.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    value={therapistForm.phoneNumber}
                    onChange={(e) => setTherapistForm({ ...therapistForm, phoneNumber: e.target.value })}
                    placeholder="1234567890"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label style={labelStyle}>Specialization *</label>
                  <select
                    value={therapistForm.specialization}
                    onChange={(e) => setTherapistForm({ ...therapistForm, specialization: e.target.value })}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                    style={{
                      ...inputStyle,
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">Choose specialization</option>
                    <option value="Traditional Massage">Traditional Massage</option>
                    <option value="Acupressure">Acupressure</option>
                    <option value="Reflexology">Reflexology</option>
                    <option value="Chiropractic">Chiropractic</option>
                    <option value="Physical Therapy">Physical Therapy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* License Number */}
                <div>
                  <label style={labelStyle}>License Number *</label>
                  <input
                    type="text"
                    value={therapistForm.licenseNumber}
                    onChange={(e) => setTherapistForm({ ...therapistForm, licenseNumber: e.target.value })}
                    placeholder="Enter your license number"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label style={labelStyle}>Years of Experience</label>
                  <input
                    type="number"
                    value={therapistForm.yearsOfExperience}
                    onChange={(e) => setTherapistForm({ ...therapistForm, yearsOfExperience: e.target.value })}
                    placeholder="Example: 5"
                    min="0"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password *</label>
                  <input
                    type="password"
                    value={therapistForm.password}
                    onChange={(e) => setTherapistForm({ ...therapistForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={labelStyle}>Confirm Password *</label>
                  <input
                    type="password"
                    value={therapistForm.confirmPassword}
                    onChange={(e) => setTherapistForm({ ...therapistForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Error Messages - Therapist */}
                {(formError || error) && (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FECACA",
                      borderRadius: "8px",
                      color: "#DC2626",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formError || error}
                  </div>
                )}

                {/* Submit Button - Therapist */}
                <button
                  type="submit"
                  disabled={isLoading || !isTherapistFormValid}
                  style={{
                    padding: "0.95rem",
                    backgroundColor: isLoading || !isTherapistFormValid ? "#D1D5DB" : "var(--color-martini)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isLoading || !isTherapistFormValid ? "not-allowed" : "pointer",
                    marginTop: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isTherapistFormValid) {
                      (e.target as HTMLElement).style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isTherapistFormValid) {
                      (e.target as HTMLElement).style.opacity = "1";
                    }
                  }}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </button>
              </form>

              {/* Login Link - Therapist */}
              <div style={{ marginTop: "2rem", textAlign: "center", paddingTop: "2rem", borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: "0.95rem", color: "#4B5563", margin: 0 }}>
                  Already have an account?{" "}
                  <Link href="/login" style={{ color: "var(--color-martini)", textDecoration: "none", fontWeight: 600 }}>
                    Sign in now
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
