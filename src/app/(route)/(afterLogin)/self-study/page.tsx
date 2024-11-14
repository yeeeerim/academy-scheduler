"use client";

import { Progress, Table, TableProps } from "antd";
import React from "react";
import useSWR from "swr";

interface DataType {
  name: string;
  progress: { completed: number; total: number };
  wrongAnswerNotes: string;
  wrongAnswers: { completed: number; total: number };
  comment: string;
}

const page = () => {
  const { data, error, isLoading } = useSWR("/api/getSelfStudyData", () =>
    fetch(`/api/getSelfStudyData`).then(async (res) => {
      return await res.json();
    })
  );

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "단원명",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "진행률",
      key: "progress",
      render: (_, { progress, wrongAnswers }) => (
        <div className="flex flex-col items-start !text-[12px]">
          <div className="flex items-center gap-2">
            <div>진도</div>
            <Progress className="!text-[12px]" percent={Math.round((progress.completed / progress.total) * 100)} steps={10} strokeColor="#6fb2dc" />
            <div className="text-gray-400">
              ({progress.completed} / {progress.total})
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>오답</div>
            <Progress className="!text-[12px]" percent={Math.round((wrongAnswers.completed / wrongAnswers.total) * 100)} steps={10} strokeColor="#dc6f6f" />
            <div className="text-gray-400">
              ({wrongAnswers.completed} / {wrongAnswers.total})
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "오답노트",
      dataIndex: "wrongAnswerNotes",
      key: "wrongAnswerNotes",
    },
    {
      title: "특이사항",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="w-[184px] h-[32px] bg-[#efefef] rounded-[6px] animate-fade" />
      ) : (
        <div className="w-fit border border-[#f0f0f0] divide-x flex [&>div]:px-2 [&>div]:py-1">
          <div className="bg-[#fafafa] font-semibold">과목</div>
          <div>{data?.subject}</div>
          <div className="bg-[#fafafa] font-semibold">레벨</div>
          <div>{data?.level}</div>
          <div className="bg-[#fafafa] font-semibold">담임</div>
          <div>{data?.teacher_name}</div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Table<DataType>
          loading={isLoading}
          size="small"
          bordered
          columns={columns.map((item) => ({ ...item, align: "center" }))}
          dataSource={data?.study_data}
          scroll={{ x: "max-content" }}
          footer={() => <div className="hidden sm:block">👉 가로로 스크롤하세요.</div>}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default page;
