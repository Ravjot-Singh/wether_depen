export function conditionGroup(id) {
  if (id >= 200 && id < 300) return 'thunder'
  if (id >= 300 && id < 400) return 'drizzle'
  if (id >= 500 && id < 600) return 'rain'
  if (id >= 600 && id < 700) return 'snow'
  if (id >= 700 && id < 800) return 'fog'
  if (id === 800) return 'clear'
  return 'clouds'
}

export function isDaytime(current) {
  const { dt, sys } = current
  return dt >= sys.sunrise && dt < sys.sunset
}

export function resolveTheme(current) {
  const group = conditionGroup(current.weather[0].id)
  return `${group}-${isDaytime(current) ? 'day' : 'night'}`
}
