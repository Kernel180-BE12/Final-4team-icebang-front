// src/pages/workflows-history/list.tsx
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

export const WorkflowsHistoryList = () => {
  // 하드코딩된 워크플로 이력 데이터
  const hardcodedData = [
    {
      id: 1,
      workflow_name: "네이버 블로그 포스팅#1",
      execution_date: "2024-09-01T09:00:00Z",
      completion_date: "2024-09-01T09:08:00Z",
      creator_id: "user123",
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
      workflow_name: "티스토리 블로그 포스팅#2",
      execution_date: "2024-09-01T14:30:00Z",
      completion_date: null,
      creator_id: "user456",
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
      workflow_name: "네이버 블로그 포스팅#3",
      execution_date: "2024-09-01T08:15:00Z",
      completion_date: null,
      creator_id: "user789",
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
  };

  return (
    <List
      title="워크플로 실행 이력"
    >
      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        
        <Table.Column
          dataIndex="workflow_name"
          title="워크플로명"
          width={200}
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
          dataIndex="completion_date"
          title="완료 시간"
          width={150}
          render={(date: string | null) => formatDateTime(date)}
        />
        
        <Table.Column
          dataIndex="creator_id"
          title="생성자 ID"
          width={120}
        />
        
        <Table.Column
          dataIndex="status"
          title="상태"
          width={100}
          render={(status: string) => getStatusTag(status)}
        />
        
        <Table.Column
          title="상세 보기"
          dataIndex="actions"
          width={100}
          fixed="right"
          render={(_, record: BaseRecord) => (
            <ShowButton 
              hideText 
              size="small" 
              recordItemId={record.id}
              onClick={() => {
                window.location.href = `/workflows-history/show/${record.id}`;
              }}
            />
          )}
        />
      </Table>
    </List>
  );
};