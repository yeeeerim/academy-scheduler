"use client";

import React, { useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import useSWR from "swr";

const page = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { data: accountInfo, isLoading } = useSWR("/api/getAccountInfo", () => {
    return fetch("/api/getAccountInfo").then((res) => res.json());
  });

  const actions: React.ReactNode[] = [
    <button type="button" onClick={() => {}}>
      로그인
    </button>,
  ];

  interface DataType {
    key: string;
    name: string;
    id: string;
    password: boolean;
    sheet_id: string;
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
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
      render: (text) => <a>{"새 탭으로 열기"}</a>,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button>로그인</button>
        </Space>
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
      }))
    : [];

  return <Table<DataType> size="small" columns={columns.map((item) => ({ ...item, align: "center" }))} dataSource={data} />;
};

export default page;
