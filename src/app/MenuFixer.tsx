"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MenuFixer() {
  const pathname = usePathname();

  useEffect(() => {
    // Add hover event listeners to all dropdown menus
    const dropdowns = document.querySelectorAll('.calypso-menu__item--dropdown');
    
    dropdowns.forEach(dropdown => {
      // For desktop hover
      dropdown.addEventListener('mouseenter', () => {
        const menu = dropdown.querySelector('.calypso-menu__dropdown');
        if (menu) {
          menu.classList.remove('calypso-menu__dropdown--hidden');
          dropdown.classList.add('calypso-menu__item--active');
        }
      });
      
      dropdown.addEventListener('mouseleave', () => {
        const menu = dropdown.querySelector('.calypso-menu__dropdown');
        if (menu) {
          menu.classList.add('calypso-menu__dropdown--hidden');
          dropdown.classList.remove('calypso-menu__item--active');
        }
      });

      // For mobile click
      dropdown.addEventListener('click', (e) => {
        // Only toggle if we clicked the main item, not a link inside the dropdown
        if ((e.target as HTMLElement).closest('.calypso-menu__dropdown')) return;
        
        e.preventDefault();
        const menu = dropdown.querySelector('.calypso-menu__dropdown');
        if (menu) {
          menu.classList.toggle('calypso-menu__dropdown--hidden');
          dropdown.classList.toggle('calypso-menu__item--active');
        }
      });
    });

    // Handle mobile hamburger menu toggle
    const hamburger = document.querySelector('.calypso-menu__button');
    const menuGroup = document.querySelector('.calypso-menu__group--2');
    
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const header = document.querySelector('.calypso-header');
        const container = document.querySelector('.main-container');
        if (header) header.classList.toggle('menu-on');
        if (container) container.classList.toggle('pushed');
      });
    }

  }, [pathname]);

  return null;
}
