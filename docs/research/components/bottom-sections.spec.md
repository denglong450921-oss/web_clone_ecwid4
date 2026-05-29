# BottomSections Specification

## Overview
- **Target file:** `src/components/BottomSections.tsx`
- **Screenshot:** `docs/design-references/ecwid-desktop.png`
- **Interaction model:** static (no interactivity except links)

## Contains 3 sub-sections:

### 1. Feature Cards Section (Support, App Store, Mobile)
- **3 cards** in a row (1/3 each on desktop)

#### Card 1: 实时支持
- Icon: SVG hands icon (black)
- Title: **实时支持**
- Body: "您可以根据需要随时获得专业的技术支持。"
- Link: "了解详情" → https://support.ecwid.com/hc/en-us
- Card padding: 40px 40px 80px

#### Card 2: Ecwid 应用商店
- Icon: SVG app store icon (black)
- Title: **Ecwid 应用商店**
- Body: "通过 Ecwid 合作伙伴提供的新工具和应用发展您的在线店铺。"
- Link: "了解详情" → https://www.ecwid.com/apps

#### Card 3: 在移动设备上管理
- Icon: SVG mobile icon (black)
- Title: **在移动设备上管理**
- Body: "随时随地使用 Ecwid 移动应用管理您的业务。"
- Link: "了解详情" → https://www.ecwid.com/ecwid-mobile

### 2. G2 Badges Section
- 5 award badge images in a row (centered)
- Images:
  - `public/images/ShoppingCart_Leader_Leader-1-1703663095.png`
  - `public/images/ShoppingCart_BestUsability_Total-1703663094.png`
  - `public/images/ShoppingCart_BestResults_Total-1703663092.png`
  - `public/images/E-CommercePlatforms_MostImplementable_Total-1-1703663091.png`
  - `public/images/E-CommercePlatforms_BestRelationship_Total-1-1703663090.png`
- Each badge: height 80px, width auto, margin: 0 12px

### 3. CTA Bottom Section
- Background: white
- H2: "开始在线销售"
  - font-size: 48px, font-weight: 700, text-align: center, color: #000
  - margin-bottom: 32px
- CTA Button: "创建商店"
  - background: #000, color: #fff, radius: 6px, padding: 14px 38px 13px
  - font-size: 18px, font-weight: 600, uppercase, letter-spacing: 0.6px
- Text-align center
- Section padding: 88px 0

## Computed Styles

### Feature Cards Row
- display: flex
- gap: 0
- padding-top: 88px

### Card `.hpc-cart`
- display: block
- padding: 40px 40px 80px
- border-radius: 3px
- flex: 1
- text-decoration: none
- color: inherit
- transition: background-color 0.2s ease

### Card hover
- background-color: rgba(0,0,0,0.03)

### Card icon container
- margin-bottom: 24px
- width: 64px
- height: 64px

### Card icon SVG
- width: 64px
- height: 64px
- fill: none

### Card title `.hpc-cart__title`
- font-family: Montserrat, sans-serif
- font-size: 22px
- font-weight: 700
- color: rgb(0, 0, 0)
- margin-bottom: 12px

### Card body `.hpc-cart__text`
- font-size: 16px
- font-weight: 400
- color: rgb(51, 51, 51)
- margin-bottom: 20px

### Card link `.hpc-cart__link`
- font-size: 14px
- font-weight: 600
- text-transform: uppercase
- letter-spacing: 0.4px
- color: rgb(0, 0, 0)

## Assets
- No external images for cards (SVG icons inline)
- Badge images all in public/images/

## Text Content (verbatim)
Cards:
- 实时支持 / 您可以根据需要随时获得专业的技术支持。/ 了解详情
- Ecwid 应用商店 / 通过 Ecwid 合作伙伴提供的新工具和应用发展您的在线店铺。/ 了解详情
- 在移动设备上管理 / 随时随地使用 Ecwid 移动应用管理您的业务。/ 了解详情

CTA:
- H2: 开始在线销售
- Button: 创建商店

## Responsive Behavior
- **Desktop (1440px):** 3 cards side by side; badges row in one line; CTA centered
- **Mobile (390px):** Cards stack to 1 column; badges wrap to 2-3 per row; CTA centered
- **Breakpoint:** 992px
