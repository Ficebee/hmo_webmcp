// Utility functions for searching and filtering HMO.InnerVoice knowledge base

/**
 * Search entities by query string
 */
export function searchEntities(query, entities, filters = {}) {
    const lowerQuery = query.toLowerCase();

    let results = entities.filter(entity => {
        const matchesQuery =
            entity.name.toLowerCase().includes(lowerQuery) ||
            entity.description.toLowerCase().includes(lowerQuery) ||
            entity.contributionSummary.toLowerCase().includes(lowerQuery) ||
            entity.insights.toLowerCase().includes(lowerQuery) ||
            entity.contributionAreas.some(area => area.toLowerCase().includes(lowerQuery));

        if (!matchesQuery) return false;

        // Apply filters
        if (filters.entityType && entity.entityType !== filters.entityType) {
            return false;
        }

        if (filters.contributionArea) {
            const area = filters.contributionArea.toLowerCase();
            if (!entity.contributionAreas.some(a => a.toLowerCase().includes(area))) {
                return false;
            }
        }

        return true;
    });

    return results;
}

/**
 * Get entity by ID
 */
export function getEntityById(entityId, entities) {
    return entities.find(e => e.id === entityId);
}

/**
 * Find entities by contribution area
 */
export function findByContributionArea(area, entities) {
    const lowerArea = area.toLowerCase();
    return entities.filter(entity =>
        entity.contributionAreas.some(a => a.toLowerCase().includes(lowerArea))
    );
}

/**
 * Format entity for output
 */
export function formatEntity(entity, includeEvidence = true) {
    const formatted = {
        id: entity.id,
        name: entity.name,
        entityType: entity.entityType,
        country: entity.country,
        website: entity.website,
        description: entity.description,
        contributionAreas: entity.contributionAreas,
        selectionRationale: entity.selectionRationale,
        contributionSummary: entity.contributionSummary,
        insights: entity.insights,
        perspectives: entity.perspectives,
        ...(includeEvidence && { evidence: entity.evidence }),
        lastReviewed: entity.lastReviewed,
    };

    if (entity.beehiveProviderStatus === 'selected') {
        formatted.beehiveDemo = {
            status: 'selected',
            services: entity.servicesInBeehive || [],
            disclosure: entity.beehiveDemoDisclosure || 'Challenge demo metadata only; not a real commercial/provider relationship claim.',
        };
    }

    return formatted;
}

/**
 * Get unique perspectives from entities
 */
export function extractPerspectives(entities) {
    const perspectiveSet = new Set();
    entities.forEach(entity => {
        entity.perspectives.forEach(p => perspectiveSet.add(p));
    });
    return Array.from(perspectiveSet);
}

/**
 * Collect all evidence from entities
 */
export function collectEvidence(entities) {
    const evidence = [];
    entities.forEach(entity => {
        entity.evidence.forEach(source => {
            evidence.push({
                entityName: entity.name,
                entityId: entity.id,
                ...source,
            });
        });
    });
    return evidence;
}

/**
 * Format multiple entities for search results
 */
export function formatSearchResults(entities, limit = 10) {
    return entities.slice(0, limit).map(entity => {
        const formatted = {
            id: entity.id,
            name: entity.name,
            entityType: entity.entityType,
            country: entity.country,
            contributionAreas: entity.contributionAreas,
            selectionRationale: entity.selectionRationale,
            description: entity.description,
        };

        if (entity.beehiveProviderStatus === 'selected') {
            formatted.beehiveDemo = {
                status: 'selected',
                disclosure: entity.beehiveDemoDisclosure || 'Challenge demo metadata only; not a real commercial/provider relationship claim.',
            };
        }

        return formatted;
    });
}

/**
 * Filter evidence by confidence level
 */
export function filterEvidenceByConfidence(evidence, minConfidence = 'medium') {
    const confidenceOrder = { low: 1, medium: 2, high: 3 };
    return evidence.filter(e =>
        confidenceOrder[e.confidence] >= confidenceOrder[minConfidence]
    );
}
