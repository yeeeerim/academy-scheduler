import React from "react";
import { ChartProps, Pie } from "react-chartjs-2";

export default function PieChart({
  data,
  options,
}: Pick<ChartProps<"pie">, "data" | "options">) {
  return <Pie data={data} options={options} />;
}
