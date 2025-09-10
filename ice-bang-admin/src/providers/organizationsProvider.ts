// src/providers/organizationsProvider.ts
import { DataProvider, BaseRecord, GetListResponse } from "@refinedev/core";
import { request } from "./request";

const API_URL = import.meta.env.VITE_API_URL;

export const organizationsProvider: Partial<DataProvider> = {
  getList: async <TData extends BaseRecord = BaseRecord>(): Promise<GetListResponse<TData>> => {
    const data = await request<TData[]>(`${API_URL}/v0/organizations`);
    return { data, total: data.length };
  },

  custom: async <TData = any>({ url, method = "GET", headers, payload, query }: any) => {
    const qs = query
      ? "?" +
        Object.entries(query)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
          .join("&")
      : "";

    const data = await request<TData>(`${API_URL}/v0${url}${qs}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    return { data };
  },

  getApiUrl: () => API_URL,
};
