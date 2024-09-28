"use client";

import React, { useState } from "react";
import {
  BookOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  return (
    <Layout className="min-h-screen h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <a href="/">
          <img className="p-5" src="/images/logo/white_1.png" alt="logo" />
        </a>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <TableOutlined />,
              label: "시간표",
              children: [
                {
                  key: "1-1",
                  label: "주간시간표",
                },
                {
                  key: "1-2",
                  label: "월간시간표",
                },
              ],
            },
            {
              key: "2",
              icon: <ScheduleOutlined />,
              label: "출결정보",
              onClick: () => router.push("/attendance"),
            },
            {
              key: "3",
              icon: <EditOutlined />,
              label: "테스트 결과",
            },
            {
              key: "4",
              icon: <PieChartOutlined />,
              label: "월말평가",
            },
            {
              key: "5",
              icon: <BookOutlined />,
              label: "자습교재 현황",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
