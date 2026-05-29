import os
import re
from bs4 import BeautifulSoup

html_file = "src/app/promote_raw.html"
with open(html_file, "r") as f:
    html = f.read()

# Fix lazy images (can be quoted or unquoted)
# Matches data-src="..." or data-src=...
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
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          entry.target.classList.add('hpc-animate--animated', 'animate--animated', 'hpc-slider__slide--animated', 'promote-hero--animated', 'promote-paralax--animated');
          observer.unobserve(entry.target);
        }}
      }});
    }}, {{ threshold: 0.1 }});

    const elements = document.querySelectorAll('.hpc-animate, .animate, .hpc-slider__slide, .hpc-pics__bg, .hpc-slider__layer, .promote-hero, .promote-paralax, .promote-paralax__layer');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }}, []);

  return (
    <div dangerouslySetInnerHTML={{{{ __html: `{body_html}` }}}} />
  );
}}
"""

os.makedirs("src/app/promote", exist_ok=True)
with open("src/app/promote/page.tsx", "w") as f:
    f.write(react_code)

print("Created src/app/promote/page.tsx with fixed unquoted src")
