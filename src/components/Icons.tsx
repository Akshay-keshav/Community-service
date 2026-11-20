import type { Category } from '../categories'
export function CategoryIcon({ category, size=24 }: {category:Category;size?:number}) {
 const paths={
  education:<><path d="M3 5c4-2 7-1 9 1 2-2 5-3 9-1v14c-4-2-7-1-9 1-2-2-5-3-9-1z"/><path d="M12 6v14"/></>,
  health:<><path d="M12 21S3 15 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12Z"/><path d="M12 8v6m-3-3h6"/></>,
  agriculture:<><path d="M12 21V11M12 15C5 15 3 11 3 6c6 0 9 3 9 9Zm0-4c0-6 4-8 9-8 0 6-3 8-9 8Z"/></>,
  jobs:<><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c6 4 12 4 18 0m-9 1v4"/></>,
  business:<><path d="M4 10v11h16V10M2 10l3-7h14l3 7M2 10a3 3 0 0 0 5 2 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5-2M9 21v-6h6v6"/></>,
  housing:<><path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-7h6v7"/></>,
  food:<><path d="M3 12h18a9 9 0 0 1-18 0Zm3 9h12M8 3v4m4-5v5m4-4v4"/></>,
  pensions:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/></>,
  women:<><circle cx="9" cy="6" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4"/><circle cx="18" cy="12" r="2"/><path d="M17 21v-3a3 3 0 0 1 5 0v3"/></>,
  disability:<><circle cx="12" cy="4" r="2"/><path d="m3 8 9 2 9-2M12 10v5m0-2-5 8m5-8 5 8"/></>,
 }
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[category]}</svg>
}
export function Icon({ name, size=24 }: { name:'book'|'arrow'|'shield'|'leaf'|'check'|'search'|'external'|'close'|'filter';size?:number }) {
 const paths={
  book:<><path d="M3 5c4-2 7-1 9 1 2-2 5-3 9-1v14c-4-2-7-1-9 1-2-2-5-3-9-1z"/><path d="M12 6v14"/></>,
  arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
  shield:<><path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7z"/><path d="m8 12 3 3 5-6"/></>,
  leaf:<><path d="M20 3C7 2 2 9 6 16s16 1 14-13Z"/><path d="M3 21 15 9"/></>,
  check:<path d="m5 12 4 4L20 5"/>,
  search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  external:<><path d="M14 3h7v7m0-7L11 13"/><path d="M10 3H3v18h18v-7"/></>,
  close:<path d="m6 6 12 12M6 18 18 6"/>,
  filter:<><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="9" cy="18" r="2" fill="currentColor"/></>,
 }
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
