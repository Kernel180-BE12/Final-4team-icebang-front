import React from 'react';
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
  FilterDropdown,
  DateField,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { 
  Space, 
  Table, 
  Tag, 
  Button, 
  Input,
  Select,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  Drawer,
  Descriptions
} from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  PauseCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  MoreOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

export const WorkflowRunList = () => {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]);
  const [detailDrawerOpen, setDetailDrawerOpen] = React.useState(false);
  const [selectedRun, setSelectedRun] = React.useState<BaseRecord | null>(null);

  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "workflow-runs",
    // Mock data - 실제로는 API에서 가져옴
    dataProviderName: "default",
  });

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      workflowId: 1,
      workflowName: "콘텐츠 자동화 파이프라인",
      traceId: "wf-trace-001",
      runNumber: "#1234",
      status: "success",
      triggerType: "schedule",
      startedAt: "2024-01-15T10:30:00Z",
      finishedAt: "2024-01-15T11:15:45Z",
      duration: 2745, // seconds
      createdBy: "시스템",
      jobRuns: [
        {
          id: 1,
          jobName: "트렌드 분석",
          status: "success",
          duration: 285,
          taskCount: 4
        },
        {
          id: 2,
          jobName: "콘텐츠 크롤링", 
          status: "success",
          duration: 420,
          taskCount: 3
        },
        {
          id: 3,
          jobName: "블로그 글 생성",
          status: "success", 
          duration: 240,
          taskCount: 4
        }
      ]
    },
    {
      id: 2,
      workflowId: 1,
      workflowName: "콘텐츠 자동화 파이프라인",
      traceId: "wf-trace-002",
      runNumber: "#1235", 
      status: "running",
      triggerType: "manual",
      startedAt: "2024-01-15T14:45:00Z",
      finishedAt: null,
      duration: 1890,
      createdBy: "admin",
      jobRuns: [
        {
          id: 4,
          jobName: "트렌드 분석",
          status: "success",
          duration: 280,
          taskCount: 4
        },
        {
          id: 5,
          jobName: "콘텐츠 크롤링",
          status: "running", 
          duration: 195,
          taskCount: 3
        },
        {
          id: 6,
          jobName: "블로그 글 생성",
          status: "pending",
          duration: 0,
          taskCount: 4
        }
      ]
    },
    {
      id: 3,
      workflowId: 1, 
      workflowName: "콘텐츠 자동화 파이프라인",
      traceId: "wf-trace-003",
      runNumber: "#1233",
      status: "failed",
      triggerType: "schedule", 
      startedAt: "2024-01-14T16:20:00Z",
      finishedAt: "2024-01-14T16:27:25Z",
      duration: 445,
      createdBy: "시스템",
      jobRuns: [
        {
          id: 7,
          jobName: "트렌드 분석",
          status: "success",
          duration: 290,
          taskCount: 4
        },
        {
          id: 8,
          jobName: "콘텐츠 크롤링",
          status: "failed",
          duration: 155, 
          taskCount: 3
        },
        {
          id: 9,
          jobName: "블로그 글 생성",
          status: "skipped",
          duration: 0,
          taskCount: 4
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'running':
        return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'cancelled':
        return <PauseCircleOutlined style={{ color: '#d9d9d9' }} />;
      case 'skipped':
        return <PauseCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'running':
        return 'processing';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      case 'skipped':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '성공';
      case 'failed':
        return '실패';
      case 'running':
        return '실행중';
      case 'pending':
        return '대기중';
      case 'cancelled':
        return '취소됨';
      case 'skipped':
        return '건너뜀';
      default:
        return status;
    }
  };

  const getTriggerTypeText = (triggerType: string) => {
    switch (triggerType) {
      case 'schedule':
        return '스케줄';
      case 'manual':
        return '수동';
      case 'push':
        return 'Push';
      case 'pull_request':
        return 'PR';
      default:
        return triggerType;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  const expandedRowRender = (record: BaseRecord) => {
    const columns = [
      {
        title: 'Job 이름',
        dataIndex: 'jobName',
        key: 'jobName',
        render: (text: string) => <Text strong>{text}</Text>
      },
      {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {getStatusText(status)}
          </Tag>
        )
      },
      {
        title: '실행 시간',
        dataIndex: 'duration',
        key: 'duration',
        render: (duration: number) => (
          <Text type="secondary">{formatDuration(duration)}</Text>
        )
      },
      {
        title: 'Task 개수',
        dataIndex: 'taskCount',
        key: 'taskCount',
        render: (count: number) => (
          <Text type="secondary">{count}개</Text>
        )
      },
      {
        title: '액션',
        key: 'actions',
        render: (_: any, jobRecord: BaseRecord) => (
          <Space>
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => {
                // Job 상세 보기
                console.log('View job details:', jobRecord);
              }}
            >
              상세
            </Button>
          </Space>
        )
      }
    ];

    return (
      <Table 
        columns={columns}
        dataSource={record.jobRuns}
        pagination={false}
        rowKey="id"
        size="small"
      />
    );
  };

  const showRunDetail = (record: BaseRecord) => {
    setSelectedRun(record);
    setDetailDrawerOpen(true);
  };

  // 통계 데이터 계산
  const getStats = () => {
    const total = mockData.length;
    const success = mockData.filter(run => run.status === 'success').length;
    const running = mockData.filter(run => run.status === 'running').length;
    const failed = mockData.filter(run => run.status === 'failed').length;
    
    return { total, success, running, failed };
  };

  const stats = getStats();

  return (
    <>
      {/* 통계 카드 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 실행"
              value={stats.total}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="성공"
              value={stats.success}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="실행중"
              value={stats.running}
              valueStyle={{ color: '#1890ff' }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="실패"
              value={stats.failed}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <List
        title="워크플로우 실행 목록"
        headerProps={{
          extra: (
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={() => {
                // 워크플로우 수동 실행
                console.log('Manual workflow execution');
              }}
            >
              워크플로우 실행
            </Button>
          )
        }}
      >
        <Table 
          {...tableProps}
          dataSource={mockData}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
            expandRowByClick: false,
          }}
        >
          <Table.Column 
            dataIndex="runNumber" 
            title="실행 번호"
            render={(runNumber: string) => (
              <Text strong>{runNumber}</Text>
            )}
          />
          
          <Table.Column 
            dataIndex="workflowName" 
            title="워크플로우"
            render={(name: string) => (
              <Text>{name}</Text>
            )}
          />

          <Table.Column
            dataIndex="status"
            title="상태"
            render={(status: string) => (
              <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                {getStatusText(status)}
              </Tag>
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: 200 }}
                  placeholder="상태 선택"
                  allowClear
                >
                  <Select.Option value="success">성공</Select.Option>
                  <Select.Option value="running">실행중</Select.Option>
                  <Select.Option value="failed">실패</Select.Option>
                  <Select.Option value="cancelled">취소됨</Select.Option>
                </Select>
              </FilterDropdown>
            )}
            filterIcon={(filtered) => (
              <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            )}
          />

          <Table.Column
            dataIndex="triggerType"
            title="트리거"
            render={(triggerType: string) => (
              <Tag>{getTriggerTypeText(triggerType)}</Tag>
            )}
          />

          <Table.Column
            dataIndex="createdBy"
            title="실행자"
            render={(createdBy: string) => (
              <Text type="secondary">{createdBy}</Text>
            )}
          />

          <Table.Column
            dataIndex="startedAt"
            title="시작 시간"
            render={(startedAt: string) => (
              <DateField value={startedAt} format="YYYY-MM-DD HH:mm:ss" />
            )}
          />

          <Table.Column
            dataIndex="duration"
            title="실행 시간"
            render={(duration: number) => (
              <Text type="secondary">{formatDuration(duration)}</Text>
            )}
          />

          <Table.Column
            title="액션"
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => showRunDetail(record)}
                >
                  상세
                </Button>
                <ShowButton 
                  hideText 
                  size="small" 
                  recordItemId={record.id}
                  resource="workflow-runs"
                />
                <Button
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    // 재실행
                    console.log('Re-run workflow:', record);
                  }}
                >
                  재실행
                </Button>
              </Space>
            )}
          />
        </Table>
      </List>

      {/* 상세 정보 Drawer */}
      <Drawer
        title="워크플로우 실행 상세"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
      >
        {selectedRun && (
          <div>
            <Descriptions title="기본 정보" bordered column={1}>
              <Descriptions.Item label="실행 번호">
                {selectedRun.runNumber}
              </Descriptions.Item>
              <Descriptions.Item label="워크플로우">
                {selectedRun.workflowName}
              </Descriptions.Item>
              <Descriptions.Item label="상태">
                <Tag color={getStatusColor(selectedRun.status)} icon={getStatusIcon(selectedRun.status)}>
                  {getStatusText(selectedRun.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="트리거 타입">
                {getTriggerTypeText(selectedRun.triggerType)}
              </Descriptions.Item>
              <Descriptions.Item label="실행자">
                {selectedRun.createdBy}
              </Descriptions.Item>
              <Descriptions.Item label="시작 시간">
                <DateField value={selectedRun.startedAt} format="YYYY-MM-DD HH:mm:ss" />
              </Descriptions.Item>
              <Descriptions.Item label="종료 시간">
                {selectedRun.finishedAt ? (
                  <DateField value={selectedRun.finishedAt} format="YYYY-MM-DD HH:mm:ss" />
                ) : (
                  <Text type="secondary">실행중</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="실행 시간">
                {formatDuration(selectedRun.duration)}
              </Descriptions.Item>
              <Descriptions.Item label="추적 ID">
                <Text code>{selectedRun.traceId}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
              Job 실행 상태
            </Title>
            <Timeline>
              {selectedRun.jobRuns?.map((job: any, index: number) => (
                <Timeline.Item
                  key={job.id}
                  dot={getStatusIcon(job.status)}
                  color={getStatusColor(job.status)}
                >
                  <div>
                    <Text strong>{job.jobName}</Text>
                    <br />
                    <Text type="secondary">
                      {getStatusText(job.status)} • {formatDuration(job.duration)} • {job.taskCount}개 작업
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        )}
      </Drawer>
    </>
  );
};