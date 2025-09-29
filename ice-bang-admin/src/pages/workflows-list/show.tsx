import { Show, TextField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Descriptions, Tag, Space, Steps, Alert, Button } from "antd";
import { useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TagOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  ToolOutlined,
  CodeOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import {
  IWorkflow,
  IBackendJob,
  IBackendTask,
  getWorkflowStatusText,
  getWorkflowStatusColor,
  getScheduleTypeText,
  getScheduleTypeColor,
  cronToKorean
} from "../../types/workflow";

const { Title, Text } = Typography;

export const WorkflowShow = () => {
  const { queryResult } = useShow<IWorkflow>({
    resource: "workflows_list",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const getStatusIcon = (isEnabled: boolean) => {
    return isEnabled ?
      <CheckCircleOutlined style={{ color: "#52c41a" }} /> :
      <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
  };

  // 워크플로우가 자동 실행 가능한지 판단하는 함수
  const isAutomaticWorkflow = (schedules: any[]) => {
    if (!schedules || schedules.length === 0) return false;
    return schedules.some(schedule => schedule.isActive);
  };

  // 워크플로우 자동 여부 태그 반환
  const getWorkflowModeTag = (schedules: any[]) => {
    const hasAutoSchedule = isAutomaticWorkflow(schedules);
    return (
      <Tag
        color={hasAutoSchedule ? 'processing' : 'default'}
        icon={hasAutoSchedule ? <ClockCircleOutlined /> : <PlayCircleOutlined />}
      >
        {hasAutoSchedule ? '자동' : '수동'}
      </Tag>
    );
  };

  const renderTaskFlow = (tasks: IBackendTask[]) => {
    const sortedTasks = [...tasks].sort((a, b) => a.execution_order - b.execution_order);

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '16px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {sortedTasks.map((task, index) => (
          <div key={task.task_id} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Task 카드 */}
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #1890ff',
              borderRadius: '8px',
              padding: '12px 16px',
              minWidth: '160px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* 실행 순서 배지 */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                backgroundColor: '#52c41a',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {task.execution_order}
              </div>

              {/* Task 정보 */}
              <div style={{ marginBottom: '8px' }}>
                <Text strong style={{ fontSize: '14px', display: 'block' }}>
                  {task.task_name}
                </Text>
              </div>
              <Tag color="blue" >
                {task.task_type}
              </Tag>
            </div>

            {/* 화살표 (마지막 Task가 아닌 경우) */}
            {index < sortedTasks.length - 1 && (
              <ArrowRightOutlined
                style={{
                  fontSize: '20px',
                  color: '#1890ff',
                  margin: '0 8px'
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Show
      isLoading={isLoading}
      title="워크플로우 상세"
      canEdit={false}
      canDelete={false}
    >
      {record && (
        <div>
          {/* 워크플로우 정보 */}
          <Card style={{ marginBottom: 16 }}>
            <Descriptions
              title="워크플로우 정보"
              bordered
              column={2}
              size="middle"
            >
              <Descriptions.Item label="워크플로우명" span={2}>
                <TextField value={record.name} />
              </Descriptions.Item>

              <Descriptions.Item label="설명" span={2}>
                <TextField value={record.description || "설명이 없습니다."} />
              </Descriptions.Item>

              <Descriptions.Item label="상태">
                <Tag
                  color={getWorkflowStatusColor(record.isEnabled)}
                  icon={record.isEnabled ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                  {getWorkflowStatusText(record.isEnabled)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="워크플로우 자동 여부">
                {getWorkflowModeTag(record.schedules)}
              </Descriptions.Item>

              <Descriptions.Item label="생성자">
                <TextField value={record.createdBy} />
              </Descriptions.Item>

              <Descriptions.Item label="생성일시">
                <DateField
                  value={record.createdAt}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Descriptions.Item>

              <Descriptions.Item label="수정자">
                <TextField value={record.updatedBy || "-"} />
              </Descriptions.Item>

              <Descriptions.Item label="수정일시">
                {record.updatedAt ? (
                  <DateField
                    value={record.updatedAt}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                ) : (
                  <Text type="secondary">-</Text>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="워크플로우 설정" span={2}>
                <pre style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  margin: 0,
                  maxHeight: "200px",
                  overflow: "auto"
                }}>
                  {JSON.stringify(record.defaultConfig, null, 2)}
                </pre>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 스케줄 정보 */}
          <Card title="스케줄 정보" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {record.schedules.map((schedule) => (
                <Card
                  key={schedule.id}
                  size="small"
                  style={{
                    backgroundColor: schedule.isActive ? '#f6ffed' : '#fafafa',
                    border: schedule.isActive ? '1px solid #b7eb8f' : '1px solid #d9d9d9'
                  }}
                >
                  <Descriptions size="small" column={2} bordered>
                    <Descriptions.Item label="상태">
                      <Tag color={schedule.isActive ? 'success' : 'default'}>
                        {schedule.isActive ? '활성' : '비활성'}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="최종 실행 상태">
                      <Tag color={
                        schedule.lastRunStatus === 'success' ? 'success' :
                        schedule.lastRunStatus === 'failed' ? 'error' :
                        schedule.lastRunStatus === 'running' ? 'processing' : 'default'
                      }>
                        {schedule.lastRunStatus === 'success' ? '성공' :
                         schedule.lastRunStatus === 'failed' ? '실패' :
                         schedule.lastRunStatus === 'running' ? '실행중' :
                         schedule.lastRunStatus === null ? '대기중' : '대기중'}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="스케줄 설명" span={2}>
                      <Text>{schedule.scheduleText}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="최종 실행 일시">
                      <Text>{schedule.lastRunAt ? formatDateTime(schedule.lastRunAt) : '-'}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="생성일시">
                      <Text>{formatDateTime(schedule.createdAt)}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="크론 표현식" span={2}>
                      <Text code>{schedule.cronExpression}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ))}

              {record.schedules.length === 0 && (
                <Alert
                  message="등록된 스케줄이 없습니다"
                  description="이 워크플로우에는 스케줄이 설정되어 있지 않습니다."
                  type="info"
                  showIcon
                />
              )}
            </Space>
          </Card>

          {/* Job별 실행 구성 */}
          <Card title="Job별 실행 구성" style={{ marginBottom: 16 }}>
            <Steps
              direction="vertical"
              current={-1}
              style={{ marginBottom: 24 }}
            >
              {record.jobs?.map((job, index) => {
                const tasks: IBackendTask[] = job.tasks ? JSON.parse(job.tasks) : [];
                return (
                  <Steps.Step
                    key={job.job_id}
                    title={
                      <Space>
                        <span>{job.job_name}</span>
                        <Tag color="blue">Job #{job.job_id}</Tag>
                        <Tag color={job.job_enabled ? "success" : "default"}>
                          {job.job_enabled ? "활성" : "비활성"}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Descriptions size="small" column={2} style={{ marginBottom: 8 }}>
                          <Descriptions.Item label="Job 설명" span={2}>
                            {job.job_description}
                          </Descriptions.Item>
                          <Descriptions.Item label="Task 개수">
                            {tasks.length}개
                          </Descriptions.Item>
                          <Descriptions.Item label="실행 순서">
                            <Tag color="orange">{job.job_execution_order}</Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="상태">
                            <Tag color={job.job_enabled ? "success" : "default"}>
                              {job.job_enabled ? "활성" : "비활성"}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="워크플로우 ID">
                            {job.workflow_id}
                          </Descriptions.Item>
                        </Descriptions>

                        <Button
                          type="link"
                          size="small"
                          onClick={() => setSelectedJob(selectedJob === job.job_id.toString() ? null : job.job_id.toString())}
                        >
                          {selectedJob === job.job_id.toString() ? "접기" : "Task 플로우 보기"}
                        </Button>

                        {selectedJob === job.job_id.toString() && (
                          <div>
                            {renderTaskFlow(tasks)}
                          </div>
                        )}
                      </div>
                    }
                    status={job.job_enabled ? "finish" : "wait"}
                    icon={<SettingOutlined />}
                  />
                );
              })}
            </Steps>
          </Card>

          {/* 구성 요약 */}
          <Card title="구성 요약">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Alert
                message="워크플로우 구성 완료"
                description={`총 ${record.jobs?.length || 0}개의 Job과 ${record.jobs?.reduce((sum, job) => {
                  const tasks: IBackendTask[] = job.tasks ? JSON.parse(job.tasks) : [];
                  return sum + tasks.length;
                }, 0) || 0}개의 Task로 구성되어 있습니다.`}
                type={record.isEnabled ? "success" : "info"}
                showIcon
              />

              <Descriptions column={3} size="small">
                <Descriptions.Item label="총 Job 수">
                  {record.jobs?.length || 0}개
                </Descriptions.Item>
                <Descriptions.Item label="총 Task 수">
                  {record.jobs?.reduce((sum, job) => {
                    const tasks: IBackendTask[] = job.tasks ? JSON.parse(job.tasks) : [];
                    return sum + tasks.length;
                  }, 0) || 0}개
                </Descriptions.Item>
                <Descriptions.Item label="워크플로우 상태">
                  {record.isEnabled ? "활성화됨" : "비활성화됨"}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        </div>
      )}
    </Show>
  );
};