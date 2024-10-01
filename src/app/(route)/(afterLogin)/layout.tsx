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
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Popover, theme } from "antd";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";

const { Header, Sider, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 1 * 60 * 60 * 1000, // 1시간
      }}
    >
      <Layout className="!min-h-screen h-max">
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
                    onClick: () => router.push("/weekly-schedule"),
                  },
                  {
                    key: "1-2",
                    label: "월간시간표",
                    onClick: () => router.push("/monthly-schedule"),
                  },
                ],
              },
              {
                key: "2",
                icon: <ScheduleOutlined />,
                label: "출결정보",
                onClick: () => router.push("/attendance"),
              },
              // {
              //   key: "3",
              //   icon: <EditOutlined />,
              //   label: "테스트 결과",
              //   children: [
              //     {
              //       key: "3-1",
              //       label: "국어",
              //       onClick: () => router.push("/test-results?subject=ko"),
              //     },
              //     {
              //       key: "3-2",
              //       label: "영어",
              //       onClick: () => router.push("/test-results?subject=en"),
              //     },
              //   ],
              // },
              // {
              //   key: "4",
              //   icon: <PieChartOutlined />,
              //   label: "월말평가",
              //   onClick: () => router.push("/monthly-evaluation"),
              // },
              // {
              //   key: "5",
              //   icon: <BookOutlined />,
              //   label: "자습교재 현황",
              //   onClick: () => router.push("/self-study-materials"),
              // },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="!py-0 !px-5 flex items-center justify-between"
            style={{ background: colorBgContainer }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-[16px]"
            />
            <div className="flex items-center gap-3">
              <div>송우진 님</div>
              <Popover
                content={
                  <div className="p-0">
                    <button
                      onClick={() => {}}
                      className="px-3 rounded-[4px] py-1 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                }
                // title="Title"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
              >
                <Avatar className="cursor-pointer" icon={<UserOutlined />} />
              </Popover>
            </div>
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
    </SWRConfig>
  );
};

export default RootLayout;
