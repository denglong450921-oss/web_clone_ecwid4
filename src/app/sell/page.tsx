"use client";
import { useEffect } from "react";
import React from "react";
import Link from "next/link";
export default function SellPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hpc-slider__slide--active");
            // also add animated class for general elements if needed
            if (entry.target.classList.contains("hpc-animate"))
              entry.target.classList.add("hpc-animate--animated");
          } else {
            // If you want them to animate again when scrolling up/down
            entry.target.classList.remove("hpc-slider__slide--active");
          }
        });
      },
      { threshold: 0.3 },
    );

    document
      .querySelectorAll(".hpc-slider__slide, .hpc-animate")
      .forEach((el) => observer.observe(el));

    const onScroll = () => {
      const windowScrollTop =
        window.scrollY || document.documentElement.scrollTop;
      const windowWidth = window.innerWidth;
      if (windowWidth >= 991) {
        const phone = document.querySelector(
          ".sell-hero__phone",
        ) as HTMLElement;
        const tablet = document.querySelector(
          ".sell-hero__tablet",
        ) as HTMLElement;
        const heroDescr = document.querySelector(
          ".sell-hero__descr",
        ) as HTMLElement;
        const heroHeader = document.querySelector(
          ".sell-hero__container > .row:first-child",
        ) as HTMLElement;

        if (phone && tablet && heroDescr && heroHeader) {
          // Limit the animation to a max scroll of 400px so it stops and then scrolls off naturally
          const animScroll = Math.min(windowScrollTop, 400);

          // Sticky effect: pin them to the screen
          const stickyY = animScroll;

          // Header stays pinned completely without any drift or extra animation
          heroHeader.style.transform = `translate3d(0, ${stickyY}px, 0)`;

          // Phone moves shorter distance to stay 100% visible on screen and not cover left text
          const maxPhoneMoveX = Math.min(windowWidth * 0.16, 250);
          const phoneSpeedMultiplier = maxPhoneMoveX / 400;
          const phoneMoveX = animScroll * phoneSpeedMultiplier;

          // Tablet moves much further (up to 850px) to clear the wider text block completely on the right
          const maxTabletMoveX = Math.min(windowWidth * 0.45, 850);
          const tabletSpeedMultiplier = maxTabletMoveX / 400;
          const tabletMoveX = animScroll * tabletSpeedMultiplier;

          // Measure original vertical gap in the DOM flow dynamically
          const headerOriginalBottom =
            heroHeader.offsetTop + heroHeader.offsetHeight;
          const descrOriginalTop = heroDescr.offsetTop;
          const originalGap = descrOriginalTop - headerOriginalBottom;

          // Cap the upward movement dynamically to ensure at least a 45px safe gap is maintained
          // and they NEVER cover or overlap each other, even with multi-line wrapped text!
          const maxDescrMoveUp = Math.max(originalGap - 45, 300);
          const descrMoveUp = Math.min(animScroll * 1.65, maxDescrMoveUp);
          heroDescr.style.transform = `translate3d(0, ${stickyY - descrMoveUp}px, 0)`;

          // Devices move up slightly relative to sticky position to frame the description
          const deviceMoveUp = Math.min(animScroll * 0.4, 160);
          phone.style.transform = `translate3d(-${phoneMoveX}px, ${stickyY - deviceMoveUp}px, 0)`;
          tablet.style.transform = `translate3d(${tabletMoveX}px, ${stickyY - deviceMoveUp}px, 0)`;

          heroHeader.style.transition = "transform 0.1s ease-out";
          phone.style.transition = "transform 0.1s ease-out";
          tablet.style.transition = "transform 0.1s ease-out";
          heroDescr.style.transition = "transform 0.1s ease-out";
        }
      } else {
        const phone = document.querySelector(
          ".sell-hero__phone",
        ) as HTMLElement;
        const tablet = document.querySelector(
          ".sell-hero__tablet",
        ) as HTMLElement;
        const heroDescr = document.querySelector(
          ".sell-hero__descr",
        ) as HTMLElement;
        const heroHeader = document.querySelector(
          ".sell-hero__container > .row:first-child",
        ) as HTMLElement;
        if (phone) {
          phone.style.transform = "none";
          phone.style.transition = "none";
        }
        if (tablet) {
          tablet.style.transform = "none";
          tablet.style.transition = "none";
        }
        if (heroDescr) {
          heroDescr.style.transform = "none";
          heroDescr.style.transition = "none";
        }
        if (heroHeader) {
          heroHeader.style.transform = "none";
          heroHeader.style.transition = "none";
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    // Add slick carousel for calypso-showcase if missing
    if (document.querySelector(".calypso-showcase")) {
      if (!document.getElementById("slick-js")) {
        const script = document.createElement("script");
        script.id = "slick-js";
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js";
        const jq = document.createElement("script");
        jq.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
        jq.onload = () => document.body.appendChild(script);
        script.onload = () => {
          // Initialize slick
          // @ts-expect-error - DOM libraries not configured, but ts-ignore is deprecated
          window.jQuery(".calypso-showcase").slick({
            swipe: true,
            slidesToShow: 1,
            infinite: false,
            initialSlide: 1,
            centerMode: true,
            focusOnSelect: true,
            centerPadding: "60px",
            dots: true,
            arrows: false,
            mobileFirst: true,
            responsive: [
              {
                breakpoint: 991,
                settings: {
                  fade: true,
                  infinite: true,
                  dots: false,
                  arrows: true,
                },
              },
            ],
          });
        };
        document.body.appendChild(jq);

        // Also add slick CSS
        const css1 = document.createElement("link");
        css1.rel = "stylesheet";
        css1.href =
          "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css";
        document.head.appendChild(css1);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        id="sell-content"
        style={{ paddingTop: "90px" }}
        className="page calypso-page hpc-page no_translate"
      >
        <section
          id="sell-hero"
          className="calypso-block calypso-block--EW19-small sell-hero"
        >
          <div id="sell-hero-inner" className="container sell-hero__container">
            <div id="sell-hero-title-row" className="row">
              <div
                id="sell-hero-title-col"
                className="col-12 col-md-10 offset-md-1 col-xl-8 offset-xl-2 text-lg-center "
              >
                <h4 id="sellpage_h4_1" className="text-gray text-normal">
                  只需几分钟即可创建在线店铺
                </h4>
                <h1 id="sellpage_h1_1">在线销售所需的一切事务</h1>
              </div>
            </div>
            <div
              id="sell-hero-image-row"
              className="row sell-hero__block calypso-block__image"
            >
              <div id="sell-hero-image-col" className="col-12">
                <div id="sell-hero-tablet" className="sell-hero__tablet">
                  {" "}
                  <img
                    id="sell-hero-tablet-img"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_content/Tab_Website.png"
                    className=""
                  ></img>
                </div>
                <div id="sell-hero-phone" className="sell-hero__phone">
                  {" "}
                  <img
                    id="sell-hero-phone-img"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_content/Phone_Website.png"
                    className=""
                  ></img>
                </div>
              </div>
            </div>
            <div id="sell-hero-description" className="row sell-hero__descr">
              <div
                id="sell-hero-description-col"
                className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3"
              >
                <p id="sellpage_p_1" className="">
                  Ecwid
                  让您可以随时随地通过互联网轻松地向世界各地的任何人销售。通过一个包含集中式存货、订单管理和定价功能的平台管理一切事务。没有比这更简单的了。
                </p>
                <div id="sell-hero-cta-block" className="btn-block text-center ">
                  {" "}
                  <a
                    id="sellpage_a_17"
                    href="https://my.ecwid.com/cp/#register"
                    className="btn btn--black btn--large btn--shadow cta-signup"
                    target="_blank"
                    rel="nofollow noopener"
                  >
                    开始
                  </a>
                  <div
                    id="sell-hero-features"
                    className="text-small text-gray"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="calypso-block calypso-block--EW19 calypso-block--overflow-hidden sticky-promo"
          id="sell-promo-website"
          data-sticky-promo-id="1"
        >
          <div id="sell-promo-website-inner" className="container">
            <div id="sell-promo-website-row" className="row calypso-promo">
              <div
                id="sell-promo-website-text-col"
                className="col-12 col-md-10 offset-md-1 col-xl-5 offset-xl-0 calypso-promo__first align-center"
              >
                <div
                  id="sell-promo-website-sticky"
                  className="sticky-promo__block"
                >
                  <div
                    className="sticky-promo__text "
                    data-sticky-promo-id="1"
                    id="sell-promo-website-text"
                  >
                    <h2 id="sellpage_h2_1" className="h1">
                      在网站上销售
                    </h2>
                    <p id="sellpage_p_2">
                      借助简单的可定制设计工具，只需
                      5 分钟即可从头开始创建新的网站，或者通过可即时模仿您的当前设计的技术，将在线店铺快速添加到现有网站。无需编码或安装软件。
                    </p>
                    <div
                      id="sell-promo-website-logo"
                      className="calypso-logo calypso-logo--g2"
                    >
                      <svg
                        id="sell-2"
                        width="144"
                        height="56"
                        viewBox="0 0 144 56"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#000000" fillRule="evenodd">
                          <path d="M23.47 32.8v-6.55H40V28A20 20 0 1 1 20 8v6.78a13.22 13.22 0 0 0 0 26.44c5.54 0 10.29-3.59 12.25-8.42h-8.78z"></path>
                          <path d="M26.78 20.4l2.03-2.13a15.07 15.07 0 0 0 2.67-3.49c.47-.96.71-1.86.71-2.69 0-.68-.2-1.37-.58-2.03a3.92 3.92 0 0 0-1.53-1.53A4.56 4.56 0 0 0 27.85 8c-1.39 0-2.49.42-3.37 1.29a4.92 4.92 0 0 0-1.37 3.03l-.03.27h2.23l.03-.2c.08-.62.3-1.13.66-1.52.44-.5 1-.75 1.67-.75.65 0 1.2.2 1.61.62.42.41.63.94.63 1.57 0 .58-.19 1.23-.57 1.94-.37.7-1.1 1.59-2.22 2.72L23 21.5v.99h9.31v-2.1h-5.53zM46.45 48h1V8h-1zM55.6 34.6V20.78c0-1.04.11-2.02.34-2.93.23-.91.6-1.71 1.14-2.4a5.56 5.56 0 0 1 2.09-1.63c.86-.4 1.91-.6 3.16-.6 1.14 0 2.13.15 2.96.47a5.28 5.28 0 0 1 3.26 3.37c.26.78.38 1.63.38 2.56l-4.21 1.07c0-1-.2-1.83-.58-2.46-.38-.64-1-.95-1.85-.95-.51 0-.92.1-1.24.32-.32.2-.56.48-.73.81a3.9 3.9 0 0 0-.36 1.08c-.07.39-.1.75-.1 1.08V34.6c0 .26.03.55.08.88.06.32.18.62.34.9.17.28.4.5.71.69.3.18.7.27 1.18.27 1.6 0 2.4-1.14 2.43-3.42.72.13 1.44.25 2.17.34l2.16.3c-.05 2.11-.63 3.78-1.73 5-1.11 1.23-2.75 1.84-4.91 1.84-2.28 0-3.97-.57-5.06-1.73-1.09-1.15-1.63-2.84-1.63-5.07M76.32 25.64h1.75c1.1 0 1.92-.33 2.45-.97.53-.65.8-1.7.8-3.13 0-1.26-.26-2.25-.78-2.95-.51-.7-1.36-1.06-2.55-1.06h-1.67v8.1zM72 41.17v-27.7h6.35c2.26 0 4.03.62 5.32 1.89 1.28 1.25 1.92 3.3 1.92 6.15 0 1.74-.25 3.22-.75 4.43a5.65 5.65 0 0 1-2.63 2.85l4.04 12.38H81.9L78.34 29.7h-2.02v11.47H72zM93.2 34.57c0 .7.18 1.35.54 1.92.36.57.97.85 1.84.85.88 0 1.5-.3 1.87-.9A4 4 0 0 0 98 34.3V20.26a4.3 4.3 0 0 0-.5-2.06c-.32-.62-.95-.92-1.88-.92-.5 0-.92.11-1.23.33-.32.23-.56.5-.73.84-.17.33-.28.7-.36 1.11-.07.42-.1.79-.1 1.12v13.9zm-4.34-.05V20.58c0-1.09.13-2.08.38-2.98.26-.9.65-1.68 1.18-2.33a5.33 5.33 0 0 1 2.1-1.51c.87-.37 1.9-.55 3.1-.55 1.27 0 2.33.17 3.2.5a4.9 4.9 0 0 1 2.08 1.47c.52.63.88 1.4 1.1 2.3a13 13 0 0 1 .33 3.06v13.53c0 2.41-.54 4.24-1.63 5.48-1.08 1.23-2.8 1.85-5.12 1.85-2.34 0-4.05-.59-5.12-1.77-1.06-1.18-1.6-2.88-1.6-5.11zM104.74 13.47h4.34l.7 5.17c.21 1.7.43 3.42.67 5.17l.18 1.4.27 2.24.26 2.23.17 1.42h.18l.5-3.1.48-3.08 1.72-11.45h3.65l2.32 11.49.52 3.12.52 3.14h.13l.54-6.3.93-11.45h4.34l-3.68 27.7h-4.42l-1.86-12.01-.4-2.34-.4-2.33h-.17l-.83 4.74c-.44 2-.9 3.99-1.33 5.97-.44 1.98-.85 3.97-1.23 5.97h-4.37l-3.73-27.7zM134.86 37.1h1.82c1.05 0 1.78-.27 2.18-.83.39-.56.59-1.37.59-2.43V20.75c0-1-.2-1.8-.57-2.37-.39-.57-1.12-.85-2.2-.85h-1.82V37.1zm-4.34 4.07v-27.7h6.9a7.6 7.6 0 0 1 3.9.85 4.62 4.62 0 0 1 2 2.88c.3.99.44 2.34.45 4.05l.01 6.03c0 2.28-.01 4.24-.04 5.89a13.8 13.8 0 0 1-.5 3.9c-.51 1.57-1.31 2.64-2.41 3.22-1.1.59-2.36.88-3.78.88h-6.53z"></path>
                        </g>
                      </svg>
                      <span id="sellpage_span_5" className="calypso-logo__text">
                        2019 年实现速度最快的电子商务平台。
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="sell-promo-website-image-col"
                className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-1 calypso-promo__second align-center text-center"
              >
                {" "}
                <img
                  id="sell-promo-website-mobile-img"
                  src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/Mobile/png/Mobile_Website.png"
                  className=" calypso-promo__image d-xl-none"
                ></img>
                <div
                  id="sell-promo-website-image-wrap"
                  className="sticky-promo__image hpc-slider hpc-slider--0 d-none d-xl-block"
                >
                  <div
                    className="hpc-slider__slide hpc-slider__slide--1"
                    id="sell-promo-website-slider"
                  >
                    {" "}
                    <img
                      id="sell-promo-website-slider-img1"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Website_2.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--1"
                    ></img>
                    <img
                      id="sell-promo-website-slider-img2"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Website_1.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--2"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="calypso-block calypso-block--EW19 calypso-block--overflow-hidden sticky-promo"
          id="sell-promo-social"
          data-sticky-promo-id="2"
        >
          <div id="sell-promo-social-inner" className="container">
            <div id="sell-promo-social-row" className="row calypso-promo">
              <div
                id="sell-promo-social-text-col"
                className="col-12 col-md-10 offset-md-1 col-xl-5 offset-xl-0 calypso-promo__first align-center"
              >
                <div id="sell-promo-social-sticky" className="sticky-promo__block">
                  <div
                    className="sticky-promo__text "
                    data-sticky-promo-id="2"
                    id="sell-promo-social-text"
                  >
                    <h2 id="sellpage_h2_2" className="h1">
                      在社交媒体上销售
                    </h2>
                    <p id="sellpage_p_3">
                      将社交分享转变为社交销售。在 Facebook 和 Instagram Feed
                      上轻松添加和销售商品，让买家从他们喜欢的社交媒体渠道浏览和购买商品。
                    </p>
                    <div
                      id="sell-promo-social-logo"
                      className="calypso-logo calypso-logo--large"
                    >
                      <svg
                        id="sell-3"
                        width="168"
                        height="56"
                        viewBox="0 0 168 56"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Instagram logo</title>
                        <path
                          d="M8.65 8.17C5.2 9.62 1.43 13.7.23 18.85c-1.5 6.52 4.78 9.27 5.3 8.37.6-1.06-1.13-1.42-1.48-4.8-.47-4.37 1.55-9.24 4.08-11.38.48-.4.45.15.45 1.18 0 1.83-.1 18.26-.1 21.69 0 4.64-.19 6.1-.53 7.55-.35 1.47-.9 2.46-.48 2.84.47.43 2.48-.59 3.65-2.23 1.4-1.96 1.88-4.32 1.97-6.88.1-3.09.1-7.99.1-10.78.01-2.56.05-10.07-.04-14.58-.02-1.1-3.06-2.27-4.5-1.66zm158.6 24.37c-.5 0-.73.52-.92 1.4-.65 3.02-1.34 3.7-2.22 3.7-1 0-1.88-1.5-2.11-4.5a101 101 0 0 1 .08-11.03c.05-.9-.2-1.77-2.57-2.64-1.01-.37-2.5-.92-3.23.87a44.88 44.88 0 0 0-3.1 10.72c0 .08-.1.1-.12-.1-.12-1.3-.4-3.68-.43-8.67 0-.98-.21-1.8-1.28-2.49-.7-.44-2.8-1.22-3.56-.29-.65.76-1.41 2.8-2.2 5.22-.64 1.96-1.1 3.3-1.1 3.3l.03-7.32c0-.76-.52-1.02-.67-1.06-.7-.2-2.09-.55-2.67-.55-.73 0-.9.4-.9 1 0 .08-.12 6.99-.12 11.81v.69c-.4 2.21-1.7 5.23-3.11 5.23s-2.08-1.26-2.08-7.02c0-3.36.1-4.82.15-7.24.03-1.4.08-2.48.08-2.72-.01-.75-1.3-1.13-1.9-1.27-.6-.14-1.11-.19-1.52-.17-.58.04-.98.42-.98.94v.81a5.53 5.53 0 0 0-2.73-2.22c-2.14-.64-4.37-.08-6.06 2.3-1.34 1.88-2.14 4.02-2.46 7.09-.23 2.24-.16 4.51.25 6.44-.5 2.17-1.42 3.06-2.43 3.06-1.47 0-2.54-2.42-2.42-6.6.08-2.76.63-4.69 1.23-7.48.25-1.19.05-1.81-.47-2.41-.48-.55-1.5-.83-2.95-.48a52.1 52.1 0 0 1-3.89.7s.09-.32.15-.9c.36-3.05-2.93-2.8-3.98-1.83a3.76 3.76 0 0 0-1.21 2.5 2.95 2.95 0 0 0 1.32 2.88c-.52 2.4-1.79 5.52-3.1 7.78a33.71 33.71 0 0 1-1.94 3.07v-1.07c-.02-5.03.04-9 .07-10.42.03-1.4.09-2.45.08-2.7 0-.54-.32-.75-.98-1a6.94 6.94 0 0 0-1.99-.45c-.9-.08-1.44.4-1.43.98v.77a5.53 5.53 0 0 0-2.73-2.23c-2.14-.64-4.37-.08-6.05 2.3a15.24 15.24 0 0 0-2.47 7.06c-.23 2.37-.19 4.37.13 6.06-.34 1.7-1.32 3.47-2.42 3.47-1.42 0-2.22-1.26-2.22-7.02 0-3.36.1-4.82.15-7.24.03-1.4.08-2.48.08-2.72-.01-.75-1.3-1.13-1.9-1.27a5.45 5.45 0 0 0-1.57-.16c-.55.04-.93.53-.93.9v.85a5.53 5.53 0 0 0-2.73-2.23c-2.14-.64-4.36-.07-6.06 2.3-1.1 1.54-2 3.25-2.46 7.03-.14 1.1-.2 2.12-.19 3.07-.44 2.72-2.39 5.85-3.98 5.85-.93 0-1.82-1.82-1.82-5.7 0-5.18.32-12.54.37-13.25l2.4-.04c1 0 1.92.02 3.26-.05.67-.04 1.31-2.46.62-2.76a23.8 23.8 0 0 0-3.41-.28c-.74-.01-2.8-.17-2.8-.17s.18-4.88.23-5.4c.03-.43-.52-.65-.84-.79-.77-.33-1.46-.48-2.27-.65-1.13-.24-1.65 0-1.75.95-.15 1.46-.22 5.73-.22 5.73-.83 0-3.66-.17-4.5-.17-.76 0-1.6 3.34-.53 3.38 1.23.05 3.36.09 4.78.13 0 0-.07 7.49-.07 9.8v.71c-.77 4.1-3.52 6.3-3.52 6.3.6-2.7-.61-4.74-2.78-6.46-.8-.63-2.38-1.83-4.14-3.15 0 0 1.02-1.01 1.93-3.05.64-1.45.67-3.1-.9-3.47-2.61-.6-4.76 1.33-5.4 3.38-.5 1.6-.23 2.78.74 4l.23.28c-.6 1.14-1.4 2.68-2.08 3.87-1.9 3.3-3.34 5.92-4.42 5.92-.87 0-.86-2.65-.86-5.14 0-2.14.16-5.37.29-8.7.04-1.1-.5-1.74-1.43-2.3-.56-.35-1.75-1.03-2.44-1.03-1.03 0-4.01.14-6.82 8.34-.36 1.03-1.06 2.92-1.06 2.92l.06-9.87c0-.23-.12-.45-.4-.6a6.92 6.92 0 0 0-2.87-.8c-.53 0-.8.26-.8.76l-.1 15.43c0 1.17.03 2.54.14 3.14.12.6.3 1.08.54 1.37.22.3.5.51.93.6.4.09 2.64.38 2.76-.48.14-1.03.14-2.14 1.31-6.3 1.83-6.47 4.2-9.63 5.33-10.75.2-.2.42-.2.4.12-.04 1.41-.2 4.96-.32 7.97-.3 8.06 1.15 9.55 3.23 9.55 1.6 0 3.83-1.6 6.24-5.62 1.5-2.51 2.95-4.98 4-6.75.73.68 1.54 1.4 2.36 2.19 1.9 1.82 2.53 3.54 2.11 5.18-.31 1.25-1.5 2.54-3.63 1.28-.62-.36-.88-.64-1.5-1.06-.33-.22-.84-.28-1.15-.05-.8.6-1.25 1.37-1.5 2.32-.26.92.66 1.41 1.61 1.84.82.36 2.58.7 3.7.74 4.39.14 7.9-2.13 10.34-8 .44 5.07 2.3 7.94 5.53 7.94 2.16 0 4.33-2.82 5.27-5.59.28 1.13.68 2.11 1.2 2.94 2.5 3.98 7.32 3.12 9.75-.25.75-1.05.87-1.42.87-1.42a4.58 4.58 0 0 0 4.36 4.3c1.63 0 3.32-.78 4.5-3.46.14.29.29.57.46.83 2.49 3.98 7.32 3.12 9.75-.25l.3-.43.07 2.1-2.24 2.05c-3.74 3.46-6.59 6.09-6.8 9.14-.26 3.9 2.87 5.34 5.25 5.53 2.51.2 4.67-1.2 6-3.16 1.16-1.73 1.93-5.44 1.87-9.12l-.09-5.34a42.78 42.78 0 0 0 8.06-14.15s1.38 0 2.86-.09c.47-.03.61.07.52.41-.1.43-1.86 7.27-.26 11.82 1.1 3.12 3.58 4.13 5.05 4.13 1.72 0 3.37-1.31 4.25-3.26.1.22.22.43.34.62 2.5 3.98 7.3 3.12 9.75-.25.55-.76.87-1.42.87-1.42.52 3.3 3.07 4.32 4.53 4.32 1.52 0 2.96-.63 4.13-3.42.05 1.23.13 2.23.25 2.55.07.2.5.44.82.55 1.39.52 2.8.28 3.33.17.36-.07.65-.37.69-1.13.1-1.99.03-5.33.63-7.82 1.01-4.17 1.95-5.79 2.4-6.59.24-.45.52-.52.53-.05.02.97.07 3.79.46 7.58.29 2.79.67 4.44.96 4.96.84 1.5 1.88 1.56 2.72 1.56.54 0 1.66-.15 1.56-1.1-.05-.46.04-3.32 1.03-7.43.64-2.68 1.72-5.1 2.11-6 .15-.32.21-.06.21-.01-.08 1.84-.26 7.9.48 11.2 1.02 4.48 3.95 4.98 4.97 4.98 2.18 0 3.97-1.67 4.57-6.07.14-1.06-.07-1.88-.71-1.88zm-91.37-2.71a14.42 14.42 0 0 1-1.3 5.68c-1.3 2.56-3.9 3.37-5.04-.33-.82-2.66-.54-6.3-.2-8.26.51-2.9 1.78-4.97 3.77-4.78 2.04.2 3.03 2.84 2.77 7.69zm19.94.03c-.12 2.2-.68 4.4-1.3 5.65-1.28 2.58-3.94 3.38-5.04-.33-.76-2.53-.57-5.8-.2-7.87.48-2.68 1.66-5.17 3.77-5.17 2.05 0 3.06 2.27 2.77 7.72zm.52 14.99c-.03 4-.66 7.52-2 8.54-1.9 1.45-4.46.36-3.93-2.56.46-2.59 2.68-5.23 5.93-8.46v2.48zm34.41-14.97c-.1 2.41-.64 4.3-1.3 5.63-1.27 2.58-3.91 3.37-5.04-.33-.6-2.01-.64-5.38-.2-8.2.45-2.87 1.7-5.03 3.77-4.84 2.04.2 3 2.84 2.77 7.74z"
                          fill="#979797"
                          fillRule="nonzero"
                        ></path>
                      </svg>
                      <span
                        id="sellpage_span_6"
                        className="calypso-logo__sep"
                      ></span>
                      <svg
                        id="sell-4"
                        width="168"
                        height="56"
                        viewBox="0 0 168 56"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Facebook logo</title>
                        <path
                          d="M89.66 24.52c-1.44 0-2.47.47-3.53.94V36.2c1.01.1 1.59.1 2.54.1 3.46 0 3.93-1.56 3.93-3.74v-5.13c0-1.6-.54-2.9-2.94-2.9zm-22.92-.58c-2.4 0-2.94 1.3-2.94 2.9v.9h5.88v-.9c0-1.6-.55-2.9-2.94-2.9zM22.34 35.1c0 1.27.6 1.93 1.94 1.93 1.44 0 2.3-.47 3.34-.94v-2.55h-3.15c-1.48 0-2.14.28-2.14 1.56zm89.62-10.59c-2.4 0-3.23 1.3-3.23 2.9v5.87c0 1.62.83 2.91 3.23 2.91s3.23-1.3 3.23-2.9v-5.88c0-1.6-.84-2.9-3.23-2.9zM10.57 41.7H3.52V24.84H0v-5.8h3.52v-3.49c0-4.73 2-7.55 7.64-7.55h4.71v5.8h-2.94c-2.2 0-2.35.82-2.35 2.33v2.9h5.32l-.62 5.81h-4.7V41.7zm24.1.04H28.8l-.26-1.47a13.61 13.61 0 0 1-6.66 1.71c-4.3 0-6.6-2.84-6.6-6.77 0-4.64 2.68-6.3 7.47-6.3h4.87v-1c0-2.36-.27-3.06-3.96-3.06h-6.03l.59-5.8h6.59c8.09 0 9.86 2.52 9.86 8.91v13.78zm19.99-16.46c-3.66-.62-4.7-.76-6.47-.76-3.16 0-4.11.7-4.11 3.34v5.01c0 2.65.95 3.34 4.11 3.34 1.76 0 2.81-.14 6.47-.76v5.66c-3.2.71-5.3.9-7.05.9-7.58 0-10.58-3.93-10.58-9.6v-4.07c0-5.68 3-9.62 10.58-9.62 1.76 0 3.85.19 7.05.9v5.66zm22.07 7.12H63.79v.47c0 2.65.96 3.34 4.12 3.34 2.84 0 4.58-.14 8.23-.76v5.66c-3.52.71-5.36.9-8.81.9-7.58 0-10.59-3.93-10.59-9.6v-4.66c0-4.96 2.24-9.03 10-9.03 7.75 0 9.99 4.02 9.99 9.03v4.65zm22.92.11C99.65 38 98.06 42 88.44 42c-3.48 0-5.52-.3-9.36-.88V9.74l7.05-1.16v10.97a16.2 16.2 0 0 1 5.3-.84c7.04 0 8.22 3.12 8.22 8.13v5.66zm22.6.12c0 4.73-1.98 9.32-10.27 9.32s-10.3-4.59-10.3-9.32v-4.57c0-4.73 2.01-9.33 10.3-9.33 8.29 0 10.26 4.6 10.26 9.33v4.57zm22.58 0c0 4.73-1.99 9.32-10.27 9.32s-10.3-4.59-10.3-9.32v-4.57c0-4.73 2.02-9.33 10.3-9.33 8.28 0 10.27 4.6 10.27 9.33v4.57zM168 41.7h-7.64l-6.46-10.65V41.7h-7.05V9.74l7.05-1.16v20.57l6.46-10.11H168l-7.05 11.03L168 41.69zm-33.46-17.17c-2.4 0-3.23 1.3-3.23 2.9v5.87c0 1.62.83 2.91 3.23 2.91 2.39 0 3.24-1.3 3.24-2.9v-5.88c0-1.6-.85-2.9-3.24-2.9z"
                          fill="#979797"
                          fillRule="nonzero"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="sell-promo-social-image-col"
                className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-1 calypso-promo__second align-center text-center"
              >
                {" "}
                <img
                  id="sell-promo-social-mobile-img"
                  src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/Mobile/png/Mobile_Social Network.png"
                  className=" calypso-promo__image d-xl-none"
                ></img>
                <div
                  id="sell-promo-social-image-wrap"
                  className="sticky-promo__image hpc-slider hpc-slider--0 d-none d-xl-block"
                >
                  <div
                    className="hpc-slider__slide hpc-slider__slide--2"
                    id="sell-promo-social-slider"
                  >
                    {" "}
                    <img
                      id="sell-promo-social-slider-img1"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Social Network_3.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--1"
                    ></img>
                    <img
                      id="sell-promo-social-slider-img2"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Social Network_2.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--2"
                    ></img>
                    <img
                      id="sell-promo-social-slider-img3"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Social Network_1.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--3"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="calypso-block calypso-block--EW19 calypso-block--overflow-hidden sticky-promo"
          id="sell-promo-marketplaces"
          data-sticky-promo-id="3"
        >
          <div id="sell-promo-marketplaces-inner" className="container">
            <div id="sell-promo-marketplaces-row" className="row calypso-promo">
              <div
                id="sell-promo-marketplaces-text-col"
                className="col-12 col-md-10 offset-md-1 col-xl-5 offset-xl-0 calypso-promo__first align-center"
              >
                <div
                  id="sell-promo-marketplaces-sticky"
                  className="sticky-promo__block"
                >
                  <div
                    className="sticky-promo__text "
                    data-sticky-promo-id="3"
                    id="sell-promo-marketplaces-text"
                  >
                    <h2 id="sellpage_h2_3" className="h1">
                      在购物平台上销售
                    </h2>
                    <p id="sellpage_p_4">
                      分享 eBay 和 Amazon
                      购物平台整合所带来的两千亿美元蛋糕。直接从您的 Ecwid
                      信息中心面向最受欢迎的购物平台无缝销售。
                    </p>
                    <div
                      id="sell-promo-marketplaces-logo"
                      className="calypso-logo calypso-logo--large"
                    >
                      <svg
                        id="sell-5"
                        width="128"
                        height="56"
                        viewBox="0 0 128 56"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Amazon logo</title>
                        <g fill="#979797" fillRule="nonzero">
                          <path d="M79.48 43.96C72.29 49.86 61.85 53 52.84 53c-12.62 0-23.94-5.17-32.56-13.78-.65-.67-.08-1.6.74-1.06 9.27 6 20.72 9.57 32.56 9.57 7.96 0 16.76-1.84 24.85-5.66 1.22-.53 2.22.92 1.05 1.89z"></path>
                          <path d="M81.75 40.18c-.89-1.16-5.92-.56-8.17-.25-.67.08-.8-.52-.17-.95 4.03-2.89 10.59-2.03 11.35-1.08.76.95-.21 7.67-3.98 10.86-.6.47-1.14.21-.89-.43.85-2.16 2.75-6.94 1.86-8.15zM73.66 19.08v-2.82c0-.44.3-.7.7-.7h12.61c.4 0 .74.3.74.7v2.38c0 .4-.35.92-.95 1.78l-6.53 9.29c2.44-.04 5 .3 7.18 1.52.48.26.6.7.65 1.08v3c0 .43-.43.9-.91.65a14.43 14.43 0 0 0-13.32.04c-.43.22-.91-.21-.91-.65V32.5c0-.44 0-1.22.48-1.91l7.57-10.8H74.4c-.4 0-.74-.31-.74-.7zM27.67 36.57h-3.83c-.35-.05-.65-.3-.7-.65V16.3c0-.39.35-.7.74-.7h3.57c.4 0 .66.31.7.66v2.56h.09c.9-2.47 2.7-3.65 5.04-3.65 2.4 0 3.92 1.18 4.96 3.65a5.45 5.45 0 0 1 5.31-3.65A5.4 5.4 0 0 1 48 17.34c1.22 1.65.96 4.04.96 6.16v12.42c0 .39-.35.69-.74.69h-3.79c-.4-.04-.7-.35-.7-.7v-10.4c0-.83.1-2.92-.08-3.7-.3-1.3-1.13-1.69-2.26-1.69-.92 0-1.92.6-2.31 1.6-.4 1-.35 2.65-.35 3.78v10.42c0 .39-.35.69-.74.69h-3.83c-.39-.04-.7-.35-.7-.7v-10.4c0-2.18.35-5.43-2.34-5.43-2.74 0-2.66 3.12-2.66 5.42v10.42a.76.76 0 0 1-.78.65zm70.92-21.4c5.7 0 8.79 4.86 8.79 11.07 0 5.99-3.4 10.76-8.8 10.76-5.56 0-8.6-4.86-8.6-10.93-.05-6.12 3.04-10.9 8.6-10.9zm0 4.04c-2.83 0-3 3.86-3 6.25 0 2.38-.05 7.5 2.96 7.5 2.95 0 3.13-4.12 3.13-6.63 0-1.65-.09-3.65-.57-5.21-.43-1.39-1.3-1.91-2.52-1.91zm16.14 17.36h-3.83c-.39-.05-.7-.35-.7-.7V16.21a.75.75 0 0 1 .75-.65h3.56c.35 0 .61.26.7.57v3h.09c1.08-2.7 2.56-3.96 5.22-3.96 1.7 0 3.4.61 4.48 2.3 1 1.57 1 4.21 1 6.12v12.37c-.04.35-.35.6-.74.6h-3.83c-.35-.04-.65-.3-.7-.6V25.28c0-2.17.27-5.29-2.39-5.29-.91 0-1.78.6-2.22 1.56a8.99 8.99 0 0 0-.6 3.73v10.6a.8.8 0 0 1-.79.69zm-47.25-.05a.79.79 0 0 1-.91.09c-1.26-1.04-1.53-1.56-2.22-2.56-2.09 2.13-3.61 2.78-6.31 2.78-3.22 0-5.74-2-5.74-5.95a6.5 6.5 0 0 1 4.09-6.25c2.08-.9 5-1.08 7.22-1.34v-.48c0-.91.09-2-.48-2.78-.48-.7-1.35-1-2.13-1-1.48 0-2.79.74-3.1 2.3-.08.35-.3.7-.64.7l-3.7-.4c-.3-.08-.65-.3-.57-.77.87-4.51 4.92-5.86 8.57-5.86 1.87 0 4.31.48 5.79 1.9 1.87 1.74 1.7 4.09 1.7 6.6v5.95c0 1.78.74 2.56 1.43 3.56.26.35.3.78 0 1-.82.65-2.22 1.86-3 2.51zm-3.87-9.33v-.82c-2.79 0-5.7.6-5.7 3.86 0 1.65.87 2.78 2.35 2.78 1.09 0 2.04-.65 2.65-1.74.74-1.34.7-2.6.7-4.08zm-46.43 9.33a.79.79 0 0 1-.9.09c-1.27-1.04-1.53-1.56-2.23-2.56-2.09 2.13-3.6 2.78-6.3 2.78-3.23 0-5.75-2-5.75-5.95a6.5 6.5 0 0 1 4.09-6.25c2.09-.9 5-1.08 7.22-1.34v-.48c0-.91.09-2-.48-2.78-.47-.7-1.35-1-2.13-1-1.48 0-2.78.74-3.09 2.3-.08.35-.3.7-.65.7l-3.7-.4c-.3-.08-.65-.3-.56-.77C3.57 16.35 7.6 15 11.27 15c1.87 0 4.3.48 5.78 1.9 1.87 1.74 1.7 4.09 1.7 6.6v5.95c0 1.78.74 2.56 1.44 3.56.26.35.3.78 0 1-.83.65-2.22 1.86-3 2.51zm-3.82-9.33v-.82c-2.79 0-5.7.6-5.7 3.86 0 1.65.87 2.78 2.35 2.78 1.08 0 2.04-.65 2.65-1.74.74-1.34.7-2.6.7-4.08z"></path>
                        </g>
                      </svg>
                      <span
                        id="sellpage_span_7"
                        className="calypso-logo__sep"
                      ></span>
                      <svg
                        id="sell-6"
                        width="104"
                        height="56"
                        viewBox="0 0 104 56"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Ebay logo</title>
                        <g fill="#979797" fillRule="nonzero">
                          <path d="M14.86 17C7.85 17 2 19.9 2 28.68 2 35.62 5.93 40 15.04 40c10.73 0 11.42-6.9 11.42-6.9h-5.2s-1.11 3.72-6.53 3.72c-4.42 0-7.6-2.92-7.6-7H27v-2.56C27 23.22 24.38 17 14.86 17zm-.18 3.27c4.2 0 7.07 2.52 7.07 6.28H7.25c0-4 3.74-6.28 7.43-6.28zM27.11 8v27.47c0 1.56-.11 3.75-.11 3.75h4.95s.18-1.58.18-3.01c0 0 2.45 3.79 9.1 3.79C48.24 40 53 35.18 53 28.27c0-6.42-4.37-11.6-11.76-11.6-6.91 0-9.06 3.7-9.06 3.7V8h-5.07zm12.86 12.08c4.75 0 7.78 3.5 7.78 8.2 0 5.03-3.5 8.32-7.75 8.32-5.08 0-7.82-3.93-7.82-8.28 0-4.06 2.46-8.24 7.79-8.24zM65.9 17c-10.58 0-11.26 5.86-11.26 6.8h5.27s.28-3.43 5.64-3.43c3.48 0 6.18 1.61 6.18 4.7v1.11h-6.18C57.34 26.18 53 28.6 53 33.52c0 4.85 4 7.48 9.43 7.48 7.38 0 9.76-4.12 9.76-4.12 0 1.64.12 3.25.12 3.25H77s-.18-2-.18-3.28V25.78c0-7.25-5.8-8.78-10.91-8.78zm5.83 12.48v1.47c0 1.92-1.17 6.68-8.07 6.68-3.77 0-5.39-1.9-5.39-4.1 0-4.02 5.45-4.05 13.46-4.05z"></path>
                          <path d="M74 18h5.87l8.42 16.85L96.69 18H102L86.7 48h-5.57l4.41-8.36z"></path>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="sell-promo-marketplaces-image-col"
                className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-1 calypso-promo__second align-center text-center"
              >
                {" "}
                <img
                  id="sell-promo-marketplaces-mobile-img"
                  src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/Mobile/png/Mobile_Marketplaces.png"
                  className=" calypso-promo__image d-xl-none"
                ></img>
                <div
                  id="sell-promo-marketplaces-image-wrap"
                  className="sticky-promo__image hpc-slider hpc-slider--0 d-none d-xl-block"
                >
                  <div
                    className="hpc-slider__slide hpc-slider__slide--3"
                    id="sell-promo-marketplaces-slider"
                  >
                    {" "}
                    <img
                      id="sell-promo-marketplaces-slider-img1"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Marketplaces_3.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--1"
                    ></img>
                    <img
                      id="sell-promo-marketplaces-slider-img2"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Marketplaces_2.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--2"
                    ></img>
                    <img
                      id="sell-promo-marketplaces-slider-img3"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_Marketplaces_1.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--3"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="calypso-block calypso-block--EW19 calypso-block--overflow-hidden sticky-promo"
          id="sell-promo-pos"
          data-sticky-promo-id="4"
        >
          <div id="sell-promo-pos-inner" className="container">
            <div id="sell-promo-pos-row" className="row calypso-promo">
              <div
                id="sell-promo-pos-text-col"
                className="col-12 col-md-10 offset-md-1 col-xl-5 offset-xl-0 calypso-promo__first align-center"
              >
                <div id="sell-promo-pos-sticky" className="sticky-promo__block">
                  <div
                    className="sticky-promo__text "
                    data-sticky-promo-id="4"
                    id="sell-promo-pos-text"
                  >
                    <h2 id="sellpage_h2_4" className="h1">
                      线上、店内和移动销售
                    </h2>
                    <p id="sellpage_p_5">
                      通过 Square
                      和 种其他销售终端系统接受店内和移动付款。最重要的是，存货水平会在您的
                      Ecwid 帐户中自动更新，这样，所有店铺都能完美同步。
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="sell-promo-pos-image-col"
                className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-1 calypso-promo__second align-center text-center"
              >
                {" "}
                <img
                  id="sell-promo-pos-mobile-img"
                  src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/Mobile/png/Mobile_POS.png"
                  className=" calypso-promo__image d-xl-none"
                ></img>
                <div
                  id="sell-promo-pos-image-wrap"
                  className="sticky-promo__image hpc-slider hpc-slider--0 d-none d-xl-block"
                >
                  <div
                    className="hpc-slider__slide hpc-slider__slide--4"
                    id="sell-promo-pos-slider"
                  >
                    {" "}
                    <img
                      id="sell-promo-pos-slider-img1"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_POS_1.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--1"
                    ></img>
                    <img
                      id="sell-promo-pos-slider-img2"
                      src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/png_sliders/Slider_POS_2.png"
                      alt=""
                      className="hpc-slider__layer hpc-slider__layer--2"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="sell-showcase"
          className="calypso-block calypso-block--b0 calypso-block--overflow-hidden calypso-block--EW19"
        >
          <div id="sell-showcase-title-row" className="container">
            <div id="sell-showcase-title-col" className="row">
              <div id="sell-showcase-title-container" className="col-12">
                <h2 id="sellpage_h2_5" className="h1">
                  商家如何使用 Ecwid
                </h2>
              </div>
            </div>
          </div>
          <div id="sell-showcase-list" className="calypso-showcase">
            <div id="sell-showcase-item-1" className="calypso-showcase__item">
              <div id="sell-showcase-item-container-1" className="container">
                <div
                  id="sell-showcase-item-wrapper-1"
                  className="calypso-showcase__item-container"
                >
                  {" "}
                  <img
                    id="sell-showcase-img-1-web"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/Hermanitos_Web.png"
                    className=" calypso-showcase__image calypso-showcase__image-web"
                  ></img>{" "}
                  <img
                    id="sell-showcase-img-1-fb"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/Hermanitos_FB.png"
                    className=" calypso-showcase__image calypso-showcase__image-fb"
                  ></img>{" "}
                  <img
                    id="sell-showcase-img-1-in"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/Hermanitos_Insta.png"
                    className=" calypso-showcase__image calypso-showcase__image-in"
                  ></img>
                </div>
              </div>
            </div>
            <div id="sell-showcase-item-2" className="calypso-showcase__item">
              <div id="sell-showcase-item-container-2" className="container">
                <div
                  id="sell-showcase-item-wrapper-2"
                  className="calypso-showcase__item-container"
                >
                  {" "}
                  <img
                    id="sell-showcase-img-2-web"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/ATOD_Web.png"
                    className=" calypso-showcase__image calypso-showcase__image-web"
                  ></img>{" "}
                  <img
                    id="sell-showcase-img-2-fb"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/ATOD_FB.png"
                    className=" calypso-showcase__image calypso-showcase__image-fb"
                  ></img>{" "}
                  <img
                    id="sell-showcase-img-2-in"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/ATOD_Insta.png"
                    className=" calypso-showcase__image calypso-showcase__image-in"
                  ></img>
                </div>
              </div>
            </div>
            <div id="sell-showcase-item-3" className="calypso-showcase__item">
              <div id="sell-showcase-item-container-3" className="container">
                <div
                  id="sell-showcase-item-wrapper-3"
                  className="calypso-showcase__item-container"
                >
                  {" "}
                  <img
                    id="sell-showcase-img-3-web"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/Ottica_Web.png"
                    className=" calypso-showcase__image calypso-showcase__image-web"
                  ></img>{" "}
                  <img
                    id="sell-showcase-img-3-fb"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/Ottica_FB.png"
                    className=" calypso-showcase__image calypso-showcase__image-fb"
                  ></img>{" "}
                  <img
                    id="sell-showcase-img-3-in"
                    src="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/sell/Ottica_Insta.png"
                    className=" calypso-showcase__image calypso-showcase__image-in"
                  ></img>
                </div>
              </div>
            </div>
          </div>{" "}
        </section>
        <section
          id="sell-global"
          className="calypso-block calypso-block--EW19 calypso-block--b0 calypso-background--sell"
        >
          <div id="sell-global-inner" className="container">
            <div id="sell-global-title-row" className="row">
              <div id="sell-global-title-col" className="col-12 ">
                <h2 id="sellpage_h2_6" className="h1">
                  向全世界销售
                </h2>
                <p id="sellpage_p_6">
                  通过内置的国际付款工具和
                  50 种语言的翻译支持以及盘点系统，让您的小型企业全球化。
                </p>
              </div>
            </div>
            <div
              id="sell-global-stats"
              className="row global-countries text-center text-md-left"
            >
              <div id="sell-global-stat-payments" className="col-12 col-lg-4">
                <div
                  id="sell-global-stat-payments-container"
                  className="global-countries__container"
                >
                  <div
                    id="sell-global-stat-payments-number"
                    className="global-countries__number"
                  >
                    70<sup className="global-countries__plus">+</sup>
                  </div>
                  <p id="sellpage_p_7" className="">
                    40+ 支付网关
                  </p>
                </div>
              </div>
              <div id="sell-global-stat-countries" className="col-12 col-lg-4">
                <div
                  id="sell-global-stat-countries-container"
                  className="global-countries__container"
                >
                  <div
                    id="sell-global-stat-countries-number"
                    className="global-countries__number"
                  >
                    175
                  </div>
                  <p id="sellpage_p_8" className="">
                    175 国家/地区
                  </p>
                </div>
              </div>
              <div id="sell-global-stat-languages" className="col-12 col-lg-4">
                <div
                  id="sell-global-stat-languages-container"
                  className="global-countries__container"
                >
                  <div
                    id="sell-global-stat-languages-number"
                    className="global-countries__number"
                  >
                    50
                  </div>
                  <p id="sellpage_p_9" className="">
                    50 语言
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="sell-cta" className="calypso-block calypso-block--EW19 ">
          <div id="sell-cta-inner" className="container">
            <div id="sell-cta-title-row" className="row">
              <div
                id="sell-cta-content"
                className="col-12 col-lg-10 offset-lg-1 text-center "
              >
                <h4 id="sellpage_h4_2" className="text-gray text-normal">
                  只需几分钟即可创建在线店铺
                </h4>
                <h2 id="sellpage_h2_7" className="h1">
                  在线销售所需的一切事务
                </h2>
                <div
                  id="sell-cta-button-block"
                  className="btn-block calypso-block__btn-block text-center"
                >
                  {" "}
                  <a
                    id="sellpage_a_18"
                    href="https://my.ecwid.com/cp/#register"
                    className="btn btn--black btn--large btn--shadow cta-signup"
                    target="_blank"
                    rel="nofollow noopener"
                  >
                    开始
                  </a>
                  <div
                    id="sell-cta-disclaimer"
                    className="text-gray text-small"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>{" "}
      </div>

      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ── Cross-connection Animation for E9 ── */
        #sellpage_promo1_image_E9 {
          position: relative !important;
          overflow: visible !important;
          box-shadow: none !important;
          filter: none !important;
        }
        
        #sellpage_promo1_image_E9 * {
          box-shadow: none !important;
          filter: none !important;
        }
        
        /* Base screen skeleton - slides in from top-left */
        #sellpage_promo1_image_E9 .hpc-slider__layer--1 {
          transform: translate3d(-60px, -20px, 0) scale(0.95) !important;
          opacity: 0 !important;
          transition: all 1.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          will-change: transform, opacity !important;
          box-shadow: none !important;
          filter: none !important;
        }
        
        #sellpage_promo1_image_E9.hpc-slider__slide--active .hpc-slider__layer--1 {
          transform: translate3d(0, 0, 0) scale(1) !important;
          opacity: 1 !important;
          animation: crossFloat1 6s ease-in-out infinite !important;
          animation-delay: 1.4s !important;
          box-shadow: none !important;
          filter: none !important;
        }
        
        /* Content elements - slides in from bottom-right */
        #sellpage_promo1_image_E9 .hpc-slider__layer--2 {
          transform: translate3d(60px, 20px, 0) scale(0.95) !important;
          opacity: 0 !important;
          transition: all 1.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          will-change: transform, opacity !important;
          background: transparent !important;
          background-color: transparent !important;
          filter: none !important;
          box-shadow: none !important;
        }
        
        #sellpage_img_5 {
          background: transparent !important;
          background-color: transparent !important;
          filter: none !important;
          box-shadow: none !important;
        }
        
        #sellpage_promo1_image_E9.hpc-slider__slide--active .hpc-slider__layer--2 {
          transform: translate3d(0, 0, 0) scale(1) !important;
          opacity: 1 !important;
          animation: crossFloat2 6s ease-in-out infinite !important;
          animation-delay: 1.4s !important;
          filter: none !important;
          box-shadow: none !important;
        }
        
        @keyframes crossFloat1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) !important;
            filter: brightness(0.98) !important;
            box-shadow: none !important;
          }
          50% {
            transform: translate3d(-4px, -3px, 0) scale(1.003) !important;
            filter: brightness(1.01) !important;
            box-shadow: none !important;
          }
        }
        
        @keyframes crossFloat2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) !important;
            filter: none !important;
            box-shadow: none !important;
          }
          50% {
            transform: translate3d(4px, 3px, 0) scale(1.005) !important;
            filter: brightness(1.03) !important;
            box-shadow: none !important;
          }
        }
      `,
        }}
      />
    </>
  );
}
