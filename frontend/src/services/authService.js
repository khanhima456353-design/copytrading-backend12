import axios from "axios";

const baseURL = "http://localhost:5000";

export const sendOtp = async ({ email, captchaToken }) => {
  return axios.post("http://localhost:5000/api/auth/send-otp", {
    email,
    captchaToken, // MUST match backend name exactly
  });
};

export const verifyOtp = (email, otp) =>
  axios.post(`${baseURL}/api/auth/verify-otp`, { email, otp });

export const setPassword = (email, password) =>
  axios.post(`${baseURL}/api/auth/set-password`, { email, password });