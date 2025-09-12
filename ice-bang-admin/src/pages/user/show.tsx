import {
  DateField,
  Show,
  TextField,
  TagField,
} from "@refinedev/antd";
import { useShow, useMany } from "@refinedev/core";
import { Typography, Card, Row, Col, Space, Tag, Divider } from "antd";

const { Title } = Typography;

export const UserShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  // 조직 데이터 가져오기
  const { data: organizationData, isLoading: organizationIsLoading } = useMany({
    resource: "organizations",
    ids: record?.user_organizations?.map((uo: any) => uo.organization_id) || [],
    queryOptions: {
      enabled: !!record?.user_organizations,
    },
  });

  // 부서 데이터 가져오기
  const { data: departmentData, isLoading: departmentIsLoading } = useMany({
    resource: "departments",
    ids: record?.user_organizations?.map((uo: any) => uo.department_id) || [],
    queryOptions: {
      enabled: !!record?.user_organizations,
    },
  });

  // 직위 데이터 가져오기
  const { data: positionData, isLoading: positionIsLoading } = useMany({
    resource: "positions",
    ids: record?.user_organizations?.map((uo: any) => uo.position_id) || [],
    queryOptions: {
      enabled: !!record?.user_organizations,
    },
  });

  // 역할 데이터 가져오기
  const { data: roleData, isLoading: roleIsLoading } = useMany({
    resource: "roles",
    ids: record?.user_roles?.map((ur: any) => ur.role_id) || [],
    queryOptions: {
      enabled: !!record?.user_roles,
    },
  });

  // 상태 색상 매핑
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'default';
    }
  };

  // 상태 텍스트 매핑
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '활성';
      case 'INACTIVE':
        return '비활성';
      case 'PENDING':
        return '승인대기';
      default:
        return status;
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Card title="기본 정보" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Title level={5}>ID</Title>
            <TextField value={record?.id} />
          </Col>
          <Col span={8}>
            <Title level={5}>이름</Title>
            <TextField value={record?.name} />
          </Col>
          <Col span={8}>
            <Title level={5}>이메일</Title>
            <TextField value={record?.email} />
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <Title level={5}>상태</Title>
            <Tag color={getStatusColor(record?.status)}>
              {getStatusText(record?.status)}
            </Tag>
          </Col>
          <Col span={8}>
            <Title level={5}>생성일</Title>
            <DateField value={record?.created_at} />
          </Col>
          <Col span={8}>
            <Title level={5}>최종 수정일</Title>
            <DateField value={record?.updated_at} />
          </Col>
        </Row>
      </Card>

      <Card title="조직 정보" style={{ marginBottom: 16 }}>
        {record?.user_organizations?.map((uo: any, index: number) => (
          <div key={uo.id}>
            <Row gutter={16}>
              <Col span={6}>
                <Title level={5}>조직</Title>
                {organizationIsLoading ? (
                  "Loading..."
                ) : (
                  <TextField
                    value={organizationData?.data?.find((org) => org.id === uo.organization_id)?.name || "-"}
                  />
                )}
              </Col>
              <Col span={6}>
                <Title level={5}>부서</Title>
                {departmentIsLoading ? (
                  "Loading..."
                ) : (
                  <TextField
                    value={departmentData?.data?.find((dept) => dept.id === uo.department_id)?.name || "-"}
                  />
                )}
              </Col>
              <Col span={6}>
                <Title level={5}>직위</Title>
                {positionIsLoading ? (
                  "Loading..."
                ) : (
                  <TextField
                    value={positionData?.data?.find((pos) => pos.id === uo.position_id)?.title || "-"}
                  />
                )}
              </Col>
              <Col span={6}>
                <Title level={5}>사번</Title>
                <TextField value={uo.employee_number} />
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>조직 상태</Title>
                <Tag color={getStatusColor(uo.status)}>
                  {getStatusText(uo.status)}
                </Tag>
              </Col>
              <Col span={12}>
                <Title level={5}>조직 가입일</Title>
                <DateField value={uo.created_at} />
              </Col>
            </Row>
          </div>
        ))}
      </Card>

      <Card title="역할 정보">
        <Title level={5}>할당된 역할</Title>
        {record?.user_roles && record.user_roles.length > 0 ? (
          <Space wrap>
            {record.user_roles.map((ur: any) => {
              if (roleIsLoading) return <span key={ur.id}>Loading...</span>;

              const role = roleData?.data?.find((r) => r.id === ur.role_id);
              return role ? (
                <TagField
                  key={ur.id}
                  value={role.name}
                  color="blue"
                />
              ) : null;
            })}
          </Space>
        ) : (
          <TextField value="할당된 역할이 없습니다." />
        )}
      </Card>
    </Show>
  );
};
