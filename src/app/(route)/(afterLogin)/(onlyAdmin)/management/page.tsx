"use client";

import React from "react";
import { Button, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import useSWR from "swr";

import userList from "/tmp/data.json";
import { ExclamationCircleTwoTone } from "@ant-design/icons";
import { setCookie } from "cookies-next";
import toast from "react-hot-toast";

interface DataType {
  key: string;
  name: string;
  id: string;
  password: boolean;
  sheetId: string;
  isFetched: boolean;
}

const page = () => {
  const { data: accountInfo, isLoading } = useSWR("/api/getAccountInfo", () => {
    return fetch("/api/getAccountInfo").then((res) => res.json());
  });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
      render: (_, { name, isFetched }) => (
        <div className="relative">
          {!isFetched && (
            <div className="absolute left-1">
              <Tooltip title="로그인 정보가 사이트에 업데이트 되지 않았습니다. [데이터 업데이트] 버튼을 눌러주세요.">
                <ExclamationCircleTwoTone twoToneColor="#ff4d4f" />
              </Tooltip>
            </div>
          )}
          {name}
        </div>
      ),
    },
    {
      title: "아이디",
      dataIndex: "id",
      key: "id",
      // sorter: (a, b) => a.id.localeCompare(b.id),
      // showSorterTooltip: false,
    },
    {
      title: "비밀번호",
      key: "password",
      filters: [
        { text: "설정완료", value: true },
        { text: "미설정", value: false },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.password === value,
      dataIndex: "password",
      render: (_, { password }) => (!!password ? <Tag color="processing">설정완료</Tag> : <Tag color="error">미설정</Tag>),
    },
    {
      title: "시트",
      dataIndex: "sheetId",
      key: "sheetId",
      render: (text) => {
        if (!text) return "-";
        return (
          <a href={`https://docs.google.com/spreadsheets/d/${text}`} target="_blank">
            {"열기"}
          </a>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          className="!text-[12px]"
          size="small"
          disabled={!record.name || !record.id || !record.password || !record.sheetId}
          onClick={() => {
            const now = new Date();
            now.setTime(now.getTime() + 30 * 60 * 1000); // 30분

            setCookie("authToken", record.sheetId, {
              expires: now,
            });

            localStorage.setItem("u_name", record.name);
            window.location.href = "/";

            toast.success(`${record.name} 로그인 성공`);
          }}
        >
          로그인
        </Button>
      ),
    },
  ];

  const data: DataType[] = accountInfo
    ? accountInfo.map((item) => {
        const user = userList.find((user) => {
          return user.name === item.name;
        });
        return {
          key: item.id,
          name: item.name,
          id: item.id,
          password: item.password,
          sheetId: item.sheetId,
          isFetched: !user ? false : user?.id === item.id && user?.password === item.password && user?.sheetId === item.sheetId,
        };
      })
    : [];

  return (
    <div className="flex flex-col gap-3">
      <Tooltip title={data.filter((d) => !d.isFetched).length === 0 ? "데이터가 모두 업데이트 되었습니다." : ""}>
        <Button
          className="w-fit self-end"
          disabled={data.filter((d) => !d.isFetched).length === 0}
          onClick={async () => {
            if (window.confirm("데이터를 업데이트 하시겠습니까?\n(평균 소요 시간 : 75s)")) {
              const res = await fetch("https://api.vercel.com/v1/integrations/deploy/prj_jTZH866kxIK7Fgijib9QBneGVowe/XxxUHaGvQE", {
                method: "POST",
              });

              if (res.ok) {
                alert("배포가 시작되었습니다.");
              } else {
                alert("배포에 실패했습니다.");
              }
            }
          }}
        >
          데이터 업데이트
        </Button>
      </Tooltip>
      <Table<DataType> loading={isLoading} size="small" columns={columns.map((item) => ({ ...item, align: "center" }))} dataSource={data} pagination={false} />
    </div>
  );
};

export default page;
