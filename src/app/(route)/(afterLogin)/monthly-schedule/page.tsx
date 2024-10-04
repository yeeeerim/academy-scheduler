"use client";

import { CalendarTwoTone } from "@ant-design/icons";
import { Segmented, Tag } from "antd";
import React, { useState } from "react";
import useSWR from "swr";

const page = () => {
  const [month, setMonth] = useState(0);
  const { data, error, isLoading } = useSWR(
    "/api/getMonthlyData",
    () =>
      fetch(`/api/getMonthlyData`).then(async (res) => {
        const { data, data2 } = await res.json();
        return [data, data2];
      }),
    {
      refreshInterval: 60000, // Revalidate every 60 seconds
      revalidateOnFocus: true, // Revalidate when the window regains focus
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const titles = [data[0][0][0], data[1][0][0]];

  return (
    <div className="h-full flex flex-col w-full gap-5">
      <h5 className="flex items-center gap-2">
        <CalendarTwoTone className="" />
        월간 시간표
      </h5>
      <Segmented
        className="w-fit"
        value={month}
        onChange={(v) => setMonth(v)}
        options={[
          { label: titles[0], value: 0 },
          { label: titles[1], value: 1 },
        ]}
      />
      <div className="text-center grid grid-cols-7 gap-x-1 row-span-5">
        {data[month].slice(1).map((row: string[], rowIndex: number) => {
          const arr = row;
          while (arr.length < 7) {
            arr.push("");
          }
          return arr.map((cell, cellIndex) => {
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
                  cell.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      <Tag className="!m-0">
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

export default page;
