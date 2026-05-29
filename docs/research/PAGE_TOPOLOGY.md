# Ecwid zh-CN Page Topology

## Page Structure (top to bottom)

### 1. Navigation (FIXED/STICKY)
- **Classes:** `.calypso-menu.calypso-menu--stick.calypso-menu--display-always`
- **Height:** 80px
- **Background:** rgb(255,255,255) white
- **Z-index:** high (overlays everything)
- **Contains:** Logo SVG (left), nav links (销售 dropdown, 推广, 管理), Login + 开始 CTA button (right)
- **Mobile:** Burger menu replaces nav links
- **Interaction:** Static mostly, dropdown on hover for 销售 menu item

### 2. Hero Section - Tile 1 (FLOW)
- **Classes:** `.calypso-viewport#tile-1 > .calypso-block--EW19-tile-1`
- **Background:** white with yellow bubble bg on right side
- **Layout:** 2 columns (text left, phone+tablet mockup right)
- **H1:** "开始销售 [animated text]" - 64px, 700, Montserrat, black
- **Body text:** "没有技术或设计技能？没问题！..." - smaller, dark
- **CTA Button:** "创建商店" - black bg, white text, 6px radius, 14px 38px 13px padding
- **Right side:** Phone + tablet mockup with animated background blob (yellow = #FAE053)
- **Interaction:** Time-driven text animation cycling through channels

### 3. Hero Final Slide - Tile 2 (desktop only)
- **Classes:** `.calypso-viewport#tile-2`  
- **Background:** white
- **H2:** "只需点几下鼠标即可创建您的在线店铺。" - styled same as h1 (64px)
- **CTA:** Same "创建商店" button
- **d-none d-lg-flex** — only shows on desktop

### 4. Feature Section: 随时随地销售 - Tile 3
- **Classes:** `.calypso-viewport#tile-3 > .calypso-block--EW19.calypso-block--b0`
- **Padding:** 88px 0 0
- **Layout:** Text left, image slider right
- **H2:** "随时随地销售" - 48px, 700, black
- **Body text:** "设置一次 Ecwid 店铺即可..."
- **Link:** "了解详情" with chevron-right
- **Slider images:** Website, Social Network, Marketplaces, POS
- **Interaction:** Click-driven (slick.js carousel)

### 5. Feature Section: 更快地成长 - Tile 4
- **Classes:** Same as tile-3
- **Layout:** Image slider left, text right (swapped)
- **H2:** "更快地成长" - 48px, 700, black
- **Body text:** "您是否需要像 Google 和 Facebook 广告..."
- **Slider images:** Facebook_3, Facebook_2, Facebook_1

### 6. Feature Section: 管理简单 - Tile 5
- **Layout:** Text left, mobile image + desktop slider right
- **H2:** "管理简单" - 48px, 700, black
- **Extra text:** "2023 年实现速度最快的电子商务平台。"
- **Mobile image:** Mobile_Manage.png
- **Slider images:** Slider_Manage_2, Slider_Manage_1

### 7. Feature Cards Section (Support, App Store, Mobile)
- **3 cards:** 实时支持, Ecwid 应用商店, 在移动设备上管理
- **Each card:** image + bold title + text + "了解详情" link
- **Card padding:** 40px 40px 80px
- **Bg:** transparent (white page)

### 8. G2 Badges Section
- 5 badge images from don16obqbay2c.cloudfront.net/wp-content/uploads/

### 9. CTA Bottom Section
- **H2:** "开始在线销售"
- **CTA Button:** "创建商店" (same black button)

### 10. Footer
- **Background:** white
- **Color:** rgb(10, 12, 15) near-black
- **Columns:** Ecwid (links), 在线销售 (links)
- **Social links:** Pinterest, Facebook, Twitter, Instagram, YouTube
- **App badges:** App Store + Google Play (SVG)
- **Legal links:** Privacy Policy, DPA, Terms, Copyright
- **Copyright:** © 2026 Ecwid by Lightspeed
- **Country selector:** dropdown with many countries

## Z-index Layers
1. Nav (highest, sticky)
2. Page content (flow)
3. Footer (flow)

## Key Design Tokens
- Primary font: Montserrat, sans-serif
- Secondary font: Open Sans
- H1: 64px / 700 / 76.8px line-height
- H2 (sections): 48px / 700 / 57.6px line-height
- Body: 16px / 400 / Montserrat
- Color black: #000000
- Color white: #FFFFFF  
- Color yellow (hero accent): #FAE053 (rgb 250, 224, 83)
- Color body text dark: #0A0C0F
- Color link: #016DD2
- Nav height: 80px
- Container max-width: ~1200px
- Button (CTA): black bg, white text, 6px radius, padding 14px 38px 13px, 18px font
- Button font: Montserrat, uppercase, letter-spacing 0.6px
