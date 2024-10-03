"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Popover, theme } from "antd";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { useMediaQuery } from "react-responsive";
import { deleteCookie } from "cookies-next";
import toast from "react-hot-toast";

const { Header, Sider, Content } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery({
    query: "(max-width:480px)",
  });

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isMount = useRef(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isMount) setUsername(localStorage.getItem("u_name"));
  }, [isMount]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (collapsed) isMount.current = true;
  }, [collapsed]);

  const ref: any = useRef(null);
  // 영역 외 클릭 감지
  useEffect(() => {
    const handleOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target) && isMobile)
        setCollapsed(true);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [ref, isMobile]);

  const navigate = (url: string) => {
    router.push(url);
    if (isMobile && !collapsed) setCollapsed(true);
  };

  const logout = () => {
    toast.success("로그아웃 되었습니다.");
    // deleteCookie("authToken");
    document.cookie = "authToken=; Max-Age=0; path=/;";
    router.replace("/login");
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
        {!collapsed && isMount.current && (
          <div
            id="dim"
            className="hidden sm:block sm:w-full sm:h-full sm:bg-[#00000082] sm:z-10 sm:absolute"
          />
        )}
        <Sider
          ref={ref}
          breakpoint="sm"
          onBreakpoint={(broken) => {
            if (broken) setCollapsed(true);
            else setCollapsed(false);
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
          className={`sm:!fixed ${
            !isMount.current ? "sm:hidden" : ""
          }  sm:!left-0 !sm:top-0 sm:!h-full sm:z-20 sm:shadow-[2px_2px_10px_0#333]`}
        >
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
                    onClick: () => navigate("/weekly-schedule"),
                  },
                  {
                    key: "1-2",
                    label: "월간시간표",
                    onClick: () => navigate("/monthly-schedule"),
                  },
                ],
              },
              {
                key: "2",
                icon: <ScheduleOutlined />,
                label: "출결정보",
                onClick: () => navigate("/attendance"),
              },
              // {
              //   key: "3",
              //   icon: <EditOutlined />,
              //   label: "테스트 결과",
              //   children: [
              //     {
              //       key: "3-1",
              //       label: "국어",
              //       onClick: () => navigate("/test-results?subject=ko"),
              //     },
              //     {
              //       key: "3-2",
              //       label: "영어",
              //       onClick: () => navigate("/test-results?subject=en"),
              //     },
              //   ],
              // },
              // {
              //   key: "4",
              //   icon: <PieChartOutlined />,
              //   label: "월말평가",
              //   onClick: () => navigate("/monthly-evaluation"),
              // },
              // {
              //   key: "5",
              //   icon: <BookOutlined />,
              //   label: "자습교재 현황",
              //   onClick: () => navigate("/self-study-materials"),
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
              <div>{username} 님</div>
              <Popover
                content={
                  <div className="p-0">
                    <button
                      onClick={logout}
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
            className="sm:!mx-0 sm:!rounded-none sm:!my-3 sm:!px-3"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </SWRConfig>
  );
};

export default RootLayout;
