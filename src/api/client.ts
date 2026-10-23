import { ofetch } from "ofetch";

const isServer = typeof window === "undefined";

const baseURL = isServer
  ? process.env.BACKEND_API ?? "https://life-share-backend-a6.vercel.app"
  : "";

export const apiClient = ofetch.create({
  baseURL,
  timeout: 15_000,
  retry: 1,
  credentials: "include",
});

export type ApiError = {
  status?: number;
  message: string;
  data?: any;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PageMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};