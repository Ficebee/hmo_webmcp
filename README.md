# HMO.InnerVoice WebMCP Challenge Prototype

HMO.InnerVoice is a platform focused on human voice, awareness, social issues, understanding, perspectives, evidence and positive social change.

This repository contains the public OpenAI WebMCP Challenge prototype. It is not the full HMO.InnerVoice production platform. The prototype demonstrates one topic within the broader HMO.InnerVoice direction:

**Diverse Abilities, Meaningful Contributions**

Human ability does not take a single form. People experience, understand and engage with the world in different ways. This prototype explores how people with diverse physical, sensory, cognitive, neurological and communication abilities contribute to communities and societies.

## Challenge Demo

The project demonstrates a human-readable website that also exposes structured capabilities to an AI agent through browser-native WebMCP.

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

The primary challenge path is the webpage. When `app/index.html` is opened in a WebMCP-capable in-app browser, `app/script.js` registers HMO.InnerVoice tools with `document.modelContext.registerTool()`.

## What This Prototype Shows

The current demonstration topic is inclusive employment and participation.

The public dataset includes:

- 12 public demo entities
- 14 contribution categories
- 19 public evidence sources
- Multiple perspectives across lived experience, employers, service providers, research, policy, arts, technology and community participation
- Transparent HMO.InnerVoice selection rationale for every entity

This is not a ranking, certification or endorsement system. HMO.InnerVoice highlights organisations and practices for editorial and educational reasons, based on public demo data.

Beehive labels and services in this repository are illustrative challenge-demo metadata only. They do not state or imply real commercial, contractual, provider, partnership or endorsement relationships.

## WebMCP Tools

The webpage registers six browser WebMCP tools:

- `discover_selected`
- `explain_selection`
- `explore_approaches`
- `explore_perspectives`
- `explore_evidence`
- `identify_gaps`

`explain_selection` operates on the organisation currently selected by the user in the live webpage. It does not accept an organisation name or id as fallback input, and it does not default to Accenture or the first entity. If no organisation is selected, it returns a structured `NO_ORGANISATION_SELECTED` response.

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

`npm run dev` serves the HMO.InnerVoice webpage, public demo data and WebMCP-related documentation files.

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
- Explicit organisation selection state
- `explain_selection` no-fallback behavior
- Tool names and demo-question coverage
- Static build inputs
- Public-demo security expectations
- Demo and judge-guide documentation

## ChatGPT In-App Browser Testing

To test the intended WebMCP path:

1. Open the HMO.InnerVoice site in ChatGPT's in-app browser or another supported WebMCP-capable browser.
2. Confirm the site tools are available.
3. Select an organisation card using the `Select` button.
4. Ask: "Explain this organisation in simpler terms."
5. Confirm the response matches the selected organisation and does not fall back to the first record.

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
|-- docs/                 # Demo script, judge guide and submission notes
|-- scripts/build.js      # Static build script
|-- webmcp/               # Tool schemas, shared logic, and stdio MCP compatibility server
|-- app-server.js         # Local static server
|-- package.json
|-- package-lock.json
`-- test-end-to-end.js
```

## Public / Private Boundary

This repository is intended to be safe for a public challenge demo because it uses public sources, static JSON data and demo-only capability logic.

It does not contain:

- Production HMO.InnerVoice backend code
- Private HMO.InnerVoice architecture
- Production Beehive infrastructure
- Real credentials or API keys
- Private user data
- Confidential partner/provider data
- Proprietary ranking, curation or knowledge graph infrastructure

The implementation intentionally uses small rule-based matching over public demo JSON so the agent-accessible pattern is visible without exposing private platform logic.
