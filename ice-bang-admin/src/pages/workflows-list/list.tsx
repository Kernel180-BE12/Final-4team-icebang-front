// src/pages/scheduler-history/list.tsx
import { List, ShowButton } from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Tooltip, Button } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ClockCircleOutlined,
  EyeOutlined 
} from "@ant-design/icons";

// =================================================================
// 1. 재사용 가능한 UI 컴포넌트 (변경 없음)
// =================================================================

const StatusTag = ({ status }: { status: string }) => {
  const statusConfig = {
    activate: { color: "success", text: "활성" },
    failed: { color: "error", text: "삭제" },
    pending: { color: "default", text: "비활성" }
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const isProcessing = status === 'running';
  return (
    <Tag 
      color={config.color} 
      icon={isProcessing ? <SyncOutlined spin /> : undefined}
    >
      {config.text}
    </Tag>
  );
};

export const WorkflowList = () => {
  // API 대신 사용할 하드코딩 데이터
  const hardcodedData = [
    {
      id: 1,
      workflow_name: "블로그 A 자동 포스팅",
      workflow_description: "네이버 블로그에 자동으로 포스팅하는 워크플로우",
      execution_date: "2024-09-01T09:00:00Z",
      posting_setting: "네이버 블로그 - 개인 블로그",
      workflow_setting: "자동 포스팅",
      status: "default",
    },
    {
      id: 2,
      workflow_name: "블로그 B 자동 포스팅",
      workflow_description: "네이버 블로그에 자동으로 포스팅하는 워크플로우",
      execution_date: "2024-09-01T14:30:00Z",
      posting_setting: "네이버 블로그 - 개인 블로그",
      workflow_setting: "자동 포스팅",
      status: "activate",
    },
    {
      id: 3,
      workflow_name: "블로그 C 자동 포스팅",
      workflow_description: "티스토리 블로그에 자동으로 포스팅하는 워크플로우",
      execution_date: "2024-09-01T08:15:00Z",
      posting_setting: "티스토리 블로그 - 개인 블로그",
      workflow_setting: "자동 포스팅",
      status: "failed",
    }
  ];

  // `useTable` 훅 대신 수동으로 tableProps 객체 생성
  const tableProps = {
    dataSource: hardcodedData,
    loading: false, // 데이터가 이미 있으므로 로딩 상태는 false
  };
  
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
  };

  return (
    <List title="워크플로우 리스트">
      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        <Table.Column dataIndex="id" title="ID" width={60} fixed="left" />
        <Table.Column dataIndex="workflow_name" title="이름" width={200} fixed="left" />
        <Table.Column dataIndex="workflow_description" title="설명" width={200} fixed="left" />
        <Table.Column dataIndex="posting_setting" title="블로그 설정" width={200} fixed="left" />
        <Table.Column dataIndex="workflow_setting" title="스케줄러 설정" width={200} fixed="left" />
        <Table.Column dataIndex="status" title="활성 여부" width={100} render={(status) => <StatusTag status={status} />} />
        <Table.Column dataIndex="execution_date" title="생성일시" width={180} render={(date) => formatDateTime(date)} />
      </Table>
    </List>
  );
};