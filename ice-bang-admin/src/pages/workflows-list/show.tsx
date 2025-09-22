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
  CodeOutlined
} from "@ant-design/icons";
import {
  IWorkflow,
  IJob,
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
    return schedules.some(schedule => schedule.type === 'auto' && schedule.enabled);
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

  const renderTaskDetails = (task: any, jobType: string) => {
    return (
      <Card size="small" title="Task 상세보기" style={{ marginTop: 16 }}>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Task ID">
            <Text code>{task.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Job 타입">
            <Tag color="blue">{jobType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="파라미터">
            <pre style={{
              background: "#f5f5f5",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "12px",
              margin: 0
            }}>
              {JSON.stringify(task.parameters, null, 2)}
            </pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>
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
                  margin: 0
                }}>
                  {JSON.stringify(record.config, null, 2)}
                </pre>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 스케줄 정보 */}
          <Card title="스케줄 정보" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {record.schedules.map((schedule, index) => (
                <Card
                  key={index}
                  size="small"
                  style={{
                    backgroundColor: schedule.enabled ? '#f6ffed' : '#fafafa',
                    border: schedule.enabled ? '1px solid #b7eb8f' : '1px solid #d9d9d9'
                  }}
                >
                  <Descriptions size="small" column={2} bordered>
                    <Descriptions.Item label="상태">
                      <Tag color={schedule.enabled ? 'success' : 'default'}>
                        {schedule.enabled ? '활성' : '비활성'}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="최종 실행 상태">
                      <Tag color={
                        schedule.lastExecutionStatus === 'success' ? 'success' :
                        schedule.lastExecutionStatus === 'failed' ? 'error' :
                        schedule.lastExecutionStatus === 'running' ? 'processing' : 'default'
                      }>
                        {schedule.lastExecutionStatus === 'success' ? '성공' :
                         schedule.lastExecutionStatus === 'failed' ? '실패' :
                         schedule.lastExecutionStatus === 'running' ? '실행중' : '대기중'}
                      </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="설명" span={2}>
                      <Text>{schedule.description}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="최종 실행 일시">
                      <Text>{formatDateTime(schedule.lastExecutionDate)}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="생성일시">
                      <Text>{formatDateTime(schedule.createdAt)}</Text>
                    </Descriptions.Item>

                    {schedule.cronExpression && (
                      <Descriptions.Item label="크론 표현식" span={2}>
                        <Text code>{schedule.cronExpression}</Text>
                      </Descriptions.Item>
                    )}
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
              {record.config.job.map((job, index) => (
                <Steps.Step
                  key={job.id}
                  title={
                    <Space>
                      <span>{job.id}</span>
                      <Tag color="blue">{job.type}</Tag>
                      {getStatusIcon(record.isEnabled)}
                    </Space>
                  }
                  description={
                    <div>
                      <Descriptions size="small" column={2} style={{ marginBottom: 8 }}>
                        <Descriptions.Item label="Job 타입" span={2}>
                          {job.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Task 개수">
                          {job.task.length}개
                        </Descriptions.Item>
                        <Descriptions.Item label="상태">
                          <Tag color={record.isEnabled ? "success" : "default"}>
                            {record.isEnabled ? "활성" : "비활성"}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>

                      <Button
                        type="link"
                        size="small"
                        onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      >
                        {selectedJob === job.id ? "접기" : "상세보기"}
                      </Button>

                      {selectedJob === job.id && (
                        <div>
                          {job.task.map((task) => (
                            <div key={task.id}>
                              {renderTaskDetails(task, job.type)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  }
                  status={record.isEnabled ? "finish" : "wait"}
                  icon={<SettingOutlined />}
                />
              ))}
            </Steps>
          </Card>

          {/* 구성 요약 */}
          <Card title="구성 요약">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Alert
                message="워크플로우 구성 완료"
                description={`총 ${record.config.job.length}개의 Job과 ${record.config.job.reduce((sum, job) => sum + job.task.length, 0)}개의 Task로 구성되어 있습니다.`}
                type={record.isEnabled ? "success" : "info"}
                showIcon
              />

              <Descriptions column={3} size="small">
                <Descriptions.Item label="총 Job 수">
                  {record.config.job.length}개
                </Descriptions.Item>
                <Descriptions.Item label="총 Task 수">
                  {record.config.job.reduce((sum, job) => sum + job.task.length, 0)}개
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