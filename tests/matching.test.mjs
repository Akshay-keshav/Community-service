import test from 'node:test'
import assert from 'node:assert/strict'
import { catalog } from '../src/catalog.ts'
import { match, passes, applicationOpen, applicationStatus, applicationNotice, officialAction } from '../src/matching.ts'
import { relevantQuestions, questions } from '../src/questions.ts'
import { categories, states } from '../src/categories.ts'
import { emptyFilters, filterCatalog, searchMatches } from '../src/catalogTools.ts'
import { ui } from '../src/i18n.ts'
const byId=id=>catalog.find(s=>s.id===id)
export const profiles = {
 csss:{level:'ug',regular:'yes',institution:'yes',income:'450000',percentile:'yes',gap:'no',other:'no'},
 ishan:{level:'ug',first:'yes',regular:'yes',institution:'yes',income:'449999',ner:'yes',management:'no'},
 pg:{level:'pg',first:'yes',regular:'yes',institution:'yes',age:'29',indian:'yes'},
 pragati:{level:'ug',technical:'yes',woman:'yes',pragatiFamily:'yes',income:'800000',qualifyingGap:'2',paidSupport:'no'},
 saksham:{level:'lateral',technical:'yes',disabilityPercent:'40',income:'800000',qualifyingGap:'2',paidSupport:'no'},
 'labour-scholarship':{level:'postmatric',labourParent:'yes',income:'252000',labourStudy:'yes'},
 ayushman70:{currentAge:'70'},pmkisan:{farmerLand:'yes',kisanExcluded:'no'},
 pmsym:{currentAge:'40',citizen:'yes',unorganised:'yes',monthlyIncome:'15000',pensionExcluded:'no'},
 pmegp:{currentAge:'19',newUnit:'yes',pmegpEducation:'yes',pmegpFamily:'yes'},
 pmuy:{currentAge:'18',woman:'yes',ujjwalaPoor:'yes',existingLpg:'no'},
 pmayurban:{urban:'yes',income:'900000',puccaHouse:'no',housingBenefit:'no'},nfsa:{nfsaListed:'yes'},
 pmmvy:{state:'UP',maternityAge:'yes',maternityChild:'yes',maternityCategory:'yes',maternityExcluded:'no',maternityTiming:'yes'},
 udid:{citizen:'yes',recognizedDisability:'yes'},pmjjby:{currentAge:'50',bankConsent:'yes'},pmsby:{currentAge:'70',bankConsent:'yes'},jssk:{jsskCare:'yes'},mudra:{mudraActivity:'yes'},ncs:{jobseeker:'yes'},
}
for(const s of catalog){
 test(`${s.id}: passing, unknown, missing and known-failure profiles`,()=>{
  const a=profiles[s.id];assert.ok(a,`explicit profile for ${s.id}`)
  assert.equal(match(s,a).status,'likely')
  const r=s.rules[0]
  assert.equal(match(s,{...a,[r.field]:'unknown'}).status,'missing')
  assert.equal(match(s,{...a,[r.field]:''}).status,'missing')
  const bad=r.op==='eq'?(r.value==='no'?'yes':'no'):r.op==='in'?'invalid':r.op==='lt'||r.op==='lte'?String(Number(r.value)+1):String(Math.max(0,Number(r.value)-1))
  assert.equal(match(s,{...a,[r.field]:bad}).status,'fail')
 })
 test(`${s.id}: official evidence, full bilingual copy, rule questions and verified action`,()=>{
  assert.ok(s.verified);assert.equal(s.eligibilityChecked,'2026-11-15');assert.equal(s.window.checked,'2026-11-15')
  assert.ok(s.categories.length);s.categories.forEach(id=>assert.ok(categories.some(c=>c.id===id)))
  const qs=relevantQuestions(profiles[s.id],s.categories)
  s.rules.forEach(r=>assert.ok(qs.some(q=>q.id===r.field),r.field))
  const copies=[s.title,s.summary,s.authority,s.note,s.window.evidence,...s.documents,...s.steps,...s.rules.map(r=>r.text),...s.sources.map(s=>s.title)]
  copies.forEach(x=>{assert.ok(x.en);assert.ok(x.hi)})
  assert.ok(s.documents.length);assert.ok(s.steps.length);assert.ok(s.sources.length)
  for(const url of [s.infoUrl,s.applicationUrl,s.instructionsUrl,s.window.source,...s.sources.map(s=>s.url)])assert.ok(/(?:\.gov\.in|\.nic\.in)$/.test(new URL(url).hostname)||['sansad.in','maandhan.in','www.jansamarth.in','jansuraksha.in','www.jansuraksha.in','cx.indianoil.in','my.ebharatgas.com','myhpgas.in','www.canarabank.bank.in'].includes(new URL(url).hostname),url)
  assert.ok(['online','offline','mixed'].includes(s.mode))
  const action=officialAction(s,'2026-11-15')
  assert.equal(action.label,applicationOpen(s,'2026-11-15')?'apply':s.applicationRoute.kind==='directory'?'directory':s.portalVerification?'portal':'instructions')
  if(s.portalVerification){assert.equal(s.portalVerification.checked,'2026-11-15');assert.ok(s.portalVerification.source)}
 })
}
test('original exact boundaries are preserved',()=>{
 assert.equal(match(byId('csss'),profiles.csss).status,'likely')
 assert.equal(match(byId('ishan'),{...profiles.ishan,income:'450000'}).status,'fail')
 assert.equal(match(byId('pg'),{...profiles.pg,age:'30'}).status,'fail')
 assert.equal(match(byId('csss'),{...profiles.csss,income:'unknown',regular:'no'}).status,'fail')
})
test('new verified boundary rules and exclusion precedence',()=>{
 assert.equal(match(byId('pmsym'),{...profiles.pmsym,monthlyIncome:'15001'}).status,'fail')
 assert.equal(match(byId('pmsym'),{...profiles.pmsym,currentAge:'41'}).status,'fail')
 assert.equal(match(byId('pmegp'),{...profiles.pmegp,currentAge:'18'}).status,'fail')
 assert.equal(match(byId('saksham'),{...profiles.saksham,disabilityPercent:'39'}).status,'fail')
 assert.equal(match(byId('pmmvy'),{...profiles.pmmvy,state:'TS'}).status,'fail')
 assert.equal(match(byId('pmuy'),{...profiles.pmuy,existingLpg:'yes',currentAge:'unknown'}).status,'fail')
 for(const val of ['-1','Infinity','29.5','abc',' '])assert.equal(passes(byId('pg').rules.find(r=>r.field==='age'),val),false)
})
test('windows are separate from matches, date bounded, and portal access remains independent of closed/unknown windows',()=>{
 assert.equal(applicationOpen(byId('csss'),'2026-11-15'),false)
 for(const id of ['ishan','pg','pragati','saksham']){
  assert.equal(applicationStatus(byId(id),'2026-11-30'),'open')
  assert.equal(applicationStatus(byId(id),'2026-12-01'),'closed')
  assert.equal(applicationStatus(byId(id),'2027-06-01'),'closed')
  assert.equal(officialAction(byId(id),'2026-12-01').label,'portal')
  assert.equal(officialAction(byId(id),'2026-12-01').url,'https://scholarships.gov.in/ApplicationForm/')
 }
 assert.equal(applicationOpen(byId('pg'),'2026-09-15'),false)
 assert.equal(applicationStatus(byId('labour-scholarship'),'2026-11-15'),'closed')
 assert.equal(applicationStatus(byId('jssk'),'2026-11-15'),'offline')
 assert.equal(applicationStatus(byId('ayushman70'),'2026-11-15'),'unconfirmed')
 assert.equal(applicationNotice(byId('ayushman70'),'2026-11-15'),'noDeadline')
 assert.equal(applicationNotice(byId('ncs'),'2026-11-15'),'deadlineNotListed')
 assert.equal(applicationNotice(byId('pmmvy'),'2026-11-15'),'personalDeadline')
 assert.equal(applicationNotice(byId('csss'),'2026-11-15'),'unconfirmed')
 assert.equal(officialAction(byId('ayushman70'),'2026-11-15').label,'portal')
 assert.equal(officialAction(byId('ayushman70'),'2026-11-15').url,'https://beneficiary.nha.gov.in/')
 assert.equal(officialAction(byId('pmkisan'),'2026-11-15').label,'portal')
 assert.equal(officialAction(byId('pmkisan'),'2026-11-15').url,'https://www.pmkisan.gov.in/RegistrationFormupdated.aspx')
 assert.equal(match(byId('labour-scholarship'),profiles['labour-scholarship']).status,'likely')
})
test('relevance follows selected categories and degree level',()=>{
 const fields=relevantQuestions({},['health']).map(q=>q.id)
 assert.ok(fields.includes('currentAge'));assert.ok(!fields.includes('level'));assert.ok(!fields.includes('percentile'));assert.ok(!fields.includes('income'))
 const education=relevantQuestions({level:'pg'},['education']).map(q=>q.id)
 assert.ok(education.includes('age'));assert.ok(!education.includes('ner'));assert.ok(!education.includes('technical'))
 const agriculture=relevantQuestions({},['agriculture']).map(q=>q.id)
 assert.ok(agriculture.includes('farmerLand'));assert.ok(!agriculture.includes('age'));assert.ok(!agriculture.includes('woman'))
 assert.deepEqual(relevantQuestions({},[]),[])
})
test('all categories are covered once per catalog record; all 36 States/UTs are extensible',()=>{
 assert.equal(catalog.length,20);assert.equal(new Set(catalog.map(s=>s.id)).size,20)
 assert.equal(categories.length,10);assert.equal(states.length,36);assert.equal(new Set(states.map(s=>s.id)).size,36)
 categories.forEach(c=>assert.ok(catalog.some(s=>s.categories.includes(c.id))))
 assert.equal(catalog.filter(s=>s.coverage==='state').length,0)
 assert.equal(filterCatalog({...emptyFilters,coverage:'state'}).length,0)
})
test('search uses official names, common names, English/Hindi terms independent of display language',()=>{
 for(const [query,id] of [['राशन','nfsa'],['gas','pmuy'],['गैस','pmuy'],['वजीफा','csss'],['Ishan Uday','ishan'],['वय वंदना','ayushman70'],['pension','pmsym'],['नौकरी','ncs'],['PM-KISAN','pmkisan'],['MUDRA','mudra']])assert.ok(searchMatches(byId(id),query),query)
 assert.equal(filterCatalog({...emptyFilters,status:'open'},catalog,'2026-11-15').length,4)
 assert.equal(filterCatalog({...emptyFilters,status:'closed'},catalog,'2026-11-15').length,1)
 assert.ok(!filterCatalog({...emptyFilters,state:'TS'}).some(s=>s.id==='pmmvy'))
 assert.ok(!filterCatalog({...emptyFilters,state:'UP'}).some(s=>s.id==='ishan'))
 assert.ok(filterCatalog({...emptyFilters,state:'UP'}).some(s=>s.id==='csss'))
 assert.ok(filterCatalog({...emptyFilters,state:'AS'}).some(s=>s.id==='ishan'))
 const hidden={...catalog[0],verified:false};assert.equal(filterCatalog(emptyFilters,[hidden]).length,0)
})
test('all shared copy, category labels, states, questions and options are bilingual',()=>{
 const copies=[...Object.values(ui),...categories.map(c=>c.name),...states.map(s=>s.name),...questions.flatMap(q=>[q.text,...(q.hint?[q.hint]:[]),...(q.options?.map(o=>o.text)??[])])]
 copies.forEach(copy=>{assert.ok(copy.en);assert.ok(copy.hi)})
})
