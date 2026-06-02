import { io } from "socket.io-client";
import axios from "axios";
import { makeWSURL } from "./socket";

export const LOCAL_URL = "http://localhost:5000";
export const CLOUD_URL =
  "https://fishing-recipient-outstanding-oak.trycloudflare.com";

const ENV_API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/+$/, "")
  : null;

const CACHE_KEY = "last_good_api";

/* ================= CACHE HELPERS ================= */

/**
 * @returns {string | null}
 */
function getSavedAPI() {
  return localStorage.getItem(CACHE_KEY);
}

/**
 * @param {string} url
 */
function setSavedAPI(url) {
  localStorage.setItem(CACHE_KEY, url);
}

export { setSavedAPI };

export function resetAPI() {
  localStorage.removeItem(CACHE_KEY);
  apiInstance = null;
}

/* ================= API RESOLUTION ================= */

let API = LOCAL_URL;

/**
 * @param {string} url
 * @returns {Promise<boolean>}
 */
async function isReachable(url) {
  try {
    const res = await fetch(`${url}/health`, {
      method: "GET",
      mode: "cors",
    });

    return res.ok;
  } catch {
    return false;
  }
}

/**
 * @returns {Promise<string>}
 */
export async function getAPIBase() {
  const saved = getSavedAPI();

  const runtimeOrigin =
    typeof window !== "undefined"
      ? window.location.origin.replace(/\/+$/, "")
      : null;

  // 1. ENV URL
  if (ENV_API_URL && (await isReachable(ENV_API_URL))) {
    setSavedAPI(ENV_API_URL);
    API = ENV_API_URL;
    return ENV_API_URL;
  }

  // 2. Cached URL
  if (saved && (await isReachable(saved))) {
    API = saved;
    return saved;
  }

  // 3. Runtime URL
  if (
    runtimeOrigin &&
    runtimeOrigin !== LOCAL_URL &&
    runtimeOrigin !== ENV_API_URL &&
    (await isReachable(runtimeOrigin))
  ) {
    setSavedAPI(runtimeOrigin);
    API = runtimeOrigin;
    return runtimeOrigin;
  }

  // 4. Local fallback
  if (await isReachable(LOCAL_URL)) {
    setSavedAPI(LOCAL_URL);
    API = LOCAL_URL;
    return LOCAL_URL;
  }

  API = LOCAL_URL;
  return LOCAL_URL;
}

/**
 * @returns {Promise<string>}
 */
export async function getAPI() {
  return getAPIBase();
}

/**
 * @param {string} url
 */
export function saveCloudflareURL(url) {
  if (!url.includes("trycloudflare.com")) return;
  setSavedAPI(url);
}

/* ================= AXIOS ================= */

/** @type {any} */
let apiInstance = null;

/**
 * @returns {Promise<any>}
 */
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

/** @type {any} */
let socket = null;
/** @type {string | null} */
let socketBaseURL = null;
/** @type {string | null} */
let socketAuthToken = null;

/**
 * @returns {Promise<any>}
 */
export async function getSocket() {

  const apiUrl = await getAPIBase();
  const targetSocketBaseURL = makeWSURL(apiUrl);
  const currentToken = localStorage.getItem("token") || localStorage.getItem("adminToken");

  if (socket && socketBaseURL === targetSocketBaseURL && socketAuthToken === currentToken) {
    return socket;
  }

  if (socket) {
    try {
      socket.disconnect();
    } catch (err) {
      console.warn("Failed to disconnect stale socket before reinitializing:", err);
    }
    socket = null;
  }

  socketBaseURL = targetSocketBaseURL;
  socketAuthToken = currentToken;

  /** @type {any} */
  const socketOptions = {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    path: "/socket.io",
  };

  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes("app.github.dev")
  ) {
    socketOptions.transports = ["polling"];
  }
  if (currentToken) {
    socketOptions.auth = { token: currentToken };
  }
  socket = io(socketBaseURL, socketOptions);

  /* ✅ IMPORTANT FIX: expose socket globally */
  window.socket = socket;

  socket.on("connect", () => {
    console.log("Socket connected successfully to", socketBaseURL);
  });

  socket.on("reconnect", (attempt) => {
    console.log("Socket reconnected after", attempt, "attempt(s) to", socketBaseURL);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("Socket reconnect attempt", attempt, "to", socketBaseURL);
  });

  socket.on("reconnect_failed", () => {
    console.warn("Socket reconnection failed to", socketBaseURL);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected from", socketBaseURL, "reason:", reason);
  });

  socket.on("connect_error", async (err) => {
    console.warn("Socket connect error:", err.message);

    const localWsUrl = makeWSURL(LOCAL_URL);

    if (socketBaseURL !== localWsUrl) {
      console.warn("Falling back to local socket:", localWsUrl);

      try {
        socket.disconnect();
        socketBaseURL = localWsUrl;

        socket = io(socketBaseURL, socketOptions);

        /* re-expose */
        window.socket = socket;
      } catch (e) {
        console.error("Fallback socket failed:", e);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected from", socketBaseURL);
  });

  return socket;
}