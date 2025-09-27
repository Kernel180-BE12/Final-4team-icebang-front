import { DataProvider } from "@refinedev/core";
import { request } from "./request";

const API_URL = import.meta.env.VITE_API_URL;

export const workflowHistoryProvider: DataProvider = {
    getApiUrl: () => API_URL,
    getOne: async ({ id }) => {
    const response = await request<any>(
    //   `${API_URL}/v0/workflow-runs/${id}`
        `${API_URL}/v0/workflow-runs/${id}`,
        {
        credentials: 'include'
      }
    );

    return {
      data: response,
    };
  },
   create: async () => { throw new Error("Create operation not supported"); },
    update: async () => { throw new Error("Update operation not supported"); },
    deleteOne: async () => { throw new Error("Delete operation not supported"); },
    deleteMany: async () => { throw new Error("DeleteMany operation not supported"); },
    updateMany: async () => { throw new Error("UpdateMany operation not supported"); },
    createMany: async () => { throw new Error("CreateMany operation not supported"); },
    custom: async ({ url, method, query, payload }) => {
        let fullUrl = `${API_URL}${url}`;

        // query 파라미터가 있으면 URL에 추가
        if (query) {
            const params = new URLSearchParams();
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
            if (params.toString()) {
                fullUrl += `?${params.toString()}`;
            }
        }

        const options: RequestInit = {
            method: method?.toUpperCase() || 'GET',
            credentials: 'include',
        };

        // payload가 있으면 헤더와 body에 추가
        if (payload && (method?.toUpperCase() === 'POST' || method?.toUpperCase() === 'PUT')) {
            options.headers = {
                'Content-Type': 'application/json',
            };
            options.body = JSON.stringify(payload);
        }

        const response = await request<any>(fullUrl, options);

        return {
            data: response,
        };
    },
   getList: async ({ pagination, filters, sorters }) => {
      const { current = 1, pageSize = 10 } = pagination || {};
        const params = new URLSearchParams({
            current: current.toString(),
            pageSize: pageSize.toString(),
        });
      // 페이징 파라미터 구성 로직
      const response = await request<any>(`${API_URL}/v0/workflow-runs?${params.toString()}`, { 
        credentials: 'include' 
      });
      
      return {
        data: response.data, // API의 data 배열
        total: response.total, // 전체 개수
      };
},
}