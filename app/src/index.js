const { apiUrl } = require("./configuration");
import * as menu from './menu';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import "./styles.scss";

Chart.register(...registerables);
let charts = {};
let data = [];

async function receive() {
  build();
  setInterval(async () => {
    if (menu.nowShown()){
      build();
    }
  }, 1500);
}

async function build() {
  await mergeData(30);
  buildChart('temperature', "#6200ee");
  buildChart('humidity', "#03dac6");
}

async function mergeData(numberOfResults) {
  const response = await fetch(`${apiUrl}/iot-events/${data.length === 0 ? numberOfResults : 5}`);
  const json = await response.json();
  const joined = [...data, ...json];
  const newData = joined
    .filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj["_id"]).indexOf(obj["_id"]) === pos;
    });
  const sorted = newData
    .sort((a, b) => new Date(a.enqueued_time) - new Date(b.enqueued_time));
  data = sorted.length > numberOfResults
    ? sorted.slice(newData.length - numberOfResults, newData.length)
    : sorted;
}

function buildChart(yAxisKey, backgroundColor) {
  const textColor = '#000000';
  const font = {
    font: {
      size: 20,
      family: "Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif"
    },
    color: textColor
  };
  const chartName = `${yAxisKey}Chart`;
  const ctx = document.getElementById(chartName);

  const values = data.map(iotevent => iotevent[yAxisKey]);
  const max = Math.round(Math.max(...values) + 0.5);
  const min = Math.round(Math.min(...values) - 0.5);

  if (charts[chartName]) {
    charts[chartName].destroy();
  }
  charts[chartName] = new Chart(ctx, {
    type: 'line',
    pointRadius: 0,
    data: {
      datasets: [{
        label: `${yAxisKey} ${data[data.length - 1][yAxisKey]}`,
        fill: true,
        data: data,
        tension: 0.4,
        backgroundColor: backgroundColor,
        color: textColor
      }]
    },
    options: {
      animation: false,
      plugins: {
        legend: {
          title: font,
          labels: {
            ...font,
            font: {
              ...font.font,
              size: 30
            }
          }
        }
      },
      parsing: {
        xAxisKey: 'enqueued_time',
        yAxisKey: yAxisKey
      },
      scales: {
        y: {
          min,
          max,
          ticks: font,
        },
        x: {
          ticks: font,
          type: 'time',
          time: {
            unit: 'minute'
          },
        }
      }
    }
  });
}

menu.init();
receive().then();