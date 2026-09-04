# HMO.InnerVoice WebMCP Challenge Prototype

HMO.InnerVoice: A curated knowledge, insight, awareness and advocacy platform about social-impact organizations accessible to AI agents through the Model Context Protocol (WebMCP).

This public OpenAI Challenge prototype demonstrates how a knowledge website can expose structured, evidence-aware capabilities directly to an AI agent through a WebMCP-capable browser.


## Demo Flow

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

The primary integration is browser-native WebMCP. When `app/index.html` is opened in a WebMCP-capable in-app browser, `app/script.js` registers HMO.InnerVoice tools with `document.modelContext.registerTool()`.

## What This Prototype Shows

The topic for this challenge demo is **Diverse Abilities, Meaningful Contributions**.

The public dataset includes:

- 12 public demo entities
- 14 contribution categories
- 19 public evidence sources
- Multiple perspectives across lived experience, employers, service providers, research, policy, arts, technology, and community participation
- Transparent HMO.InnerVoice selection rationale for every entity

The dataset is based on publicly accessible sources and was reviewed for public-source alignment, but it has not been exhaustively verified for the purposes of the Challenge.

Beehive labels and services in this repository are illustrative challenge-demo metadata only. They do not state or imply real commercial, contractual, provider, partnership, or endorsement relationships.

## WebMCP Tools

The webpage registers these tools:

- `discover_selected`
- `explain_selection`
- `explore_approaches`
- `explore_perspectives`
- `explore_evidence`
- `identify_gaps`

`discover_selected` serves the same discovery role as a generic catalog-search example such as `search_products`, but the project-specific name is more accurate because the HMO.InnerVoice demo catalog contains selected public organisations, contribution areas, perspectives and evidence rather than products.

The `webmcp/` directory also keeps a stdio MCP compatibility server for local agent/client experiments, but the challenge demo story is the browser WebMCP path above.

## Run Locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:8080
```

`npm run dev` serves the HMO.InnerVoice webpage and public demo data.

## Build

```bash
npm run build
```

The static site is copied to `dist/` with the public data and docs needed for the demo.

## Test

```bash
npm test
```

The test suite validates:

- Public file structure
- Dataset shape and public-source URLs
- Beehive demo disclosure rules
- Browser-side WebMCP registration
- Tool names and demo-question coverage
- Static build inputs
- Public-demo security expectations

## ChatGPT Desktop / In-App Browser Demo

To test the intended WebMCP path:

1. Open the HMO.InnerVoice site in ChatGPT's in-app browser or another supported WebMCP-capable browser.
2. Confirm the site tools are available.
3. Select an organisation card using the `Select` button.
4. Ask: "Explain this organisation in simpler terms."
5. Confirm the response matches the selected organisation and does not fall back to the first record.

If no organisation has been selected, the `explain_selection` tool returns `NO_ORGANISATION_SELECTED` so the agent can ask the user to choose an organisation instead of guessing.

Additional judge-testing prompts are in `docs/JUDGE_TESTING_GUIDE.md`.

## Demo Materials

- `docs/DEMO_SCRIPT.md` - final short video demo script
- `docs/JUDGE_TESTING_GUIDE.md` - concise judge testing instructions
- `docs/CHALLENGE_SUBMISSION_NOTES.md` - project distinction, judging criteria crosswalk and recording checklist

## Project Structure

```text
hmo_webmcp/
|-- app/                  # WebMCP-enabled public webpage
|-- data/                 # Public challenge dataset and data model
|-- scripts/build.js      # Static build script
|-- webmcp/               # Tool schemas, shared logic, and stdio MCP compatibility server
|-- app-server.js         # Local static server
|-- package.json
|-- package-lock.json
`-- test-end-to-end.js
```

## Public / Private Boundary

This repository is safe for a public challenge demo because it uses public sources, static JSON data, and demo-only capability logic.

It does not contain:

- Production HMO.InnerVoice backend code
- Production Beehive infrastructure
- Real credentials or API keys
- Private user data
- Confidential partner/provider data
- Proprietary ranking, curation, or knowledge graph infrastructure

The implementation intentionally uses small rule-based matching over public demo JSON so the agent-accessible pattern is visible without exposing private platform logic.
