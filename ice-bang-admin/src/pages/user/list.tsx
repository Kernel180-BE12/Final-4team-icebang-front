import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  TagField,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany, useNavigation, CrudFilter } from "@refinedev/core";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space, Table, Tag, Card, Form, Row, Col } from "antd";

export const UserList = () => {
  const { tableProps, searchFormProps, filters, setFilters, setCurrent, setPageSize } = useTable({
    syncWithLocation: true,
    filters: {
      initial: [],
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { create, list } = useNavigation();

  // 조직 데이터 가져오기
  const { data: organizationData, isLoading: organizationIsLoading } = useMany({
    resource: "organizations",
    ids:
        tableProps?.dataSource
            ?.map((item) => item?.user_organizations?.[0]?.organization_id)
            .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  // 부서 데이터 가져오기
  const { data: departmentData, isLoading: departmentIsLoading } = useMany({
    resource: "departments",
    ids:
        tableProps?.dataSource
            ?.map((item) => item?.user_organizations?.[0]?.department_id)
            .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  // 직위 데이터 가져오기
  const { data: positionData, isLoading: positionIsLoading } = useMany({
    resource: "positions",
    ids:
        tableProps?.dataSource
            ?.map((item) => item?.user_organizations?.[0]?.position_id)
            .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  // 역할 데이터 가져오기
  const { data: roleData, isLoading: roleIsLoading } = useMany({
    resource: "roles",
    ids:
        tableProps?.dataSource
            ?.flatMap((item) => item?.user_roles?.map((ur: any) => ur.role_id))
            .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  // 상태 색상 매핑
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'LOCKED':
        return 'red';
      case 'DISABLED':
        return 'orange';
      case 'PENDING':
        return 'blue';
      default:
        return 'default';
    }
  };

  // 상태 텍스트 매핑
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '활성';
      case 'LOCKED':
        return '잠김';
      case 'DISABLED':
        return '비활성';
      case 'PENDING':
        return '승인대기';
      default:
        return status;
    }
  };

  // 검색 및 필터 처리
  const onSearch = (values: any) => {
    console.log('검색 함수 호출, 입력값:', values);
    
    const newFilters: CrudFilter[] = [];

    // 이름 검색
    if (values.name && values.name.trim() !== '') {
      newFilters.push({
        field: "name",
        operator: "contains",
        value: values.name.trim(),
      });
    }

    // 이메일 검색
    if (values.email && values.email.trim() !== '') {
      newFilters.push({
        field: "email",
        operator: "contains",
        value: values.email.trim(),
      });
    }

    // 상태 필터 - 빈 값이면 아예 필터 추가하지 않음
    if (values.status && values.status.trim() !== '') {
      newFilters.push({
        field: "status",
        operator: "eq",
        value: values.status,
      });
    }

    // 역할 필터 - 빈 값이면 아예 필터 추가하지 않음
    if (values.role && values.role.trim() !== '') {
      newFilters.push({
        field: "user_roles.role_id",
        operator: "eq",
        value: values.role,
      });
    }

    console.log('생성된 필터:', newFilters);
    setFilters(newFilters);
  };

  // 필터 초기화
  const onReset = () => {
    // 폼 필드를 "전체" 선택된 상태로 초기화
    searchFormProps.form?.setFieldsValue({
      name: '',
      email: '',
      status: '',
      role: ''
    });
    
    // 필터 완전 초기화
    setFilters([]);
  };

  return (
      <List headerButtons={() => null}>
        {/* 필터링 영역 */}
        <Card style={{ marginBottom: 16 }}>
          <Form
              {...searchFormProps}
              layout="vertical"
              onFinish={(values) => {
                console.log('Form onFinish 호출됨:', values);
                onSearch(values);
              }}
              initialValues={{
                name: '',
                email: '',
                status: '',
                role: ''
              }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                    label="이름"
                    name="name"
                >
                  <Input
                      placeholder="이름을 입력하세요"
                      allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                    label="이메일"
                    name="email"
                >
                  <Input
                      placeholder="이메일을 입력하세요"
                      allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                    label="상태"
                    name="status"
                >
                  <Select
                      placeholder="전체"
                      defaultValue=""
                      allowClear
                      options={[
                        { value: '', label: '전체' },
                        { value: 'ACTIVE', label: '활성' },
                        { value: 'LOCKED', label: '잠김' },
                        { value: 'DISABLED', label: '비활성' },
                        { value: 'PENDING', label: '승인대기' },
                      ]}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                    label="역할"
                    name="role"
                >
                  <Select
                      placeholder="전체"
                      defaultValue=""
                      allowClear
                      options={[
                        { value: '', label: '전체' },
                        { value: 'SUPER_ADMIN', label: '최고 관리자' },
                        { value: 'ORG_ADMIN', label: '조직 관리자' },
                        { value: 'AI_ENGINEER', label: 'AI 엔지니어' },
                        { value: 'DATA_SCIENTIST', label: '데이터 사이언티스트' },
                        { value: 'CONTENT_MANAGER', label: '콘텐츠 매니저' },
                        { value: 'WORKFLOW_ADMIN', label: '워크플로우 관리자' },
                        { value: 'USER', label: '일반 사용자' },
                      ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={onReset}>
                    초기화
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    검색
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Create 버튼 영역 - 필터와 테이블 사이 */}
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button
              type="primary"
              onClick={() => create("users")}
          >
            Create
          </Button>
        </div>

        {/* 테이블 영역 */}
        <Table {...tableProps} rowKey="id">
          <Table.Column
              dataIndex="id"
              title="ID"
              sorter={{ multiple: 1 }}
              width={80}
          />

          <Table.Column
              dataIndex="name"
              title="이름"
              width={120}
          />

          <Table.Column
              dataIndex="email"
              title="이메일"
              width={200}
          />

          <Table.Column
              dataIndex={["user_organizations", 0, "organization_id"]}
              title="조직"
              width={120}
              render={(value) =>
                  organizationIsLoading ? (
                      "Loading..."
                  ) : (
                      organizationData?.data?.find((item) => item.id === value)?.name || "-"
                  )
              }
          />

          <Table.Column
              dataIndex={["user_organizations", 0, "position_id"]}
              title="직위"
              width={100}
              render={(value) =>
                  positionIsLoading ? (
                      "Loading..."
                  ) : (
                      positionData?.data?.find((item) => item.id === value)?.title || "-"
                  )
              }
          />

          <Table.Column
              dataIndex={["user_organizations", 0, "department_id"]}
              title="부서"
              width={120}
              render={(value) =>
                  departmentIsLoading ? (
                      "Loading..."
                  ) : (
                      departmentData?.data?.find((item) => item.id === value)?.name || "-"
                  )
              }
          />

          <Table.Column
              dataIndex="status"
              title="상태"
              width={100}
              render={(value: string) => (
                  <Tag color={getStatusColor(value)}>
                    {getStatusText(value)}
                  </Tag>
              )}
          />

          <Table.Column
              dataIndex="user_roles"
              title="역할"
              width={150}
              render={(userRoles: any[]) => {
                if (!userRoles || userRoles.length === 0) return "-";

                if (roleIsLoading) return "Loading...";

                return (
                    <Space wrap>
                      {userRoles.slice(0, 2).map((ur: any) => {
                        const role = roleData?.data?.find((r) => r.id === ur.role_id);
                        return role ? (
                            <TagField key={ur.id} value={role.name} color="blue" />
                        ) : null;
                      })}
                      {userRoles.length > 2 && (
                          <Tag color="default">+{userRoles.length - 2}</Tag>
                      )}
                    </Space>
                );
              }}
          />

          <Table.Column
              dataIndex="created_at"
              title="생성일"
              width={120}
              render={(value: any) => <DateField value={value} format="YYYY.MM.DD" />}
              sorter={{ multiple: 2 }}
          />

          <Table.Column
              dataIndex="updated_at"
              title="업데이트일"
              width={120}
              render={(value: any) => <DateField value={value} format="YYYY.MM.DD" />}
              sorter={{ multiple: 3 }}
          />

          <Table.Column
              title="Action"
              dataIndex="actions"
              width={120}
              fixed="right"
              render={(_, record: BaseRecord) => (
                  <Space size="small">
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <ShowButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                        confirmTitle="사용자를 삭제하시겠습니까?"
                        confirmOkText="삭제하기"
                        confirmCancelText="취소"
                    />
                  </Space>
              )}
          />
        </Table>
      </List>
  );
};
