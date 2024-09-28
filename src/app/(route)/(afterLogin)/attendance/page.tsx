"use client";

import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";

const AttendancePage = () => {
  return (
    <div className="w-[400px]">
      <Calendar
        fullscreen={false}
        headerRender={(value) => {
          return <h3 className="mb-3">{dayjs(value.value).format("M월")}</h3>;
        }}
        cellRender={(current, info) => {
          if (dayjs(current).isSame(dayjs("2024-09-02")))
            return <div>{"출석"}</div>;
          else return null;
        }}
        validRange={[dayjs("2024-09-01"), dayjs("2024-10-31")]}
      />
    </div>
  );
};

export default AttendancePage;
