import axios from "axios";
import { getAPI } from "../api";

const apiClient = axios.create();

export const sendOtp = async ({ email, captchaToken }) => {
  const baseURL = await getAPI();
  return apiClient.post(`${baseURL}/api/auth/send-otp`, {
    email,
    captchaToken,
  });
};

export const verifyOtp = async (email, otp) => {
  const baseURL = await getAPI();
  return apiClient.post(`${baseURL}/api/auth/verify-otp`, { email, otp });
};

export const setPassword = async (email, password) => {
  const baseURL = await getAPI();
  return apiClient.post(`${baseURL}/api/auth/set-password`, { email, password });
};