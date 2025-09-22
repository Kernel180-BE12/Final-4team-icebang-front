import { DataProvider } from "@refinedev/core";
import { request } from "./request";

const API_URL = import.meta.env.VITE_API_URL;

export const workflowHistoryProvider: DataProvider = {
    getApiUrl: () => API_URL,
    getOne: async ({ id }) => {
    const response = await request<any>(
    //   `${API_URL}/v0/workflow-runs/${id}`
        `${API_URL}/v0/workflow-runs/1`,
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
    getList: async () => { throw new Error("Custom method not implemented"); },
}