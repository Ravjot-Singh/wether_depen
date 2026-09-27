import GlassCard from './GlassCard.jsx'
import WeatherIcon from './WeatherIcon.jsx'
import { isDaytime } from '../theme/resolveTheme.js'
import { MOODS } from '../menu/mood.js'
import { deg } from '../utils/format.js'

export default function WeatherBanner({ status, current, error, mood, themeLabel, city }) {
  if (status === 'loading') {
    return (
      <GlassCard className="banner">
        <p className="banner-loading">Checking the sky over {city} for today's deals…</p>
      </GlassCard>
    )
  }

  if (!current) {
    return (
      <GlassCard className="banner" role="alert">
        <div>
          <p className="banner-headline">Weather deals unavailable</p>
          <p className="muted">{error?.message} The full menu is still available at regular prices.</p>
        </div>
      </GlassCard>
    )
  }

  const { headline, blurb } = MOODS[mood]
  const { weather, main, name } = current

  return (
    <GlassCard className="banner">
      <WeatherIcon id={weather[0].id} isDay={isDaytime(current)} size={76} label={weather[0].description} />
      <div className="banner-text">
        <p className="banner-weather">
          <span className="banner-temp">{deg(main.temp)}°C</span>
          <span className="desc">{weather[0].description}</span> in {name}
        </p>
        <p className="banner-headline">
          {headline}: <span className="accent">50% off</span>
        </p>
        <p className="muted">{blurb}. Specials change with the weather.</p>
      </div>
      <span className="pill">{themeLabel}</span>
    </GlassCard>
  )
}
