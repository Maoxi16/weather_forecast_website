const POINT_ENDPOINT = "http://localhost:3000/weather/points";

/**
 * Lookup the grid point corresponding to a given lat/long
 *
 * @param {number} latitude
 * @param {number} longitude
 */
async function getPoint(latitude, longitude) {
  const url = `${POINT_ENDPOINT}/${latitude},${longitude}`;
  return fetch(url);
}

/**
 * Get the forecast for a given lat/long pair
 *
 * @param {number} latitude
 * @param {number} longitude
 */

export default async function getForecast(latitude, longitude) {
  const response = await getPoint(latitude, longitude);
  const data = await response.json();

  const foracastdataurl = data.properties.forecast;
  const response2 = await fetch(foracastdataurl);
  const data2 = await response2.json();
  return Promise.resolve(data2).then((x) => x.properties.periods);
}
