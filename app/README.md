# HMO.InnerVoice Frontend

This is the WebMCP-enabled webpage for **HMO.InnerVoice - an agent-accessible social knowledge experience powered by WebMCP**.

Official website: https://hmoinnervoice.com

## Purpose

The page presents the public challenge topic **Different Abilities, Shared Contributions** and registers browser-native WebMCP tools for an AI agent when opened in a WebMCP-capable in-app browser.

## Browser WebMCP Path

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

The WebMCP registration lives in `script.js`.

## Run

From the repo root:

```bash
npm run dev
```

Open:

```text
http://localhost:8080
```

## Build

```bash
npm run build
```

The static site is copied to `dist/`.

## Page Features

- Editorial topic introduction
- Contribution category explorer
- Featured entities with transparent HMO.InnerVoice selection rationale
- Entity details modal
- Public evidence/source attribution
- Browser-native WebMCP tool registration
- Beehive challenge-demo metadata only when present

## Registered WebMCP Tools

- `discover_selected`
- `explain_selection`
- `explore_approaches`
- `explore_perspectives`
- `explore_evidence`
- `identify_gaps`

## Data

The page loads:

- `../data/entities.json`
- `../data/contribution-categories.json`

The dataset is public challenge data only. Beehive labels are illustrative challenge metadata and do not state or imply real commercial, contractual, provider, partnership, or endorsement relationships.
