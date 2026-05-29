# FeatureSections Specification

## Overview
- **Target file:** `src/components/FeatureSections.tsx`
- **Screenshot:** `docs/design-references/ecwid-desktop.png`
- **Interaction model:** click-driven image carousel (each section has prev/next image slider)

## Three Feature Sections (render as one component with map)

### Section 1: 随时随地销售
- **Layout:** text LEFT, image slider RIGHT
- H2: "随时随地销售"
- Body: "设置一次 Ecwid 店铺即可轻松地在网站、社交媒体、Amazon 等购物平台进行同步和销售，也支持面对面销售方式。 您可以先尝试一项，或全都试一试。"
- Link: "了解详情" → /zh-CN/sell
- Slider images: Slider_Website_2.png, Slider_Website_1.png, Mobile_Website.png, Mobile_Marketplaces.png, Mobile_POS.png

### Section 2: 更快地成长
- **Layout:** image slider LEFT, text RIGHT (swapped)
- H2: "更快地成长"
- Body: "您是否需要像 Google 和 Facebook 广告这样简单易用的营销工具来让您的企业快速成长？您找到了。"
- Link: "了解详情" → /zh-CN/promote
- Slider images: Slider_Facebook_3.png, Slider_Facebook_2.png, Slider_Facebook_1.png, Mobile_Facebook_Ads.png, Mobile_Google_Ads.png

### Section 3: 管理简单
- **Layout:** text LEFT, image slider RIGHT
- H2: "管理简单"
- Body: "通过一个包含集中式存货、订单管理和定价等功能的信息中心管理一切事务。"
- Extra subtitle: "2023 年实现速度最快的电子商务平台。"
- Link: "了解详情" → /zh-CN/manage
- Slider images: Slider_Manage_2.png, Slider_Manage_1.png, Mobile_Manage.png

## Computed Styles

### Section wrapper
- padding-top: 88px
- padding-bottom: 0
- overflow: hidden

### `.section__container.container`
- max-width: 1200px
- margin: 0 auto
- padding: 0 15px

### `.section__row` (two-col flex)
- display: flex
- align-items: center
- gap: 60px

### `.section__text` (text column)
- flex: 0 0 45%
- max-width: 45%

### `h2.section__heading`
- font-family: Montserrat, sans-serif
- font-size: 48px
- font-weight: 700
- line-height: 57.6px
- color: rgb(0, 0, 0)
- margin-bottom: 24px

### `p.section__body`
- font-size: 16px
- line-height: 26px
- color: rgb(0, 0, 0)
- margin-bottom: 32px

### `.section__link` (chevron link)
- font-size: 14px
- font-weight: 600
- text-transform: uppercase
- letter-spacing: 0.4px
- color: rgb(0, 0, 0)
- display: inline-flex
- align-items: center
- gap: 6px

### `.section__slider` (image area)
- flex: 0 0 55%
- max-width: 55%
- position: relative
- min-height: 400px

### Slider image
- width: 100%
- object-fit: contain
- border-radius: 8px
- transition: opacity 0.4s ease

### Slider nav dots
- display: flex
- gap: 8px
- justify-content: center
- margin-top: 16px

### Dot default
- width: 8px
- height: 8px
- border-radius: 50%
- background-color: rgb(204, 204, 204)
- cursor: pointer

### Dot active
- background-color: rgb(0, 0, 0)

## States & Behaviors

### Image slider (click-driven)
- **Trigger:** click dot nav or auto-advance every 4s
- **State A → B:** current image fades out (opacity: 0), next fades in (opacity: 1)
- **Transition:** opacity 0.4s ease
- **Implementation approach:** useState for currentIndex, auto-advance useEffect

## Assets
Section 1 images (in order):
- `public/images/Slider_Website_2.png`
- `public/images/Slider_Website_1.png`
- `public/images/Mobile_Website.png`

Section 2 images:
- `public/images/Slider_Facebook_3.png`
- `public/images/Slider_Facebook_2.png`
- `public/images/Slider_Facebook_1.png`

Section 3 images:
- `public/images/Slider_Manage_2.png`
- `public/images/Slider_Manage_1.png`
- `public/images/Mobile_Manage.png`

## Responsive Behavior
- **Desktop (1440px):** 2-col side-by-side, text ~45%, image ~55%
- **Mobile (390px):** Single column, image above text; mobile slider visible
- **Breakpoint:** 992px — stacks to 1 column
