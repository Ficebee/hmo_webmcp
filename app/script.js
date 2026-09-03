// HMO.InnerVoice Frontend Script
// Loads data and populates the page

// Global data storage
let entitiesData = null;
let categoriesData = null;

// Configuration
const CONFIG = {
    featuredEntityLimit: 8,
    attributionItemsToShow: 12,
    beehiveDemoDisclosure: 'Challenge demo metadata only; not a real commercial/provider relationship claim.',
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    populateCategories();
    populateFeaturedEntities();
    populateAttribution();
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
    // Prioritize demo Beehive examples, then add notable ones.
    // Missing Beehive fields mean no public demo label is shown.
    const selected = entitiesData.entities.filter(e => e.beehiveProviderStatus === 'selected');
    const other = entitiesData.entities.filter(e => e.beehiveProviderStatus !== 'selected');

    // Mix them for variety
    const featured = [...selected, ...other].slice(0, CONFIG.featuredEntityLimit);

    // Shuffle to show variety
    return featured.sort(() => 0.5 - Math.random()).slice(0, CONFIG.featuredEntityLimit);
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
    <button onclick="this.closest('[style*=position]').remove()" 
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
            modal.remove();
        }
    });
}

/**
 * Utility: Log version info
 */
console.log('HMO.InnerVoice Frontend Loaded');
console.log('Topic: Different Abilities, Shared Contributions');
console.log('Access WebMCP capabilities through: webmcp/server.js');
