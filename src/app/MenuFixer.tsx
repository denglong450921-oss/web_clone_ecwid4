"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";

const HERO_ROTATE_INTERVAL_MS = 2600;
const HERO_SLIDE_PREPARE_DELAY_MS = 850;
const HERO_PHONE_INTRO_DELAY_MS = 120;
const HERO_TABLET_INTRO_DELAY_MS = 260;
const HERO_FRAME_TRANSITION_RESET_MS = 760;
const HERO_TABLET_SCROLL_RESET_MS = 1800;
const HERO_TABLET_SCROLL_RANGE_PX = 118;
const HERO_PARALLAX_BREAKPOINT_PX = 992;
const HERO_PARALLAX_SCRUB = 0.8;
const HERO_PARALLAX_START = "top top";
const HERO_PARALLAX_END_DISTANCE_PX = 420;
const HERO_PARALLAX_MAIN_X_PX = 180;
const HERO_PARALLAX_MAIN_ROTATION_DEG = 0;
const HERO_PARALLAX_MAIN_SCALE = 0.96;
const HERO_PARALLAX_PHONE_INNER_X_PX = 112;
const HERO_PARALLAX_TABLET_INNER_X_PX = 72;
const HERO_PARALLAX_BG_STAGE_X_PX = 96;
const HERO_PARALLAX_COL1_OPACITY = 0.96;
const HERO_LOCKED_STATE_INDEX = 0;
const HERO_LOCK_STATE_FOR_COMPARISON = false;
const HERO_NAV_SHADOW_DEFAULT = "0 2px 16px rgba(0,0,0,0.06)";
const HERO_NAV_SHADOW_SCROLLED = "0 4px 24px rgba(0,0,0,0.12)";

type HomeHeroState = {
  label: string;
  underlineClass: string;
  accentColor: string;
  phoneSrc: string;
  tabletSrc: string;
};

type HomeHeroAnimationController = {
  cleanup: () => void;
  syncScrollMotion: () => void;
  hasGsapParallax: boolean;
};

let isScrollTriggerRegistered = false;

/**
 * Registers GSAP plugins once so repeated homepage visits do not duplicate
 * plugin setup work or create noisy runtime warnings.
 */
function ensureGsapPlugins(): void {
  if (isScrollTriggerRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  isScrollTriggerRegistered = true;
}

/**
 * Limits the GSAP parallax experience to the desktop layout where the hero
 * has enough room to pin and animate horizontally.
 */
function isDesktopViewport(): boolean {
  return window.innerWidth >= HERO_PARALLAX_BREAKPOINT_PX;
}

/**
 * Honors reduced-motion preferences by skipping scroll-driven transforms when
 * the user has explicitly asked for calmer motion.
 */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const HOME_HERO_STATES: HomeHeroState[] = [
  {
    label: "免费在线",
    underlineClass: "hpc-underlined--yellow",
    accentColor: "#fae053",
    phoneSrc: "/images/Website_mob.png",
    tabletSrc: "/images/Website_pad.png",
  },
  {
    label: "站上销售",
    underlineClass: "hpc-underlined--green",
    accentColor: "#8fd18a",
    phoneSrc: "/images/Website_mob.png",
    tabletSrc: "/images/Website_pad.png",
  },
  {
    label: "Instagram 上销售",
    underlineClass: "hpc-underlined--magenta",
    accentColor: "#ea4c89",
    phoneSrc: "/images/Instagram_mob.png",
    tabletSrc:
      "https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_illustrations/Instagram_pad.png",
  },
  {
    label: "Facebook 上销售",
    underlineClass: "hpc-underlined--indigo",
    accentColor: "#3b5998",
    phoneSrc: "/images/Facebook_mob.png",
    tabletSrc: "/images/Facebook_pad.png",
  },
  {
    label: "Amazon 上销售",
    underlineClass: "hpc-underlined--sandy",
    accentColor: "#f59d3d",
    phoneSrc: "/images/Amazon_mob.png",
    tabletSrc: "/images/Amazon_pad.png",
  },
  {
    label: "Google 上销售",
    underlineClass: "hpc-underlined--azure",
    accentColor: "#4285f4",
    phoneSrc: "/images/Google_mob.png",
    tabletSrc: "/images/Google_pad.png",
  },
];

/**
 * Ensures hero slide images always point to the correct asset.
 * Keeping this centralized avoids stale empty `src` attributes.
 */
function setHeroImageSource(
  imageElement: HTMLImageElement | null,
  source: string,
): void {
  if (!imageElement) {
    return;
  }

  if (imageElement.getAttribute("src") !== source) {
    imageElement.setAttribute("src", source);
  }

  imageElement.removeAttribute("srcset");
}

/**
 * Rotates the homepage hero copy and phone/tablet slides so the local clone
 * feels like the original Ecwid landing page instead of a static snapshot.
 */
function setupHomeHeroAnimation(): HomeHeroAnimationController {
  const heroSection = document.querySelector<HTMLElement>(
    ".calypso-block--EW19-tile-1",
  );
  const salesChannel =
    document.querySelector<HTMLElement>("#hpc_sales_channel");
  const underline = document.querySelector<HTMLElement>("#hpc_underlined");
  const accentBackground = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__bg--second",
  );
  const rotatedStack = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics--rotated",
  );
  const col1 = document.querySelector<HTMLElement>("#hpc_col1");
  const col2 = document.querySelector<HTMLElement>("#hpc_col2");
  const backgroundPlane = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__bg--second",
  );
  const backgroundStage = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics--no-rotated",
  );
  const phoneShell = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__phone",
  );
  const phoneInnerFrame = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-phone",
  );
  const tabletShell = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__tablet",
  );
  const tabletInnerFrame = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-tablet",
  );
  const mobilePhoneImage = document.querySelector<HTMLImageElement>(
    "#hpc_col2 .hpc-mobile-pics__image--mobile",
  );
  const mobileTabletImage = document.querySelector<HTMLImageElement>(
    "#hpc_col2 .hpc-mobile-pics__image--tablet",
  );

  const phoneCurrentSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-phone__slide--current",
  );
  const phoneNextSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-phone__slide--next",
  );
  const tabletCurrentSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-tablet__slide--current",
  );
  const tabletNextSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-tablet__slide--next",
  );

  if (
    !heroSection ||
    !salesChannel ||
    !underline ||
    !accentBackground ||
    !rotatedStack ||
    !col1 ||
    !col2 ||
    !backgroundPlane ||
    !backgroundStage ||
    !phoneShell ||
    !phoneInnerFrame ||
    !tabletShell ||
    !tabletInnerFrame ||
    !phoneCurrentSlide ||
    !phoneNextSlide ||
    !tabletCurrentSlide ||
    !tabletNextSlide
  ) {
    return {
      cleanup: () => undefined,
      syncScrollMotion: () => undefined,
      hasGsapParallax: false,
    };
  }

  const pendingTimers: number[] = [];
  let activeIndex = HERO_LOCK_STATE_FOR_COMPARISON
    ? HERO_LOCKED_STATE_INDEX
    : 0;
  let activePhoneCurrentSlide: HTMLElement = phoneCurrentSlide;
  let activePhoneNextSlide: HTMLElement = phoneNextSlide;
  let activeTabletCurrentSlide: HTMLElement = tabletCurrentSlide;
  let activeTabletNextSlide: HTMLElement = tabletNextSlide;

  const phoneCurrentImage =
    activePhoneCurrentSlide.querySelector<HTMLImageElement>(
      ".hpc-phone__image",
    );
  const phoneNextImage =
    activePhoneNextSlide.querySelector<HTMLImageElement>(".hpc-phone__image");
  const tabletCurrentImage =
    activeTabletCurrentSlide.querySelector<HTMLImageElement>(
      ".hpc-tablet__image",
    );
  const tabletNextImage =
    activeTabletNextSlide.querySelector<HTMLImageElement>(".hpc-tablet__image");

  /**
   * Restarts a CSS keyframe class on demand so repeated hero rotations keep
   * feeling animated instead of snapping to the next asset.
   */
  const replayAnimationClass = (
    element: HTMLElement | null,
    className: string,
  ) => {
    if (!element) {
      return;
    }

    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);

    pendingTimers.push(
      window.setTimeout(() => {
        element.classList.remove(className);
      }, HERO_FRAME_TRANSITION_RESET_MS),
    );
  };

  /**
   * Replays the tablet's inner webpage scroll so the screenshot inside the frame
   * behaves like a page being browsed rather than a static poster.
   */
  const animateTabletViewport = (slide: HTMLElement) => {
    const image = slide.querySelector<HTMLElement>(".hpc-tablet__image");
    if (!image) {
      return;
    }

    image.style.setProperty("--hero-tablet-scroll-offset", "0px");
    image.classList.remove("hpc-col2-tablet-image--scrolling");
    void image.offsetWidth;
    image.classList.add("hpc-col2-tablet-image--scrolling");

    pendingTimers.push(
      window.setTimeout(() => {
        image.classList.remove("hpc-col2-tablet-image--scrolling");
      }, HERO_TABLET_SCROLL_RESET_MS),
    );
  };

  /**
   * Couples the hero media with page scroll so the tablet content keeps moving
   * while the hero is in view, matching the original interactive feeling.
   */
  const syncHeroScrollMotion = () => {
    const currentTabletImage =
      activeTabletCurrentSlide.querySelector<HTMLElement>(".hpc-tablet__image");
    const currentPhoneImage =
      activePhoneCurrentSlide.querySelector<HTMLElement>(".hpc-phone__image");
    if (!currentTabletImage || !currentPhoneImage) {
      return;
    }

    const heroRect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(
        0,
        (viewportHeight - heroRect.top) /
          (heroRect.height + viewportHeight * 0.2),
      ),
    );
    const tabletOffset = Math.round(progress * HERO_TABLET_SCROLL_RANGE_PX);
    const phoneOffset = Math.round(progress * 48);

    currentTabletImage.style.setProperty(
      "--hero-tablet-scroll-offset",
      `${tabletOffset}px`,
    );
    currentPhoneImage.style.setProperty(
      "--hero-phone-drift-offset",
      `${phoneOffset}px`,
    );
  };

  /**
   * Applies the text, underline, accent background and responsive fallback art
   * for one hero rotation state.
   */
  const applyHeroState = (stateIndex: number) => {
    const state = HOME_HERO_STATES[stateIndex];
    salesChannel.textContent = state.label;
    underline.className = `hpc-underlined ${state.underlineClass}`;
    accentBackground.style.backgroundColor = state.accentColor;
    rotatedStack.style.marginTop = "-90px";

    setHeroImageSource(mobilePhoneImage, state.phoneSrc);
    setHeroImageSource(mobileTabletImage, state.tabletSrc);
  };

  /**
   * Swaps the current/next slide classes so the existing CSS transitions animate,
   * then preloads the following asset into the slide that moved off canvas.
   */
  const advanceSlidePair = (
    currentSlide: HTMLElement,
    nextSlide: HTMLElement,
    currentImage: HTMLImageElement | null,
    nextImage: HTMLImageElement | null,
    incomingSrc: string,
    followingSrc: string,
    baseClass: string,
  ): [HTMLElement, HTMLElement] => {
    setHeroImageSource(nextImage, incomingSrc);
    currentSlide.classList.remove(`${baseClass}--current`);
    currentSlide.classList.add(`${baseClass}--next`);
    nextSlide.classList.remove(`${baseClass}--next`);
    nextSlide.classList.add(`${baseClass}--current`);

    pendingTimers.push(
      window.setTimeout(() => {
        setHeroImageSource(currentImage, followingSrc);
      }, HERO_SLIDE_PREPARE_DELAY_MS),
    );

    return [nextSlide, currentSlide];
  };

  /**
   * Forces the visible hero layers to play their entrance animation immediately
   * on the homepage, matching the original first-paint behavior.
   */
  const revealHeroLayer = (element: HTMLElement, delayMs: number) => {
    pendingTimers.push(
      window.setTimeout(() => {
        element.classList.add("hpc-animate--animated", "animate--animated");
        element.style.opacity = "1";
        element.style.transform = "none";
      }, delayMs),
    );
  };

  const primeHero = () => {
    const nextIndex = (activeIndex + 1) % HOME_HERO_STATES.length;
    const initialState = HOME_HERO_STATES[activeIndex];
    const queuedState = HOME_HERO_STATES[nextIndex];

    applyHeroState(activeIndex);
    setHeroImageSource(phoneCurrentImage, initialState.phoneSrc);
    setHeroImageSource(phoneNextImage, queuedState.phoneSrc);
    setHeroImageSource(tabletCurrentImage, initialState.tabletSrc);
    setHeroImageSource(tabletNextImage, queuedState.tabletSrc);

    revealHeroLayer(phoneShell, HERO_PHONE_INTRO_DELAY_MS);
    revealHeroLayer(tabletShell, HERO_TABLET_INTRO_DELAY_MS);
    animateTabletViewport(activeTabletCurrentSlide);
    syncHeroScrollMotion();
  };

  /**
   * Builds a desktop-only ScrollTrigger timeline that pins the hero briefly and
   * shifts hpc_col2 into a more horizontal composition while keeping col1 calm.
   * Inner media frames move independently so the parallax still reads after the
   * outer wrappers keep their original entrance/offset transforms.
   */
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
          phoneInnerFrame,
          {
            x: HERO_PARALLAX_PHONE_INNER_X_PX,
          },
          0,
        )
        .to(
          tabletInnerFrame,
          {
            x: HERO_PARALLAX_TABLET_INNER_X_PX,
          },
          0,
        )
        .to(
          backgroundStage,
          {
            x: HERO_PARALLAX_BG_STAGE_X_PX,
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

  const rotateHero = () => {
    const nextIndex = (activeIndex + 1) % HOME_HERO_STATES.length;
    const followingIndex = (nextIndex + 1) % HOME_HERO_STATES.length;

    applyHeroState(nextIndex);

    replayAnimationClass(activePhoneCurrentSlide, "hpc-col2-slide-out");
    replayAnimationClass(activePhoneNextSlide, "hpc-col2-slide-in");
    replayAnimationClass(activeTabletCurrentSlide, "hpc-col2-slide-out");
    replayAnimationClass(activeTabletNextSlide, "hpc-col2-slide-in");

    [activePhoneCurrentSlide, activePhoneNextSlide] = advanceSlidePair(
      activePhoneCurrentSlide,
      activePhoneNextSlide,
      activePhoneCurrentSlide.querySelector<HTMLImageElement>(
        ".hpc-phone__image",
      ),
      activePhoneNextSlide.querySelector<HTMLImageElement>(".hpc-phone__image"),
      HOME_HERO_STATES[nextIndex].phoneSrc,
      HOME_HERO_STATES[followingIndex].phoneSrc,
      "hpc-phone__slide",
    );

    [activeTabletCurrentSlide, activeTabletNextSlide] = advanceSlidePair(
      activeTabletCurrentSlide,
      activeTabletNextSlide,
      activeTabletCurrentSlide.querySelector<HTMLImageElement>(
        ".hpc-tablet__image",
      ),
      activeTabletNextSlide.querySelector<HTMLImageElement>(
        ".hpc-tablet__image",
      ),
      HOME_HERO_STATES[nextIndex].tabletSrc,
      HOME_HERO_STATES[followingIndex].tabletSrc,
      "hpc-tablet__slide",
    );

    animateTabletViewport(activeTabletCurrentSlide);
    syncHeroScrollMotion();
    activeIndex = nextIndex;
  };

  primeHero();
  const cleanupGsapParallax = setupGsapParallax();

  if (HERO_LOCK_STATE_FOR_COMPARISON) {
    return {
      cleanup: () => {
        cleanupGsapParallax?.();
        pendingTimers.forEach((timer) => window.clearTimeout(timer));
      },
      syncScrollMotion: syncHeroScrollMotion,
      hasGsapParallax: Boolean(cleanupGsapParallax),
    };
  }

  const rotationTimer = window.setInterval(rotateHero, HERO_ROTATE_INTERVAL_MS);

  return {
    cleanup: () => {
      window.clearInterval(rotationTimer);
      cleanupGsapParallax?.();
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    },
    syncScrollMotion: syncHeroScrollMotion,
    hasGsapParallax: Boolean(cleanupGsapParallax),
  };
}

export default function MenuFixer() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // ── 1. SCROLL ANIMATIONS ─────────────────────────────────────────────
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("hpc-animate--animated", "animate--animated");
            el.style.opacity = "1";
            el.style.transform = "none";
            animObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll(
        ".hpc-animate, .animate:not(.animate--mobile-only), .hpc-slider__slide, .hpc-slider__layer",
      )
      .forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        animObserver.observe(el);
      });

    const homeHeroAnimation = setupHomeHeroAnimation();

    // ── 2. DESKTOP DROPDOWN HOVER ────────────────────────────────────────
    const dropdowns = document.querySelectorAll<HTMLElement>(
      ".calypso-menu__item--dropdown",
    );

    const showDropdown = (dropdown: HTMLElement) => {
      const menu = dropdown
        .closest(".calypso-menu")
        ?.querySelector<HTMLElement>(".calypso-menu__dropdown");
      if (menu) {
        menu.classList.remove("calypso-menu__dropdown--hidden");
        dropdown.classList.add("calypso-menu__item--active");

        // Calculate position for triangle
        const menuRect = menu.getBoundingClientRect();
        const itemRect = dropdown.getBoundingClientRect();
        // The triangle should be in the center of the item, relative to the dropdown menu
        const trianglePos = itemRect.left + itemRect.width / 2 - menuRect.left;
        menu.style.setProperty("--triangle-left", `${trianglePos}px`);

        // Find the inner dropdown item and make it active
        const dataItem = dropdown.getAttribute("data-item");
        if (dataItem !== null) {
          const innerItem = menu.querySelector<HTMLElement>(
            `.calypso-menu__dropdown-item--item-${dataItem}`,
          );
          if (innerItem) {
            innerItem.classList.add("calypso-menu__dropdown-item--active");
          }
        }
      }
      // Also close all other dropdowns
      dropdowns.forEach((d) => {
        if (d !== dropdown) {
          const m = d
            .closest(".calypso-menu")
            ?.querySelector<HTMLElement>(".calypso-menu__dropdown");
          if (m) {
            m.classList.add("calypso-menu__dropdown--hidden");
            // deactivate inner items
            m.querySelectorAll(".calypso-menu__dropdown-item").forEach(
              (item) => {
                item.classList.remove("calypso-menu__dropdown-item--active");
              },
            );
          }
          d.classList.remove("calypso-menu__item--active");
        }
      });
    };

    const hideDropdown = (dropdown: HTMLElement) => {
      const menu = dropdown
        .closest(".calypso-menu")
        ?.querySelector<HTMLElement>(".calypso-menu__dropdown");
      if (menu) {
        menu.classList.add("calypso-menu__dropdown--hidden");
        dropdown.classList.remove("calypso-menu__item--active");
        // deactivate inner items
        menu
          .querySelectorAll(".calypso-menu__dropdown-item")
          .forEach((item) => {
            item.classList.remove("calypso-menu__dropdown-item--active");
          });
      }
    };

    dropdowns.forEach((dropdown) => {
      // Prevent default navigation for the top-level link of the dropdown
      const link = dropdown.querySelector<HTMLElement>(".calypso-menu__link");
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const menu = dropdown
            .closest(".calypso-menu")
            ?.querySelector<HTMLElement>(".calypso-menu__dropdown");
          if (menu) {
            const isHidden = menu.classList.contains(
              "calypso-menu__dropdown--hidden",
            );
            if (isHidden) showDropdown(dropdown);
            else hideDropdown(dropdown);
          }
        });
      }

      // Mobile/general click to toggle
      dropdown.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest(".calypso-menu__dropdown"))
          return;
        const menu = dropdown
          .closest(".calypso-menu")
          ?.querySelector<HTMLElement>(".calypso-menu__dropdown");
        if (menu) {
          const isHidden = menu.classList.contains(
            "calypso-menu__dropdown--hidden",
          );
          if (isHidden) showDropdown(dropdown);
          else hideDropdown(dropdown);
        }
        e.stopPropagation();
      });
    });

    // Close dropdowns when clicking outside
    const closeAll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".calypso-menu__item--dropdown")) {
        return;
      }
      dropdowns.forEach((d) => hideDropdown(d));
    };
    document.addEventListener("click", closeAll);

    // Intercept internal links inside the menu to perform client-side router jumps
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const a = target.closest("a");
      if (
        a &&
        a.href &&
        a.href.startsWith(window.location.origin) &&
        !a.classList.contains("calypso-menu__link")
      ) {
        e.preventDefault();
        const url = new URL(a.href);
        router.push(url.pathname + url.search + url.hash);
        dropdowns.forEach((d) => hideDropdown(d));
      }
    };
    const menuEl = document.querySelector(".calypso-menu");
    if (menuEl) {
      menuEl.addEventListener("click", handleLinkClick);
    }

    // ── 3. MOBILE BURGER MENU ────────────────────────────────────────────
    const burger = document.querySelector<HTMLElement>(".calypso-menu__burger");
    const mobileMenu = document.querySelector<HTMLElement>(
      ".calypso-menu__mobile",
    );
    const nav = document.querySelector<HTMLElement>(".calypso-menu");

    if (burger && mobileMenu) {
      burger.style.cursor = "pointer";
      burger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = nav?.classList.contains("calypso-menu--mobile-open");
        if (isOpen) {
          nav?.classList.remove("calypso-menu--mobile-open");
          mobileMenu.style.opacity = "0";
          mobileMenu.style.visibility = "hidden";
          mobileMenu.style.right = "-100%";
        } else {
          nav?.classList.add("calypso-menu--mobile-open");
          mobileMenu.style.opacity = "1";
          mobileMenu.style.visibility = "visible";
          mobileMenu.style.right = "0";
        }
      });
    }

    // ── 4. STICKY NAV SHADOW ON SCROLL ───────────────────────────────────
    const onScroll = () => {
      const navEl = document.querySelector<HTMLElement>(".calypso-menu");
      if (!navEl) return;
      if (window.scrollY > 20) {
        navEl.style.boxShadow = HERO_NAV_SHADOW_SCROLLED;
      } else {
        navEl.style.boxShadow = HERO_NAV_SHADOW_DEFAULT;
      }

      homeHeroAnimation.syncScrollMotion();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── 5. MOBILE MENU ACCORDION ─────────────────────────────────────────
    document
      .querySelectorAll<HTMLElement>(".calypso-menu__mobile-items > li")
      .forEach((li) => {
        const subMenu = li.querySelector<HTMLElement>(
          ".calypso-menu__mobile-dropdown-menu",
        );
        const span = li.querySelector<HTMLElement>("span");
        if (subMenu && span) {
          subMenu.style.maxHeight = "0";
          subMenu.style.overflow = "hidden";
          subMenu.style.transition = "max-height 0.3s ease";
          span.style.cursor = "pointer";
          span.addEventListener("click", () => {
            const open = li.classList.contains(
              "calypso-menu__mobile-menu--active",
            );
            // Close all
            document
              .querySelectorAll<HTMLElement>(".calypso-menu__mobile-items > li")
              .forEach((other) => {
                other.classList.remove("calypso-menu__mobile-menu--active");
                const sm = other.querySelector<HTMLElement>(
                  ".calypso-menu__mobile-dropdown-menu",
                );
                if (sm) sm.style.maxHeight = "0";
              });
            if (!open) {
              li.classList.add("calypso-menu__mobile-menu--active");
              subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            }
          });
        }
      });

    return () => {
      homeHeroAnimation.cleanup();
      animObserver.disconnect();
      document.removeEventListener("click", closeAll);
      window.removeEventListener("scroll", onScroll);
      if (menuEl) menuEl.removeEventListener("click", handleLinkClick);
    };
  }, [pathname, router]);

  return null;
}
