// HMO.InnerVoice WebMCP Server
// Exposes HMO.InnerVoice social-impact knowledge and insights to AI agents

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    Server,
} from "@modelcontextprotocol/sdk/server/index.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import {
    searchHmoKnowledge,
    getEntityInsight,
    compareApproaches,
    explorePerspectives,
    exploreEvidence,
} from "./tools/index.js";

import {
    TOOL_SCHEMAS,
} from "./schemas/tools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from environment
const config = {
    publicDemoMode: process.env.PUBLIC_DEMO_MODE === 'true',
    dataPath: process.env.DATA_PATH || path.join(__dirname, '../data/entities.json'),
    categoriesPath: process.env.CATEGORIES_PATH || path.join(__dirname, '../data/contribution-categories.json'),
};

// Validate demo mode
if (!config.publicDemoMode) {
    console.warn('WARNING: Running in non-demo mode. This should only be used with curated public data.');
}

// Load curated dataset
let entitiesData = null;
let categoriesData = null;

try {
    const entitiesContent = fs.readFileSync(config.dataPath, 'utf-8');
    entitiesData = JSON.parse(entitiesContent);
    console.log(`✓ Loaded ${entitiesData.entities.length} entities from ${config.dataPath}`);
} catch (error) {
    console.error(`✗ Failed to load entities data: ${error.message}`);
    process.exit(1);
}

try {
    const categoriesContent = fs.readFileSync(config.categoriesPath, 'utf-8');
    categoriesData = JSON.parse(categoriesContent);
    console.log(`✓ Loaded ${categoriesData.contributionCategories.length} contribution categories`);
} catch (error) {
    console.error(`✗ Failed to load categories data: ${error.message}`);
    process.exit(1);
}

// Initialize MCP Server
const server = new Server({
    name: "hmo-innervoice",
    version: "0.1.0",
});

// Register tools with the server
const tools = [
    TOOL_SCHEMAS.SEARCH_KNOWLEDGE,
    TOOL_SCHEMAS.GET_ENTITY_INSIGHT,
    TOOL_SCHEMAS.COMPARE_APPROACHES,
    TOOL_SCHEMAS.EXPLORE_PERSPECTIVES,
    TOOL_SCHEMAS.EXPLORE_EVIDENCE,
];

// Handle tool list requests
server.setRequestHandler(
    { method: "tools/list" },
    async () => ({
        tools,
    })
);

// Handle tool execution requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const toolName = request.params.name;
        const args = request.params.arguments;

        let result;

        switch (toolName) {
            case "search_hmo_knowledge":
                result = await searchHmoKnowledge(args, entitiesData, categoriesData);
                break;

            case "get_entity_insight":
                result = await getEntityInsight(args, entitiesData);
                break;

            case "compare_approaches":
                result = await compareApproaches(args, entitiesData);
                break;

            case "explore_perspectives":
                result = await explorePerspectives(args, entitiesData);
                break;

            case "explore_evidence":
                result = await exploreEvidence(args, entitiesData);
                break;

            default:
                return {
                    content: [
                        {
                            type: "text",
                            text: `Unknown tool: ${toolName}`,
                        },
                    ],
                    isError: true,
                };
        }

        return {
            content: [
                {
                    type: "text",
                    text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error executing tool: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

// Start server with stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("✓ HMO.InnerVoice WebMCP Server started");
    console.log("✓ Ready to accept tool calls from AI agents");
    console.log(`✓ Demo mode: ${config.publicDemoMode ? 'ENABLED (public data only)' : 'DISABLED'}`);
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
