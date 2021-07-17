const { apiUrl } = require("./configuration");

let nowDataCache = [];

async function last(numberOfResults) {
  const response = await fetch(`${apiUrl}/iot-events/${nowDataCache.length === 0 ? numberOfResults : 5}`);
  const json = await response.json();
  const joined = [...nowDataCache, ...json];
  const newData = joined
    .filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj["_id"]).indexOf(obj["_id"]) === pos;
    });
  const sorted = newData
    .sort((a, b) => new Date(a.enqueued_time) - new Date(b.enqueued_time));
  nowDataCache = sorted.length > numberOfResults
    ? sorted.slice(newData.length - numberOfResults, newData.length)
    : sorted;
  return nowDataCache;
}

async function aggregated(from, till, aggregatedMinutes) {
  const response = await fetch(`${apiUrl}/iot-events/${from.toFormat('yyyyMMdd')}-${till.toFormat('yyyyMMdd')}/${aggregatedMinutes}`);
  return (await response.json()).sort((a, b) => new Date(a.aggregatedOn) - new Date(b.aggregatedOn));
}

export { aggregated, last }