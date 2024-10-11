"use client";

import { Segmented, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { SWRResponse } from "swr";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const daysLength = days.length;

enum LoadingType {
  DAY = "day_loading",
  SCHEDULE = "schedule_loading",
}

const loadingData = [
  Array.from({ length: 10 }).map((_, i) =>
    Array.from({ length: 7 }).map(() =>
      i % 2 === 0 ? LoadingType.DAY : LoadingType.SCHEDULE
    )
  ),
];

const tagColorsByText = {
  출석: "blue",
  결석: "red",
  지각: "gold",
  조퇴: "orange",
  휴강: "cyan",
  타학원: "purple",
};

export default function AttendanceCalendar({
  data,
  error,
  isLoading,
}: SWRResponse<any[], any, any> & { startRowIdx?: number }) {
  const [month, setMonth] = useState(0);

  if (error) return <div>Error: {error}</div>;
  return (
    <div className="h-full flex flex-col w-full gap-5">
      {isLoading ? (
        <div className="w-[184px] h-[32px] bg-[#efefef] rounded-[6px] animate-fade" />
      ) : (
        <Segmented
          className="w-fit"
          value={month}
          onChange={(v) => setMonth(v)}
          options={[
            { label: data[0].title, value: 0 },
            { label: data[1].title, value: 1 },
          ]}
        />
      )}
      <div className="text-center grid grid-cols-7 gap-x-1 row-span-5 gap-y-2">
        {days.map((d, index) => {
          const isSunday = index === 0;
          const isSaturday = index === daysLength - 1;
          return (
            <div
              className={`h-[30px] flex flex-col gap-1 ${
                isSunday ? "text-red-500" : isSaturday ? "text-blue-500" : ""
              }`}
            >
              {d}
            </div>
          );
        })}
        {(isLoading
          ? loadingData[month]
          : data[month].data.filter((_, i) => i % 3 !== 2)
        ).map((row: string[], rowIndex: number) => {
          const arr = row;

          return arr.map((cell, cellIndex) => {
            const isText = cell && !Number(cell);
            const isSunday = cellIndex === 0;
            const isSaturday = cellIndex === daysLength - 1;
            if (!isText)
              return (
                <div
                  className={`${
                    isSunday
                      ? "text-red-500"
                      : isSaturday
                      ? "text-blue-500"
                      : ""
                  }`}
                >
                  {cell}
                </div>
              );
            if (cell === LoadingType.DAY) {
              return (
                <div className="rounded-full bg-[#efefef] w-[24px] h-[24px] mx-auto animate-fade" />
              );
            }
            if (cell === LoadingType.SCHEDULE) {
              return (
                <div className="h-[40px] flex flex-col">
                  <Tag className="!m-0 !h-[20px] !border-none animate-fade" />
                </div>
              );
            }
            return (
              <div className="h-[40px] flex flex-col">
                <Tooltip
                  title={
                    rowIndex % 3 === 1
                      ? data[month].data[rowIndex + 1][cellIndex]
                      : ""
                  }
                >
                  <Tag className="!m-0" color={tagColorsByText[cell]}>
                    <div className="truncate">{cell}</div>
                  </Tag>
                </Tooltip>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
