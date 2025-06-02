import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { StockData } from "../../types/types";

interface ChartProps {
  stockData: StockData[];
}

const Chart: React.FC<ChartProps> = ({ stockData }) => {
  if (stockData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Adicione ações para visualizar o gráfico
      </div>
    );
  }

  const series = stockData.map((stock) => ({
    name: stock.ticker,
    data: stock.prices.map((point) => [point.date.getTime(), point.close]),
    type: "area",
    fillColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, "rgba(96, 117, 138, 0.2)"],
        [1, "rgba(240, 242, 245, 0)"],
      ],
    },
    lineWidth: 3,
    color: "#60758a",
    marker: { enabled: false },
    threshold: null,
  }));

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
      crosshair: true, // crosshair é propriedade do xAxis
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
        linecap: "round", // corrigido: está diretamente em plotOptions.area, não dentro de line
      },
    },
    series: series as Highcharts.SeriesOptionsType[],
  };

  return (
    <div className="w-full max-w-full px-4 py-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Chart;
