# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** `docs/design-references/ecwid-desktop.png`
- **Interaction model:** time-driven (text animation cycling every ~3s)

## DOM Structure
- `section.hero` — full height-ish, white bg, overflow hidden
  - `.hero__container.container`
    - `.hero__row.row` — two columns
      - `.hero__left` — col ~40% — text content
        - `h1.hero__heading` — "开始销售" + animated channel text
          - `span.hero__static-text` — "开始销售"
          - `div.hero__animated-row`
            - `span.hero__on` — "" (prefix "在")
            - `span.hero__underlined.hero__underlined--yellow`
              - `span.hero__channel-text` — cycling text "免费在线"
              - `span.hero__caret` — blinking cursor
        - `p.hero__desc` — subtitle text
        - `div.hero__cta`
          - `a.btn.btn-primary` — "创建商店"
      - `.hero__right` — col ~60% — mockup images
        - `.hero__blob` — yellow circle bg blob (right side)
        - `.hero__phone` — phone mockup frame with image
        - `.hero__tablet` — tablet mockup frame with image (desktop only)

## Computed Styles

### `.hero` section
- padding-top: 80px (for fixed nav)
- padding-bottom: 40px
- background-color: rgb(255, 255, 255)
- overflow: hidden
- min-height: 600px

### `.hero__row`
- display: flex
- align-items: center
- gap: 40px
- padding: 60px 0 40px

### `.hero__left`
- flex: 0 0 42%
- max-width: 42%

### `h1.hero__heading`
- font-family: Montserrat, sans-serif
- font-size: 64px
- font-weight: 700
- line-height: 76.8px
- color: rgb(0, 0, 0)
- margin: 0 0 24px

### `span.hero__static-text`
- display: block

### `div.hero__animated-row`
- display: flex
- align-items: center
- flex-wrap: wrap

### `.hero__underlined` (yellow)
- position: relative
- display: inline-block

### `.hero__underlined::after` — the wavy yellow underline
- content: ''
- position: absolute
- bottom: -4px
- left: 0
- right: 0
- height: 8px
- background-color: rgb(250, 224, 83) = #FAE053
- border-radius: 2px
- opacity: 0.8

### `p.hero__desc`
- font-family: Montserrat, sans-serif
- font-size: 16px
- font-weight: 400
- line-height: 25.6px
- color: rgb(0, 0, 0)
- margin-bottom: 32px
- max-width: 420px

### `a.btn-primary` (CTA)
- background-color: rgb(0, 0, 0)
- color: rgb(255, 255, 255)
- border: 2px solid rgb(0, 0, 0)
- border-radius: 6px
- padding: 14px 38px 13px
- font-size: 18px
- font-weight: 600
- text-transform: uppercase
- letter-spacing: 0.6px

### `.hero__right`
- flex: 0 0 58%
- max-width: 58%
- position: relative
- min-height: 480px

### `.hero__blob` (yellow background bubble)
- position: absolute
- right: -60px
- top: 50%
- transform: translateY(-50%)
- width: 540px
- height: 540px
- background-color: rgb(250, 224, 83) = #FAE053
- border-radius: 50%
- z-index: 0

### `.hero__phone`
- position: absolute
- z-index: 2
- left: 20px
- bottom: 0
- width: 180px
- img: public/images/phone-slide1_.jpg

### `.hero__tablet`
- position: absolute
- z-index: 1
- right: 0
- bottom: 0
- width: 420px
- img: public/images/Website_pad.png (first slide)

## States & Behaviors

### Animated text cycle (time-driven)
- **Trigger:** on mount, setInterval every 3000ms
- **Text options:** ["免费在线", "站上销售", "Instagram 上销售", "Facebook 上销售", "Amazon 上销售", "Google 上销售"]
- **Color per channel:** yellow=免费在线, green=站上销售, magenta=Instagram, indigo=Facebook, sandy=Amazon, azure=Google
- **Implementation approach:** useState with setInterval, fade-in/fade-out transition 0.3s

### Blinking caret
- `span.hero__caret` — blinking CSS animation: blink 1s step-end infinite
- color: inherited from text

### Hero image slide
- Phone image: `public/images/phone-slide1_.jpg` (cycles with text)
- Tablet image: `public/images/Website_pad.png` (cycles)
- Simple opacity transition 0.5s on image change

## Per-State Content
### Channel slide data:
1. "免费在线" — phone: Instagram_mob.png, tablet: Website_pad.png, underline: #FAE053
2. "站上销售" — phone: Website_mob.png, tablet: Website_pad.png, underline: #4CAF50
3. "Instagram 上销售" — phone: Instagram_mob.png, tablet: Website_pad.png, underline: #E91E8C
4. "Facebook 上销售" — phone: Facebook_mob.png, tablet: Facebook_pad.png, underline: #3F51B5
5. "Amazon 上销售" — phone: Amazon_mob.png, tablet: Website_pad.png, underline: #C4932A
6. "Google 上销售" — phone: Google_mob.png, tablet: Google_pad.png, underline: #1976D2

## Assets
- Phone image (slot 1): `public/images/phone-slide1_.jpg`
- Mobile illustration 1: `public/images/Instagram_mob.png`
- Mobile illustration 2: `public/images/Website_mob.png`
- Mobile illustration 3: `public/images/Facebook_mob.png`
- Mobile illustration 4: `public/images/Amazon_mob.png`
- Mobile illustration 5: `public/images/Google_mob.png`
- Tablet illustration 1: `public/images/Website_pad.png`
- Tablet illustration 2: `public/images/Facebook_pad.png`
- Tablet illustration 3: `public/images/Google_pad.png`

## Text Content (verbatim)
- H1 static: "开始销售"
- Subtitle: "没有技术或设计技能？没问题！轻松打造一个既美观又易用的在线商店——并享受零交易手续费。"
- CTA button: "创建商店"

## Responsive Behavior
- **Desktop (1440px):** 2-col row, phone+tablet mockups both visible
- **Mobile (390px):** Single column, only phone mockup visible (blob behind it), text above
- **Breakpoint:** 992px — col becomes 100%, tablet mockup hidden
