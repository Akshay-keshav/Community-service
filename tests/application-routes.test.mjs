import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {JSDOM} from 'jsdom'
import {catalog} from '../src/catalog.ts'
import {applicationRoutes} from '../src/applicationRoutes.ts'
import {officialAction} from '../src/matching.ts'

// Audited destination contract: tests must not silently accept a PDF/FAQ replacing a portal.
const nsp='https://scholarships.gov.in/ApplicationForm/'
const expected={
 csss:[nsp],ishan:[nsp],pg:[nsp],pragati:[nsp],saksham:[nsp],'labour-scholarship':[nsp],
 ayushman70:['https://beneficiary.nha.gov.in/'],
 pmkisan:['https://www.pmkisan.gov.in/RegistrationFormupdated.aspx'],
 pmsym:['https://maandhan.in/'],pmegp:['https://pmegp.msme.gov.in/Home/HomePage'],
 pmuy:['https://my.ebharatgas.com/bharatgas/LPGServices/ApplyUjjwala2Connection','https://cx.indianoil.in/webcenter/portal/Customer/pages_landingpage','https://myhpgas.in/myHPGas/NewConsumerRegistration.aspx'],
 pmayurban:['https://pmaymis.gov.in/PMAYMIS2_2024/PMAY_SURVEY/EligiblityCheck.aspx'],
 nfsa:['https://nfsa.gov.in/portal/apply'],pmmvy:['https://pmmvy.wcd.gov.in/'],
 udid:['https://swavlambancard.gov.in/Applyforudid'],
 pmjjby:['https://www.jansuraksha.in/login'],pmsby:['https://www.jansuraksha.in/login'],
 jssk:['https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=842&lid=308'],
 mudra:['https://www.jansamarth.in/home'],ncs:['https://ncs.gov.in/'],
}
test('every public scheme has an audited route; an uncertain or closed window cannot replace a verified portal with a document',()=>{
 assert.deepEqual(Object.keys(applicationRoutes).sort(),catalog.map(s=>s.id).sort())
 for(const s of catalog){
  const route=s.applicationRoute
  assert.ok(route);assert.equal(route.checked,'2026-11-15');assert.ok(route.source)
  assert.ok(route.note.en);assert.ok(route.note.hi)
  assert.ok(s.sources.some(source=>source.url===route.source),'route evidence is visible in scheme details')
  assert.equal(officialAction(s,'2026-11-15').url,expected[s.id][0])
  if(route.kind!=='offline')assert.doesNotMatch(route.url,/\.pdf(?:[?#]|$)|PmayFAQ|PressRelease|PressNoteDetails/i)
  for(const provider of route.providers??[]){assert.ok(provider.name.en);assert.ok(provider.name.hi);assert.match(provider.url,/^https:\/\//)}
 }
 assert.equal(catalog.filter(s=>s.applicationRoute.kind==='offline').length,1)
 assert.equal(catalog.find(s=>s.id==='jssk').applicationRoute.kind,'offline')
 assert.equal(catalog.find(s=>s.id==='nfsa').applicationRoute.kind,'directory')
 for(const id of ['mudra','pmjjby','pmsby'])assert.equal(catalog.find(s=>s.id===id).mode,'mixed')
 for(const id of ['csss','labour-scholarship','ishan']){
  const s=catalog.find(s=>s.id===id)
  assert.equal(officialAction(s,'2026-12-01').url,nsp)
  assert.equal(officialAction(s,'2026-12-01').label,'portal')
 }
})

for(const width of [390,1366])test(`all 20 audited routes from Browse, Results and details in both languages at ${width}px (DOM)`,async()=>{
 const dom=new JSDOM('<!doctype html><html lang="en"><body><div id="root"></div></body></html>',{url:'http://localhost:5173',runScripts:'outside-only',pretendToBeVisual:true})
 const w=dom.window,d=w.document
 Object.defineProperty(w,'innerWidth',{value:width});Object.defineProperty(w,'innerHeight',{value:width===390?844:768})
 const NativeDate=w.Date
 w.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:['2026-11-15T12:00:00+05:30']))}static now(){return new NativeDate('2026-11-15T12:00:00+05:30').getTime()}}
 w.scrollTo=()=>{}
 const bundle=readdirSync(new URL('../dist/assets/',import.meta.url)).find(f=>f.endsWith('.js'))
 w.eval(readFileSync(new URL('../dist/assets/'+bundle,import.meta.url),'utf8'))
 const settle=()=>new Promise(resolve=>setTimeout(resolve,15))
 const click=async(label)=>{const button=[...d.querySelectorAll('button')].find(b=>b.textContent.includes(label));assert.ok(button,label);button.click();await settle()}
 async function checkAnchors(container,id){
  const links=[...container.querySelectorAll('a.official-action')]
  assert.deepEqual(links.map(a=>a.href),expected[id],id)
  for(const link of links){
   assert.equal(link.target,'_blank');assert.match(link.rel,/noopener/)
   let destination;const heading=d.querySelector('h1').textContent
   link.addEventListener('click',e=>{e.preventDefault();destination=link.href},{once:true});link.click();await settle()
   assert.equal(destination,link.href);assert.equal(d.querySelector('h1').textContent,heading,'no details/questionnaire gate')
  }
 }
 async function checkListing(withDetails){
  assert.equal(d.querySelectorAll('.scheme-card').length,20)
  for(const s of catalog){
   const card=d.querySelector(`[data-scheme-id="${s.id}"]`);assert.ok(card)
   await checkAnchors(card,s.id)
   if(withDetails){
    card.querySelector('.card-link').click();await settle()
    await checkAnchors(d.querySelector('.application-panel'),s.id)
    d.querySelector('.back-link').click();await settle()
   }
  }
 }
 try{
  await settle();await click('Browse Schemes');await checkListing(true)
  const closed=d.querySelector('[data-scheme-id="labour-scholarship"]')
  assert.match(closed.textContent,/Applications closed/);assert.doesNotMatch(closed.querySelector('a.official-action').textContent,/^Apply on/)
  assert.match(d.querySelector('[data-scheme-id="nfsa"] a.official-action').textContent,/Find your State\/UT application portal/)
  await click('English');await checkListing(true)
  assert.match(d.querySelector('[data-scheme-id="nfsa"] a.official-action').textContent,/अपने राज्य/)
  await click('English');await click('Find Schemes for Me');await click('Select all categories')
  await click('Continue');await click('See my results');await checkListing(true)
  await click('English');await checkListing(true)
  assert.equal(w.localStorage.length,1)
 }finally{dom.window.close()}
})
