with open("src/app/layout.tsx", "r") as f:
    content = f.read()

override_css = """
          /* Override animations that are stuck because JS is disabled */
          .hpc-animate { opacity: 1 !important; transform: none !important; visibility: visible !important; }
          .hpc-slider__layer { opacity: 1 !important; transform: none !important; visibility: visible !important; }
"""
content = content.replace('/* Inline styles from head */', '/* Inline styles from head */' + override_css)

with open("src/app/layout.tsx", "w") as f:
    f.write(content)
with open("src/app/layout.tsx", "r") as f:
    content = f.read()

override_css2 = """
          .lazyload, .lazyloading { opacity: 1 !important; transform: none !important; visibility: visible !important; }
"""
content = content.replace('/* Inline styles from head */', '/* Inline styles from head */' + override_css2)

with open("src/app/layout.tsx", "w") as f:
    f.write(content)
