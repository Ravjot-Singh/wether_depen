import { useEffect, useState } from 'react'
import { getCurrent } from '../api/weather.js'
import { mockWeather } from '../api/mock.js'

const REFRESH_MS = 10 * 60 * 1000

export function useWeather(city, previewTheme, previewTemp) {
  const [state, setState] = useState({ status: 'loading', current: null, error: null })

  useEffect(() => {
    if (previewTheme) {
      setState({ status: 'ready', current: mockWeather(previewTheme, city, previewTemp), error: null })
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        const current = await getCurrent(city)
        if (!cancelled) setState({ status: 'ready', current, error: null })
      } catch (error) {
        if (!cancelled) setState((s) => ({ ...s, status: s.current ? 'ready' : 'error', error }))
      }
    }

    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [city, previewTheme, previewTemp])

  return state
}
