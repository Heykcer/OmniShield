---
name: Executive Cyber Trust
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
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006243'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d57'
  on-tertiary-container: '#bdffdc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-metric:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system projects precision, institutional resilience, and crystalline operational clarity. Designed specifically for security executives, compliance officers, and SecOps analysts, the system dispenses with hyperbolic "hacker" tropes, heavy dark-mode bias, and visual noise in favor of an exacting, high-definition architectural clarity.

The aesthetic philosophy draws on **Corporate / Modern High-Precision Minimalism**. Visual authority is established via pure luminous white canvases, subtle slate-gray structural offsets, hair-thin geometric boundaries, and crisp typographic cadence. Interactive elements deliver instantaneous feedback with disciplined poise, evoking absolute trust, speed, and governance over mission-critical digital infrastructure.

## Colors

The color palette reinforces clarity and operational legibility under dense telemetry conditions. 

- **Surface & Backgrounds**: The base canvas is absolute white (`#FFFFFF`), with tiered analytical surfaces layered using subtle cooler grays: Base Canvas (`#FFFFFF`), Secondary Canvas (`#F8FAFC`), and Structural Layer (`#F1F5F9`).
- **Primary & Interactive**: Deep cobalt blue (`#2563EB`) acts as the focal anchor for key system commands, active navigational markers, and focus states. High-emphasis corporate accents utilize dark sovereign slate (`#0F172A`).
- **Boundaries**: All card interfaces, toolbars, and segmented controls use a fine slate border (`#E2E8F0`). Secondary divisions and data grid dividers utilize subtle hairline lines (`#F1F5F9`).
- **Semantics & Telemetry**: Strictly calibrated for swift situational recognition:
  - **Secure / Verified**: Emerald (`#059669`) with an ambient background tint (`#ECFDF5`).
  - **Elevated / Warning**: Amber (`#D97706`) with an ambient background tint (`#FFFBEB`).
  - **Critical Threat / Breach**: Rose (`#E11D48`) with an ambient background tint (`#FFF1F2`).
  - **Informational / Neutral Telemetry**: Slate (`#64748B`) with an ambient background tint (`#F8FAFC`).

## Typography

Typography prioritizes high-density readability and swift scannability. Inter serves as the foundation across headlines, labels, and analytical metrics, paired with JetBrains Mono for system addresses, IP signatures, hashes, and audit log timestamps.

- **Headlines & Metric Summaries**: Use negative letter tracking (`-0.01em` to `-0.025em`) and semi-bold/bold weights to guarantee firm, grounded titles.
- **Labels & System Status**: Uppercase or title-case micro-labels utilize positive tracking (`0.04em`) with medium-to-semibold weights for unambiguous visual distinction in dense data grids.
- **Body & Numerical Readouts**: Standard body text enforces a slate hierarchy: primary details appear in `#0F172A`, secondary commentary in `#334155`, and supporting metadata in `#64748B`.

## Layout & Spacing

The layout employs a high-density, mathematical 12-column fluid grid system engineered to accommodate expansive monitoring dashboards, data tables, and topological threat graphs.

- **Grid Architecture**: 
  - **Desktop (>= 1280px)**: 12-column fluid grid with `gutter-lg` (`2rem`) and `margin` (`2rem`).
  - **Tablet (768px - 1279px)**: 8-column layout with `gutter` (`1.5rem`) and `margin` (`1.5rem`).
  - **Mobile (< 768px)**: 4-column single-stack layout with `gutter-sm` (`1rem`) and `margin-mobile` (`1rem`).
- **Spacing Rhythm**: Spacing is strictly based on an 8pt architectural rhythm, with a half-step `0.25rem` (`4px`) unit reserved strictly for compact metric widgets, badge internal padding, and table row compacting.
- **Density Zones**: High-frequency SecOps log screens drop inner element gaps to `space-xs` and `space-sm`, while analytical executive overviews utilize `space-md` to `space-lg` to prevent cognitive fatigue.

## Elevation & Depth

Visual hierarchy relies on crisp borders and razor-thin ambient shadows rather than dramatic drop-shadows or dark-mode skeuomorphism. The design avoids heavy black shadows, relying on structural offsets tinted with slate.

- **Tier 0 (Base Canvas)**: Flat `#FFFFFF` with no shadow. Structural content regions (such as side navigation panels) sit on `#F8FAFC`.
- **Tier 1 (Surface Cards & KPI Widgets)**: Surface background in pure `#FFFFFF`, bounded by a 1px border (`#E2E8F0`), elevated by a hairline micro-shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Tier 2 (Interactive Flyouts, Filter Panels & Dropdowns)**: Surface background `#FFFFFF`, border 1px (`#CBD5E1`), layered with an ambient shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Tier 3 (Modals & Critical Security Alerts)**: Surface background `#FFFFFF`, surrounded by a 1px border (`#94A3B8`), elevated via: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. Accompanied by a clean, semi-translucent backdrop overlay (`rgba(15, 23, 42, 0.35)` with an ultra-light 2px blur).

## Shapes

The design system incorporates a disciplined, semi-squared corner treatment (`roundedness: 1`). Soft corners balance modern enterprise elegance with structural precision, preserving maximum pixel efficiency across complex data grids and metric arrays.

- **Base Components (Inputs, Buttons, Badges, Tabs)**: `0.25rem` (`4px`) or `0.375rem` (`6px`) radius, creating crisp, defined interaction targets.
- **Containers & Panels (Cards, Drawers, Modals)**: `0.5rem` (`8px`) corner radius (`rounded-lg`), delivering a refined silhouette without consuming inner card padding.
- **Pill Exception**: Reserved solely for operational status pills, alert badges, and numeric count tags, which use full capsule rounding (`9999px`) to distinguish categorical metadata from interactive controls.

## Components

### Buttons
- **Primary**: Solid Cobalt (`#2563EB`) background, white text (`#FFFFFF`), semi-bold. Subtle hover transition to `#1D4ED8`. Active state compresses slightly to scale `0.99`.
- **Secondary / Outline**: Pure white background (`#FFFFFF`), border 1px (`#E2E8F0`), text `#0F172A`. Hover transitions surface to `#F8FAFC` and border to `#CBD5E1`.
- **Destructive**: Rose background (`#E11D48`), text `#FFFFFF`. Hover transitions to `#BE123C`.
- **Ghost**: Transparent background, text `#334155`. Hover transitions to `#F1F5F9`.

### Chips & Status Badges
- **Architecture**: Capsule shapes (`9999px`) with padding `2px 8px`, featuring a 6px solid dot indicator and micro-label text (`label-sm`).
- **Secure**: Background `#ECFDF5`, border 1px `#A7F3D0`, dot `#059669`, text `#065F46`.
- **Warning**: Background `#FFFBEB`, border 1px `#FDE68A`, dot `#D97706`, text `#92400E`.
- **Critical**: Background `#FFF1F2`, border 1px `#FECDD3`, dot `#E11D48`, text `#9F1239`.

### Form Controls & Inputs
- **Inputs**: Solid `#FFFFFF` fill, 1px `#E2E8F0` border, `0.375rem` radius, text `#0F172A`. Focused state triggers a crisp 1px ring in Cobalt (`#2563EB`) with a delicate outer blur shadow `0 0 0 3px rgba(37, 99, 235, 0.12)`.
- **Checkboxes & Radios**: 16px diameter, bordered with `#CBD5E1`. When selected, filled with `#2563EB` bearing a crisp white glyph.

### Cards & KPI Tiles
- Constructed with `#FFFFFF` background, 1px `#E2E8F0` border, and `space-lg` (`1.5rem`) internal padding.
- Header zones partition meta-actions using a clean top layout, paired with JetBrains Mono sparkline readouts, trend indicators, and clear delta badges (`+2.4%`).

### Data Tables & Incident Logs
- Alternating subtle rows (`#FFFFFF` to `#F8FAFC`) with hairline borders (`#F1F5F9`).
- Column headers styled in uppercase `label-sm` with slate `#64748B` typography, featuring interactive sort carats and fixed-width alignment for IP and timestamp fields.