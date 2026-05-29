import os
import re
import glob

# Find all page.tsx files
page_files = glob.glob('src/app/**/page.tsx', recursive=True)

# Define regex replacements
replacements = [
    (r'href="https://www\.ecwid\.com/zh-CN/promote/?(\#.*?|)"', r'href="/promote\1"'),
    (r'href="/zh-CN/promote/?(\#.*?|)"', r'href="/promote\1"'),
    (r'href="https://www\.ecwid\.com/zh-CN/facebook/?(\#.*?|)"', r'href="/facebook\1"'),
    (r'href="/zh-CN/facebook/?(\#.*?|)"', r'href="/facebook\1"'),
    (r'href="https://www\.ecwid\.com/zh-CN/manage/?(\#.*?|)"', r'href="/manage\1"'),
    (r'href="/zh-CN/manage/?(\#.*?|)"', r'href="/manage\1"'),
    (r'href="https://my\.ecwid\.com/cp/[^"]*?\#register"', r'href="/register"'),
    (r'href="https://my\.ecwid\.com/cp/?(\#.*?|)"', r'href="/register"'),
    (r'href="https://www\.ecwid\.com/zh-CN/?(\#.*?|)"', r'href="/\1"'),
    (r'href="/zh-CN/?(\#.*?|)"', r'href="/\1"'),
    
    # Handle single quotes as well just in case
    (r"href='https://www\.ecwid\.com/zh-CN/promote/?(\#.*?|)'", r"href='/promote\1'"),
    (r"href='/zh-CN/promote/?(\#.*?|)'", r"href='/promote\1'"),
    (r"href='https://www\.ecwid\.com/zh-CN/facebook/?(\#.*?|)'", r"href='/facebook\1'"),
    (r"href='/zh-CN/facebook/?(\#.*?|)'", r"href='/facebook\1'"),
    (r"href='https://www\.ecwid\.com/zh-CN/manage/?(\#.*?|)'", r"href='/manage\1'"),
    (r"href='/zh-CN/manage/?(\#.*?|)'", r"href='/manage\1'"),
    (r"href='https://my\.ecwid\.com/cp/[^']*?\#register'", r"href='/register'"),
    (r"href='https://my\.ecwid\.com/cp/?(\#.*?|)'", r"href='/register'"),
    (r"href='https://www\.ecwid\.com/zh-CN/?(\#.*?|)'", r"href='/\1'"),
    (r"href='/zh-CN/?(\#.*?|)'", r"href='/\1'"),
]

for file_path in page_files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    original_content = content
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated links in {file_path}")
    else:
        print(f"No changes in {file_path}")
