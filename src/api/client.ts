import { ofetch } from "ofetch";

// SSG-safe base URL resolution:
// - Client bundle can only read NEXT_PUBLIC_*
// - Server prerender can read BACKEND_API as fallback
// - Hardcoded fallback keeps `next build` from crashing if env is missing

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_API ??
  process.env.BACKEND_API ??
  "https://life-share-backend-a6.vercel.app";

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
