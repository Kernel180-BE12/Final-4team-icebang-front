import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  theme,
  Typography,
  Button,
  notification,
} from "antd";
import React, { useContext, useState } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { WifiOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useToken } = theme;
const API_URL = import.meta.env.VITE_API_URL;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const [pingLoading, setPingLoading] = useState(false);

  const handlePing = async () => {
    setPingLoading(true);
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${API_URL}/ping`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        notification.success({
          message: "서버 연결 성공",
          description: `응답 시간: ${responseTime}ms`,
          duration: 3,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      notification.error({
        message: "서버 연결 실패",
        description: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        duration: 3,
      });
      console.log(error);
    } finally {
      setPingLoading(false);
    }
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Button
          type="default"
          icon={<WifiOutlined />}
          onClick={handlePing}
          loading={pingLoading}
          size="small"
        >
          Ping
        </Button>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Space style={{ marginLeft: "8px" }} size="middle">
          {user?.name && <Text strong>{user.name}</Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};