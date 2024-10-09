"use client";

import { Segmented, Tag } from "antd";
import React, { useState } from "react";
import useSWR from "swr";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const loadingData = [
  Array.from({ length: 22 }).map((_, i) =>
    i === 1
      ? days
      : Array.from({ length: 7 }).map(() =>
          i % 4 === 2 ? "day_loading" : "schedule_loading"
        )
  ),
];

const page = () => {
  const [month, setMonth] = useState(0);
  const { data, error, isLoading } = useSWR("/api/getMonthlyData", () =>
    fetch(`/api/getMonthlyData`).then(async (res) => {
      const { data, data2 } = await res.json();
      return [data, data2];
    })
  );
  if (error) return <div>Error: {error}</div>;

  const titles = isLoading ? undefined : [data[0][0][0], data[1][0][0]];

  return (
    <div className="h-full flex flex-col w-full gap-5">
      {titles ? (
        <Segmented
          className="w-fit"
          value={month}
          onChange={(v) => setMonth(v)}
          options={[
            { label: titles[0], value: 0 },
            { label: titles[1], value: 1 },
          ]}
        />
      ) : (
        <div className="w-[184px] h-[32px] bg-[#efefef] rounded-[6px] animate-fade" />
      )}
      <div className="text-center grid grid-cols-7 gap-x-1 row-span-5">
        {(isLoading ? loadingData : data)[month]
          .slice(1)
          .map((row: string[], rowIndex: number) => {
            const arr = row;
            while (arr.length < 7) {
              arr.push("");
            }
            return arr.map((cell, cellIndex) => {
              const isLoadingCell =
                cell === "day_loading" || cell === "schedule_loading";
              const isText = rowIndex > 0 && cell && !Number(cell);
              const isSunday = cellIndex === 0;
              const isSaturday = cellIndex === 6;
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
                    cell.split("\n").map((line, index) => {
                      if (line === "day_loading") {
                        return (
                          <div
                            key={index}
                            className="rounded-full bg-[#efefef] w-[24px] h-[24px] mx-auto animate-fade"
                          />
                        );
                      }
                      if (line === "schedule_loading") {
                        return (
                          <Tag
                            key={index}
                            className="!m-0 !h-[22px] !border-none animate-fade"
                          />
                        );
                      }
                      return (
                        <React.Fragment key={index}>
                          <Tag className="!m-0">
                            <div className="truncate">{line}</div>
                          </Tag>
                        </React.Fragment>
                      );
                    })
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

export default page;
