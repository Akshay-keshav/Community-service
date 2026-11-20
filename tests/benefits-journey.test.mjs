import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,readdirSync} from 'node:fs'
import {JSDOM} from 'jsdom'
import {catalog} from '../src/catalog.ts'
import {officialAction} from '../src/matching.ts'

// DOM interactions at phone/laptop viewport dimensions. JSDOM does not render layout.
for(const width of [390,1366])test(`benefits DOM journey at ${width}px: category relevance, offline/unknown results, bilingual filters and direct links`,async()=>{
 const dom=new JSDOM('<!doctype html><html lang="en"><body><div id="root"></div></body></html>',{url:'http://localhost:5173',runScripts:'outside-only',pretendToBeVisual:true})
 const w=dom.window,d=w.document
 Object.defineProperty(w,'innerWidth',{value:width});Object.defineProperty(w,'innerHeight',{value:width===390?844:768})
 const NativeDate=w.Date
 w.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:['2026-11-15T12:00:00+05:30']))}static now(){return new NativeDate('2026-11-15T12:00:00+05:30').getTime()}}
 w.scrollTo=()=>{}
 const bundle=readdirSync(new URL('../dist/assets/',import.meta.url)).find(f=>f.endsWith('.js'))
 w.eval(readFileSync(new URL('../dist/assets/'+bundle,import.meta.url),'utf8'))
 const settle=()=>new Promise(r=>setTimeout(r,30))
 const click=async(label)=>{const el=[...d.querySelectorAll('button')].find(b=>b.textContent.includes(label));assert.ok(el,label);el.click();await settle()}
 const change=async(el,value)=>{assert.ok(el);Object.getOwnPropertyDescriptor(el instanceof w.HTMLSelectElement?w.HTMLSelectElement.prototype:w.HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new w.Event(el instanceof w.HTMLSelectElement?'change':'input',{bubbles:true}));await settle()}
 const choose=async(id,value)=>{const el=d.querySelector(`input[name="${id}"][value="${value}"]`);assert.ok(el,id);el.click();await settle()}
 const toggleCategory=async(text)=>{const label=[...d.querySelectorAll('.category-choices label')].find(l=>l.textContent===text);assert.ok(label);label.querySelector('input').click();await settle()}
 const card=id=>{const c=d.querySelector(`[data-scheme-id="${id}"]`);assert.ok(c,id);return c}
 const checkDirect=async(id,label)=>{
  const c=card(id),a=c.querySelector('a.official-action'),expected=officialAction(catalog.find(s=>s.id===id),'2026-11-15')
  assert.equal(a.href,expected.url);assert.equal(a.target,'_blank');assert.match(a.rel,/noopener/);assert.ok(a.textContent.includes(label))
  let destination;const heading=d.querySelector('h1').textContent
  a.addEventListener('click',e=>{e.preventDefault();destination=a.href},{once:true});a.click();await settle()
  assert.equal(destination,expected.url);assert.equal(d.querySelector('h1').textContent,heading,'official action does not gate through details or questionnaire')
 }
 try{
  await settle();await click('Browse Schemes')
  assert.equal(d.querySelectorAll('.scheme-card').length,20)
  for(const s of catalog){const a=card(s.id).querySelector('a.official-action');assert.equal(a.href,officialAction(s,'2026-11-15').url)}
  await checkDirect('pg','Apply on the official website')
  await checkDirect('labour-scholarship','Open official registration portal')
  assert.match(card('labour-scholarship').textContent,/Applications closed/)
  await checkDirect('jssk','See official application instructions')
  assert.match(card('jssk').textContent,/Offline route/)
  await checkDirect('ayushman70','Open official registration portal')
  assert.match(card('ayushman70').textContent,/No fixed application deadline/)
  assert.equal(card('ayushman70').querySelector('a.official-action').href,'https://beneficiary.nha.gov.in/')
  assert.equal(card('ayushman70').querySelector('a.official-instructions').href,'https://nha.gov.in/img/resources/English_FAQs_related_to_the_benefits_for_senior_citizens.pdf')
  await checkDirect('pmkisan','Open official registration portal')
  assert.equal(card('pmkisan').querySelector('a.official-action').href,'https://www.pmkisan.gov.in/RegistrationFormupdated.aspx')
  assert.doesNotMatch(card('ayushman70').textContent,/Application window unconfirmed/)
  assert.match(card('ncs').textContent,/No application deadline listed/)
  assert.match(card('pmmvy').textContent,/deadline depends on your situation/)
  assert.match(card('csss').textContent,/Application window unconfirmed/)
  await change(d.querySelector('.mobile-browse-controls select'),'health')
  await click('Filters');assert.equal(d.querySelector('[aria-controls="browse-sidebar"]').getAttribute('aria-expanded'),'true')
  await change(d.querySelectorAll('.filter-fields select')[0],'UP')
  await change(d.querySelectorAll('.filter-fields select')[2],'offline')
  await change(d.querySelector('input[type="search"]'),'जननी')
  assert.equal(d.querySelectorAll('.scheme-card').length,1)
  await click('English')
  assert.equal(d.documentElement.lang,'hi');assert.equal(d.querySelector('input[type="search"]').value,'जननी')
  assert.equal(d.querySelector('.mobile-browse-controls select').value,'health')
  assert.equal(d.querySelectorAll('.filter-fields select')[0].value,'UP')
  assert.equal(d.querySelectorAll('.filter-fields select')[2].value,'offline')
  assert.equal(d.querySelectorAll('.scheme-card').length,1)
  await checkDirect('jssk','आधिकारिक आवेदन निर्देश देखें')
  await click('English');await click('Clear filters')
  await change(d.querySelectorAll('.filter-fields select')[1],'state')
  assert.equal(d.querySelectorAll('.scheme-card').length,0);assert.match(d.body.textContent,/No state-government schemes have been verified/)
  await click('Clear filters');await click('Find Schemes for Me')
  await toggleCategory('Education & Scholarships');await toggleCategory('Health')
  assert.equal(d.querySelector('input[name="level"]'),null,'no scholarship questions in a health-only check')
  await change(d.getElementById('currentAge'),'70');await change(d.getElementById('profile-state'),'UP')
  await click('Continue');await choose('jsskCare','yes')
  assert.equal(d.getElementById('income'),null)
  await click('English');assert.ok(d.querySelector('input[name="jsskCare"][value="yes"]').checked)
  await click('मेरे परिणाम देखें')
  assert.equal(d.querySelectorAll('.scheme-card').length,3)
  assert.match(card('jssk').textContent,/संभावित रूप से पात्र/)
  assert.match(card('ayushman70').textContent,/संभावित रूप से पात्र/)
  assert.match(card('ayushman70').textContent,/आवेदन की कोई निश्चित समय सीमा नहीं/)
  assert.doesNotMatch(card('ayushman70').textContent,/आवेदन अवधि की पुष्टि नहीं हुई/)
  assert.match(card('pmmvy').textContent,/और जानकारी चाहिए/)
  await checkDirect('jssk','आधिकारिक आवेदन निर्देश देखें')
  await checkDirect('ayushman70','आधिकारिक पंजीकरण पोर्टल खोलें')
  await click('English');await checkDirect('ayushman70','Open official registration portal')
  await click('Edit my answers');assert.equal(d.getElementById('currentAge').value,'70')
  await change(d.getElementById('currentAge'),'69');await click('Continue');await click('See my results')
  assert.match(card('ayushman70').textContent,/Doesn't match your answers/)
  await click('Edit my answers');d.getElementById('currentAge').parentElement.querySelector('.unknown-choice input').click();await settle()
  await click('Continue');await click('See my results');assert.match(card('ayushman70').textContent,/More information needed/)
  await click('Start a new check');assert.equal(d.querySelectorAll('.question-form input:checked').length,0)
  assert.deepEqual(Object.keys(w.localStorage),['sahaay-language'])
  await toggleCategory('Education & Scholarships');await toggleCategory('Agriculture')
  await choose('farmerLand','yes');await choose('kisanExcluded','no');await click('See my results')
  await checkDirect('pmkisan','Open official registration portal')
  assert.equal(card('pmkisan').querySelector('a.official-action').href,'https://www.pmkisan.gov.in/RegistrationFormupdated.aspx')
  assert.ok(card('pmkisan').querySelector('a.official-instructions'))
  await click('English');await checkDirect('pmkisan','आधिकारिक पंजीकरण पोर्टल खोलें')
 }finally{dom.window.close()}
})
