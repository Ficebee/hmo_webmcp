# HMO.InnerVoice WebMCP Integration

HMO.InnerVoice is an agent-accessible social knowledge experience powered by WebMCP.

The challenge demo is browser-first:

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

The webpage at `app/index.html` registers tools from `app/script.js` when `document.modelContext.registerTool()` is available. This is the intended path for the ChatGPT desktop app in-app browser or another WebMCP-capable browser.

## Registered Browser Tools

- `discover_selected`: find selected public demo entities for a social issue, contribution area, destination, experience, or awareness topic.
- `explain_selection`: explain why HMO.InnerVoice selected a public demo entity.
- `explore_approaches`: compare approaches across selected public demo entities.
- `explore_perspectives`: surface stakeholder perspectives represented in the dataset.
- `explore_evidence`: return public evidence sources for an entity, claim, or topic.
- `identify_gaps`: identify visible gaps and limitations in the public challenge dataset.

`discover_selected` is the HMO.InnerVoice equivalent of a generic catalog-search tool. The challenge dataset is not a product catalog; it represents editorially selected public demo organisations, perspectives, contribution areas and evidence. For that reason, the recorded WebMCP demo intentionally shows six primary tools and uses the domain-native `discover_selected` name instead of `search_products`.

## Stdio Compatibility Server

This directory also contains a stdio MCP compatibility server in `webmcp/server.js`. It reuses the same public data and helper logic for local agent/client experiments.

Run it directly only when you need stdio MCP compatibility:

```bash
npm run mcp:stdio
```

For the OpenAI Challenge website demo, use:

```bash
npm run dev
```

Then open `http://localhost:8080` in a WebMCP-capable in-app browser.

## Public Data Boundary

The demo uses static public JSON from `data/`.

Beehive challenge-demo labels are illustrative metadata only. They do not state or imply real commercial, contractual, provider, partnership, or endorsement relationships. Entities without selected demo metadata omit Beehive fields.

This directory does not include production HMO.InnerVoice infrastructure, private data, credentials, proprietary ranking, or a production knowledge graph.

## Shared Capability Files

- `schemas/tools.js`: stdio compatibility schemas for the older MCP-style server.
- `tools/*.js`: stdio compatibility handlers.
- `utils/search.js`: small public-demo search and formatting helpers.

The browser WebMCP tool registration lives in `app/script.js`, because WebMCP registration is performed by the webpage through `document.modelContext.registerTool()`.
