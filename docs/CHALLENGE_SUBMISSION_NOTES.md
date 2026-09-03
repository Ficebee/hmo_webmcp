# HMO.InnerVoice WebMCP Challenge Submission Notes

## What We Added for the WebMCP Challenge

The challenge implementation adds a public-safe WebMCP demonstration layer to the HMO.InnerVoice project.

Added or expanded for the challenge:

- Browser-side WebMCP registration through `document.modelContext.registerTool()`.
- Six site tools for discovery, explanation, comparison, perspectives, evidence and gap identification.
- Public-safe organisation dataset focused on inclusive employment and participation.
- Evidence-aware structured responses for agents.
- Explicit organisation selection state shared between the webpage UI and `explain_selection`.
- Demo disclosures clarifying that Beehive labels are illustrative challenge metadata only.
- Static build and ChatGPT Sites deployment path.

## Existing HMO.InnerVoice Context

HMO.InnerVoice existed before this WebMCP challenge as an awareness and advocacy platform. Its broader direction includes human voice, awareness, social issues, understanding, perspectives, evidence, wellbeing, inclusivity, sustainability, ethical living and positive social change.

The challenge site should not imply that HMO.InnerVoice is only an inclusive employment website. Inclusive employment and participation are one demonstration topic within a broader HMO.InnerVoice direction.

The repository should also avoid presenting planned future areas such as Soul of Places, environments, booking, events or broader topic systems as already implemented in this challenge prototype unless those features are actually present in the deployed code.

## Product Distinctions

HMO.InnerVoice highlights organisations and practices for editorial and educational reasons.

Being highlighted by HMO.InnerVoice does not mean:

- endorsement of everything the organisation does;
- certification;
- ranking;
- commercial partnership;
- Beehive provider approval;
- preferred provider status.

Beehive provider selection, if any, is independent from HMO.InnerVoice editorial curation.

## Longer-Term Vision

This inclusive-employment demonstration is one topic within a broader vision for HMO.InnerVoice as an awareness, advocacy and knowledge environment covering mental health, wellbeing, inclusivity, sustainability, ethical living, environments, Soul of Places and related areas. WebMCP could eventually allow agents to work across this curated knowledge layer, helping people understand issues, compare approaches, discover relevant organisations and places, explore perspectives and move from awareness toward informed action. This is future direction, not current implemented functionality.

## Judging Criteria Crosswalk

| Judging Criterion | What HMO.InnerVoice Demonstrates |
| --- | --- |
| WebMCP Leverage | The same human-readable webpage exposes intentional structured tools through WebMCP, including a tool that uses current webpage selection state. |
| Execution | The site runs as a working static web app, builds with npm, exposes six tools, uses public JSON data and can be deployed through ChatGPT Sites. |
| Potential Impact | HMO.InnerVoice shows how awareness and advocacy content can become more explorable, evidence-aware and useful for people using AI agents. |
| Creativity & Ambition | The project treats the open web as a shared interface for humans and agents, with future room for topics, perspectives, places, environments and evidence discovery. |

## Final Recording Checklist

- Live site works.
- Site remains private until final public release is approved.
- Six WebMCP tools are discoverable.
- Organisation selection works through an explicit `Select` action.
- Selected organisation is visually identifiable.
- `explain_selection` returns the selected organisation.
- There is no automatic fallback to the first organisation.
- Comparison or synthesis prompt works across multiple organisations.
- Evidence/source prompt returns source-backed information.
- Browser/session is clean.
- Future functionality is not represented as already implemented.
- Existing HMO.InnerVoice context and WebMCP challenge additions are accurately distinguished.
- Narration is clear.
- Video is under three minutes.
- Final video matches the submitted live version.
