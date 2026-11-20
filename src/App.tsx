import { useEffect, useRef, useState } from 'react'
import { catalog, type Answers, type Scheme } from './catalog'
import { applicationStatus, applicationNotice, match, officialAction, type MatchStatus } from './matching'
import { categories, states, type Category } from './categories'
import { emptyFilters, filterCatalog, type Filters } from './catalogTools'
import { ui, type Copy, type Lang } from './i18n'
import { questions, relevantQuestions, type Question } from './questions'
import { CategoryIcon, Icon } from './components/Icons'
import './App.css'

type View = 'home' | 'find' | 'results' | 'browse' | 'detail'
type ResultGroup = MatchStatus | 'all'
const coreIds = ['level', 'regular', 'institution', 'first', 'currentAge', 'state', 'citizen']
const featuredIds = ['ishan', 'ayushman70', 'pmkisan']

function App() {
 const [lang, setLang] = useState<Lang>(() => {
  try { return localStorage.getItem('sahaay-language') === 'hi' ? 'hi' : 'en' } catch { return 'en' }
 })
 const [view, setView] = useState<View>('home')
 const [answers, setAnswers] = useState<Answers>({})
 const [step, setStep] = useState(0)
 const [selected, setSelected] = useState<Scheme>(catalog[0])
 const [origin, setOrigin] = useState<View>('browse')
 const [filters, setFilters] = useState<Filters>({ ...emptyFilters })
 const [filtersOpen, setFiltersOpen] = useState(false)
 const [chosenCategories, setChosenCategories] = useState<Category[]>(['education'])
 const [homeQuery, setHomeQuery] = useState('')
 const [resultGroup, setResultGroup] = useState<ResultGroup>('all')
 const [hasResults, setHasResults] = useState(false)
 const [error, setError] = useState(false)
 const main = useRef<HTMLElement>(null)
 const t = (copy: Copy) => copy[lang]
 const date = (d: string) => new Date(d + 'T12:00:00+05:30').toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
 })
 const checkedDate = [...catalog.map(s => s.eligibilityChecked)].sort().at(-1)!
 const categoryName = (id: Category) => t(categories.find(c => c.id === id)!.name)
 const categoryCount = (id: Category) => catalog.filter(s => s.categories.includes(id)).length
 const hasAnswers = Object.values(answers).some(Boolean)
 const educationOnly = chosenCategories.length === 1 && chosenCategories[0] === 'education'
 const activeQuestions = relevantQuestions(answers, chosenCategories)
 const core = activeQuestions.filter(q => coreIds.includes(q.id))
 const firstQuestions = core.length ? core : activeQuestions.slice(0, 4)
 const hasSecondStep = firstQuestions.length < activeQuestions.length
 const displayed = step === 0 ? firstQuestions : activeQuestions.filter(q => !firstQuestions.includes(q))
 const answeredCount = activeQuestions.filter(q => Boolean(answers[q.id])).length
 const resultCatalog = catalog.filter(s => s.categories.some(c => chosenCategories.includes(c)))
 const matches = [...resultCatalog].sort((a, b) => (
  { likely: 0, missing: 1, fail: 2 }[match(a, answers).status] - { likely: 0, missing: 1, fail: 2 }[match(b, answers).status]
 ))
 const visibleMatches = matches.filter(s => resultGroup === 'all' || match(s, answers).status === resultGroup)
 const filtered = filterCatalog(filters)
 const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== emptyFilters[key as keyof Filters]).length

 useEffect(() => {
  document.documentElement.lang = lang
  document.title = lang === 'en' ? 'Sahaay · Government Scheme & Benefits Finder' : 'सहाय · सरकारी योजनाएँ और लाभ खोजें'
  try { localStorage.setItem('sahaay-language', lang) } catch { /* Language is the only persisted preference. */ }
 }, [lang])

 function go(next: View) {
  setView(next)
  setError(false)
  if (next === 'results') setHasResults(true)
  window.scrollTo({ top: 0, behavior: 'instant' })
  setTimeout(() => main.current?.focus({ preventScroll: true }), 0)
 }
 function detail(s: Scheme) { setSelected(s); setOrigin(view); go('detail') }
 function start() { setStep(0); go('find') }
 function newCheck() {
  setAnswers({}); setStep(0); setFilters({ ...emptyFilters }); setChosenCategories(['education'])
  setSelected(catalog[0]); setOrigin('browse'); setResultGroup('all'); setHasResults(false); go('find')
 }
 function searchFromHome(query: string) { setFilters({ ...emptyFilters, search: query }); go('browse') }
 function toggleCategory(id: Category) {
  setChosenCategories(old => old.includes(id) ? old.filter(c => c !== id) : [...old, id])
  setStep(0); setError(false)
 }
 function invalidNumber(q: Question) {
  const value = answers[q.id]
  return Boolean(q.numeric && value && value !== 'unknown' && (
   !Number.isFinite(Number(value)) || Number(value) < 0 || !Number.isInteger(Number(value)) ||
   (q.max !== undefined && Number(value) > q.max)
  ))
 }
 function submit() {
  const invalid = displayed.find(invalidNumber)
  setError(Boolean(invalid))
  if (invalid) { setTimeout(() => document.getElementById(invalid.id)?.focus(), 0); return }
  if (!chosenCategories.length) return
  if (step === 0 && hasSecondStep) {
   setStep(1); window.scrollTo({ top: 0, behavior: 'instant' }); main.current?.focus({ preventScroll: true })
  } else { setResultGroup('all'); go('results') }
 }
 function Field({ q, index }: { q: Question; index: number }) {
  const options = [...(q.options ?? [{ value: 'yes', text: ui.yes }, { value: 'no', text: ui.no }]), { value: 'unknown', text: ui.unknown }]
  return <fieldset className="field" key={q.id}>
   <legend><span className="question-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{t(q.text)}</legend>
   {q.hint && <p id={`${q.id}-hint`} className="hint">{t(q.hint)}</p>}
   {q.id === 'state' ? <select name="state" id="profile-state" aria-label={t(q.text)} value={answers.state ?? ''} onChange={e => setAnswers(a => ({ ...a, state: e.target.value }))}>
    <option value="">{t(ui.unknown)}</option>{states.map(s => <option key={s.id} value={s.id}>{t(s.name)}</option>)}
   </select> : q.numeric ? <div className="numeric">
    <label className="sr-only" htmlFor={q.id}>{t(q.text)}</label>
    <input id={q.id} name={q.id} type="number" min="0" step="1" max={q.max} inputMode="numeric" aria-invalid={error && invalidNumber(q) ? true : undefined}
     aria-describedby={q.hint ? `${q.id}-hint` : undefined} value={answers[q.id] === 'unknown' ? '' : answers[q.id] ?? ''}
     placeholder={q.id === 'income' ? '300000' : q.id === 'monthlyIncome' ? '10000' : '22'} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))} />
    <label className="unknown-choice"><input type="checkbox" name={`${q.id}-unknown`} checked={answers[q.id] === 'unknown'} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.checked ? 'unknown' : '' }))} />{t(ui.unknown)}</label>
   </div> : <div className={`options ${q.id === 'level' ? 'vertical' : ''}`}>
    {options.map(o => <label key={o.value} className={answers[q.id] === o.value ? 'chosen' : ''}>
     <input type="radio" name={q.id} value={o.value} checked={answers[q.id] === o.value} onChange={() => setAnswers(a => ({ ...a, [q.id]: o.value }))} />{t(o.text)}
    </label>)}
   </div>}
  </fieldset>
 }
 function renderWindow({ s, full = false }: { s: Scheme; full?: boolean }) {
  const status = applicationStatus(s)
  const notice = applicationNotice(s)
  return <div className={`application status-${status} notice-${notice}`}>
   <span className={full ? 'tiny-label' : 'sr-only'}>{t(ui.appStatus)}</span>
   <strong><span className="status-dot" />{t(ui[notice])}</strong>
   {s.window.end && <small>{t(ui.until)} {date(s.window.end)}{s.window.cycle ? ' · ' + s.window.cycle : ''}</small>}
   {full && s.applicationRoute && <p className="application-route-note">{t(s.applicationRoute.note)}</p>}
   {full && <small>{t(ui.mode)}: {t(ui[s.mode === 'online' ? 'onlineMode' : s.mode === 'offline' ? 'offlineMode' : 'mixedMode'])}</small>}
  </div>
 }
 function renderAction(s: Scheme, full = false) {
  const action = officialAction(s)
  const providers = s.applicationRoute?.providers
  return <>
   {providers?.length ? providers.map(provider => <a key={provider.url} className="primary official-action" href={provider.url} target="_blank" rel="noopener noreferrer">
    {t(provider.name)} · {t(ui.providerPortal)}<Icon name="external" size={16} />
   </a>) : <a className="primary official-action" href={action.url} target="_blank" rel="noopener noreferrer">{t(ui[action.label])}<Icon name="external" size={16} /></a>}
   {action.label !== 'instructions' && s.instructionsUrl !== action.url && <a className="text-button official-instructions" href={s.instructionsUrl} target="_blank" rel="noopener noreferrer" aria-label={t(ui.instructions)}>
    {t(full ? ui.instructions : ui.instructionsShort)}<Icon name="external" size={14} />
   </a>}
  </>
 }
 function renderMatch({ s, full = false }: { s: Scheme; full?: boolean }) {
  const result = match(s, answers)
  const reasons = result.status === 'fail' ? result.failed : result.missing
  const reasonList = (items: typeof reasons) => <ul>{items.map(r => <li key={r.field}>{t(result.status === 'fail' ? r.text : questions.find(q => q.id === r.field)?.hint ?? questions.find(q => q.id === r.field)!.text)}</li>)}</ul>
  return <div className={`match ${result.status}`}>
   <span className="sr-only">{t(ui.matchStatus)}</span>
   <strong className="match-title"><span aria-hidden="true">{result.status === 'likely' ? '✓' : result.status === 'missing' ? '?' : '×'}</span>{t(ui[result.status])}</strong>
   {result.status === 'likely' ? <p>{t(ui.matched)}</p> : <>
    <p>{t(result.status === 'fail' ? ui.failReason : ui.missingReason)}</p>{reasonList(full ? reasons : reasons.slice(0, 2))}
    {!full && reasons.length > 2 && <details className="match-more"><summary>{t(ui.viewMoreRules)} ({reasons.length - 2})</summary>{reasonList(reasons.slice(2))}</details>}
   </>}
   <p className="next-step">{t(result.status === 'likely' ? ui.nextLikely : result.status === 'missing' ? ui.nextMissing : ui.nextFail)}</p>
  </div>
 }
 function renderCard({ s, result = false }: { s: Scheme; result?: boolean }) {
  return <article className={`scheme-card category-${s.categories[0]}`} key={s.id} data-scheme-id={s.id}>
   <div className="card-top"><span className="scheme-icon"><CategoryIcon category={s.categories[0]} /></span><span className="tag coverage-tag">{t(s.coverage === 'central' ? ui.central : ui.stateGovt)}</span></div>
   <p className="authority">{t(s.authority)}</p><h3>{t(s.title)}</h3>
   {(lang === 'hi' || s.title.en !== s.name) && <details className="official-name"><summary>{t(ui.officialName)}</summary><p lang="en">{s.name}</p></details>}
   <p className="scheme-summary">{t(s.summary)}</p>
   <div className="card-categories">{s.categories.map(id => <span className="tag" key={id}>{categoryName(id)}</span>)}</div>
   {result && renderMatch({ s })}{renderWindow({ s })}
   <div className="card-actions">{renderAction(s)}<button className="text-button card-link" onClick={() => detail(s)}>{t(ui.details)}<Icon name="arrow" size={18} /></button></div>
  </article>
 }
 function filterFields() {
  return <>
   <label className="filter-label">{t(ui.state)}<select id="browse-state" name="browse-state" value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}>
    <option value="all">{t(ui.allStates)}</option>{states.map(s => <option key={s.id} value={s.id}>{t(s.name)}</option>)}
   </select></label>
   <label className="filter-label">{t(ui.coverageFilter)}<select id="browse-coverage" name="browse-coverage" value={filters.coverage} onChange={e => setFilters(f => ({ ...f, coverage: e.target.value as Filters['coverage'] }))}>
    <option value="all">{t(ui.allCoverage)}</option><option value="central">{t(ui.central)}</option><option value="state">{t(ui.stateGovt)}</option>
   </select></label>
   <label className="filter-label">{t(ui.appStatus)}<select id="browse-status" name="browse-status" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value as Filters['status'] }))}>
    <option value="all">{t(ui.allStatuses)}</option>{(['open', 'closed', 'unconfirmed', 'offline'] as const).map(status => <option key={status} value={status}>{t(status === 'unconfirmed' ? ui.checkAvailability : ui[status])}</option>)}
   </select></label>
   <button className="text-button clear-filters" onClick={() => setFilters({ ...emptyFilters })}>{t(ui.clearFilters)}<Icon name="close" size={14} /></button>
  </>
 }
 function activeFilterChips() {
  const chips: { key: keyof Filters; label: string }[] = []
  if (filters.category !== 'all') chips.push({ key: 'category', label: categoryName(filters.category) })
  if (filters.state !== 'all') chips.push({ key: 'state', label: t(states.find(s => s.id === filters.state)!.name) })
  if (filters.coverage !== 'all') chips.push({ key: 'coverage', label: t(filters.coverage === 'central' ? ui.central : ui.stateGovt) })
  if (filters.status !== 'all') chips.push({ key: 'status', label: t(filters.status === 'unconfirmed' ? ui.checkAvailability : ui[filters.status]) })
  if (filters.search) chips.push({ key: 'search', label: '“' + filters.search + '”' })
  return chips.length > 0 && <div className="active-filters" aria-label={t(ui.activeFilters)}>
   {chips.map(chip => <button key={chip.key} aria-label={`${t(ui.removeFilter)}: ${chip.label}`} onClick={() => setFilters(f => ({ ...f, [chip.key]: emptyFilters[chip.key] }))}>{chip.label}<Icon name="close" size={13} /></button>)}
  </div>
 }

 return <>
  <a className="skip" href="#main">{t(ui.skip)}</a>
  <header><div className="header-inner">
   <button className="brand" aria-label={t(ui.home)} onClick={() => go('home')}><span className="brand-symbol"><Icon name="leaf" size={25} /></span><span>Sahaay<span className="brand-dot">.</span><small>{t(ui.guideLabel)}</small></span></button>
   <nav aria-label={t(ui.navigation)}>{(['home', 'browse', 'find', ...(hasResults ? ['results'] as const : [])] as const).map(v => <button key={v} aria-current={view === v ? 'page' : undefined} className={`${view === v ? 'active' : ''} ${v === 'find' ? 'nav-find' : ''}`} onClick={() => v === 'find' ? start() : go(v)}>{t(ui[v])}</button>)}</nav>
   <button className="language" onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} aria-label={lang === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}><span className={lang === 'en' ? 'selected' : ''}>English</span><span aria-hidden="true">/</span><span lang="hi" className={lang === 'hi' ? 'selected' : ''}>हिंदी</span></button>
  </div></header>
  <div className="project-strip"><span className="strip-dot" />{t(ui.projectIdentity)}<span className="strip-separator">/</span>{t(ui.coverageShort)}</div>
  <main id="main" ref={main} tabIndex={-1}>
   {hasAnswers && <div className="session-tools wrap"><p><Icon name="shield" size={16} />{t(ui.formPrivacy)}</p><button type="button" className="text-button" onClick={newCheck}>{t(ui.newCheck)}<Icon name="arrow" size={16} /></button></div>}
   {view === 'home' && <>
    <section className="hero wrap">
     <div className="hero-copy"><p className="eyebrow">{t(ui.eyebrow)}</p><h1>{t(ui.hero)}</h1><p className="hero-intro">{t(ui.intro)}</p><div className="hero-actions"><button className="primary" onClick={start}>{t(ui.start)}<Icon name="arrow" size={19} /></button><button className="secondary" onClick={() => go('browse')}>{t(ui.explore)}</button></div><p className="privacy"><Icon name="shield" size={16} />{t(ui.privacy)}</p></div>
     <aside className="finder-panel"><span className="panel-kicker">{t(ui.quickSearchHint)}</span><h2>{t(ui.quickSearch)}</h2>
      <form className="home-search" onSubmit={e => { e.preventDefault(); searchFromHome(homeQuery) }}><label className="sr-only" htmlFor="home-query">{t(ui.search)}</label><Icon name="search" size={20} /><input id="home-query" type="search" value={homeQuery} onChange={e => setHomeQuery(e.target.value)} placeholder={lang === 'en' ? 'e.g. pension, gas, scholarship' : 'जैसे पेंशन, गैस, छात्रवृत्ति'} /><button type="submit" aria-label={t(ui.searchButton)}><Icon name="arrow" size={20} /></button></form>
      <p className="panel-hint">{t(ui.browseNote)}</p><div className="popular-searches"><span>{t(ui.popular)}</span>{[{ label: ui.popularEducation, query: lang === 'en' ? 'scholarship' : 'छात्रवृत्ति' }, { label: ui.popularHealth, query: lang === 'en' ? 'hospital' : 'अस्पताल' }, { label: ui.popularFarming, query: lang === 'en' ? 'farmer' : 'किसान' }].map(item => <button key={item.query} onClick={() => searchFromHome(item.query)}>{t(item.label)}<span aria-hidden="true">↗</span></button>)}</div>
      <div className="panel-source"><Icon name="shield" size={18} /><span>{t(ui.sourceDate)}<strong>{date(checkedDate)}</strong></span><span className="panel-mark" aria-hidden="true">S.</span></div>
     </aside>
    </section>
    <div className="trust-row wrap"><span><b>{catalog.length}</b>{t(ui.verifiedSchemes)}</span><span><b>{categories.length}</b>{t(ui.categoryCount)}</span><span><Icon name="check" size={18} />{t(ui.languageNote)}</span></div>
    <section className="category-section wrap"><div className="section-heading"><div><p className="eyebrow">{t(ui.categories)}</p><h2>{t(ui.exploreCategories)}</h2><p>{t(ui.categorySub)}</p></div><button className="text-button" onClick={() => go('browse')}>{t(ui.all)}<Icon name="arrow" size={18} /></button></div>
     <div className="category-grid">{categories.map(c => <button key={c.id} onClick={() => { setFilters(f => ({ ...f, category: c.id })); go('browse') }}><span className={`category-tile-icon category-${c.id}`}><CategoryIcon category={c.id} size={23} /></span><strong>{t(c.name)}</strong><small>{categoryCount(c.id)}</small><Icon name="arrow" size={17} /></button>)}</div>
     <p className="coverage-note"><Icon name="shield" size={17} />{t(ui.coverageShort)}</p>
    </section>
    <section className="featured wrap"><div className="section-heading"><div><p className="eyebrow">{t(ui.verifiedCount)}</p><h2>{t(ui.featured)}</h2><p>{t(ui.featureSub)}</p></div><button className="text-button" onClick={() => go('browse')}>{t(ui.all)}<Icon name="arrow" size={18} /></button></div><div className="cards">{featuredIds.map(id => renderCard({ s: catalog.find(s => s.id === id)! }))}</div></section>
    <section className="how wrap"><h2>{t(ui.process)}</h2><div className="how-grid">{[['one', 'oneSub'], ['two', 'twoSub'], ['three', 'threeSub']].map(([a, b], i) => <div key={a}><span className="step-number">0{i + 1}</span><div><h3>{t(ui[a as keyof typeof ui])}</h3><p>{t(ui[b as keyof typeof ui])}</p></div></div>)}</div></section>
   </>}
   {view === 'find' && <section className="wrap form-layout">
    <aside className="form-sidebar"><p className="eyebrow">{t(ui.checkTitle)}</p><h1>{t(ui.formTitle)}</h1><p>{t(ui.formSub)}</p>
     <div className="check-scope"><strong>{resultCatalog.length}</strong><span>{t(ui.relevantSchemes)}</span></div>
     <details className="category-editor"><summary>{t(ui.changeCategories)}<Icon name="filter" size={17} /></summary><p className="chosen-support">{chosenCategories.map(categoryName).join(' · ') || t(ui.chooseAtLeastOne)}</p><fieldset className="category-choices"><legend>{t(ui.chooseCategories)}</legend>{categories.map(c => <label key={c.id}><input type="checkbox" name="support-category" value={c.id} checked={chosenCategories.includes(c.id)} onChange={() => toggleCategory(c.id)} /><CategoryIcon category={c.id} size={17} />{t(c.name)}</label>)}<button type="button" className="text-button" onClick={() => { setChosenCategories(categories.map(c => c.id)); setStep(0) }}>{t(ui.allSelected)}</button><p className="hint">{t(ui.chooseHint)}</p></fieldset></details>
     <p className="selected-categories"><span>{t(ui.chooseSupport)} </span>{chosenCategories.map(categoryName).join(' · ')}</p>
     <div className="step-list"><div className={step === 0 ? 'current' : 'complete'}><span>{step > 0 ? '✓' : '1'}</span>{t(educationOnly ? ui.study : ui.aboutYou)}</div>{hasSecondStep && <div className={step === 1 ? 'current' : ''}><span>2</span>{t(ui.requirements)}</div>}</div>
     <p className="privacy-note"><Icon name="shield" size={19} />{t(ui.formPrivacy)}</p><button className="text-button" onClick={() => go('browse')}>{t(ui.explore)}<Icon name="arrow" size={16} /></button>
    </aside>
    <form noValidate autoComplete="off" onSubmit={e => { e.preventDefault(); submit() }} className="question-form"><div className="form-heading"><p className="eyebrow">{t(ui.stepLabel)} {step + 1} / {hasSecondStep ? 2 : 1}</p><span>{t(ui.answered)} {answeredCount} / {activeQuestions.length}</span></div><progress className="form-progress" value={answeredCount} max={activeQuestions.length || 1} aria-label={t(ui.answered)} /><h2>{t(step === 0 ? educationOnly ? ui.study : ui.aboutYou : ui.requirements)}</h2>
     {!chosenCategories.length && <p role="status" className="notice">{t(ui.chooseAtLeastOne)}</p>}{displayed.map((q, index) => Field({ q, index }))}{error && <p role="alert" className="error">{t(ui.invalid)}</p>}
     <div className="form-actions">{step > 0 && <button type="button" className="secondary" onClick={() => { setStep(0); setError(false) }}>{t(ui.back)}</button>}<button type="submit" disabled={!chosenCategories.length} className="primary">{t(step === 0 && hasSecondStep ? ui.continue : ui.show)}<Icon name="arrow" size={18} /></button></div><p className="hint unknown-help">{t(ui.unknownHelp)}</p>
    </form>
   </section>}
   {(view === 'browse' || view === 'results') && <section className="wrap listing"><p className="eyebrow">{t(view === 'browse' ? ui.guideLabel : ui.checkTitle)}</p><div className="listing-heading"><div><h1>{t(view === 'browse' ? ui.browseTitle : ui.resultTitle)}</h1><p>{t(view === 'browse' ? ui.browseSub : ui.resultSub)}</p></div>{view === 'results' && <button className="secondary" onClick={start}>{t(ui.edit)}<Icon name="arrow" size={17} /></button>}</div>
    {view === 'browse' ? <>
     <div className="browse-tools"><div className="search"><Icon name="search" size={21} /><label className="sr-only" htmlFor="browse-search">{t(ui.search)}</label><input type="search" id="browse-search" name="search" value={filters.search} placeholder={t(ui.searchHint)} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />{filters.search && <button aria-label={t(ui.clearSearch)} onClick={() => setFilters(f => ({ ...f, search: '' }))}><Icon name="close" size={17} /></button>}</div><span className="catalog-total"><Icon name="shield" size={16} />{catalog.length} {t(ui.verifiedSchemes)}</span></div>
     <div className="mobile-browse-controls"><label>{t(ui.category)}<select id="browse-category" name="browse-category" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value as Filters['category'] }))}><option value="all">{t(ui.allCategories)}</option>{categories.map(c => <option key={c.id} value={c.id}>{t(c.name)}</option>)}</select></label><button className="secondary" aria-expanded={filtersOpen} aria-controls="browse-sidebar" onClick={() => setFiltersOpen(o => !o)}><Icon name="filter" size={17} />{t(filtersOpen ? ui.closeFilters : ui.filters)}{activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}</button></div>
     <div className="browse-layout"><aside id="browse-sidebar" className={`browse-sidebar ${filtersOpen ? 'filters-open' : ''}`}><h2>{t(ui.categories)}</h2><div className="category-links"><button className={filters.category === 'all' ? 'active' : ''} aria-pressed={filters.category === 'all'} onClick={() => setFilters(f => ({ ...f, category: 'all' }))}>{t(ui.allCategories)}<span>{catalog.length}</span></button>{categories.map(c => <button key={c.id} aria-pressed={filters.category === c.id} className={filters.category === c.id ? 'active' : ''} onClick={() => setFilters(f => ({ ...f, category: c.id }))}><CategoryIcon category={c.id} size={18} />{t(c.name)}<small>{categoryCount(c.id)}</small></button>)}</div><div className="filter-fields">{filterFields()}</div></aside>
      <div className="browse-results"><div className="results-bar" role="status"><strong>{filtered.length} {t(filtered.length === 1 ? ui.foundOne : ui.found)}</strong><span>{filters.category === 'all' ? t(ui.allCategories) : categoryName(filters.category)}</span></div>{activeFilterChips()}<p className="coverage-note">{t(filters.coverage === 'state' ? ui.stateEmpty : filters.category !== 'all' && filtered.length < 3 ? ui.limitedCoverage : ui.coverageShort)}</p>{filtered.length ? <div className="cards">{filtered.map(s => renderCard({ s }))}</div> : <div className="empty-state"><Icon name="search" size={30} /><h2>{t(ui.noResults)}</h2><button className="secondary" onClick={() => setFilters({ ...emptyFilters })}>{t(ui.clearFilters)}</button></div>}</div>
     </div>
    </> : <>
     <p className="result-scope">{t(ui.matchingOnly)}<span>{chosenCategories.map(categoryName).join(' · ')}</span></p>
     <div className="result-counts" aria-label={t(ui.results)}><button className={`count ${resultGroup === 'all' ? 'selected' : ''}`} aria-pressed={resultGroup === 'all'} onClick={() => setResultGroup('all')}><b>{matches.length}</b>{t(ui.allMatches)}</button>{(['likely', 'missing', 'fail'] as const).map(status => <button key={status} className={`count ${status} ${resultGroup === status ? 'selected' : ''}`} aria-pressed={resultGroup === status} onClick={() => setResultGroup(status)}><b>{resultCatalog.filter(s => match(s, answers).status === status).length}</b>{t(ui[status])}</button>)}</div>
     <p className="notice"><Icon name="shield" size={20} />{t(ui.officialCheck)}</p><div className="cards">{visibleMatches.map(s => renderCard({ s, result: true }))}</div>{!visibleMatches.length && <div className="empty-state"><h2>{t(ui.noMatchesInGroup)}</h2><button className="secondary" onClick={() => setResultGroup('all')}>{t(ui.showAllResults)}</button></div>}
    </>}
   </section>}
   {view === 'detail' && <section className="wrap detail"><button className="text-button back-link" onClick={() => go(origin)}>← {t(ui.back)} · {t(origin === 'results' ? ui.results : ui.browse)}</button>
    <div className="detail-heading"><p className="eyebrow">{t(selected.authority)}</p><h1>{t(selected.title)}</h1><p className="detail-official-name" lang="en">{selected.name}</p><p className="detail-lead">{t(selected.summary)}</p></div>
    <div className="detail-layout"><article>{origin === 'results' && renderMatch({ s: selected, full: true })}<nav className="detail-contents" aria-label={t(ui.detailContents)}><a href="#eligibility">{t(ui.eligibility)}</a><a href="#documents">{t(ui.docs)}</a><a href="#application-steps">{t(ui.steps)}</a><a href="#official-sources">{t(ui.sourceTitle)}</a></nav>
     <section id="eligibility"><h2>{t(ui.eligibility)}</h2><ul className="check-list">{selected.rules.map(r => <li key={r.field}><Icon name="check" size={17} />{t(r.text)}</li>)}</ul><p className="notice">{t(selected.note)}</p><p className="hint">{t(ui.officialCheck)}</p></section>
     <section id="documents"><h2>{t(ui.docs)}</h2><ul className="plain-list">{selected.documents.map((d, i) => <li key={i}>{t(d)}</li>)}</ul><p className="hint">{t(ui.identityNote)}</p></section>
     <section id="application-steps"><h2>{t(ui.steps)}</h2><ol className="apply-steps">{selected.steps.map((s, i) => <li key={i}>{t(s)}</li>)}</ol></section>
     <section id="official-sources" className="sources"><h2>{t(ui.sourceTitle)}</h2>{selected.sources.map((source, i) => <a key={i} href={source.url} target="_blank" rel="noopener noreferrer">{t(source.title)}<Icon name="external" size={15} /></a>)}<a href={selected.window.source} target="_blank" rel="noopener noreferrer">{t(ui.windowSource)}<Icon name="external" size={15} /></a><div className="source-dates"><p>{t(ui.eligibilityChecked)}<time dateTime={selected.eligibilityChecked}>{date(selected.eligibilityChecked)}</time></p><p>{t(ui.windowChecked)}<time dateTime={selected.window.checked}>{date(selected.window.checked)}</time></p></div><p>{t(selected.window.evidence)}</p></section>
    </article><aside className="application-panel"><span className="scheme-icon"><CategoryIcon category={selected.categories[0]} size={25} /></span><h2>{t(ui.nextStep)}</h2>{renderWindow({ s: selected, full: true })}{renderAction(selected, true)}<p className="hint">{t(ui.external)}</p>{selected.id === 'csss' && <p className="hint">{t(ui.portalGuide)}</p>}<div className="checked-line"><Icon name="shield" size={18} /><span>{t(ui.verified)}<strong>{date(selected.eligibilityChecked)}</strong></span></div></aside></div>
   </section>}
  </main>
  <footer><div className="wrap footer-inner"><div className="footer-brand">Sahaay<span>.</span><p>{t(ui.guideLabel)}</p></div><div className="footer-copy"><p>{t(ui.footer)}</p><small>{t(ui.memory)}</small></div><span className="footer-mark" aria-hidden="true"><Icon name="leaf" size={35} /></span></div></footer>
 </>
}
export default App
