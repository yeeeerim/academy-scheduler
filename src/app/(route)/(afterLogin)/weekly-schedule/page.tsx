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
  return <SpreadsheetTable {...(isLoading ? loadingData : data)} subjectColors={isLoading ? loadingColors : createSubjectColorMapping(data.values)} />;
};

export default page;

interface MergeData {
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
}

const SpreadsheetTable = ({ values, mergedCells, subjectColors }: { values: string[][]; mergedCells: MergeData[]; subjectColors: Colors }) => {
  const today = new Date().getDay();
  const DAY_LIST = ["", "월", "화", "수", "목", "금", "토", "일"];

  // Determine whether a cell is merged and get the span details
  const getCellSpan = (row: number, col: number) => {
    const merge = mergedCells.find((m) => m.startRowIndex === row && m.startColumnIndex === col);
    if (merge) {
      const rowspan = merge.endRowIndex - merge.startRowIndex;
      const colspan = merge.endColumnIndex - merge.startColumnIndex;
      return { rowspan, colspan };
    }
    return { rowspan: 1, colspan: 1 };
  };

  const columnCount = values[0]?.length || 0;

  return (
    <div className="w-full border-gray-100 divide-y divide-gray-100 max-w-[800px]">
      {/* Header for days of the week */}
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        }}
      >
        {DAY_LIST.map((day, index) => (
          <div key={index} className="text-center py-2 border-r border-gray-100">
            <div className={`w-fit px-2 mx-auto rounded-full ${index % 7 === today ? "text-blue-500 bg-blue-50" : "text-gray-500"}`}>{day}</div>
          </div>
        ))}
      </div>

      {/* Grid for table values */}
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gridAutoRows: "20px", // Default row height
        }}
      >
        {values.map((row, rIndex) => {
          if (rIndex === 0) return null; // Skip header row if needed
          const rowIndex = rIndex + 3;

          return row.map((cell, cIndex) => {
            const colIndex = cIndex + 1;
            const { rowspan, colspan } = getCellSpan(rowIndex, colIndex);
            const mergedCell = mergedCells.find(
              (m) => rowIndex >= m.startRowIndex && rowIndex < m.endRowIndex && colIndex >= m.startColumnIndex && colIndex < m.endColumnIndex
            );

            if (mergedCell && (mergedCell.startRowIndex !== rowIndex || mergedCell.startColumnIndex !== colIndex)) {
              // Skip overlapping cells within a merged range
              return null;
            }
            const isLoadingCell = cell === LoadingType.TIME || cell === LoadingType.SUBJECT;

            const isTimeCell = cIndex === 0;
            const isNotDataCell = (!isLoadingCell && isTimeCell) || rIndex === 0 || !cell;
            const bgColor = isNotDataCell ? "#ffffff" : subjectColors[cell || ""] || ""; // Get the color for the subject

            // Check if the cell above is empty for border styling

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  gridRow: `span ${rowspan}`,
                  gridColumn: `span ${colspan}`,
                }}
                className={`border-r border-gray-100 text-[11px] ${cell ? "border-b" : ""} ${isTimeCell ? "font-normal" : "font-medium"}
                ${!isNotDataCell ? "p-[2px]" : ""}
                `}
              >
                <div
                  className={`p-1 rounded-[4px] w-full h-full flex text-center 
                  ${isTimeCell ? "items-start justify-end text-gray-600" : "items-center justify-center text-[#121212]"}
                  ${isLoadingCell ? "animate-fade" : ""}`}
                  style={{
                    backgroundColor: bgColor,
                  }}
                >
                  {!isLoadingCell && isTimeCell && <div>{cell.split(" ~ ")[0].replace("오전 ", "").replace("오후 ", "")}</div>}
                  {!isLoadingCell &&
                    !isTimeCell &&
                    cell &&
                    cell.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < row.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

enum LoadingType {
  TIME = "time_loading",
  SUBJECT = "subject_loading",
}

const loadingDataValues = Array.from({ length: 28 }).map((_, i) =>
  Array.from({ length: 8 }).map((_, j) => (i % 2 === 1 ? (j === 0 ? LoadingType.TIME : LoadingType.SUBJECT) : ""))
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
