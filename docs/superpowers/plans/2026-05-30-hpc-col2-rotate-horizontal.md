# Hero Col2 整体旋转动效 (方案 A) 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现首页 Hero 区域 `hpc_col2` 随着滚动从 30deg 倾斜状态转正到 0deg 水平状态，并伴随横向视差位移。

**Architecture:** 利用现有的 GSAP + ScrollTrigger 架构。通过修改 `MenuFixer.tsx` 中的常量和 `setupGsapParallax` 逻辑，配合 `globals.css` 中的 `will-change` 优化。

**Tech Stack:** GSAP, ScrollTrigger, TypeScript, CSS

---

### Task 1: 更新动画常量与支点设置

**Files:**
- Modify: `src/app/MenuFixer.tsx:8-30`

- [ ] **Step 1: 更新旋转与位移常量**

修改 `src/app/MenuFixer.tsx` 顶部的常量，确保旋转角度从 30 -> 0，并设置旋转支点。

```typescript
// 修改现有的常量值
const HERO_PARALLAX_MAIN_X_PX = 180; // 整体向右平移补偿
const HERO_PARALLAX_MAIN_ROTATION_DEG = 0; // 目标角度：水平 (0deg)
const HERO_PARALLAX_PHONE_INNER_X_PX = 112; // 手机内层额外漂移
const HERO_PARALLAX_TABLET_INNER_X_PX = 72; // 平板内层额外漂移
const HERO_PARALLAX_BG_STAGE_X_PX = 96; // 背景内层额外漂移
```

- [ ] **Step 2: 提交更改**

```bash
git add src/app/MenuFixer.tsx
git commit -m "chore: update hero parallax constants for horizontal rotation"
```

---

### Task 2: 实现整体旋转时间轴逻辑

**Files:**
- Modify: `src/app/MenuFixer.tsx:407-474`

- [ ] **Step 1: 修改 setupGsapParallax 逻辑**

确保 `col2` 的旋转是从当前的 30deg 转到 0deg，并设置 `transformOrigin`。

```typescript
// 在 setupGsapParallax 内部修改 timeline 逻辑
timeline
  .to(
    col2,
    {
      x: HERO_PARALLAX_MAIN_X_PX,
      rotate: HERO_PARALLAX_MAIN_ROTATION_DEG, // 转到 0deg
      scale: HERO_PARALLAX_MAIN_SCALE,
      transformOrigin: "center center", // 确保中心旋转
    },
    0
  )
  .to(phoneInner, { x: HERO_PARALLAX_PHONE_INNER_X_PX }, 0)
  .to(tabletInner, { x: HERO_PARALLAX_TABLET_INNER_X_PX }, 0)
  .to(bgStage, { x: HERO_PARALLAX_BG_STAGE_X_PX }, 0)
  .to(col1, { opacity: HERO_PARALLAX_COL1_OPACITY }, 0);
```

- [ ] **Step 2: 提交更改**

```bash
git add src/app/MenuFixer.tsx
git commit -m "feat: implement main col2 horizontal rotation timeline"
```

---

### Task 3: 优化 CSS 性能与降级

**Files:**
- Modify: `src/app/globals.css:700-715`

- [ ] **Step 1: 确保所有运动节点都有硬件加速**

```css
/* src/app/globals.css */
@media (min-width: 992px) {
  .index-EW19 #hpc_col2,
  .index-EW19 #hpc_col2 .hpc-phone,
  .index-EW19 #hpc_col2 .hpc-tablet,
  .index-EW19 #hpc_col2 .hpc-pics--no-rotated {
    will-change: transform, rotate, opacity;
  }
}
```

- [ ] **Step 2: 提交更改**

```bash
git add src/app/globals.css
git commit -m "style: optimize css hardware acceleration for rotation"
```

---

### Task 4: 浏览器验证与微调

**Files:**
- Test: 运行时验证

- [ ] **Step 1: 运行项目并验证**

Run: `npm run dev`
打开: `http://localhost:3000`

- [ ] **Step 2: 验证清单**
1. 滚动时 `hpc_col2` 是否向左转动直到水平？
2. 内部元素（手机、平板）是否伴随横向漂移？
3. 旋转中心是否在视觉中心？

- [ ] **Step 3: 根据观察微调常量**
如果位移过大或旋转太快，微调 `MenuFixer.tsx` 中的 `HERO_PARALLAX_END_DISTANCE_PX` 或位移常量。

- [ ] **Step 4: 最终构建检查**

Run: `npm run build`
Expected: 0 errors
