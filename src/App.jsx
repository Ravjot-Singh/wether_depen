import { useEffect, useMemo } from 'react'
import WeatherBackground from './components/WeatherBackground.jsx'
import WeatherBanner from './components/WeatherBanner.jsx'
import SpecialsSection from './components/SpecialsSection.jsx'
import MenuSection from './components/MenuSection.jsx'
import Credits from './components/Credits.jsx'
import { useWeather } from './hooks/useWeather.js'
import { resolveTheme } from './theme/resolveTheme.js'
import { DEFAULT_THEME, THEMES } from './theme/themes.js'
import { resolveMood } from './menu/mood.js'
import { specialsFor } from './menu/items.js'

const CITY = import.meta.env.VITE_DEFAULT_CITY || 'London'

function getPreview() {
  if (!import.meta.env.DEV) return {}
  const params = new URLSearchParams(window.location.search)
  const theme = params.get('theme')
  if (!theme || !THEMES[theme]) return {}
  const temp = params.has('temp') ? Number(params.get('temp')) : undefined
  return { theme, temp: Number.isFinite(temp) ? temp : undefined }
}

function useThemeVars(theme) {
  useEffect(() => {
    document.documentElement.dataset.tone = theme.tone || 'dark'
    const root = document.documentElement.style
    root.setProperty('--text', theme.text)
    root.setProperty('--text-dim', theme.textDim)
    root.setProperty('--accent', theme.accent)
    root.setProperty('--card-bg', theme.cardBg)
    root.setProperty('--card-border', theme.cardBorder)
  }, [theme])
}

export default function App() {
  const preview = useMemo(getPreview, [])
  const { status, current, error } = useWeather(CITY, preview.theme, preview.temp)

  const themeKey = current ? resolveTheme(current) : DEFAULT_THEME
  const theme = THEMES[themeKey]
  useThemeVars(theme)

  const mood = current ? resolveMood(current) : null
  const specials = useMemo(() => (mood ? specialsFor(mood) : []), [mood])
  const specialIds = useMemo(() => new Set(specials.map((item) => item.id)), [specials])

  useEffect(() => {
    document.title = specials.length ? `50% off ${specials[0].name} & more · Weather Bites` : 'Weather Bites'
  }, [specials])

  return (
    <>
      <WeatherBackground themeKey={themeKey} theme={theme} />
      <main className="app">
        <header className="brand">
          <span className="brand-name">Weather Bites</span>
          <span className="muted">Food for the weather outside</span>
        </header>

        <WeatherBanner status={status} current={current} error={error} mood={mood} themeLabel={theme.label} city={CITY} />

        {specials.length > 0 && <SpecialsSection mood={mood} items={specials} />}

        <MenuSection specialIds={specialIds} />

        <Credits />

        {preview.theme && (
          <p className="preview-badge">
            Preview: {preview.theme}
            {preview.temp !== undefined && `, ${preview.temp}°C`} (mock weather)
          </p>
        )}
      </main>
    </>
  )
}
