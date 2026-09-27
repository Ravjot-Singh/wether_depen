const IDS = { clear: 800, clouds: 803, rain: 501, drizzle: 301, thunder: 211, snow: 601, fog: 741 }
const DESC = {
  clear: 'clear sky',
  clouds: 'broken clouds',
  rain: 'moderate rain',
  drizzle: 'light drizzle',
  thunder: 'thunderstorm with rain',
  snow: 'snow',
  fog: 'mist',
}
const BASE_TEMP = { clear: 27, clouds: 21, rain: 17, drizzle: 16, thunder: 22, snow: -3, fog: 9 }

export function mockWeather(themeKey, city, tempOverride) {
  const [group, tod] = themeKey.split('-')
  const now = Math.floor(Date.now() / 1000)
  const H = 3600
  const isDay = tod === 'day'
  const temp = tempOverride ?? BASE_TEMP[group] + (isDay ? 2 : -3)

  return {
    name: city,
    dt: now,
    timezone: -new Date().getTimezoneOffset() * 60,
    sys: {
      country: 'IN',
      sunrise: isDay ? now - 4 * H : now + 5 * H,
      sunset: isDay ? now + 6 * H : now - 5 * H,
    },
    main: { temp, feels_like: temp - 1.5, humidity: group === 'clear' ? 38 : 82, pressure: 1011 },
    weather: [{ id: IDS[group], main: group, description: DESC[group] }],
    wind: { speed: group === 'thunder' ? 9.5 : 3.2 },
  }
}
