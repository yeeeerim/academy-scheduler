import { merge } from "lodash";
import React from "react";
import { ChartProps, Pie } from "react-chartjs-2";
import { htmlLegendPlugin } from "../plugins/htmlLegendPlugin";

export default function PieChart({
  id,
  data,
  options,
}: Pick<ChartProps<"pie">, "data" | "options"> & { id: string }) {
  return (
    <div>
      <Pie
        data={data}
        options={merge(
          {
            plugins: {
              legend: {
                display: false,
              },
              htmlLegend: {
                containerID: id,
              },
            },
          },
          options
        )}
        plugins={[htmlLegendPlugin]}
      />
      <div id={id} className="flex items-center justify-center" />
    </div>
  );
}
