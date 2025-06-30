import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { StockData } from "../../types/types";

interface ChartProps {
  stockData: StockData[];
}

const COLORS = [
  "#60758a",
  "#82ca9d",
  "#8884d8",
  "#ff7300",
  "#00c49f",
  "#0088fe",
  "#a83279",
  "#ffd700",
  "#00bfff",
  "#ff69b4",
];

const Chart: React.FC<ChartProps> = ({ stockData }) => {
  if (stockData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Adicione ações para visualizar o gráfico
      </div>
    );
  }

  const series = stockData.map((stock, index) => {
    const baseColor = COLORS[index % COLORS.length];
    return {
      name: stock.ticker,
      data: stock.prices.map((point) => [point.date.getTime(), point.close]),
      type: "area",
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, Highcharts.color(baseColor).setOpacity(0.2).get("rgba")],
          [1, Highcharts.color(baseColor).setOpacity(0).get("rgba")],
        ],
      },
      lineWidth: 3,
      color: baseColor,
      marker: { enabled: false },
      threshold: null,
    };
  });

  const options: Highcharts.Options = {
    chart: {
      height: 150,
      backgroundColor: "transparent",
      style: {
        fontFamily: "'Inter', 'Noto Sans', sans-serif",
      },
    },
    title: { text: undefined },
    xAxis: {
      type: "datetime",
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%b", this.value as number);
        },
        style: {
          color: "#60758a",
          fontWeight: "bold",
          fontSize: "13px",
          letterSpacing: "0.015em",
        },
      },
      tickLength: 0,
      lineColor: "transparent",
      gridLineWidth: 0,
      crosshair: true,
    },
    yAxis: {
      visible: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      backgroundColor: "white",
      borderColor: "#60758a",
      style: { color: "#111418" },
      formatter: function (this: any) {
        let s = `<b>${Highcharts.dateFormat("%d/%m/%Y", this.x)}</b>`;
        (this.points || []).forEach((point: any) => {
          s += `<br/><span style="color:${point.color}">\u25CF</span> ${
            point.series.name
          }: R$ ${point.y.toFixed(2)}`;
        });
        return s;
      },
    },
    credits: { enabled: false },
    plotOptions: {
      area: {
        marker: { enabled: false },
        fillOpacity: 0.2,
        linecap: "round",
      },
    },
    series: series as Highcharts.SeriesOptionsType[],
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default Chart;
