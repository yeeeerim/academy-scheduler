"use client";

import React from "react";
import useSWR from "swr";

const page = () => {
  const { data, error, isLoading } = useSWR("/api/getWeeklyData", () =>
    fetch(`/api/getWeeklyData`).then(async (res) => {
      const { data, mergedCells } = await res.json();
      return { values: data, mergedCells };
    })
  );

  if (error) return <div>Error: {error}</div>;
  return (
    <SpreadsheetTable
      {...(isLoading ? loadingData : data)}
      subjectColors={
        isLoading ? loadingColors : createSubjectColorMapping(data.values)
      }
    />
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
  subjectColors,
}: {
  values: string[][];
  mergedCells: MergeData[];
  subjectColors: Colors;
}) => {
  const today = new Date().getDay();

  const DAY_LIST = ["", "월", "화", "수", "목", "금", "토", "일"];

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
    <table className="text-center w-full max-w-full">
      <colgroup>
        <col style={{ width: `16%` }} />
        {Array.from({ length: columnCount - 1 }, (_, index) => (
          <col key={index} style={{ width: `12%` }} />
        ))}
      </colgroup>
      <thead>
        <tr className="[&>th]:py-2 border-b border-gray-100 divide-x divide-gray-100">
          {DAY_LIST.map((day, index) => (
            <th key={index}>
              <div
                className={`w-fit px-2 mx-auto rounded-full  ${
                  index % 7 === today
                    ? "text-blue-500 bg-blue-50"
                    : "text-gray-500"
                }`}
              >
                {day}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((row, rIndex) => {
          if (rIndex === 0) return;
          const rowIndex = rIndex + 3;
          return (
            <tr
              key={rowIndex}
              // className={`${rIndex === 0 ? "font-bold" : "font-normal"}`}
            >
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

                const isLoadingCell =
                  cell === LoadingType.TIME || cell === LoadingType.SUBJECT;
                const { rowspan, colspan } = getCellSpan(rowIndex, colIndex);
                const bgColor =
                  (!isLoadingCell && cIndex === 0) || rIndex === 0 || !cell
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
                    className={`border-gray-100 px-1 py-1 text-[#333] ${
                      cIndex === 0 ? "text-[11px]" : "text-[12px] font-medium"
                    } ${cell ? "border" : "border-r"}
                    ${colIndex === 1 && "!border-l-0"}
                    ${colIndex === 8 && "!border-r-0"}`}
                  >
                    <div
                      className={`rounded-[6px] h-full w-full flex flex-col items-center justify-center ${
                        isLoadingCell ? "animate-fade" : ""
                      }`}
                      style={{ backgroundColor: bgColor }}
                    >
                      {!isLoadingCell && cell
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

enum LoadingType {
  TIME = "time_loading",
  SUBJECT = "subject_loading",
}

const loadingDataValues = Array.from({ length: 28 }).map((_, i) =>
  Array.from({ length: 8 }).map((_, j) =>
    i % 2 === 1 ? (j === 0 ? LoadingType.TIME : LoadingType.SUBJECT) : ""
  )
);

const loadingData: {
  values: string[][];
  mergedCells: MergeData[];
} = {
  values: loadingDataValues,
  mergedCells: loadingDataValues
    .map((columns, i) =>
      columns.map((_, j) => ({
        startRowIndex: 2 * i + 4,
        endRowIndex: 2 * i + 6,
        startColumnIndex: j + 1,
        endColumnIndex: j + 2,
      }))
    )
    .flat(),
};

type Colors = { [key: string]: string };

const loadingColors: Colors = {
  time_loading: "#e5e5e5",
  subject_loading: "#efefef",
};

const createSubjectColorMapping = (values: string[][]) => {
  const subjectColors: Colors = {};
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
  "#ffb3bb", // Pink
  "#FFE156", // Lemon
  "#FFDFBA", // Orange
  "#ffff76", // Yellow
  "#dbf3a3", // Olive
  "#BAE1FF", // Blue
  "#D8B4D0", // Lilac
  "#FFC3A0", // Coral
  "#FF9A8D", // Red Coral
  "#D4A5A5", // Dusty Rose
  "#9995a6", // Lavender
  "#FF8C94", // Salmon
  "#A0CED9", // Teal
  "#C7CEEA", // Periwinkle
  "#F5E3B3", // Cream
  "#C8D7F5", // Sky Blue
  "#F7B2B7", // Watermelon
  "#FFDDC1", // Peach
  "#D3C6E7", // Mauve
  "#E6B89C", // Tan
  "#B4C9E7", // Steel Blue
  "#F7D3B4", // Apricot
  "#F1A7A1", // Rose
  "#D1E8E4", // Seafoam
  "#EAB8D1", // Blush
  "#FFC9DE", // Flamingo
  "#B5EAD7", // Mint Green
  "#FFD6A5", // Light Apricot
  "#C4E17F", // Light Green
  "#B3B2D8", // Periwinkle
];

const opacity = "60"; // 16진수 (00~FF)
const generateColor = (index: number): string => {
  return `${colorPalette[index % colorPalette.length]}${opacity}`; // Cycle through the color palette
};
