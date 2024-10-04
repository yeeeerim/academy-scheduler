"use client";

import { CalendarTwoTone } from "@ant-design/icons";
import React from "react";
import useSWR from "swr";

const page = () => {
  const { data, error, isLoading } = useSWR("/api/getWeeklyData", () =>
    fetch(`/api/getWeeklyData`).then(async (res) => {
      const { data, mergedCells } = await res.json();
      return { values: data, mergedCells };
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-5">
      <h5 className="flex items-center gap-2">
        <CalendarTwoTone className="" />
        주간 시간표
      </h5>
      <SpreadsheetTable values={data.values} mergedCells={data.mergedCells} />
    </div>
  );
};

export default page;

interface MergeData {
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
}

const SpreadsheetTable = ({
  values,
  mergedCells,
}: {
  values: string[][];
  mergedCells: MergeData[];
}) => {
  const subjectColors = createSubjectColorMapping(values); // Create color mapping

  const isCellMerged = (row: number, col: number) => {
    return mergedCells.find(
      (merge) =>
        row >= merge.startRowIndex &&
        row < merge.endRowIndex &&
        col >= merge.startColumnIndex &&
        col < merge.endColumnIndex
    );
  };
  const getCellSpan = (row: number, col: number) => {
    const merge = mergedCells.find(
      (m) => m.startRowIndex === row && m.startColumnIndex === col
    );
    if (merge) {
      const rowspan = merge.endRowIndex - merge.startRowIndex;
      const colspan = merge.endColumnIndex - merge.startColumnIndex;
      return { rowspan, colspan };
    }
    return { rowspan: 1, colspan: 1 }; // Default to 1 if not merged
  };
  const columnCount = values[0]?.length || 0;
  return (
    <table className="text-center border border-gray-200 max-w-[700px]">
      <colgroup>
        <col style={{ width: `16%` }} />
        {Array.from({ length: columnCount - 1 }, (_, index) => (
          <col key={index} style={{ width: `12%` }} />
        ))}
      </colgroup>
      <tbody>
        {values.map((row, rIndex) => {
          const rowIndex = rIndex + 3;
          return (
            <tr key={rowIndex}>
              {row.map((cell, cIndex) => {
                const colIndex = cIndex + 1;
                const mergedCell = isCellMerged(rowIndex, colIndex);
                if (
                  mergedCell &&
                  (mergedCell.startRowIndex !== rowIndex ||
                    mergedCell.startColumnIndex !== colIndex)
                ) {
                  // Skip rendering if this cell is part of a merged range
                  return null;
                }

                const { rowspan, colspan } = getCellSpan(rowIndex, colIndex);
                const bgColor =
                  cIndex === 0 || rIndex === 0 || !cell
                    ? "#FFF"
                    : subjectColors[cell || ""] || ""; // Get the color for the subject

                return (
                  <td
                    key={colIndex}
                    rowSpan={rowspan}
                    colSpan={colspan}
                    style={{
                      height: rowspan * 24,
                    }}
                    className={`border-gray-200 px-1 py-1 text-[#333] ${
                      cIndex === 0 ? "text-[11px]" : "text-[12px]"
                    } ${cell ? "border" : "border-r"}`}
                  >
                    <div
                      className="rounded-[6px] h-full w-full flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: bgColor,
                      }}
                    >
                      {cell
                        ? cell.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              {index < row.length - 1 && <br />}{" "}
                              {/* Insert <br /> for line breaks */}
                            </React.Fragment>
                          ))
                        : ""}
                      {/* Display empty string if cell is undefined */}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const createSubjectColorMapping = (values: string[][]) => {
  const subjectColors: { [key: string]: string } = {};
  let colorIndex = 0;

  values.forEach((row, rIndex) => {
    row.forEach((subject, cIndex) => {
      if (cIndex === 0 || rIndex === 0 || !subject) return;
      if (!subjectColors[subject]) {
        // Only assign a color if it hasn't been assigned yet
        subjectColors[subject] = generateColor(colorIndex);
        colorIndex++;
      }
    });
  });

  return subjectColors;
};

// 30개
const colorPalette = [
  "#ffb3bbaa", // Pastel Pink
  "#FFE156aa", // Pastel Lemon
  "#FFDFBAaa", // Pastel Orange
  "#ffff76aa", // Pastel Yellow
  "#dbf3a3aa", // Pastel Olive
  "#BAE1FFaa", // Pastel Blue
  "#D8B4D0aa", // Pastel Lilac
  "#FFC3A0aa", // Pastel Coral
  "#FF9A8Daa", // Pastel Red Coral
  "#D4A5A5aa", // Pastel Dusty Rose
  "#9995a6aa", // Pastel Lavender
  "#FF8C94aa", // Pastel Salmon
  "#A0CED9aa", // Pastel Teal
  "#C7CEEAaa", // Pastel Periwinkle
  "#F5E3B3aa", // Pastel Cream
  "#C8D7F5aa", // Pastel Sky Blue
  "#F7B2B7aa", // Pastel Watermelon
  "#FFDDC1aa", // Pastel Peach
  "#D3C6E7aa", // Pastel Mauve
  "#E6B89Caa", // Pastel Tan
  "#B4C9E7aa", // Pastel Steel Blue
  "#F7D3B4aa", // Pastel Apricot
  "#F1A7A1aa", // Pastel Rose
  "#D1E8E4aa", // Pastel Seafoam
  "#EAB8D1aa", // Pastel Blush
  "#FFC9DEaa", // Pastel Flamingo
  "#B5EAD7aa", // Pastel Mint Green
  "#FFD6A5aa", // Pastel Light Apricot
  "#C4E17Faa", // Pastel Light Green
  "#B3B2D8aa", // Pastel Periwinkle
];

const generateColor = (index: number): string => {
  return colorPalette[index % colorPalette.length]; // Cycle through the color palette
};
