"use client";

import React, { useState } from "react";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import useSWR from "swr";

import userList from "/tmp/data.json";
import { ExclamationCircleTwoTone } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  id: string;
  password: boolean;
  sheet_id: string;
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
              <Tooltip title="로그인 정보가 사이트에 업데이트 되지 않았습니다. 관리자에게 문의하세요.">
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
      sorter: (a, b) => a.id.localeCompare(b.id),
      showSorterTooltip: false,
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
      dataIndex: "sheet_id",
      key: "sheet_id",
      render: (text) => <a>{"열기"}</a>,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button className="!text-[12px]" size="small" onClick={() => {}}>
          로그인
        </Button>
      ),
    },
  ];

  const data: DataType[] = accountInfo
    ? accountInfo.map((item) => ({
        key: item.id,
        name: item.name,
        id: item.id,
        password: item.password,
        sheet_id: item.sheet_id,
        isFetched: userList.find((user) => user.id === item.id),
      }))
    : [];

  return <Table<DataType> loading={isLoading} size="small" columns={columns.map((item) => ({ ...item, align: "center" }))} dataSource={data} />;
};

export default page;
