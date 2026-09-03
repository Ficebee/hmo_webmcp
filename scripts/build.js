import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const requiredFiles = [
    'app/index.html',
    'app/styles.css',
    'app/script.js',
    'data/entities.json',
    'data/contribution-categories.json',
    'data/DATA_MODEL.md',
    'README.md',
    'webmcp/README.md',
    'webmcp/AGENT_INTEGRATION.md',
];

for (const file of requiredFiles) {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing required build input: ${file}`);
    }
}

for (const jsonFile of ['data/entities.json', 'data/contribution-categories.json']) {
    JSON.parse(fs.readFileSync(path.join(ROOT, jsonFile), 'utf8'));
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

copyDir(path.join(ROOT, 'app'), DIST);
copyDir(path.join(ROOT, 'data'), path.join(DIST, 'data'));
copyDir(path.join(ROOT, 'webmcp'), path.join(DIST, 'webmcp'), file =>
    file.endsWith('.md') || file.endsWith('.js')
);
fs.copyFileSync(path.join(ROOT, 'README.md'), path.join(DIST, 'README.md'));

console.log(`Built HMO.InnerVoice WebMCP site at ${DIST}`);

function copyDir(source, destination, include = () => true) {
    fs.mkdirSync(destination, { recursive: true });

    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
        const sourcePath = path.join(source, entry.name);
        const destinationPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            copyDir(sourcePath, destinationPath, include);
        } else if (include(sourcePath)) {
            fs.copyFileSync(sourcePath, destinationPath);
        }
    }
}
