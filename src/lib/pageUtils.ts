export function stripHeaderFooter(html: string): string {
  // Find content section opening: <div class="page calypso-page hpc-page no_translate">
  const contentRegex = /<div[^>]*class="[^"]*page[^"]*calypso-page[^"]*hpc-page[^"]*no_translate[^"]*"[^>]*>/;
  const contentMatch = html.match(contentRegex);
  if (!contentMatch) return html;

  const contentStart = contentMatch.index!;
  const afterContent = html.substring(contentStart);

  // Find footer section
  // Pattern 1: <div class="footer no_translate" ...> (outer wrapper in sub-pages)
  // Pattern 2: <div ... class="calypso-page footer notranslate" ...> (home page)
  let footerRegex = /<div class="footer no_translate"[^>]*>/;
  let footerMatch = afterContent.match(footerRegex);

  if (!footerMatch) {
    footerRegex = /<div[^>]*class="[^"]*calypso-page[^"]*footer[^"]*notranslate[^"]*"[^>]*>/;
    footerMatch = afterContent.match(footerRegex);
  }

  if (!footerMatch) return afterContent;

  const footerOpen = footerMatch.index! + footerMatch[0].length;

  // Count div nesting from footer opening to find its closing tag
  const afterFooterOpen = afterContent.substring(footerOpen);
  let depth = 1;
  let pos = 0;

  while (depth > 0 && pos < afterFooterOpen.length) {
    const nextOpen = afterFooterOpen.indexOf('<div', pos);
    const nextClose = afterFooterOpen.indexOf('</div>', pos);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      pos = nextClose + 6;
    }
  }

  // Content part: from content opening tag to just before footer opening
  const contentPart = afterContent.substring(0, footerMatch.index!);
  // After-footer part: everything after footer's closing </div>
  const afterFooterPart = afterFooterOpen.substring(pos);

  return contentPart + afterFooterPart;
}
