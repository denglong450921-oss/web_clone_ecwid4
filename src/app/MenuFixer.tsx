"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const HERO_ROTATE_INTERVAL_MS = 2600;
const HERO_SLIDE_PREPARE_DELAY_MS = 850;
const HERO_PHONE_INTRO_DELAY_MS = 120;
const HERO_TABLET_INTRO_DELAY_MS = 260;
const HERO_BG_RIGHT_DESKTOP = "24vw";
const HERO_NAV_SHADOW_DEFAULT = "0 2px 16px rgba(0,0,0,0.06)";
const HERO_NAV_SHADOW_SCROLLED = "0 4px 24px rgba(0,0,0,0.12)";

type HomeHeroState = {
  label: string;
  underlineClass: string;
  accentColor: string;
  phoneSrc: string;
  tabletSrc: string;
};

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
    tabletSrc: "/images/Website_pad.png",
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
function setupHomeHeroAnimation(): () => void {
  const salesChannel =
    document.querySelector<HTMLElement>("#hpc_sales_channel");
  const underline = document.querySelector<HTMLElement>("#hpc_underlined");
  const accentBackground = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__bg--second",
  );
  const rotatedStack = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics--rotated",
  );
  const phoneShell = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__phone",
  );
  const tabletShell = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-pics__tablet",
  );
  const mobilePhoneImage = document.querySelector<HTMLImageElement>(
    "#hpc_col2 .hpc-mobile-pics__image--mobile",
  );
  const mobileTabletImage = document.querySelector<HTMLImageElement>(
    "#hpc_col2 .hpc-mobile-pics__image--tablet",
  );

  let phoneCurrentSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-phone__slide--current",
  );
  let phoneNextSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-phone__slide--next",
  );
  let tabletCurrentSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-tablet__slide--current",
  );
  let tabletNextSlide = document.querySelector<HTMLElement>(
    "#hpc_col2 .hpc-tablet__slide--next",
  );

  if (
    !salesChannel ||
    !underline ||
    !accentBackground ||
    !rotatedStack ||
    !phoneShell ||
    !tabletShell ||
    !phoneCurrentSlide ||
    !phoneNextSlide ||
    !tabletCurrentSlide ||
    !tabletNextSlide
  ) {
    return () => undefined;
  }

  const pendingTimers: number[] = [];
  let activeIndex = 0;
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
   * Applies the text, underline, accent background and responsive fallback art
   * for one hero rotation state.
   */
  const applyHeroState = (stateIndex: number) => {
    const state = HOME_HERO_STATES[stateIndex];
    salesChannel.textContent = state.label;
    underline.className = `hpc-underlined ${state.underlineClass}`;
    accentBackground.style.backgroundColor = state.accentColor;
    accentBackground.style.right = HERO_BG_RIGHT_DESKTOP;
    accentBackground.style.left = "auto";
    rotatedStack.style.marginTop = "0";

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
  };

  const rotateHero = () => {
    const nextIndex = (activeIndex + 1) % HOME_HERO_STATES.length;
    const followingIndex = (nextIndex + 1) % HOME_HERO_STATES.length;

    applyHeroState(nextIndex);

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

    activeIndex = nextIndex;
  };

  primeHero();
  const rotationTimer = window.setInterval(rotateHero, HERO_ROTATE_INTERVAL_MS);

  return () => {
    window.clearInterval(rotationTimer);
    pendingTimers.forEach((timer) => window.clearTimeout(timer));
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

    const cleanupHomeHeroAnimation = setupHomeHeroAnimation();

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
    };
    window.addEventListener("scroll", onScroll, { passive: true });

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
      cleanupHomeHeroAnimation();
      animObserver.disconnect();
      document.removeEventListener("click", closeAll);
      window.removeEventListener("scroll", onScroll);
      if (menuEl) menuEl.removeEventListener("click", handleLinkClick);
    };
  }, [pathname]);

  return null;
}
