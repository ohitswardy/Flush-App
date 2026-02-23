# Flush — Restroom Finder App

> A mobile-first, map-centered restroom-finder application built with React, Tailwind CSS v4, Leaflet, and Framer Motion.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Screens & Components](#screens--components)
6. [User Flows](#user-flows)
7. [Design Rationale](#design-rationale)
8. [Accessibility](#accessibility)
9. [Implementation Notes for Engineering](#implementation-notes-for-engineering)
10. [Database Schema (MySQL)](#database-schema-mysql)
11. [API Endpoints](#api-endpoints)
12. [Assets & Exports](#assets--exports)
13. [Interaction Specs](#interaction-specs)
14. [Dark Mode](#dark-mode)

---

## Overview

**Flush** (Filipino for "bathroom") is a community-driven restroom finder app designed for speed, clarity, and accessibility. It helps users locate clean, accessible restrooms nearby — with ratings, reviews, and filtering by amenities like wheelchair access, gender-neutral facilities, and baby-changing stations.

### Key Principles
- **Map-first experience** — the map is always the primary view
- **Speed for urgency** — restroom finding is time-sensitive; every tap counts
- **Inclusive by default** — accessibility features are first-class, not afterthoughts
- **Community-powered** — users add, rate, and report restrooms

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:3000`.

---

## Project Structure

```
Flush/
├── public/
│   └── FlushIcon.png          # App favicon/icon
├── src/
│   ├── components/
│   │   ├── TopNav.jsx          # Top navigation bar + side menu
│   │   ├── Onboarding.jsx      # 3-screen onboarding flow
│   │   ├── MapView.jsx         # Leaflet map with custom markers
│   │   ├── MapControls.jsx     # Search bar, filter button, FABs
│   │   ├── SearchOverlay.jsx   # Full-screen search with suggestions
│   │   ├── FilterSheet.jsx     # Bottom sheet with filter options
│   │   ├── DetailSheet.jsx     # Location detail bottom sheet + full page
│   │   ├── AddRestroomScreen.jsx  # 3-step add restroom form
│   │   ├── ReportScreen.jsx    # Issue reporting form
│   │   ├── ProfileScreen.jsx   # Saved list, contributions, settings
│   │   ├── SettingsScreen.jsx  # App settings (preferences, privacy, data)
│   │   ├── PrivacyScreen.jsx   # Privacy policy with accordion sections
│   │   ├── HelpSupportScreen.jsx # FAQ, search, contact support
│   │   ├── FeedbackScreen.jsx  # Send feedback form (bug/feature/etc.)
│   │   ├── TermsScreen.jsx     # Terms of service
│   │   └── StateScreens.jsx    # Error, empty, offline, loading states
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── data/
│   │   └── mockData.js         # Mock restroom data, reviews, helpers
│   ├── App.jsx                 # Root app with screen routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind v4 imports + custom styles
├── index.html                  # HTML entry
├── vite.config.js              # Vite configuration
├── package.json
└── DOCUMENTATION.md            # This file
```

---

## Design System

### Color Palette

#### Primary — Teal
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#f0fdfa` | Subtle backgrounds |
| `primary-100` | `#ccfbf1` | Hover states |
| `primary-200` | `#99f6e4` | Borders |
| `primary-500` | `#14b8a6` | Secondary buttons |
| `primary-600` | `#0d9488` | **Primary brand / CTAs** |
| `primary-700` | `#0f766e` | Active/pressed states |
| `primary-900` | `#134e4a` | Dark mode accents |

#### Accent — Amber
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-400` | `#fbbf24` | Ratings, stars |
| `accent-500` | `#f59e0b` | Warnings, highlights |
| `accent-600` | `#d97706` | Active star ratings |

#### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22c55e` | Open status, verified |
| `warning` | `#f59e0b` | Offline, caution |
| `error` | `#ef4444` | Closed status, reports, errors |
| `info` | `#3b82f6` | Accessible markers, information |

#### Neutral Scale
- `neutral-50` through `neutral-950` — used for surfaces, text, borders
- Light theme surface: `#ffffff`
- Dark theme surface: `#0a0a0a`

#### Marker Colors (Map)
| Type | Color | Hex |
|------|-------|-----|
| Standard | Teal | `#0d9488` |
| Wheelchair Accessible | Blue | `#3b82f6` |
| Gender Neutral | Purple | `#8b5cf6` |
| Family Room | Amber | `#f59e0b` |

### Typography

**Primary typeface:** Inter (with system fallback stack)

```
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Heading XL | 28px | 700 (Bold) | 1.2 | Onboarding titles |
| Heading L | 20px | 700 | 1.3 | Section headers |
| Heading M | 18px | 700 | 1.3 | Sheet titles |
| Heading S | 16px | 600 (Semibold) | 1.4 | Screen titles |
| Body | 15px | 400 (Regular) | 1.5 | Primary body text |
| Body Small | 14px | 400 | 1.5 | Secondary content |
| Caption | 13px | 500 (Medium) | 1.4 | Labels, metadata |
| Micro | 11px | 500 | 1.3 | Badges, chips |
| Tiny | 10px | 500 | 1.2 | Timestamps, attribution |

### Spacing Scale

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 8px | Small chips, tags |
| `md` | 12px | Cards, inputs |
| `lg` | 16px | Sheets, large cards |
| `xl` | 24px | Bottom sheets top corners |
| `full` | 9999px | Pills, FABs, avatar |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `md` | `0 4px 6px -1px rgba(0,0,0,0.07)` | Cards |
| `lg` | `0 10px 15px -3px rgba(0,0,0,0.08)` | Floating elements |
| `xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Modals |
| `sheet` | `0 -4px 24px rgba(0,0,0,0.12)` | Bottom sheets |

### Iconography

Uses [Lucide React](https://lucide.dev) — consistent 24px line icons with 1.5px stroke. Filled variants used for active/selected states (e.g., filled star for ratings, filled heart for saved).

---

## Screens & Components

### 1. Onboarding (3 screens)
- **Welcome** — app intro with restroom finding value prop
- **Community** — ratings and review contribution pitch
- **Location Permission** — explicit permission request with privacy assurance

### 2. Home / Map Screen (Primary)
- Full-screen Leaflet map (CARTO Light/Dark tiles for desaturated backgrounds)
- **TopNav:** Logo pill (left, tappable to home) + hamburger pill (right, opens side menu)
- **Search bar:** Floating, rounded, below top nav — tapping opens full-screen search
- **Filter button:** Integrated into search bar right side
- **FABs (bottom-right):** My Location + Add Restroom
- **Markers:** Custom SVG markers color-coded by accessibility type
- **Offline banner:** Appears when connection lost

### 3. Search Overlay
- Full-screen takeover with back arrow + input
- Type-ahead against restroom names, addresses, types, and amenities
- Recent searches (persisted in localStorage)
- Quick filter chips (Top Rated, Accessible, Nearest, Open Now)
- Results list with thumbnail, rating stars, distance, open status, amenity badges

### 4. Filter Bottom Sheet
- Snap-open sheet from bottom
- Distance radius toggle (500m, 1km, 2km, 5km)
- Minimum rating toggle (Any, 3+, 3.5+, 4+, 4.5+)
- Accessibility toggles (wheelchair, gender-neutral, family room, baby changing)
- Open Now toggle
- Reset + Apply buttons

### 5. Location Detail Sheet
- **Collapsed (peek):** Name, verified badge, address, rating, distance, open status, amenity pills, action buttons (Directions, Save, Share), "More details" link
- **Expanded (full):** Photos carousel, hours, last verified date, reviews list, write review CTA, report issue link

### 6. Add Restroom (3-step wizard)
- Step 1: Name, address, location type (mall, restaurant, public, etc.)
- Step 2: Amenities toggles + notes
- Step 3: Photo upload + rating + summary
- Success state with verification messaging

### 7. Report Issue
- Issue type selection (cleanliness, broken, safety, locked, no supplies, other)
- Optional detail text
- Optional photo attachment
- Success confirmation

### 8. Profile Screen
- User card with stats (saved, contributions, reviews)
- Tabs: Saved / Contributions / Settings
- Saved: list of bookmarked restrooms with quick nav
- Contributions: history with status badges (verified, published, under review)
- Settings: account, notifications, privacy, cache, about

### 9. Hamburger Side Menu
- Slides in from right with backdrop blur
- User info / sign-in prompt
- Navigation: Saved Restrooms, Add a Restroom, My Contributions
- Divider
- Settings, Privacy, Help & Support, Send Feedback, Terms
- Dark mode toggle (at bottom)
- Sign out (if authenticated)

### 10. State Screens
- **Offline:** WifiOff icon, message about cached results, retry button
- **Location Denied:** MapPinOff icon, manual search option, settings link
- **Empty Map:** No results found, clear filters CTA
- **Error:** Generic error with retry
- **Loading:** Animated bouncing pin

### 11. Settings Screen
- Grouped by section: Account, Preferences, Privacy & Location, Data & Storage, About
- Toggle switches for dark mode, notifications, location sharing
- Nav items for language, map provider, profile visibility
- Clear cache action with confirmation dialog (animated)
- Links to Privacy Policy, Terms of Service, Help & Support
- Sign out button (if authenticated)

### 12. Privacy Policy Screen
- Hero header with shield icon and "last updated" date
- Accordion-style sections (expand/collapse): Information We Collect, How We Use Your Data, Data Sharing, Location Privacy, Data Security, Your Rights, Data Deletion
- Each section contains multiple sub-items with title + description
- Contact block at bottom for privacy questions

### 13. Help & Support Screen
- Hero header with search input for filtering FAQs
- Quick action cards: Send Feedback, Email Us
- 8 FAQ items as expand/collapse accordion with icons
- Topics cover: finding restrooms, adding restrooms, ratings, reporting, accessibility, offline use, location privacy, accounts
- Empty state when search returns no matches
- "Still need help?" contact card at bottom

### 14. Send Feedback Screen
- Feedback type selector: Bug Report, Feature Request, Improvement, Appreciation (color-coded cards)
- 5-star overall rating for the app
- Message textarea with placeholder that adapts to selected type + character counter
- Screenshot attachment button
- Optional email input for follow-up
- Submit with loading state and success confirmation screen

### 15. Terms of Service Screen
- Hero header with FileText icon and effective date
- 8 content sections: Acceptance of Terms, Description of Service, User Accounts, User-Generated Content, Prohibited Conduct, Content Moderation, Disclaimers & Limitations, Community Guidelines
- Each section in a card with icon, title, and paragraphs
- Bulleted lists for prohibited conduct and community guidelines
- Contact block at bottom for legal questions

---

## User Flows

### Primary: Find Restroom
```
Onboarding → Map → Tap marker → Detail sheet (peek) → Expand → Directions
                  → Search → Results list → Select → Detail → Directions
                  → Filter → Adjusted results → Tap marker → Detail
```

### Add Restroom
```
Map → FAB (+) → Step 1 (Info) → Step 2 (Amenities) → Step 3 (Photos) → Submit → Success
```

### Report Issue
```
Detail sheet → Report link → Select issue type → Details → Submit → Success
```

### Save & Review
```
Detail sheet → Tap heart → Saved (accessible from Profile)
Detail sheet → Write review → Submit
```

---

## Design Rationale

### Navigation
- **Floating pills** for logo and hamburger instead of a solid bar — keeps the map fully visible while maintaining clear navigation. The pills use backdrop blur for legibility over any map content.
- **Right-side hamburger** follows natural thumb reach on mobile; side menu slides from right for consistency.
- **Logo tap returns home** — standard mobile pattern for reliable home navigation.

### Color Choice
- **Teal primary (#0d9488)** — chosen for trust, cleanliness association, and strong contrast on both light and dark backgrounds. Passes WCAG AA (4.5:1 contrast ratio against white).
- **Amber accent** — warm contrast to teal, used sparingly for ratings and highlights.
- **Desaturated map tiles** (CARTO Light/Dark) — reduces visual noise so colored markers stand out clearly.

### Accessibility
- **Color + icon + label** for all accessibility indicators — never color alone
- **44px minimum touch targets** enforced across all interactive elements
- **Semantic HTML** (role attributes, aria-labels, aria-expanded)
- **Contrast ratios** meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Large font support** — relative units (rem/em) throughout; no fixed pixel sizes that break with zoom

### User Flow
- **Map-first** because the primary use case is proximity-based — users need spatial context immediately
- **Bottom sheet pattern** over full-screen navigation — keeps map context while revealing details progressively
- **Search is prominent but non-intrusive** — floating bar that opens to dedicated overlay, never covering the map unintentionally
- **Progressive disclosure** in detail sheet — peek shows essentials (name, rating, distance, actions), expand shows everything

---

## Accessibility

### WCAG AA Compliance
- All text meets 4.5:1 contrast ratio against backgrounds
- Interactive elements meet 3:1 contrast ratio
- Focus indicators visible on keyboard navigation
- Screen reader support via ARIA attributes

### Accessible Restroom Indicators
Every accessibility feature uses a **triple-encoding** approach:
1. **Color** — blue for wheelchair, purple for gender-neutral, amber for family
2. **Icon** — Accessibility, Users, Baby icons from Lucide
3. **Text label** — explicit "Wheelchair Accessible", "Gender Neutral", etc.

### Touch Targets
All interactive elements enforce a minimum 44x44px touch area using the `.touch-target` utility class.

### Large Font / Zoom
- Typography uses relative sizing
- Layouts use flexbox/grid that reflow with text scaling
- Tested guidance: verify at 200% zoom on mobile Safari/Chrome

---

## Implementation Notes for Engineering

### API Hooks

| Hook | Purpose | Data |
|------|---------|------|
| `GET /api/restrooms` | List restrooms near location | `lat`, `lng`, `radius`, `filters` |
| `GET /api/restrooms/:id` | Single restroom detail | Full restroom object |
| `GET /api/restrooms/:id/reviews` | Reviews for a restroom | Paginated review list |
| `POST /api/restrooms` | Add new restroom | Form data + photos |
| `POST /api/restrooms/:id/reviews` | Add review | Rating, text |
| `POST /api/restrooms/:id/reports` | Report issue | Issue type, details, photo |
| `GET /api/search` | Search restrooms | Query string, filters |
| `POST /api/auth/login` | User authentication | Email, password |
| `GET /api/users/me/saved` | User's saved restrooms | Array of restroom IDs |
| `PUT /api/users/me/saved` | Toggle saved restroom | Restroom ID |

### Expected Data Fields

```typescript
interface Restroom {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openHours: string;
  type: 'mall' | 'restaurant' | 'public' | 'government' | 'gas_station' | 'hotel' | 'cafe' | 'other';
  verified: boolean;
  lastVerified: string; // ISO date
  amenities: {
    wheelchair: boolean;
    genderNeutral: boolean;
    babyChanging: boolean;
    familyRoom: boolean;
    bidet: boolean;
    soap: boolean;
    dryer: boolean;
  };
  photos: string[]; // URLs
  reports: Array<{ type: string; date: string }>;
}

interface Review {
  id: number;
  restroomId: number;
  user: string;
  rating: number; // 1-5
  text: string;
  date: string;
  helpful: number;
}
```

### Caching Strategy
- **Map tiles:** Handled by Leaflet/browser cache. Consider a service worker for offline tile caching.
- **Restroom data:** Cache the last-fetched restroom list in `localStorage` or IndexedDB. Show cached data with a stale indicator when offline.
- **Search results:** Cache recent search results for instant replay.
- **User data:** Saved list and recent searches already stored in `localStorage`.

### Analytics Events

| Event | Trigger | Properties |
|-------|---------|------------|
| `onboarding_start` | First app open | — |
| `onboarding_complete` | Finish onboarding | `locationGranted: boolean` |
| `search_performed` | Submit search | `query`, `resultCount` |
| `filter_applied` | Apply filters | `filters` object |
| `restroom_viewed` | Open detail sheet | `restroomId`, `source: 'marker' | 'search'` |
| `directions_tapped` | Tap directions | `restroomId` |
| `restroom_saved` | Toggle save | `restroomId`, `saved: boolean` |
| `restroom_added` | Submit new restroom | `type`, `amenityCount` |
| `report_submitted` | Submit report | `restroomId`, `issueType` |
| `review_submitted` | Submit review | `restroomId`, `rating` |
| `dark_mode_toggled` | Toggle dark mode | `enabled: boolean` |

---

## Database Schema (MySQL)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE restrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  type ENUM('mall','restaurant','public','government','gas_station','hotel','cafe','other') DEFAULT 'other',
  is_open BOOLEAN DEFAULT TRUE,
  open_hours VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  last_verified DATE,
  wheelchair BOOLEAN DEFAULT FALSE,
  gender_neutral BOOLEAN DEFAULT FALSE,
  baby_changing BOOLEAN DEFAULT FALSE,
  family_room BOOLEAN DEFAULT FALSE,
  bidet BOOLEAN DEFAULT FALSE,
  soap BOOLEAN DEFAULT TRUE,
  dryer BOOLEAN DEFAULT FALSE,
  notes TEXT,
  added_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id),
  INDEX idx_location (lat, lng),
  INDEX idx_type (type)
);

CREATE TABLE restroom_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restroom_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restroom_id) REFERENCES restrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restroom_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restroom_id) REFERENCES restrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_restroom (restroom_id)
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restroom_id INT NOT NULL,
  user_id INT,
  type ENUM('cleanliness','broken','safety','locked','no_soap','other') NOT NULL,
  details TEXT,
  photo_url VARCHAR(500),
  status ENUM('pending','reviewed','resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restroom_id) REFERENCES restrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE saved_restrooms (
  user_id INT NOT NULL,
  restroom_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, restroom_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restroom_id) REFERENCES restrooms(id) ON DELETE CASCADE
);
```

---

## Assets & Exports

### Icon Library
All icons use Lucide React. Key icons used:

| Icon | Component | Usage |
|------|-----------|-------|
| `MapPin` | Logo, markers | Brand, location pins |
| `Search` | SearchOverlay | Search functionality |
| `SlidersHorizontal` | MapControls | Filter button |
| `Menu` / `X` | TopNav | Hamburger open/close |
| `Locate` | MapControls, Onboarding | Current location |
| `Plus` | MapControls | Add restroom FAB |
| `Star` | DetailSheet, Search | Ratings |
| `Heart` | DetailSheet, Profile | Saved |
| `Navigation` | DetailSheet | Directions |
| `Flag` | DetailSheet | Report issue |
| `Accessibility` | Filter, Detail, Search | Wheelchair access |
| `Users` | Filter, Detail | Gender neutral / family |
| `Baby` | Filter, Detail | Baby changing |
| `Moon` / `Sun` | SideMenu | Dark mode toggle |

### App Icon
PNG icon at `public/FlushIcon.png` — app favicon and brand icon. Export at:
- 1x: 64x64
- 2x: 128x128
- 3x: 192x192
- App Store: 1024x1024

### Map Markers
Custom SVG markers generated dynamically in `MapView.jsx`. Four color variants:
- Default (teal `#0d9488`)
- Accessible (blue `#3b82f6`)
- Gender-neutral (purple `#8b5cf6`)
- Family (amber `#f59e0b`)

---

## Interaction Specs

### Animation Durations & Easings

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Bottom sheet open | Spring (damping: 30, stiffness: 300) | spring | Sheet appearance |
| Side menu slide | Spring (damping: 30, stiffness: 300) | spring | Menu open/close |
| Search overlay | 200ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Search open/close |
| Fade in/out | 200ms | `ease-out` | Backdrop, overlays |
| Button press | 100ms | `ease-in-out` | `scale(0.98)` on active |
| Marker drop | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | New marker appearance |
| Map fly-to | 500-800ms | built-in Leaflet easing | Camera transitions |
| Toggle switch | 200ms | `ease-in-out` | Filter toggles |
| Onboarding slide | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Screen transitions |

### Component States

| Component | States |
|-----------|--------|
| Button (Primary) | Default, Hover, Active (scale 0.98), Disabled (opacity 40%), Loading |
| Button (Secondary) | Default, Hover, Active, Disabled |
| Toggle | Off, On (with slide transition) |
| Filter chip | Unselected, Selected (primary bg + white text) |
| Search input | Empty, Focused (ring), Filled, Clearing |
| Marker | Default, Hovered (scale 1.15), Selected (larger size) |
| Bottom sheet | Hidden, Peek (45vh), Full (top 12px to bottom) |
| Side menu | Closed, Open (300px from right) |

### Touch Targets
- Minimum: 44x44px for all interactive elements
- FABs: 48x48px (location), 56x56px (add restroom)
- Nav pills: 44px height minimum
- List items: full width, 48px minimum height

---

## Dark Mode

Dark mode is supported across all screens and toggleable from the side menu. Tokens automatically adapt:

| Element | Light | Dark |
|---------|-------|------|
| Surface | `#ffffff` | `#0a0a0a` |
| Surface elevated | `#ffffff` | `#171717` |
| Text primary | `#171717` | `#f5f5f5` |
| Text secondary | `#737373` | `#a3a3a3` |
| Border | `#e5e5e5` | `#262626` |
| Input background | `#f5f5f5` | `#262626` |
| Card background | `#fafafa` | `rgba(38,38,38,0.5)` |
| Map tiles | CARTO Light | CARTO Dark |

Dark mode preference is:
1. Initialized from `prefers-color-scheme` media query
2. Persisted in `localStorage`
3. Toggled via the `dark` class on `<html>`

---

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| SE | 320px | iPhone SE — tightest layout |
| Standard | 375px | iPhone 12/13/14 — primary target |
| Plus | 414px | iPhone Plus/Max — more breathing room |
| Tablet | 768px+ | Side-by-side layout possible (future) |

All components use fluid widths (`w-full`, percentages, `max-w-*`) and safe-area insets for notched devices.

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Animation frame rate | 60fps |
| Touch response | < 100ms |
| Bundle size (gzipped) | < 200KB |

---

*Built with React 19, Vite 6, Tailwind CSS v4, Leaflet, Framer Motion, and Lucide Icons.*
