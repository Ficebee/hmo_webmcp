#!/usr/bin/env node

/**
 * HMO.InnerVoice End-to-End System Test
 * Tests all components: Frontend, WebMCP Backend, Data Integration
 * 
 * Run: node test-end-to-end.js
 */

import fs from 'fs';
import path from 'path';

// Color console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.blue}==== ${msg} ====${colors.reset}`),
};

// Test statistics
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function testResult(passed, message) {
    totalTests++;
    if (passed) {
        passedTests++;
        log.success(message);
    } else {
        failedTests++;
        log.error(message);
    }
}

// ============================================================================
// SECTION 1: File Structure Validation
// ============================================================================

log.section('1. FILE STRUCTURE VALIDATION');

const requiredFiles = [
    'package.json',
    'app/index.html',
    'app/styles.css',
    'app/script.js',
    'app/README.md',
    'app-server.js',
    'scripts/build.js',
    'webmcp/server.js',
    'webmcp/config.js',
    'webmcp/README.md',
    'webmcp/schemas/tools.js',
    'webmcp/tools/search.js',
    'webmcp/tools/entity.js',
    'webmcp/tools/compare.js',
    'webmcp/tools/perspectives.js',
    'webmcp/tools/evidence.js',
    'webmcp/utils/search.js',
    'data/entities.json',
    'data/contribution-categories.json',
    'data/DATA_MODEL.md',
    '.gitignore',
    '.env.example',
    'webmcp/AGENT_INTEGRATION.md'
];

console.log(`Checking ${requiredFiles.length} required files...`);
for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    testResult(exists, `File: ${file}`);
}

// ============================================================================
// SECTION 2: Data Integrity Validation
// ============================================================================

log.section('2. DATA INTEGRITY VALIDATION');

// Load entities.json
let entities = [];
let entitiesDocument = null;
try {
    const entitiesPath = path.join('data', 'entities.json');
    const entitiesData = fs.readFileSync(entitiesPath, 'utf8');
    entitiesDocument = JSON.parse(entitiesData);
    entities = entitiesDocument.entities || [];
    testResult(true, `Loaded entities.json (${entities.length} organisations)`);
} catch (error) {
    testResult(false, `Failed to load entities.json: ${error.message}`);
}

// Validate entities
if (entities.length > 0) {
    testResult(entities.length === 12, `Exactly 12 organisations (found ${entities.length})`);

    // Check required fields on each entity
    const requiredEntityFields = [
        'id', 'name', 'country', 'entityType', 'website', 'description',
        'selectionRationale', 'contributionAreas', 'evidence'
    ];

    let allFieldsPresent = true;
    for (const entity of entities) {
        for (const field of requiredEntityFields) {
            if (!(field in entity)) {
                log.warning(`Missing field '${field}' on entity ${entity.id}`);
                allFieldsPresent = false;
                break;
            }
        }
    }
    testResult(allFieldsPresent, `All required fields present on entities`);

    // Check evidence
    let totalSources = 0;
    for (const entity of entities) {
        if (entity.evidence && Array.isArray(entity.evidence)) {
            totalSources += entity.evidence.length;
        }
    }
    testResult(totalSources >= 19, `Minimum 19 evidence sources (found ${totalSources})`);

    // Check Beehive demo metadata
    const beehiveDemoExamples = entities.filter(e => e.beehiveProviderStatus === 'selected');
    const legacyProviderFlag = ['beehive', 'provider'].join('_');
    const legacyNegativeStatus = ['not', 'selected'].join('_');
    const oldProviderFlags = entities.filter(e => legacyProviderFlag in e || e.beehiveProviderStatus === legacyNegativeStatus);
    const missingDemoDisclosure = beehiveDemoExamples.filter(e => !e.beehiveDemoDisclosure);
    testResult(beehiveDemoExamples.length === 5, `Exactly 5 Beehive demo examples (found ${beehiveDemoExamples.length})`);
    testResult(oldProviderFlags.length === 0, 'No legacy or negative Beehive status flags on entities');
    testResult(missingDemoDisclosure.length === 0, 'Beehive demo examples include public disclosure');
    testResult(
        Boolean(entitiesDocument?.metadata?.beehiveDemoDisclosure),
        'Dataset-level Beehive demo disclosure present'
    );

    // Validate URLs
    let validURLs = 0;
    let invalidURLs = 0;
    for (const entity of entities) {
        if (entity.website) {
            try {
                new URL(entity.website);
                validURLs++;
            } catch {
                invalidURLs++;
                log.warning(`Invalid URL on ${entity.name}: ${entity.website}`);
            }
        }
        if (entity.evidence && Array.isArray(entity.evidence)) {
            for (const source of entity.evidence) {
                if (source.sourceUrl) {
                    try {
                        new URL(source.sourceUrl);
                        validURLs++;
                    } catch {
                        invalidURLs++;
                        log.warning(`Invalid source URL on ${entity.name}: ${source.sourceUrl}`);
                    }
                }
            }
        }
    }
    testResult(invalidURLs === 0, `All URLs valid (${validURLs} valid, ${invalidURLs} invalid)`);
}

// Load contribution categories
let categories = [];
try {
    const categoriesPath = path.join('data', 'contribution-categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    const categoriesDocument = JSON.parse(categoriesData);
    categories = categoriesDocument.contributionCategories || [];
    testResult(true, `Loaded contribution-categories.json (${categories.length} categories)`);
} catch (error) {
    testResult(false, `Failed to load categories: ${error.message}`);
}

if (categories.length > 0) {
    testResult(categories.length === 14, `Exactly 14 contribution categories (found ${categories.length})`);

    const requiredCategoryFields = ['id', 'name', 'description'];
    let allCategoryFieldsPresent = true;
    for (const category of categories) {
        for (const field of requiredCategoryFields) {
            if (!(field in category)) {
                allCategoryFieldsPresent = false;
                break;
            }
        }
    }
    testResult(allCategoryFieldsPresent, `All required fields on categories`);
}

// ============================================================================
// SECTION 3: Frontend Files Validation
// ============================================================================

log.section('3. FRONTEND FILES VALIDATION');

// Check HTML file
try {
    const htmlPath = path.join('app', 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    testResult(htmlContent.includes('<title>'), 'HTML has title tag');
    testResult(htmlContent.includes('Diverse Abilities, Meaningful Contributions'), 'Hero section text present');
    testResult(htmlContent.includes('Human ability does not take a single form'), 'HMO.InnerVoice topic explanation present');
    testResult(!htmlContent.includes('An agent-accessible social knowledge experience powered by WebMCP'), 'Removed WebMCP marketing phrase from website');
    testResult(!htmlContent.includes('Explore Below'), 'Explore Below tab removed');
    testResult(!htmlContent.includes('Visit HMO.InnerVoice'), 'Visit HMO.InnerVoice tab removed');
    testResult(!htmlContent.includes('<h4>Learn More</h4>'), 'Learn More footer section removed');
    testResult(htmlContent.includes('Featured Entities'), 'Featured entities section present');
    testResult(htmlContent.includes('Why This Matters'), '"Why This Matters" section present');
    testResult(htmlContent.includes('Ask an AI Agent'), 'AI Agent section present');
    testResult(htmlContent.includes('Sources & Attribution'), 'Sources section present');
    testResult(htmlContent.includes('script.js'), 'JavaScript bundle linked');
} catch (error) {
    testResult(false, `Error reading HTML: ${error.message}`);
}

// Check CSS file
try {
    const cssPath = path.join('app', 'styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    testResult(cssContent.includes('--primary-dark'), 'CSS variables present');
    testResult(cssContent.includes('nav'), 'Navigation styling present');
    testResult(jsContentIncludesModal(cssContent), 'Modal support present');
    testResult(cssContent.includes('@media'), 'Responsive design present');

    const size = cssContent.length;
    testResult(size > 10000, `CSS file substantial (${(size / 1024).toFixed(1)} KB)`);
} catch (error) {
    testResult(false, `Error reading CSS: ${error.message}`);
}

// Check JavaScript file
try {
    const jsPath = path.join('app', 'script.js');
    const jsContent = fs.readFileSync(jsPath, 'utf8');

    testResult(jsContent.includes('function loadData()'), 'loadData() function present');
    testResult(jsContent.includes('populateCategories'), 'populateCategories() present');
    testResult(jsContent.includes('populateFeaturedEntities'), 'populateFeaturedEntities() present');
    testResult(jsContent.includes('showEntityModal'), 'showEntityModal() present');
    testResult(jsContent.includes('fetch'), 'Fetch API used');
    testResult(jsContent.includes('document.modelContext?.registerTool'), 'WebMCP browser registration present');
    testResult(jsContent.includes('discover_selected'), 'discover_selected WebMCP tool present');
    testResult(jsContent.includes('explain_selection'), 'explain_selection WebMCP tool present');
    testResult(jsContent.includes('explore_approaches'), 'explore_approaches WebMCP tool present');
    testResult(jsContent.includes('explore_perspectives'), 'explore_perspectives WebMCP tool present');
    testResult(jsContent.includes('explore_evidence'), 'explore_evidence WebMCP tool present');
    testResult(jsContent.includes('identify_gaps'), 'identify_gaps WebMCP tool present');

    const explainSelectionStart = jsContent.indexOf("name: 'explain_selection'");
    const explainSelectionEnd = jsContent.indexOf("name: 'explore_approaches'");
    const explainSelectionTool = explainSelectionStart >= 0 && explainSelectionEnd > explainSelectionStart
        ? jsContent.slice(explainSelectionStart, explainSelectionEnd)
        : '';
    testResult(jsContent.includes('let selectedEntityId = null'), 'UI and WebMCP share selected entity state');
    testResult(jsContent.includes('setSelectedEntity(entity.id)'), 'UI detail selection updates shared state');
    testResult(jsContent.includes('function getSelectedEntity()'), 'WebMCP can read selected entity state');
    testResult(explainSelectionTool.includes('execute: async () => explainSelection()'), 'explain_selection uses current UI selection');
    testResult(!explainSelectionTool.includes('entityId'), 'explain_selection does not accept entityId fallback input');
    testResult(jsContent.includes('NO_ORGANISATION_SELECTED'), 'explain_selection returns structured no-selection response');
    testResult(!jsContent.includes('entitiesData.entities[0]'), 'No first organisation fallback present');
    testResult(!explainSelectionTool.includes('Accenture'), 'No Accenture fallback in explain_selection');
} catch (error) {
    testResult(false, `Error reading JavaScript: ${error.message}`);
}

// ============================================================================
// SECTION 4: WebMCP Backend Validation
// ============================================================================

log.section('4. WEBMCP BACKEND VALIDATION');

// Check server.js
try {
    const serverPath = path.join('webmcp', 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');

    testResult(serverContent.includes('StdioServerTransport'), 'MCP SDK imported');
    testResult(serverContent.includes('search_hmo_knowledge'), 'search_hmo_knowledge tool present');
    testResult(serverContent.includes('get_entity_insight'), 'get_entity_insight tool present');
    testResult(serverContent.includes('compare_approaches'), 'compare_approaches tool present');
    testResult(serverContent.includes('explore_perspectives'), 'explore_perspectives tool present');
    testResult(serverContent.includes('explore_evidence'), 'explore_evidence tool present');
    testResult(serverContent.includes('tools/list'), 'Tool list endpoint present');
} catch (error) {
    testResult(false, `Error reading server.js: ${error.message}`);
}

// Check tool schemas
try {
    const schemasPath = path.join('webmcp', 'schemas', 'tools.js');
    const schemasContent = fs.readFileSync(schemasPath, 'utf8');

    testResult(schemasContent.includes('search_hmo_knowledge'), 'search_hmo_knowledge schema defined');
    testResult(schemasContent.includes('get_entity_insight'), 'get_entity_insight schema defined');
    testResult(schemasContent.includes('compare_approaches'), 'compare_approaches schema defined');
    testResult(schemasContent.includes('explore_perspectives'), 'explore_perspectives schema defined');
    testResult(schemasContent.includes('explore_evidence'), 'explore_evidence schema defined');
    testResult(schemasContent.includes('inputSchema'), 'Input schemas defined');
} catch (error) {
    testResult(false, `Error reading schemas: ${error.message}`);
}

// Check individual tools exist
const toolFiles = [
    'search.js',
    'entity.js',
    'compare.js',
    'perspectives.js',
    'evidence.js'
];

for (const toolFile of toolFiles) {
    const toolPath = path.join('webmcp', 'tools', toolFile);
    const exists = fs.existsSync(toolPath);
    testResult(exists, `Tool file: ${toolFile}`);
}

// ============================================================================
// SECTION 5: Configuration Validation
// ============================================================================

log.section('5. CONFIGURATION VALIDATION');

// Check .env.example
try {
    const envExamplePath = '.env.example';
    const envContent = fs.readFileSync(envExamplePath, 'utf8');

    testResult(envContent.includes('PUBLIC_DEMO_MODE'), '.env.example has PUBLIC_DEMO_MODE');
    testResult(envContent.includes('NODE_ENV'), '.env.example has NODE_ENV');
} catch (error) {
    testResult(false, `Error reading .env.example: ${error.message}`);
}

// Check .gitignore
try {
    const gitignorePath = '.gitignore';
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

    testResult(gitignoreContent.includes('node_modules'), '.gitignore excludes node_modules');
    testResult(gitignoreContent.includes('.env'), '.gitignore excludes .env');
    testResult(gitignoreContent.includes('credentials'), '.gitignore excludes credentials');
} catch (error) {
    testResult(false, `Error reading .gitignore: ${error.message}`);
}

// Check package.json
try {
    const pkgPath = 'package.json';
    const pkgContent = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);

    testResult(pkg.scripts && pkg.scripts.start, 'npm start script defined');
    testResult(pkg.scripts && pkg.scripts.dev, 'npm run dev script defined');
    testResult(pkg.scripts && pkg.scripts.build, 'npm run build script defined');
    testResult(pkg.scripts && pkg.scripts['mcp:stdio'], 'stdio MCP compatibility script defined');
    testResult(pkg.dependencies && pkg.dependencies['@modelcontextprotocol/sdk'], 'MCP SDK dependency present');
} catch (error) {
    testResult(false, `Error reading package.json: ${error.message}`);
}

// ============================================================================
// SECTION 6: Documentation Validation
// ============================================================================

log.section('6. DOCUMENTATION VALIDATION');

const docFiles = [
    { path: 'README.md', required: ['agent-accessible social knowledge experience powered by WebMCP', 'document.modelContext.registerTool()', 'https://hmoinnervoice.com'] },
    { path: 'app/README.md', required: ['Frontend', 'WebMCP', 'challenge-demo'] },
    { path: 'webmcp/README.md', required: ['document.modelContext.registerTool()', 'discover_selected', 'Beehive challenge-demo'] },
    { path: 'webmcp/AGENT_INTEGRATION.md', required: ['WebMCP', 'document.modelContext.registerTool()', 'beehiveDemo'] },
    { path: 'data/DATA_MODEL.md', required: ['Entity Schema', 'BEEHIVE DEMO METADATA'] }
];

for (const doc of docFiles) {
    try {
        const content = fs.readFileSync(doc.path, 'utf8');
        let allRequired = true;
        for (const required of doc.required) {
            if (!content.includes(required)) {
                allRequired = false;
                break;
            }
        }
        testResult(allRequired, `Documentation: ${doc.path}`);
    } catch (error) {
        testResult(false, `Cannot read: ${doc.path}`);
    }
}

// ============================================================================
// SECTION 7: Question Mapping Validation
// ============================================================================

log.section('7. QUESTION ANSWERING CAPABILITY');

const questions = [
    'Who is making a difference?',
    'What organisations champion this?',
    'What do they contribute?',
    'What approaches are working?',
    'What can we learn from them?',
    'What are different perspectives?',
    'Where are the gaps?',
    'What evidence supports this?',
    'Why were these selected?',
    'Which entries include Beehive demo metadata?'
];

let toolDocsContent = '';
try {
    toolDocsContent = [
        fs.readFileSync('webmcp/README.md', 'utf8'),
        fs.readFileSync('webmcp/schemas/tools.js', 'utf8'),
        fs.readFileSync('data/DATA_MODEL.md', 'utf8'),
        fs.readFileSync('app/script.js', 'utf8'),
    ].join('\n');
} catch (error) {
    log.warning(`Cannot read WebMCP docs/tool schemas`);
}

const capabilityTerms = [
    'discover_selected',
    'discover_selected',
    'explain_selection',
    'explore_approaches',
    'explain_selection',
    'explore_perspectives',
    'identify_gaps',
    'explore_evidence',
    'selectionRationale',
    'beehiveDemoDisclosure',
];

for (let i = 0; i < questions.length; i++) {
    const passed = toolDocsContent.includes(capabilityTerms[i]);
    testResult(passed, `Question ${i + 1}: ${questions[i].substring(0, 30)}...`);
}

// ============================================================================
// SECTION 8: Security Validation
// ============================================================================

log.section('8. SECURITY VALIDATION');

// Check for exposed credentials
const filesToCheck = [
    'webmcp/server.js',
    'app/script.js',
    'webmcp/config.js'
];

const credentials = ['sk-', 'api_key', 'password', 'token=', 'secret=', 'key:'];
let noCredentialsFound = true;

for (const file of filesToCheck) {
    try {
        const content = fs.readFileSync(file, 'utf8');
        for (const credential of credentials) {
            if (content.includes(credential) && !content.includes('EXAMPLE') && !content.includes('example')) {
                log.warning(`Potential credential pattern in ${file}: ${credential}`);
                noCredentialsFound = false;
            }
        }
    } catch (error) {
        // File not found, skip
    }
}

testResult(noCredentialsFound, 'No exposed credentials found');

// Check for demo mode enforcement
try {
    const configPath = path.join('webmcp', 'config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    testResult(configContent.includes('DEMO_MODE'), 'Demo mode enforcement present');
} catch (error) {
    log.warning('Cannot verify demo mode enforcement');
}

// ============================================================================
// SECTION 9: Architecture Validation
// ============================================================================

log.section('9. ARCHITECTURE VALIDATION');

// Verify separation of concerns
log.info('Frontend directory: app/');
log.info('Backend directory: webmcp/');
log.info('Data directory: data/');

testResult(fs.existsSync('app'), 'Frontend directory exists');
testResult(fs.existsSync('webmcp'), 'Backend directory exists');
testResult(fs.existsSync('data'), 'Data directory exists');

// Check HTTP server
try {
    const appServerContent = fs.readFileSync('app-server.js', 'utf8');
    testResult(appServerContent.includes('http.createServer'), 'HTTP server implementation present');
    testResult(appServerContent.includes('8080') || appServerContent.includes('PORT'), 'Configurable port present');
} catch (error) {
    testResult(false, `Error reading app-server.js: ${error.message}`);
}

// ============================================================================
// SECTION 10: Data Coverage Validation
// ============================================================================

log.section('10. DATA COVERAGE');

if (entities.length > 0) {
    const countries = new Set();
    const areas = new Set();
    let selectionRationales = 0;
    let perspectiveCount = 0;
    let evidenceCount = 0;

    for (const entity of entities) {
        if (entity.country) countries.add(entity.country);
        if (entity.contributionAreas) {
            entity.contributionAreas.forEach(a => areas.add(a));
        }
        if (entity.selectionRationale) selectionRationales++;
        if (entity.perspectives) perspectiveCount += entity.perspectives.length;
        if (entity.evidence) evidenceCount += entity.evidence.length;
    }

    log.info(`Geographic coverage: ${countries.size} countries`);
    log.info(`Contribution areas covered: ${areas.size} areas`);
    log.info(`Selection rationales: ${selectionRationales}/${entities.length}`);
    log.info(`Total perspectives: ${perspectiveCount}`);
    log.info(`Total evidence sources: ${evidenceCount}`);

    testResult(countries.size >= 3, `Geographic diversity: ${countries.size} countries`);
    testResult(areas.size >= 10, `Contribution areas: ${areas.size} areas`);
    testResult(selectionRationales === entities.length, 'Selection rationale on all entities');
    testResult(perspectiveCount >= 20, `Multiple perspectives: ${perspectiveCount} total`);
    testResult(evidenceCount >= 19, `Evidence sources: ${evidenceCount} total`);
}

function jsContentIncludesModal(cssContent) {
    if (cssContent.includes('modal')) {
        return true;
    }

    try {
        const jsContent = fs.readFileSync(path.join('app', 'script.js'), 'utf8');
        return jsContent.includes('showEntityModal');
    } catch {
        return false;
    }
}

// ============================================================================
// FINAL SUMMARY
// ============================================================================

log.section('TEST SUMMARY');

console.log(`\nTotal Tests: ${totalTests}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
if (failedTests > 0) {
    console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
}
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
    log.success('ALL TESTS PASSED! System ready for demonstration.');
    process.exit(0);
} else {
    log.warning(`${failedTests} test(s) failed. Please review.`);
    process.exit(1);
}
