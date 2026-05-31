# [Lock Hero State Comparison] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock the local homepage hero to the `免费在线` state so visual comparison against the original can happen on the same frame.

**Architecture:** Add a small homepage-only lock in `MenuFixer.tsx` that initializes the local hero to the first state and skips the rotating interval when lock mode is enabled. Then verify in the browser that the local page stays fixed while the original page is sampled at the same visible state for screenshot comparison.

**Tech Stack:** Next.js 16 App Router, React Client Component, TypeScript, Chrome DevTools MCP

---

### Task 1: Add local hero lock

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: Add a lock constant for the comparison state**

```ts
const HERO_LOCKED_STATE_INDEX = 0;
const HERO_LOCK_STATE_FOR_COMPARISON = true;
```

- [ ] **Step 2: Initialize the hero from the locked state**

```ts
let activeIndex = HERO_LOCK_STATE_FOR_COMPARISON ? HERO_LOCKED_STATE_INDEX : 0;
```

- [ ] **Step 3: Skip interval startup when the lock is enabled**

```ts
primeHero();

if (HERO_LOCK_STATE_FOR_COMPARISON) {
  return {
    cleanup: () => {
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    },
    syncScrollMotion: syncHeroScrollMotion,
  };
}

const rotationTimer = window.setInterval(rotateHero, HERO_ROTATE_INTERVAL_MS);
```

### Task 2: Verify and compare

**Files:**
- Modify: `src/app/MenuFixer.tsx`

- [ ] **Step 1: Run diagnostics and build**

Run: `GetDiagnostics` on `src/app/MenuFixer.tsx`  
Expected: no new errors

Run: `npm run build`  
Expected: build passes

- [ ] **Step 2: Verify the local hero stays on 免费在线**

Run in browser:

```js
() => document.querySelector('#hpc_sales_channel')?.textContent?.trim()
```

Expected: returns `"免费在线"` after reload and still returns `"免费在线"` after several seconds

- [ ] **Step 3: Capture same-state screenshots**

Use Chrome DevTools MCP to:
- wait until the original page shows `免费在线`
- capture the original hero
- capture the locked local hero

Expected: both screenshots represent the same named hero state for a fair visual diff
