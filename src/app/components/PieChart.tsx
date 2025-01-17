import { merge } from "lodash";
import React from "react";
import { ChartProps, Pie } from "react-chartjs-2";
import { htmlLegendPlugin } from "../plugins/htmlLegendPlugin";

export default function PieChart({
  id,
  data,
  options,
  unit,
}: Pick<ChartProps<"pie">, "data" | "options"> & {
  id: string;
  unit?: string;
}) {
  return (
    <div className="w-[40%]">
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
                unit,
              },
            },
          },
          options
        )}
        plugins={[htmlLegendPlugin]}
      />
      <div id={id} className="flex items-center justify-center text-[10px]" />
    </div>
  );
}
