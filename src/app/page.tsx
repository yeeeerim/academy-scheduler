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

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="p-5">
          <img src="/images/logo/white_1.png" alt="logo" />
        </div>
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
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
