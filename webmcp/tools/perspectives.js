// Explore Perspectives Tool
// Surface different perspectives on a social issue from various stakeholders

import {
    searchEntities,
    extractPerspectives,
} from "../utils/search.js";

export async function explorePerspectives(args, entitiesData) {
    const {
        topic,
        perspectiveTypes,
    } = args;

    if (!topic) {
        return {
            error: "topic parameter is required",
            success: false,
        };
    }

    // Find entities relevant to topic
    const relevantEntities = searchEntities(topic, entitiesData.entities);

    if (relevantEntities.length === 0) {
        return {
            error: `No entities found for topic: "${topic}"`,
            success: false,
        };
    }

    // Extract all perspectives from relevant entities
    const allPerspectives = extractPerspectives(relevantEntities);

    // Filter by perspective types if provided
    let filteredPerspectives = allPerspectives;
    if (perspectiveTypes && Array.isArray(perspectiveTypes)) {
        const lowerTypes = perspectiveTypes.map(t => t.toLowerCase());
        filteredPerspectives = allPerspectives.filter(p =>
            lowerTypes.some(t => p.toLowerCase().includes(t))
        );
    }

    // Group entities by perspectives
    const perspectiveMapping = {};
    relevantEntities.forEach(entity => {
        entity.perspectives.forEach(perspective => {
            if (filteredPerspectives.includes(perspective) || filteredPerspectives.length === 0) {
                if (!perspectiveMapping[perspective]) {
                    perspectiveMapping[perspective] = [];
                }
                perspectiveMapping[perspective].push({
                    name: entity.name,
                    id: entity.id,
                    contribution: entity.contributionSummary,
                    insight: entity.insights,
                });
            }
        });
    });

    // Format response
    const response = {
        success: true,
        topic,
        perspectivesIdentified: Object.keys(perspectiveMapping).length,
        perspectives: Object.entries(perspectiveMapping).map(([perspective, entities]) => ({
            perspective,
            representedBy: entities.length,
            organizations: entities.map(e => ({
                name: e.name,
                id: e.id,
                viewpoint: e.contribution,
                insight: e.insight,
            })),
        })),

        methodology: {
            title: "How perspectives are identified",
            description: "HMO.InnerVoice extracts distinct perspectives from the organizations and initiatives in its knowledge base. Each entity contributes voices and viewpoints based on its mission, constituency, and expertise.",
        },

        note: "These perspectives represent multiple stakeholder viewpoints on the topic. Understanding multiple perspectives supports more comprehensive and inclusive thinking about social issues.",

        importantCaveat: "This represents perspectives from the curated entities in HMO.InnerVoice's dataset. It is not exhaustive coverage of all possible perspectives on this topic.",
    };

    return response;
}

export default explorePerspectives;
