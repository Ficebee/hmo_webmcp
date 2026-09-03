// Compare Approaches Tool
// Compare how different entities address the same social issue

import {
    searchEntities,
    getEntityById,
} from "../utils/search.js";

export async function compareApproaches(args, entitiesData) {
    const {
        topic,
        entityIds,
        limit = 5,
    } = args;

    if (!topic) {
        return {
            error: "topic parameter is required",
            success: false,
        };
    }

    let entitiesToCompare = [];

    // If specific entities provided, use those
    if (entityIds && Array.isArray(entityIds)) {
        entitiesToCompare = entityIds
            .map(id => getEntityById(id, entitiesData.entities))
            .filter(e => e !== undefined);

        if (entitiesToCompare.length === 0) {
            return {
                error: "None of the provided entity IDs were found",
                success: false,
            };
        }
    } else {
        // Search for entities relevant to topic
        entitiesToCompare = searchEntities(topic, entitiesData.entities).slice(0, limit);
    }

    if (entitiesToCompare.length === 0) {
        return {
            error: `No entities found for topic: "${topic}"`,
            success: false,
            success: false,
        };
    }

    // Format comparison
    const comparison = {
        success: true,
        topic,
        totalEntitiesCompared: entitiesToCompare.length,
        entities: entitiesToCompare.map(entity => ({
            id: entity.id,
            name: entity.name,
            entityType: entity.entityType,
            country: entity.country,
            website: entity.website,

            approach: {
                title: "Their approach",
                summary: entity.contributionSummary,
            },

            contribution: {
                title: "What they contribute",
                areas: entity.contributionAreas,
            },

            distinctive: {
                title: "Distinctive feature",
                insight: entity.insights,
            },

            whySelected: entity.selectionRationale,

            evidence: entity.evidence.map(e => ({
                source: e.sourceTitle,
                url: e.sourceUrl,
                confidence: e.confidence,
            })),
        })),

        synthesis: {
            title: "What we can learn from comparing these approaches",
            note: "Different entities address the same issue through varied strategies based on their position, expertise, and mission.",
            patterns: generatePatterns(entitiesToCompare),
        },
    };

    return comparison;
}

/**
 * Identify patterns across compared entities
 */
function generatePatterns(entities) {
    const patterns = [];

    // Check for geographic diversity
    const countries = [...new Set(entities.map(e => e.country))];
    if (countries.length > 1) {
        patterns.push(`Geographic diversity: ${countries.join(', ')}`);
    }

    // Check for different entity types
    const types = [...new Set(entities.map(e => e.entityType))];
    if (types.length > 1) {
        patterns.push(`Different organizational models: ${types.join(', ')}`);
    }

    // Check for different contribution areas
    const allAreas = new Set();
    entities.forEach(e => e.contributionAreas.forEach(a => allAreas.add(a)));
    if (allAreas.size > 0) {
        patterns.push(`Contribution areas: ${Array.from(allAreas).join(', ')}`);
    }

    return patterns.length > 0 ? patterns : ["Multiple complementary approaches to the same issue"];
}

export default compareApproaches;
