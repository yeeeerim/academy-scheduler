"use client";

import { Segmented } from "antd";
import React from "react";
import useSWR from "swr";

const page = () => {
  const { data, error, isLoading } = useSWR("/api/getMonthlyData", () =>
    fetch(`/api/getMonthlyData`).then(async (res) => {
      const { data } = await res.json();
      return data;
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full flex flex-col w-full gap-4">
      <Segmented className="w-fit" options={["1월 일정표", "2월 일정표"]} />
      <div className="text-center grid grid-cols-7 row-span-5">
        {data.map((row: string[], rowIndex: number) => {
          const arr = row;
          while (arr.length < 7) {
            arr.push("");
          }
          return arr.map((cell, cellIndex) => (
            <div className="h-[30px]" key={cellIndex}>
              {cell}
            </div>
          ));
        })}
      </div>
    </div>
  );
};

export default page;
