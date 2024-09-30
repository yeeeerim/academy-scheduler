"use client";

import React, { useState } from "react";
import { Calendar, Segmented } from "antd";
import dayjs from "dayjs";

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs("2024-09-01"));

  const onMonthChange = (value: string) => {
    if (value === "9월") {
      setSelectedDate(dayjs("2024-09-01"));
    } else if (value === "10월") {
      setSelectedDate(dayjs("2024-10-01"));
    }
  };

  return (
    <div className="w-[400px] flex flex-col gap-5">
      <Segmented
        className="w-fit"
        value={`${selectedDate.month() + 1}월`}
        options={["9월", "10월"]}
        onChange={(value) => onMonthChange(value as string)}
      />
      <div className="">
        <Calendar
          fullscreen={false}
          value={selectedDate}
          headerRender={(value) => {
            return <h3 className="mb-3">{dayjs(value.value).format("M월")}</h3>;
          }}
          cellRender={(current, info) => {
            if (dayjs(current).isSame(dayjs("2024-09-02")))
              return (
                <div className="text-[10px] leading-4 text-red-700">
                  {"결석"}
                </div>
              );
            else return <div className="text-[10px] leading-4">{"출석"}</div>;
          }}
          onChange={(v) => setSelectedDate(v)}
          onPanelChange={(value) => setSelectedDate(value)}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
