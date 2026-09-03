// Get Entity Insight Tool
// Retrieve detailed structured insight about a specific entity

import {
    getEntityById,
    formatEntity,
} from "../utils/search.js";

export async function getEntityInsight(args, entitiesData) {
    const { entityId } = args;

    if (!entityId) {
        return {
            error: "entityId parameter is required",
            success: false,
        };
    }

    const entity = getEntityById(entityId, entitiesData.entities);

    if (!entity) {
        return {
            error: `Entity not found: ${entityId}`,
            success: false,
            suggestion: "Use the 'search_hmo_knowledge' tool to find available entities",
        };
    }

    const beehiveDemo = entity.beehiveProviderStatus === 'selected'
        ? {
            status: 'selected',
            services: entity.servicesInBeehive || [],
            explanation: `This entity is included as a Beehive example for the public challenge demo, with demo services: ${(entity.servicesInBeehive || []).join(', ')}`,
            disclosure: entity.beehiveDemoDisclosure || "Challenge demo metadata only; not a real commercial/provider relationship claim.",
        }
        : null;

    // Format for comprehensive insight response
    const insight = {
        success: true,
        entity: formatEntity(entity, true),

        // Structured insight sections
        whyHighlighted: {
            title: "Why HMO.InnerVoice highlights this entity",
            text: entity.selectionRationale,
        },

        whatTheyDo: {
            title: "What they contribute",
            summary: entity.contributionSummary,
            areas: entity.contributionAreas,
        },

        whatWeCanLearn: {
            title: "What we can learn",
            insight: entity.insights,
        },

        perspectives: {
            title: "Perspectives represented",
            list: entity.perspectives,
            note: "This entity brings multiple viewpoints and experiences to the conversation",
        },

        evidence: {
            title: "Evidence and sources",
            sources: entity.evidence.map(source => ({
                title: source.sourceTitle,
                url: source.sourceUrl,
                type: source.sourceType,
                description: source.description,
                date: source.date,
                confidence: source.confidence,
            })),
            note: "All sources are publicly accessible. Sources are classified by confidence level (high/medium/low).",
        },

        lastReviewed: entity.lastReviewed,
    };

    if (beehiveDemo) {
        insight.beehiveDemo = beehiveDemo;
    }

    return insight;
}

export default getEntityInsight;
