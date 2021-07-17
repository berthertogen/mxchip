import * as service from './service';
import * as chart from './chart';
import { DateTime } from "luxon";

async function load() {
  const data = await service.aggregated(DateTime.now().startOf('week'), DateTime.now().plus({ days: 7 }).startOf('week'), 60 * 24);

  chart.buildChart({
    xAxisKey: 'aggregatedOn',
    yAxisKey: 'temperature',
    chartPrefix: 'Chart',
    backgroundColor: "#6200ee",
    showLastValueInLegend: false,
    timeUnit: 'day',
    data, 
  });
  chart.buildChart({
    xAxisKey: 'aggregatedOn',
    yAxisKey: 'humidity',
    chartPrefix: 'Chart',
    backgroundColor: "#03dac6",
    showLastValueInLegend: false,
    timeUnit: 'day',
    data, 
  });
}

export { load }