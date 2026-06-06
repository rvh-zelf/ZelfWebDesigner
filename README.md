# ZelfWebDesigner

A comprehensive, research-backed frontend design skill for AI agents — covering production-grade web UI, HTML-first design systems, accessibility, animation, advertising accommodation, and structured critique.

## What's inside

- **SKILL.md** — The full skill specification. Covers Svelte 5/SvelteKit + DaisyUI + Flowbite UI, WordPress, React+Babel prototypes, HTML slide decks, and motion/animation demos.
- **ad-slots.md** — Ad slot architecture for editorial layouts (CLS prevention, IAB units, sticky sidebar).
- **animation-system.md** — 8-class animation intent taxonomy, token system, WCAG SC 2.3.3 implementation, IntersectionObserver pattern.
- **card-system.md** — 9-variant card design system with interaction states, responsive collapse rules, and pre-emit gate.
- **hero-variants.md** — 10-variant hero taxonomy with 5-question decision framework and per-variant guidance.
- **nav-patterns.md** — Navigation layer architecture, breadcrumb implementation, utility/primary separation.
- **overlay-system.md** — Modal and overlay layer management, z-index token scale, WCAG dialog requirements, focus trap.
- **references/** — Supporting references: Svelte setup, React setup, iconography, verification, animation pitfalls, design styles, and more.

## Philosophy

> Build **real, working** interfaces with a clear aesthetic point of view. No training-default tropes. No filler. Every element earns its place.

Key principles:
- Content-first design — layout follows content, not the other way around
- Anti-slop quality gates — named, researched anti-patterns with explicit alternatives
- WCAG 2.2 AA accessibility — non-negotiable, not optional polish
- Research-backed pattern libraries — every rule cites the study or benchmark behind it

## Stack

Primary: **Svelte 5 / SvelteKit + DaisyUI + Flowbite UI**
Secondary: React + Babel (throwaway `file://` prototypes only)
CMS: WordPress (PHP/HTML/CSS)

## Usage

This skill is designed for use with AI agent platforms that support skill files. Drop the contents into your agent's `skills/frontend-design/` directory and reference `SKILL.md` in your agent configuration.

---

Built by [Zelf](https://github.com/rvh-zelf).
