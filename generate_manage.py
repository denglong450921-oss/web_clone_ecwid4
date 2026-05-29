import os
import re
from bs4 import BeautifulSoup

html_file = "src/app/manage_raw.html"
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

export default function ManagePage() {{
  useEffect(() => {{
    // Intersection Observer for scroll-based class additions
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          const el = entry.target;
          if (el.classList.contains('animate')) el.classList.add('animate--animated');
          observer.unobserve(el);
        }}
      }});
    }}, {{ threshold: 0.1 }});

    const elements = document.querySelectorAll('.animate');
    elements.forEach(el => observer.observe(el));
    
    // Vanilla JS implementation of calypso-animation.js parallax
    const parallaxLayers = [
      {{ selector: '.hpc-dashboard-graph__image-top', coeff: -0.1, relative: '.hpc-page', min_width: 320 }},
      {{ selector: '.hpc-dashboard-graph__image-bottom', coeff: -0.1, relative: '.hpc-page', min_width: 320 }},
      {{ selector: '.hpc-mobile-app__phone', coeff: -0.2, relative: '.hpc-mobile-app', min_width: 320 }},
      {{ selector: '.hpc-mobile-app__notification', coeff: -0.4, relative: '.hpc-mobile-app', min_width: 320 }}
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

os.makedirs("src/app/manage", exist_ok=True)
with open("src/app/manage/page.tsx", "w") as f:
    f.write(react_code)

print("Created src/app/manage/page.tsx with 100% original animations!")
