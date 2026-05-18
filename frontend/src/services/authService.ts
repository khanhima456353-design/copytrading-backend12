/**
 * Authentication Service
 * Handles all auth-related API calls with proper session management
 */

import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/+$/, "")
  : "http://localhost:5000";

interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  sessionToken?: string;
  accessToken?: string;
  refreshToken?: string;
  otpId?: string;
  expiresIn?: number;
  user?: {
    userId?: string;
    [key: string]: any;
  } | null;
}

interface SendOtpPayload {
  email: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
  otpId: string;
}

interface SetPasswordPayload {
  email: string;
  password: string;
  sessionToken: string;
}

// Create axios instance with default config
const TOKEN_KEY = "token";
const LEGACY_TOKEN_KEY = "sessionToken";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const getAuthToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || "";
};

const storeAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

const clearAuthStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  localStorage.removeItem("sessionExpiry");
};

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session on unauthorized
      clearAuthStorage();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Send OTP to email
 * @param payload - Email and captcha token
 * @returns Promise with OTP ID and session info
 */
export const sendOtp = async (
  payload: SendOtpPayload
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/send-otp",
      payload
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send OTP");
    }

    return response.data;
  } catch (error) {
    console.error("Send OTP Error:", error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param payload - Email, OTP, and OTP ID
 * @returns Promise with session token
 */
export const verifyOtp = async (
  payload: VerifyOtpPayload
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/verify-otp",
      payload
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "OTP verification failed");
    }

    // Store session token if provided
    if (response.data.token || response.data.sessionToken) {
      storeAuthToken(response.data.token || response.data.sessionToken || "");
      if (response.data.expiresIn) {
        localStorage.setItem(
          "sessionExpiry",
          (Date.now() + response.data.expiresIn * 1000).toString()
        );
      }
    }

    return response.data;
  } catch (error) {
    console.error("Verify OTP Error:", error);
    throw error;
  }
};

/**
 * Resend OTP code
 * @param email - User email
 * @param otpId - Previous OTP ID
 * @returns Promise with new OTP session
 */
export const resendOtp = async (
  email: string,
  otpId: string
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/api/auth/resend-otp", {
      email: email.toLowerCase().trim(),
      otpId,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to resend OTP");
    }

    return response.data;
  } catch (error) {
    console.error("Resend OTP Error:", error);
    throw error;
  }
};

/**
 * Set user password after OTP verification
 * @param payload - Email, password, and session token
 * @returns Promise with auth status
 */
export const setPassword = async (
  payload: SetPasswordPayload
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/set-password",
      payload
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to set password");
    }

    // Store final session token
    if (response.data.token || response.data.sessionToken) {
      storeAuthToken(response.data.token || response.data.sessionToken || "");
      localStorage.setItem("userEmail", payload.email);
      if (response.data.expiresIn) {
        localStorage.setItem(
          "sessionExpiry",
          (Date.now() + response.data.expiresIn * 1000).toString()
        );
      }
    }

    return response.data;
  } catch (error) {
    console.error("Set Password Error:", error);
    throw error;
  }
};

/**
 * Login with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with session token
 */
export const loginWithPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", {
      identifier: email.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const authToken =
      response.data.accessToken || response.data.token || response.data.sessionToken || "";
    const refreshToken = response.data.refreshToken;
    const success = response.data.success === true || Boolean(authToken);

    if (!success) {
      throw new Error(response.data.message || "Login failed");
    }

    if (authToken) {
      storeAuthToken(authToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("userEmail", email);
      if (response.data.user?.userId) {
        localStorage.setItem("userId", response.data.user.userId);
      }
      const expiryMs = response.data.expiresIn
        ? Number(response.data.expiresIn) * 1000
        : 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + expiryMs).toString()
      );
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

/**
 * Logout user and clear session
 */
export const logout = (): void => {
  clearAuthStorage();
};

/**
 * Check if user session is valid
 * @returns boolean - True if session is valid and not expired
 */
export const isSessionValid = (): boolean => {
  const token = getAuthToken();
  const expiry = localStorage.getItem("sessionExpiry");

  if (!token) return false;
  if (!expiry) return true;

  const expiryTime = parseInt(expiry, 10);
  return Date.now() < expiryTime;
};

/**
 * Get current user email from session
 * @returns string - User email or empty string
 */
export const getCurrentUser = (): string => {
  return localStorage.getItem("userEmail") || "";
};

/**
 * Get authentication token
 * @returns string - Auth token or empty string
 */
export const getToken = (): string => {
  return getAuthToken();
};

export const getSessionToken = (): string => {
  return getAuthToken();
};

export default {
  sendOtp,
  verifyOtp,
  resendOtp,
  setPassword,
  loginWithPassword,
  logout,
  isSessionValid,
  getCurrentUser,
  getToken,
  getSessionToken,
};
