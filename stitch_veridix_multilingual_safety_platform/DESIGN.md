---
name: AI Safety & Red-Teaming System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#005683'
  on-tertiary: '#ffffff'
  tertiary-container: '#006fa8'
  on-tertiary-container: '#dbecff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.03em
  code-sm:
    fontFamily: monospace
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter: 1rem
  panel-padding: 1.25rem
---

## Brand & Style

The design system establishes an ultra-precise, mission-critical workspace for enterprise AI security teams, ML researchers, and compliance officers evaluating multilingual safety drift and automated adversarial stress tests. 

### Design Movement & Core Philosophy
The visual direction fuses **Systematic Utility** with **Linear-inspired precision engineering**. It departs from flashy, consumer AI tropes, centering on high-density information architecture, surgical clarity, and strict visual rhythm. The interface behaves like an advanced telemetry and diagnostic console—restrained, calm, and unmistakably authoritative.

### Emotional Demeanor
- **Surgical Accuracy:** Every pixel alignment, border rule, and data point conveys uncompromising rigour.
- **Institutional Confidence:** Restrained neutral slate tones reinforce audit-readiness and enterprise security clearance.
- **Focused Urgency:** Accent colors appear solely to flag safety thresholds, toxic prompt anomalies, and drift regressions.

## Colors

The palette is engineered for high data density, legibility across complex matrices, and zero visual fatigue during prolonged audit sessions.

### Functional Roles

- **Primary (`#0F766E` / Deep Teal):** Represents systemic integrity, verified safety guards, and primary active states. Used for high-priority actions, verified scorecards, and active tracking tabs.
- **Secondary (`#334155` / Deep Slate):** Anchors core chrome, primary typography, selected segmented controls, and structural dividers.
- **Tertiary (`#0284C7` / Precision Blue):** Designates telemetry data streams, active prompt execution nodes, and evaluation pipeline runs.
- **Neutral (`#64748B` / Slate Grey):** Defines muted metadata, secondary text, inactive step indicators, and structural grid rules.

### Surface Architecture & Semantic Tokens
- **Background Canvas:** `#F8FAFC` (Slate 50) — Off-white canvas dampening eye strain.
- **Panel Surface:** `#FFFFFF` — Clean structural cards and data panels.
- **Subtle Surface:** `#F1F5F9` (Slate 100) — Code snippets, multilingual test cases, and table headers.
- **Border Default:** `#E2E8F0` (Slate 200) — 1px structural hairpins.
- **Border Hover/Active:** `#CBD5E1` (Slate 300).
- **Safety Critical Semantic Tones:**
  - **Attack Success / Red Team Breach:** `#E11D48` (Rose 600) / Surface: `#FFF1F2`.
  - **Drift Warning / Instability:** `#D97706` (Amber 600) / Surface: `#FFFBEB`.
  - **Compliant / Zero-Vulnerability:** `#059669` (Emerald 600) / Surface: `#ECFDF5`.

## Typography

Inter serves as the sole typographic foundation across headlines, functional prose, and interactive triggers, complemented by standard monospaced families for audit traces and code payloads.

### Multilingual Support (English, Hindi, Hinglish)
- Inter’s OpenType feature set handles standard Latin scripts alongside seamless Hinglish code-switching.
- For Devanagari script renders in Hindi evaluation outputs, typography must render with consistent baseline alignments, using `line-height: 1.5` minimum to prevent diacritic clipping.

### Hierarchy & Treatment Rules
- **Tabular Figures:** Numbers in tables, drift percentage trackers, and token latencies must consistently apply `font-feature-settings: "tnum" 1, "cv05" 1`.
- **Labels & Micro-Headers:** Always pair `label-sm` with uppercase transformation and `letterSpacing: 0.03em` for telemetry indicators, test-run statuses, and threat categories.

## Layout & Spacing

The interface employs a dense, structured desktop-first workspace model, prioritizing horizontal data visibility and vertical scan efficiency.

### Grid Architecture
- **Console Grid:** Fluid CSS Grid with a fixed 240px collateral navigation sidebar, collapsible 320px telemetry inspector, and a flexible central runbook space (`minmax(640px, 1fr)`).
- **Data Table Layout:** Fixed column bounds with sub-pixel borders to house multilingual attack matrix logs, token inputs, and safety outputs side-by-side.

### Spacing Rhythms
- Base spacing is calibrated to a strict 4px/8px incremental grid.
- Compact cell density (`space-xs` vertical, `space-sm` horizontal) governs table views, while cards maintain a standard `panel-padding` of 20px (`1.25rem`) to frame statistical graphs and confusion matrices.

## Elevation & Depth

Visual hierarchy is delivered via **Low-Contrast Outlines and Hairline Tonal Tiers** rather than heavy shadow projections.

### Layering Model
1. **Level 0 (Canvas Base):** Background (`#F8FAFC`) with subtle dotted or 1px grid guides.
2. **Level 1 (Card & Module Layer):** Pure white cards (`#FFFFFF`) framed with a 1px solid border (`#E2E8F0`). Zero ambient blur; depth is achieved strictly by surface contrast against `#F8FAFC`.
3. **Level 2 (Interactive Floating / Dropdowns / Popovers):** Pure white container with a 1px border (`#CBD5E1`) and an ultra-diffused shadow: `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03)`.
4. **Level 3 (Modal / Critical Attack Override Overlays):** Framed by `#0F172A` with 30% alpha backdrop filter blur (`backdrop-filter: blur(4px)`). Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system standardizes on **Soft (Level 1)** curvature to sustain an engineered, crisp instrument feel.

### Geometric Scale
- **Base Components (Inputs, Buttons, Badges, Tabs):** `0.25rem` (4px). Clean, clipped edges eliminate visual playfulness.
- **Panels, Modals, Card Containers (`rounded-lg`):** `0.5rem` (8px). Maintains cohesion across larger UI chunks.
- **Nested Inner Containers (`rounded-sm`):** `0.125rem` (2px). Used for code execution tags and inline token highlights.
- **Indicator Dots / Badges:** Micro-pills (`9999px`) reserved only for real-time connection status or evaluation drift pills.

## Components

### Buttons
- **Primary:** Solid `#0F766E` background, `#FFFFFF` text, `4px` radius, subtle top-edge inset highlight (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15)`). Hover: `#0D6D65`.
- **Secondary / Outlined:** `#FFFFFF` background, 1px solid `#E2E8F0`, text `#334155`. Hover: `#F8FAFC` surface with `#CBD5E1` border.
- **Destructive / Red-Team Action:** `#FFF1F2` background, 1px solid `#FECDD3`, text `#E11D48`. Hover: `#FFE4E6`.
- **Size Scale:** Compact default (`32px` height, `12px` horizontal padding, `label-md` typography) to support high toolbar utility density.

### Chips & Badges
- **Language / Script Badges:** 20px height, `#F1F5F9` background, `#475569` text, 1px border `#E2E8F0`. Distinct visual tags for `EN`, `HI` (Hindi), and `HI-EN` (Hinglish).
- **Safety Drift Status:**
  - *Stable:* `#ECFDF5` background, `#059669` border, `#047857` text.
  - *Drift Detected:* `#FFFBEB` background, `#FDE68A` border, `#B45309` text.
  - *High Hazard / Jailbreak Succeeded:* `#FFF1F2` background, `#FECDD3` border, `#BE123C` text.

### Form Inputs & Prompts
- **Text Inputs & Filter Bars:** `#FFFFFF` fill, 1px `#E2E8F0` border, `4px` radius. Focus ring: no heavy offset glow; instead, crisp 1px border replacement with `#0F766E` and an ambient 2px `#0F766E1A` halo.
- **Adversarial Prompt Workbench:** Multi-line text field with fixed-width mono font preview, line numbering along the gutter, and inline character token count anchored to bottom right.

### Data Cards & Drift Panels
- **Metric Cards:** White surface, 1px `#E2E8F0` border, containing micro-sparklines and delta trackers with localized percentage indicators.
- **Evaluation Matrix (Table):** Sticky headers with `#F8FAFC` fill, `#64748B` typography, uppercase `label-sm`. Rows display 1px horizontal separation lines with zero vertical column rules for frictionless horizontal eye-scanning. Hovering over a row highlights the trace run in `#F8FAFC`.