import { c, type Copy } from './i18n.ts'
import { benefits } from './benefits.ts'
import { applicationRoutes, type ApplicationRoute } from './applicationRoutes.ts'
import type { Category } from './categories.ts'
export type Answers = Record<string, string>
export type Rule = { field: string; op: 'eq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in'; value: string | number | string[]; text: Copy }
export type ApplicationStatus = 'open' | 'closed' | 'unconfirmed' | 'offline'
export type ApplicationDeadline = 'none' | 'not-published' | 'personal' | 'cycle'
export type Scheme = { id: string; categories: Category[]; name: string; title: Copy; short: string; aliases: string[]; coverage: 'central' | 'state'; states?: string[]; verified: boolean; authority: Copy; amount: string; summary: Copy; rules: Rule[]; documents: Copy[]; steps: Copy[]; note: Copy; infoUrl: string; extraUrl?: string; sources: {url:string; title:Copy}[]; applicationUrl: string; instructionsUrl:string; applicationRoute?:ApplicationRoute; portalVerification?: { checked:string; source:string }; mode:'online'|'offline'|'mixed'; window: { deadline?: ApplicationDeadline; status: ApplicationStatus; cycle: string; checked: string; source: string; evidence:Copy; start?: string; end?: string; continuous?:boolean; reviewBy?:string }; eligibilityChecked: string }
type LegacyScholarship = Omit<Scheme, 'categories'|'title'|'aliases'|'coverage'|'verified'|'sources'|'instructionsUrl'|'mode'|'window'> & { category:'scholarships'; window: Omit<Scheme['window'],'evidence'> }
export const windowUrl = 'https://scholarships.gov.in/All-Scholarships'
const r = (field: string, op: Rule['op'], value: string | number, en: string, hi: string): Rule => ({ field, op, value, text: c(en, hi) })
const degree = r('regular', 'eq', 'yes', 'Regular, full-time degree study.', 'नियमित, पूर्णकालिक डिग्री की पढ़ाई।')
const institution = r('institution', 'eq', 'yes', 'Course and institution meet the official recognition requirements in India.', 'भारत में पाठ्यक्रम और संस्थान आधिकारिक मान्यता की शर्तें पूरी करते हों।')
const first = r('first', 'eq', 'yes', 'This is your first degree at this level.', 'इस स्तर पर यह आपकी पहली डिग्री हो।')
const ug = r('level', 'eq', 'ug', 'Admitted to the first year of an undergraduate degree.', 'स्नातक डिग्री के पहले वर्ष में प्रवेश लिया हो।')
const ugcSteps = [c('Register for OTR on NSP, then sign in to the scholarship application.', 'NSP पर OTR पंजीकरण करें, फिर छात्रवृत्ति आवेदन में लॉगिन करें।'), c('Select the scheme by its official name. Submit accurate details and arrange institution verification.', 'आधिकारिक नाम से योजना चुनें। सही विवरण जमा करें और संस्थान से सत्यापन कराएँ।')]
const ugcNote = c('Declare other support. If selected, keep only one scholarship; confirm restrictions on other benefits with your institution.', 'अन्य सहायता घोषित करें। चयन होने पर एक ही छात्रवृत्ति रखें; अन्य लाभों के प्रतिबंध संस्थान से जाँचें।')
const scholarships: LegacyScholarship[] = [
  { id: 'csss', category: 'scholarships', short: 'PM-USP CSSS', name: 'PM-USP Central Sector Scheme of Scholarship for College and University Students', authority: c('Ministry of Education', 'शिक्षा मंत्रालय'), amount: '₹12,000',
    summary: c('₹12,000 a year for the first three undergraduate years. Higher rates apply in later eligible years.', 'स्नातक के पहले तीन वर्षों में सालाना ₹12,000। बाद के पात्र वर्षों में अधिक राशि मिलती है।'),
    rules: [ug, degree, institution, r('income','lte',450000,'Annual family income is at most ₹4,50,000.','सालाना पारिवारिक आय ₹4,50,000 तक हो।'), r('percentile','eq','yes','Above the 80th percentile in your Class XII board and stream; this is not 80% marks.','12वीं के अपने बोर्ड व विषय-वर्ग में 80वें पर्सेंटाइल से ऊपर; इसका अर्थ 80% अंक नहीं है।'), r('gap','eq','no','No gap year after Class XII.','12वीं के बाद गैप वर्ष न लिया हो।'), r('other','eq','no','No other scholarship or fee reimbursement.','अन्य छात्रवृत्ति या फीस प्रतिपूर्ति न मिल रही हो।')],
    documents: [c('Class XII marksheet; family income certificate.', '12वीं की अंकतालिका; पारिवारिक आय प्रमाणपत्र।'), c('Category or disability certificate, if applicable.', 'लागू होने पर श्रेणी या दिव्यांगता प्रमाणपत्र।')],
    steps: [c('Read the fresh-application instructions and check NSP for a confirmed fresh window.', 'नए आवेदन के निर्देश पढ़ें और NSP पर अवधि की पुष्टि जाँचें।'), ...ugcSteps], note: c('Board merit-list inclusion and institute verification are required. This finder checks fresh entry only, not renewal.', 'बोर्ड की मेरिट सूची और संस्थान का सत्यापन आवश्यक है। यहाँ केवल नए आवेदन की पात्रता जाँची जाती है, नवीनीकरण की नहीं।'),
    infoUrl: 'https://scholarships.gov.in/public/schemeGuidelines/CSSS_GUIDLINES_07022024_updated.pdf', extraUrl: 'https://scholarships.gov.in/public/schemeGuidelines/FAQ_DOHE_CSSS.pdf', applicationUrl: 'https://scholarships.gov.in/Students',
    eligibilityChecked: '2026-11-15', window: { status:'unconfirmed', cycle:'2026-27', checked:'2026-11-15', source:windowUrl } },
  { id:'ishan', category:'scholarships', short:'Ishan Uday', name:'Ishan Uday Special Scholarship Scheme for North Eastern Region', authority:c('University Grants Commission', 'विश्वविद्यालय अनुदान आयोग'), amount:'₹80,000',
    summary:c('₹8,000 a month for 10 months each year, supporting a first undergraduate degree.', 'पहली स्नातक डिग्री के लिए हर साल 10 महीने तक ₹8,000 प्रतिमाह।'),
    rules:[ug, first, degree, institution, r('income','lt',450000,'Annual parental income is strictly below ₹4,50,000.','माता-पिता की सालाना आय ₹4,50,000 से कम हो।'), r('ner','eq','yes','Domicile in a North Eastern state and Class XII passed from a school there.','पूर्वोत्तर राज्य का निवास और वहीं के स्कूल से 12वीं उत्तीर्ण हो।'), r('management','eq','no','Admission is not through a management quota.','प्रवेश प्रबंधन कोटे से न हुआ हो।')],
    documents:[c('North Eastern domicile and income certificates.', 'पूर्वोत्तर का निवास और आय प्रमाणपत्र।'), c('Academic records; category evidence if applicable. Submit supporting documents to your institution.', 'शैक्षणिक रिकॉर्ड; लागू होने पर श्रेणी प्रमाण। दस्तावेज़ संस्थान में दें।')],
    steps:ugcSteps, note:ugcNote,
    infoUrl:'https://scholarships.gov.in/public/schemeGuidelines/Guidelines_ISHAN%20UDAY_2324.pdf', extraUrl:'https://www.ugc.gov.in/Scholarships/stu_Scholarship5', applicationUrl:'https://scholarships.gov.in/ApplicationForm/', eligibilityChecked:'2026-11-15', window:{status:'open',cycle:'2026-27',checked:'2026-11-15',source:windowUrl,start:'2026-09-16',end:'2026-11-30'} },
  { id:'pg', category:'scholarships', short:'Postgraduate Studies', name:'National Scholarship for Post Graduate Studies', authority:c('University Grants Commission', 'विश्वविद्यालय अनुदान आयोग'), amount:'₹1,50,000',
    summary:c('₹15,000 a month for 10 months a year, for two years of postgraduate study.', 'स्नातकोत्तर पढ़ाई के लिए दो वर्षों तक, हर साल 10 महीने ₹15,000 प्रतिमाह।'),
    rules:[r('level','eq','pg','Admitted to the first year of a postgraduate degree.','स्नातकोत्तर डिग्री के पहले वर्ष में प्रवेश लिया हो।'),first,degree,institution,r('age','lt',30,'Under 30 years old on the date of PG admission.','स्नातकोत्तर प्रवेश की तारीख पर आयु 30 वर्ष से कम हो।'),r('indian','eq','yes','Indian student with a recognized undergraduate degree.','भारतीय विद्यार्थी और मान्यता प्राप्त स्नातक डिग्री हो।')],
    documents:[c('Academic records; category certificate if applicable. Your institution may request supporting certificates.', 'शैक्षणिक रिकॉर्ड; लागू होने पर श्रेणी प्रमाणपत्र। संस्थान अन्य प्रमाण माँग सकता है।')], steps:ugcSteps, note:c('Declare other support. If selected, relinquish other scholarships; paid or unpaid appointments and other emoluments are restricted during the award.', 'अन्य सहायता घोषित करें। चयन पर अन्य छात्रवृत्ति छोड़ें; अवधि के दौरान सवेतन या अवैतनिक नियुक्ति व अन्य पारिश्रमिक पर प्रतिबंध हैं।'),
    infoUrl:'https://scholarships.gov.in/public/schemeGuidelines/Guidelines_NATIONAL_SCHOLARSHIP_FOR_POSTGRADUATE_STUDIES_UGC_2324.pdf', extraUrl:'https://www.ugc.gov.in/Scholarships/stu_Scholarship6', applicationUrl:'https://scholarships.gov.in/ApplicationForm/',eligibilityChecked:'2026-11-15',window:{status:'open',cycle:'2026-27',checked:'2026-11-15',source:windowUrl,start:'2026-09-16',end:'2026-11-30'} },
]

const scholarshipTitles: Record<string,Copy> = {
 csss:c('PM-USP Central Sector Scholarship','पीएम-यूएसपी केंद्रीय क्षेत्र छात्रवृत्ति'),
 ishan:c('Ishan Uday Scholarship','ईशान उदय छात्रवृत्ति'),
 pg:c('National Scholarship for Post Graduate Studies','स्नातकोत्तर अध्ययन के लिए राष्ट्रीय छात्रवृत्ति'),
}
export const catalog: Scheme[] = [
 ...scholarships.map((s):Scheme=>({ ...s, categories:['education'], title:scholarshipTitles[s.id], aliases:[s.short,'scholarship college fees student education छात्रवृत्ति वजीफा पढ़ाई फीस शिक्षा',scholarshipTitles[s.id].hi], coverage:'central', verified:true, eligibilityChecked:'2026-11-15', mode:'online', states:s.id==='ishan'?['AR','AS','MN','ML','MZ','NL','SK','TR']:undefined, instructionsUrl:'https://scholarships.gov.in/Students',
 sources:[{url:s.infoUrl,title:c('Official eligibility and benefit guidelines','पात्रता और लाभ के आधिकारिक दिशानिर्देश')}, ...(s.extraUrl?[{url:s.extraUrl,title:c('Official FAQ / overview','आधिकारिक प्रश्नोत्तर / विवरण')}]:[])],
 window:{...s.window,checked:'2026-11-15',evidence:s.id==='csss'?c('A fresh CSSS window is not established by the current NSP listing. Renewal notices do not confirm fresh applications.','वर्तमान NSP सूची में नए CSSS आवेदन की अवधि स्थापित नहीं है। नवीनीकरण की सूचना नए आवेदनों की पुष्टि नहीं करती।'):c('NSP lists fresh applications from 16 September to 30 November 2026 for AY 2026–27. OTR and login required.','NSP पर 2026–27 के नए आवेदन 16 सितंबर से 30 नवंबर 2026 तक सूचीबद्ध हैं। OTR और लॉगिन आवश्यक हैं।')}
 })), ...benefits,
 ].filter(s=>s.verified).map(s=>{
 const route=applicationRoutes[s.id]
 if(!route) throw new Error(`Missing audited application route: ${s.id}`)
 return {...s, applicationUrl:route.url, instructionsUrl:route.instructionsUrl??s.instructionsUrl,
  applicationRoute:route,
  portalVerification:route.kind==='offline'?undefined:{checked:route.checked,source:route.source},
  mode:route.kind==='offline'?'offline':s.mode==='offline'?'mixed':s.mode,
  window:{...s.window,status:s.window.status==='offline'&&route.kind!=='offline'?'unconfirmed':s.window.status},
  sources:[...s.sources,...(s.sources.some(source=>source.url===route.source)?[]:[{url:route.source,title:c('Verified official application route','सत्यापित आधिकारिक आवेदन माध्यम')}])],
 }
})
