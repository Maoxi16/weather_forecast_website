const webpack = require("webpack");
const express = require("express");
const devMiddleware = require("webpack-dev-middleware");
const morgan = require("morgan");
const fs = require("fs");

const webpackConfig = require("../webpack.config");

const compiler = webpack(webpackConfig);

const samplePoint = {
  properties: {
    "@id": "https://api.weather.gov/points/39.7456,-97.0892",
    "@type": "wx:Point",
    cwa: "TOP",
    forecastOffice: "https://api.weather.gov/offices/TOP",
    gridId: "TOP",
    gridX: 31,
    gridY: 80,
    forecast: "https://api.weather.gov/gridpoints/TOP/31,80/forecast",
    forecastHourly:
      "https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly",
    forecastGridData: "https://api.weather.gov/gridpoints/TOP/31,80",
    observationStations:
      "https://api.weather.gov/gridpoints/TOP/31,80/stations",
    relativeLocation: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-97.086661, 39.679376],
      },
      properties: {
        city: "Linn",
        state: "KS",
        distance: {
          unitCode: "wmoUnit:m",
          value: 7366.9851976444,
        },
        bearing: {
          unitCode: "wmoUnit:degree_(angle)",
          value: 358,
        },
      },
    },
  },
};
const sampleForecast = JSON.parse(fs.readFileSync("src/sample_forecast.json"));

const app = express();

const response = {
  result: {
    input: {
      address: { address: "4600 Silver Hill Rd, Washington, DC 20233" },
      benchmark: {
        isDefault: false,
        benchmarkDescription: "Public Address Ranges - Census 2020 Benchmark",
        id: "2020",
        benchmarkName: "Public_AR_Census2020",
      },
    },
    addressMatches: [
      {
        tigerLine: { side: "L", tigerLineId: "76355984" },
        coordinates: { x: -76.92743610939091, y: 38.84598652130676 },
        addressComponents: {
          zip: "20233",
          streetName: "SILVER HILL",
          preType: "",
          city: "WASHINGTON",
          preDirection: "",
          suffixDirection: "",
          fromAddress: "4600",
          state: "DC",
          suffixType: "RD",
          toAddress: "4700",
          suffixQualifier: "",
          preQualifier: "",
        },
        matchedAddress: "4600 SILVER HILL RD, WASHINGTON, DC, 20233",
      },
    ],
  },
};

app.use(devMiddleware(compiler), morgan("dev"));

app.get(/address/, (req, res) => {
  res.send(response);
});

app.get(/weather\/points/, (req, res) => {
  res.send(samplePoint);
});

app.get(/weather/, (req, res) => {
  res.send(sampleForecast);
});

app.listen(3000, () => console.log("Express listening on port 3000"));
