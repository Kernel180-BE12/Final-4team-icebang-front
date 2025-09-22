// src/pages/workflows-history/show.tsx
import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Tag, Descriptions, Card, Steps, Timeline, Alert, Space, Button } from "antd";
import { useState } from "react";
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
  const { queryResult } = useShow({
    resource: "workflows_history",
  });
  
  const { data, isLoading } = queryResult;
  const record = data?.data;
  
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
    console.log("=== 디버깅 ===");
  console.log("data:", data);
  console.log("record:", record);
  console.log("workflowRun:", record?.workflowRun);
  console.log("jobRuns:", record?.jobRuns);
  

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

  const formatDuration = (durationMs: number | null) => {
    if (!durationMs) return "-";
    
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    }
    return `${remainingSeconds}초`;
  };

  const renderTaskDetails = (taskRun: any) => {
    if (!taskRun) return null;

    return (
      <Card size="small" title="태스크 상세보기" style={{ marginTop: 16 }}>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="태스크 이름">
            <Text code>{taskRun.taskName}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="태스크 타입">
            <Tag>{taskRun.taskType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="태스크 ID">
            <Text code>{taskRun.taskId}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="태스크 설명">
            {taskRun.taskDescription || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="상태">
            {getStatusIcon(taskRun.status)} {getStatusTag(taskRun.status)}
          </Descriptions.Item>
          <Descriptions.Item label="시작 시간">
            {formatDateTime(taskRun.startedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="완료 시간">
            {formatDateTime(taskRun.finishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="실행 시간">
            {formatDuration(taskRun.durationMs)}
          </Descriptions.Item>
          <Descriptions.Item label="실행 순서">
            {taskRun.executionOrder || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  const getAllTasks = () => {
    if (!record?.jobRuns) return [];
    
    const allTasks = [];
    for (const jobRun of record.jobRuns) {
      if (jobRun.taskRuns) {
        for (const taskRun of jobRun.taskRuns) {
          allTasks.push({
            ...taskRun,
            jobName: jobRun.jobName,
            jobDescription: jobRun.jobDescription
          });
        }
      }
    }
    return allTasks;
  };

  const getStatusCounts = () => {
    const allTasks = getAllTasks();
    return {
      success: allTasks.filter(t => t.status?.toLowerCase() === 'success').length,
      failed: allTasks.filter(t => t.status?.toLowerCase() === 'failed').length,
      skipped: allTasks.filter(t => t.status?.toLowerCase() === 'skipped').length,
      total: allTasks.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <Show isLoading={isLoading}>
      {/* 실행 정보 */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions
          title="실행 정보"
          bordered
          column={2}
          size="middle"
        >
          <Descriptions.Item label="워크플로명" span={2}>
            <TextField value={record?.workflowRun?.workflowName} />
          </Descriptions.Item>

          <Descriptions.Item label="설명" span={2}>
            <TextField value={record?.workflowRun?.workflowDescription} />
          </Descriptions.Item>

          <Descriptions.Item label="추적 ID" span={2}>
            <Text code>{record?.traceId}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="시작 시간">
            {formatDateTime(record?.workflowRun?.startedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="완료 시간">
            {formatDateTime(record?.workflowRun?.finishedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="실행 번호">
            <TextField value={record?.workflowRun?.runNumber || "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="상태">
            {getStatusTag(record?.workflowRun?.status)}
          </Descriptions.Item>

          <Descriptions.Item label="트리거 유형">
            <TextField value={record?.workflowRun?.triggerType || "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="생성자 ID">
            <TextField value={record?.workflowRun?.createdBy || "-"} />
          </Descriptions.Item>

          <Descriptions.Item label="총 실행 시간" span={2}>
            {formatDuration(record?.workflowRun?.durationMs)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Job별 실행 상황 */}
      <Card title="Job별 실행 상황" style={{ marginBottom: 16 }}>
        {record?.jobRuns?.map((jobRun: any, jobIndex: number) => (
          <Card 
            key={jobRun.id}
            size="small" 
            title={
              <Space>
                <span>{jobRun.jobName}</span>
                {getStatusIcon(jobRun.status)}
                {getStatusTag(jobRun.status)}
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Job 설명" span={2}>
                {jobRun.jobDescription}
              </Descriptions.Item>
              <Descriptions.Item label="시작 시간">
                {formatDateTime(jobRun.startedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="완료 시간">
                {formatDateTime(jobRun.finishedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="실행 시간">
                {formatDuration(jobRun.durationMs)}
              </Descriptions.Item>
              <Descriptions.Item label="실행 순서">
                {jobRun.executionOrder || "-"}
              </Descriptions.Item>
            </Descriptions>

            {/* Task 단계별 표시 */}
            <Steps 
              direction="vertical" 
              size="small"
            >
              {jobRun.taskRuns?.map((taskRun: any, taskIndex: number) => (
                <Step
                  key={taskRun.id}
                  title={
                    <Space>
                      <span>{taskRun.taskName}</span>
                      {getStatusIcon(taskRun.status)}
                    </Space>
                  }
                  description={
                    <div>
                      <Descriptions size="small" column={2} style={{ marginBottom: 8 }}>
                        <Descriptions.Item label="설명" span={2}>
                          {taskRun.taskDescription || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="타입">
                          <Tag>{taskRun.taskType}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="상태">
                          {getStatusTag(taskRun.status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="시작 시간">
                          {formatDateTime(taskRun.startedAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="완료 시간">
                          {formatDateTime(taskRun.finishedAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="실행 시간">
                          {formatDuration(taskRun.durationMs)}
                        </Descriptions.Item>
                      </Descriptions>

                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => setSelectedStep(selectedStep === taskRun.id ? null : taskRun.id)}
                      >
                        {selectedStep === taskRun.id ? "접기" : "상세보기"}
                      </Button>
                      
                      {selectedStep === taskRun.id && (
                        <div>
                          {taskRun.status?.toLowerCase() === "skipped" && (
                            <Alert 
                              message="스킵됨" 
                              description="이 태스크는 스킵되었습니다" 
                              type="warning" 
                              showIcon 
                              style={{ marginBottom: 16 }}
                            />
                          )}
                          
                          {renderTaskDetails(taskRun)}
                        </div>
                      )}
                    </div>
                  }
                  status={
                    taskRun.status?.toLowerCase() === "success" ? "finish" :
                    taskRun.status?.toLowerCase() === "failed" ? "error" :
                    taskRun.status?.toLowerCase() === "running" ? "process" : "wait"
                  }
                />
              ))}
            </Steps>
          </Card>
        ))}
      </Card>

      {/* 요약 정보 */}
      <Card title="실행 요약">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert
            message={statusCounts.failed > 0 ? "실행 실패" : "실행 완료"}
            description={`총 ${statusCounts.total}개 태스크 중 ${statusCounts.success}개 성공, ${statusCounts.failed}개 실패, ${statusCounts.skipped}개 스킵`}
            type={statusCounts.failed > 0 ? "error" : "success"}
            showIcon
          />
          
          <Descriptions column={3} size="small">
            <Descriptions.Item label="성공한 태스크">
              {statusCounts.success}개
            </Descriptions.Item>
            <Descriptions.Item label="실패한 태스크">
              {statusCounts.failed}개
            </Descriptions.Item>
            <Descriptions.Item label="스킵된 태스크">
              {statusCounts.skipped}개
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
    </Show>
  );
};