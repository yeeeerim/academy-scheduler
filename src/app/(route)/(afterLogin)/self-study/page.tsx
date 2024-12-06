"use client";

import { Descriptions, Progress, Table, TableProps, Tag, Tooltip } from "antd";
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
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-md p-6 sm:!rounded-none sm:py-3 sm:px-0">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="w-[184px] h-[32px] bg-[#efefef] rounded-[6px] animate-fade sm:mx-3" />
          ) : (
            <Descriptions
              title={`${data?.subject}`}
              items={[
                { key: "level", label: "레벨", children: data?.level },
                { key: "teacher", label: "담임", children: data?.teacher_name },
              ]}
              column={10}
              className="[&_.ant-descriptions-header]:!mb-2"
            />
          )}

          <div className="flex flex-col gap-2">
            <Table<DataType>
              loading={isLoading}
              size="small"
              bordered
              columns={columns.map((item) => ({ ...item, align: "center" }))}
              dataSource={data?.study_data.map((item, index) => ({ ...item, key: index }))}
              scroll={{ x: "max-content" }}
              footer={() => <div className="hidden sm:block">👉 가로로 스크롤하세요.</div>}
              pagination={false}
            />
          </div>
        </div>
      </div>
      <h5 className="flex items-center gap-2 font-bold pl-1 sm:pl-3 sm:text-[16px]">종합 진도</h5>
      <div className="bg-white rounded-md px-6 py-4 sm:!rounded-none">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            <Tag className="w-fit" color="geekblue">
              진도 수행률
            </Tag>

            <Tooltip
              placement="right"
              title={
                data
                  ? `(${data?.study_data.reduce((acc, cur) => acc + cur.progress.completed, 0)} / ${data?.study_data.reduce(
                      (acc, cur) => acc + cur.progress.total,
                      0
                    )})`
                  : ""
              }
            >
              <Progress
                type="circle"
                percent={Math.round(
                  (data?.study_data.reduce((acc, cur) => acc + cur.progress.completed, 0) /
                    data?.study_data.reduce((acc, cur) => acc + cur.progress.total, 0)) *
                    100
                )}
                strokeColor="#6fb2dc"
              />
            </Tooltip>
          </div>
          <div className="flex flex-col gap-3">
            <Tag className="w-fit" color="red">
              오답률
            </Tag>
            <Tooltip
              placement="right"
              title={
                data
                  ? `(${data?.study_data.reduce((acc, cur) => acc + cur.wrongAnswers.completed, 0)} / ${data?.study_data.reduce(
                      (acc, cur) => acc + cur.wrongAnswers.total,
                      0
                    )})`
                  : ""
              }
            >
              <Progress
                type="circle"
                percent={Math.round(
                  (data?.study_data.reduce((acc, cur) => acc + cur.wrongAnswers.completed, 0) /
                    data?.study_data.reduce((acc, cur) => acc + cur.wrongAnswers.total, 0)) *
                    100
                )}
                strokeColor="#dc6f6f"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
