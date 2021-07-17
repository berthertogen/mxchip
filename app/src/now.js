import * as service from './service';
import * as chart from './chart';

let interval;

async function load() {
  build();
  interval = setInterval(async () => {
    build();
  }, 1500);
}

function unload() {
  clearInterval(interval);
}

async function build() {
  const data = await service.last(30);
  chart.buildChart({
    xAxisKey: 'enqueued_time',
    yAxisKey: 'temperature',
    chartPrefix: 'Chart',
    backgroundColor: "#6200ee",
    showLastValueInLegend: true,
    data, 
  })
  chart.buildChart({
    xAxisKey: 'enqueued_time',
    yAxisKey: 'humidity',
    chartPrefix: 'Chart',
    backgroundColor: "#03dac6",
    showLastValueInLegend: true,
    data, 
  })
}

export { load, unload }