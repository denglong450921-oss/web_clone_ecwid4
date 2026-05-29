with open("src/app/page.tsx", "r") as f:
    content = f.read()

content = content.replace('className=', 'class=')
content = content.replace('htmlFor=', 'for=')

with open("src/app/page.tsx", "w") as f:
    f.write(content)
