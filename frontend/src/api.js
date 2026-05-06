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

export function resetAPI() {
  localStorage.removeItem(CACHE_KEY);
  API = LOCAL_URL;
  socket = null;
  socketBaseURL = null;
  apiInstance = null;
}

/* ================= API RESOLUTION ================= */
let API = LOCAL_URL;
const API_PROBE_TIMEOUT = 2500;

const normalizeUrl = (url) => url?.replace(/\/+$/, "");

const inferBrowserUrls = () => {
  if (typeof window === "undefined") return [];
  const origin = normalizeUrl(window.location.origin);
  const sameHostPort5000 = `${window.location.protocol}//${window.location.hostname}:5000`;
  return [origin, sameHostPort5000].filter(url => !url.includes(':3000')).filter(Boolean);
};

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
  const explicitAPI = process.env.REACT_APP_API_URL
    ? normalizeUrl(process.env.REACT_APP_API_URL)
    : null;
  const cached = getSavedAPI();
  const browserUrls = inferBrowserUrls();
  const origin = browserUrls[0] || null;
  const sameHostPort5000 = browserUrls[1] || null;

  // Reset cache if it points to frontend port
  if (cached && cached.includes(':3000')) {
    localStorage.removeItem(CACHE_KEY);
  }

  const urls = [explicitAPI, LOCAL_URL, sameHostPort5000, origin, cached, CLOUD_URL]
    .filter(Boolean)
    .reduce((acc, url) => {
      const normalized = normalizeUrl(url);
      return acc.includes(normalized) ? acc : [...acc, normalized];
    }, []);

  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(`${url}/api/ping`);
      if (res.ok) {
        API = url;
        setSavedAPI(url);
        return url;
      }
    } catch {
      // continue to next URL
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
let socketBaseURL = null;

export async function getSocket() {
  if (!socket) {
    socketBaseURL = await getAPI();

    const socketOptions = {
      transports: ["websocket", "polling"],
      withCredentials: true,
    };

    if (typeof window !== "undefined" && window.location.hostname.includes("app.github.dev")) {
      socketOptions.transports = ["polling"];
    }

    socket = io(socketBaseURL, socketOptions);

    socket.on("connect_error", async (err) => {
      console.warn("Socket connect error:", err);
      if (socketBaseURL !== LOCAL_URL) {
        console.warn("Falling back to local API socket at", LOCAL_URL);
        socket.disconnect();
        socketBaseURL = LOCAL_URL;
        socket = io(LOCAL_URL, socketOptions);
      }
    });
  }
  return socket;
}