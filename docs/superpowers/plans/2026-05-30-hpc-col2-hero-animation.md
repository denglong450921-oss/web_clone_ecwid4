# [hpc_col2 Hero Animation] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让首页 `hpc_col2` 的桌面 Hero 更接近 Ecwid 原站，补齐手机 carousel、平板网页滚动和滚动联动动画，并修复当前脚本报错。

**Architecture:** 保留当前“注入原站 HTML + `MenuFixer.tsx` 运行时增强”的实现方式，只修补 `MenuFixer.tsx` 的状态驱动与清理逻辑，并在 `globals.css` 增加专用关键帧和类名。这样能最小化改动范围，同时把动画从“切图”升级为“带运动语法的切换”。

**Tech Stack:** Next.js 16 App Router、React Client Component、TypeScript、全局 CSS 动画、Chrome DevTools MCP

---

### Task 1: 固定动画驱动入口

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: 收敛 `setupHomeHeroAnimation()` 的对外接口**

```ts
type HomeHeroAnimationController = {
  cleanup: () => void;
  syncScrollMotion: () => void;
};

function setupHomeHeroAnimation(): HomeHeroAnimationController {
  // ...
  return {
    cleanup: () => {
      window.clearInterval(rotationTimer);
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    },
    syncScrollMotion,
  };
}
```

- [ ] **Step 2: 在 `useEffect()` 中改成通过 controller 调用**

```ts
const homeHeroAnimation = setupHomeHeroAnimation();

const onScroll = () => {
  const navEl = document.querySelector<HTMLElement>(".calypso-menu");
  if (!navEl) return;
  navEl.style.boxShadow =
    window.scrollY > 20 ? HERO_NAV_SHADOW_SCROLLED : HERO_NAV_SHADOW_DEFAULT;
  homeHeroAnimation.syncScrollMotion();
};

return () => {
  homeHeroAnimation.cleanup();
  window.removeEventListener("scroll", onScroll);
};
```

- [ ] **Step 3: 清理无意义的 `let` 并保留真正会交换的活动 slide 引用**

```ts
const phoneCurrentSlide = document.querySelector<HTMLElement>(
  "#hpc_col2 .hpc-phone__slide--current",
);
const phoneNextSlide = document.querySelector<HTMLElement>(
  "#hpc_col2 .hpc-phone__slide--next",
);

let activePhoneCurrentSlide: HTMLElement = phoneCurrentSlide;
let activePhoneNextSlide: HTMLElement = phoneNextSlide;
```

### Task 2: 升级 Hero 运动语法

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: 让轮播切换先触发 class 动画，再交换 current/next**

```ts
replayAnimationClass(activePhoneCurrentSlide, "hpc-col2-slide-out");
replayAnimationClass(activePhoneNextSlide, "hpc-col2-slide-in");
replayAnimationClass(activeTabletCurrentSlide, "hpc-col2-slide-out");
replayAnimationClass(activeTabletNextSlide, "hpc-col2-slide-in");
```

- [ ] **Step 2: 在 `primeHero()` 和 `rotateHero()` 都触发平板内部网页滚动**

```ts
animateTabletViewport(activeTabletCurrentSlide);
syncHeroScrollMotion();
```

- [ ] **Step 3: 给手机图增加轻微纵向 drift，让滚动时不显死板**

```ts
currentPhoneImage.style.setProperty(
  "--hero-phone-drift-offset",
  `${phoneOffset}px`,
);
```

### Task 3: 补齐 CSS 动画层

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 新增手机/平板 slide 进出场关键帧**

```css
@keyframes hpcCol2SlideIn {
  from {
    opacity: 0;
    transform: translate3d(34px, 0, 0) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes hpcCol2SlideOut {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate3d(-34px, 0, 0) scale(0.96);
  }
}
```

- [ ] **Step 2: 新增平板内部网页滚动关键帧**

```css
@keyframes hpcCol2TabletScroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  18% {
    transform: translate3d(0, 0, 0);
  }
  72% {
    transform: translate3d(0, calc(var(--hero-tablet-scroll-offset, 0px) * -1), 0);
  }
  100% {
    transform: translate3d(0, calc(var(--hero-tablet-scroll-offset, 0px) * -1), 0);
  }
}
```

- [ ] **Step 3: 绑定到实际类名并保留桌面限定**

```css
.index-EW19 #hpc_col2 .hpc-col2-slide-in {
  animation: hpcCol2SlideIn 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.index-EW19 #hpc_col2 .hpc-col2-slide-out {
  animation: hpcCol2SlideOut 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.index-EW19 #hpc_col2 .hpc-col2-tablet-image--scrolling {
  animation: hpcCol2TabletScroll 1.8s ease-in-out both;
}
```

### Task 4: 验证与对照

**Files:**
- Modify: `src/app/MenuFixer.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 运行诊断**

Run: `GetDiagnostics` for `src/app/MenuFixer.tsx` and `src/app/globals.css`  
Expected: no new TypeScript / ESLint errors

- [ ] **Step 2: 运行构建**

Run: `npm run build`  
Expected: build passes

- [ ] **Step 3: 浏览器对照原站**

Run:

```txt
Open original: https://www.ecwid.com/zh-CN/
Open local: http://localhost:3000
```

Expected:
- 手机 frame 有明确 carousel 进出场
- 平板 frame 内图片有网页向上浏览感
- 页面滚动时 Hero 仍有轻微联动
