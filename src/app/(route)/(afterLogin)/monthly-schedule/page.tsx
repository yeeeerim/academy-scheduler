"use client";

import Calendar from "@/app/components/Calendar";
import React, { useState } from "react";
import useSWR from "swr";

const page = () => {
  const res = useSWR("/api/getMonthlyData", () =>
    fetch(`/api/getMonthlyData`).then(async (res) => {
      const { data, data2 } = await res.json();
      return [data, data2];
    })
  );

  return <Calendar {...res} />;
};
export default page;
