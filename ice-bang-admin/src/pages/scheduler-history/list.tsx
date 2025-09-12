// src/pages/scheduler-history/list.tsx
import {
  List,
  ShowButton,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Steps, Button, Tooltip } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ClockCircleOutlined,
  EyeOutlined 
} from "@ant-design/icons";

const { Step } = Steps;

export const SchedulerHistoryList = () => {
  // 하드코딩된 스케줄러 이력 데이터
  const hardcodedData = [
    {
      id: 1,
      scheduler_name: "블로그 A 자동 포스팅",
      execution_date: "2024-09-01T09:00:00Z",
      total_steps: 6,
      current_step: 6,
      status: "completed",
      steps: [
        { step: 1, name: "네이버 트렌드 크롤링", status: "success", duration: "2m 15s" },
        { step: 2, name: "싸다구 몰 검색", status: "success", duration: "1m 30s" },
        { step: 3, name: "상품 정보 추출", status: "success", duration: "45s" },
        { step: 4, name: "A 단계 (보류)", status: "skipped", duration: "-" },
        { step: 5, name: "콘텐츠 생성", status: "success", duration: "3m 20s" },
        { step: 6, name: "블로그 업로드", status: "success", duration: "1m 10s" },
      ]
    },
    {
      id: 2,
      scheduler_name: "블로그 B 자동 포스팅",
      execution_date: "2024-09-01T14:30:00Z",
      total_steps: 6,
      current_step: 3,
      status: "failed",
      steps: [
        { step: 1, name: "네이버 트렌드 크롤링", status: "success", duration: "2m 05s" },
        { step: 2, name: "싸다구 몰 검색", status: "success", duration: "1m 45s" },
        { step: 3, name: "상품 정보 추출", status: "failed", duration: "30s" },
        { step: 4, name: "A 단계 (보류)", status: "pending", duration: "-" },
        { step: 5, name: "콘텐츠 생성", status: "pending", duration: "-" },
        { step: 6, name: "블로그 업로드", status: "pending", duration: "-" },
      ]
    },
    {
      id: 3,
      scheduler_name: "블로그 C 자동 포스팅",
      execution_date: "2024-09-01T08:15:00Z",
      total_steps: 6,
      current_step: 5,
      status: "running",
      steps: [
        { step: 1, name: "네이버 트렌드 크롤링", status: "success", duration: "1m 50s" },
        { step: 2, name: "싸다구 몰 검색", status: "success", duration: "2m 10s" },
        { step: 3, name: "상품 정보 추출", status: "success", duration: "55s" },
        { step: 4, name: "A 단계 (보류)", status: "skipped", duration: "-" },
        { step: 5, name: "콘텐츠 생성", status: "running", duration: "진행중..." },
        { step: 6, name: "블로그 업로드", status: "pending", duration: "-" },
      ]
    }
  ];

  // 테이블 props 시뮬레이션
  const tableProps = {
    dataSource: hardcodedData,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: hardcodedData.length,
    },
  };

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const renderStepProgress = (steps: any[]) => {
    return (
      <div style={{ width: "400px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {steps.map((step, index) => (
            <Tooltip 
              key={step.step} 
              title={`${step.name} - ${step.duration}`}
              placement="top"
            >
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => console.log(`Step ${step.step} clicked:`, step)}
              >
                {getStatusIcon(step.status)}
                {index < steps.length - 1 && (
                  <div 
                    style={{
                      width: "20px",
                      height: "2px",
                      backgroundColor: step.status === "success" ? "#52c41a" : "#d9d9d9",
                      marginLeft: "4px",
                      marginRight: "4px"
                    }}
                  />
                )}
              </div>
            </Tooltip>
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          {steps.filter(s => s.status === "success").length} / {steps.length} 단계 완료
        </div>
      </div>
    );
  };

  return (
    <List
      title="스케줄러 실행 이력"
      headerProps={{
        extra: (
          <div style={{ fontSize: "14px", color: "#666" }}>
            각 단계를 클릭하면 상세 정보를 확인할 수 있습니다
          </div>
        )
      }}
    >
      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        <Table.Column 
          dataIndex="id" 
          title="ID" 
          width={60}
          fixed="left" 
        />
        
        <Table.Column
          dataIndex="scheduler_name"
          title="스케줄러명"
          width={180}
          fixed="left"
          render={(name: string) => (
            <div style={{ fontWeight: "500" }}>{name}</div>
          )}
        />
        
        <Table.Column
          dataIndex="execution_date"
          title="실행 시간"
          width={150}
          render={(date: string) => formatDateTime(date)}
        />
        
        <Table.Column
          dataIndex="status"
          title="상태"
          width={100}
          render={(status: string) => getStatusTag(status)}
        />
        
        <Table.Column
          title="진행 상황"
          width={450}
          render={(_, record: BaseRecord) => renderStepProgress(record.steps)}
        />
        
        <Table.Column
          title="Actions"
          dataIndex="actions"
          width={100}
          fixed="right"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton 
                hideText 
                size="small" 
                recordItemId={record.id}
                onClick={() => {
                  window.location.href = `/scheduler-history/show/${record.id}`;
                }}
              />
              <Tooltip title="단계별 상세보기">
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => {
                    console.log("Steps detail view for:", record.id);
                    // 단계별 상세 보기 모달이나 페이지로 이동
                  }}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};