"use client";

import PieChart from "@/app/components/PieChart";
import { attendanceColorsByText } from "@/consts";
import { Segmented, theme } from "antd";
import { ChartData } from "chart.js";
import { groupBy } from "lodash";
import React, { useMemo, useState } from "react";
import useSWR from "swr";

const AttendanceStatisticsPage = () => {
  const [month, setMonth] = useState(0);
  const { token } = theme.useToken();

  const generateChartData = (data: string[][]) => {
    const dataGroupByText = groupBy(data.filter((_, i) => i % 3 === 1).flat());
    return Object.entries(dataGroupByText).reduce<ChartData<"pie">>(
      (acc, [k, arr]) => {
        if (k === "") {
          return acc;
        }
        return {
          labels: [...acc.labels, k],
          datasets: [
            {
              data: [...acc.datasets[0]?.data, arr.length],
              backgroundColor: [
                ...((acc.datasets[0]?.backgroundColor ?? []) as string[]),
                token[`${attendanceColorsByText[k]}-4`],
              ],
            },
          ],
        };
      },
      {
        labels: [],
        datasets: [{ data: [] }],
      }
    );
  };

  const { data, isLoading } = useSWR("/api/getAttendanceData", () =>
    fetch(`/api/getAttendanceData`).then(async (res) => {
      const { title1, data1, title2, data2 } = await res.json();
      const response = [
        {
          title: title1,
          data: data1,
        },
        {
          title: title2,
          data: data2,
        },
      ];

      return response;
    })
  );
  const chartDataList = useMemo(
    () =>
      data
        ? [generateChartData(data[0].data), generateChartData(data[1].data)]
        : undefined,
    [data]
  );

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
      {chartDataList ? (
        <PieChart id="attendance-statistics" data={chartDataList[month]} />
      ) : undefined}
    </div>
  );
};

export default AttendanceStatisticsPage;
