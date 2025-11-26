# MelonTier - Player Ranking Platform

## Overview
MelonTier is a competitive tier-based ranking platform inspired by mctiers.com, designed to showcase Minecraft PvP player rankings across multiple game modes with a modern, gaming-oriented aesthetic. The platform displays player leaderboards, tier badges, combat achievements, and detailed player profiles.

## Current State
The MVP is fully functional with all core features implemented:
- Player leaderboard with top 10+ players
- Multiple game mode categories (10 modes: Overall, LTMs, Vanilla, UHC, Pot, NethOP, SMP, Sword, Axe, Mace)
- Player search functionality with navigation to profiles
- Player profile pages with tier badges, combat achievements, and server info
- Responsive tier badge system with visual hierarchy
- Top 3 player special styling with gold/silver/bronze treatments
- Game mode navigation with horizontal scrollable pills
- Modern, clean UI with card-based layouts
- Dark mode support

## Recent Changes (November 26, 2025)
### Game Modes Update
- Updated all game modes to match mctiers.com:
  - Overall, LTMs, Vanilla, UHC, Pot, NethOP, SMP, Sword, Axe, Mace
- Updated player usernames to realistic Minecraft PvP names
- Custom MelonTier logo branding
- Discord community link: https://discord.gg/Rm49gjeYr9

### Frontend Implementation
- Created complete schema with Player, TierLevel, GameMode, and Region types
- Built all React components:
  - Rankings page with game mode filtering
  - Player profile page with detailed stats
  - Header with search and navigation
  - Game mode navigation pills
  - Player rank cards with special top-3 styling
  - Tier badge system with icons
- Added Google Fonts: Inter and Rajdhani for competitive look
- Implemented gold/silver/bronze color tokens and gradients

### Backend Implementation
- Created in-memory storage with 15 mock players
- Implemented all API endpoints:
  - `GET /api/rankings/:gameMode` - Get rankings by game mode
  - `GET /api/rankings` - Get overall rankings
  - `GET /api/players/search/:query` - Search players by username
  - `GET /api/players/:id` - Get player profile by ID
- Added proper tier sorting logic (HT1 > HT2 > ... > LT4)

### Integration & Polish
- Replaced all emoji with proper Lucide icons
- Fixed query keys to use standard TanStack Query fetcher
- Improved tier badge styling with gradients for HT1 (gold)
- Added combat achievements and server info sections to profile
- Wired search to navigate to player profiles
- Ensured proper loading states with skeletons

## Project Architecture

### Frontend Stack
- React 18 with TypeScript
- Wouter for routing
- TanStack Query v5 for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- Lucide React for icons

### Backend Stack
- Express.js server
- In-memory storage (MemStorage)
- RESTful API design
- Type-safe with shared schema

### Key Design Decisions
- **In-memory storage**: Using MemStorage for MVP (no database dependency)
- **Shared schema**: TypeScript types shared between frontend/backend via `@shared/schema`
- **Component-first**: Modular React components for reusability
- **Design system**: Following design_guidelines.md for consistent gaming aesthetic
- **Elevation system**: Using hover-elevate and active-elevate-2 utilities from index.css

## File Structure
```
client/
  src/
    components/
      header.tsx - Top navigation with search
      game-mode-nav.tsx - Game mode selector pills
      player-rank-card.tsx - Individual player ranking card
      tier-badge.tsx - Tier level badge with icon
      ui/ - Shadcn UI components
    pages/
      rankings.tsx - Main leaderboard page
      player-profile.tsx - Detailed player profile
    lib/
      game-modes.ts - Game mode configuration and icons
      queryClient.ts - TanStack Query setup
server/
  storage.ts - In-memory data storage with mock players
  routes.ts - API endpoint handlers
shared/
  schema.ts - TypeScript types for Player, GameMode, Tier, etc.
```

## API Routes
- `GET /api/rankings/:gameMode` - Rankings filtered by game mode
- `GET /api/rankings` - Overall rankings (all players)
- `GET /api/players/search/:query` - Search players by username
- `GET /api/players/:id` - Get single player profile

## User Preferences
None documented yet.

## Next Steps (Future Enhancements)
- Add user authentication for players to claim profiles
- Implement match history and statistics tracking
- Add filtering and sorting options for leaderboards
- Create player comparison feature
- Add real-time ranking updates
- Implement admin panel for managing players
