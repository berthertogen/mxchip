const { apiUrl } = require("./configuration");
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';

Chart.register(...registerables);

function prettyJson(object) {
  return JSON.stringify(object, null, 6)
     .replace(/\n( *)/g, function (match, p1) {
         return '<br>' + '&nbsp;'.repeat(p1.length);
     });
}

async function receive() {
  const pre = document.body.getElementsByTagName("pre");
  fetch(`${apiUrl}/iot-events/500`)
  .then(response => response.json())
  .then(data => {
    pre[0].innerHTML = `<code>${prettyJson(data)}</code>`;
    buildChart(data);
  });
}

function buildChart(data) {
  var ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: data.filter(iotevent => !!iotevent.temperature),
          tension: 0.1
        }]
      },
      options: {
        parsing: {
          xAxisKey: 'enqueued_time',
          yAxisKey: 'temperature'
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute'
            },
            title: {
              display: true,
              text: 'Tijd'
            }
          }
        }
      }
  });
}

receive();