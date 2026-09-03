// Search HMO.InnerVoice Knowledge Tool
// Find relevant entities, contributions, and knowledge related to a topic

import {
    searchEntities,
    findByContributionArea,
    formatSearchResults,
} from "../utils/search.js";

export async function searchHmoKnowledge(args, entitiesData, categoriesData) {
    const {
        query,
        entityType,
        contributionArea,
        limit = 10,
    } = args;

    if (!query) {
        return {
            error: "Query parameter is required",
            success: false,
        };
    }

    const filters = {};
    if (entityType) filters.entityType = entityType;
    if (contributionArea) filters.contributionArea = contributionArea;

    // Search entities
    const results = searchEntities(query, entitiesData.entities, filters);

    if (results.length === 0) {
        return {
            query,
            totalResults: 0,
            message: `No entities found matching: "${query}"`,
            suggestions: [
                "Try searching for specific contribution areas like 'inclusive employment' or 'technology'",
                "Try searching for organization names or types",
                "Use simpler, shorter search terms",
            ],
            success: true,
        };
    }

    return {
        query,
        filters: Object.keys(filters).length > 0 ? filters : null,
        totalResults: results.length,
        entities: formatSearchResults(results, limit),
        note: "These entities were selected by HMO.InnerVoice because their work demonstrates meaningful contribution, participation, and capability. For detailed insight about any entity, use the 'get_entity_insight' tool.",
        success: true,
    };
}

export default searchHmoKnowledge;
