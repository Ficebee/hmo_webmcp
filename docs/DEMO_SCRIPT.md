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

### 1:10-1:35 - Ask About the Current Selection

Prompt: "Explain this organisation in simpler terms."

Action: Ask ChatGPT the prompt without typing the organisation name.

Narration: "Now I ask a natural question: explain this organisation in simpler terms. I do not tell ChatGPT which organisation I selected."

Expected WebMCP behavior: ChatGPT invokes `explain_selection`.

Expected visible/result: The response corresponds to the organisation selected in the webpage, not Accenture or the first record. The answer should include why HMO.InnerVoice highlights it, what it contributes, perspectives represented, and evidence.

Judging criterion: WebMCP Leverage, Execution.

### 1:35-1:55 - Follow the Selected Context

Prompt: "Why is Microsoft's approach significant?"

Action: Ask ChatGPT a follow-up while the same organisation remains selected.

Narration: "The agent can continue from the selected page context and explain why the approach matters, while staying grounded in HMO.InnerVoice's structured information."

Expected WebMCP behavior: ChatGPT uses the selected organisation context from `explain_selection`.

Expected visible/result: The response explains the significance of Microsoft's disability hiring and accessibility approach without treating it as a ranking or endorsement.

Judging criterion: WebMCP Leverage, Potential Impact.

### 1:55-2:15 - Explain Human Impact

Prompt: "How does this help neurodivergent people?"

Action: Ask ChatGPT the prompt.

Narration: "This shows how an agent can turn structured evidence into accessible explanation for a human question."

Expected WebMCP behavior: ChatGPT uses the selected organisation context and relevant perspectives.

Expected visible/result: The response explains neurodiversity-related employment pathways and support in plain language, within the limits of the dataset.

Judging criterion: Potential Impact, Execution.

### 2:15-2:35 - Demonstrate Higher-Order Capability

Prompt: "Compare this organisation with another organisation on the site."

Action: Ask ChatGPT the prompt.

Narration: "WebMCP becomes more valuable when the agent can work across structured content. Here, the agent moves beyond one visible card and compares approaches across the site."

Expected WebMCP behavior: ChatGPT invokes `explore_approaches` or combines relevant WebMCP tool output with conversational synthesis.

Expected visible/result: The response compares multiple organisations, describes different approaches, and avoids simplistic rankings.

Judging criterion: WebMCP Leverage, Creativity & Ambition, Potential Impact.

### 2:35-2:45 - Employer Learning

Prompt: "What can employers learn from this?"

Action: Ask ChatGPT the prompt.

Narration: "The final value is practical: the agent helps translate the website's curated examples into thoughtful lessons people can act on."

Expected WebMCP behavior: ChatGPT uses selected-organisation context and may draw on comparison or evidence outputs where appropriate.

Expected visible/result: Response identifies transferable employer lessons, such as structured hiring pathways, accessibility, accommodations, and learning from lived experience.

Judging criterion: Potential Impact, Creativity & Ambition.

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

## Follow-Up Prompts for Recording

Use these after selecting Microsoft:

1. "Explain this organisation in simpler terms."
2. "Why is Microsoft's approach significant?"
3. "How does this help neurodivergent people?"
4. "Compare this organisation with another organisation on the site."
5. "What can employers learn from this?"
