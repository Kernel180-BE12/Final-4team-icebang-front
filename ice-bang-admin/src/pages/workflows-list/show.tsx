// src/pages/scheduler-history/show.tsx
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

export const WorkflowShow = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // 하드코딩된 데이터 (실제로는 API에서 가져올 데이터)
  const mockData: { [key: string]: any } = {
    "1": {
      id: 1,
      scheduler_name: "블로그 A 자동 포스팅",
      execution_date: "2024-09-01T09:00:00Z",
      completion_date: "2024-09-01T09:08:20Z",
      total_duration: "8m 20s",
      total_steps: 6,
      current_step: 6,
      status: "completed",
      trigger_type: "scheduled",
      steps: [
        { 
          step: 1, 
          name: "네이버 트렌드 크롤링", 
          status: "success", 
          start_time: "2024-09-01T09:00:00Z",
          end_time: "2024-09-01T09:02:15Z",
          duration: "2m 15s",
          details: {
            keywords_found: 25,
            trending_topics: ["스마트폰", "무선이어폰", "노트북"],
            data_source: "naver_trends_api"
          },
          logs: [
            { time: "09:00:00", message: "네이버 트렌드 API 연결 시작", level: "info" },
            { time: "09:00:15", message: "실시간 검색어 25개 추출 완료", level: "success" },
            { time: "09:02:15", message: "키워드 정제 및 분류 완료", level: "success" }
          ]
        },
        { 
          step: 2, 
          name: "싸다구 몰 검색", 
          status: "success", 
          start_time: "2024-09-01T09:02:15Z",
          end_time: "2024-09-01T09:03:45Z",
          duration: "1m 30s",
          details: {
            search_queries: 25,
            products_found: 142,
            successful_searches: 23
          },
          logs: [
            { time: "09:02:15", message: "싸다구 몰 검색 시작", level: "info" },
            { time: "09:02:30", message: "키워드 '스마트폰'으로 검색: 47개 상품 발견", level: "info" },
            { time: "09:03:45", message: "총 142개 상품 정보 수집 완료", level: "success" }
          ]
        },
        { 
          step: 3, 
          name: "상품 정보 추출", 
          status: "success", 
          start_time: "2024-09-01T09:03:45Z",
          end_time: "2024-09-01T09:04:30Z",
          duration: "45s",
          details: {
            products_processed: 142,
            valid_products: 89,
            extracted_fields: ["name", "price", "rating", "reviews"]
          },
          logs: [
            { time: "09:03:45", message: "상품 정보 추출 시작", level: "info" },
            { time: "09:04:00", message: "상품 데이터 검증 중...", level: "info" },
            { time: "09:04:30", message: "89개 유효 상품 정보 추출 완료", level: "success" }
          ]
        },
        { 
          step: 4, 
          name: "A 단계 (보류)", 
          status: "skipped", 
          start_time: null,
          end_time: null,
          duration: "-",
          details: {
            reason: "기능 개발 중으로 인한 스킵"
          },
          logs: [
            { time: "09:04:30", message: "A 단계는 현재 개발 중으로 스킵됨", level: "warning" }
          ]
        },
        { 
          step: 5, 
          name: "콘텐츠 생성", 
          status: "success", 
          start_time: "2024-09-01T09:04:30Z",
          end_time: "2024-09-01T09:07:50Z",
          duration: "3m 20s",
          details: {
            generated_articles: 5,
            ai_model: "GPT-4",
            total_words: 2847
          },
          logs: [
            { time: "09:04:30", message: "GPT-4 모델을 사용한 콘텐츠 생성 시작", level: "info" },
            { time: "09:05:45", message: "첫 번째 글 생성 완료 (567 단어)", level: "info" },
            { time: "09:07:50", message: "총 5개 글 생성 완료", level: "success" }
          ]
        },
        { 
          step: 6, 
          name: "블로그 업로드", 
          status: "success", 
          start_time: "2024-09-01T09:07:50Z",
          end_time: "2024-09-01T09:08:20Z",
          duration: "1m 10s",
          details: {
            uploaded_posts: 5,
            blog_platform: "티스토리",
            published_status: "published"
          },
          logs: [
            { time: "09:07:50", message: "티스토리 블로그 업로드 시작", level: "info" },
            { time: "09:08:10", message: "5개 포스트 업로드 완료", level: "success" },
            { time: "09:08:20", message: "모든 포스트 발행 완료", level: "success" }
          ]
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

  const renderStepDetails = (step: any) => {
    if (!step.details) return null;

    return (
      <Card size="small" style={{ marginTop: 8 }}>
        <Descriptions size="small" column={2}>
          {Object.entries(step.details).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    );
  };

  const renderStepLogs = (logs: any[]) => {
    return (
      <Card size="small" title="실행 로그" style={{ marginTop: 8 }}>
        <Timeline>
          {logs.map((log, index) => (
            <Timeline.Item 
              key={index}
              color={log.level === 'success' ? 'green' : log.level === 'warning' ? 'orange' : 'blue'}
            >
              <Text code>{log.time}</Text> {log.message}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    );
  };

  return (
    <Show isLoading={loading}>
      {/* 기본 정보 */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions
          title="실행 정보"
          bordered
          column={2}
          size="middle"
        >
          <Descriptions.Item label="스케줄러명" span={2}>
            <TextField value={record?.scheduler_name} />
          </Descriptions.Item>

          <Descriptions.Item label="실행 상태">
            {getStatusTag(record?.status)}
          </Descriptions.Item>

          <Descriptions.Item label="총 소요시간">
            <TextField value={record?.total_duration} />
          </Descriptions.Item>

          <Descriptions.Item label="실행 시작">
            {formatDateTime(record?.execution_date)}
          </Descriptions.Item>

          <Descriptions.Item label="실행 완료">
            {formatDateTime(record?.completion_date)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 단계별 진행 상황 */}
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
                  <span>{step.name}</span>
                  {getStatusIcon(step.status)}
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => setSelectedStep(selectedStep === step.step ? null : step.step)}
                  >
                    {selectedStep === step.step ? "접기" : "상세보기"}
                  </Button>
                </Space>
              }
              description={
                <div>
                  <Space>
                    <Text type="secondary">소요시간: {step.duration}</Text>
                    <Text type="secondary">
                      {step.start_time && `시작: ${formatDateTime(step.start_time)}`}
                    </Text>
                  </Space>
                  
                  {selectedStep === step.step && (
                    <div style={{ marginTop: 16 }}>
                      {step.status === "skipped" && (
                        <Alert 
                          message="스킵됨" 
                          description={step.details?.reason} 
                          type="warning" 
                          showIcon 
                          style={{ marginBottom: 16 }}
                        />
                      )}
                      
                      {renderStepDetails(step)}
                      {renderStepLogs(step.logs)}
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
            description={`총 ${record?.steps?.length}개 단계 중 ${record?.steps?.filter((s: any) => s.status === 'success').length}개 단계가 성공적으로 완료되었습니다.`}
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