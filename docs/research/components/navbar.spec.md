# Navbar Specification

## Overview
- **Target file:** `src/components/Navbar.tsx`
- **Screenshot:** `docs/design-references/ecwid-desktop.png`
- **Interaction model:** static + scroll-driven (shadow on scroll) + hover dropdown

## DOM Structure
- `.navbar` — fixed top, full width, z-index: 100
  - `.navbar__bg` — white background div
  - `.navbar__inner.container` — flex row, space-between
    - `.navbar__group-left` — logo + nav links
      - `.navbar__logo` — ecwid SVG logo (black)
      - `nav.navbar__links` — nav links
        - `a.navbar__link` — 销售 (has dropdown icon ▾)
        - `a.navbar__link` — 推广
        - `a.navbar__link` — 管理
    - `.navbar__group-right` — auth + CTA
      - `a.navbar__login` — 登录
      - `a.navbar__cta.btn.btn-primary` — 开始

## Computed Styles (exact values from getComputedStyle)

### Container `.navbar`
- position: fixed
- top: 0
- left: 0
- right: 0
- height: 80px
- background-color: rgb(255, 255, 255)
- z-index: 100
- box-shadow: none (default) → 0 2px 8px rgba(0,0,0,0.1) (scrolled)
- transition: box-shadow 0.3s ease

### `.navbar__inner`
- display: flex
- justify-content: space-between
- align-items: center
- height: 80px
- max-width: 1200px
- margin: 0 auto
- padding: 0 15px

### Logo SVG
- width: auto
- height: 28px
- fill: #000000

### Nav links
- font-family: Montserrat, sans-serif
- font-size: 14px
- font-weight: 600
- letter-spacing: 0.4px
- color: rgb(0,0,0)
- text-transform: none
- margin-right: 24px
- padding: 8px 0
- text-decoration: none

### Login link
- font-family: Montserrat, sans-serif
- font-size: 14px
- font-weight: 600
- color: rgb(0,0,0)
- margin-right: 16px

### CTA Button `.btn-primary`
- background-color: rgb(0,0,0) = #000000
- color: rgb(255,255,255)
- border: 2px solid #000
- border-radius: 6px
- padding: 6px 14px
- font-size: 14px
- font-weight: 600
- letter-spacing: 0.6px
- text-transform: uppercase
- cursor: pointer

## States & Behaviors

### Scroll-triggered shadow
- **Trigger:** scroll position > 10px
- **State A (before):** box-shadow: none
- **State B (after):** box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- **Transition:** transition: box-shadow 0.3s ease
- **Implementation:** useEffect + scroll event listener

### Sales dropdown (hover)
- **Trigger:** hover on 销售 link
- **Shows:** dropdown with "销售" and "Facebook" sub-links
- **Implementation:** CSS :hover with absolute positioned dropdown

### Mobile burger menu
- **Trigger:** viewport < 992px
- **Shows:** hamburger icon, hides desktop nav
- **Mobile CTA:** full-width "开始" button in mobile menu
- **Implementation:** useState toggle

## Assets
- Logo: inline SVG (ecwid logo) — black color
- No images needed

## Text Content (verbatim)
- Nav links: 销售, 推广, 管理
- Login: 登录
- CTA: 开始
- Dropdown: 销售, Facebook

## Implementation Notes
- Navbar must have `position: fixed; top: 0; z-index: 100`
- The page needs `padding-top: 80px` to account for fixed nav
- Dropdown items: 销售 → /zh-CN/sell, Facebook → /zh-CN/facebook
- 推广 → /zh-CN/promote, 管理 → /zh-CN/manage
- 登录 → https://my.ecwid.com/cp/
- 开始 → https://my.ecwid.com/cp/#register

## Responsive Behavior
- **Desktop (1440px):** Logo + nav links left, login + CTA right
- **Mobile (390px):** Logo + burger icon only; burger opens slide-down menu
- **Breakpoint:** 992px
