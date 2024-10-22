import { sum } from "lodash";

const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector("ul");

  if (!listContainer) {
    listContainer = document.createElement("ul");
    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "column";
    listContainer.style.margin = "10px 0 0 0";
    listContainer.style.padding = "0";
    listContainer.style.width = "100%";
    listContainer.style.maxWidth = "250px";

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const htmlLegendPlugin = {
  id: "htmlLegend",
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);
    const total = sum(chart.data?.datasets?.[0]?.data);

    items.forEach((item, itemIdx) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "0";
      li.style.fontSize = "15px";

      li.onclick = () => {
        const { type } = chart.config;
        if (type === "pie" || type === "doughnut") {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.flexShrink = "0";
      boxSpan.style.height = "20px";
      boxSpan.style.marginRight = "10px";
      boxSpan.style.width = "20px";

      // Text
      const labelContainer = document.createElement("p");
      labelContainer.style.color = item.fontColor;
      labelContainer.style.margin = "0";
      labelContainer.style.padding = "0";
      labelContainer.style.textDecoration = item.hidden ? "line-through" : "";

      const label = document.createTextNode(item.text);
      labelContainer.appendChild(label);

      // Data
      const dataContainer = document.createElement("p");
      dataContainer.style.color = item.fontColor;
      dataContainer.style.padding = "0";
      dataContainer.style.margin = "0 0 0 auto";
      dataContainer.style.fontSize = "16px";
      dataContainer.style.fontWeight = "700";

      const data = chart.data?.datasets?.[0]?.data?.[itemIdx];
      const percentage = total ? Math.round((data / total) * 100) : "-";
      const text = document.createTextNode(
        `${
          item.hidden ? "-" : chart.data?.datasets?.[0]?.data?.[itemIdx] ?? "-"
        }${options.unit ?? ""}
          (${item.hidden ? "-" : percentage}%)
        `
      );
      dataContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(labelContainer);
      li.appendChild(dataContainer);
      ul.appendChild(li);
    });
  },
};
