const { apiUrl } = require("./configuration");
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';

Chart.register(...registerables);
let charts = {};
let data = [];

async function receive() {
  build();
  setInterval(async () => {
    build();
  }, 1500);
}

async function build() {
  await mergeData(30);
  buildChart('temperature', "rgba(105, 240, 174, 1)");
  buildChart('humidity', "rgba(156, 39, 176, 1)");
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
    .sort((a,b) => new Date(a.enqueued_time) - new Date(b.enqueued_time));
  
    data = sorted.length > numberOfResults 
      ? sorted.slice(newData.length - numberOfResults, newData.length)
      : sorted;
}

function buildChart(yAxisKey, color) {
  var chartName = `${yAxisKey}Chart`;
  var ctx = document.getElementById(chartName);

  const values = data.map(iotevent => iotevent[yAxisKey]);
  const max = Math.round(Math.max(...values) + 0.5);
  const min = Math.round(Math.min(...values) - 0.5);

  if (charts[chartName]){
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
          backgroundColor: color,
          color: "#ffffff"
        }]
      },
      options: {
        animation: false,
        plugins: {
          legend: {
            title: {
              font: {
                size: 20,
                family: "Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif"
              },
              color: "#ffffff"
            },
            labels: {
              font: {
                size: 30,
                family: "Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif"
              },
              color: "#ffffff"
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
            ticks: {
              font: {
                size: 20,
                family: "Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif"
              },
              color: "#ffffff"
            },
          },
          x: {
            ticks: {
              font: {
                size: 20,
                family: "Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif"
              },
              color: "#ffffff"
            },
            type: 'time',
            time: {
              unit: 'minute'
            },
          }
        }
      }
  });
}

receive().then();