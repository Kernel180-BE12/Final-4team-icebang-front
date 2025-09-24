import { Create, useForm } from "@refinedev/antd";
import { 
  Form, 
  Input, 
  Switch, 
  Button, 
  Card, 
  Space, 
  Select, 
  Divider,
  Row,
  Col,
  Typography,
  Alert,
  Tooltip
} from "antd";
import { 
  PlusOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  SettingOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useState } from "react";
import type { IWorkflowBackendDto, IJob, ITask } from "../../types/workflow";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const WorkflowCreate = () => {
  const { formProps, saveButtonProps, form } = useForm<IWorkflowBackendDto>({
    redirect: "show",
  });

  // 스케줄 관리를 위한 상태

  type Schedule = {
    id: number;
    enabled: boolean;
    description: string;
    cronExpression: string;
    frequency?: "daily" | "weekly";
    time?: string;
    dayOfWeek?: number;
    minute?: number;
  };

// 상태 관리
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Job 관리를 위한 상태
  const [jobs, setJobs] = useState<IJob[]>([
    {
      id: "job1",
      type: "http",
      task: [
        {
          id: "task1",
          parameters: {
            url: "",
            method: "GET",
            headers: {},
            body: ""
          }
        }
      ]
    }
  ]);

  // Job 타입 옵션
  const jobTypeOptions = [
    { value: "http", label: "HTTP 요청" },
    { value: "email", label: "이메일 발송" },
    { value: "database", label: "데이터베이스 작업" },
    { value: "file", label: "파일 처리" },
    { value: "custom", label: "커스텀 작업" }
  ];

  // 스케줄 추가
  const addSchedule = () => {
    const newSchedule = {
      id: schedules.length,
      type: 'manual',
      enabled: false,
      description: '수동 실행',
      cronExpression: ''
    };
    
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    
    // Form의 schedules 필드 업데이트
    form.setFieldValue('schedules', updatedSchedules);
  };

  // 스케줄 삭제
  const removeSchedule = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
    
    // Form의 schedules 필드 업데이트
    form.setFieldValue('schedules', updatedSchedules);
  };

  // Job 추가
  const addJob = () => {
    const newJobId = `job${jobs.length + 1}`;
    const newJob: IJob = {
      id: newJobId,
      type: "http",
      task: [
        {
          id: "task1",
          parameters: {
            url: "",
            method: "GET",
            headers: {},
            body: ""
          }
        }
      ]
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    
    // Form의 config 필드 업데이트
    form.setFieldValue(['config', 'job'], updatedJobs);
  };

  // Job 삭제
  const removeJob = (index: number) => {
    if (jobs.length <= 1) return; // 최소 1개는 유지
    
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
    
    // Form의 config 필드 업데이트
    form.setFieldValue(['config', 'job'], updatedJobs);
  };

  // Job 타입 변경
  const updateJobType = (index: number, type: string) => {
    const updatedJobs = [...jobs];
    updatedJobs[index].type = type;
    
    // 타입에 따른 기본 Task 파라미터 설정
    const defaultParameters = getDefaultTaskParameters(type);
    updatedJobs[index].task[0].parameters = defaultParameters;
    
    setJobs(updatedJobs);
    form.setFieldValue(['config', 'job'], updatedJobs);
  };

  // Job 타입별 기본 Task 파라미터
  const getDefaultTaskParameters = (type: string) => {
    switch (type) {
      case "http":
        return {
          url: "",
          method: "GET",
          headers: {},
          body: ""
        };
      case "email":
        return {
          to: "",
          subject: "",
          content: "",
          template: ""
        };
      case "database":
        return {
          query: "",
          database: "",
          operation: "SELECT"
        };
      case "file":
        return {
          path: "",
          operation: "READ",
          encoding: "UTF-8"
        };
      case "custom":
        return {
          script: "",
          language: "javascript",
          timeout: 30000
        };
      default:
        return {};
    }
  };

  // Task 파라미터 업데이트
  const updateTaskParameters = (jobIndex: number, parameters: any) => {
    const updatedJobs = [...jobs];
    updatedJobs[jobIndex].task[0].parameters = parameters;
    
    setJobs(updatedJobs);
    form.setFieldValue(['config', 'job'], updatedJobs);
  };

  // 스케줄 설명과 크론 표현식 업데이트
  const updateScheduleDescription = (scheduleIndex: number) => {
    // 약간의 지연을 두어 폼 값이 업데이트된 후 실행
    setTimeout(() => {
      const executionCycle = form.getFieldValue(`executionCycle_${scheduleIndex}`);
      const executionTime = form.getFieldValue(`executionTime_${scheduleIndex}`);
      const executionDayOfWeek = form.getFieldValue(`executionDayOfWeek_${scheduleIndex}`);
      const executionHour = form.getFieldValue(`executionHour_${scheduleIndex}`);
      const executionMinute = form.getFieldValue(`executionMinute_${scheduleIndex}`);

      let description = '';
      let cronExpression = '';

      if (executionCycle === 'daily' && executionTime) {
        const hour = executionTime.padStart(2, '0');
        description = `매일 ${hour}:00에 실행`;
        cronExpression = `0 ${executionTime} * * *`;
      } else if (executionCycle === 'weekly' && executionDayOfWeek && executionHour && executionMinute) {
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const dayName = dayNames[parseInt(executionDayOfWeek)];
        const hourStr = String(executionHour).padStart(2, '0');
        const minuteStr = String(executionMinute).padStart(2, '0');
        
        description = `매주 ${dayName} ${hourStr}:${minuteStr}에 실행`;
        cronExpression = `${executionMinute} ${executionHour} * * ${executionDayOfWeek}`;
      }

      // 폼 값 업데이트
      if (description && cronExpression) {
        const currentSchedules = form.getFieldValue('schedules') || [];
        const updatedSchedules = [...currentSchedules];
        updatedSchedules[scheduleIndex] = {
          ...updatedSchedules[scheduleIndex],
          description: description,
          cronExpression: cronExpression
        };
        
        // 상태와 폼 값 동시 업데이트
        setSchedules(updatedSchedules);
        form.setFieldsValue({
          schedules: updatedSchedules
        });
      }
    }, 100);
  };

  // Job별 Task 파라미터 렌더링
  const renderTaskParameters = (job: IJob, jobIndex: number) => {
    const task = job.task[0]; // Task는 고정이므로 첫 번째만 사용
    
    switch (job.type) {
      case "http":
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="URL" required>
                  <Input
                    value={task.parameters.url}
                    onChange={(e) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      url: e.target.value
                    })}
                    placeholder="https://api.example.com/endpoint"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Method" required>
                  <Select
                    value={task.parameters.method}
                    onChange={(value) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      method: value
                    })}
                    options={[
                      { value: "GET", label: "GET" },
                      { value: "POST", label: "POST" },
                      { value: "PUT", label: "PUT" },
                      { value: "DELETE", label: "DELETE" }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Headers (JSON)">
              <TextArea
                value={JSON.stringify(task.parameters.headers, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      headers
                    });
                  } catch (error) {
                    // JSON 파싱 에러는 무시 (사용자가 입력 중일 수 있음)
                  }
                }}
                rows={3}
                placeholder='{"Content-Type": "application/json"}'
              />
            </Form.Item>
            <Form.Item label="Body">
              <TextArea
                value={task.parameters.body}
                onChange={(e) => updateTaskParameters(jobIndex, {
                  ...task.parameters,
                  body: e.target.value
                })}
                rows={4}
                placeholder="Request body content"
              />
            </Form.Item>
          </div>
        );

      case "email":
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="받는 사람" required>
                  <Input
                    value={task.parameters.to}
                    onChange={(e) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      to: e.target.value
                    })}
                    placeholder="recipient@example.com"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="템플릿">
                  <Input
                    value={task.parameters.template}
                    onChange={(e) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      template: e.target.value
                    })}
                    placeholder="email-template-name"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="제목" required>
              <Input
                value={task.parameters.subject}
                onChange={(e) => updateTaskParameters(jobIndex, {
                  ...task.parameters,
                  subject: e.target.value
                })}
                placeholder="이메일 제목"
              />
            </Form.Item>
            <Form.Item label="내용">
              <TextArea
                value={task.parameters.content}
                onChange={(e) => updateTaskParameters(jobIndex, {
                  ...task.parameters,
                  content: e.target.value
                })}
                rows={4}
                placeholder="이메일 내용"
              />
            </Form.Item>
          </div>
        );

      case "database":
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="데이터베이스" required>
                  <Input
                    value={task.parameters.database}
                    onChange={(e) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      database: e.target.value
                    })}
                    placeholder="database-name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="작업 유형" required>
                  <Select
                    value={task.parameters.operation}
                    onChange={(value) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      operation: value
                    })}
                    options={[
                      { value: "SELECT", label: "SELECT" },
                      { value: "INSERT", label: "INSERT" },
                      { value: "UPDATE", label: "UPDATE" },
                      { value: "DELETE", label: "DELETE" }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="쿼리" required>
              <TextArea
                value={task.parameters.query}
                onChange={(e) => updateTaskParameters(jobIndex, {
                  ...task.parameters,
                  query: e.target.value
                })}
                rows={4}
                placeholder="SELECT * FROM table_name WHERE condition = ?"
              />
            </Form.Item>
          </div>
        );

      case "file":
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="파일 경로" required>
                  <Input
                    value={task.parameters.path}
                    onChange={(e) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      path: e.target.value
                    })}
                    placeholder="/path/to/file.txt"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="작업 유형" required>
                  <Select
                    value={task.parameters.operation}
                    onChange={(value) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      operation: value
                    })}
                    options={[
                      { value: "READ", label: "읽기" },
                      { value: "WRITE", label: "쓰기" },
                      { value: "DELETE", label: "삭제" },
                      { value: "COPY", label: "복사" }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="인코딩">
              <Select
                value={task.parameters.encoding}
                onChange={(value) => updateTaskParameters(jobIndex, {
                  ...task.parameters,
                  encoding: value
                })}
                options={[
                  { value: "UTF-8", label: "UTF-8" },
                  { value: "UTF-16", label: "UTF-16" },
                  { value: "ASCII", label: "ASCII" }
                ]}
              />
            </Form.Item>
          </div>
        );

      case "custom":
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="언어" required>
                  <Select
                    value={task.parameters.language}
                    onChange={(value) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      language: value
                    })}
                    options={[
                      { value: "javascript", label: "JavaScript" },
                      { value: "python", label: "Python" },
                      { value: "shell", label: "Shell" },
                      { value: "groovy", label: "Groovy" }
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="타임아웃 (ms)">
                  <Input
                    type="number"
                    value={task.parameters.timeout}
                    onChange={(e) => updateTaskParameters(jobIndex, {
                      ...task.parameters,
                      timeout: parseInt(e.target.value) || 30000
                    })}
                    placeholder="30000"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="스크립트" required>
              <TextArea
                value={task.parameters.script}
                onChange={(e) => updateTaskParameters(jobIndex, {
                  ...task.parameters,
                  script: e.target.value
                })}
                rows={6}
                placeholder="// 실행할 스크립트를 입력하세요"
              />
            </Form.Item>
          </div>
        );

      default:
        return <div>선택된 Job 타입에 대한 설정이 없습니다.</div>;
    }
  };

  return (
    <Create 
      saveButtonProps={{
        ...saveButtonProps,
        onClick: () => {
          // 저장하기 전에 config와 schedules 필드 업데이트
          form.setFieldValue(['config', 'job'], jobs);
          form.setFieldValue('schedules', schedules);
          saveButtonProps.onClick?.({} as any);
        }
      }}
      title="새 워크플로우 생성"
    >
      <Form 
        {...formProps} 
        form={form}
        layout="vertical"
        initialValues={{
          enabled: true,
          searchPlatform: '',
          postingPlatform: '',
          postingBlogName: '',
          postingAccountId: '',
          postingAccountPw: '',
          schedules: schedules,
          config: {
            job: jobs
          }
        }}
      >
        {/* 기본 정보 */}
        <Card title="기본 정보" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="워크플로우 이름"
                name="name"
                rules={[
                  { required: true, message: "워크플로우 이름을 입력해주세요" },
                  { min: 2, message: "최소 2자 이상 입력해주세요" },
                  { max: 100, message: "최대 100자까지 입력 가능합니다" }
                ]}
              >
                <Input placeholder="워크플로우 이름을 입력하세요" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="활성 여부"
                name="enabled"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="활성"
                  unCheckedChildren="비활성"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="설명"
            name="description"
            rules={[
              { max: 500, message: "최대 500자까지 입력 가능합니다" }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="워크플로우에 대한 설명을 입력하세요"
            />
          </Form.Item>

          <Form.Item
            label="검색 플랫폼"
            name="searchPlatform"
            rules={[
              { required: true, message: "검색 플랫폼을 선택해주세요" }
            ]}
          >
            <Select
              placeholder="검색 플랫폼을 선택해주세요"
              options={[
                { value: "naver", label: "네이버 검색" },
                { value: "naver_store", label: "네이버 스토어" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="포스팅할 플랫폼"
            name="postingPlatform"
            rules={[
              { required: true, message: "포스팅할 플랫폼을 선택해주세요" }
            ]}
          >
            <Select
              placeholder="포스팅할 플랫폼을 선택하세요"
              options={[
                { value: "naver_blog", label: "네이버 블로그" },
                { value: "tstory_blog", label: "티스토리 블로그" },
                { value: "blogger", label: "구글 블로거" }
              ]}
              onChange={(value) => {
                // 티스토리가 아닌 다른 플랫폼 선택 시 블로그 이름 필드 초기화
                if (value !== 'tstory_blog') {
                  form.setFieldValue('postingBlogName', '');
                }
              }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="포스팅 계정 ID"
                name="postingAccountId"
                rules={[
                  { required: true, message: "포스팅 계정 ID를 입력해주세요" },
                  { min: 3, message: "최소 3자 이상 입력해주세요" },
                  { max: 50, message: "최대 50자까지 입력 가능합니다" }
                ]}
              >
                <Input 
                  placeholder="포스팅에 사용할 계정 ID를 입력하세요"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="포스팅 계정 PW"
                name="postingAccountPw"
                rules={[
                  { required: true, message: "포스팅 계정 비밀번호를 입력해주세요" },
                  { min: 6, message: "최소 6자 이상 입력해주세요" },
                  { max: 100, message: "최대 100자까지 입력 가능합니다" }
                ]}
              >
                <Input.Password 
                  placeholder="포스팅에 사용할 계정 비밀번호를 입력하세요"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 티스토리 선택 시에만 표시되는 블로그 이름 필드 */}
          <Form.Item shouldUpdate>
            {({ getFieldValue }) => {
              const postingPlatform = getFieldValue('postingPlatform');
              
              if (postingPlatform === 'tstory_blog') {
                return (
                  <Form.Item
                    label="포스팅 블로그 이름"
                    name="postingBlogName"
                    rules={[
                      { required: true, message: "포스팅 블로그 이름을 입력해주세요" },
                      { min: 2, message: "최소 2자 이상 입력해주세요" },
                      { max: 50, message: "최대 50자까지 입력 가능합니다" }
                    ]}
                  >
                    <Input 
                      placeholder="티스토리 블로그 이름을 입력하세요 (예: myblog)"
                    />
                  </Form.Item>
                );
              }
              
              return null;
            }}
          </Form.Item>
        </Card>

        {/* 스케줄 설정 */}
        <Card 
          title={
            <Space>
              <ClockCircleOutlined />
              스케줄 설정
              <Text type="secondary">({schedules.length}개 스케줄)</Text>
            </Space>
          }
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={addSchedule}
            >
              스케줄 추가
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          <Alert
            message="스케줄 정보"
            description="워크플로우의 실행 스케줄을 설정합니다. 스케줄 없이도 워크플로우를 저장할 수 있으며, 나중에 스케줄을 추가할 수 있습니다."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {schedules.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 0',
              color: '#8c8c8c',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px dashed #d9d9d9'
            }}>
              <ClockCircleOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
              <p>등록된 스케줄이 없습니다.</p>
              <p>스케줄 추가 버튼을 클릭하여 실행 스케줄을 설정해보세요.</p>
            </div>
          ) : (
            <Row gutter={16}>
              {schedules.map((schedule, scheduleIndex) => (
                <Col span={8} key={scheduleIndex} style={{ marginBottom: 16 }}>
                  <Card
                    type="inner"
                    title={
                      <Space>
                        <Text strong>스케줄 {scheduleIndex + 1}</Text>
                      </Space>
                    }
                    extra={
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => removeSchedule(scheduleIndex)}
                        size="small"
                      >
                        삭제
                      </Button>
                    }
                    style={{ height: '100%' }}
                  >
                    <Form.Item
                      label="스케줄 타입"
                      name={['schedules', scheduleIndex, 'type']}
                      rules={[{ required: true }]}
                      style={{ marginBottom: 12 }}
                    >
                      <Select
                        options={[
                          { value: 'manual', label: '수동 실행' },
                          { value: 'auto', label: '자동 실행' }
                        ]}
                        onChange={(value) => {
                          // 스케줄 타입 변경 시 관련 필드 초기화
                          const scheduleData = {
                            type: value,
                            enabled: form.getFieldValue(['schedules', scheduleIndex, 'enabled']) || false,
                            description: value === 'manual' ? '수동 실행' : '',
                            cronExpression: value === 'manual' ? '' : ''
                          };

                          const currentSchedules = form.getFieldValue('schedules') || [];
                          const updatedSchedules = [...currentSchedules];
                          updatedSchedules[scheduleIndex] = scheduleData;

                          form.setFieldsValue({
                            [`executionCycle_${scheduleIndex}`]: '',
                            [`executionTime_${scheduleIndex}`]: '',
                            [`executionDayOfWeek_${scheduleIndex}`]: '',
                            [`executionHour_${scheduleIndex}`]: '',
                            [`executionMinute_${scheduleIndex}`]: '',
                            schedules: updatedSchedules
                          });
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="활성화"
                      name={['schedules', scheduleIndex, 'enabled']}
                      valuePropName="checked"
                      style={{ marginBottom: 12 }}
                    >
                      <Switch 
                        checkedChildren="활성"
                        unCheckedChildren="비활성"
                      />
                    </Form.Item>

                    {/* 자동 실행 설정 (스케줄 타입이 auto일 때만 표시) */}
                    <Form.Item shouldUpdate>
                      {({ getFieldValue }) => {
                        const scheduleType = getFieldValue(['schedules', scheduleIndex, 'type']);

                        if (scheduleType === 'auto') {
                          return (
                            <>
                              <Form.Item
                                label="실행 주기"
                                name={`executionCycle_${scheduleIndex}`}
                                rules={[
                                  { required: true, message: "실행 주기를 선택해주세요" }
                                ]}
                                style={{ marginBottom: 12 }}
                              >
                                <Select
                                  placeholder="실행 주기"
                                  options={[
                                    { value: 'daily', label: '매일' },
                                    { value: 'weekly', label: '매주' }
                                  ]}
                                  onChange={(value) => {
                                    // 실행 주기 변경 시 관련 필드 초기화
                                    form.setFieldsValue({
                                      [`executionTime_${scheduleIndex}`]: '',
                                      [`executionDayOfWeek_${scheduleIndex}`]: '',
                                      [`executionHour_${scheduleIndex}`]: '',
                                      [`executionMinute_${scheduleIndex}`]: ''
                                    });

                                    // 스케줄 설명과 크론 표현식 업데이트
                                    updateScheduleDescription(scheduleIndex);
                                  }}
                                />
                              </Form.Item>

                              {/* 매일 실행 설정 */}
                              {getFieldValue(`executionCycle_${scheduleIndex}`) === 'daily' && (
                                <Form.Item
                                  label="실행 시간"
                                  name={`executionTime_${scheduleIndex}`}
                                  rules={[
                                    { required: true, message: "실행 시간을 선택해주세요" }
                                  ]}
                                  style={{ marginBottom: 12 }}
                                >
                                  <Select
                                    placeholder="시간 선택"
                                    options={Array.from({ length: 24 }, (_, i) => ({
                                      value: String(i).padStart(2, '0'),
                                      label: `${String(i).padStart(2, '0')}:00`
                                    }))}
                                    onChange={() => updateScheduleDescription(scheduleIndex)}
                                  />
                                </Form.Item>
                              )}

                              {/* 매주 실행 설정 */}
                              {getFieldValue(`executionCycle_${scheduleIndex}`) === 'weekly' && (
                                <>
                                  <Form.Item
                                    label="요일"
                                    name={`executionDayOfWeek_${scheduleIndex}`}
                                    rules={[
                                      { required: true, message: "요일을 선택해주세요" }
                                    ]}
                                    style={{ marginBottom: 12 }}
                                  >
                                    <Select
                                      placeholder="요일 선택"
                                      options={[
                                        { value: '0', label: '일요일' },
                                        { value: '1', label: '월요일' },
                                        { value: '2', label: '화요일' },
                                        { value: '3', label: '수요일' },
                                        { value: '4', label: '목요일' },
                                        { value: '5', label: '금요일' },
                                        { value: '6', label: '토요일' }
                                      ]}
                                      onChange={() => updateScheduleDescription(scheduleIndex)}
                                    />
                                  </Form.Item>

                                  <Row gutter={8}>
                                    <Col span={12}>
                                      <Form.Item
                                        label="시간"
                                        name={`executionHour_${scheduleIndex}`}
                                        rules={[
                                          { required: true, message: "시간을 선택해주세요" }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                      >
                                        <Select
                                          placeholder="시"
                                          options={Array.from({ length: 24 }, (_, i) => ({
                                            value: String(i),
                                            label: `${String(i).padStart(2, '0')}시`
                                          }))}
                                          onChange={() => updateScheduleDescription(scheduleIndex)}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item
                                        label="분"
                                        name={`executionMinute_${scheduleIndex}`}
                                        rules={[
                                          { required: true, message: "분을 선택해주세요" }
                                        ]}
                                        style={{ marginBottom: 12 }}
                                      >
                                        <Select
                                          placeholder="분"
                                          options={[
                                            { value: '0', label: '00분' },
                                            { value: '15', label: '15분' },
                                            { value: '30', label: '30분' },
                                            { value: '45', label: '45분' }
                                          ]}
                                          onChange={() => updateScheduleDescription(scheduleIndex)}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </>
                          );
                        }

                        return null;
                      }}
                    </Form.Item>
                    
                    <Form.Item shouldUpdate>
                      {({ getFieldValue }) => {
                        const scheduleType = getFieldValue(['schedules', scheduleIndex, 'type']);
                        
                        return (
                          <Form.Item
                            label="스케줄 설명"
                            name={['schedules', scheduleIndex, 'description']}
                            style={{ marginBottom: 0 }}
                          >
                            <Input 
                              placeholder={
                                scheduleType === 'manual' 
                                  ? "수동 실행" 
                                  : "자동으로 생성됩니다"
                              }
                              disabled={scheduleType === 'auto'}
                              value={
                                scheduleType === 'manual' 
                                  ? "수동 실행" 
                                  : getFieldValue(['schedules', scheduleIndex, 'description'])
                              }
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>

                    {/* Hidden field for cron expression */}
                    <Form.Item
                      name={['schedules', scheduleIndex, 'cronExpression']}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>

        {/* Job 설정 */}
        <Card 
          title={
            <Space>
              <SettingOutlined />
              Job 설정
              <Text type="secondary">({jobs.length}개 Job)</Text>
              <Text type="warning" style={{ fontSize: '12px' }}>🚧 준비중</Text>
            </Space>
          }
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={addJob}
              disabled
            >
              Job 추가
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          <Alert
            message="Job 구성 정보"
            description="Job 설정 기능은 현재 개발 중입니다. 곧 다양한 Job 타입과 설정 옵션을 제공할 예정입니다."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            {jobs.map((job, index) => (
              <Col span={12} key={index} style={{ marginBottom: 16 }}>
                <Card
                  type="inner"
                  title={
                    <Space>
                      <Text strong>{job.id}</Text>
                      <Text type="secondary">({job.type})</Text>
                    </Space>
                  }
                  extra={
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => removeJob(index)}
                      size="small"
                      disabled
                    >
                      삭제
                    </Button>
                  }
                  style={{ 
                    height: '100%',
                    opacity: 0.7,
                    pointerEvents: 'none'
                  }}
                >
                  <Form.Item
                    label="Job 타입"
                    required
                    style={{ marginBottom: 16 }}
                  >
                    <Select
                      value={job.type}
                      onChange={(value) => updateJobType(index, value)}
                      options={jobTypeOptions}
                      disabled
                    />
                  </Form.Item>

                  <Divider orientation="left" orientationMargin="0">
                    <Text type="secondary">Task 설정 (준비중)</Text>
                  </Divider>

                  <div style={{ opacity: 0.5 }}>
                    {renderTaskParameters(job, index)}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Hidden field for config */}
        <Form.Item name={['config', 'job']} hidden>
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};