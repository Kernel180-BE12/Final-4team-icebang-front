// src/pages/workflows-history/show.tsx
import { Show, TextField } from "@refinedev/antd";
import { useShow, useCustom, useDataProvider, useGo } from "@refinedev/core";
import { Typography, Tag, Descriptions, Card, Steps, Timeline, Alert, Space, Button, Tabs, Spin, Empty, Input, Select, Table, Collapse, Badge, Modal } from "antd";
import { useState, useEffect, useCallback } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  FileTextOutlined
} from "@ant-design/icons";

const { Text } = Typography;
const { Step } = Steps;

export const WorkflowsHistoryShow = () => {
  const go = useGo();
  const { queryResult } = useShow({
    resource: "workflows_history",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [logFilter, setLogFilter] = useState<string>('');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');
  const [taskLogsData, setTaskLogsData] = useState<Record<string, any>>({});
  const [taskLogsLoading, setTaskLogsLoading] = useState<Record<string, boolean>>({});
  const [ioDataLoading, setIoDataLoading] = useState(false);
  const [ioData, setIoData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIOData, setSelectedIOData] = useState<any>(null);

  const dataProvider = useDataProvider();

  // Execution Log API 호출 (전체 로그 - Execution Log 탭용)
  const { data: executionLogData, isLoading: logLoading, refetch: refetchLogs } = useCustom({
    url: `/v0/workflow-runs/logs`,
    method: "get",
    config: {
      query: {
        traceId: record?.traceId || ''
      }
    },
    queryOptions: {
      enabled: !!record?.traceId,
    },
    dataProviderName: "workflows_history"
  });

  // Task I/O 데이터 가져오기
  const fetchTaskIOData = useCallback(async () => {
    console.log("🔍 fetchTaskIOData 호출됨");
    console.log("record?.jobRuns:", record?.jobRuns);
    console.log("ioDataLoading:", ioDataLoading);

    if (!record?.jobRuns || ioDataLoading) {
      console.log("❌ fetchTaskIOData 조건 실패");
      return;
    }

    console.log("⏳ I/O 데이터 로딩 시작");
    setIoDataLoading(true);

    try {
      const workflowHistoryProvider = dataProvider("workflows_history");
      console.log("🔌 workflowHistoryProvider:", workflowHistoryProvider);

      if (!workflowHistoryProvider?.custom) {
        throw new Error('Custom method not available');
      }

      // 모든 taskRun ID 수집
      const taskRunIds = [];
      for (const jobRun of record.jobRuns) {
        if (jobRun.taskRuns) {
          for (const taskRun of jobRun.taskRuns) {
            taskRunIds.push(taskRun.id);
          }
        }
      }

      console.log("📝 수집된 taskRunIds:", taskRunIds);

      if (taskRunIds.length > 0) {
        const response = await workflowHistoryProvider.custom({
          url: `/v0/tasks/io-data`,
          method: "get",
          query: {
            taskRunIds: taskRunIds.join(','),
          }
        });

        console.log("🌐 API 응답:", response);
        console.log("📊 response.data:", response?.data);
        console.log("📊 response.data.data:", response?.data?.data);
        console.log("📊 설정할 ioData:", response?.data?.data || response?.data || []);

        // API 응답 구조에 따라 데이터 추출
        const apiData = response?.data?.data || response?.data || [];
        setIoData(Array.isArray(apiData) ? apiData : []);
      } else {
        console.log("❌ taskRunIds가 비어있음");
        setIoData([]);
      }
    } catch (error) {
      console.error('💥 I/O 데이터 로딩 실패:', error);
      setIoData([]);
    } finally {
      console.log("✅ I/O 데이터 로딩 완료");
      setIoDataLoading(false);
    }
  }, [record, dataProvider]);

  // record가 로드되면 자동으로 I/O 데이터 가져오기
  useEffect(() => {
    if (record?.jobRuns && !ioDataLoading && ioData.length === 0 && fetchTaskIOData) {
      console.log("🔄 useEffect에서 I/O 데이터 자동 로드");
      fetchTaskIOData();
    }
  }, [record?.jobRuns, ioDataLoading, ioData.length, fetchTaskIOData]);

  // 태스크별 로그 호출 함수
  const fetchTaskLogs = async (taskRun: any) => {
    const taskId = taskRun.id;
    const key = `task-${taskId}`;

    // 이미 로딩중이거나 데이터가 있으면 중복 호출 방지
    if (taskLogsLoading[key] || taskLogsData[key]) {
      return;
    }

    setTaskLogsLoading(prev => ({ ...prev, [key]: true }));

    try {
      const workflowHistoryProvider = dataProvider("workflows_history");
      if (!workflowHistoryProvider?.custom) {
        throw new Error('Custom method not available');
      }

      const response = await workflowHistoryProvider.custom({
        url: `/v0/workflow-runs/logs`,
        method: "get",
        query: {
          executionType: "TASK",
          traceId: record?.traceId,
          sourceId: taskId
        }
      });

      setTaskLogsData(prev => ({ ...prev, [key]: response?.data || [] }));
    } catch (error) {
      console.error('태스크 로그 로딩 실패:', error);
      setTaskLogsData(prev => ({ ...prev, [key]: [] }));
    } finally {
      setTaskLogsLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // 개발용 디버깅 로그 (필요시 주석 해제)
  // console.log("=== 디버깅 ===");
  // console.log("data:", data);
  // console.log("record:", record);
  // console.log("ioData:", ioData);
  

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

  // 데이터 크기 포맷팅
  const formatDataSize = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  // JSON 데이터 미리보기
  const formatDataPreview = (dataValue: string, maxLength = 100) => {
    if (!dataValue) return 'N/A';
    if (dataValue.length <= maxLength) return dataValue;
    return dataValue.substring(0, maxLength) + '...';
  };

  // JSON 데이터에서 data 속성 추출
  const extractDataFromJson = (dataValue: string) => {
    if (!dataValue) return dataValue;

    try {
      const parsed = JSON.parse(dataValue);
      if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        return JSON.stringify(parsed.data, null, 2);
      }
    } catch (error) {
      // JSON 파싱 실패 시 원본 반환
    }

    return dataValue;
  };

  // URL 감지 및 하이퍼링크 렌더링
  const renderDataWithLinks = (dataValue: string, isPreview = false) => {
    if (!dataValue) return 'N/A';

    // data 속성이 있으면 추출
    const extractedData = extractDataFromJson(dataValue);

    // 미리보기인 경우 길이 제한
    const displayValue = isPreview ? formatDataPreview(extractedData, 200) : extractedData;

    // JSON 내의 URL도 감지할 수 있도록 더 포괄적인 정규식 패턴
    const urlRegex = /(https?:\/\/[^\s\",\}]+)/g;

    // URL이 포함되어 있는지 확인
    const urlMatches = displayValue.match(urlRegex);

    if (!urlMatches) {
      // URL이 없으면 일반 텍스트로 표시
      return (
        <span style={{ fontSize: '12px', fontFamily: 'Monaco, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
          {displayValue}
        </span>
      );
    }

    // URL이 있으면 링크로 변환
    let lastIndex = 0;
    const elements = [];

    urlMatches.forEach((url, index) => {
      const urlStartIndex = displayValue.indexOf(url, lastIndex);

      // URL 이전의 텍스트
      if (urlStartIndex > lastIndex) {
        elements.push(
          <span
            key={`text-${index}`}
            style={{ fontSize: '12px', fontFamily: 'Monaco, Consolas, monospace' }}
          >
            {displayValue.substring(lastIndex, urlStartIndex)}
          </span>
        );
      }

      // URL 링크
      elements.push(
        <a
          key={`url-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#1890ff',
            textDecoration: 'underline',
            wordBreak: 'break-all',
            fontSize: '12px',
            fontFamily: 'Monaco, Consolas, monospace'
          }}
        >
          {url}
        </a>
      );

      lastIndex = urlStartIndex + url.length;
    });

    // 마지막 URL 이후의 텍스트
    if (lastIndex < displayValue.length) {
      elements.push(
        <span
          key="text-end"
          style={{ fontSize: '12px', fontFamily: 'Monaco, Consolas, monospace' }}
        >
          {displayValue.substring(lastIndex)}
        </span>
      );
    }

    return (
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {elements}
      </div>
    );
  };

  // 최신 OUTPUT 데이터 찾기
  const getLatestOutputData = () => {
    const outputData = ioData.filter(item => item.ioType === 'OUTPUT');
    if (outputData.length === 0) return null;

    // createdAt 기준으로 정렬하여 가장 최신 것 반환
    return outputData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };


  const renderTaskLogs = (taskRun: any) => {
    if (!taskRun) return null;

    const taskId = taskRun.id;
    const key = `task-${taskId}`;
    const taskLogs = taskLogsData[key] || [];
    const isLoading = taskLogsLoading[key] || false;

    return (
      <Card size="small" title="태스크 실행 로그" style={{ marginTop: 16 }}>
        <Spin spinning={isLoading}>
          {taskLogs.length > 0 ? (
          <div>
            <Alert
              message={`${taskLogs.length}개의 로그 엔트리`}
              type="info"
              style={{ marginBottom: 12 }}
              showIcon
            />

            {/* 미니 타임라인 */}
            <Timeline
              items={taskLogs.map((log: any, index: number) => ({
                key: index,
                color: getLogLevelColor(log.logLevel),
                children: (
                  <div style={{ marginBottom: 12 }}>
                    <Space size="small" wrap>
                      <Tag
                        color={getLogLevelColor(log.logLevel)}
                        style={{ color: 'white', fontSize: '11px' }}
                      >
                        {log.logLevel?.toUpperCase() || 'INFO'}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {formatDateTime(log.executedAt)}
                      </Text>
                    </Space>

                    <div style={{
                      marginTop: 4,
                      fontSize: '12px',
                      fontFamily: 'Monaco, Consolas, monospace',
                      whiteSpace: 'pre-wrap',
                      background: log.logLevel?.toLowerCase() === 'error' ? '#fff2f0' : 'transparent',
                      padding: log.logLevel?.toLowerCase() === 'error' ? '4px 8px' : '0',
                      borderRadius: '4px',
                      border: log.logLevel?.toLowerCase() === 'error' ? '1px solid #ffccc7' : 'none'
                    }}>
                      {log.logMessage || '로그 메시지가 없습니다.'}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
          ) : (
            !isLoading && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="해당 태스크의 실행 로그가 없습니다"
                style={{ margin: '20px 0' }}
              />
            )
          )}
        </Spin>
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

  // 실행 요약 탭 콘텐츠
  const renderExecutionSummary = () => {
    const latestOutput = getLatestOutputData();

    return (
      <>
        {/* 요약 정보 */}
        <Card title="실행 요약" style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {/* 워크플로우명 */}
            <div style={{ marginBottom: 12 }}>
              <Text
                strong
                style={{
                  fontSize: '16px',
                  color: '#1890ff',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (record?.workflowRun?.workflowId) {
                    go({
                      to: {
                        resource: "workflows_list",
                        action: "show",
                        id: record.workflowRun.workflowId,
                      },
                    });
                  }
                }}
              >
                {record?.workflowRun?.workflowName || "워크플로우"}
              </Text>
            </div>

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

        {/* 최신 실행 결과 (OUTPUT만) */}
        {latestOutput && (
          <Card title="최신 실행 결과" style={{ marginBottom: 16 }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="데이터 타입">
                <Tag color="blue">{latestOutput.dataType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="데이터 크기">
                {formatDataSize(latestOutput.dataSize)}
              </Descriptions.Item>
              <Descriptions.Item label="생성 시간" span={2}>
                {formatDateTime(latestOutput.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="데이터 미리보기" span={2}>
                <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                  {renderDataWithLinks(latestOutput.dataValue, true)}
                </Card>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

      </>
    );
  };

  // 실행 정보 탭 콘텐츠 (상세 Job/Task 정보)
  const renderExecutionInfo = () => {
    return (
      <>
        {/* 워크플로우 기본 정보 */}
        <Card title="워크플로우 정보" style={{ marginBottom: 16 }}>
          <Descriptions
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

            <Descriptions.Item label="상태">
              {getStatusTag(record?.workflowRun?.status)}
            </Descriptions.Item>

            <Descriptions.Item label="총 실행 시간">
              {formatDuration(record?.workflowRun?.durationMs)}
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

            <Descriptions.Item label="트리거 유형">
              <TextField value={record?.workflowRun?.triggerType || "-"} />
            </Descriptions.Item>

            <Descriptions.Item label="생성자 ID">
              <TextField value={record?.workflowRun?.createdBy || "-"} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Job별 실행 상황 */}
        <Card title="Job별 실행 상황" style={{ marginBottom: 16 }}>
          {record?.jobRuns?.map((jobRun: any) => (
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
                {jobRun.taskRuns?.map((taskRun: any) => (
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
                          onClick={async () => {
                            if (selectedStep === taskRun.id) {
                              // 접기
                              setSelectedStep(null);
                            } else {
                              // 로그 보기 - API 호출하고 펼치기
                              setSelectedStep(taskRun.id);
                              await fetchTaskLogs(taskRun);
                            }
                          }}
                        >
                          {selectedStep === taskRun.id ? "접기" : "로그 보기"}
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

                            {renderTaskLogs(taskRun)}
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
      </>
    );
  };

  // 로그 레벨별 색상 매핑
  const getLogLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return '#ff4d4f';
      case 'warn':
      case 'warning':
        return '#faad14';
      case 'info':
        return '#1890ff';
      case 'debug':
        return '#722ed1';
      default:
        return '#666666';
    }
  };

  // 로그 데이터 필터링
  const getFilteredLogs = () => {
    const logs = executionLogData?.data || [];
    return logs.filter((log: any) => {
      const matchesText = !logFilter ||
        log.logMessage?.toLowerCase().includes(logFilter.toLowerCase());

      const matchesLevel = logLevelFilter === 'all' ||
        log.logLevel?.toLowerCase() === logLevelFilter.toLowerCase();

      return matchesText && matchesLevel;
    });
  };

  // Execution Log 탭 콘텐츠
  const renderExecutionLog = () => (
    <div>
      {/* 로그 필터 컨트롤 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="로그 검색..."
            prefix={<SearchOutlined />}
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />

          <Select
            value={logLevelFilter}
            onChange={setLogLevelFilter}
            style={{ width: 120 }}
            prefix={<FilterOutlined />}
          >
            <Select.Option value="all">전체</Select.Option>
            <Select.Option value="error">Error</Select.Option>
            <Select.Option value="warn">Warning</Select.Option>
            <Select.Option value="info">Info</Select.Option>
            <Select.Option value="debug">Debug</Select.Option>
          </Select>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetchLogs()}
            loading={logLoading}
          >
            새로고침
          </Button>
        </Space>
      </Card>

      {/* 로그 목록 */}
      <Card>
        <Spin spinning={logLoading}>
          {executionLogData?.data?.length > 0 ? (
            <div>
              <Alert
                message={`총 ${executionLogData?.data?.length || 0}개의 로그 엔트리`}
                description={`필터링된 결과: ${getFilteredLogs().length}개`}
                type="info"
                style={{ marginBottom: 16 }}
                showIcon
              />

              <Timeline
                mode="left"
                items={getFilteredLogs().map((log: any, index: number) => ({
                  key: index,
                  color: getLogLevelColor(log.logLevel),
                  label: (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatDateTime(log.executedAt)}
                    </Text>
                  ),
                  children: (
                    <Card size="small" style={{ marginBottom: 8 }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space>
                          <Tag color={getLogLevelColor(log.logLevel)} style={{ color: 'white' }}>
                            {log.logLevel?.toUpperCase() || 'INFO'}
                          </Tag>
                        </Space>

                        <Text style={{
                          fontFamily: 'Monaco, Consolas, monospace',
                          fontSize: '13px',
                          whiteSpace: 'pre-wrap',
                          display: 'block'
                        }}>
                          {log.logMessage || '로그 메시지가 없습니다.'}
                        </Text>
                      </Space>
                    </Card>
                  ),
                }))}
              />
            </div>
          ) : (
            <Empty
              description="실행 로그가 없습니다"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              {!logLoading && (
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => refetchLogs()}
                >
                  다시 시도
                </Button>
              )}
            </Empty>
          )}
        </Spin>
      </Card>
    </div>
  );

  // I/O 데이터 탭 콘텐츠
  const renderIOData = () => {
    console.log("🎨 renderIOData 호출됨");
    console.log("현재 ioData:", ioData);
    console.log("현재 ioDataLoading:", ioDataLoading);
    console.log("ioData.length:", ioData.length);

    const columns = [
      {
        title: 'Task Run ID',
        dataIndex: 'taskRunId',
        key: 'taskRunId',
        width: 120,
      },
      {
        title: 'I/O 타입',
        dataIndex: 'ioType',
        key: 'ioType',
        width: 100,
        render: (type: string) => (
          <Badge
            color={type === 'INPUT' ? 'green' : 'blue'}
            text={type}
          />
        ),
      },
      {
        title: '이름',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: '데이터 타입',
        dataIndex: 'dataType',
        key: 'dataType',
        width: 100,
        render: (type: string) => <Tag color="purple">{type}</Tag>,
      },
      {
        title: '크기',
        dataIndex: 'dataSize',
        key: 'dataSize',
        width: 100,
        render: (size: number) => formatDataSize(size),
      },
      {
        title: '생성 시간',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
        render: (date: string) => formatDateTime(date),
      },
      {
        title: '액션',
        key: 'action',
        width: 100,
        render: (_: any, record: any) => (
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedIOData(record);
              setModalVisible(true);
            }}
          >
            보기
          </Button>
        ),
      },
    ];

    return (
      <div>
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTaskIOData}
              loading={ioDataLoading}
            >
              새로고침
            </Button>
            <Text type="secondary">
              총 {ioData.length}개의 I/O 데이터
            </Text>
          </Space>
        </Card>

        <Spin spinning={ioDataLoading}>
          {ioData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={ioData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `총 ${total}개`,
              }}
              size="small"
            />
          ) : (
            <Empty
              description="I/O 데이터가 없습니다"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              {!ioDataLoading && (
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchTaskIOData}
                >
                  데이터 로드
                </Button>
              )}
            </Empty>
          )}
        </Spin>

        {/* I/O 데이터 상세보기 모달 */}
        <Modal
          title="I/O 데이터 상세"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setSelectedIOData(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setModalVisible(false);
              setSelectedIOData(null);
            }}>
              닫기
            </Button>
          ]}
          width={800}
        >
          {selectedIOData && (
            <>
              <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Task Run ID">
                  {selectedIOData.taskRunId}
                </Descriptions.Item>
                <Descriptions.Item label="I/O 타입">
                  <Badge
                    color={selectedIOData.ioType === 'INPUT' ? 'green' : 'blue'}
                    text={selectedIOData.ioType}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="이름">
                  {selectedIOData.name}
                </Descriptions.Item>
                <Descriptions.Item label="데이터 타입">
                  <Tag color="purple">{selectedIOData.dataType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="데이터 크기">
                  {formatDataSize(selectedIOData.dataSize)}
                </Descriptions.Item>
                <Descriptions.Item label="생성 시간">
                  {formatDateTime(selectedIOData.createdAt)}
                </Descriptions.Item>
              </Descriptions>

              <Card size="small" title="데이터 내용" style={{ backgroundColor: '#fafafa' }}>
                <div style={{
                  padding: 12,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 6,
                  maxHeight: 400,
                  overflow: 'auto',
                  border: '1px solid #d9d9d9'
                }}>
                  {renderDataWithLinks(selectedIOData.dataValue)}
                </div>
              </Card>
            </>
          )}
        </Modal>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'execution-summary',
      label: '실행 요약',
      children: renderExecutionSummary(),
    },
    {
      key: 'execution-info',
      label: '상세 정보',
      children: renderExecutionInfo(),
    },
    {
      key: 'execution-log',
      label: 'Execution Log',
      children: renderExecutionLog(),
    },
    {
      key: 'io-data',
      label: 'I/O 데이터',
      children: renderIOData(),
    },
  ];

  return (
    <Show isLoading={isLoading}>
      <Tabs
        defaultActiveKey="execution-summary"
        items={tabItems}
      />
    </Show>
  );
};