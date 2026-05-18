export const LOCAL_URL: string;
export const CLOUD_URL: string;
export function getAPIBase(): Promise<string>;
export function getAPI(): Promise<string>;
export function getAxios(): Promise<any>;
export function getSocket(): Promise<any>;
export function saveCloudflareURL(url: string): void;
export function resetAPI(): void;
