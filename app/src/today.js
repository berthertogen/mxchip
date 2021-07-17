import * as service from './service';
import * as chart from './chart';
import { DateTime } from "luxon";

async function load() {
  const data = await service.aggregated(DateTime.now().startOf('day'), DateTime.now().plus({ day: 1 }).startOf('day'), 15);

  chart.buildChart({
    xAxisKey: 'aggregatedOn',
    yAxisKey: 'temperature',
    chartPrefix: 'Chart',
    backgroundColor: "#6200ee",
    showLastValueInLegend: false,
    timeUnit: 'hour',
    data,
  });
  chart.buildChart({
    xAxisKey: 'aggregatedOn',
    yAxisKey: 'humidity',
    chartPrefix: 'Chart',
    backgroundColor: "#03dac6",
    showLastValueInLegend: false,
    timeUnit: 'hour',
    data,
  });
}

async function today() {
  return await aggregated(DateTime.now().startOf('day'), DateTime.now().plus({ day: 1 }).startOf('day'), 15);
}

export { load }