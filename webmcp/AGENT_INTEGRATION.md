# AI Agent Integration Examples

**How to Connect Different AI Agents to HMO.InnerVoice WebMCP**

---

## Overview

HMO.InnerVoice exposes its knowledge through the Model Context Protocol (WebMCP). Any compatible AI agent can query the platform's 5 tools to get curated, evidence-backed insights about "Different Abilities, Shared Contributions."

This guide shows how to integrate with:
1. **Claude** (via Anthropic API)
2. **ChatGPT** (via OpenAI API)
3. **Generic MCP Client** (for testing)

---

## Architecture Diagram

```
┌─────────────────────┐
│   Your AI Agent     │
│ (Claude/ChatGPT)    │
└──────────┬──────────┘
           │
           │ MCP Protocol
           │
┌──────────▼──────────┐
│  WebMCP Server      │
│  (HMO.InnerVoice)   │
│                     │
│  - search_hmo_*     │
│  - get_entity_*     │
│  - compare_*        │
│  - explore_*        │
│  - evidence_*       │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ Curated     │
    │ Knowledge   │
    │ + Evidence  │
    └─────────────┘
```

---

# 1. CLAUDE + HMO.InnerVoice Integration

## Setup

### 1.1 Prerequisites
- Anthropic API key (from claude.ai)
- MCP SDK installed
- WebMCP server running locally

### 1.2 Installation

```bash
# Install MCP client library
npm install @modelcontextprotocol/sdk

# Or use Anthropic's official MCP integration
npm install @anthropic-ai/sdk
```

### 1.3 Configuration File

Create `claude-hmo-config.json`:

```json
{
  "clients": {
    "claude": {
      "command": "node",
      "args": ["path/to/mcp-client.js"],
      "env": {
        "MCP_SERVER": "http://localhost:3000"
      }
    }
  },
  "tools": {
    "search_hmo_knowledge": {
      "enabled": true,
      "description": "Search HMO.InnerVoice knowledge base"
    },
    "get_entity_insight": {
      "enabled": true,
      "description": "Get comprehensive entity information"
    },
    "compare_approaches": {
      "enabled": true,
      "description": "Compare organisation approaches"
    },
    "explore_perspectives": {
      "enabled": true,
      "description": "Explore stakeholder perspectives"
    },
    "explore_evidence": {
      "enabled": true,
      "description": "Explore evidence and sources"
    }
  }
}
```

## Usage Examples

### Example 1: Direct Claude API Call

```javascript
// claude-hmo-example.js
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function queryHMOViaWebMCP() {
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    tools: [
      {
        name: "search_hmo_knowledge",
        description:
          "Search HMO.InnerVoice knowledge base for organisations",
        input_schema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            limit: {
              type: "number",
              description: "Max results",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_entity_insight",
        description: "Get comprehensive insight about an entity",
        input_schema: {
          type: "object",
          properties: {
            entityId: {
              type: "string",
              description: "Entity ID",
            },
          },
          required: ["entityId"],
        },
      },
      {
        name: "explore_evidence",
        description: "Explore evidence supporting claims",
        input_schema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Topic to find evidence for",
            },
            confidenceThreshold: {
              type: "string",
              enum: ["high", "medium", "low"],
              description: "Minimum confidence level",
            },
          },
          required: ["query"],
        },
      },
    ],
    messages: [
      {
        role: "user",
        content:
          "Based on HMO.InnerVoice knowledge, what organisations are making a difference in inclusive employment? Why did HMO.InnerVoice select them? What evidence supports their approaches?",
      },
    ],
  });

  // Process tool calls from Claude
  if (message.stop_reason === "tool_use") {
    for (const block of message.content) {
      if (block.type === "tool_use") {
        console.log(`Tool: ${block.name}`);
        console.log(`Input: ${JSON.stringify(block.input, null, 2)}`);

        // Call your WebMCP server here
        const result = await callWebMCPTool(block.name, block.input);
        console.log(`Result: ${JSON.stringify(result, null, 2)}`);
      }
    }
  }

  return message.content;
}

async function callWebMCPTool(toolName, args) {
  // Make HTTP call to your WebMCP server
  const response = await fetch("http://localhost:3000/tool/" + toolName, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  return await response.json();
}

queryHMOViaWebMCP();
```

### Example 2: Multi-Turn Claude Conversation

```javascript
// claude-multi-turn.js
async function interactiveConversation() {
  const messages = [];

  const userQueries = [
    "Who is making a difference in 'Different Abilities, Shared Contributions'?",
    "What organisations champion this?",
    "Why did HMO.InnerVoice select these organisations?",
    "What approaches are working?",
    "What are the different perspectives?",
    "Where are the gaps?",
    "What evidence supports this?",
  ];

  for (const query of userQueries) {
    console.log(`\nUser: ${query}\n`);

    messages.push({
      role: "user",
      content: query,
    });

    // Add context about HMO.InnerVoice available tools
    const systemMessage =
      "You are an assistant with access to HMO.InnerVoice knowledge. Use the available tools to provide evidence-based, curated responses about social impact topics.";

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemMessage,
      tools: [
        /* 5 HMO tools defined above */
      ],
      messages: messages,
    });

    // Process response
    let assistantContent = "";
    for (const block of response.content) {
      if (block.type === "text") {
        assistantContent += block.text;
      }
    }

    messages.push({
      role: "assistant",
      content: assistantContent,
    });

    console.log(`Claude: ${assistantContent}\n`);
  }
}
```

---

# 2. ChatGPT + HMO.InnerVoice Integration

## Setup

### 2.1 Prerequisites
- OpenAI API key
- GPT-4 or later model
- WebMCP server running

### 2.2 Installation

```bash
# Install OpenAI SDK
npm install openai
```

### 2.3 Configuration

Create `.env`:

```
HMO_WEBMCP_URL=http://localhost:3000
```

## Usage Example

### Example 1: GPT-4 with Function Calling

```javascript
// gpt4-hmo-example.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = [
  {
    type: "function",
    function: {
      name: "search_hmo_knowledge",
      description:
        "Search HMO.InnerVoice knowledge base for organisations addressing a social issue",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query (e.g., 'inclusive employment', 'disability rights')",
          },
          entityType: {
            type: "string",
            enum: ["organisation", "institution", "individual"],
            description: "Filter by entity type",
          },
          contributionArea: {
            type: "string",
            description: "Filter by contribution area (e.g., employment, research)",
          },
          limit: {
            type: "number",
            description: "Maximum number of results",
            default: 5,
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_entity_insight",
      description:
        "Get comprehensive insight about a specific entity including selection rationale, contributions, and evidence",
      parameters: {
        type: "object",
        properties: {
          entityId: {
            type: "string",
            description: "The entity ID",
          },
        },
        required: ["entityId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_approaches",
      description:
        "Compare how different organisations approach the same issue",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The issue to compare approaches on",
          },
          entityIds: {
            type: "array",
            items: { type: "string" },
            description: "Specific entities to compare (optional)",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "explore_perspectives",
      description: "Explore different stakeholder perspectives on an issue",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The issue to explore perspectives on (e.g., 'inclusive employment')",
          },
          perspectiveTypes: {
            type: "array",
            items: { type: "string" },
            description: "Filter by perspective type",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "explore_evidence",
      description:
        "Explore evidence supporting claims about an issue, organized by confidence level",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic to find evidence for",
          },
          confidenceLevel: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "Filter by confidence level",
          },
        },
        required: ["query"],
      },
    },
  },
];

async function chatWithHMO(userMessage) {
  console.log(`User: ${userMessage}\n`);

  const messages = [
    {
      role: "user",
      content: userMessage,
    },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: messages,
    tools: tools,
    tool_choice: "auto",
  });

  // Handle tool calls
  if (response.choices[0].message.tool_calls) {
    for (const toolCall of response.choices[0].message.tool_calls) {
      console.log(`\nGPT calling: ${toolCall.function.name}`);
      console.log(`Arguments: ${toolCall.function.arguments}`);

      const args = JSON.parse(toolCall.function.arguments);
      const result = await callHMOWebMCP(toolCall.function.name, args);

      console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    }
  } else {
    // Direct response
    console.log(`GPT: ${response.choices[0].message.content}`);
  }
}

async function callHMOWebMCP(toolName, args) {
  const response = await fetch(`${process.env.HMO_WEBMCP_URL}/tool/${toolName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error(
      `HMO WebMCP error: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// Example usage
async function runDemo() {
  const queries = [
    "Who is making a difference in inclusive employment?",
    "Why did HMO.InnerVoice select these organisations?",
    "What approaches are working?",
    "What evidence supports this?",
  ];

  for (const query of queries) {
    await chatWithHMO(query);
    console.log("\n---\n");
  }
}

runDemo();
```

### Example 2: Streaming Response

```javascript
// gpt4-streaming.js
async function streamChatWithHMO(userMessage) {
  console.log(`User: ${userMessage}\n`);

  const stream = client.chat.completions.stream({
    model: "gpt-4",
    messages: [{ role: "user", content: userMessage }],
    tools: tools,
    tool_choice: "auto",
  });

  stream.on("contentBlockStart", (event) => {
    if (event.content_block.type === "text") {
      process.stdout.write("GPT: ");
    }
  });

  stream.on("contentBlockDelta", (event) => {
    if (
      event.delta.type === "text_delta" &&
      event.delta.text
    ) {
      process.stdout.write(event.delta.text);
    }
  });

  stream.on("toolUseBlockStart", (event) => {
    console.log(`\n\nCalling: ${event.content_block.name}`);
  });

  stream.on("contentBlockStop", () => {
    console.log("\n");
  });

  await stream.finalMessage();
}
```

---

# 3. Generic MCP Client (Testing)

## Direct Testing Without AI Agent

### 3.1 Using curl

```bash
# List available tools
curl http://localhost:3000/tools/list

# Call search_hmo_knowledge
curl -X POST http://localhost:3000/tool/search_hmo_knowledge \
  -H "Content-Type: application/json" \
  -d '{
    "query": "inclusive employment",
    "limit": 5
  }'

# Call get_entity_insight
curl -X POST http://localhost:3000/tool/get_entity_insight \
  -H "Content-Type: application/json" \
  -d '{
    "entityId": "leonard-cheshire"
  }'

# Call compare_approaches
curl -X POST http://localhost:3000/tool/compare_approaches \
  -H "Content-Type: application/json" \
  -d '{
    "query": "inclusive employment",
    "limit": 3
  }'

# Call explore_evidence
curl -X POST http://localhost:3000/tool/explore_evidence \
  -H "Content-Type: application/json" \
  -d '{
    "query": "inclusive employment",
    "confidenceLevel": "high"
  }'
```

### 3.2 Using Node.js HTTP Client

```javascript
// test-hmo-client.js
const http = require("http");

async function callHMOTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(args);

    const options = {
      hostname: "localhost",
      port: 3000,
      path: `/tool/${toolName}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = http.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function testDemoQuestions() {
  const tests = [
    {
      tool: "search_hmo_knowledge",
      args: { query: "Who is making a difference?", limit: 8 },
      description: "Step 2: Who is making a difference?",
    },
    {
      tool: "search_hmo_knowledge",
      args: { query: "inclusive employment", limit: 5 },
      description: "Step 3: What organisations champion this?",
    },
    {
      tool: "get_entity_insight",
      args: { entityId: "leonard-cheshire" },
      description: "Step 4: Why did HMO select these?",
    },
    {
      tool: "compare_approaches",
      args: { query: "inclusive employment", limit: 4 },
      description: "Step 5: What approaches are working?",
    },
    {
      tool: "explore_perspectives",
      args: { query: "inclusive employment" },
      description: "Step 6: What are different perspectives?",
    },
    {
      tool: "explore_evidence",
      args: { query: "inclusive employment", confidenceLevel: "high" },
      description: "Step 8: What evidence supports this?",
    },
  ];

  for (const test of tests) {
    console.log(`\n========== ${test.description} ==========`);
    console.log(`Tool: ${test.tool}`);
    console.log(`Args: ${JSON.stringify(test.args)}`);

    try {
      const result = await callHMOTool(test.tool, test.args);
      console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

testDemoQuestions();
```

### 3.3 Using Python

```python
# test-hmo-client.py
import requests
import json

BASE_URL = "http://localhost:3000"

def call_hmo_tool(tool_name, args):
    """Call an HMO.InnerVoice tool via HTTP"""
    url = f"{BASE_URL}/tool/{tool_name}"
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, json=args, headers=headers)
    response.raise_for_status()
    return response.json()

def test_demo_questions():
    """Test all 7 demo question scenarios"""
    
    tests = [
        {
            "tool": "search_hmo_knowledge",
            "args": {"query": "Who is making a difference?", "limit": 8},
            "description": "Step 2: Who is making a difference?"
        },
        {
            "tool": "search_hmo_knowledge",
            "args": {"query": "inclusive employment", "limit": 5},
            "description": "Step 3: What organisations champion this?"
        },
        {
            "tool": "get_entity_insight",
            "args": {"entityId": "leonard-cheshire"},
            "description": "Step 4: Why did HMO select these?"
        },
        {
            "tool": "compare_approaches",
            "args": {"query": "inclusive employment", "limit": 4},
            "description": "Step 5: What approaches are working?"
        },
        {
            "tool": "explore_perspectives",
            "args": {"query": "inclusive employment"},
            "description": "Step 6: What are different perspectives?"
        },
        {
            "tool": "explore_evidence",
            "args": {"query": "inclusive employment", "confidenceLevel": "high"},
            "description": "Step 8: What evidence supports this?"
        },
    ]
    
    for test in tests:
        print(f"\n{'='*60}")
        print(f"{test['description']}")
        print(f"{'='*60}")
        print(f"Tool: {test['tool']}")
        print(f"Args: {json.dumps(test['args'], indent=2)}")
        
        try:
            result = call_hmo_tool(test['tool'], test['args'])
            print(f"Result: {json.dumps(result, indent=2)}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_demo_questions()
```

---

# 4. Running Full Integration Demo

## Step 1: Start WebMCP Server

```bash
cd d:\hmo_webmcp
export PUBLIC_DEMO_MODE=true
npm start
```

Expected output:
```
MCP Server initialized with 5 tools
Stdio transport ready for connections
```

## Step 2: Start Frontend (in another terminal)

```bash
npm run app
# Open http://localhost:8080
```

## Step 3: Test Integration (in another terminal)

### Option A: Using Claude

```bash
node claude-hmo-example.js
```

### Option B: Using ChatGPT

```bash
export OPENAI_API_KEY=
node gpt4-hmo-example.js
```

### Option C: Direct Testing

```bash
node test-hmo-client.js
# or
python test-hmo-client.py
```

## Step 4: Observe Results

You should see:
- Tool calls being made to WebMCP
- Curated organisation data returned
- Evidence and sources cited
- Multiple perspectives represented

---

# 5. Example Responses

## Query: "Who is making a difference in inclusive employment?"

### Tool Call
```
Tool: search_hmo_knowledge
Input: {
  "query": "Who is making a difference in inclusive employment?",
  "entityType": "organisation",
  "contributionArea": "Inclusive Employment",
  "limit": 5
}
```

### Response
```json
{
  "matches": [
    {
      "id": "leonard-cheshire",
      "name": "Leonard Cheshire",
      "country": "UK",
      "entityType": "organisation",
      "why_selected": "Selected for sustained commitment to inclusive employment and practical participation pathways.",
      "contribution_areas": ["Inclusive Employment", "Policy & Advocacy"],
      "beehive_demo": {
        "status": "selected",
        "disclosure": "Challenge demo metadata only; not a real commercial/provider relationship claim."
      }
    },
    {
      "id": "remploy",
      "name": "Remploy",
      "country": "UK",
      "entityType": "organisation",
      "why_selected": "Selected for evidence-based approach to employment support and workplace accommodation.",
      "contribution_areas": ["Inclusive Employment", "Workplace Accommodation"],
      "beehive_demo": {
        "status": "selected",
        "disclosure": "Challenge demo metadata only; not a real commercial/provider relationship claim."
      }
    },
    {
      "id": "empleyrtech",
      "name": "EmpleYarTech",
      "country": "Emerging Markets",
      "entityType": "organisation",
      "why_selected": "Selected for innovative use of technology to create employment pathways.",
      "contribution_areas": ["Inclusive Employment", "Technology & Innovation"]
    }
  ],
  "explanation": "These organisations approach inclusive employment through direct service delivery, policy advocacy, and technological innovation."
}
```

### AI Agent Synthesis

Claude or GPT-4 then takes this structured response and synthesizes a natural language answer:

> "Several key organisations are making a significant difference in inclusive employment for differently-abled individuals:
>
> **Leonard Cheshire** (UK) focuses on creating practical pathways to meaningful work and community participation. They combine direct service delivery with policy advocacy.
>
> **Remploy** (UK) takes an evidence-based approach, working directly with employers to provide ongoing employment support and workplace accommodations.
>
> **EmpleYarTech** (Emerging Markets) demonstrates how technology can be leveraged to create new employment opportunities.
>
> What these organisations share is a focus on sustained, meaningful employment rather than tokenistic inclusion."

---

# 6. Best Practices

### For Claude Integration
- ✅ Use `tool_use` content blocks to capture tool calls
- ✅ Handle streaming responses for better UX
- ✅ Cache tool schemas to reduce context size
- ✅ Implement error handling and retry logic

### For GPT-4 Integration
- ✅ Use function calling for structured tool access
- ✅ Include tool descriptions in your prompts
- ✅ Validate function arguments before calling
- ✅ Parse responses carefully

### For Testing
- ✅ Test each tool individually first
- ✅ Verify data completeness
- ✅ Check confidence levels on evidence
- ✅ Validate entity IDs before querying

### For Production
- ✅ Rate limit API calls
- ✅ Cache frequent queries
- ✅ Log all tool invocations
- ✅ Monitor response times
- ✅ Update data regularly

---

# 7. Troubleshooting

### "Connection Refused to localhost:3000"
- Verify WebMCP server is running
- Check port is not in use: `lsof -i :3000`
- Ensure `PUBLIC_DEMO_MODE=true` is set

### "Tool not found" error
- Verify server exported all 5 tools
- Check tool names match exactly
- Review server logs for startup errors

### "Entity ID not found"
- Verify entity ID matches data in `entities.json`
- Check IDs are lowercase and hyphenated
- Confirm entity exists in database

### "Empty results"
- Check query is specific enough
- Try broader search terms
- Verify contribution area matches taxonomy

---

# 8. Security Considerations

✅ **No credentials exposed** — All demo data is public  
✅ **No database credentials** — Uses JSON files  
✅ **No API keys in code** — Environment variables only  
✅ **Public sources only** — No private data  
✅ **Verifiable evidence** — All URLs are accessible  

---

# 9. Performance Tips

- Cache tool responses for common queries
- Implement query deduplication
- Use pagination for large result sets
- Consider pre-warming search indexes
- Monitor response times

---

# Next Steps

1. Choose your AI agent (Claude, ChatGPT, or generic client)
2. Set up integration following the appropriate section above
3. Test with the provided example scripts
4. Customize prompts for your use case
5. Deploy to production when ready

---

**Integration Guide Complete** ✅

Ready to connect HMO.InnerVoice to your preferred AI agent.
