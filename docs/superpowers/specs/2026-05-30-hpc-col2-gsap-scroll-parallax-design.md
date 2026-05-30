# hpc_col2 GSAP Scroll Parallax Design

## Overview
- Goal: 为首页 hero 的 `hpc_col2` 增加桌面端滚动驱动的 GSAP + ScrollTrigger 视差动画，让右侧媒体组在滚动中呈现明显的横向移动与轻微转向，同时保持 `hpc_col1` 基本稳定。
- Scope: 仅改造首页 hero 桌面端 `hpc_col2` 的滚动行为，不重写 `page.tsx` 的原始 HTML 注入结构，不扩展到移动端。
- Non-goals: 不实现新的独立横向 section；不把 `hpc_col2` 重构成 React 组件；不做额外品牌改版。

## Current Context
- 首页 hero 仍基于 `src/app/page.tsx` 中的原站 HTML 片段注入。
- 当前 hero 的行为增强集中在 `src/app/MenuFixer.tsx`，包括：
  - 文案轮播
  - phone/tablet 素材切换
  - 旧版滚动联动 `syncHeroScrollMotion()`
  - 若干首屏入场动画
- 当前 hero 的版式校准与关键帧样式集中在 `src/app/globals.css`。
- 当前为了像素对比临时打开了 `HERO_LOCK_STATE_FOR_COMPARISON = true`，这个模式不能与正式滚动动效长期并存，实施时要恢复为可关闭或默认关闭。

## User-Confirmed Interaction Model
- `hpc_col2` 不是拆成左右横排组件，而是“整块横向平移/转向”。
- `hpc_col1` 基本固定，不做明显联动。
- 目标是滚动驱动的 hero 强化效果，而不是新增一个完全独立的新 section。

## Recommended Approach
采用 `Pinned Hero + GSAP 横向视差`：

1. 在桌面端为 hero 建立短区间 `ScrollTrigger`。
2. 在该区间内短暂 pin 首页 hero。
3. 让 `hpc_col2` 外层整体沿 X 轴移动，并附带轻微 rotation / scale 变化。
4. 让 phone、tablet、背景黄块以不同速度跟随，形成三层视差。
5. 区间结束后解除 pin，页面回到正常滚动。

原因：
- 能精确表达“滚动时更 horizontal”的视觉感。
- 不需要大改现有 DOM。
- 最适合用 GSAP + ScrollTrigger 管控 transform 时间轴。

## Alternatives Considered
### A. 只做非 pin 视差
- 优点：改动小，风险低。
- 缺点：横向感偏弱，用户感知不够明显。

### B. 新增独立横向 section
- 优点：视觉冲击更强。
- 缺点：已经偏离“hero 自身增强”，作用域扩大，和当前需求不匹配。

本设计不采用以上两种方案作为第一落地版本。

## Animation Design
### Stage 1: Initial State
- 保持当前桌面 hero 的首屏校准结果。
- `hpc_col1` 保持静态或最多做极弱的 opacity 变化。
- `hpc_col2` 保持当前可见初始构图。

### Stage 2: Scroll-Driven Active Window
- 当 hero 进入滚动触发区间后：
  - hero 被 pin 住一个短区间
  - `hpc_col2` 主容器向右做横移
  - 容器产生轻微 rotation，营造“由竖向构图转向横向展开感”
  - 可附带轻微 scale 调整，避免生硬

### Stage 3: Layered Parallax
- `hpc-pics__phone`：前景层，位移速度最快
- `hpc-pics__tablet`：中景层，位移速度中等
- `hpc-pics__bg--second`：背景层，位移最慢，并保持旋转背景的存在感

### Stage 4: Exit
- ScrollTrigger 区间结束时：
  - 解除 pin
  - 页面恢复正常流式滚动
  - 不强制回弹到初始状态，避免滚动中反复跳变

## Motion Parameters
- 第一版建议参数范围：
  - `hpc_col2` 主横移：`120px ~ 220px`
  - 主 rotation：`6deg ~ 12deg`
  - 主 scale：`0.94 ~ 1`
  - ScrollTrigger scrub：平滑跟手，不使用离散 step 动画
  - pin 区间：短区间，只作为 hero 强化，不做长时间滚动劫持
- 采用范围定义而不是单一魔法值，实施计划里再把它们收敛成常量。

## Architecture
### Files
- Modify: `src/app/MenuFixer.tsx`
- Modify: `src/app/globals.css`
- Modify: `package.json` / lockfile（如需安装 `gsap`）

### Responsibilities
- `MenuFixer.tsx`
  - 注册 `gsap` 与 `ScrollTrigger`
  - 只在首页、桌面端创建滚动动画
  - 在 cleanup 中销毁 timeline 和 triggers
  - 管理“对比锁定模式”和“正式滚动动画模式”的互斥
- `globals.css`
  - 提供桌面端专用的 class / CSS variables
  - 为 GSAP 接管的元素预留 `will-change`
  - 处理 `prefers-reduced-motion` 的降级样式

## DOM Targeting Strategy
- 不改 `page.tsx` 注入结构。
- GSAP 主要挂载目标：
  - hero section：`.calypso-block--EW19-tile-1`
  - 主体列：`#hpc_col2`
  - phone：`#hpc_col2 .hpc-pics__phone`
  - tablet：`#hpc_col2 .hpc-pics__tablet`
  - 背景：`#hpc_col2 .hpc-pics__bg--second`
- 旧的 phone/tablet 轮播仍可保留，但滚动期内不能和 GSAP 同时写同一层 transform。

## Conflict Resolution
### Existing Scroll Motion
- 现有 `syncHeroScrollMotion()` 会在滚动时写入 CSS variable。
- GSAP 模式开启后，旧的滚动联动应停用或降级到不触碰同一层 transform。
- 原则：同一时刻只有一个系统驱动 `hpc_col2` 的主 transform。

### Lock Mode
- 当前 `HERO_LOCK_STATE_FOR_COMPARISON = true` 是对比专用。
- 正式动效方案中，这个模式应改为：
  - 默认关闭
  - 仅用于显式调试/比对
- 否则会阻止 hero 的正常轮播和真实动效验证。

### Existing CSS Transforms
- 现有 `globals.css` 已对 `#hpc_col2`、`.hpc-pics__phone`、`.hpc-pics__tablet` 施加 transform。
- 实施时应减少 transform 分散写入，优先让 GSAP 接管更外层容器。
- 内层元素只保留轮播/图片局部动画需要的 transform。

## Responsive Rules
- 仅桌面端启用：`min-width: 992px`
- 平板与移动端：
  - 不启用 pin
  - 不启用 GSAP 横向视差
  - 保持当前相对稳定的 hero 逻辑

## Accessibility and Fallback
- 若 `prefers-reduced-motion: reduce`：
  - 禁用 ScrollTrigger pin 和大位移动画
  - 保留静态构图或最小程度淡入
- 若 GSAP 未加载成功：
  - 首页仍可使用现有 hero 静态/轮播逻辑
  - 不让页面因动画失败而布局错乱

## Error Handling
- 若关键节点缺失（如 `#hpc_col2` / `.hpc-pics__phone`）：
  - 直接跳过 GSAP 初始化
  - 返回 no-op cleanup
- 若当前不在首页：
  - 不注册 ScrollTrigger
- 若窗口宽度小于桌面断点：
  - 不创建 timeline

## Testing Strategy
### Functional Checks
- 首页桌面端滚动时：
  - `hpc_col2` 出现明显横向位移与轻微旋转
  - `hpc_col1` 基本稳定
  - phone/tablet/background 有层次差
- 非首页页面不受影响
- 移动端和平板端不触发桌面滚动方案

### Safety Checks
- `npm run build` 通过
- `GetDiagnostics` 不引入新的错误
- 多次进入/离开首页不残留重复 ScrollTrigger
- 切换路由后没有内存泄漏或重复注册

### Visual Checks
- 首屏初始态不应被破坏
- pin 区间长度不应造成明显“卡住”
- 动画结束后页面继续自然滚动

## Implementation Notes
- 这是一个“增强现有 hero”的设计，不是新的 hero 重构项目。
- 第一版优先保证：
  - 交互明确
  - 层次明显
  - 不和现有轮播打架
- 参数精修留到实现后的视觉比对阶段。

## Open Decisions Resolved
- Horizontal interpretation: 使用“整块横向平移/转向”
- Left column behavior: `hpc_col1` 基本固定
- Delivery strategy: 桌面优先，移动端暂不跟进

## Success Criteria
- 用户滚动首页 hero 时，能明显感受到 `hpc_col2` 从当前静态竖向构图，过渡到更具横向展开感的动态构图。
- `hpc_col1` 不抢动画重心。
- 页面没有新增结构性回归，且现有首屏视觉基线不被破坏。
