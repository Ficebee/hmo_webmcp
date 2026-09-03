# HMO.InnerVoice WebMCP Challenge Demo Script

Target length: 2:30 to 2:45.

## Demo Arc

Discover -> Select -> Ask -> Understand -> Compare / Synthesize

## Timestamped Script

### 0:00-0:15 - Open the Site

On screen: HMO.InnerVoice website hero, "Diverse Abilities, Meaningful Contributions".

Action: Open the live HMO.InnerVoice WebMCP challenge site in ChatGPT's in-app browser.

Narration: "HMO.InnerVoice is an awareness and advocacy platform. This challenge prototype shows one topic within that broader direction: diverse abilities and meaningful contribution. The website remains useful to people directly, while also exposing structured WebMCP tools to an AI agent."

Expected WebMCP behavior: The page loads and registers site tools through `document.modelContext.registerTool()`.

Judging criterion: WebMCP Leverage, Potential Impact.

### 0:15-0:30 - Show Human-Readable Value

On screen: Scroll briefly through topic framing, ways of contribution, and organisation cards.

Action: Pause on the "Who is making a difference in inclusive employment?" section.

Narration: "A human visitor can browse the issue, read why HMO.InnerVoice highlights each organisation, inspect contribution areas, and open evidence-backed details without needing an AI agent."

Expected visible result: Organisation cards and contribution context are visible.

Judging criterion: Execution, Potential Impact.

### 0:30-0:45 - Confirm Available Site Tools

On screen: ChatGPT in-app browser site tools panel.

Action: Open Available site tools.

Narration: "Because the page supports WebMCP, ChatGPT can see intentional tools exposed by the website, rather than scraping the page as unstructured text."

Expected WebMCP behavior: Six tools are listed:

- `discover_selected`
- `explain_selection`
- `explore_approaches`
- `explore_perspectives`
- `explore_evidence`
- `identify_gaps`

Judging criterion: WebMCP Leverage.

### 0:45-1:10 - Select a Non-Default Organisation

On screen: Organisation cards.

Action: Click `Select` on "Microsoft - Disability Hiring Initiative" or another organisation that is not the first/default card.

Narration: "I am selecting Microsoft directly in the webpage. This is not just opening a modal. The selected organisation becomes shared page state for both the human interface and the WebMCP tool."

Expected visible result: The Microsoft card is visibly marked selected and its button changes to `Selected`.

Expected WebMCP behavior: `selectedEntityId` is updated in the page state.

Judging criterion: WebMCP Leverage, Execution.

### 1:10-1:40 - Ask About the Current Selection

Prompt: "Explain this organisation."

Action: Ask ChatGPT the prompt without typing the organisation name.

Narration: "Now I ask a natural question: explain this organisation. I do not tell ChatGPT which organisation I selected."

Expected WebMCP behavior: ChatGPT invokes `explain_selection`.

Expected visible/result: The response corresponds to the organisation selected in the webpage, not Accenture or the first record. The answer should include why HMO.InnerVoice highlights it, what it contributes, perspectives represented, and evidence.

Judging criterion: WebMCP Leverage, Execution.

### 1:40-2:20 - Demonstrate Higher-Order Capability

Prompt: "Compare approaches to inclusive employment in this HMO.InnerVoice dataset. Focus on what can be learned, not rankings."

Action: Ask ChatGPT the prompt.

Narration: "WebMCP becomes more valuable when the agent can work across structured content. Here, the agent compares approaches across multiple organisations and synthesizes lessons while staying grounded in the site's dataset."

Expected WebMCP behavior: ChatGPT invokes `explore_approaches` or combines relevant WebMCP tool output with conversational synthesis.

Expected visible/result: The response compares multiple organisations, describes different approaches, and avoids simplistic rankings.

Judging criterion: WebMCP Leverage, Creativity & Ambition, Potential Impact.

### 2:20-2:40 - Evidence and Trust

Prompt: "What evidence supports these approaches?"

Action: Ask ChatGPT the prompt.

Narration: "HMO.InnerVoice is designed to separate claims, evidence, perspectives and interpretation. The agent can help users inspect source-backed information instead of treating a website as a black box."

Expected WebMCP behavior: ChatGPT invokes `explore_evidence` where appropriate.

Expected visible/result: Response includes public source titles, source types, confidence levels and limitations.

Judging criterion: Execution, Potential Impact.

### 2:40-2:45 - Close

On screen: Website and ChatGPT response.

Narration: "The point is simple: the open web should not have to choose between interfaces for people and interfaces for AI agents. HMO.InnerVoice shows both working from the same trusted knowledge layer."

Judging criterion: Creativity & Ambition.

## Do Not Show

- Do not spend time explaining all future HMO.InnerVoice plans.
- Do not present Soul of Places, booking, events, or broader topic systems as implemented in this challenge prototype.
- Do not describe Beehive demo metadata as provider status, partnership, endorsement, or commercial relationship.
- Do not show every tool merely because it exists.
- Do not ask ChatGPT by typing the selected organisation name during the selection test.
- Do not use the first/default organisation for the main selection demo.
