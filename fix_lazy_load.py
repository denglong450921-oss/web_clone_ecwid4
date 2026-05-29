with open("src/app/layout.tsx", "r") as f:
    content = f.read()

content = content.replace('.lazyloading {', '.lazyloading, .lazy-load {')

with open("src/app/layout.tsx", "w") as f:
    f.write(content)
