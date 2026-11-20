import { catalog, type Scheme, type ApplicationStatus } from './catalog.ts'
import { categories, type Category } from './categories.ts'
import { applicationStatus } from './matching.ts'
export type Filters = {category:Category|'all';state:string;coverage:'all'|'central'|'state';status:ApplicationStatus|'all';search:string}
export const emptyFilters:Filters={category:'all',state:'all',coverage:'all',status:'all',search:''}
const normalize=(s:string)=>s.normalize('NFKC').toLocaleLowerCase().replace(/[-–—_]/g,' ').replace(/\s+/g,' ').trim()
export function searchMatches(s:Scheme,query:string) {
 const text=normalize([s.name,s.title.en,s.title.hi,s.short,...s.aliases,s.summary.en,s.summary.hi,...s.categories.flatMap(id=>{const cat=categories.find(c=>c.id===id)!;return [cat.name.en,cat.name.hi]})].join(' '))
 return normalize(query).split(' ').every(token=>text.includes(token))
}
export function filterCatalog(filters:Filters,schemes=catalog,date?:string) {
 return schemes.filter(s=>s.verified&&(filters.category==='all'||s.categories.includes(filters.category))&&(filters.state==='all'||!s.states||s.states.includes(filters.state))&&(filters.coverage==='all'||s.coverage===filters.coverage)&&(filters.status==='all'||applicationStatus(s,date)===filters.status)&&searchMatches(s,filters.search))
}
export const categoryCounts=()=>Object.fromEntries(categories.map(c=>[c.id,catalog.filter(s=>s.categories.includes(c.id)).length]))
