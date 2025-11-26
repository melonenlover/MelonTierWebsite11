# Design Guidelines for MCTIERS Ranking Platform

## Design Approach
**Hybrid Gaming Leaderboard System**: Combining esports/gaming leaderboard patterns (Steam, tracker.gg, League rankings) with a clean, data-focused design system foundation for optimal readability and competitive presentation.

## Core Design Principles
- **Competitive Hierarchy**: Clear visual distinction between rank positions
- **Data Scanability**: Quick information absorption for comparing players
- **Gaming Identity**: Energetic but professional aesthetic appropriate for competitive rankings

---

## Typography

**Font Family**: 
- Primary: "Inter" (Google Fonts) - clean, highly legible for data
- Accent: "Rajdhani" (Google Fonts) - gaming-oriented for headings and rank numbers

**Type Scale**:
- Rank Numbers (Top 3): text-5xl/font-black
- Player Names: text-xl/font-semibold
- Titles/Points: text-sm/font-medium uppercase tracking-wide
- Tier Labels: text-xs/font-bold uppercase
- Body/Stats: text-sm/font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 24** for consistent rhythm
- Component gaps: gap-4 to gap-6
- Section padding: py-12 to py-16
- Card padding: p-6
- Container: max-w-7xl mx-auto

**Grid Structure**:
- Navigation: Horizontal scrollable game mode buttons
- Leaderboard: Single column player cards (optimal for ranking context)
- Player profiles: 2-column grid for tier badges (grid-cols-2 md:grid-cols-4)

---

## Component Library

### Navigation Bar
- Fixed top navigation with logo, game mode selector, search bar
- Game mode buttons: Pill-shaped, icon + label, horizontal scroll on mobile
- Active state: Distinct visual treatment
- Search: Prominent search bar with player lookup functionality

### Ranking Cards (Top 3)
- **Enhanced visual treatment** with gradient borders/backgrounds
- Placement badge: Large, metallic-styled (#1 gold, #2 silver, #3 bronze visual metaphor)
- Player skin/avatar: Prominent display
- Title badge: Icon + text for achievement rank
- Points: Large, bold display
- Tier badges: Grid of gamemode icons with tier levels
- Region indicator
- Spacing: mb-6 between top 3 cards

### Ranking Cards (4-10+)
- Streamlined design vs top 3
- Standard placement number
- Consistent card structure: avatar, name, points, tier badges
- Hover state: Subtle elevation/border treatment
- Spacing: mb-3 between cards

### Tier Badge System
- Small circular/square icons for each game mode
- Tier level text overlay (HT1, LT2, etc.)
- Visual hierarchy: Higher tiers more prominent
- Grouped display: Flex layout with gap-2

### Player Profile Page
- Hero section: Large avatar, name, overall rank, total points
- Achievement showcase: Title badges prominently displayed
- Tier breakdown: 2-4 column grid of gamemode-specific tier cards
- Stats section: Tabular or card-based statistics display
- Region and additional metadata

### Server Info Card
- Compact sidebar or header element
- Server IP prominently displayed
- Quick action buttons if applicable

---

## Visual Treatment

**Card Design**:
- Rounded corners: rounded-lg to rounded-xl
- Borders: Subtle borders for definition
- Shadows: Strategic use for depth (shadow-sm for standard, shadow-lg for elevated states)
- Background: Layered backgrounds for hierarchy

**Rank Position Indicators**:
- Top 3: Special visual treatment (larger, enhanced styling, gradient accents)
- Positions 4+: Standard card design
- Placement numbers: Clearly visible, left-aligned or badged

**Interactive States**:
- Hover: Subtle transform or border color change on ranking cards
- Active game mode: Bold indicator on navigation pills
- Click feedback: Smooth transitions (transition-all duration-200)

---

## Images

**Player Avatars**: 
- Minecraft-style 3D skin renders or profile images
- Size: 64x64px (standard cards), 128x128px (top 3), 256x256px (profile hero)
- Placement: Left side of ranking cards, centered in profile hero
- Fallback: Default avatar/silhouette

**Game Mode Icons**:
- SVG icons representing each game mode category
- Size: 24x24px to 32x32px
- Placement: Navigation buttons, tier badges
- Style: Line icons or filled, consistent set

**Tier Badges**:
- Small icons/emblems for tier levels
- Size: 32x32px
- Visual distinction between tier levels (colors/styles)

**No Hero Image**: This is a data-focused application, not a marketing site. Lead with navigation and leaderboard content immediately.

---

## Accessibility
- WCAG AA compliant contrast ratios for all text
- Focus states: Visible focus rings on interactive elements
- Semantic HTML: Proper heading hierarchy
- Keyboard navigation: Full keyboard support for search and navigation
- Screen reader: Descriptive labels for rankings and tier badges

---

## Responsive Behavior

**Mobile (base)**:
- Single column layout
- Horizontal scroll navigation for game modes
- Stacked player card information
- Simplified tier badge display (scrollable if needed)

**Tablet (md:)**:
- Maintain single column leaderboard
- Expanded card layouts
- More tier badges visible simultaneously

**Desktop (lg:)**:
- Full layout with sidebar potential
- Multiple tier badges displayed
- Enhanced visual treatments fully visible