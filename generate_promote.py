import os
import re
from bs4 import BeautifulSoup

html_file = "src/app/promote_raw.html"
with open(html_file, "r") as f:
    html = f.read()

# Fix lazy images
html = re.sub(r'data-src="?([^" >]+)"?', r'src="\1"', html)
html = re.sub(r'data-lazy="?([^" >]+)"?', r'src="\1"', html)

soup = BeautifulSoup(html, "html.parser")

# Remove scripts, noscripts, iframes
for tag in soup(["script", "noscript", "iframe"]):
    tag.extract()

body = soup.find("body")

body_html = ""
if body:
    body_html = "".join([str(c) for c in body.contents])
    
react_code = f"""
"use client";
import {{ useEffect }} from 'react';

export default function PromotePage() {{
  useEffect(() => {{
    // Intersection Observer for scroll-based class additions
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          const el = entry.target;
          if (el.classList.contains('hpc-animate')) el.classList.add('hpc-animate--animated');
          if (el.classList.contains('animate')) el.classList.add('animate--animated');
          if (el.classList.contains('promote-hero')) el.classList.add('promote-hero--animated');
          observer.unobserve(el);
        }}
      }});
    }}, {{ threshold: 0.1 }});

    const elements = document.querySelectorAll('.hpc-animate, .animate, .promote-hero');
    elements.forEach(el => observer.observe(el));
    
    // Original site setTimeout for promote-hero
    setTimeout(() => {{
      document.querySelectorAll('.promote-hero').forEach(el => el.classList.add('promote-hero--animated'));
    }}, 400);

    // Vanilla JS implementation of calypso-animation.js parallax
    const parallaxLayers = [
      {{ selector: '.promote-paralax__layer--1', coeff: -0.2, relative: '.promote-paralax', min_width: 1200 }},
      {{ selector: '.promote-paralax__layer--2', coeff: -0.1, relative: '.promote-paralax', min_width: 1200 }},
      {{ selector: '.promote-paralax__layer--3', coeff: -0.2, relative: '.promote-paralax--1', min_width: 1200 }},
      {{ selector: '.promote-paralax__layer--4', coeff: -0.1, relative: '.promote-paralax--1', min_width: 1200 }}
    ];

    const onScroll = () => {{
      const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const windowBottom = windowScrollTop + windowHeight;
      const windowWidth = window.innerWidth;

      parallaxLayers.forEach(config => {{
        const layers = document.querySelectorAll(config.selector);
        const relativeEl = document.querySelector(config.relative);
        
        if (!relativeEl) return;

        const relativeTop = relativeEl.getBoundingClientRect().top + window.scrollY;
        const relativeBottom = relativeTop + relativeEl.offsetHeight;

        layers.forEach(layer => {{
          if (windowWidth >= config.min_width) {{
            if (windowScrollTop <= relativeBottom && relativeTop < windowBottom) {{
              const newCoord = (windowScrollTop - relativeTop) * config.coeff;
              layer.style.transform = `translate3d(0, ${{newCoord}}px, 0px)`;
              layer.style.transition = 'none';
            }}
          }} else {{
            layer.style.transform = '';
            layer.style.transition = '';
          }}
        }});
      }});
    }};

    window.addEventListener('scroll', onScroll);
    onScroll(); // initialize

    return () => {{
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    }};
  }}, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{{{ __html: `{body_html}` }}}} />
    </>
  );
}}
"""

os.makedirs("src/app/promote", exist_ok=True)
with open("src/app/promote/page.tsx", "w") as f:
    f.write(react_code)

print("Created src/app/promote/page.tsx with 100% original parallax scroll animations!")
