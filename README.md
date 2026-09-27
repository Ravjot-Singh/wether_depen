# Weather Bites

A React + Vite food menu that reacts to the weather. It reads the current OpenWeatherMap conditions for one city. The whole look (sky, animated scene, colours, glass cards) follows the weather and time of day, and the foods in highest demand for that weather are shown at **50% off**.

## Setup

1. Copy `.env.example` to `.env`, then fill in:
   - `OPENWEATHER_API_KEY`: your key from https://home.openweathermap.org/api_keys (new keys can take up to 2 hours to activate)
   - `VITE_DEFAULT_CITY`: the city, e.g. `Ludhiana` or `London,GB`
2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

If the weather can't be loaded, the full menu still shows at regular prices.

## How the specials are chosen

`src/menu/mood.js` turns the weather into a demand mood. The rules are checked in this order:

| Mood | When | Specials (50% off) |
|---|---|---|
| rainy | thunderstorm, rain or drizzle | masala chai, pakora, samosa, masala noodles, bhutta, vada pav |
| cold | snow, or 16°C and below | masala chai, tomato soup, aloo paratha, momos, hot chocolate, gajar halwa |
| hot | 30°C and above | mango lassi, kulfi, nimbu pani, cold coffee, watermelon juice, ice cream |
| pleasant | anything else | pani puri, pizza, masala dosa, pav bhaji, burger |

To change what goes on special, edit the `moods` array of an item in `src/menu/items.js`. Prices, names and descriptions live there too. The weather refreshes every 10 minutes, and the specials update with it. The `?theme=` preview below only works in local dev, not on the deployed site.

## Previewing moods and themes

In dev mode, add `?theme=<key>` to force the weather, and optionally `&temp=<°C>` to set the temperature. Mock weather is used, so no API key is needed.

- Rainy: `/?theme=rain-day`
- Cold: `/?theme=snow-night`
- Hot: `/?theme=clear-day&temp=38`
- Pleasant: `/?theme=clouds-day`

The theme keys are `clear`, `clouds`, `rain`, `drizzle`, `thunder`, `snow` and `fog`, each followed by `-day` or `-night`.

## Images

All food photos come from Wikimedia Commons under CC0, public domain, CC BY or CC BY-SA licences. They are saved in `public/food/`. Attribution is in `src/menu/credits.json` and is shown in the page footer, as the CC BY licences require.

To fetch images for new items or replace existing ones:

```bash
node scripts/fetch-images.mjs              # only missing images
node scripts/fetch-images.mjs pizza kulfi  # re-fetch specific items
```

Each item has a search term (`SEARCH`) in the script. To use a specific photo, add its Commons file title to `PINNED`. To exclude a photo, add it to `REJECTED`.

## Deploying to Vercel

1. Push the project to GitHub, then import it at https://vercel.com/new. The Vite framework is detected automatically, and `vercel.json` sets the build.
2. Under **Settings → Environment Variables**, add:
   - `OPENWEATHER_API_KEY`: your key
   - `VITE_DEFAULT_CITY`: your city. This value is baked in at build time, so redeploy after changing it.
3. Deploy.

Alternatively, from the terminal: `npx vercel`, then `npx vercel --prod`.

## How the API key is kept private

The browser only ever calls `/api/weather?q=<city>`, and the key is added on the server:

- **On Vercel**, `api/weather.js` is a serverless function. It reads `OPENWEATHER_API_KEY` from the project's environment variables and calls OpenWeatherMap. Successful responses are cached at Vercel's edge for 5 minutes, so many visitors share one API call.
- **Locally**, the Vite dev/preview proxy in `vite.config.js` does the same job, using the key from `.env`.

The key has no `VITE_` prefix, so Vite never puts it into browser code.
