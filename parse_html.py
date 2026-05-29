import re
from bs4 import BeautifulSoup

html_file = "/Users/f/.gemini/antigravity-cli/brain/d3751b73-8292-4261-9952-b9aadcb196cc/.system_generated/steps/173/content.md"
with open(html_file, 'r') as f:
    html = f.read()

# The html is inside the markdown after the frontmatter. Let's extract everything after <!DOCTYPE html>
start_idx = html.find("<!DOCTYPE html>")
if start_idx != -1:
    html = html[start_idx:]

soup = BeautifulSoup(html, 'html.parser')

body = soup.find('body')

# Remove noscript
for noscript in body.find_all('noscript'):
    noscript.decompose()

# Remove script
for script in body.find_all('script'):
    script.decompose()

# Get inner HTML of body
body_html = "".join([str(x) for x in body.contents])

# Quick HTML to JSX
body_html = body_html.replace('class=', 'className=')
body_html = body_html.replace('for=', 'htmlFor=')
body_html = body_html.replace(' tabindex=', ' tabIndex=')
body_html = body_html.replace(' viewBox=', ' viewBox=')
body_html = body_html.replace(' stroke-width=', ' strokeWidth=')
body_html = body_html.replace(' stroke-linecap=', ' strokeLinecap=')
body_html = body_html.replace(' stroke-linejoin=', ' strokeLinejoin=')
body_html = body_html.replace(' fill-rule=', ' fillRule=')
body_html = body_html.replace(' clip-rule=', ' clipRule=')
body_html = body_html.replace(' stop-color=', ' stopColor=')

# Self close img, br, hr, input, link, meta
body_html = re.sub(r'<(img|br|hr|input|link|meta)([^>]*?)(?<!/)>', r'<\1\2 />', body_html)

# We can also just use dangerouslySetInnerHTML to avoid React escaping issues.
react_code = f"""
export default function Page() {{
  return (
    <div dangerouslySetInnerHTML={{{{ __html: `{body_html.replace('`', '\\`').replace('$', '\\$')}` }}}} />
  )
}}
"""

with open("src/app/page.tsx", "w") as f:
    f.write(react_code)

print("Created 1:1 page.tsx")
