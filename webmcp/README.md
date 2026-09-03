# HMO.InnerVoice WebMCP Server

The WebMCP server exposes HMO.InnerVoice's social-impact knowledge and insights to any compatible AI agent through the Model Context Protocol (WebMCP).

## Key Principle

**The AI agent does not need to be owned by HMO.InnerVoice.** The server provides capabilities that any compatible agent can access through standard WebMCP interfaces.

## Architecture

```
AI Agent (ChatGPT, Claude, etc.)
    ↓
WebMCP Protocol (Standard Interface)
    ↓
HMO.InnerVoice Server
    ↓
Five Curated Capabilities
    ↓
Curated Knowledge Base (12 organisations, 24+ sources)
    ↓
Structured Response
    ↓
AI Agent → User
```

## Five Core Capabilities

### 1. Search HMO.InnerVoice Knowledge
**Purpose:** Find relevant entities and insights related to a social issue

**Example Queries:**
- "Who is making a difference in inclusive employment?"
- "What organisations champion accessibility?"
- "Show me technology innovation for different abilities"

**Returns:**
- Matching organisations/institutions
- Contribution areas
- Why HMO.InnerVoice selected them
- Optional Beehive challenge-demo label when present

### 2. Get Entity Insight
**Purpose:** Retrieve detailed structured insight about a specific entity

**What's Included:**
- What they do and contribute
- Why HMO.InnerVoice selected them
- Key insights and distinctive features
- Multiple stakeholder perspectives
- Evidence and source references
- Optional Beehive challenge-demo metadata when present

**Use When:** You want comprehensive information about a specific organisation

### 3. Compare Approaches
**Purpose:** Compare how different entities address the same social issue

**Shows:**
- Different strategies and approaches
- Distinctive features of each
- Contribution areas
- Evidence for each approach
- Patterns and similarities

**Use When:** Understanding different solutions to the same challenge

### 4. Explore Perspectives
**Purpose:** Surface different stakeholder viewpoints on a social issue

**Perspectives Represented:**
- Lived experience (disabled people)
- Employers
- Educators
- Researchers
- Service providers
- Policymakers
- Advocacy organisations

**Use When:** Understanding multi-stakeholder dimensions of an issue

### 5. Explore Evidence
**Purpose:** Explain what evidence supports claims and insights

**Shows:**
- Sources and evidence types
- Confidence levels
- Source URLs (all public and accessible)
- Evidence organized by confidence
- Source types and dates

**Use When:** Verifying claims or understanding evidence base

## Tool Interface

All tools follow the MCP standard interface:

```javascript
// Tool Definition
{
  name: "tool_name",
  description: "What the tool does",
  inputSchema: {
    type: "object",
    properties: { /* parameters */ },
    required: [ /* required params */ ]
  }
}

// Tool Execution
{
  name: "tool_name",
  arguments: { /* parameter values */ }
}

// Response
{
  content: [
    {
      type: "text",
      text: "Structured JSON response"
    }
  ]
}
```

## Demo Mode

This is a challenge demonstrator operating in demo mode:

✅ **Enabled:** Uses only public, curated data
✅ **No production connectivity:** Runs standalone with JSON dataset
✅ **No credentials:** No API keys, secrets, or sensitive configuration
✅ **Safe for public repository:** All data is public-sourced
✅ **Reproducible:** Same results every time

## Data Model

### Entity Structure (20 Fields)
- `id`, `name`, `entityType`, `country`
- `website`, `description`
- `contributionAreas`, `selectionRationale`
- `contributionSummary`, `insights`
- `perspectives`, `evidence` (with confidence levels)
- Optional `beehiveProviderStatus`, `beehiveDemoDisclosure`, `servicesInBeehive` for selected challenge-demo examples only
- `lastReviewed`, `tags`

### Contribution Categories (14)
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

### Source Types
- Website (official sources)
- Report (research reports, white papers)
- Article (news, blog posts)
- Research (academic research)
- Government (government sources)
- Institution (institution websites)

## Running the Server

```bash
# Install dependencies
npm install

# Set environment (demo mode enabled by default)
export PUBLIC_DEMO_MODE=true

# Start the server
npm start

# Or watch mode during development
npm run dev
```

## Environment Variables

```
PUBLIC_DEMO_MODE=true          # Enable demo mode (required)
DATA_PATH=./data/entities.json # Path to entities dataset
CATEGORIES_PATH=./data/contribution-categories.json # Path to categories
LOG_LEVEL=info                 # Logging level: debug, info, warn, error
CORS_ORIGIN=*                  # CORS configuration
```

## Key Design Principles

1. **Capabilities over URLs** — Tools expose operations, not just links
2. **Evidence-aware** — Claims always include source references
3. **Transparent selection** — Why each entity is included is explicit
4. **Multiple perspectives** — Issues shown from different stakeholder viewpoints
5. **Clear boundaries** — Distinction between facts, selection context, and insight
6. **Public-only data** — All sources are public and accessible
7. **Agent-independent** — Works with any MCP-compatible AI agent

## Testing the Server

### Check Tool Availability
```
Request: { "method": "tools/list" }
Response: Array of 5 tools with schemas
```

### Example Tool Call: Search Knowledge
```json
{
  "name": "search_hmo_knowledge",
  "arguments": {
    "query": "inclusive employment",
    "limit": 10
  }
}
```

### Example Tool Call: Get Entity Insight
```json
{
  "name": "get_entity_insight",
  "arguments": {
    "entityId": "org_001_accenture"
  }
}
```

## Important Notes

- **This is a demonstrator**, not the production HMO.InnerVoice platform
- **Public data only** — All entities and sources are public
- **Curated dataset** — 12 carefully selected organisations (not comprehensive)
- **Static data** — Dataset is static JSON (production would use databases)
- **Demo responses** — Tailored for clarity and presentation
- **No ML/AI model** — Uses rules-based matching, not neural networks

## Architecture Considerations

### What This Demonstrates
- ✅ HMO.InnerVoice has distinct, valuable capabilities
- ✅ Knowledge can be exposed through standard interfaces (WebMCP)
- ✅ AI agents can access this without owning the agent themselves
- ✅ Multiple perspective synthesis is possible
- ✅ Evidence-aware reasoning is feasible

### What This Does NOT Claim
- ✗ Comprehensive global knowledge about social issues
- ✗ Real-time data or comprehensive coverage
- ✗ Independent verification of all sources
- ✗ Exhaustive perspective representation
- ✗ Production-scale performance or reliability

## Response Format

All tool responses follow a consistent structure:

```json
{
  "success": true/false,
  "query": "what was asked",
  "results": { /* tool-specific */ },
  "note": "contextual information",
  "limitation": "important caveats"
}
```

## Security Considerations

✅ **Enabled in Demo Mode:**
- Environment variables only (no hardcoded secrets)
- Public dataset only
- No credentials in responses
- CORS disabled by default
- No database credentials
- No API keys

🔒 **For Production:**
- Would require authentication
- Database security hardening
- Rate limiting and DDoS protection
- Audit logging
- Data access controls
- Secrets management
- TLS/HTTPS enforcement

## Extensibility

The server is designed to support additional tools in the future:

```javascript
// Adding a new tool:
1. Create tool implementation in webmcp/tools/
2. Add schema to webmcp/schemas/tools.js
3. Add handler in server.js
4. Test with MCP-compatible agent
```

## References

- **Model Context Protocol:** https://modelcontextprotocol.io
- **WebMCP Specification:** [MCP Protocol Documentation]
- **HMO.InnerVoice:** See challenge prompt and roadmap

## Support

For questions about this demonstrator:
- Check the data model in `data/DATA_MODEL.md`
- Review tool schemas in `webmcp/schemas/tools.js`
- See implementation in `webmcp/tools/`
- Check curated dataset in `data/entities.json`
