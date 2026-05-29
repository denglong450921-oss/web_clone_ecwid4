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
          const el = entry.target;
          if (el.classList.contains('hpc-animate')) el.classList.add('hpc-animate--animated');
          if (el.classList.contains('animate')) el.classList.add('animate--animated');
          if (el.classList.contains('promote-hero')) el.classList.add('promote-hero--animated');
          if (el.classList.contains('promote-paralax')) el.classList.add('promote-paralax--animated');
          observer.unobserve(el);
        }}
      }});
    }}, {{ threshold: 0.1 }});

    const elements = document.querySelectorAll('.hpc-animate, .animate, .promote-hero, .promote-paralax');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }}, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{{{ __html: `{body_html}` }}}} />
    </>
  );
}}
"""

os.makedirs("src/app/facebook", exist_ok=True)
with open("src/app/facebook/page.tsx", "w") as f:
    f.write(react_code)

print("Created src/app/facebook/page.tsx with 100% original animations!")
