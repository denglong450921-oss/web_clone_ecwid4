from html.parser import HTMLParser
import re
import sys

class EcwidHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_page = False
        self.page_html = ""
        self.div_depth = 0
        self.page_depth = 0

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        
        # Start capturing when we hit `<div class="page calypso-page...">`
        if tag == "div" and "class" in attr_dict and "page" in attr_dict["class"] and "calypso-page" in attr_dict["class"] and not self.in_page:
            self.in_page = True
            self.page_depth = self.div_depth
        
        if tag == "div":
            self.div_depth += 1
            
        if self.in_page:
            # Convert attributes to JSX format
            jsx_attrs = []
            for k, v in attrs:
                if k == "class":
                    k = "className"
                elif k == "for":
                    k = "htmlFor"
                elif "-" in k and not k.startswith("data-") and not k.startswith("aria-"):
                    # convert kebab-case to camelCase
                    parts = k.split("-")
                    k = parts[0] + "".join(p.capitalize() for p in parts[1:])
                elif k == "style":
                    # skip inline styles or convert them (too hard in basic parser, just strip for now unless simple)
                    continue
                
                if v is None:
                    jsx_attrs.append(k)
                else:
                    # escape quotes in v if necessary
                    val = v.replace('"', '&quot;')
                    jsx_attrs.append(f'{k}="{val}"')
            
            attr_str = " ".join(jsx_attrs)
            if attr_str:
                self.page_html += f"<{tag} {attr_str}>"
            else:
                self.page_html += f"<{tag}>"

    def handle_endtag(self, tag):
        if tag == "div":
            self.div_depth -= 1
            
        if self.in_page:
            self.page_html += f"</{tag}>"
            
        if self.in_page and tag == "div" and self.div_depth == self.page_depth:
            self.in_page = False

    def handle_data(self, data):
        if self.in_page:
            # Escape { and } in data
            data = data.replace("{", "&#123;").replace("}", "&#125;")
            self.page_html += data
            
    def handle_entityref(self, name):
        if self.in_page:
            self.page_html += f"&{name};"
            
    def handle_charref(self, name):
        if self.in_page:
            self.page_html += f"&#{name};"

with open("sell_raw.html", "r", encoding="utf-8") as f:
    html = f.read()
    
# Pre-processing to close empty tags for JSX
html = re.sub(r'<img([^>]+)>', r'<img\1 />', html)
html = re.sub(r'<br([^>]*)>', r'<br\1 />', html)
html = re.sub(r'<hr([^>]*)>', r'<hr\1 />', html)
html = re.sub(r'<input([^>]+)>', r'<input\1 />', html)
html = re.sub(r'<source([^>]+)>', r'<source\1 />', html)

parser = EcwidHTMLParser()
parser.feed(html)

# Add padding-top: 90px to the first div just like we did for promote
page_html = parser.page_html
page_html = page_html.replace('className="page calypso-page', 'style={{paddingTop: "90px"}} className="page calypso-page', 1)

jsx_template = f"""import React from 'react';
import Link from 'next/link';
import MenuFixer from '../../MenuFixer';

export default function SellPage() {{
  return (
    <>
      <MenuFixer />
      {{/* Header/Menu component would normally go here, assuming it's in layout */}}
      {page_html}
    </>
  );
}}
"""

# Fix common JSX errors (like closing tags, unescaped entities)
jsx_template = jsx_template.replace('className="lazy-load promote-paralax__layer', 'className="promote-paralax__layer')
jsx_template = jsx_template.replace('className="lazy-load', 'className="')

with open("src/app/sell.tsx", "w", encoding="utf-8") as f:
    f.write(jsx_template)
    
print("Successfully parsed HTML to JSX.")
