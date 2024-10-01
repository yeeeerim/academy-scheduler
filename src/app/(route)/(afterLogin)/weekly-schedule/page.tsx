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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <h4>윈터 시간표</h4>
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
    <table className="text-center border border-black max-w-[700px]">
      <colgroup>
        <col style={{ width: `30%` }} />
        {Array.from({ length: columnCount - 1 }, (_, index) => (
          <col key={index} style={{ width: `10%` }} />
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
                const bgColor = subjectColors[cell || ""] || ""; // Get the color for the subject

                return (
                  <td
                    key={colIndex}
                    rowSpan={rowspan}
                    colSpan={colspan}
                    style={{
                      height: rowspan * 24,
                      backgroundColor:
                        cIndex === 0 || rIndex === 0 || !cell
                          ? "#FFF"
                          : bgColor, // Set the background color
                    }}
                    className={`border-black px-2 ${
                      cIndex === 0 ? "text-[11px]" : "text-[12px]"
                    } ${cell ? "border" : "border-r"}`}
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

  values.forEach((row) => {
    row.forEach((subject) => {
      if (!subjectColors[subject]) {
        // Only assign a color if it hasn't been assigned yet
        subjectColors[subject] = generateColor(colorIndex);
        colorIndex++;
      }
    });
  });

  return subjectColors;
};

const colorPalette = [
  "#FFB3BA", // Pastel Pink
  "#FFDFBA", // Pastel Orange
  "#FFFFBA", // Pastel Yellow
  "#BAFFC9", // Pastel Green
  "#BAE1FF", // Pastel Blue
  "#FFC3A0", // Pastel Coral
  "#FF677D", // Pastel Red
  "#D4A5A5", // Pastel Dusty Rose
  "#9995a6", // Pastel Lavender
  "#FF8C94", // Pastel Salmon
  "#FFE156", // Pastel Lemon
  "#B9FBC0", // Pastel Mint
  "#A0CED9", // Pastel Teal
  "#C7CEEA", // Pastel Periwinkle
  "#D8B4D0", // Pastel Lilac
  "#F5E3B3", // Pastel Cream
  "#C8D7F5", // Pastel Sky Blue
  "#F7B2B7", // Pastel Watermelon
  "#FFDDC1", // Pastel Peach
  "#D3C6E7", // Pastel Mauve
  "#E6B89C", // Pastel Tan
  "#A7C957", // Pastel Olive
  "#B4C9E7", // Pastel Steel Blue
  "#F7D3B4", // Pastel Apricot
  "#F1A7A1", // Pastel Rose
  "#D1E8E4", // Pastel Seafoam
  "#EAB8D1", // Pastel Blush
  "#FFC9DE", // Pastel Flamingo
  "#B5EAD7", // Pastel Mint Green
  "#FFD6A5", // Pastel Light Apricot
  "#C4E17F", // Pastel Light Green
  "#B3B2D8", // Pastel Periwinkle
  "#FF9A8D", // Pastel Red Coral
];

const generateColor = (index: number): string => {
  return colorPalette[index % colorPalette.length]; // Cycle through the color palette
};
