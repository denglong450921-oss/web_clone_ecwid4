import os
import re
from bs4 import BeautifulSoup

html_file = "src/app/register_raw.html"
with open(html_file, "r") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Remove scripts, noscripts, iframes
for tag in soup(["script", "noscript", "iframe"]):
    tag.extract()

head_css = ""
for link in soup.find_all('link', rel='stylesheet'):
    head_css += str(link) + "\n"
for style in soup.find_all('style'):
    head_css += str(style) + "\n"

body = soup.find("body")

body_html = ""
if body:
    body_html = "".join([str(c) for c in body.contents])
    
react_code = f"""
"use client";
import Head from 'next/head';

export default function RegisterPage() {{
  return (
    <>
      <Head>
        <title>Control Panel</title>
      </Head>
      <div dangerouslySetInnerHTML={{{{ __html: `{head_css}` }}}} />
      <div dangerouslySetInnerHTML={{{{ __html: `{body_html}` }}}} />
    </>
  );
}}
"""

os.makedirs("src/app/register", exist_ok=True)
with open("src/app/register/page.tsx", "w") as f:
    f.write(react_code)

print("Created src/app/register/page.tsx with CSS included!")
