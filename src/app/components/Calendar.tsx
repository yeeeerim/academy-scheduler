import { Segmented, Tag } from "antd";
import React, { useState } from "react";
import { SWRResponse } from "swr";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const daysLength = days.length;

enum LoadingType {
  DAY = "day_loading",
  SCHEDULE = "schedule_loading",
}

const loadingData = [
  Array.from({ length: 22 }).map((_, i) =>
    i === 1
      ? days
      : Array.from({ length: 7 }).map(() =>
          i % 4 === 2 ? LoadingType.DAY : LoadingType.SCHEDULE
        )
  ),
];

const tagColorsByText = {
  출석: "processing",
  결석: "error",
  지각: "warning",
};

export default function Calendar({
  data,
  error,
  isLoading,
  startRowIdx = 0,
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
            { label: data[0][0][0], value: 0 },
            { label: data[1][0][0], value: 1 },
          ]}
        />
      )}
      <div className="text-center grid grid-cols-7 gap-x-1 row-span-5">
        {(isLoading ? loadingData : data)[month]
          .slice(1)
          .map((row: string[], rowIndex: number) => {
            const arr = row.slice(isLoading ? 0 : startRowIdx);
            while (arr.length < daysLength) {
              arr.push("");
            }
            return arr.map((cell, cellIndex) => {
              const isText = rowIndex > 0 && cell && !Number(cell);
              const isSunday = cellIndex === 0;
              const isSaturday = cellIndex === daysLength - 1;
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
                      if (line === LoadingType.DAY) {
                        return (
                          <div
                            key={index}
                            className="rounded-full bg-[#efefef] w-[24px] h-[24px] mx-auto animate-fade"
                          />
                        );
                      }
                      if (line === LoadingType.SCHEDULE) {
                        return (
                          <Tag
                            key={index}
                            className="!m-0 !h-[22px] !border-none animate-fade"
                          />
                        );
                      }
                      return (
                        <React.Fragment key={index}>
                          <Tag className="!m-0" color={tagColorsByText[line]}>
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
}
