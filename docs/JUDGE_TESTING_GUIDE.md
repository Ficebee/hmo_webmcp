# Judge Testing Guide

## Access

Live URL: https://hmo-innervoice-webmcp.ai737.chatgpt.site

Recommended environment: ChatGPT's in-app browser or another supported WebMCP-enabled browser environment.

Current access status: private owner testing. Make the site public only when ready for final challenge submission.

## Verify WebMCP

1. Open the HMO.InnerVoice live URL in ChatGPT's in-app browser.
2. Open the site tools panel.
3. Confirm six WebMCP tools are available:
   - `discover_selected`
   - `explain_selection`
   - `explore_approaches`
   - `explore_perspectives`
   - `explore_evidence`
   - `identify_gaps`

## Test 1 - Page Context / Selection

User action: Select an organisation other than the first/default organisation, for example "Microsoft - Disability Hiring Initiative".

Prompt: "Explain this organisation."

Expected result:

- ChatGPT invokes `explain_selection`.
- The response matches the organisation selected in the webpage.
- The response does not default to Accenture or another first record.
- If no organisation is selected, the tool returns `NO_ORGANISATION_SELECTED` and asks the user to select one.

Why this matters: This proves WebMCP can work with the human user's current webpage state.

## Test 2 - Higher-Order WebMCP Capability

User action: Keep the page open after reviewing the organisation cards.

Prompt: "Compare approaches to inclusive employment in this HMO.InnerVoice dataset. Focus on what can be learned, not rankings."

Expected result:

- ChatGPT invokes `explore_approaches` or uses relevant WebMCP tool output.
- The response compares multiple organisations or initiatives.
- The response describes approaches, contribution areas and lessons.
- The response avoids unsupported "best" or "top" rankings.

What it proves: WebMCP lets an agent work across structured site knowledge, not just summarize a visible card.

## Test 3 - Evidence Awareness

Prompt: "What evidence supports the inclusive employment examples?"

Expected result:

- ChatGPT invokes `explore_evidence` where appropriate.
- The response includes source titles, source types, source URLs, confidence levels and limitations.
- The response distinguishes public sources from HMO.InnerVoice interpretation.

What it proves: The site exposes evidence-aware structured content to the agent.

## Troubleshooting

- If site tools do not appear, confirm the site is opened inside ChatGPT's in-app browser or a WebMCP-capable browser.
- If `explain_selection` returns `NO_ORGANISATION_SELECTED`, click `Select` on an organisation card and retry.
- If the live URL is private, judges need access enabled before testing.
- If a browser cache shows old UI, refresh the page before testing.
