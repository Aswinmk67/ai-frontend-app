# AI Frontend App

Simple React + Vite frontend for the provided OpenAPI endpoints.

Available endpoints used:
- `POST /api/v1/ai/ask` (application/json) -> `PromptResponse`
- `POST /api/v1/ai/analyze` (application/json) -> `PromptLogResponse`
- `POST /api/v1/ai/upload` (multipart/form-data) -> `PromptLogResponse`
- `GET /api/v1/analytics/all` (text/event-stream) -> stream of `LogAnalysis`

Quick start:

```bash
npm install
npm run dev
```

Notes:
- The client assumes same origin for the API. If your server runs on `http://localhost:8080`, set `base` in `src/api.js` to `http://localhost:8080`.
- SSE handler expects JSON messages per event.
