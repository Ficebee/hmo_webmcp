# HMO.InnerVoice Data Model

## Entity Schema

Each entity in the HMO.InnerVoice knowledge base has the following structure:

```json
{
  "id": "string",
  "name": "string",
  "entityType": "organisation|institution|individual|initiative|programme|community_group",
  "country": "string",
  "website": "string (URL)",
  "description": "string (concise description)",
  "contributionAreas": ["string"],
  "selectionRationale": "string (1-2 sentences explaining why HMO.InnerVoice selected this entity)",
  "contributionSummary": "string (factual summary of what they contribute)",
  "insights": "string (analytical insight - what we can learn from them)",
  "perspectives": ["string (perspectives this entity represents)"],
  "evidence": [
    {
      "sourceTitle": "string",
      "sourceUrl": "string",
      "sourceType": "website|report|article|research|government|institution",
      "description": "string (brief explanation of what the source says)",
      "date": "string (YYYY-MM-DD if available)",
      "confidence": "high|medium|low"
    }
  ],
  "beehiveProviderStatus": "selected (optional; challenge-demo examples only)",
  "beehiveDemoDisclosure": "string (required when beehiveProviderStatus is selected)",
  "servicesInBeehive": ["string (demo service labels only)"],
  "lastReviewed": "string (YYYY-MM-DD)",
  "tags": ["string"]
}
```

## Contribution Area Taxonomy

The following contribution areas are supported:

- Inclusive Employment
- Education & Training
- Technology & Innovation
- Accessibility & Assistive Technology
- Entrepreneurship
- Arts & Culture
- Sports & Recreation
- Community Integration
- Policy & Advocacy
- Research & Evidence
- Family Support
- Social Innovation
- Workplace Accommodation
- Career Development

## Source Reference Model

Sources are tracked with:

- `sourceTitle`: Name of the source
- `sourceUrl`: Full URL to the source (must be publicly accessible)
- `sourceType`: Classification (website, report, article, research, government, institution)
- `description`: What the source says about the entity
- `date`: Publication/access date when available
- `confidence`: How confident we are in this information (high/medium/low)

This challenge dataset is based on publicly accessible sources and has been
reviewed for public-source alignment, but it has not been exhaustively verified
for the purposes of the Challenge. It should be treated as a public demo dataset,
not a comprehensive or independently audited knowledge base.

## Terminology Principle

Organisation-specific descriptions should follow the language used by the cited
organisation or public source. HMO.InnerVoice editorial framing should use
established terminology according to context:

- `persons with disabilities` or `people with disabilities` when discussing disability;
- `autistic people` or `people with autism` according to context and stated preference;
- `neurodivergent people` when discussing neurodiversity;
- `people with diverse abilities` when referring to the broader editorial theme.

Source-specific terms such as `disabled people`, `blind and partially sighted
people`, `disabled people with complex needs`, or `Para athletes` may be used
when they match the cited organisation's terminology.

## MVP Scope

The MVP curates approximately 8-15 organisations/institutions focused on:

**"Diverse Abilities, Meaningful Contributions"**

Selection criteria:
1. Demonstrated work in inclusive contribution, participation, and capability
2. Available credible sources
3. Diverse contribution areas and geographic representation where possible
4. Explicit selection rationale grounded in evidence

## Definitions

### SOURCE FACT
Information directly supported by external sources (e.g., "Organisation X operates an inclusive employment programme").

### HMO.INNERVOICE SELECTION/CONTEXT
Why the entity is relevant to HMO.InnerVoice ecosystem (e.g., "Selected because its work demonstrates sustained focus on inclusive employment").

### HMO.INNERVOICE INSIGHT
Synthesis based on available evidence (e.g., "Notable for addressing workforce participation rather than only awareness").

### BEEHIVE DEMO METADATA
Optional public challenge metadata used only to demonstrate how Beehive-style service labels could appear in a WebMCP response. These fields do not state or imply real commercial, contractual, provider, partnership, or endorsement relationships. Entities without this demo-selected status omit the fields entirely.

### AI SYNTHESIS
Final response composed by AI agent—never presented as independently verified fact.
