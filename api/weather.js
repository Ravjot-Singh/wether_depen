const OWM_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function GET(request) {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) {
    return Response.json({ message: 'OPENWEATHER_API_KEY is not configured' }, { status: 401 })
  }

  const city = new URL(request.url).searchParams.get('q')?.trim()
  if (!city || city.length > 100) {
    return Response.json({ message: 'A valid "q" (city) parameter is required' }, { status: 400 })
  }

  const params = new URLSearchParams({ q: city, appid: key, units: 'metric' })
  let upstream
  try {
    upstream = await fetch(`${OWM_URL}?${params}`)
  } catch {
    return Response.json({ message: 'Could not reach OpenWeatherMap' }, { status: 502 })
  }

  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': upstream.ok ? 'public, s-maxage=300, stale-while-revalidate=600' : 'no-store',
    },
  })
}
