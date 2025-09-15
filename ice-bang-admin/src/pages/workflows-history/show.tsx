// src/pages/workflows-history/show.tsx
import { Show, TextField } from "@refinedev/antd";
import { Typography, Tag, Descriptions, Card, Steps, Timeline, Alert, Space, Button } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

export const WorkflowsHistoryShow = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // 하드코딩된 데이터 (실제로는 API에서 가져올 데이터)
  const mockData: { [key: string]: any } = {
    "1": {
      id: 1,
      workflow_name: "네이버 블로그 포스팅#1",
      description: "네이버 트렌드 기반 자동 블로그 포스팅 워크플로",
      execution_date: "2024-09-01T09:00:00Z",
      completion_date: "2024-09-01T09:08:20Z",
      creator_id: "user123",
      total_duration: "8m 20s",
      total_steps: 6,
      current_step: 6,
      status: "completed",
      trigger_type: "scheduled",
      basic_settings: {
        task_id: 1,
        meta: {
          accounts: {
            naver: [
              {
                account_id: "naver-001",
                username: "marketing_01",
                password_enc: "base64_aes_...",
                labels: ["marketing", "teamA"]
              },
              {
                account_id: "naver-002",
                username: "event_02",
                password_enc: "base64_aes_..."
              }
            ],
            tistory: [
              {
                account_id: "tistory-003",
                username: "promo_03",
                password_enc: "base64_aes_..."
              }
            ]
          },
          posting_template: {
            default_category: "tech",
            image_watermark: true
          }
        }
      },
      steps: [
        { 
          step: 1, 
          task_name: "네이버 트렌드 크롤링",
          task_description: "실시간 네이버 트렌드 키워드를 수집하고 분석합니다",
          status: "success", 
          start_time: "2024-09-01T09:00:00Z",
          end_time: "2024-09-01T09:02:15Z",
          duration: "2m 15s",
          task_details: {
            task_name: "NaverTrendCrawler",
            task_type: "crawling",
            basic_parameters: {
              api_endpoint: "https://api.naver.com/trends",
              max_keywords: 25,
              category: "all",
              time_range: "1d"
            },
            logs: [
              { time: "09:00:00", message: "네이버 트렌드 API 연결 시작", level: "info" },
              { time: "09:00:15", message: "실시간 검색어 25개 추출 완료", level: "success" },
              { time: "09:02:15", message: "키워드 정제 및 분류 완료", level: "success" }
            ]
          }
        },
        { 
          step: 2, 
          task_name: "싸다구 몰 검색",
          task_description: "수집된 트렌드 키워드로 싸다구 몰에서 관련 상품을 검색합니다",
          status: "success", 
          start_time: "2024-09-01T09:02:15Z",
          end_time: "2024-09-01T09:03:45Z",
          duration: "1m 30s",
          task_details: {
            task_name: "SsadaguSearcher",
            task_type: "search",
            basic_parameters: {
              base_url: "https://ssadagu.co.kr",
              search_limit: 50,
              sort_by: "popularity",
              filter_options: ["instock", "rating_4plus"]
            },
            logs: [
              { time: "09:02:15", message: "싸다구 몰 검색 시작", level: "info" },
              { time: "09:02:30", message: "키워드 '스마트폰'으로 검색: 47개 상품 발견", level: "info" },
              { time: "09:03:45", message: "이 142개 상품 정보 수집 완료", level: "success" }
            ]
          }
        },
        { 
          step: 3, 
          task_name: "상품 정보 추출",
          task_description: "검색된 상품들의 상세 정보를 추출하고 검증합니다",
          status: "success", 
          start_time: "2024-09-01T09:03:45Z",
          end_time: "2024-09-01T09:04:30Z",
          duration: "45s",
          task_details: {
            task_name: "ProductExtractor",
            task_type: "extraction",
            basic_parameters: {
              extract_fields: ["name", "price", "rating", "reviews", "image_url"],
              validation_rules: {
                min_rating: 3.0,
                min_reviews: 5,
                price_range: [1000, 1000000]
              }
            },
            logs: [
              { time: "09:03:45", message: "상품 정보 추출 시작", level: "info" },
              { time: "09:04:00", message: "상품 데이터 검증 중...", level: "info" },
              { time: "09:04:30", message: "89개 유효 상품 정보 추출 완료", level: "success" }
            ]
          }
        },
        { 
          step: 4, 
          task_name: "A 단계 (보류)",
          task_description: "현재 개발 중인 단계로 스킵됩니다",
          status: "skipped", 
          start_time: null,
          end_time: null,
          duration: "-",
          task_details: {
            task_name: "ReservedTaskA",
            task_type: "reserved",
            basic_parameters: {},
            logs: [
              { time: "09:04:30", message: "A 단계는 현재 개발 중으로 스킵됨", level: "warning" }
            ]
          }
        },
        { 
          step: 5, 
          task_name: "콘텐츠 생성",
          task_description: "AI를 활용하여 상품 정보 기반의 블로그 콘텐츠를 생성합니다",
          status: "success", 
          start_time: "2024-09-01T09:04:30Z",
          end_time: "2024-09-01T09:07:50Z",
          duration: "3m 20s",
          task_details: {
            task_name: "ContentGenerator",
            task_type: "generation",
            basic_parameters: {
              ai_model: "GPT-4",
              template_type: "product_review",
              content_length: "medium",
              tone: "casual",
              include_images: true
            },
            logs: [
              { time: "09:04:30", message: "GPT-4 모델을 사용한 콘텐츠 생성 시작", level: "info" },
              { time: "09:05:45", message: "첫 번째 글 생성 완료 (567 단어)", level: "info" },
              { time: "09:07:50", message: "이 5개 글 생성 완료", level: "success" }
            ]
          }
        },
        { 
          step: 6, 
          task_name: "블로그 업로드",
          task_description: "생성된 콘텐츠를 지정된 블로그 플랫폼에 업로드합니다",
          status: "success", 
          start_time: "2024-09-01T09:07:50Z",
          end_time: "2024-09-01T09:08:20Z",
          duration: "1m 10s",
          task_details: {
            task_name: "BlogUploader",
            task_type: "upload",
            basic_parameters: {
              platform: "tistory",
              category: "product_review",
              publish_immediately: true,
              seo_optimization: true,
              tags: ["상품리뷰", "추천", "쇼핑"]
            },
            logs: [
              { time: "09:07:50", message: "티스토리 블로그 업로드 시작", level: "info" },
              { time: "09:08:10", message: "5개 포스트 업로드 완료", level: "success" },
              { time: "09:08:20", message: "모든 포스트 발행 완료", level: "success" }
            ]
          }
        }
      ]
    }
  };

  useEffect(() => {
    // 화면정의서용 - 하드코딩된 데이터 로드
    setTimeout(() => {
      const data = mockData[id || "1"];
      if (data) {
        setRecord(data);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "failed":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "running":
        return <SyncOutlined spin style={{ color: "#1890ff" }} />;
      case "skipped":
        return <ClockCircleOutlined style={{ color: "#d9d9d9" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#d9d9d9" }} />;
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: "success", text: "완료" },
      failed: { color: "error", text: "실패" },
      running: { color: "processing", text: "실행중" },
      pending: { color: "default", text: "대기중" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const renderTaskDetails = (taskDetails: any) => {
    if (!taskDetails) return null;

    return (
      <Card size="small" title="상세보기" style={{ marginTop: 16 }}>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="태스크 이름">
            <Text code>{taskDetails.task_name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="태스크 타입">
            <Tag>{taskDetails.task_type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="기본 파라미터">
            <pre style={{ background: "#f5f5f5", padding: "8px", borderRadius: "4px", fontSize: "12px" }}>
              {JSON.stringify(taskDetails.basic_parameters, null, 2)}
            </pre>
          </Descriptions.Item>
          <Descriptions.Item label="상태">
            {getStatusIcon(record?.steps?.find((s: any) => s.task_details === taskDetails)?.status)}
          </Descriptions.Item>
          <Descriptions.Item label="시작 시간">
            {formatDateTime(record?.steps?.find((s: any) => s.task_details === taskDetails)?.start_time)}
          </Descriptions.Item>
          <Descriptions.Item label="끝난 시간">
            {formatDateTime(record?.steps?.find((s: any) => s.task_details === taskDetails)?.end_time)}
          </Descriptions.Item>
          <Descriptions.Item label="실행 로그">
            <Timeline>
              {taskDetails.logs?.map((log: any, index: number) => (
                <Timeline.Item 
                  key={index}
                  color={log.level === 'success' ? 'green' : log.level === 'warning' ? 'orange' : 'blue'}
                >
                  <Text code>{log.time}</Text> {log.message}
                </Timeline.Item>
              ))}
            </Timeline>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  return (
    <Show isLoading={loading}>
      {/* 실행 정보 */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions
          title="실행 정보"
          bordered
          column={2}
          size="middle"
        >
          <Descriptions.Item label="워크플로명" span={2}>
            <TextField value={record?.workflow_name} />
          </Descriptions.Item>

          <Descriptions.Item label="설명" span={2}>
            <TextField value={record?.description} />
          </Descriptions.Item>

          <Descriptions.Item label="시작 시간">
            {formatDateTime(record?.execution_date)}
          </Descriptions.Item>

          <Descriptions.Item label="완료 시간">
            {formatDateTime(record?.completion_date)}
          </Descriptions.Item>

          <Descriptions.Item label="생성자 ID">
            <TextField value={record?.creator_id} />
          </Descriptions.Item>

          <Descriptions.Item label="상태">
            {getStatusTag(record?.status)}
          </Descriptions.Item>

          <Descriptions.Item label="기본 설정" span={2}>
            <pre style={{ background: "#f5f5f5", padding: "12px", borderRadius: "6px", fontSize: "12px" }}>
              {JSON.stringify(record?.basic_settings, null, 2)}
            </pre>
          </Descriptions.Item>

          <Descriptions.Item label="총 실행 시간" span={2}>
            <TextField value={record?.total_duration} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 단계별 실행 상황 */}
      <Card title="단계별 실행 상황" style={{ marginBottom: 16 }}>
        <Steps 
          direction="vertical" 
          current={record?.current_step - 1}
          style={{ marginBottom: 24 }}
        >
          {record?.steps?.map((step: any, index: number) => (
            <Step
              key={step.step}
              title={
                <Space>
                  <span>{step.task_name}</span>
                  {getStatusIcon(step.status)}
                </Space>
              }
              description={
                <div>
                  <Descriptions size="small" column={2} style={{ marginBottom: 8 }}>
                    <Descriptions.Item label="작업 설명" span={2}>
                      {step.task_description}
                    </Descriptions.Item>
                    <Descriptions.Item label="상태">
                      {getStatusTag(step.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label="시작 시간">
                      {formatDateTime(step.start_time)}
                    </Descriptions.Item>
                    <Descriptions.Item label="끝난 시간">
                      {formatDateTime(step.end_time)}
                    </Descriptions.Item>
                  </Descriptions>

                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => setSelectedStep(selectedStep === step.step ? null : step.step)}
                  >
                    {selectedStep === step.step ? "접기" : "상세보기"}
                  </Button>
                  
                  {selectedStep === step.step && (
                    <div>
                      {step.status === "skipped" && (
                        <Alert 
                          message="스킵됨" 
                          description="현재 개발 중인 단계로 스킵되었습니다" 
                          type="warning" 
                          showIcon 
                          style={{ marginBottom: 16 }}
                        />
                      )}
                      
                      {renderTaskDetails(step.task_details)}
                    </div>
                  )}
                </div>
              }
              status={
                step.status === "success" ? "finish" :
                step.status === "failed" ? "error" :
                step.status === "running" ? "process" : "wait"
              }
            />
          ))}
        </Steps>
      </Card>

      {/* 요약 정보 */}
      <Card title="실행 요약">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert
            message="실행 완료"
            description={`이 ${record?.steps?.length}개 단계 중 ${record?.steps?.filter((s: any) => s.status === 'success').length}개 단계가 성공적으로 완료되었습니다.`}
            type="success"
            showIcon
          />
          
          <Descriptions column={3} size="small">
            <Descriptions.Item label="성공한 단계">
              {record?.steps?.filter((s: any) => s.status === 'success').length}개
            </Descriptions.Item>
            <Descriptions.Item label="실패한 단계">
              {record?.steps?.filter((s: any) => s.status === 'failed').length}개
            </Descriptions.Item>
            <Descriptions.Item label="스킵된 단계">
              {record?.steps?.filter((s: any) => s.status === 'skipped').length}개
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
    </Show>
  );
};