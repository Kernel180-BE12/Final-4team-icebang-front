import { DataProvider, BaseRecord } from "@refinedev/core";
import { IWorkflow, IWorkflowBackendDto, IWorkflowListResponse, IWorkflowResponse } from "../types/workflow";

// 환경변수에서 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL;

console.log("🔧 workflowProvider 로드됨, API_URL:", API_URL);


// 백엔드 데이터를 프론트엔드 형식으로 변환하는 유틸리티 함수
const transformWorkflowData = (backendData: IWorkflowBackendDto): IWorkflow => {
    let parsedConfig;
    try {
        parsedConfig = JSON.parse(backendData.defaultConfig);
    } catch (error) {
        console.warn("defaultConfig 파싱 실패:", error);
        parsedConfig = {};
    }

    return {
        id: backendData.id,
        name: backendData.name,
        description: backendData.description,
        createdBy: backendData.createdBy,
        isEnabled: backendData.enabled, // enabled → isEnabled 변환
        createdAt: backendData.createdAt,
        updatedAt: backendData.updatedAt,
        updatedBy: backendData.updatedBy,
        schedules: backendData.schedules,
        jobs: backendData.jobs || [], // jobs 필드 추가
        defaultConfig: parsedConfig, // JSON 파싱된 설정
        config: { job: [] }, // 기본 config 구조
    };
};

// 공통 API 호출 함수
const fetchWorkflow = async (endpoint: string): Promise<IWorkflowListResponse | IWorkflowResponse> => {
    const fullUrl = `${API_URL}${endpoint}`;
    console.log("🌐 API 호출:", fullUrl);
    
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

// Workflows 전용 DataProvider (목데이터 사용)
export const workflowProvider: DataProvider = {
    // 목록 조회
    getList: async ({ resource, pagination }) => {
        console.log("📋 getList 호출됨 - resource:", resource, "pagination:", pagination);


        if (resource !== "workflows_list") {
            console.error("❌ 잘못된 리소스:", resource);
            throw new Error(`Resource ${resource} not found`);
        }

        const { current = 1, pageSize = 10 } = pagination || {};
        const params = new URLSearchParams({
            current: current.toString(),
            pageSize: pageSize.toString(),
        });

        try {
            const result = await fetchWorkflow(`/v0/workflows?${params.toString()}`) as IWorkflowListResponse;

            const transformedData = result.data.data.map(transformWorkflowData);
            console.log("✅ 변환된 데이터:", transformedData);

            return {
                data: transformedData as unknown as any,
                total: result.data.total,
            };
        } catch (error) {
            console.error("💥 getList 오류:", error);
            throw error;
        }
    },

    // 단일 항목 조회 (실제 API 호출)
    getOne: async ({ resource, id }) => {
        console.log("🔍 getOne 호출됨 - resource:", resource, "id:", id);

        if (resource !== "workflows_list" && resource !== "workflows") {
            throw new Error(`Resource ${resource} not found`);
        }

        try {
            const result = await fetchWorkflow(`/v0/workflows/${id}/detail`) as IWorkflowResponse;

            if (!result.data) {
                throw new Error(`Workflow ${id} not found`);
            }

            console.log("✅ API에서 받은 워크플로우 데이터:", result.data);

            return {
                data: transformWorkflowData(result.data) as unknown as any,
            };
        } catch (error) {
            console.error("💥 getOne 오류:", error);
            throw error;
        }
    },

    // 여러 항목 조회 (useMany용) - 원래 API 호출
    getMany: async ({ resource, ids }) => {
        console.log("📝 getMany 호출됨 - resource:", resource, "ids:", ids);

        if (resource !== "workflows_list") {
            throw new Error(`Resource ${resource} not found`);
        }

        try {
            const promises = ids.map(id => fetchWorkflow(`/v0/workflows/${id}`));
            const results = await Promise.all(promises) as IWorkflowResponse[];

            return {
                data: results
                    .filter(result => result.data) // null 데이터 필터링
                    .map(result => transformWorkflowData(result.data as IWorkflowBackendDto)) as unknown as any
            };
        } catch (error) {
            console.error("💥 getMany 오류:", error);
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