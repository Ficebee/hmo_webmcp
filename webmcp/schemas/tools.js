// WebMCP Tool Schemas
// Defines the interface and specifications for all HMO.InnerVoice capabilities

export const TOOL_SCHEMAS = {
    SEARCH_KNOWLEDGE: {
        name: "search_hmo_knowledge",
        description: "Search HMO.InnerVoice knowledge base to find relevant entities, contributions, and insights related to a social issue or topic. Returns curated organisations, institutions, and initiatives with their contribution areas and why HMO.InnerVoice selected them.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search term or question about the topic (e.g., 'inclusive employment', 'technology accessibility', 'different abilities')",
                },
                entityType: {
                    type: "string",
                    enum: ["organisation", "institution", "individual", "initiative", "programme", "community_group"],
                    description: "Optional: Filter results by entity type",
                },
                contributionArea: {
                    type: "string",
                    description: "Optional: Filter by specific contribution area (e.g., 'Inclusive Employment', 'Technology & Innovation', 'Arts & Culture')",
                },
                limit: {
                    type: "number",
                    description: "Optional: Maximum number of results to return (default: 10)",
                },
            },
            required: ["query"],
        },
    },

    GET_ENTITY_INSIGHT: {
        name: "get_entity_insight",
        description: "Retrieve detailed structured insight about a specific entity selected by HMO.InnerVoice. Includes: what they do, why they were selected, contribution areas, HMO.InnerVoice's analytical insight, evidence/sources, and optional Beehive challenge-demo metadata where present. Beehive demo metadata does not state or imply a real commercial/provider relationship.",
        inputSchema: {
            type: "object",
            properties: {
                entityId: {
                    type: "string",
                    description: "The unique identifier of the entity (e.g., 'org_001_accenture')",
                },
            },
            required: ["entityId"],
        },
    },

    COMPARE_APPROACHES: {
        name: "compare_approaches",
        description: "Compare how different organisations or institutions address the same social issue. Shows their distinct approaches, contributions, and what can be learned from each. Useful for understanding different strategies to inclusion and social impact.",
        inputSchema: {
            type: "object",
            properties: {
                topic: {
                    type: "string",
                    description: "The social issue or topic to compare approaches on (e.g., 'inclusive employment', 'accessibility', 'technology access')",
                },
                entityIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "Optional: Specific entity IDs to compare. If not provided, will return relevant entities addressing this topic.",
                },
                limit: {
                    type: "number",
                    description: "Optional: Maximum number of entities to compare (default: 5)",
                },
            },
            required: ["topic"],
        },
    },

    EXPLORE_PERSPECTIVES: {
        name: "explore_perspectives",
        description: "Surface different perspectives on a social issue from various stakeholders. Returns viewpoints from perspectives such as: people with disabilities, autistic people, neurodivergent people, employers, educators, researchers, service providers, policymakers, and advocacy organisations. Helps understand the multi-stakeholder nature of social issues.",
        inputSchema: {
            type: "object",
            properties: {
                topic: {
                    type: "string",
                    description: "The social issue or topic to explore perspectives on (e.g., 'different abilities in workplace', 'accessibility in technology')",
                },
                perspectiveTypes: {
                    type: "array",
                    items: { type: "string" },
                    description: "Optional: Specific perspective types to include (e.g., 'lived experience', 'employer', 'researcher', 'policymaker')",
                },
            },
            required: ["topic"],
        },
    },

    EXPLORE_EVIDENCE: {
        name: "explore_evidence",
        description: "Explain what evidence supports a particular claim, insight, or statement about an entity or contribution. Shows sources, source types, confidence levels, and limitations. Supports transparent, evidence-aware reasoning about social-impact claims.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The claim or topic to find evidence for (e.g., 'Accenture accessibility accommodations', 'technology improves accessibility')",
                },
                entityId: {
                    type: "string",
                    description: "Optional: Look for evidence specifically about this entity",
                },
                sourceTypes: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: ["website", "report", "article", "research", "government", "institution"],
                    },
                    description: "Optional: Filter by source type",
                },
            },
            required: ["query"],
        },
    },
};
