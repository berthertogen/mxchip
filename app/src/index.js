const { apiUrl } = require("./configuration");
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';

Chart.register(...registerables);

async function receive() {
  const pre = document.body.getElementsByTagName("pre");
  fetch(`${apiUrl}/iot-events/50`)
  .then(response => response.json())
  .then(data => {
    buildChart(data);
  });
}

function buildChart(data) {
  var ctx = document.getElementById('myChart');
  const temperatures = data.map(iotevent => iotevent.temperature);
  const max = Math.round(Math.max(...temperatures) + 0.5);
  const min = Math.round(Math.min(...temperatures) - 0.5);

  const myChart = new Chart(ctx, {
      type: 'line',
      pointRadius: 0,
      data: {
        datasets: [{
          label: "Temperature",
          fill: true,
          data: data.filter(iotevent => !!iotevent.temperature),
          tension: 0.4
        }]
      },
      options: {
        plugins: {
          legend: {
            title: {
              font: {
                size: 20
              }
            },
            labels: {
              font: {
                size: 30
              }
            }
          }
        },
        parsing: {
          xAxisKey: 'enqueued_time',
          yAxisKey: 'temperature'
        },
        scales: {
          y: {
            min,
            max,
            ticks: {
              font: {
                size: 20
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 20
              },
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

receive();