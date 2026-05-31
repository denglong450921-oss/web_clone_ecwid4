import type { Metadata } from "next";
import "./globals.css";
import MenuFixer from "./MenuFixer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ecwid 电子商务 — 在 5 分钟内免费添加在线商店",
  description:
    "在网站、社交网站、市场（Google Shopping、Amazon Ads、eBay）同时销售商品，或使用任何设备当面出售商品。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" dir="ltr">
      <head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Ecwid original stylesheet */}
        <link
          href="https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/calypso.d1385ee4.css"
          rel="stylesheet"
        />

        <style>{`
          /* Critical above-fold styles — prevent FOUC and force animations to final state */
          body { font-family: 'Open Sans', system-ui, sans-serif; margin: 0; overflow-x: hidden; }
          
          /* Force all animated elements to be visible immediately and reset transforms */
          .hpc-animate, 
          .animate, 
          .hpc-slider__slide, 
          .hpc-pics__bg, 
          .hpc-slider__layer,
          .hpc-pics__phone,
          .hpc-pics__tablet,
          .hpc-pics__glasses,
          .hpc-mobile-pics,
          .hpc-phone__slide,
          .hpc-tablet__slide,
          .calypso-menu__link,
          #hpc_on,
          #hpc_sales_channel,
          .hpc-text,
          .hpc-underlined__text {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }

          /* Fix for h1 specifically */
          h1.h1--EW19 {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            transform: none !important;
            font-size: 64px !important;
            line-height: 1.1 !important;
            font-weight: 800 !important;
          }

          /* Navigation Menu Fixes */
          .calypso-menu__link, 
          .calypso-menu__item span, 
          .calypso-menu__item a {
            color: #0a0c0f !important;
            opacity: 1 !important;
            visibility: visible !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            text-decoration: none !important;
          }

          /* Underline Fixes — Brush Stroke Effect */
          .hpc-underlined {
            position: relative;
            display: inline-block !important;
          }
          .hpc-underlined--yellow::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: -5%;
            width: 110%;
            height: 100%;
            background: url("https://don16obqbay2c.cloudfront.net/wp-content/themes/ecwid/images/hpc/zh-CN/svg_illustrations/hero-line-yellow.svg") no-repeat center bottom;
            background-size: 100% auto;
            z-index: -1;
            opacity: 1 !important;
            visibility: visible !important;
            transform: rotate(-1deg);
          }
          .hpc-underlined__text {
            position: relative;
            z-index: 1;
            display: inline-block !important;
          }

          /* Header CTA button fix */
          .cta-signup.btn--small {
            background-color: #fae053 !important;
            color: #0a0c0f !important;
            padding: 8px 24px !important;
            border-radius: 4px !important;
            font-weight: 700 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Specific fixes for overlapping layers and missing images */
          .hpc-slider__layer--2 {
            display: none !important;
          }

          #hpc_pics {
            margin-top: 110px !important; /* Adjusted from -90px to match live site better */
            opacity: 1 !important;
            visibility: visible !important;
          }

          .hpc-pics__bg {
            opacity: 1 !important;
            visibility: visible !important;
          }

          /* Fix for the missing Start Selling header text */
          #home-68 {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            font-size: 64px !important;
            font-weight: 800 !important;
            line-height: 1.1 !important;
            margin-bottom: 8px !important;
          }

          /* Hero text positioning */
          .hpc-text {
            padding-top: 120px !important;
          }

          /* Image sizing fixes */
          .hpc-phone__image, .hpc-tablet__image {
            width: 100% !important;
            height: auto !important;
            display: block !important;
          }

          /* Ensure frames are visible */
          .hpc-phone__frame, .hpc-tablet__frame {
            opacity: 1 !important;
            visibility: visible !important;
          }

          /* Force lazyloaded images */
          .lazyload, .lazyloading, .lazy-load {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }

          /* Fix missing backgrounds */
          .calypso-no-bg-loaded {
            background-image: inherit !important;
          }

          .wj_registration-overlay { z-index: 1000000000 !important; }

          .embed {
            display: block; position: relative; z-index: 1;
            overflow: hidden; height: 0; margin-bottom: 48px;
            padding: 0; padding-bottom: 56.25%;
          }
          .embed iframe {
            position: absolute; top: 0; bottom: 0; left: 0;
            width: 100%; height: 100%; border: 0;
          }

          /* Prevent layout shift while CSS loads */
          .calypso-menu {
            min-height: 64px;
            background: rgba(255,255,255,0.92);
          }
        `}</style>
      </head>
      <body id="p-32564" className="index-EW19">
        <MenuFixer />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
