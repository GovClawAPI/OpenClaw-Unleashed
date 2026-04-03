# API Reference

## Platform Endpoints

### GovClaw Agent Platform
**URL**: `https://govclaw.vortiqxconsilium.com`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/claw/platform/register` | None | Register a new agent |
| POST | `/claw/platform/login` | Credentials | Login (agent_id or email) |
| POST | `/claw/platform/chat` | Session token | Governed LLM chat |
| GET | `/claw/platform/history` | Session token | Conversation history |
| GET | `/claw/my/profile` | Session token | Agent profile + capabilities |
| GET | `/claw/my/tools` | Session token | Available tools (91+) |
| GET | `/claw/my/evidence` | Session token | Evidence trail |
| GET | `/health` | None | Server status |

### OpenClaw API
**URL**: `https://openclawapi.vortiqxconsilium.com`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/claw/skill-api/register` | API key | Register agent for governance |
| POST | `/claw/skill-api/heartbeat` | Skill token | Update agent status |
| POST | `/claw/shield/scan-action` | None | Scan any action (rate limited) |
| GET | `/claw/agents` | None | List registered agents |
| GET | `/claw/evidence` | None | Evidence chain |

### MCP Protocol
**URL**: `https://govclaw.vortiqxconsilium.com/mcp`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/mcp/message` | API key* | JSON-RPC 2.0 tool calls |
| GET | `/mcp/tools` | None | List available tools |
| GET | `/mcp/tools-version` | None | Tool version check |
| GET | `/mcp/resources` | None | List MCP resources |
| GET | `/mcp/sse` | API key | Server-sent events |

*`initialize` and `ping` methods are exempt from auth.

### Forensic Analysis
**URL**: `https://govclaw.vortiqxconsilium.com/forensic`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/forensic/analyze/physics` | None | Upload file for analysis |
| POST | `/forensic/analyze/json` | None | Analyse image from base64 |
| POST | `/forensic/analyze/url` | None | Analyse image from URL |
| GET | `/forensic/vtokens` | Internal only | List V-Token evidence |
| GET | `/forensic/vtoken/{id}` | Internal only | View V-Token |
| GET | `/forensic/download?token=` | One-time token | Download V-Token (burns after use) |

---

## Authentication

### API Key
Set via `X-API-Key` header or `Authorization: Bearer <key>` header.

```bash
curl -X POST https://govclaw.vortiqxconsilium.com/mcp/message \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_threats","arguments":{}}}'
```

### Session Token
Obtained from `/claw/platform/login`. Pass as query param `?token=` or in request body `session_token`.

### Localhost
All endpoints are open from localhost (127.0.0.1) without authentication.

---

## Rate Limits

| Tier | Messages/Day | Tokens/Day | Shield Scans/Day |
|------|-------------|------------|-----------------|
| Basic | 50 | 10,000 | 100 |
| Pro | 200 | 50,000 | 500 |
| Enterprise | 1,000 | 200,000 | Unlimited |

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request — missing or invalid parameters |
| 401 | Unauthorized — invalid session or credentials |
| 403 | Forbidden — API key required or insufficient permissions |
| 404 | Not found |
| 410 | Gone — one-time download token already used |
| 429 | Rate limited |
| 500 | Internal server error |

### MCP JSON-RPC Errors

| Code | Meaning |
|------|---------|
| -32700 | Parse error — invalid JSON |
| -32600 | Invalid request — not JSON-RPC 2.0 |
| -32601 | Method not found |
| -32001 | API key required |
