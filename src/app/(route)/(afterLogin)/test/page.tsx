"use client";

import { Table, Tag, Space, TableProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import React from "react";

import "dayjs/locale/ko"; // 한국어 로케일을 불러옴

// 로케일 설정
dayjs.locale("ko");

interface DataType {
  id: number; // 차시
  testDate: Dayjs; // 응시일
  count: number; // 문항수
  correct: number; // 정답수
  correctRate: number; // 정답률
  isCheck: boolean; // 오답 점검
  isParticipant: boolean; // 응시
  reason: string[]; // 미응시 사유
}

const Dummy: DataType[] = [
  {
    id: 1,
    testDate: dayjs("2024-01-08"),
    count: 42,
    correct: 39,
    correctRate: 93,
    isCheck: true,
    isParticipant: true,
    reason: [],
  },
  {
    id: 2,
    testDate: dayjs("2024-01-08"),
    count: 42,
    correct: 39,
    correctRate: 93,
    isCheck: true,
    isParticipant: true,
    reason: [],
  },
  {
    id: 3,
    testDate: dayjs("2024-01-08"),
    count: 42,
    correct: 0,
    correctRate: 0,
    isCheck: false,
    isParticipant: false,
    reason: ["결석", "컨디션 저조"],
  },
];

const page = () => {
  const params = useSearchParams();
  const subject = params.get("subject");
  const title = subject === "ko" ? "국어" : "영어";

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "차시",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "응시일",
      dataIndex: "testDate",
      key: "testDate",
      render: (text: Dayjs) => <div>{text.format("MM/DD (ddd)")}</div>,
    },
    {
      title: "문항수",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "정답수",
      dataIndex: "correct",
      key: "correct",
    },
    {
      title: "정답률",
      key: "correctRate",
      dataIndex: "correctRate",
      render: (text) => <div>{`${text}%`}</div>,
    },
    {
      title: "오답 점검",
      key: "isCheck",
      dataIndex: "isCheck",
      render: (isCheck) => <div>{isCheck ? "완료" : "미완료"}</div>,
    },
    {
      title: "응시",
      key: "isParticipant",
      dataIndex: "isParticipant",
      render: (isParticipant) => <div>{isParticipant ? "응시" : "미응시"}</div>,
    },
    {
      title: "미응시 사유",
      key: "reason",
      dataIndex: "reason",
      render: (reason: string[]) => (
        <div>{reason.length > 0 ? `${reason[0]} (${reason[1]})` : ""}</div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 text-center">
      <h3>{title} 어휘 테스트 결과</h3>
      <Table<DataType>
        columns={columns.map((c) => ({ ...c, align: "center" }))}
        dataSource={Dummy}
      />
    </div>
  );
};

export default page;
