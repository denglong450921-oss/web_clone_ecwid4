import type { Metadata } from "next";
import "./globals.css";
import MenuFixer from "./MenuFixer";

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
          /* Critical above-fold styles — prevent FOUC */
          body { font-family: 'Open Sans', system-ui, sans-serif; margin: 0; overflow-x: hidden; }
          
          .lazyload, .lazyloading, .lazy-load {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
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
        {children}
      </body>
    </html>
  );
}
