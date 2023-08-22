/* eslint-disable no-console */
const webpack = require("webpack");
const express = require("express");
const devMiddleware = require("webpack-dev-middleware");
const hotReloadMiddleware = require("webpack-hot-middleware");
const morgan = require("morgan");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
const open = require("open");
const webpackConfig = require("./webpack.config");

const compiler = webpack(webpackConfig);

const GEOCODING_ENDPOINT = "https://geocoding.geo.census.gov";
const WEATHER_GOV_ENDPOINT = "https://api.weather.gov/";

const app = express();

app.use(
  devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }),
  hotReloadMiddleware(compiler, { log: console.log, path: "/__webpack_hmr" }),
  morgan("dev")
);

// proxy localhost:3000/address to the onelineaddress endpoint
app.use(
  "/address",
  createProxyMiddleware({
    target: GEOCODING_ENDPOINT,
    changeOrigin: true,
    logger: console,
    pathRewrite: {
      [`^/address`]: "/geocoder/locations/onelineaddress",
    },
  })
);

// proxy localhost:3000/weather/... to api.weather.gov
app.use(
  "/weather",
  createProxyMiddleware({
    target: WEATHER_GOV_ENDPOINT,
    changeOrigin: true,
    logger: console,
    pathRewrite: {
      [`^/weather`]: "",
    },
    headers: {
      "User-Agent": "weather assignment",
    },
    followRedirects: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, _req, _res) => {
        if (proxyRes.headers["content-type"] === "application/json") {
          const response = responseBuffer.toString("utf-8");
          return response.replaceAll(
            "https://api.weather.gov/",
            "http://localhost:3000/weather/"
          );
        }
        return responseBuffer;
      }
    ),
  })
);

app.use(express.static(__dirname));

app.listen(3000, () => {
  console.info("Express listening on port 3000");
  open("http://localhost:3000");
});
