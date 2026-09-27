import { conditionGroup } from '../theme/resolveTheme.js'

export const MOODS = {
  rainy: { headline: 'Monsoon cravings', blurb: 'Chai-and-pakora weather' },
  cold: { headline: 'Warm-up specials', blurb: 'Comfort food for a chilly day' },
  hot: { headline: 'Beat the heat', blurb: 'Cool down with something icy' },
  pleasant: { headline: 'Perfect-day picks', blurb: 'Lovely weather for a treat' },
}

export function resolveMood(current) {
  const group = conditionGroup(current.weather[0].id)
  const temp = current.main.temp
  if (group === 'thunder' || group === 'rain' || group === 'drizzle') return 'rainy'
  if (group === 'snow' || temp <= 16) return 'cold'
  if (temp >= 30) return 'hot'
  return 'pleasant'
}
