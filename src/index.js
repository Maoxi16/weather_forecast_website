import getForecast from "./forecast";
import { getLatLongForAddress } from "./geocode";
import "./main.css";
import sampleForecast from "./sample_forecast.json";

/**
 * Create an img element with the "icon" specified in the forecast
 *
 * @param {{name: string, startTime: string, endTime: string, temperature: number, icon: URL, shortForecast: string}} forecast
 */
async function buildForecastIconElt(forecast) {
  const img = document.createElement("img");
  img.src = forecast.icon;
  img.alt = forecast.shortForecast;
  return img;
}

/**
 * Create the `section` element for one forecast item.
 *
 * @param {{name: string, startTime: string, endTime: string, temperature: number, icon: URL, shortForecast: string}} forecast
 */
async function buildForecastBlock(forecast) {
  const container = document.createElement("section");
  container.classList.add("forecast");

  const day = document.createElement("p");
  day.textContent = forecast.name;
  day.classList.add("day");

  const icon = await buildForecastIconElt(forecast);
  icon.classList.add("weather");

  const temp = document.createElement("p");
  temp.textContent = forecast.temperature;
  temp.classList.add("temp");

  container.appendChild(day);
  container.appendChild(icon);
  container.appendChild(temp);

  return container;
}

/**
 * Now that we have the array of forecasts, insert them into the
 * DOM
 * @param {} forecastPeriods
 */
async function insertForecast(forecastPeriods) {
  const forecastContainer = document.getElementById("forecast-cont");
  forecastContainer.innerHTML = ""; // clear the forecastContainer when update new weather
  const forecastBlocks = await Promise.all(
    forecastPeriods.map((forecast) => buildForecastBlock(forecast))
  );
  forecastBlocks.forEach((forecastBlock) => {
    forecastContainer.append(forecastBlock);
  });
}

/**
 * Event handler for address submission
 *
 * @param {Event} ev
 */
function onAddressSubmit(ev) {
  ev.preventDefault();
  const address = document.getElementById("address");
  console.log(address.value);
  getLatLongForAddress(address.value)
    .then(async (data) => {
      insertForecast(await getForecast(data.lat, data.long));
    })
    .catch((error) => {
      console.error("Error getting forecast:", error);
      alert("Error getting forecast. Please try again.");
    });
}

function fetchSampleData() {
  return Promise.resolve(sampleForecast).then((x) => x.properties.periods);
}
/* attach a handler to the "sample data" button
    document
    .getElementById("sample-data")
    .addEventListener("click", fetchSampleData);
    fetchSampleData().then((data) => {
    insertForecast(data);
   }); 
   */
(() => {
  const button = document.getElementById("sample-data");
  button.addEventListener("click", (event) =>
    fetchSampleData(event).then((data) => insertForecast(data))
  );

  // attach the address submit handler to the submit button
  const submitButton = document.getElementById("address-submit");
  submitButton.addEventListener("click", onAddressSubmit);

  const addressbox = document.getElementById("address");
  addressbox.addEventListener("keydown", (event) => {
    if (event.key === "enter") {
      event.preventDefault();
      onAddressSubmit(event);
    }
  });
})();
