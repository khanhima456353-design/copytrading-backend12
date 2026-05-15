import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/+$/, "")
  : "http://localhost:5000";

const adminClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export async function adminLogin(email: string, password: string) {
  const response = await adminClient.post<AdminLoginResponse>("/api/admin/login", {
    email: email.toLowerCase().trim(),
    password: password.trim(),
  });
  return response.data;
}

export async function getAdminStats() {
  const response = await adminClient.get("/api/admin/stats");
  return response.data;
}

export async function getAdminUsers(search = "", status = "", page = 1, limit = 25) {
  const response = await adminClient.get("/api/admin/users", {
    params: { search, status, page, limit },
  });
  return response.data;
}

export async function getAdminKycSubmissions() {
  const response = await adminClient.get("/api/admin/kyc-submissions");
  return response.data;
}

export async function banAdminUser(userId: string, ban: boolean) {
  const response = await adminClient.patch(`/api/admin/user/${userId}`, {
    isBanned: ban,
  });
  return response.data;
}

export async function getAdminUserById(userId: string) {
  const response = await adminClient.get(`/api/admin/user/${userId}`);
  return response.data;
}

export async function getAdminUserDeposits(userId: string) {
  const response = await adminClient.get("/api/admin/deposits", {
    params: { userId },
  });
  return response.data;
}

export async function getAdminUserWithdrawals(userId: string) {
  const response = await adminClient.get("/api/admin/withdrawals", {
    params: { userId },
  });
  return response.data;
}

export async function getAdminUserTransactions(userId: string) {
  const response = await adminClient.get(`/api/admin/balance-history/${userId}`);
  return response.data;
}

export async function getAdminDeposits(status = "") {
  const response = await adminClient.get("/api/admin/deposits", {
    params: { status },
  });
  return response.data;
}

export async function approveAdminDeposit(depositId: string, transactionRef = "") {
  const response = await adminClient.post("/api/admin/deposit/approve", {
    depositId,
    transactionRef,
  });
  return response.data;
}

export async function rejectAdminDeposit(depositId: string, reason = "") {
  const response = await adminClient.post("/api/admin/deposit/reject", {
    depositId,
    reason,
  });
  return response.data;
}

export async function getAdminWithdrawals(status = "") {
  const response = await adminClient.get("/api/admin/withdrawals", {
    params: { status },
  });
  return response.data;
}

export async function approveAdminWithdrawal(withdrawalId: string, notes = "") {
  const response = await adminClient.post("/api/admin/withdrawal/approve", {
    withdrawalId,
    notes,
  });
  return response.data;
}

export async function rejectAdminWithdrawal(withdrawalId: string, reason = "") {
  const response = await adminClient.post("/api/admin/withdrawal/reject", {
    withdrawalId,
    reason,
  });
  return response.data;
}

export async function addAdminBalance(userId: string, amount: number, description = "") {
  const response = await adminClient.post("/api/admin/add-balance", {
    userId,
    amount,
    description,
  });
  return response.data;
}

export async function removeAdminBalance(userId: string, amount: number, description = "") {
  const response = await adminClient.post("/api/admin/remove-balance", {
    userId,
    amount,
    description,
  });
  return response.data;
}

export async function creditAdminBonus(userId: string, amount: number, description = "") {
  const response = await adminClient.post("/api/admin/credit-bonus", {
    userId,
    amount,
    description,
  });
  return response.data;
}

export async function freezeAdminFunds(userId: string, amount: number, description = "") {
  const response = await adminClient.post("/api/admin/freeze-funds", {
    userId,
    amount,
    description,
  });
  return response.data;
}

export async function updateAdminUser(userId: string, updates: Record<string, any>) {
  const response = await adminClient.patch(`/api/admin/user/${userId}`, updates);
  return response.data;
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminEmail");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken") || "";
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}
