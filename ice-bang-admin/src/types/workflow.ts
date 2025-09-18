import { BaseRecord } from "@refinedev/core";

// 백엔드 공통 API 응답 구조
export interface IApiResponse<T = any> {
    success: boolean;
    data: T | null;
    message: string;
    status: string;
}

// 백엔드 WorkflowCardDto 기반 Interface
export interface IWorkflowBackendDto {
    id: number;
    name: string;
    description: string;
    createdBy: string;
    enabled: boolean; // 백엔드에서는 enabled
    createdAt: string; // ISO 8601 형식
}

// 프론트엔드에서 사용할 Interface (enabled → isEnabled 변환)
// BaseRecord를 확장하여 Refine과 호환성 확보
export interface IWorkflow extends BaseRecord {
    id: number;
    name: string;
    description: string;
    createdBy: string;
    isEnabled: boolean; // 프론트엔드에서는 isEnabled
    createdAt: string; // ISO 8601 형식
}

// 백엔드 워크플로우 목록 응답 구조
export interface IWorkflowListResponse {
    success: boolean;
    data: {
        data: IWorkflowBackendDto[]; // 실제 워크플로우 데이터 배열
        total: number; // 전체 개수
        current: number; // 현재 페이지
        pageSize: number; // 페이지 크기
        totalPages: number; // 전체 페이지 수
        hasNext: boolean; // 다음 페이지 존재 여부
        hasPrevious: boolean; // 이전 페이지 존재 여부
        lastPage: boolean; // 마지막 페이지 여부
        firstPage: boolean; // 첫 번째 페이지 여부
    };
    message: string;
    status: string;
}

// 단일 워크플로우 응답
export interface IWorkflowResponse extends IApiResponse<IWorkflowBackendDto> {}

// 워크플로우 필터링용 타입 (프론트엔드에서 사용)
export interface IWorkflowFilters {
    name?: string;
    description?: string;
    createdBy?: string;
    isEnabled?: boolean;
}

// 워크플로우 정렬용 타입
export interface IWorkflowSorter {
    field: keyof IWorkflow;
    order: 'asc' | 'desc';
}

// 워크플로우 상태 관련 상수
export const WORKFLOW_STATUS = {
    ENABLED: true,
    DISABLED: false,
} as const;

export type WorkflowStatus = typeof WORKFLOW_STATUS[keyof typeof WORKFLOW_STATUS];

// 워크플로우 상태 체크 유틸리티
export const isWorkflowEnabled = (workflow: IWorkflow): boolean => {
    return workflow.isEnabled === true;
};

export const isWorkflowDisabled = (workflow: IWorkflow): boolean => {
    return workflow.isEnabled === false;
};

// 날짜 포맷 유틸리티
export const formatWorkflowDate = (dateString: string): string => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
};

// 워크플로우 상태 텍스트 매핑
export const getWorkflowStatusText = (isEnabled: boolean): string => {
    return isEnabled ? "활성" : "비활성";
};

// 워크플로우 상태 색상 매핑 (Ant Design Tag용)
export const getWorkflowStatusColor = (isEnabled: boolean): string => {
    return isEnabled ? "success" : "default";
};