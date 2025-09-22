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
    custom: async () => { throw new Error("Custom method not implemented"); },
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