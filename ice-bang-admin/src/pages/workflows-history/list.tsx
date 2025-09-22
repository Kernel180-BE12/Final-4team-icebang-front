// src/pages/workflows-history/list.tsx
import {
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { useGo } from "@refinedev/core";
import { Table, Tag } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ClockCircleOutlined,
  EyeOutlined 
} from "@ant-design/icons";

// 백엔드 WorkflowHistoryDTO와 매칭되는 타입 정의
interface WorkflowHistoryDTO {
  id: string; // BigInteger는 문자열로 처리
  workflowId: string;
  traceId: string;
  startedAt: string; // LocalDateTime은 ISO 문자열로 처리
  finishedAt: string | null;
  createdBy: string | null; // null 가능
  triggerType: string | null; // null 가능
  runNumber: string | null; // null 가능
  status: "completed" | "failed" | "running" | "pending";
}

export const WorkflowsHistoryList = () => {
  const go = useGo();

  // Refine의 useTable 훅을 사용하여 백엔드 API 연동
  const { tableProps } = useTable<WorkflowHistoryDTO>({
    resource: "workflows_history", // 🔥 여기가 문제! App.tsx의 리소스 이름과 일치해야 함
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "startedAt",
          order: "desc",
        },
      ],
    },
  });

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
    return new Date(dateString).toLocaleString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTriggerTypeTag = (triggerType: string) => {
    const triggerConfig = {
      scheduled: { color: "blue", text: "예약실행" },
      manual: { color: "green", text: "수동실행" },
      api: { color: "orange", text: "API호출" },
      webhook: { color: "purple", text: "웹훅" }
    };
    
    const config = triggerConfig[triggerType as keyof typeof triggerConfig] || 
                   { color: "default", text: triggerType };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <List title="워크플로우 실행 이력">
      <Table 
        {...tableProps} 
        rowKey="id" 
        scroll={{ x: 1000 }}
        size="middle"
      >
        
        <Table.Column
          dataIndex="traceId"
          title="추적 ID"
          width={150}
          fixed="left"
          render={(traceId: string) => (
            <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
              {traceId}
            </div>
          )}
        />
        
        <Table.Column
          dataIndex="runNumber"
          title="실행 번호"
          width={100}
          render={(runNumber: string | null) => 
            runNumber ? <Tag color="cyan">#{runNumber}</Tag> : "-"
          }
        />
        
        <Table.Column
          dataIndex="startedAt"
          title="시작 시간"
          width={160}
          render={(date: string) => formatDateTime(date)}
        />
        
        <Table.Column
          dataIndex="finishedAt"
          title="완료 시간"
          width={160}
          render={(date: string | null) => formatDateTime(date)}
        />
        
        <Table.Column
          dataIndex="createdBy"
          title="실행자"
          width={120}
          render={(createdBy: string | null) => createdBy || "-"}
        />
        
        <Table.Column
          dataIndex="triggerType"
          title="트리거"
          width={120}
          render={(triggerType: string | null) => 
            triggerType ? getTriggerTypeTag(triggerType) : "-"
          }
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
          render={(_, record: WorkflowHistoryDTO) => (
            <ShowButton 
              hideText 
              size="small" 
              recordItemId={record.id}
              icon={<EyeOutlined />}
            />
          )}
        />
      </Table>
    </List>
  );
};