[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/RSFeoZ2a)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10423002&assignment_repo_type=AssignmentRepo)
# weather forecast 

## Getting Set Up

This repo contains my `main.css` and `index.html` 

## Step One

Run `pnpm build` and inspect `dist`. You should have:

```
dist
├── index.html
└── main.js
```

You'll notice that, even though `src/main.css` exists, it's not included in `dist`.
What's going on? If you take a look at `webpack.config.js`, you'll see that we're
using the `HtmlWebpackPlugin` which is assembling our javascript into `main.js`
(note that our javascript source file is called `src/index.js`) and injecting that into `index.html`. But our Javascript doesn't know anything about our CSS, so, while
webpack can see the css source (see line 26 of `webpack.config.js`), it doesn't know
that our site actually needs it.

What do we do? Sounds odd, but we can _import_ it to our Javascript. Add the following at the top of `index.js`:

```js
import "./main.css";
```

If you run `pnpm start`, you'll see that out site now has the CSS! (It's actually being
injected by the JS, so it won't appear in `dist` if you run `pnpm build`.)

## Step Two: Looking at the APIs

Now that we're back where we left off, the next step is to connect to an API.

We're going to use the [National Weather Service API](https://www.weather.gov/documentation/services-web-api). If you get look at the docs, you'll notice that
the forecast endpoint is of the form:

```
https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast
```

There are two problems here... we need a "grid point" _and_ a NWS office. Given
latitude and longitude, we can get the grid information from another endpoint:

```
https://api.weather.gov/points/{latitude},{longitude}
```

If you have `jq` installed, you can get a pretty-printed example by running:

```bash
curl https://api.weather.gov/points/39.7456,-97.0892 | jq .
```

The most interesting part of the response is the `properties` field:

```js
 "properties": {
    "@id": "https://api.weather.gov/points/39.7456,-97.0892",
    "@type": "wx:Point",
    "cwa": "TOP",
    "forecastOffice": "https://api.weather.gov/offices/TOP",
    "gridId": "TOP",
    "gridX": 31,
    "gridY": 80,
    "forecast": "https://api.weather.gov/gridpoints/TOP/31,80/forecast",
    "forecastHourly": "https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly",
    "forecastGridData": "https://api.weather.gov/gridpoints/TOP/31,80",
    "observationStations": "https://api.weather.gov/gridpoints/TOP/31,80/stations",
    "relativeLocation": {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -97.086661,
          39.679376
        ]
      },
      "properties": {
        "city": "Linn",
        "state": "KS",
        "distance": {
          "unitCode": "wmoUnit:m",
          "value": 7366.9851976444
        },
        "bearing": {
          "unitCode": "wmoUnit:degree_(angle)",
          "value": 358
        }
      }
    },
```

This looks good, but we have to come up with latitude and longitude. Fortunately,
the Census has a [Geocoding API](https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html).

### Detour: CORS

Take a minute and read about [CORS Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Because the Census Geocoding API doesn't actually supply CORS headers,
we can't call it directly from our client-side/frontend code (you can try this, if you want). ~~Instead, we'll proxy the requests via [corsproxy.io](https://corsproxy.io/).~~ Is proxying via a website run by a random German company a good practice? No. In the "real world", you'd proxy via a server you control. (**Update**: the assignment now has its own dev server which proxies the requests.)

## Step Three: Replace hard-coded forecast

**NOTE**: It doesn't actually matter if you do this before or after Steps 4/5. However, it's probably marginally easier to do this first using the sample data.

There is a button that says `Sample Data` which will return a hard-coded forecast response (it's in `src/sample_forecast.json`). You'll notice that `fetchSampleData` is attached to the `click` event of this button.

```js
function fetchSampleData() {
  return Promise.resolve(sampleForecast).then((x) =>
    insertForecast(x.properties.periods)
  );
}
```

You'll need to implement the `insertForecast` function in `index.js` to insert the forecast into the DOM. I left you stubs of functions called `buildForecastIconElt` and `buildForecastBlock` that I used,
but you're not required to use them. Note that the API response includes an `icon` field with a URL to retrieve an image to accompany the forecast. This will replace the Bootstrap icons we used before. (You'll have to do something [like we did with the cat in class](https://github.com/csc473-spring23/js-exercise/blob/main/src/index.js#L19).) These forecasts also include only a single temperature rather than a high/low. That's fine, just include one temperature.

**Make sure you include alt text with the icon image!** (The `shortForecast` field is probably a good choice, though it's not perfect, since the icons sometimes include percentages of precipitation. On the other hand, using `detailedForecast` repeats information.)

You'll end up with something that looks like the screenshot in `screenshots/forecast.png`.

## Step Four: Add an address box

1. Add a search box and a submit button. The search box should have id `address` and the button should have id `address-submit`.
   Unfortunately, the Census Geocoding API requires a full address,
   not just a city/state or ZIP code. (Let me know if you find another geocdoing API that doesn't require a key.)
2. Attach a listener to the `click` event that takes the contents of the address box and just logs it to the console. (We did this in class.)

3. Take a look at https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event and add a listener to the text input itself to submit on `Enter`. (See also https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

4. Run the tests with `pnpm test`. The "address submission" tests should pass.

## Step Five: Look up the weather

Now that we have the address information, implement `getForecast` in `forecast.js` to retrieve the weather forecast for the address the user supplied.

## Step Six: Error Handling

What should your application do when either the forecast or address can't be found?

## Checklist

- [ ] format your code with `pnpm format`
- [ ] lint your code with `pnpm lint`
- [ ] check that the tests pass
- [ ] check for errors/warnings with WAVE

