import React, { useState, useEffect } from 'react'
import { askAi, analyzeLog, uploadFile, subscribeAnalytics } from './api'

export default function App() {
  const [tab, setTab] = useState('ask')

  return (
    <div className="container">
      <h1>AI Frontend</h1>
      <nav className="tabs">
        <button className={`tab ${tab === 'ask' ? 'active' : ''}`} onClick={() => setTab('ask')}>Ask</button>
        <button className={`tab ${tab === 'analyze' ? 'active' : ''}`} onClick={() => setTab('analyze')}>Analyze</button>
        <button className={`tab ${tab === 'upload' ? 'active' : ''}`} onClick={() => setTab('upload')}>Upload</button>
        <button className={`tab ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}>Analytics (SSE)</button>
      </nav>
      <main>
        {tab === 'ask' && <AskTab />}
        {tab === 'analyze' && <AnalyzeTab />}
        {tab === 'upload' && <UploadTab />}
        {tab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  )
}

function AskTab() {
  const [prompt, setPrompt] = useState('')
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    setResp(null)
    try {
      const data = await askAi(prompt)
      setResp(data)
    } catch (e) {
      setResp({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask AI..." />
      <div className="row">
        <button onClick={submit} disabled={loading || !prompt}>Send</button>
      </div>
      <pre className="result">{resp ? JSON.stringify(resp, null, 2) : 'No response yet'}</pre>
    </section>
  )
}

function AnalyzeTab() {
  const [prompt, setPrompt] = useState('')
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    setResp(null)
    try {
      const data = await analyzeLog(prompt)
      setResp(data)
    } catch (e) {
      setResp({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Paste logs or prompt to analyze..." />
      <div className="row">
        <button onClick={submit} disabled={loading || !prompt}>Analyze</button>
      </div>
      <pre className="result">{resp ? JSON.stringify(resp, null, 2) : 'No analysis yet'}</pre>
    </section>
  )
}

function UploadTab() {
  const [file, setFile] = useState(null)
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!file) return
    setLoading(true)
    setResp(null)
    try {
      const data = await uploadFile(file)
      setResp(data)
    } catch (e) {
      setResp({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="row">
        <button onClick={submit} disabled={loading || !file}>Upload</button>
      </div>
      <pre className="result">{resp ? JSON.stringify(resp, null, 2) : 'No upload yet'}</pre>
    </section>
  )
}

function AnalyticsTab() {
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeAnalytics(
      (msg) => {
        setConnected(true)
        setLogs((s) => [msg, ...s].slice(0, 200))
      },
      () => {
        setConnected(false)
      }
    )
    return unsubscribe
  }, [])

  return (
    <section>
      <div className="row">
        <strong>Connected:</strong> {connected ? 'yes' : 'no'}
      </div>
      <ul className="logs">
        {logs.map((l, i) => (
          <li key={i}>
            <strong>{l.severity}</strong> — {l.summary}
            <div className="small">Root cause: {l.rootCause}</div>
            <div className="small">Fix: {l.fixSuggestion}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
