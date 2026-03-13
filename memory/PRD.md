# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) with a "Fantasy Sunset" theme. The application serves both Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Fantasy Sunset
All pages now share a consistent visual theme:
- **Background**: Dark purple gradient over scenic mountain/sunset image
- **Glass Panels**: Frosted glass effect with backdrop blur
- **Accent Colors**: Purple (#8B5CF6), Pink (#EC4899), Gold (#F59E0B)
- **Typography**: Cinzel for headers, Montserrat for body
- **Animations**: Tab hover glow, card hover scale, floating logo

## Implemented Features (as of March 2026)

### Authentication & Dashboard
- [x] User authentication (JWT-based)
- [x] Admin panel
- [x] **Unified dashboard with Fantasy Sunset theme**
- [x] Inline campaign creation modal
- [x] Subscription tier badge showing campaign limits
- [x] Proactive campaign limit check before creation
- [x] Custom mini logo (floating animation) in header
- [x] Mobile navigation toggle (Player/GM tabs)

### Character System
- [x] Full character sheet with Fantasy Sunset theme
- [x] Edition selector (2014 vs 2024 rules)
- [x] Subrace and subclass selection
- [x] ASI bonuses displayed inline
- [x] **3D Dramatic Dice Roller** with animated bouncing dice
- [x] All clickable rolls (saves, skills, attacks)
- [x] **Level Up Wizard with MULTICLASSING**
- [x] **Dynamic spellcasting tab** with correct ability by class
- [x] Spell slots display based on level
- [x] Enhanced Notes tab with GM synced notes

### Campaign Dashboard
- [x] **Fantasy Sunset theme applied**
- [x] Glass panel sidebar with purple accents
- [x] Tab hover animations with glow effects
- [x] Gold "CAMPAIGN TOOLS" header
- [x] Consistent background image

### GM Screen
- [x] Fantasy Sunset theme
- [x] Combat control with initiative
- [x] **"Sync to Players" button** for notes
- [x] NPC Name Generator, Dice Roller
- [x] Tab animations with glow effects

### Branding & UI
- [x] **Grand animated "KEEPER" title** on landing page
- [x] Floating logo animation
- [x] Fixed background that scrolls with page
- [x] Mini dragon compass logo in all headers
- [x] Tab hover animations (.tab-glow, .tab-active)
- [x] Card hover effects (.card-hover)
- [x] Press scale animation (.press-scale)

### Mobile Responsiveness
- [x] Mobile navigation toggle
- [x] Responsive grids (single column on mobile)
- [x] Touch-friendly tap targets (44px minimum)
- [x] Safe area support for notched devices
- [x] Responsive text sizes

### Pricing & Subscriptions
- [x] Monthly/Yearly billing toggle
- [x] Yearly savings display
- [x] Promo code support

### GM-Player Sync
- [x] Campaign Timeline API
- [x] GM Note Sync API
- [x] Session Recaps sync
- [x] Player Timeline API

### Integrations
- [x] Stripe (subscription tiers)
- [x] Resend (email)
- [x] Emergent LLM Key (ROOK AI)

## Known Issues
1. **Production Login/Password Reset** - Preview works correctly. Issue is production-specific.

## Upcoming Tasks
1. Test spell dice rolling (click spells for damage)
2. Build frontend player timeline display
3. Verify all class actions (Barbarian rage, etc.)
4. Real-time WebSocket sync

## Technical Architecture
```
/app/frontend/src/components/
├── AuthPage.js           - Fantasy Sunset theme
├── CharacterBuilder.js   - Fantasy Sunset theme (REFERENCE)
├── CharacterSheetFull.js - Fantasy Sunset theme + 3D Dice
├── CampaignDashboard.js  - Fantasy Sunset theme (UPDATED)
├── GMScreen.js           - Fantasy Sunset theme
├── LandingPage.js        - Grand animated KEEPER
├── LevelUpWizard.js      - Multiclassing support
├── PricingPage.js        - Yearly savings
└── UnifiedDashboard.js   - Fantasy Sunset theme (UPDATED)
```

## CSS Animation Classes
- `.tab-glow` - Hover glow effect
- `.tab-active` - Active tab persistent glow
- `.card-hover` - Card hover with scale/shadow
- `.press-scale` - Scale down on press
- `.icon-float` - Floating animation for icons
- `.mobile-stack` - Stack on mobile
- `.mobile-hide` - Hide on mobile

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
