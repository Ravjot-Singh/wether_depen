function messageFor(status, city, body) {
  if (status === 401) {
    return 'Missing or invalid API key. Set OPENWEATHER_API_KEY in .env locally, or in the Vercel project environment variables. New keys can take up to 2 hours to activate.'
  }
  if (status === 404) return `City "${city}" was not found. Check VITE_DEFAULT_CITY.`
  if (status === 429) return 'Rate limit reached. Try again in a minute.'
  return body?.message ? `Weather service error: ${body.message}` : `Weather service error (${status}).`
}

export async function getCurrent(city) {
  let res
  try {
    res = await fetch(`/api/weather?q=${encodeURIComponent(city)}`)
  } catch {
    throw new Error('Network error. Check your connection.')
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(messageFor(res.status, city, body))
    err.status = res.status
    throw err
  }
  return body
}
