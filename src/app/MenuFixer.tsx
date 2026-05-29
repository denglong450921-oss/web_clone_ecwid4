"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MenuFixer() {
  const pathname = usePathname();

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
      { threshold: 0.12 }
    );

    document
      .querySelectorAll(
        ".hpc-animate, .animate:not(.animate--mobile-only), .hpc-slider__slide, .hpc-slider__layer"
      )
      .forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        animObserver.observe(el);
      });

    // ── 2. DESKTOP DROPDOWN HOVER ────────────────────────────────────────
    const dropdowns = document.querySelectorAll<HTMLElement>(
      ".calypso-menu__item--dropdown"
    );

    const showDropdown = (dropdown: HTMLElement) => {
      const menu = dropdown.closest(".calypso-menu")?.querySelector<HTMLElement>(
        ".calypso-menu__dropdown"
      );
      if (menu) {
        menu.classList.remove("calypso-menu__dropdown--hidden");
        dropdown.classList.add("calypso-menu__item--active");
        
        // Find the inner dropdown item and make it active
        const dataItem = dropdown.getAttribute("data-item");
        if (dataItem !== null) {
          const innerItem = menu.querySelector<HTMLElement>(`.calypso-menu__dropdown-item--item-${dataItem}`);
          if (innerItem) {
            innerItem.classList.add("calypso-menu__dropdown-item--active");
          }
        }
      }
      // Also close all other dropdowns
      dropdowns.forEach((d) => {
        if (d !== dropdown) {
          const m = d.closest(".calypso-menu")?.querySelector<HTMLElement>(".calypso-menu__dropdown");
          if (m) {
            m.classList.add("calypso-menu__dropdown--hidden");
            // deactivate inner items
            m.querySelectorAll(".calypso-menu__dropdown-item").forEach(item => {
              item.classList.remove("calypso-menu__dropdown-item--active");
            });
          }
          d.classList.remove("calypso-menu__item--active");
        }
      });
    };

    const hideDropdown = (dropdown: HTMLElement) => {
      const menu = dropdown.closest(".calypso-menu")?.querySelector<HTMLElement>(
        ".calypso-menu__dropdown"
      );
      if (menu) {
        menu.classList.add("calypso-menu__dropdown--hidden");
        dropdown.classList.remove("calypso-menu__item--active");
        // deactivate inner items
        menu.querySelectorAll(".calypso-menu__dropdown-item").forEach(item => {
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
          const menu = dropdown.closest(".calypso-menu")?.querySelector<HTMLElement>(
            ".calypso-menu__dropdown"
          );
          if (menu) {
            const isHidden = menu.classList.contains(
              "calypso-menu__dropdown--hidden"
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
        const menu = dropdown.closest(".calypso-menu")?.querySelector<HTMLElement>(
          ".calypso-menu__dropdown"
        );
        if (menu) {
          const isHidden = menu.classList.contains(
            "calypso-menu__dropdown--hidden"
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

    // ── 3. MOBILE BURGER MENU ────────────────────────────────────────────
    const burger = document.querySelector<HTMLElement>(".calypso-menu__burger");
    const mobileMenu = document.querySelector<HTMLElement>(
      ".calypso-menu__mobile"
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
        navEl.style.boxShadow = "0 4px 24px rgba(0,0,0,0.12)";
      } else {
        navEl.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── 5. MOBILE MENU ACCORDION ─────────────────────────────────────────
    document
      .querySelectorAll<HTMLElement>(".calypso-menu__mobile-items > li")
      .forEach((li) => {
        const subMenu = li.querySelector<HTMLElement>(
          ".calypso-menu__mobile-dropdown-menu"
        );
        const span = li.querySelector<HTMLElement>("span");
        if (subMenu && span) {
          subMenu.style.maxHeight = "0";
          subMenu.style.overflow = "hidden";
          subMenu.style.transition = "max-height 0.3s ease";
          span.style.cursor = "pointer";
          span.addEventListener("click", () => {
            const open = li.classList.contains("calypso-menu__mobile-menu--active");
            // Close all
            document
              .querySelectorAll<HTMLElement>(
                ".calypso-menu__mobile-items > li"
              )
              .forEach((other) => {
                other.classList.remove("calypso-menu__mobile-menu--active");
                const sm = other.querySelector<HTMLElement>(
                  ".calypso-menu__mobile-dropdown-menu"
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
      animObserver.disconnect();
      document.removeEventListener("click", closeAll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
