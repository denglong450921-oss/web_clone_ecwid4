# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Screenshot:** `docs/design-references/ecwid-desktop.png`
- **Interaction model:** static

## DOM Structure
- `footer.footer`
  - `.footer__top.container` — main link columns
    - `.footer__brand` — Ecwid links
    - `.footer__nav` — 在线销售 links
    - `.footer__social` — Blog, Podcast + social icons
  - `.footer__apps` — App Store + Google Play badges
  - `.footer__bottom.container` — copyright + legal links + country selector

## Computed Styles

### `footer.footer`
- background-color: rgb(255, 255, 255)
- color: rgb(10, 12, 15)
- padding: 80px 0 40px
- border-top: 1px solid rgb(224, 224, 224)

### `.footer__top`
- display: flex
- gap: 60px
- margin-bottom: 40px

### Column headings
- font-family: Montserrat, sans-serif
- font-size: 14px
- font-weight: 700
- letter-spacing: 0.4px
- text-transform: uppercase
- color: rgb(0, 0, 0)
- margin-bottom: 16px

### Footer links
- font-size: 14px
- font-weight: 400
- color: rgb(10, 12, 15)
- text-decoration: none
- display: block
- margin-bottom: 10px
- transition: color 0.1s

### Footer link hover
- color: rgb(0, 0, 0)

### Social icon links
- display: inline-flex
- width: 36px
- height: 36px
- align-items: center
- justify-content: center
- color: rgb(0, 0, 0)
- margin-right: 8px

### App badges row
- display: flex
- gap: 12px
- align-items: center
- margin-top: 16px

### App badge image
- height: 40px
- width: auto

### `.footer__bottom`
- border-top: 1px solid rgb(224, 224, 224)
- padding-top: 24px
- display: flex
- justify-content: space-between
- align-items: center
- flex-wrap: wrap
- gap: 16px

### Copyright text
- font-size: 13px
- color: rgb(102, 102, 102)

### Legal links
- display: flex
- gap: 20px
- font-size: 13px
- color: rgb(102, 102, 102)

## Assets
- App Store badge: `public/images/black-app-store.svg`
- Google Play badge: `public/images/black-google.svg`

## Text Content (verbatim)

Brand column heading: Ecwid
- Ecwid.com → https://www.ecwid.com/
- 帮助中心 → https://support.ecwid.com/

在线销售 column:
- 到处销售 → /zh-CN/sell
- 在 Facebook 上销售 → /zh-CN/facebook

Social:
- Ecwid blog → https://www.ecwid.com/blog
- Ecwid podcast → https://www.ecwid.com/blog/podcast
- Pinterest → https://www.pinterest.com/ecwid
- Facebook → https://www.facebook.com/ecwid
- Twitter/X → https://x.com/ecwid
- Instagram → https://www.instagram.com/ecwid/
- YouTube → https://www.youtube.com/user/EcwidTeam

App Store: https://apps.apple.com/us/app/ecwid-ecommerce/id626731456?mt=8
Google Play: https://play.google.com/store/apps/details?id=com.ecwid.android

Copyright: © 2026 Ecwid by Lightspeed

Legal:
- Privacy Policy → https://www.lightspeedhq.com/legal/privacy-policy/
- DPA → https://www.lightspeedhq.com/legal/data-processing-agreement/
- Terms of Service → https://www.lightspeedhq.com/legal/lightspeed-service-agreement/
- Copyright Policy → https://www.lightspeedhq.com/legal/intellectual-property-infringement-policy

## Responsive Behavior
- **Desktop (1440px):** 3 columns side by side in footer top
- **Mobile (390px):** Columns stack; social icons wrap; bottom row stacks vertically
- **Breakpoint:** 768px
