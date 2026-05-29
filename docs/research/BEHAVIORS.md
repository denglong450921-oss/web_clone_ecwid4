# Ecwid zh-CN Behavior Bible

## Global Behaviors

### Sticky Nav (scroll-driven)
- Nav `.calypso-menu` is sticky at top
- height: 80px, background: rgb(255,255,255)
- On scroll: gains box-shadow, stays white
- Classes: `calypso-menu--stick calypso-menu--display-always`
- INTERACTION MODEL: scroll-driven (CSS sticky + scroll listener for shadow)

### Hero Animated Text (time-driven)
- H1 cycles through text: "免费在线", "站上销售", "Instagram 上销售", "Facebook 上销售", "Amazon 上销售", "Google 上销售"
- Each word has color: yellow, green, magenta, indigo, sandy, azure
- The underline color changes per slide
- INTERACTION MODEL: time-driven (JS animation, typewriter-style)
- Yellow underline: `rgb(250, 224, 83)` = #FAE053

### Feature Sections (click-driven sliders)
- Sections "随时随地销售", "更快地成长", "管理简单" each have a slider
- Images slide on click
- INTERACTION MODEL: click-driven carousel (slick.js)

## Animation States

### Hero phone/tablet mockup
- Animate in: hpc-animate--from-left, hpc-animate--from-opacity
- Fade + slide in on page load

### Section entry animations
- Elements get `animate` class, fade-up when in viewport
- Uses IntersectionObserver

## Responsive Behavior
- Desktop (1440px): 2-col layout hero, 2-col feature sections
- Mobile (390px): Single column, phone image hero only
- Breakpoint: ~992px (lg bootstrap breakpoint)
