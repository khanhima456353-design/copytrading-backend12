import { io } from "socket.io-client";
import axios from "axios";

export const CLOUD_URL = "https://cambridge-wave-executives-societies.trycloudflare.com";
export const LOCAL_URL = "http://localhost:5000";

const CACHE_KEY = "last_good_api";

/* ================= CACHE HELPERS ================= */
function getSavedAPI() {
  return localStorage.getItem(CACHE_KEY);
}

function setSavedAPI(url) {
  localStorage.setItem(CACHE_KEY, url);
}

export { setSavedAPI };

/* ================= API RESOLUTION ================= */
let API = LOCAL_URL;
const API_PROBE_TIMEOUT = 2500;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_PROBE_TIMEOUT);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getAPI() {
  const cached = getSavedAPI();
  const urls = cached ? [cached, LOCAL_URL, CLOUD_URL] : [LOCAL_URL, CLOUD_URL];

  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(`${url}/api/ping`);

      if (res.ok) {
        API = url;
        setSavedAPI(url);
        return url;
      }
    } catch {
      // ignore and try next
    }
  }

  API = LOCAL_URL;
  setSavedAPI(LOCAL_URL);
  return API;
}

/* ================= AXIOS (GLOBAL INSTANCE) ================= */
let apiInstance = null;

export async function getAxios() {
  const baseURL = await getAPI();

  if (!apiInstance || apiInstance.defaults.baseURL !== baseURL) {
    apiInstance = axios.create({
      baseURL,
      withCredentials: true,
    });

    const token = localStorage.getItem("token");
    if (token) {
      apiInstance.defaults.headers.common["Authorization"] =
        "Bearer " + token;
    }
  }

  return apiInstance;
}

/* ================= SOCKET ================= */
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(API, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }
  return socket;
}