export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function matchesQuery(target: string, query: string): boolean {
  if (!query) return true;
  return normalizeSearchText(target).includes(normalizeSearchText(query));
}
