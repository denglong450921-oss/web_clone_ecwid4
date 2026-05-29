from bs4 import BeautifulSoup
html_file = "/Users/f/.gemini/antigravity-cli/brain/d3751b73-8292-4261-9952-b9aadcb196cc/.system_generated/steps/173/content.md"
with open(html_file, 'r') as f:
    html = f.read()
start_idx = html.find("<!DOCTYPE html>")
if start_idx != -1: html = html[start_idx:]
soup = BeautifulSoup(html, 'html.parser')

links = soup.head.find_all('link', rel='stylesheet')
for l in links:
    print(l['href'])
