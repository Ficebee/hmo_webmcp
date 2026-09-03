// HMO.InnerVoice Frontend Script
// Loads data and populates the page

// Global data storage
let entitiesData = null;
let categoriesData = null;
let selectedEntityId = null;

// Configuration
const CONFIG = {
    featuredEntityLimit: 7,
    attributionItemsToShow: 12,
    beehiveDemoDisclosure: 'Challenge demo metadata only; not a real commercial/provider relationship claim.',
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    populateCategories();
    populateFeaturedEntities();
    populateAttribution();
    await registerWebMcpTools();
});

/**
 * Load data from JSON files
 */
async function loadData() {
    try {
        // Note: In a real implementation, these would be loaded from a server
        // For this demo, we're including them inline or fetching from the public data directory

        // Try to fetch from the data directory
        const entitiesResponse = await fetch('../data/entities.json');
        const categoriesResponse = await fetch('../data/contribution-categories.json');

        if (entitiesResponse.ok) {
            entitiesData = await entitiesResponse.json();
            console.log(`✓ Loaded ${entitiesData.entities.length} entities`);
        } else {
            throw new Error('Failed to load entities');
        }

        if (categoriesResponse.ok) {
            categoriesData = await categoriesResponse.json();
            console.log(`✓ Loaded ${categoriesData.contributionCategories.length} categories`);
        } else {
            throw new Error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback: show error message
        document.getElementById('categoryGrid').innerHTML =
            '<p style="grid-column: 1/-1; color: red;">Error loading data. Please ensure the JSON files are accessible.</p>';
    }
}

/**
 * Populate categories grid
 */
function populateCategories() {
    if (!categoriesData) return;

    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';

    categoriesData.contributionCategories.slice(0, 8).forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
      <h3>${category.name}</h3>
      <p>${category.description}</p>
    `;
        grid.appendChild(card);
    });
}

/**
 * Populate featured entities
 */
function populateFeaturedEntities() {
    if (!entitiesData) return;

    const grid = document.getElementById('entityGrid');
    grid.innerHTML = '';

    // Select featured entities (mix of demo Beehive examples and notable ones)
    const featured = selectFeaturedEntities();

    featured.forEach(entity => {
        const card = createEntityCard(entity);
        grid.appendChild(card);
    });
}

/**
 * Create an entity card element
 */
function createEntityCard(entity) {
    const card = document.createElement('div');
    card.className = 'entity-card';

    const beehiveStatus = entity.beehiveProviderStatus === 'selected'
        ? '<div class="entity-beehive"><span class="entity-beehive-badge">✓ Demo Beehive Example</span></div>'
        : '';

    const areas = entity.contributionAreas
        .slice(0, 3)
        .map(area => `<span class="entity-area-tag">${area}</span>`)
        .join('');

    card.innerHTML = `
    <div class="entity-card-header">
      <h3>${entity.name}</h3>
      <p class="entity-location">${entity.country}</p>
    </div>
    <div class="entity-card-content">
      <div class="entity-rationale">
        <div class="entity-rationale-label">Why HMO.InnerVoice Highlights This Entity</div>
        <p style="margin: 0; line-height: 1.6; font-size: 0.95rem;">${entity.selectionRationale}</p>
      </div>
      <div class="entity-areas">
        ${areas}
        ${entity.contributionAreas.length > 3 ? `<span class="entity-area-tag">+${entity.contributionAreas.length - 3} more</span>` : ''}
      </div>
      ${beehiveStatus}
    </div>
    <div class="entity-card-footer">
      <a href="#" class="entity-link" onclick="viewEntityDetails(event, '${entity.id}')">View Details</a>
    </div>
  `;

    return card;
}

/**
 * Select featured entities for the homepage
 */
function selectFeaturedEntities() {
    return entitiesData.entities
        .filter(entity => entity.contributionAreas.includes('Inclusive Employment'))
        .slice(0, CONFIG.featuredEntityLimit);
}

/**
 * Populate attribution list
 */
function populateAttribution() {
    if (!entitiesData) return;

    const list = document.getElementById('attributionList');
    list.innerHTML = '';

    entitiesData.entities.slice(0, CONFIG.attributionItemsToShow).forEach(entity => {
        const item = document.createElement('div');
        item.className = 'attribution-item';

        const sources = entity.evidence
            .map(e => `<a href="${e.sourceUrl}" target="_blank">${e.sourceTitle}</a>`)
            .join('');

        item.innerHTML = `
      <h4>${entity.name}</h4>
      <p>${entity.description}</p>
      <div class="sources">
        <strong>Sources:</strong>
        ${sources}
      </div>
    `;

        list.appendChild(item);
    });
}

/**
 * Handle scroll to explore
 */
function scrollToExplore() {
    const exploreSection = document.getElementById('explore');
    exploreSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * View entity details (placeholder for now)
 */
function viewEntityDetails(event, entityId) {
    event.preventDefault();

    const entity = entitiesData.entities.find(e => e.id === entityId);
    if (!entity) {
        alert('Entity not found');
        return;
    }

    // For now, show alert with entity information
    // In full implementation, this would navigate to a detail page
    showEntityModal(entity);
}

/**
 * Show entity details in a modal
 */
function showEntityModal(entity) {
    setSelectedEntity(entity.id);

    const modal = document.createElement('div');
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  `;

    const content = document.createElement('div');
    content.style.cssText = `
    background-color: white;
    border-radius: 8px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  `;

    const sources = entity.evidence
        .map(e => `
      <li>
        <strong>${e.sourceTitle}</strong> 
        (<span style="color: #7b5d2d;">${e.sourceType}</span>, 
        Confidence: <span style="color: #3d7d4d;">${e.confidence}</span>)<br>
        <a href="${e.sourceUrl}" target="_blank" style="font-size: 0.9rem;">${e.sourceUrl}</a>
      </li>
    `)
        .join('');

    const beehive = entity.beehiveProviderStatus === 'selected'
        ? `
          <h3 style="color: #1a3a3a; font-size: 1.2rem;">Beehive Demo Example</h3>
          <p><strong style="color: #3d7d4d;">✓ Included as a Beehive example for this challenge demo</strong><br>
          Demo services: ${(entity.servicesInBeehive || []).join(', ')}</p>
          <p style="font-size: 0.9rem; color: #666;">${entity.beehiveDemoDisclosure || CONFIG.beehiveDemoDisclosure}</p>
        `
        : '';

    content.innerHTML = `
    <button onclick="closeEntityModal(this)" 
            style="float: right; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
    
    <h2 style="margin-top: 0; color: #1a3a3a;">${entity.name}</h2>
    
    <p style="color: #999; font-size: 0.9rem;"><strong>${entity.entityType}</strong> | ${entity.country}</p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    
    <h3 style="color: #1a3a3a; font-size: 1.2rem;">Why HMO.InnerVoice Highlights This Entity</h3>
    <p>${entity.selectionRationale}</p>
    
    <h3 style="color: #1a3a3a; font-size: 1.2rem;">What They Contribute</h3>
    <p>${entity.contributionSummary}</p>
    
    <h3 style="color: #1a3a3a; font-size: 1.2rem;">What We Can Learn</h3>
    <p>${entity.insights}</p>
    
    <h3 style="color: #1a3a3a; font-size: 1.2rem;">Contribution Areas</h3>
    <p>${entity.contributionAreas.join(' • ')}</p>
    
    <h3 style="color: #1a3a3a; font-size: 1.2rem;">Perspectives Represented</h3>
    <p>${entity.perspectives.join(', ')}</p>
    
    ${beehive}
    
    <h3 style="color: #1a3a3a; font-size: 1.2rem;">Sources & Evidence</h3>
    <ul style="list-style: none; padding: 0;">
      ${sources}
    </ul>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    
    <p style="font-size: 0.9rem; color: #999;">
      <a href="${entity.website}" target="_blank">Visit website →</a>
    </p>
  `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEntityModal(modal);
        }
    });
}

function setSelectedEntity(entityId) {
    selectedEntityId = entityId || null;
}

function clearSelectedEntity() {
    selectedEntityId = null;
}

function closeEntityModal(element) {
    const modal = element.closest?.('[style*=position]') || element;
    modal?.remove();
    clearSelectedEntity();
}

/**
 * Utility: Log version info
 */
console.log('HMO.InnerVoice Frontend Loaded');
console.log('Topic: Different Abilities, Shared Contributions');
console.log('Access WebMCP capabilities through: document.modelContext.registerTool()');

/**
 * Register WebMCP site tools for ChatGPT's in-app browser.
 */
async function registerWebMcpTools() {
    if (typeof document.modelContext?.registerTool !== 'function') {
        console.info('WebMCP is not available in this browser. The website remains usable normally.');
        return;
    }

    const tools = [
        {
            name: 'discover_selected',
            description: 'Discover HMO.InnerVoice selected public demo entities relevant to a social issue, contribution area, destination, experience, or awareness topic.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'Topic or question to explore.' },
                    contributionArea: { type: 'string', description: 'Optional contribution area filter.' },
                    limit: { type: 'number', description: 'Maximum number of entities to return. Default 8.' },
                },
                required: ['query'],
                additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: async ({ query, contributionArea, limit = 8 }) =>
                discoverSelected({ query, contributionArea, limit }),
        },
        {
            name: 'explain_selection',
            description: 'Explain the organisation currently selected by the user in the live HMO.InnerVoice webpage, including contribution summary, perspectives, evidence, and optional Beehive demo metadata.',
            inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: async () => explainSelection(),
        },
        {
            name: 'explore_approaches',
            description: 'Compare approaches used by selected public demo entities on a social issue or contribution topic.',
            inputSchema: {
                type: 'object',
                properties: {
                    topic: { type: 'string', description: 'Issue or topic to compare.' },
                    entityIds: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Optional list of entity ids to compare.',
                    },
                    limit: { type: 'number', description: 'Maximum entities to compare. Default 5.' },
                },
                required: ['topic'],
                additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: async ({ topic, entityIds, limit = 5 }) =>
                exploreApproaches({ topic, entityIds, limit }),
        },
        {
            name: 'explore_perspectives',
            description: 'Surface stakeholder perspectives represented in the HMO.InnerVoice public demo knowledge experience.',
            inputSchema: {
                type: 'object',
                properties: {
                    topic: { type: 'string', description: 'Issue or topic to explore.' },
                    perspectiveTypes: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Optional perspective filters such as lived experience, employer, researcher, policy, or service.',
                    },
                },
                required: ['topic'],
                additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: async ({ topic, perspectiveTypes }) =>
                explorePerspectiveSet({ topic, perspectiveTypes }),
        },
        {
            name: 'explore_evidence',
            description: 'Find public evidence sources supporting claims, entities, or contribution topics in this challenge dataset.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'Claim, entity, or topic to find evidence for.' },
                    entityId: { type: 'string', description: 'Optional entity id for scoped evidence.' },
                    sourceTypes: {
                        type: 'array',
                        items: { type: 'string', enum: ['website', 'report', 'article', 'research', 'government', 'institution'] },
                        description: 'Optional source type filters.',
                    },
                },
                required: ['query'],
                additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: async ({ query, entityId, sourceTypes }) =>
                exploreEvidenceSet({ query, entityId, sourceTypes }),
        },
        {
            name: 'identify_gaps',
            description: 'Identify visible gaps, limits, and underrepresented areas in the public challenge dataset.',
            inputSchema: {
                type: 'object',
                properties: {
                    topic: { type: 'string', description: 'Optional issue or topic to focus the gap analysis.' },
                },
                additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: async ({ topic = 'Different Abilities, Shared Contributions' } = {}) =>
                identifyGaps({ topic }),
        },
    ];

    for (const tool of tools) {
        await document.modelContext.registerTool(tool);
    }

    console.log(`Registered ${tools.length} HMO.InnerVoice WebMCP tools`);
}

function discoverSelected({ query, contributionArea, limit = 8 }) {
    const matches = findRelevantEntities(query)
        .filter(entity => !contributionArea || includesText(entity.contributionAreas.join(' '), contributionArea))
        .slice(0, Number(limit) || 8);

    return {
        project: 'HMO.InnerVoice — an agent-accessible social knowledge experience powered by WebMCP',
        officialWebsite: 'https://hmoinnervoice.com',
        query,
        totalMatches: matches.length,
        entities: matches.map(formatEntitySummary),
        note: 'This is a public OpenAI Challenge prototype using curated public demo data only.',
    };
}

function explainSelection() {
    const entity = getSelectedEntity();
    if (!entity) {
        return {
            success: false,
            code: 'NO_ORGANISATION_SELECTED',
            selectedEntityId: null,
            message: 'No organisation is selected. Please select an organisation in the HMO.InnerVoice webpage, then ask again.',
        };
    }

    return {
        success: true,
        selectedEntityId: entity.id,
        entity: formatEntityDetail(entity),
        whyHighlighted: entity.selectionRationale,
        whatTheyContribute: entity.contributionSummary,
        whatWeCanLearn: entity.insights,
        perspectives: entity.perspectives,
        evidence: entity.evidence,
        ...(formatBeehiveDemo(entity) && { beehiveDemo: formatBeehiveDemo(entity) }),
    };
}

function exploreApproaches({ topic, entityIds, limit = 5 }) {
    const entities = Array.isArray(entityIds) && entityIds.length > 0
        ? entityIds.map(getEntity).filter(Boolean)
        : findRelevantEntities(topic).slice(0, Number(limit) || 5);

    return {
        topic,
        compared: entities.length,
        approaches: entities.map(entity => ({
            id: entity.id,
            name: entity.name,
            approach: entity.contributionSummary,
            distinctiveInsight: entity.insights,
            contributionAreas: entity.contributionAreas,
            evidenceCount: entity.evidence.length,
        })),
        synthesis: summarizePatterns(entities),
        limitation: 'This compares the public challenge dataset only; it is not a complete global review.',
    };
}

function explorePerspectiveSet({ topic, perspectiveTypes }) {
    const entities = findRelevantEntities(topic);
    const filters = Array.isArray(perspectiveTypes)
        ? perspectiveTypes.map(type => normalizeText(type))
        : [];
    const perspectiveMap = {};

    entities.forEach(entity => {
        entity.perspectives.forEach(perspective => {
            const normalized = normalizeText(perspective);
            if (filters.length > 0 && !filters.some(filter => normalized.includes(filter))) {
                return;
            }

            if (!perspectiveMap[perspective]) {
                perspectiveMap[perspective] = [];
            }

            perspectiveMap[perspective].push({
                id: entity.id,
                name: entity.name,
                insight: entity.insights,
            });
        });
    });

    return {
        topic,
        perspectivesIdentified: Object.keys(perspectiveMap).length,
        perspectives: Object.entries(perspectiveMap).map(([perspective, representedBy]) => ({
            perspective,
            representedBy,
        })),
        limitation: 'Perspectives are drawn from public demo entities and are not exhaustive.',
    };
}

function exploreEvidenceSet({ query, entityId, sourceTypes }) {
    const entities = entityId ? [getEntity(entityId)].filter(Boolean) : entitiesData.entities;
    const filters = Array.isArray(sourceTypes) ? sourceTypes : [];
    const queryText = normalizeText(query);
    const sources = [];

    entities.forEach(entity => {
        entity.evidence.forEach(source => {
            const haystack = normalizeText([
                entity.name,
                entity.description,
                entity.contributionSummary,
                source.sourceTitle,
                source.description,
                source.sourceType,
            ].join(' '));

            if (filters.length > 0 && !filters.includes(source.sourceType)) {
                return;
            }

            if (entityId || scoreTextMatch(haystack, queryText) > 0) {
                sources.push({
                    entityId: entity.id,
                    entityName: entity.name,
                    ...source,
                });
            }
        });
    });

    return {
        query,
        entityId: entityId || null,
        totalSources: sources.length,
        sources,
        limitation: 'Evidence is limited to public sources curated for this challenge prototype.',
    };
}

function identifyGaps({ topic }) {
    const entities = topic ? findRelevantEntities(topic) : entitiesData.entities;
    const coveredAreas = new Set(entities.flatMap(entity => entity.contributionAreas));
    const allAreas = categoriesData.contributionCategories.map(category => category.name);
    const underrepresentedAreas = allAreas.filter(area =>
        !Array.from(coveredAreas).some(covered => includesText(covered, area))
    );
    const countries = [...new Set(entities.map(entity => entity.country))];

    return {
        topic,
        datasetSize: entities.length,
        visibleGaps: [
            'Static public challenge dataset, not the full HMO.InnerVoice platform.',
            'Limited geography and sector coverage.',
            'Public-source evidence only; no private case notes, user data, or production knowledge graph.',
            'Experiences and destinations are represented through organisation-level public information, not personal travel or service records.',
        ],
        underrepresentedContributionAreas: underrepresentedAreas,
        representedCountriesOrRegions: countries,
        suggestedNextQuestions: [
            'Which voices are missing from this issue?',
            'Which evidence is strongest, and which claims need more public support?',
            'Which approaches would need local context before adoption elsewhere?',
        ],
    };
}

function findRelevantEntities(query) {
    const normalizedQuery = normalizeText(query);
    const scored = entitiesData.entities
        .map(entity => ({
            entity,
            score: scoreEntity(entity, normalizedQuery),
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    return scored.length > 0
        ? scored.map(item => item.entity)
        : entitiesData.entities;
}

function scoreEntity(entity, normalizedQuery) {
    const haystack = normalizeText([
        entity.name,
        entity.entityType,
        entity.country,
        entity.description,
        entity.contributionAreas.join(' '),
        entity.selectionRationale,
        entity.contributionSummary,
        entity.insights,
        entity.perspectives.join(' '),
        entity.tags.join(' '),
    ].join(' '));

    return scoreTextMatch(haystack, normalizedQuery);
}

function scoreTextMatch(haystack, normalizedQuery) {
    if (!normalizedQuery) return 1;
    const tokens = normalizedQuery.split(' ').filter(token => token.length > 2);
    if (haystack.includes(normalizedQuery)) return tokens.length + 2;
    return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function formatEntitySummary(entity) {
    return {
        id: entity.id,
        name: entity.name,
        entityType: entity.entityType,
        country: entity.country,
        contributionAreas: entity.contributionAreas,
        selectionRationale: entity.selectionRationale,
        ...(formatBeehiveDemo(entity) && { beehiveDemo: formatBeehiveDemo(entity) }),
    };
}

function formatEntityDetail(entity) {
    return {
        ...formatEntitySummary(entity),
        website: entity.website,
        description: entity.description,
        contributionSummary: entity.contributionSummary,
        insights: entity.insights,
        lastReviewed: entity.lastReviewed,
    };
}

function formatBeehiveDemo(entity) {
    if (entity.beehiveProviderStatus !== 'selected') {
        return null;
    }

    return {
        status: 'selected',
        services: entity.servicesInBeehive || [],
        disclosure: entity.beehiveDemoDisclosure || CONFIG.beehiveDemoDisclosure,
    };
}

function getEntity(entityId) {
    return entitiesData?.entities.find(entity => entity.id === entityId);
}

function getSelectedEntity() {
    if (!selectedEntityId) {
        return null;
    }

    return getEntity(selectedEntityId) || null;
}

function summarizePatterns(entities) {
    if (entities.length === 0) {
        return ['No matching entities found in the public challenge dataset.'];
    }

    const areas = [...new Set(entities.flatMap(entity => entity.contributionAreas))];
    const countries = [...new Set(entities.map(entity => entity.country))];

    return [
        `Contribution areas represented: ${areas.join(', ')}`,
        `Countries or regions represented: ${countries.join(', ')}`,
        'The selected approaches combine public evidence, lived-experience perspectives, institutional action, and practical participation pathways.',
    ];
}

function includesText(value, query) {
    return normalizeText(value).includes(normalizeText(query));
}

function normalizeText(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
