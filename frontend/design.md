# YatraSetu — Design System

> *Yatra* (यात्रा) = Journey · *Setu* (सेतु) = Bridge  
> Connecting every traveller to their next destination.

---

## Brand Identity

**Tagline:** *Your bridge to every journey.*

YatraSetu is an Indian railway ticket booking platform — clean, trustworthy, and efficient. The design blends modern clarity with a subtle warmth that feels distinctly Indian: dependable like the railways themselves, yet approachable for first-time users booking from mobile.

---

## Typography

**Font:** [Google Sans](https://fonts.google.com/specimen/Google+Sans) (as per reference design)

| Role | Weight | Size | Usage |
|---|---|---|---|
| Display | 700 Bold | 32–40px | Hero headings, departure times |
| Heading | 600 SemiBold | 20–24px | Section titles, train names |
| Body | 400 Regular | 14–16px | Descriptions, route info |
| Label | 500 Medium | 12–13px | Tags, badges, captions |
| Data/Mono | 700 Bold | 28–36px | Prices, durations, seat counts |

```css
font-family: 'Google Sans', 'Product Sans', sans-serif;
```

---

## Color Palette

Derived from the reference brand sheet:

| Name | Hex | Usage |
|---|---|---|
| **Charcoal** | `#181d2a` | Text, navbar, dark buttons |
| **Indigo Blue** | `#748efe` | Primary CTA, active states, toggles, progress |
| **Mist** | `#e8ebed` | Backgrounds, input fields, dividers |
| **White** | `#ffffff` | Cards, panels, modal surfaces |
| **Saffron** | `#f4632a` | "Cheapest" badge, alerts, highlight accent |
| **Green** | `#22c55e` | Confirmed/success states |
| **Amber** | `#f59e0b` | Warning, seat availability (low) |

```css
:root {
  --color-charcoal:    #181d2a;
  --color-indigo:      #748efe;
  --color-mist:        #e8ebed;
  --color-white:       #ffffff;
  --color-saffron:     #f4632a;
  --color-green:       #22c55e;
  --color-amber:       #f59e0b;

  --color-text-primary:   #181d2a;
  --color-text-secondary: #6b7280;
  --color-text-muted:     #9ca3af;

  --color-bg-page:    #f0f2f5;
  --color-bg-card:    #ffffff;
  --color-bg-input:   #f5f6f8;
}
```

---

## Spacing & Layout

Based on an **8px base grid**:

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
```

**Border Radius:**
```css
--radius-sm:  8px    /* inputs, tags */
--radius-md:  12px   /* cards */
--radius-lg:  16px   /* panels, modals */
--radius-xl:  24px   /* hero, large containers */
--radius-full: 9999px /* pills, toggles */
```

**Shadows:**
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
```

---

## Components

### Navigation Bar
- Background: `#ffffff`
- Logo: `#748efe` icon + `#181d2a` "yatrasetu" wordmark
- Active nav item: underline in `#748efe`, weight 600
- Icons: `#181d2a`; right-side: settings, bell, avatar
- Search button: dark pill `#181d2a`, white icon

```
[🎫 yatrasetu]   Browse tickets   My Booking   Scheduled   History   [⚙] [🔔] [👤] [🔍]
```

---

### Search Bar
- Full-width rounded container, `border: 1px solid #e8ebed`
- Fields: From · ↔ Swap · To · Departure Date · Return toggle · Passengers · Seat Class
- Swap button: circular, `#181d2a` background, white icon
- Toggle (Return): `#748efe` when active
- Date range chip: calendar icon + date text + caret

---

### Train Result Card

```
┌──────────────────────────────────────────────────────────────────┐
│ [🚂 Logo] Rajdhani Express              Duration: 16h 35m   [↓][↑]│
│                                                                    │
│  06:00  ──●──────●──────●──────●──────●──  22:35                  │
│  New Delhi   Agra  Bhopal  Nagpur  Pune   Mumbai CSMT              │
│  Tue 11 Sep                                       Tue 11 Sep       │
│                                                                    │
│  [🔌 Socket]  [🍽 Meal]  [📶 Wifi]  [📺 TV]      ₹1,840 / incl. tax│
└──────────────────────────────────────────────────────────────────┘
```

- Card background: `#ffffff`, radius `12px`, shadow-sm
- Departure time: `font-size: 36px`, weight 700
- Route dots: `#748efe` for stops, connected by `#e8ebed` line
- Price: `#748efe`, large, weight 700; "/ incl. tax" muted
- Amenity chips: outline style, `#181d2a` icon + label

---

### Badges / Tags

| Badge | Background | Text | Usage |
|---|---|---|---|
| Cheapest | `#f4632a` | white | Lowest price option |
| Recommended | `#748efe` | white | Algorithm pick |
| Popular | `#748efe` (light) | `#748efe` | High bookings |
| N seats left | `#f5f6f8` | `#181d2a` | Scarcity signal |

---

### Filter Panel
- Background: `#ffffff`, width ~260px, sticky sidebar
- Section headers: weight 600, `#181d2a` with collapse chevron
- Time range: dual thumb slider, `#748efe` fill
- Bar chart (price distribution): `#748efe` bars, muted grid
- Checkboxes: `#748efe` fill when checked, `2px` border
- **Apply Filters** button: full-width, `#181d2a`, white text, radius 12px

---

### Select / CTA Button

```css
.btn-primary {
  background: #181d2a;
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 15px;
}

.btn-primary:hover {
  background: #2d3748;
}
```

---

### Time Picker (Dropdown)
- Scroll drum: 3 visible rows, center row bold + `#748efe` highlight
- Format: HH : MM AM/PM
- Border radius: 12px, soft shadow

---

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│                    NAVBAR (64px)                     │
├─────────────────────────────────────────────────────┤
│                  SEARCH BAR (80px)                   │
├──────────────┬──────────────────────────────────────┤
│              │  Sort tabs: Cheapest / Recommended    │
│  FILTERS     ├──────────────────────────────────────┤
│  (260px)     │  RESULT CARD 1                        │
│              ├──────────────────────────────────────┤
│  Time        │  RESULT CARD 2                        │
│  Price       ├──────────────────────────────────────┤
│  Facilities  │  RESULT CARD 3                        │
│  Train type  │  ...                                  │
│              │                                       │
└──────────────┴──────────────────────────────────────┘
```

- Page background: `#f0f2f5`
- Max content width: `1200px`, centered
- Sidebar + results: CSS Grid, `260px 1fr`
- Cards: flex column, gap `12px`

---

## Iconography

Use **Lucide Icons** or **Phosphor Icons** — line style, 20px default size.

| Icon | Context |
|---|---|
| `map-pin` | Station/location input |
| `calendar` | Date selection |
| `users` | Passenger count |
| `armchair` | Seat class |
| `wifi` | WiFi amenity |
| `plug` | Socket amenity |
| `utensils` | Meal amenity |
| `tv` | Television amenity |
| `clock` | Duration |
| `ticket` | Logo / brand |
| `bell` | Notifications |
| `settings` | Settings |
| `bookmark` | Save journey |
| `download` | Download ticket |

---

## Currency & Locale

- Currency symbol: **₹** (INR)
- Date format: `Tue, 11 Sep` (short, friendly)
- Time format: 24-hour preferred; 12-hour optional toggle
- Language: English (primary); Hindi (`हिन्दी`) support planned

---

## Signature Element

**The route timeline strip** — a horizontal dot-and-line journey map inside each result card. Blue dots for stops, a connecting mist-colored line, with transfer times and train numbers shown as inline chips directly on the timeline. This single element communicates the entire journey at a glance and is the most distinctively railway-specific part of the UI.

---

## Accessibility

- Minimum contrast ratio: **4.5:1** for body text
- Focus rings: `2px solid #748efe`, offset `2px`
- Keyboard navigable: all interactive elements
- `prefers-reduced-motion`: disable transitions if set
- ARIA labels on icon-only buttons
- Touch targets: minimum **44×44px** on mobile

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px)  { /* single column, bottom filter sheet */ }

/* Tablet */
@media (max-width: 1024px) { /* collapsible sidebar */ }

/* Desktop */
@media (min-width: 1025px) { /* full sidebar + results layout */ }
```

---

*Design system version 1.0 — YatraSetu*
