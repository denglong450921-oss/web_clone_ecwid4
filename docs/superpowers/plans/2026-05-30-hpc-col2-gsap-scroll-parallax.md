# [hpc_col2 GSAP Scroll Parallax] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为首页 hero 的 `hpc_col2` 增加桌面端 GSAP + ScrollTrigger 横向视差动画，并保持 `hpc_col1` 基本固定。

**Architecture:** 在 `src/app/MenuFixer.tsx` 中新增一个只作用于首页桌面端的 GSAP/ScrollTrigger 初始化分支，短暂 pin hero，并将 `#hpc_col2` 及其 phone/tablet/background 三层交给同一条滚动时间轴管理。`src/app/globals.css` 只保留布局基线、`will-change` 和 reduced-motion 降级样式，避免和 GSAP 同时写同一层 `transform`。

**Tech Stack:** Next.js 16, React 19 client component, TypeScript, GSAP, ScrollTrigger, CSS variables

---

### Task 1: 安装 GSAP 并关闭对比锁定默认值

**Files:**
- Modify: `package.json`
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: 安装 `gsap` 依赖**

Run:

```bash
npm install gsap
```

Expected: `package.json` 和 lockfile 新增 `gsap`

- [ ] **Step 2: 先关闭对比专用锁定模式**

将 `src/app/MenuFixer.tsx` 顶部常量改成：

```ts
const HERO_LOCKED_STATE_INDEX = 0;
const HERO_LOCK_STATE_FOR_COMPARISON = false;
```

Expected: 正式动画模式默认开启轮播能力，不再长期锁在 `免费在线`

- [ ] **Step 3: 运行构建确认依赖和常量修改没有破坏现状**

Run:

```bash
npm run build
```

Expected: build passes

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/app/MenuFixer.tsx
git commit -m "chore: add gsap dependency"
```

### Task 2: 为 hero 增加 GSAP/ScrollTrigger 初始化骨架

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: 添加 GSAP 导入与注册**

在文件顶部 import 区加入：

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
```

并在模块级添加一次性注册守卫：

```ts
let isScrollTriggerRegistered = false;

function ensureGsapPlugins(): void {
  if (isScrollTriggerRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  isScrollTriggerRegistered = true;
}
```

- [ ] **Step 2: 扩展 hero controller 返回值，为 GSAP cleanup 留出口**

把类型改成：

```ts
type HomeHeroAnimationController = {
  cleanup: () => void;
  syncScrollMotion: () => void;
  hasGsapParallax: boolean;
};
```

并把早退分支同步改成：

```ts
return {
  cleanup: () => undefined,
  syncScrollMotion: () => undefined,
  hasGsapParallax: false,
};
```

- [ ] **Step 3: 增加桌面端/动效偏好判断工具函数**

在 `setupHomeHeroAnimation()` 外添加：

```ts
function isDesktopViewport(): boolean {
  return window.innerWidth >= 992;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 4: 先跑 diagnostics**

Run: `GetDiagnostics` on `src/app/MenuFixer.tsx`  
Expected: no new errors

- [ ] **Step 5: Commit**

```bash
git add src/app/MenuFixer.tsx
git commit -m "refactor: prepare hero controller for gsap"
```

### Task 3: 实现 `hpc_col2` 的 ScrollTrigger 横向视差时间轴

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: 添加可复用常量，消除魔法值**

在常量区新增：

```ts
const HERO_PARALLAX_BREAKPOINT_PX = 992;
const HERO_PARALLAX_SCRUB = 0.8;
const HERO_PARALLAX_START = "top top";
const HERO_PARALLAX_END_DISTANCE_PX = 420;
const HERO_PARALLAX_MAIN_X_PX = 180;
const HERO_PARALLAX_MAIN_ROTATION_DEG = 8;
const HERO_PARALLAX_MAIN_SCALE = 0.96;
const HERO_PARALLAX_PHONE_X_PX = 220;
const HERO_PARALLAX_TABLET_X_PX = 150;
const HERO_PARALLAX_BG_X_PX = 96;
const HERO_PARALLAX_COL1_OPACITY = 0.96;
```

- [ ] **Step 2: 在 `setupHomeHeroAnimation()` 中抓取 GSAP 目标节点**

在现有 DOM 查询后新增：

```ts
const col1 = document.querySelector<HTMLElement>("#hpc_col1");
const col2 = document.querySelector<HTMLElement>("#hpc_col2");
const backgroundPlane = document.querySelector<HTMLElement>(
  "#hpc_col2 .hpc-pics__bg--second",
);
```

并把空值保护扩展到这些节点：

```ts
!col1 || !col2 || !backgroundPlane
```

- [ ] **Step 3: 新增 GSAP 初始化函数**

在 `setupHomeHeroAnimation()` 内加入：

```ts
const setupGsapParallax = (): (() => void) | null => {
  if (
    HERO_LOCK_STATE_FOR_COMPARISON ||
    !isDesktopViewport() ||
    prefersReducedMotion()
  ) {
    return null;
  }

  ensureGsapPlugins();

  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: heroSection,
        start: HERO_PARALLAX_START,
        end: `+=${HERO_PARALLAX_END_DISTANCE_PX}`,
        pin: true,
        scrub: HERO_PARALLAX_SCRUB,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(
        col2,
        {
          x: HERO_PARALLAX_MAIN_X_PX,
          rotate: HERO_PARALLAX_MAIN_ROTATION_DEG,
          scale: HERO_PARALLAX_MAIN_SCALE,
        },
        0,
      )
      .to(
        phoneShell,
        {
          x: HERO_PARALLAX_PHONE_X_PX,
        },
        0,
      )
      .to(
        tabletShell,
        {
          x: HERO_PARALLAX_TABLET_X_PX,
        },
        0,
      )
      .to(
        backgroundPlane,
        {
          x: HERO_PARALLAX_BG_X_PX,
        },
        0,
      )
      .to(
        col1,
        {
          opacity: HERO_PARALLAX_COL1_OPACITY,
        },
        0,
      );
  }, heroSection);

  return () => {
    context.revert();
  };
};
```

- [ ] **Step 4: 在 `primeHero()` 后接入 GSAP 分支，并让旧滚动联动避让**

把 `primeHero();` 后的逻辑改成：

```ts
primeHero();

const cleanupGsapParallax = setupGsapParallax();

if (HERO_LOCK_STATE_FOR_COMPARISON) {
  return {
    cleanup: () => {
      cleanupGsapParallax?.();
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    },
    syncScrollMotion: () => undefined,
    hasGsapParallax: Boolean(cleanupGsapParallax),
  };
}

if (cleanupGsapParallax) {
  return {
    cleanup: () => {
      cleanupGsapParallax();
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    },
    syncScrollMotion: () => undefined,
    hasGsapParallax: true,
  };
}

const rotationTimer = window.setInterval(rotateHero, HERO_ROTATE_INTERVAL_MS);
```

- [ ] **Step 5: 调整默认返回值，保证 cleanup 完整**

最终普通分支返回：

```ts
return {
  cleanup: () => {
    window.clearInterval(rotationTimer);
    pendingTimers.forEach((timer) => window.clearTimeout(timer));
  },
  syncScrollMotion: syncHeroScrollMotion,
  hasGsapParallax: false,
};
```

- [ ] **Step 6: 在 `useEffect` 的滚动监听里避开 GSAP 模式**

把 hero controller 的使用改成：

```ts
const homeHeroAnimation = setupHomeHeroAnimation();
```

并在滚动事件里只在非 GSAP 模式调用：

```ts
if (!homeHeroAnimation.hasGsapParallax) {
  homeHeroAnimation.syncScrollMotion();
}
```

- [ ] **Step 7: 跑 diagnostics 和 build**

Run: `GetDiagnostics` on `src/app/MenuFixer.tsx`  
Expected: no new errors beyond the existing router warning if still present

Run:

```bash
npm run build
```

Expected: build passes

- [ ] **Step 8: Commit**

```bash
git add src/app/MenuFixer.tsx
git commit -m "feat: add hero gsap scroll parallax controller"
```

### Task 4: 清理 CSS transform 冲突并加入降级样式

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 为 GSAP 模式加入变量与状态类**

在变量区加入：

```css
:root {
  --hero-parallax-col1-opacity: 0.96;
}
```

在桌面规则中新增：

```css
.index-EW19 #hpc_col1,
.index-EW19 #hpc_col2,
.index-EW19 #hpc_col2 .hpc-pics__phone,
.index-EW19 #hpc_col2 .hpc-pics__tablet,
.index-EW19 #hpc_col2 .hpc-pics__bg--second {
  will-change: transform, opacity;
}
```

- [ ] **Step 2: 保证 GSAP 接管期间不被旧 transform 再覆盖**

在桌面规则里把这段保留为“基线初始态”，不要再追加新的滚动 transform：

```css
.index-EW19 #hpc_col2 {
  height: 663px !important;
  padding: 0 24px !important;
  overflow: visible !important;
  transform: translate3d(0, var(--hero-col2-column-y-offset), 0);
}
```

并不要再给 `#hpc_col2` 新增 CSS 动画类，GSAP 将直接写 transform。

- [ ] **Step 3: 增加 reduced-motion 降级**

加入：

```css
@media (prefers-reduced-motion: reduce) and (min-width: 992px) {
  .index-EW19 #hpc_col1,
  .index-EW19 #hpc_col2,
  .index-EW19 #hpc_col2 .hpc-pics__phone,
  .index-EW19 #hpc_col2 .hpc-pics__tablet,
  .index-EW19 #hpc_col2 .hpc-pics__bg--second {
    transition: none !important;
    animation: none !important;
  }
}
```

- [ ] **Step 4: 运行 diagnostics**

Run: `GetDiagnostics` on `src/app/globals.css`  
Expected: no new errors

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "style: prepare hero css for gsap parallax"
```

### Task 5: 浏览器验证滚动时间轴与回归风险

**Files:**
- Modify: `src/app/MenuFixer.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 启动本地开发服务**

Run:

```bash
npm run dev
```

Expected: local server available on `http://localhost:3000`

- [ ] **Step 2: 验证桌面端动画**

在浏览器中打开首页并确认：

```js
() => ({
  hasCol2: Boolean(document.querySelector("#hpc_col2")),
  hasPhone: Boolean(document.querySelector("#hpc_col2 .hpc-pics__phone")),
  hasTablet: Boolean(document.querySelector("#hpc_col2 .hpc-pics__tablet")),
  hasBackground: Boolean(document.querySelector("#hpc_col2 .hpc-pics__bg--second")),
})
```

Expected:
- `hpc_col2` 在滚动区间内被短暂 pin 住
- `hpc_col2` 整体向右横移并带轻微 rotation / scale
- phone 位移最大，tablet 次之，背景最慢
- `hpc_col1` 基本稳定，只保留轻微视觉变化

- [ ] **Step 3: 验证非桌面断点不触发**

将浏览器宽度切到 `< 992px`，确认：
- 无 pin
- 无 GSAP 横向视差
- 首页仍可正常浏览

- [ ] **Step 4: 验证路由切换没有重复注册**

在首页与其他页面间来回切换后，在浏览器控制台执行：

```js
() => ({
  triggerCount: window.ScrollTrigger?.getAll?.().length ?? "unknown",
})
```

Expected: 返回值不会在每次进出首页后无上限增长

- [ ] **Step 5: 最终构建**

Run:

```bash
npm run build
```

Expected: build passes

- [ ] **Step 6: Commit**

```bash
git add src/app/MenuFixer.tsx src/app/globals.css package.json package-lock.json
git commit -m "feat: add hpc_col2 gsap scroll parallax"
```

### Task 6: 视觉精修参数收口

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: 根据浏览器实测收敛常量**

只调整这些常量，不改结构：

```ts
const HERO_PARALLAX_END_DISTANCE_PX = 420;
const HERO_PARALLAX_MAIN_X_PX = 180;
const HERO_PARALLAX_MAIN_ROTATION_DEG = 8;
const HERO_PARALLAX_MAIN_SCALE = 0.96;
const HERO_PARALLAX_PHONE_X_PX = 220;
const HERO_PARALLAX_TABLET_X_PX = 150;
const HERO_PARALLAX_BG_X_PX = 96;
```

目标：
- pin 感不过长
- 横向展开感足够明显
- 不破坏当前 hero 首屏构图

- [ ] **Step 2: 重新 build**

Run:

```bash
npm run build
```

Expected: build passes

- [ ] **Step 3: Commit**

```bash
git add src/app/MenuFixer.tsx
git commit -m "tune: refine hero parallax motion values"
```
