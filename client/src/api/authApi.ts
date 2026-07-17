import { apiClient } from "@/utils/apiClient";
import { API_CONFIG, ERROR_MESSAGES } from "@/constants";

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "CLIENT" | "THERAPIST";
    phoneNumber?: string;
    dateOfBirth?: string;
    specialization?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ClientSignupPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface TherapistSignupPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience?: number;
}

const MOCK_CLIENT_LOGIN: AuthResponse = {
  message: "Login berhasil",
  token: "mock_client_jwt_token_" + Date.now(),
  user: {
    id: "client_001",
    email: "client@example.com",
    fullName: "Pasien Contoh",
    role: "CLIENT",
    phoneNumber: "08123456789",
    dateOfBirth: "1990-01-15",
  },
};

const MOCK_THERAPIST_LOGIN: AuthResponse = {
  message: "Login berhasil",
  token: "mock_therapist_jwt_token_" + Date.now(),
  user: {
    id: "therapist_001",
    email: "therapist@example.com",
    fullName: "Terapis Profesional",
    role: "THERAPIST",
    phoneNumber: "08987654321",
    specialization: "Traditional Massage",
  },
};

const MOCK_CLIENT_SIGNUP: AuthResponse = {
  message: "Akun klien berhasil dibuat",
  token: "mock_client_signup_token_" + Date.now(),
  user: {
    id: "client_new_" + Date.now(),
    email: "newclient@example.com",
    fullName: "Klien Baru",
    role: "CLIENT",
    phoneNumber: "08111111111",
  },
};

const MOCK_THERAPIST_SIGNUP: AuthResponse = {
  message: "Akun terapis berhasil dibuat",
  token: "mock_therapist_signup_token_" + Date.now(),
  user: {
    id: "therapist_new_" + Date.now(),
    email: "newtherapist@example.com",
    fullName: "Terapis Baru",
    role: "THERAPIST",
    phoneNumber: "08222222222",
    specialization: "Acupressure",
  },
};

export async function loginClient(payload: LoginPayload): Promise<AuthResponse> {
  return await apiClient<AuthResponse>("/api/auth/login-client", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginTherapist(payload: LoginPayload): Promise<AuthResponse> {
  return await apiClient<AuthResponse>("/api/auth/login-therapist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signupClient(payload: ClientSignupPayload): Promise<AuthResponse> {
  return await apiClient<AuthResponse>("/api/auth/register-client", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signupTherapist(payload: TherapistSignupPayload): Promise<AuthResponse> {
  return await apiClient<AuthResponse>("/api/auth/register-therapist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getClientProfile(token: string) {
  try {
    return await apiClient("/api/auth/client/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.warn("[authApi] Failed to fetch client profile:", error);
    throw error;
  }
}

export async function getTherapistProfile(token: string) {
  try {
    return await apiClient("/api/auth/therapist/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.warn("[authApi] Failed to fetch therapist profile:", error);
    throw error;
  }
}
