const API_ROOT = 'https://api.pokemontcg.io/v2'

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
      body: '',
    }
  }

  const API_KEY =
    process.env.POKEMONTCG_API_KEY ??
    process.env.VITE_POKEMONTCG_API_KEY ??
    ''

  try {
    const qs = event.queryStringParameters || {}
    const endpoint = qs.endpoint || 'cards'
    const url = new URL(`${API_ROOT}/${endpoint}`)
    for (const [k,v] of Object.entries(qs)) if (k !== 'endpoint') url.searchParams.set(k, v)

    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        ...(API_KEY ? { 'X-Api-Key': API_KEY } : {}), // only send if present
      },
    })
    const body = await res.text()
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message }),
    }
  }
}
