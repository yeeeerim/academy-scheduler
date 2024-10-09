"use client";

import React from "react";
import useSWR from "swr";
import Calendar from "@/app/components/Calendar";

const AttendancePage = () => {
  const res = useSWR("/api/getAttendanceData", () =>
    fetch(`/api/getAttendanceData`).then(async (res) => {
      const { data } = await res.json();
      return [data[0].values, data[1].values];
    })
  );

  return <Calendar {...res} startRowIdx={1} />;
};

export default AttendancePage;
