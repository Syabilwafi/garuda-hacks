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
  message: "Login successful",
  token: "mock_client_jwt_token_" + Date.now(),
  user: {
    id: "client_001",
    email: "client@example.com",
    fullName: "Sample Client",
    role: "CLIENT",
    phoneNumber: "08123456789",
    dateOfBirth: "1990-01-15",
  },
};

const MOCK_THERAPIST_LOGIN: AuthResponse = {
  message: "Login successful",
  token: "mock_therapist_jwt_token_" + Date.now(),
  user: {
    id: "therapist_001",
    email: "therapist@example.com",
    fullName: "Professional Therapist",
    role: "THERAPIST",
    phoneNumber: "08987654321",
    specialization: "Traditional Massage",
  },
};

const MOCK_CLIENT_SIGNUP: AuthResponse = {
  message: "Client account created successfully",
  token: "mock_client_signup_token_" + Date.now(),
  user: {
    id: "client_new_" + Date.now(),
    email: "newclient@example.com",
    fullName: "New Client",
    role: "CLIENT",
    phoneNumber: "08111111111",
  },
};

const MOCK_THERAPIST_SIGNUP: AuthResponse = {
  message: "Therapist account created successfully",
  token: "mock_therapist_signup_token_" + Date.now(),
  user: {
    id: "therapist_new_" + Date.now(),
    email: "newtherapist@example.com",
    fullName: "New Therapist",
    role: "THERAPIST",
    phoneNumber: "08222222222",
    specialization: "Acupressure",
  },
};

export async function loginClient(payload: LoginPayload): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock login - accept any email/password for demo
      if (payload.email && payload.password) {
        resolve(MOCK_CLIENT_LOGIN);
      } else {
        throw new Error("Invalid credentials");
      }
    }, 800);
  });
}

export async function loginTherapist(payload: LoginPayload): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock login - accept any email/password for demo
      if (payload.email && payload.password) {
        resolve(MOCK_THERAPIST_LOGIN);
      } else {
        throw new Error("Invalid credentials");
      }
    }, 800);
  });
}

export async function signupClient(payload: ClientSignupPayload): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CLIENT_SIGNUP);
    }, 1000);
  });
}

export async function signupTherapist(payload: TherapistSignupPayload): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_THERAPIST_SIGNUP);
    }, 1000);
  });
}

export async function getClientProfile(token: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...MOCK_CLIENT_LOGIN.user,
        role: "CLIENT"
      });
    }, 500);
  });
}

export async function getTherapistProfile(token: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...MOCK_THERAPIST_LOGIN.user,
        role: "THERAPIST"
      });
    }, 500);
  });
}
