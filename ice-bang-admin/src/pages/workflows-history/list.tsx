// src/pages/workflows-history/list.tsx
import {
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { useGo } from "@refinedev/core";
import { Space, Table, Tag, Button } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ClockCircleOutlined,
  EyeOutlined 
} from "@ant-design/icons";

export const WorkflowsHistoryList = () => {
  const go = useGo();
  
  const { tableProps } = useTable({
    resource: "workflow-runs",
    dataProviderName: "workflows_history",
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
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
      success: { color: "success", text: "성공" },
      failed: { color: "error", text: "실패" },
      running: { color: "processing", text: "실행중" },
      pending: { color: "default", text: "대기중" },
      skipped: { color: "default", text: "스킵됨" }
    };
    
    const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const formatDuration = (startedAt: string, finishedAt: string) => {
    if (!startedAt || !finishedAt) return "-";
    
    const start = new Date(startedAt);
    const end = new Date(finishedAt);
    const durationMs = end.getTime() - start.getTime();
    
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    }
    return `${remainingSeconds}초`;
  };

  return (
    <List title="워크플로 실행 이력">
      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        
        <Table.Column
          dataIndex="id"
          title="실행 ID"
          width={100}
          fixed="left"
          render={(id: number) => (
            <div style={{ fontWeight: "500" }}>#{id}</div>
          )}
        />

        <Table.Column
          dataIndex="workflowId"
          title="워크플로 ID"
          width={120}
          render={(workflowId: number) => (
            <div>{workflowId}</div>
          )}
        />
        
        <Table.Column
          dataIndex="traceId"
          title="추적 ID"
          width={200}
          render={(traceId: string) => (
            <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
              {traceId?.substring(0, 8)}...
            </div>
          )}
        />
        
        <Table.Column
          dataIndex="startedAt"
          title="시작 시간"
          width={150}
          render={(startedAt: string) => formatDateTime(startedAt)}
        />
        
        <Table.Column
          dataIndex="finishedAt"
          title="완료 시간"
          width={150}
          render={(finishedAt: string | null) => formatDateTime(finishedAt)}
        />

        <Table.Column
          title="실행 시간"
          width={120}
          render={(_, record: any) => formatDuration(record.startedAt, record.finishedAt)}
        />
        
        <Table.Column
          dataIndex="createdBy"
          title="생성자"
          width={120}
          render={(createdBy: string | null) => createdBy || "-"}
        />

        <Table.Column
          dataIndex="triggerType"
          title="트리거"
          width={100}
          render={(triggerType: string | null) => triggerType || "-"}
        />

        <Table.Column
          dataIndex="runNumber"
          title="실행 번호"
          width={120}
          render={(runNumber: string | null) => runNumber || "-"}
        />
        
        <Table.Column
          dataIndex="status"
          title="상태"
          width={100}
          render={(status: string) => (
            <Space>
              {getStatusIcon(status)}
              {getStatusTag(status)}
            </Space>
          )}
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
                go({ to: `/workflows-history/show/${record.id}` });
              }}
            />
          )}
        />
      </Table>
    </List>
  );
};