import React from "react";
import { useGetIdentity,  } from "@refinedev/core";
import { Card, Avatar, Typography, Space, Descriptions, } from "antd";
import { Show, TextField, EmailField } from "@refinedev/antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
  status: string;
}

export const MyPage: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<User>();

  return (
    <Show
      title="마이페이지"
      isLoading={isLoading}
      canEdit={false}
      canDelete={false}
      resource="profile"
    >
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Title level={3}>{user?.name}</Title>
          </div>

          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">
              <TextField value={user?.id} />
            </Descriptions.Item>
            
            <Descriptions.Item label="이름">
              <TextField value={user?.name} />
            </Descriptions.Item>
            
            <Descriptions.Item label="이메일">
              <EmailField value={user?.email} />
            </Descriptions.Item>
            
            <Descriptions.Item label="역할">
              <TextField value={user?.roles?.length ? user.roles.join(", ") : "없음"} />
            </Descriptions.Item>
            
            <Descriptions.Item label="상태">
              <TextField value={user?.status} />
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
    </Show>
  );
};