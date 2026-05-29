with open("src/app/layout.tsx", "r") as f:
    content = f.read()

content = content.replace('<body>', '<body id="p-32564" className="index-EW19">')

with open("src/app/layout.tsx", "w") as f:
    f.write(content)
