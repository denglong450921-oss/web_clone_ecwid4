import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

content = re.sub(r'data-src="([^"]+)"', r'src="\1"', content)
content = re.sub(r'data-lazy="([^"]+)"', r'src="\1"', content)

with open("src/app/page.tsx", "w") as f:
    f.write(content)

