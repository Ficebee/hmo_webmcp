# Agent Integration Guide

**HMO.InnerVoice - an agent-accessible social knowledge experience powered by WebMCP**

Official website: https://hmoinnervoice.com

## Primary Integration Path

```text
Browser
  |
  v
HMO.InnerVoice webpage
  |
  v
document.modelContext.registerTool()
  |
  v
WebMCP
  |
  v
AI agent
```

The HMO.InnerVoice challenge prototype does not require an HTTP tool bridge, API key, hosted database, or production backend. The webpage registers WebMCP tools directly when it is opened in a WebMCP-capable browser.

## Local Demo

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8080
```

When the page runs inside a WebMCP-capable in-app browser, `app/script.js` calls `document.modelContext.registerTool()` and exposes the HMO.InnerVoice tools to the AI agent.

## Registered Tools

```json
[
  "discover_selected",
  "explain_selection",
  "explore_approaches",
  "explore_perspectives",
  "explore_evidence",
  "identify_gaps"
]
```

## Example Agent Questions

- "Based on HMO.InnerVoice, who is making a difference in inclusive employment?"
- "Explain why Leonard Cheshire was selected."
- "Compare approaches to accessibility and participation."
- "What evidence supports RNIB's inclusion in this dataset?"
- "What perspectives are represented?"
- "Where are the gaps in this public demo dataset?"

## Example Tool Result Shape

```json
{
  "project": "HMO.InnerVoice - an agent-accessible social knowledge experience powered by WebMCP",
  "officialWebsite": "https://hmoinnervoice.com",
  "query": "inclusive employment",
  "totalMatches": 5,
  "entities": [
    {
      "id": "org_003_leonard_cheshire",
      "name": "Leonard Cheshire Disability",
      "country": "United Kingdom",
      "entityType": "organisation",
      "selectionRationale": "Selected for demonstrating holistic support for disabled people including employment, housing and community participation, with evidence-based programmes.",
      "contributionAreas": ["Inclusive Employment", "Community Integration", "Advocacy & Policy", "Independent Living"],
      "beehiveDemo": {
        "status": "selected",
        "disclosure": "Challenge demo metadata only; not a real commercial/provider relationship claim."
      }
    }
  ],
  "note": "This is a public OpenAI Challenge prototype using curated public demo data only."
}
```

Entities without Beehive challenge-demo metadata omit the `beehiveDemo` field entirely.

## Stdio Compatibility

For local experiments with stdio MCP clients, this repo also includes:

```bash
npm run mcp:stdio
```

That compatibility server is not the primary challenge demo path. The website/WebMCP story is the browser-native `document.modelContext.registerTool()` flow.

## Public Safety

This repo intentionally contains only public challenge data and public-demo logic. It does not contain:

- Production HMO.InnerVoice backend code
- Production Beehive infrastructure
- Real API keys or credentials
- Private user data
- Proprietary ranking, curation, or knowledge graph infrastructure
