export function makeWSURL(apiUrl) {
  return apiUrl
    .replace("https://", "wss://")
    .replace("http://", "ws://");
}
