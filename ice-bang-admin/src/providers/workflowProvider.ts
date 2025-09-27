import { DataProvider, BaseRecord } from "@refinedev/core";
import { IWorkflow, IWorkflowBackendDto, IWorkflowListResponse, IWorkflowResponse } from "../types/workflow";

// 환경변수에서 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL;

console.log("🔧 workflowProvider 로드됨, API_URL:", API_URL);

// 목데이터 정의
const mockWorkflowData: IWorkflowBackendDto[] = [
    {
        id: 1,
        name: "블로그 자동 포스팅 워크플로우",
        description: "네이버 트렌드를 기반으로 자동으로 블로그 포스팅을 생성하는 워크플로우",
        createdBy: "admin",
        enabled: true,
        createdAt: "2024-09-18T10:00:00Z",
        updatedAt: "2024-09-18T15:30:00Z",
        updatedBy: "admin",
        defaultConfig: "{\"keyword_search\": {\"tag\": \"naver\"}, \"blog_publish\": {\"tag\": \"naver_blog\"}}",
        schedules: [
            {
                id: 1,
                cronExpression: "0 9 * * *",
                isActive: true,
                lastRunStatus: "success",
                lastRunAt: "2024-09-18T09:00:00Z",
                scheduleText: "매일 오전 9시 실행",
                createdAt: "2024-09-18T10:00:00Z"
            }
        ],
        jobs: [
            {
                workflow_id: 1,
                job_name: "블로그 포스팅",
                job_description: "네이버 트렌드 기반 블로그 포스팅 작업",
                job_enabled: true,
                job_id: 1,
                job_execution_order: 1,
                tasks: "[{\"task_id\": 1, \"task_name\": \"트렌드 수집 태스크\", \"task_type\": \"API\", \"task_parameters\": {\"endpoint\": \"/trends\", \"method\": \"GET\"}, \"execution_order\": 1}]"
            }
        ],
        config: {
            job: [
                {
                    id: "job1",
                    type: "typeA",
                    task: [
                        {
                            id: "2",
                            parameters: {
                                tag: "naver"
                            }
                        }
                    ]
                },
                {
                    id: "job2",
                    type: "typeB",
                    task: [
                        {
                            id: "10",
                            parameters: {
                                tag: "Tistory",
                                blog_id: "value2",
                                blog_pass: "value2"
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        id: 2,
        name: "상품 정보 수집 워크플로우",
        description: "다양한 쇼핑몰에서 상품 정보를 수집하고 분석하는 워크플로우",
        createdBy: "user1",
        enabled: false,
        createdAt: "2024-09-17T14:30:00Z",
        updatedAt: "2024-09-17T16:45:00Z",
        updatedBy: "user1",
        schedules: [
            {
                type: "auto",
                cronExpression: "0 0 * * *",
                description: "매일 자정 실행",
                enabled: false,
                lastExecutionStatus: "failed",
                lastExecutionDate: "2024-09-17T00:00:00Z",
                createdAt: "2024-09-17T14:30:00Z"
            }
        ],
        config: {
            job: [
                {
                    id: "product_crawl",
                    type: "crawler",
                    task: [
                        {
                            id: "11",
                            parameters: {
                                site: "gmarket",
                                category: "electronics",
                                max_items: 100
                            }
                        },
                        {
                            id: "12",
                            parameters: {
                                site: "11st",
                                category: "electronics",
                                max_items: 100
                            }
                        }
                    ]
                },
                {
                    id: "data_process",
                    type: "processor",
                    task: [
                        {
                            id: "20",
                            parameters: {
                                action: "clean_data",
                                remove_duplicates: true,
                                validate_prices: true
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        id: 3,
        name: "소셜미디어 자동 포스팅",
        description: "인스타그램, 페이스북에 자동으로 콘텐츠를 포스팅하는 워크플로우",
        createdBy: "marketing_team",
        enabled: true,
        createdAt: "2024-09-16T09:15:00Z",
        updatedAt: "2024-09-18T11:20:00Z",
        updatedBy: "marketing_team",
        schedules: [
            {
                type: "auto",
                cronExpression: "0 0 * * 1",
                description: "매주 월요일 자정 실행",
                enabled: true,
                lastExecutionStatus: "success",
                lastExecutionDate: "2024-09-16T00:00:00Z",
                createdAt: "2024-09-16T09:15:00Z"
            },
            {
                type: "auto",
                cronExpression: "0 0 * * 5",
                description: "매주 금요일 자정 실행",
                enabled: false,
                lastExecutionStatus: "pending",
                lastExecutionDate: "2024-09-13T00:00:00Z",
                createdAt: "2024-09-16T09:15:00Z"
            }
        ],
        config: {
            job: [
                {
                    id: "content_generate",
                    type: "ai_generator",
                    task: [
                        {
                            id: "30",
                            parameters: {
                                model: "gpt-4",
                                template: "social_media",
                                tone: "friendly"
                            }
                        }
                    ]
                },
                {
                    id: "social_post",
                    type: "social_publisher",
                    task: [
                        {
                            id: "31",
                            parameters: {
                                platform: "instagram",
                                account: "@company_official",
                                hashtags: ["#company", "#news", "#update"]
                            }
                        },
                        {
                            id: "32",
                            parameters: {
                                platform: "facebook",
                                page_id: "company_page",
                                post_time: "optimal"
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        id: 4,
        name: "데이터 백업 워크플로우",
        description: "중요한 데이터베이스와 파일들을 정기적으로 백업하는 워크플로우",
        createdBy: "dev_ops",
        enabled: true,
        createdAt: "2024-09-15T08:00:00Z",
        updatedAt: "2024-09-15T08:00:00Z",
        updatedBy: "dev_ops",
        schedules: [
            {
                type: "auto",
                cronExpression: "0 0 1 * *",
                description: "매월 1일 자정 실행 (전체 백업)",
                enabled: true,
                lastExecutionStatus: "success",
                lastExecutionDate: "2024-09-01T00:00:00Z",
                createdAt: "2024-09-15T08:00:00Z"
            },
            {
                type: "auto",
                cronExpression: "0 2 * * 0",
                description: "매주 일요일 새벽 2시 실행 (증분 백업)",
                enabled: true,
                lastExecutionStatus: "success",
                lastExecutionDate: "2024-09-15T02:00:00Z",
                createdAt: "2024-09-15T08:00:00Z"
            }
        ],
        config: {
            job: [
                {
                    id: "db_backup",
                    type: "backup",
                    task: [
                        {
                            id: "40",
                            parameters: {
                                database: "production_db",
                                backup_type: "full",
                                compression: true,
                                encryption: true
                            }
                        }
                    ]
                },
                {
                    id: "file_backup",
                    type: "backup",
                    task: [
                        {
                            id: "41",
                            parameters: {
                                source_path: "/var/www/uploads",
                                destination: "s3://backup-bucket/files",
                                incremental: true
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        id: 5,
        name: "이메일 마케팅 자동화",
        description: "고객 세그먼트에 따라 개인화된 이메일을 자동으로 발송하는 워크플로우",
        createdBy: "marketing_team",
        enabled: false,
        createdAt: "2024-09-14T13:45:00Z",
        updatedAt: "2024-09-16T10:30:00Z",
        updatedBy: "marketing_team",
        schedules: [
            {
                type: "auto",
                cronExpression: "0 10 1 * *",
                description: "매월 1일 오전 10시 (월간 뉴스레터)",
                enabled: false,
                lastExecutionStatus: "pending",
                lastExecutionDate: "2024-08-01T10:00:00Z",
                createdAt: "2024-09-14T13:45:00Z"
            }
        ],
        config: {
            job: [
                {
                    id: "customer_segmentation",
                    type: "analytics",
                    task: [
                        {
                            id: "50",
                            parameters: {
                                criteria: "purchase_history",
                                time_range: "last_30_days",
                                min_purchase_amount: 50000
                            }
                        }
                    ]
                },
                {
                    id: "email_campaign",
                    type: "email_sender",
                    task: [
                        {
                            id: "51",
                            parameters: {
                                template: "promotion_template",
                                subject: "특별 할인 혜택을 놓치지 마세요!",
                                personalization: true,
                                send_time: "morning"
                            }
                        }
                    ]
                }
            ]
        }
    }
];

// 백엔드 데이터를 프론트엔드 형식으로 변환하는 유틸리티 함수
const transformWorkflowData = (backendData: IWorkflowBackendDto): IWorkflow => {
    let parsedConfig;
    try {
        parsedConfig = JSON.parse(backendData.defaultConfig);
    } catch (error) {
        console.warn("defaultConfig 파싱 실패:", error);
        parsedConfig = {};
    }

    // 목데이터에서 해당 워크플로우의 config 찾기
    const mockData = mockWorkflowData.find(mock => mock.id === backendData.id);
    const mockConfig = mockData?.config || { job: [] };

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
        config: mockConfig, // 목데이터용 Job 설정
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