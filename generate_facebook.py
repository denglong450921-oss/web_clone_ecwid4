import os
import re
from bs4 import BeautifulSoup

html_file = "src/app/facebook_raw.html"
with open(html_file, "r") as f:
    html = f.read()

# Fix lazy images
html = re.sub(r'data-src="?([^" >]+)"?', r'src="\1"', html)
html = re.sub(r'data-lazy="?([^" >]+)"?', r'src="\1"', html)

soup = BeautifulSoup(html, "html.parser")

# Remove scripts, noscripts, iframes
for tag in soup(["script", "noscript", "iframe"]):
    tag.extract()

# Add safe, custom bounce animations to all text
for tag_name in ['h1', 'h2', 'h3', 'p', 'li', 'a']:
    for el in soup.find_all(tag_name):
        classes = el.get('class', [])
        classes.append('my-bouncy-text')
        el['class'] = classes

for img in soup.find_all('img'):
    classes = img.get('class', [])
    if 'promote-paralax__layer' not in classes:
        classes.append('my-bouncy-text')
        img['class'] = classes

body = soup.find("body")

body_html = ""
if body:
    body_html = "".join([str(c) for c in body.contents])
    
react_code = f"""
"use client";
import {{ useEffect }} from 'react';

export default function FacebookPage() {{
  useEffect(() => {{
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }}
      }});
    }}, {{ threshold: 0.1 }});

    const elements = document.querySelectorAll('.my-bouncy-text, .promote-paralax, .hpc-animate, .animate, .hpc-slider__slide, .hpc-pics__bg, .hpc-slider__layer, .promote-hero, .promote-paralax__layer');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }}, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{{{__html: `
        .my-bouncy-text {{
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }}
        .my-bouncy-text.is-visible {{
            opacity: 1;
            transform: translateY(0);
        }}
      `}}}} />
      <div dangerouslySetInnerHTML={{{{ __html: `{body_html}` }}}} />
    </>
  );
}}
"""

os.makedirs("src/app/facebook", exist_ok=True)
with open("src/app/facebook/page.tsx", "w") as f:
    f.write(react_code)

print("Created src/app/facebook/page.tsx with CUSTOM bouncy animations!")
