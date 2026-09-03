# HMO.InnerVoice Frontend

The user-facing web interface for exploring HMO.InnerVoice's curated knowledge about social-impact organizations.

## Overview

The frontend presents:

1. **Topic Page** — Editorial introduction to "Different Abilities, Shared Contributions"
2. **Featured Entities** — 8 curated organisations with selection rationale
3. **Contribution Categories** — 14 ways organisations contribute
4. **Perspectives & Insights** — Why this work matters
5. **Agent Interoperability** — Explanation of WebMCP integration
6. **Source Attribution** — Transparent, verifiable sources

## Running the Frontend

### Option 1: Simple HTTP Server (Recommended for Demo)

```bash
# From the project root
node app-server.js

# Then open in browser:
# http://localhost:8080
```

### Option 2: Python Simple Server

```bash
cd app
python -m http.server 8000

# Then open in browser:
# http://localhost:8000
```

### Option 3: Live Server (VS Code Extension)

1. Install Live Server extension in VS Code
2. Right-click `app/index.html`
3. Select "Open with Live Server"

## File Structure

```
app/
├── index.html      # Main page
├── styles.css      # Styling (editorial, calm design)
├── script.js       # Frontend logic (loads data, populates page)
└── README.md       # This file
```

## Design Principles

### Visual Aesthetic
- **Editorial** — Like reading a quality publication
- **Human** — Warm, approachable, not corporate
- **Trustworthy** — Clear information architecture, no hidden complexity
- **Calm** — Generous whitespace, readable typography, no excessive animations
- **Inclusive** — Good contrast, readable fonts, accessible navigation

### Color Palette
- **Primary Dark** (#1a3a3a) — Deep, grounded, professional
- **Primary Accent** (#2d5d7b) — Confident blue for links and highlights
- **Secondary Accent** (#7b5d2d) — Warm earth tone for balance
- **Success** (#3d7d4d) — Accessible green for positive indicators
- **Backgrounds** — Whites and warm grays for readability

### Typography
- **Display** — Georgia serif for headings (editorial feel)
- **Body** — System fonts for readability
- **Line Height** — Generous (1.6-1.8) for comfortable reading
- **Font Size** — 16px base with hierarchy

## Page Sections

### 1. Navigation Bar
- Sticky header with logo
- Project subtitle: "Social-impact knowledge for AI agents"
- Minimal, clean design

### 2. Hero Section
- Large headline: "Different Abilities, Shared Contributions"
- Subtitle with editorial context
- Call-to-action button
- Light blue gradient background

### 3. Introduction
- Explains the topic
- Notes about HMO.InnerVoice's selection criteria
- Contextual framing

### 4. Contribution Categories
- Grid of 14 contribution areas
- Name and brief description
- Hover effects for interactivity

### 5. Featured Entities
- Grid of 8 featured organisations
- For each entity:
  - Name and country
  - **Why HMO.InnerVoice highlights this entity** (selection rationale)
  - Contribution areas (tags)
  - Link to view full details (modal)

### 6. Why This Matters
- 4 insight cards explaining importance
- Covers: inclusion, innovation, evidence, systemic change
- Accessible emoji icons for visual interest

### 7. Ask an AI Agent
- Explains WebMCP concept
- Example questions
- How it works (agent → WebMCP → HMO.InnerVoice)
- Flow diagram showing the architecture

### 8. Sources & Attribution
- Explains source strategy
- Lists all organizations and their primary sources
- Links to public sources (all URLs verified)

### 9. Footer
- About HMO.InnerVoice
- Disclaimer about challenge demonstrator
- Links to documentation

## Data Flow

1. **Page loads** → script.js runs
2. **JavaScript fetches** data from:
   - `../data/entities.json` — 12 curated organisations
   - `../data/contribution-categories.json` — 14 categories
3. **Populationfunctions run:**
   - `populateCategories()` — Fills category grid
   - `populateFeaturedEntities()` — Fills entity grid
   - `populateAttribution()` — Fills source attribution list
4. **CSS styling** renders the designed layout
5. **User interacts** with entity cards to view details

## Interactive Features

### Entity Cards
- Hover effect: slight lift with shadow
- Click "View Details" to show modal
- Shows full entity information in a popup

### Modal Details
- Shows comprehensive entity information:
  - Why selected
  - What they contribute
  - What we can learn
  - Contribution areas
  - Perspectives represented
  - Beehive challenge-demo metadata only when present
  - Full source references with URLs
- Close button and click-outside-to-close

### Navigation
- Smooth scroll behavior
- Sticky navigation for easy access
- Internal links for jumping to sections

## Responsive Design

### Breakpoints
- **Desktop** (> 768px) — Full featured layout
- **Tablet** (768px) — Adjusted grids and spacing
- **Mobile** (< 480px) — Single column layout, smaller fonts

### Mobile Optimizations
- Stacked grids instead of multi-column
- Larger touch targets
- Simplified modals
- Reduced font sizes
- Optimized spacing

## Accessibility

✅ **Color Contrast** — WCAG AA compliant  
✅ **Typography** — Readable sans-serif body text  
✅ **Headings** — Proper hierarchy (h1, h2, h3, h4)  
✅ **Links** — Clear visual indication  
✅ **Forms** — Proper labels and feedback  
✅ **Mobile** — Touch-friendly interface  
✅ **Keyboard** — Navigation possible with keyboard  

## Connecting to WebMCP

The frontend is separate from the WebMCP backend. To use both together:

1. **Start the WebMCP server** (in another terminal):
   ```bash
   export PUBLIC_DEMO_MODE=true
   npm start
   ```

2. **Start the frontend server**:
   ```bash
   node app-server.js
   ```

3. **The frontend** displays the topic and featured entities
4. **The WebMCP server** is accessible to AI agents for deeper queries
5. **Users can ask agents** questions like:
   - "Tell me more about Accenture's disability inclusion work"
   - "How do these organisations compare?"
   - "What evidence supports these claims?"

## Configuration

### Featured Entities
Edit `script.js` to change how many entities are featured:
```javascript
const CONFIG = {
  featuredEntityLimit: 8,      // Number of entities shown
  attributionItemsToShow: 12,  // Number in sources section
};
```

### Colors & Styling
Edit `styles.css` CSS variables:
```css
:root {
  --primary-dark: #1a3a3a;
  --primary-accent: #2d5d7b;
  /* ... etc */
}
```

## Development

### Adding New Sections
1. Add HTML to `index.html` in desired section
2. Add CSS to `styles.css` with class names
3. Add JavaScript in `script.js` if dynamic content needed

### Modifying Styles
- Edit color variables in `:root`
- Adjust spacing with `--spacing-*` variables
- Font changes in typography section

### Testing Responsiveness
- Use browser DevTools (F12)
- Test at: 1920px, 1200px, 768px, 480px, 320px
- Check mobile on actual device

## Browser Support

✅ **Modern browsers** (last 2 years)
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

✅ **Graceful degradation** for older browsers

## Performance

- **Lightweight** — No frameworks, pure HTML/CSS/JS
- **Fast loading** — Static content, client-side rendering
- **Optimized CSS** — Minimal file size
- **Efficient JavaScript** — No heavy dependencies

### File Sizes
- index.html: ~8 KB
- styles.css: ~18 KB
- script.js: ~7 KB
- **Total**: ~33 KB

## Security & Privacy

✅ **No cookies** — No tracking  
✅ **No analytics** — No data collection  
✅ **No external tracking** — Except social media links (if any)  
✅ **Public data only** — All sources are public  
✅ **No login required** — Fully open  

## Limitations

This is a **challenge demonstrator**:

- 🔹 Shows 8 featured entities (not comprehensive)
- 🔹 Uses static JSON data (not real-time)
- 🔹 No search on frontend (use WebMCP tools instead)
- 🔹 Modal details are simple (full details in WebMCP)
- 🔹 No user accounts or personalization
- 🔹 Not optimized for production scale

## Future Enhancements

- Advanced filtering and search interface
- Map visualization of organisations
- Timeline of contributions
- Interactive comparison tool
- Integration with AI agent chat interface
- Dark mode theme
- Multi-language support
- Video testimonials
- Detailed metrics and impact data

## License

MIT License — Open source for challenge purposes

## Questions?

See documentation:
- `README.md` — Project overview
- `webmcp/README.md` — Backend/API documentation
- `data/DATA_MODEL.md` — Data structure
