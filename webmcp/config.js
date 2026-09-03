// HMO.InnerVoice WebMCP Server Configuration
// Environment-based configuration for demo mode

export const config = {
    // Server configuration
    server: {
        name: "hmo-innervoice",
        version: "0.1.0",
        description: "HMO.InnerVoice social-impact knowledge accessible through WebMCP",
    },

    // Demo mode — MUST BE ENABLED for challenge demonstrator
    demo: {
        enabled: process.env.PUBLIC_DEMO_MODE === 'true',
        dataSource: 'public-curated-dataset',
        note: 'Demo mode uses only public sources. Production deployment would require additional security and data handling.',
    },

    // Data configuration
    data: {
        entitiesPath: process.env.DATA_PATH || './data/entities.json',
        categoriesPath: process.env.CATEGORIES_PATH || './data/contribution-categories.json',
        cacheEnabled: false, // Disabled for demo
    },

    // Security
    security: {
        // No credentials in demo mode
        apiKeyRequired: false,
        corsEnabled: true,
        corsOrigins: process.env.CORS_ORIGIN || '*',
        rateLimit: {
            enabled: false,
            requestsPerMinute: null,
        },
    },

    // Tool configuration
    tools: {
        enabled: [
            'search_hmo_knowledge',
            'get_entity_insight',
            'compare_approaches',
            'explore_perspectives',
            'explore_evidence',
        ],
        defaultLimit: 10,
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'json',
    },

    // Transport
    transport: {
        type: 'stdio',
        note: 'Uses standard input/output for MCP communication with AI agents',
    },
};

export default config;
