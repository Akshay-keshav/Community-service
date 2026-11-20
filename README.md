# Sahaay — Government Scheme & Benefits Finder

Responsive React / TypeScript / Vite website in English and Hindi. The original three-scholarship journey remains available, alongside a browsable catalog of **20 verified central schemes and public services across ten categories**. This is an independent student project, not a government service.

## Run

Node 24 and npm:

```sh
npm install
npm run dev -- --host 127.0.0.1
npm test
npm run lint
npm run preview
```

`npm test` builds production assets and runs 56 rule/data/DOM tests. No new dependencies were added. `npm run build` runs TypeScript and Vite. Local preview was served at http://127.0.0.1:5173 and returned HTTP 200.

## User journeys

Vercel configuration and sign-in/deployment instructions are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Publication is pending Vercel login; no production URL has been created yet.

- Home offers **Browse Schemes** and **Find Schemes for Me**. Ten category rows show actual counts. The home search and example searches lead straight to filtered Browse results.
- Browse has a persistent search field, desktop category/filter sidebar, and mobile Category selector plus Filters disclosure. State/UT, central/state coverage and application-status filters combine with bilingual search. Active filters appear as removable chips, and search has a clear button.
- Every card has an ordinary direct external anchor to an official destination; opening details or completing a questionnaire is optional. Results also carry these anchors, independently of the match status.
- Confirmed-open online applications use “Apply on the official website.” Verified registration portals without a confirmed live application window use “Open official registration portal,” with instructions linked separately. Ujjwala offers each provider’s original portal directly. Ration cards use the official State/UT application directory. JSSK uses “See official application instructions” for care through public health facilities. PDFs and guidelines remain secondary links. Closed and offline/provider routes are explicit. Deadline information is separate: year-round schemes show “No fixed application deadline”; sources without a published deadline show “No application deadline listed”; personal deadlines are identified separately. “Application window unconfirmed” is reserved for schemes with a genuinely uncertain application cycle.
- Find defaults to Education & Scholarships to retain the original journey. Choose one or more categories; only rules relevant to those categories are asked. Study-level filtering removes irrelevant degree-specific questions. A compact category editor preserves the default scholarship journey; real question progress and one/two-step labels follow the selected categories. Unknown/blank answers produce missing-information explanations. Known failures take precedence. Results can be filtered by match group without losing answers; long missing-rule lists can be expanded on the card.
- English/Hindi switching preserves the current view, question step, answers, category selections, search and filters. Official English scheme names remain available alongside Hindi titles.
- “Start a new check” clears personal answers, selections and filters and returns to the scholarship check. Only language preference is stored; answers remain in React memory and disappear on refresh. There are no accounts, uploads, analytics or external submissions from the questionnaire.

## Verified coverage — checked 15 November 2026

Counts overlap: a scheme has one record and can belong to several categories.

| Category | Records |
| --- | ---: |
| Education & Scholarships | 6 |
| Health | 3 |
| Agriculture | 2 |
| Jobs & Skills | 3 |
| Business & Self-Employment | 2 |
| Housing & Utilities | 2 |
| Food & Essential Support | 1 |
| Pensions & Social Security | 4 |
| Women & Children | 5 |
| Disability Support | 3 |

No category is empty. **All state-government catalogs await verification**; the prototype contained no state schemes. State-only filtering displays an honest empty state. All 36 States/UTs have bilingual selector entries. Central coverage is filtered where the official rules establish a restriction: Ishan Uday covers North Eastern domiciles; PMMVY excludes Telangana according to the checked ministry FAQ. A central record appearing under a state is not a claim of comprehensive state coverage or current local intake.

The category counts include services: UDID provides certification and NCS provides employment services. Insurance and MUDRA loans are clearly described as paid/contributory or repayable products. They are not represented as cash grants. Agriculture, business, housing and especially food coverage are limited.

See [the official-source audit](docs/VERIFICATION.md) for sources, status decisions, inaccessible routes, and pending research. Each public record also contains its source URLs, rules, document guidance, application mode, official action/instructions URL, separate eligibility/window check dates and bilingual status evidence. `verified: false` records are excluded from the public catalog.

## Validation

Baseline, before changes: production build, 12 existing tests and Oxlint passed; the prototype was run locally.

Final: production TypeScript/Vite build, **56 tests**, and Oxlint passed. A production preview smoke check returned HTTP 200 for the page and its built JavaScript/CSS assets; preview servers were stopped after verification.

The tests cover:

- Explicit passing, missing/unknown and failing profiles for all 20 records.
- CSSS inclusive ₹4.5 lakh, Ishan exclusive ₹4.5 lakh and PG age-under-30 boundaries; new contribution, disability, age, state-exclusion and income rules.
- Verified-public-record filtering, one-record/multiple-category coverage, all 36 States/UTs, English/Hindi aliases and combined filters.
- Date-bounded windows and removal of the Apply label after a verified closing date. Verified portal links remain directly accessible with a neutral label; no new cycle is invented.
- The original scholarship journey and a non-scholarship health journey in production-bundle JSDOM sessions with **390 × 844** and **1366 × 768** viewport dimensions, switching language during forms/results/filters and preserving answers.
- Exact audited application anchors for all 20 schemes from Browse, Results and details in both languages, including three direct LPG-provider portals, closed scholarship windows, NFSA state selection and offline JSSK care. Tests intercept clicks and assert the exact official destination and absence of an intermediate questionnaire/details gate. They do not submit fictional profiles to government systems.

**Rendered browser review completed in native Chrome**, using responsive viewports of 390 × 844 and 1366 × 768. Reviewed Home, category selection, Browse and mobile filters, scholarship and health forms/results, and Hindi results/details. Checked the PG scholarship from study selection through a likely match, and a fresh health-only check through Ayushman/JSSK matches. Verified keyboard selection and visible focus on a questionnaire radio group. No clipping or horizontal overflow was observed in the reviewed views. Navigation focus now preserves the top-of-page position. Chrome reported no page errors or form-field warnings after the fixes on freshly loaded Home and Browse.

Live card clicks opened the NSP Application Login from scholarship Results, the NHA Beneficiary Portal from health Results, and NHM JSSK guidance from Browse in separate tabs; no data was entered on those services. The complete 20-record route matrix (including closed cases) is covered by the DOM tests. Responsive emulation is not physical-device testing; exhaustive keyboard traversal, 200% zoom and every external portal were not visually re-audited in this UI pass.

## Presentation

Warm ivory surfaces, forest-green actions, restrained terracotta accents, English serif headings, Hindi typography and a consistent SVG icon set replace the decorative certificate illustration and repetitive tiles. Short card summaries lead to the official action; full route notes and checklists remain in details. Mobile detail pages place the title and benefit before the application panel. No extra connector, account system or dependency was needed.

## Data and extension

- `src/catalog.ts`: public schema and retained scholarship records.
- `src/benefits.ts`: additional verified scheme/service records and bilingual evidence.
- `src/categories.ts`: stable category IDs and all State/UT labels.
- `src/applicationRoutes.ts`: authoritative scheme-to-portal mapping, source evidence, checked date, route kind and provider alternatives.
- `src/catalogTools.ts`: UI-independent bilingual search and combinable filters.
- `src/matching.ts`: UI-independent rule matching, India-date application state and official CTA selection.
- `src/questions.ts`: bilingual questions generated only from verified rule fields, with explicit numeric types, unknown answers and category/study-level relevance.
- `src/i18n.ts`: shared `Lang`/`Copy` contract and interface translations. Add regional language keys to the shared contract and translate records/questions/options before enabling a new language.
- `src/App.tsx`, `src/App.css`: presentation and transient state.
- `tests/`: fictional profiles and production-bundle interaction regression tests.

For another scheme: verify responsible government sources and add an explicit audited entry in `src/applicationRoutes.ts`; add one record with stable ID, category IDs, optional State/UT coverage, all bilingual copy, checked rules, sources, documents and steps. Keep the window unconfirmed unless official current-window evidence and the actual destination are verified. Add a meaningful explicit test profile and source audit row. For state schemes, use the responsible state government as the primary authority and set `coverage: 'state'` with relevant State/UT IDs. Do not update a checked date merely because the source is old or the build ran.

The current application-route audit covers 16 distinct destinations: 13 returned HTML with HTTP 200. PM-KISAN, IndianOil and HP Gas have official-source-confirmed routes with live connection/TLS limitations recorded in [the verification report](docs/VERIFICATION.md). No security settings were weakened and no personal data was submitted.
