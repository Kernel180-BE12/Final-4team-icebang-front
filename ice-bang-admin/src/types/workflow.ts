import { BaseRecord } from "@refinedev/core";

// 백엔드 공통 API 응답 구조
export interface IApiResponse<T = any> {
    success: boolean;
    data: T | null;
    message: string;
    status: string;
}

// Task 인터페이스 (백엔드 응답용)
export interface IBackendTask {
    task_id: number;
    task_name: string;
    task_type: string;
    task_parameters: {
        endpoint: string;
        method: string;
        body?: Record<string, any>;
    };
    execution_order: number;
}

// Job 인터페이스 (백엔드 응답용)
export interface IBackendJob {
    workflow_id: number;
    job_name: string;
    job_description: string;
    job_enabled: boolean;
    job_id: number;
    job_execution_order: number;
    tasks: string; // JSON 문자열로 전달됨
}

// Task 인터페이스 (프론트엔드용)
export interface ITask {
    id: string;
    parameters: Record<string, any>;
}

// Job 인터페이스 (프론트엔드용)
export interface IJob {
    id: string;
    type: string;
    task: ITask[];
}

// Config 인터페이스
export interface IWorkflowConfig {
    job: IJob[];
}

// 스케줄러 타입
export type ScheduleType = 'auto' | 'manual';

// 스케줄 정보 인터페이스 (백엔드 API 응답 기준)
export interface ISchedule {
    id: number;
    cronExpression: string;
    isActive: boolean;
    lastRunStatus: 'success' | 'failed' | 'running' | null;
    lastRunAt: string | null;
    scheduleText: string;
    createdAt: string;
}

// 백엔드 API 응답 기반 Interface
export interface IWorkflowBackendDto {
    id: number;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string; // ISO 8601 형식
    defaultConfig: string; // JSON 문자열
    updatedAt: string; // 수정일시
    updatedBy: string | null; // 수정자
    schedules: ISchedule[]; // 복수 스케줄
    jobs: IBackendJob[]; // Job 배열 추가
    enabled: boolean; // 백엔드에서는 enabled
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
    updatedAt: string; // 수정일시
    updatedBy: string | null; // 수정자
    schedules: ISchedule[]; // 복수 스케줄
    jobs: IBackendJob[]; // Job 배열 추가
    defaultConfig: any; // 파싱된 설정 객체
    config: IWorkflowConfig; // 목데이터용 워크플로우 설정
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

// 스케줄 타입 텍스트 매핑
export const getScheduleTypeText = (scheduleType: ScheduleType): string => {
    return scheduleType === 'auto' ? '자동' : '수동';
};

// 스케줄 타입 색상 매핑
export const getScheduleTypeColor = (scheduleType: ScheduleType): string => {
    return scheduleType === 'auto' ? 'processing' : 'default';
};

// 크론 표현식을 한국어로 변환하는 유틸리티
export const cronToKorean = (cronExpression?: string): string => {
    if (!cronExpression) return '-';

    // 간단한 크론 표현식 매핑 (실제로는 더 복잡한 로직 필요)
    const cronMap: Record<string, string> = {
        '0 0 * * *': '매일 자정',
        '0 9 * * *': '매일 오전 9시',
        '0 0 * * 1': '매주 월요일 자정',
        '0 0 1 * *': '매월 1일 자정',
    };

    return cronMap[cronExpression] || cronExpression;
};