"use client";

import React, { useState } from "react";
import { Calendar, Segmented, Tag } from "antd";
import dayjs from "dayjs";
import { CheckCircleOutlined, ScheduleTwoTone } from "@ant-design/icons";
import useSWR from "swr";

const AttendancePage = () => {
  const [month, setMonth] = useState(0);

  const { data, error, isLoading } = useSWR("/api/getAttendanceData", () =>
    fetch(`/api/getAttendanceData`).then(async (res) => {
      const { data } = await res.json();
      return [data[0].values, data[1].values];
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const titles = [data[0][0][0], data[1][0][0]];

  return (
    <div className="w-[400px] max-w-[90vw] flex flex-col gap-5">
      <h5 className="flex items-center gap-2">
        <ScheduleTwoTone />
        출결정보
      </h5>
      <Segmented
        className="w-fit"
        value={month}
        options={[
          { label: titles[0], value: 0 },
          { label: titles[1], value: 1 },
        ]}
        onChange={(v) => setMonth(v)}
      />
      <div className="text-center grid grid-cols-7 gap-x-1 row-span-5">
        {data[month].slice(1).map((row: string[], rowIndex: number) => {
          const arr = row;
          while (arr.length < 8) {
            arr.push("");
          }
          return arr.map((cell, cellIndex) => {
            if (cellIndex === 0) return null;
            const isText = rowIndex > 0 && cell && !Number(cell);
            const isSunday = cellIndex === 1;
            const isSaturday = cellIndex === 7;
            return (
              <div
                className={`h-[30px] flex flex-col gap-1 ${
                  isText
                    ? ""
                    : isSunday
                    ? "text-red-500"
                    : isSaturday
                    ? "text-blue-500"
                    : ""
                }`}
                key={cellIndex}
              >
                {isText ? (
                  cell.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      <Tag
                        color={
                          line === "출석"
                            ? "processing"
                            : line === "결석"
                            ? "error"
                            : line === "지각"
                            ? "warning"
                            : ""
                        }
                        className="!m-0"
                      >
                        <div className="truncate">{line}</div>
                      </Tag>
                    </React.Fragment>
                  ))
                ) : (
                  <>{cell}</>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default AttendancePage;
