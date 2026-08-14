const base = '' // assumes same origin; use http://localhost:8080 if needed

export async function askAi(prompt) {
  const res = await fetch(`${base}/api/v1/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function analyzeLog(prompt) {
  const res = await fetch(`${base}/api/v1/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${base}/api/v1/ai/upload`, {
    method: 'POST',
    body: form
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export function subscribeAnalytics(onMessage, onError) {
  const url = `${base}/api/v1/analytics/all`
  const es = new EventSource(url)
  es.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data)
      onMessage(payload)
    } catch (err) {
      console.error('SSE parse error', err)
    }
  }
  es.onerror = (e) => {
    if (onError) onError(e)
    es.close()
  }
  return () => es.close()
}
