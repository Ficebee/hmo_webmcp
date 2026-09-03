// Explore Evidence Tool
// Explain what evidence supports a claim or insight

import {
    collectEvidence,
    filterEvidenceByConfidence,
    getEntityById,
} from "../utils/search.js";

export async function exploreEvidence(args, entitiesData) {
    const {
        query,
        entityId,
        sourceTypes,
    } = args;

    if (!query) {
        return {
            error: "query parameter is required",
            success: false,
        };
    }

    // Collect evidence
    let evidence = [];

    if (entityId) {
        // Get evidence for specific entity
        const entity = getEntityById(entityId, entitiesData.entities);
        if (!entity) {
            return {
                error: `Entity not found: ${entityId}`,
                success: false,
            };
        }
        evidence = entity.evidence.map(e => ({
            entityName: entity.name,
            entityId: entity.id,
            ...e,
        }));
    } else {
        // Search for evidence matching the query
        const allEvidence = collectEvidence(entitiesData.entities);
        const lowerQuery = query.toLowerCase();
        evidence = allEvidence.filter(e =>
            e.sourceTitle.toLowerCase().includes(lowerQuery) ||
            e.description.toLowerCase().includes(lowerQuery) ||
            e.entityName.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter by source type if provided
    if (sourceTypes && Array.isArray(sourceTypes)) {
        evidence = evidence.filter(e => sourceTypes.includes(e.sourceType));
    }

    if (evidence.length === 0) {
        return {
            query,
            entityId: entityId || null,
            totalEvidence: 0,
            message: `No evidence found matching: "${query}"`,
            note: "HMO.InnerVoice maintains a curated dataset of public sources. Try searching for entity names, topics, or claim summaries.",
            success: true,
        };
    }

    // Organize by confidence level
    const byConfidence = {
        high: evidence.filter(e => e.confidence === 'high'),
        medium: evidence.filter(e => e.confidence === 'medium'),
        low: evidence.filter(e => e.confidence === 'low'),
    };

    // Format response
    return {
        success: true,
        query,
        entityId: entityId || null,
        totalSources: evidence.length,

        byConfidence: {
            high: byConfidence.high.map(formatSource),
            medium: byConfidence.medium.map(formatSource),
            low: byConfidence.low.map(formatSource),
        },

        summary: {
            highConfidence: byConfidence.high.length,
            mediumConfidence: byConfidence.medium.length,
            lowConfidence: byConfidence.low.length,
        },

        sourceTypes: {
            website: evidence.filter(e => e.sourceType === 'website').length,
            report: evidence.filter(e => e.sourceType === 'report').length,
            article: evidence.filter(e => e.sourceType === 'article').length,
            research: evidence.filter(e => e.sourceType === 'research').length,
            government: evidence.filter(e => e.sourceType === 'government').length,
            institution: evidence.filter(e => e.sourceType === 'institution').length,
        },

        methodology: {
            title: "Understanding this evidence",
            points: [
                "Confidence levels reflect how directly the source supports the claim",
                "High confidence: Source directly supports the claim",
                "Medium confidence: Source is somewhat related but may be indirect",
                "Low confidence: Source is tangentially related or unverified",
                "All URLs are public and accessible",
            ],
        },

        limitation: "This represents evidence in HMO.InnerVoice's curated dataset. It is not a comprehensive global evidence review.",
    };
}

/**
 * Format a single source for output
 */
function formatSource(source) {
    return {
        entity: source.entityName,
        entityId: source.entityId,
        sourceTitle: source.sourceTitle,
        sourceUrl: source.sourceUrl,
        sourceType: source.sourceType,
        description: source.description,
        date: source.date,
        confidence: source.confidence,
    };
}

export default exploreEvidence;
