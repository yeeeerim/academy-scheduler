"use client";

import React from "react";
import useSWR from "swr";
import AttendanceCalendar from "./_component/AttendanceCalendar";

const AttendancePage = () => {
  const res = useSWR("/api/getAttendanceData", () =>
    fetch(`/api/getAttendanceData`).then(async (res) => {
      const { title1, data1, title2, data2 } = await res.json();
      const response = [
        {
          title: title1,
          data: data1,
        },
        { title: title2, data: data2 },
      ];

      return response;
    })
  );

  return <AttendanceCalendar {...res} />;
};

export default AttendancePage;
