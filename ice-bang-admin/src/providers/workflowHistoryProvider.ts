import { DataProvider } from "@refinedev/core";

// 환경변수에서 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL;

console.log("🔧 workflowHistoryProvider 로드됨, API_URL:", API_URL);

// 워크플로우 히스토리 타입 정의
export interface IWorkflowHistory {
  id: string;
  workflowId: string;
  traceId: string;
  startedAt: string;
  finishedAt: string | null;
  createdBy: string | null;
  triggerType: string | null;
  runNumber: string | null;
  status: "completed" | "failed" | "running" | "pending";
}

// 백엔드 응답 타입 정의
export interface IWorkflowHistoryResponse {
  success: boolean;
  message: string;
  data: {
    data: IWorkflowHistory[];
    total: number;
    current: number;
    pageSize: number;
  };
}

export interface IWorkflowHistoryDetailResponse {
  success: boolean;
  message: string;
  data: IWorkflowHistory;
}

// 공통 API 호출 함수
const fetchWorkflowHistory = async (endpoint: string): Promise<IWorkflowHistoryResponse | IWorkflowHistoryDetailResponse> => {
  const fullUrl = `${API_URL}${endpoint}`;
  console.log("🌐 워크플로우 히스토리 API 호출:", fullUrl);
  
  const response = await fetch(fullUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("📡 응답 상태:", response.status, response.statusText);

  const result = await response.json();
  console.log("📦 응답 데이터:", result);

  if (!result.success) {
    console.error("❌ API 오류:", result.message);
    throw new Error(result.message || "API 요청 실패");
  }

  return result;
};

// 워크플로우 히스토리 전용 DataProvider
export const workflowHistoryProvider: DataProvider = {
  // 목록 조회
  getList: async ({ resource, pagination, sorters, filters }) => {
    console.log("📋 workflowHistory getList 호출됨 - resource:", resource, "pagination:", pagination);

    if (resource !== "workflows_history") {
      console.error("❌ 잘못된 리소스:", resource);
      throw new Error(`Resource ${resource} not found`);
    }

    const { current = 1, pageSize = 10 } = pagination || {};
    const params = new URLSearchParams({
      current: current.toString(),
      pageSize: pageSize.toString(),
    });

    // 정렬 파라미터 추가
    if (sorters && sorters.length > 0) {
      sorters.forEach(sorter => {
        params.append('sorter', `${sorter.field}:${sorter.order}`);
      });
    }

    // 필터 파라미터 추가
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        if (filter.operator === 'eq') {
          params.append(filter.field, filter.value);
        } else if (filter.operator === 'contains') {
          params.append(`${filter.field}_like`, filter.value);
        }
      });
    }

    try {
      const result = await fetchWorkflowHistory(`/v0/workflow-runs?${params.toString()}`) as IWorkflowHistoryResponse;
      
      console.log("✅ 워크플로우 히스토리 데이터:", result.data.data);

      return {
        data: result.data.data as unknown as any,
        total: result.data.total,
      };
    } catch (error) {
      console.error("💥 워크플로우 히스토리 getList 오류:", error);
      throw error;
    }
  },

  // 단일 항목 조회
  getOne: async ({ resource, id }) => {
    console.log("🔍 workflowHistory getOne 호출됨 - resource:", resource, "id:", id);

    if (resource !== "workflows_history") {
      throw new Error(`Resource ${resource} not found`);
    }

    try {
      const result = await fetchWorkflowHistory(`/v0/workflow-runs/${id}`) as IWorkflowHistoryDetailResponse;

      console.log("✅ 워크플로우 히스토리 상세 데이터:", result.data);

      return {
        data: result.data as unknown as any,
      };
    } catch (error) {
      console.error("💥 워크플로우 히스토리 getOne 오류:", error);
      throw error;
    }
  },

  // 여러 항목 조회 (useMany용)
  getMany: async ({ resource, ids }) => {
    console.log("📝 workflowHistory getMany 호출됨 - resource:", resource, "ids:", ids);

    if (resource !== "workflows_history") {
      throw new Error(`Resource ${resource} not found`);
    }

    try {
      const promises = ids.map(id => fetchWorkflowHistory(`/v0/workflow-runs/${id}`));
      const results = await Promise.all(promises) as IWorkflowHistoryDetailResponse[];

      return {
        data: results
          .filter(result => result.data)
          .map(result => result.data) as unknown as any
      };
    } catch (error) {
      console.error("💥 workflowHistory getMany 오류:", error);
      throw error;
    }
  },

  // API URL 반환
  getApiUrl: () => API_URL,

  // 지원하지 않는 작업들 (조회 전용 Provider)
  create: async () => { throw new Error("Create operation not supported"); },
  update: async () => { throw new Error("Update operation not supported"); },
  deleteOne: async () => { throw new Error("Delete operation not supported"); },
  deleteMany: async () => { throw new Error("DeleteMany operation not supported"); },
  updateMany: async () => { throw new Error("UpdateMany operation not supported"); },
  createMany: async () => { throw new Error("CreateMany operation not supported"); },
  custom: async () => { throw new Error("Custom method not implemented"); },
};