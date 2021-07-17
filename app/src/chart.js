import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';

Chart.register(...registerables);

let charts = {};

function buildChart({
  yAxisKey,
  xAxisKey,
  chartPrefix, 
  backgroundColor,
  showLastValueInLegend,
  timeUnit,
  data, 
}) {
  const textColor = '#000000';
  const font = {
    font: {
      size: 20,
      family: "Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif"
    },
    color: textColor
  };
  const chartName = `${yAxisKey}${chartPrefix}`;
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
        label: showLastValueInLegend ? `${yAxisKey} ${data[data.length - 1][yAxisKey]}` : yAxisKey,
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
        xAxisKey: xAxisKey,
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
            unit: timeUnit || 'minute'
          },
        }
      }
    }
  });
}

export { buildChart }