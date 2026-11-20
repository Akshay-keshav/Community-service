import { c, type Copy } from './i18n.ts'
import { catalog, type Answers } from './catalog.ts'
import { categories, states, type Category } from './categories.ts'
import { passes } from './matching.ts'
export type Question = { id: string; text: Copy; hint?: Copy; options?: { value: string; text: Copy }[]; max?: number; numeric?: boolean }
export const questions: Question[] = [
 {id:'level',text:c('Where are you in your studies?','आपकी पढ़ाई किस स्तर पर है?'),options:[{value:'ug',text:c('First year of an undergraduate degree','स्नातक डिग्री का पहला वर्ष')},{value:'pg',text:c('First year of a postgraduate degree','स्नातकोत्तर डिग्री का पहला वर्ष')},{value:'lateral',text:c('Second year by lateral entry','लेटरल एंट्री से द्वितीय वर्ष')},{value:'postmatric',text:c('Class XI/XII, diploma or other post-matric study','कक्षा 11/12, डिप्लोमा या अन्य मैट्रिकोत्तर पढ़ाई')},{value:'other',text:c('Another stage of study','पढ़ाई का कोई अन्य स्तर')}]},
 {id:'regular',text:c('Is your degree regular and full-time?','क्या आपकी डिग्री नियमित और पूर्णकालिक है?'),hint:c('Exclude distance, open, correspondence, private, part-time and diploma courses.','दूरस्थ, मुक्त, पत्राचार, प्राइवेट, अंशकालिक और डिप्लोमा पाठ्यक्रम शामिल नहीं हैं।')},
 {id:'institution',text:c('Do your course and institution meet the recognition rules?','क्या आपका पाठ्यक्रम और संस्थान मान्यता की शर्तें पूरी करते हैं?'),hint:c('In India, with a valid AISHE code. CSSS requires the relevant regulator’s recognition. UGC schemes accept section 2(f)/3 institutions, fully government-funded degree institutions or Institutions of National Importance (2026–27 rules). Ask your college if unsure.','भारत में मान्य AISHE कोड हो। CSSS के लिए संबंधित नियामक की मान्यता चाहिए। UGC योजनाओं में धारा 2(f)/3 के संस्थान, पूर्ण सरकारी वित्तपोषित डिग्री संस्थान या राष्ट्रीय महत्व के संस्थान स्वीकार्य हैं (2026–27 नियम)। संदेह हो तो कॉलेज से पूछें।')},
 {id:'first',text:c('Is this your first degree at this level?','क्या इस स्तर पर यह आपकी पहली डिग्री है?')},
 {id:'income',text:c('What is your annual family / parental income in rupees?','आपके परिवार / माता-पिता की सालाना आय कितने रुपये है?'),hint:c('Use gross annual income from all sources. Example: 300000.','सभी स्रोतों से कुल सालाना आय बताएँ। उदाहरण: 300000।')},
 {id:'percentile',text:c('Were you above the 80th percentile in your Class XII board and stream?','क्या आप 12वीं के अपने बोर्ड व विषय-वर्ग में 80वें पर्सेंटाइल से ऊपर थे?'),hint:c('This is your rank among successful students, not your marks percentage. Check your board’s CSSS list.','यह उत्तीर्ण विद्यार्थियों के बीच आपकी रैंक है, अंकों का प्रतिशत नहीं। बोर्ड की CSSS सूची देखें।')},
 {id:'gap',text:c('Did you take a gap year after Class XII?','क्या आपने 12वीं के बाद गैप वर्ष लिया था?')},
 {id:'other',text:c('Are you receiving another scholarship or fee reimbursement?','क्या आपको अन्य छात्रवृत्ति या फीस प्रतिपूर्ति मिल रही है?')},
 {id:'ner',text:c('Do you have North Eastern domicile AND did you pass Class XII from a school there?','क्या आपका पूर्वोत्तर का निवास प्रमाण है और आपने वहीं के स्कूल से 12वीं पास की है?'),hint:c('Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim or Tripura. Both conditions are required.','अरुणाचल प्रदेश, असम, मणिपुर, मेघालय, मिज़ोरम, नागालैंड, सिक्किम या त्रिपुरा। दोनों शर्तें आवश्यक हैं।')},
 {id:'management',text:c('Was your admission through a management quota?','क्या आपका प्रवेश प्रबंधन कोटे से हुआ था?')},
 {id:'age',text:c('How old were you on the date of PG admission?','स्नातकोत्तर में प्रवेश की तारीख पर आपकी आयु कितनी थी?'),hint:c('Enter completed years.','पूरे हो चुके वर्ष भरें।'),max:120},
 {id:'indian',text:c('Are you an Indian student with a recognized undergraduate degree?','क्या आप भारतीय विद्यार्थी हैं और आपके पास मान्यता प्राप्त स्नातक डिग्री है?')},
]
const numericFields: Record<string,{text:Copy;max?:number}> = {
 currentAge:{text:c('What is your current age in completed years?','पूरे वर्षों में आपकी वर्तमान आयु कितनी है?'),max:120},
 monthlyIncome:{text:c('What is your monthly income in rupees?','आपकी मासिक आय रुपये में कितनी है?')},
 qualifyingGap:{text:c('How many years between your qualifying exam and degree admission?','अर्हता परीक्षा और डिग्री प्रवेश के बीच कितने वर्ष का अंतर है?'),max:120},
 disabilityPercent:{text:c('What disability percentage is shown on your certificate?','आपके प्रमाणपत्र में दिव्यांगता कितने प्रतिशत है?'),max:100},
}
questions.forEach(q=>{if(q.id==='income'||q.id==='age')q.numeric=true})
questions.push({id:'state',text:c('Which State or Union Territory do you live in?','आप किस राज्य या केंद्रशासित प्रदेश में रहते हैं?'),options:states.map(s=>({value:s.id,text:s.name}))})
for(const s of catalog) for(const r of s.rules) if(!questions.some(q=>q.id===r.field)) {
 const n=numericFields[r.field]
 questions.push(n?{id:r.field,...n,numeric:true}:{id:r.field,text:c('Do you meet this requirement?','क्या आप यह शर्त पूरी करते हैं?'),hint:r.text})
}
const exclusionQuestions: Record<string,Copy> = {
 paidSupport:c('Are you receiving another scholarship, salary, stipend or financial assistance during the course?','क्या पाठ्यक्रम के दौरान अन्य छात्रवृत्ति, वेतन, वजीफा या आर्थिक सहायता मिल रही है?'),
 kisanExcluded:c('Does your family fall under any of the PM-KISAN exclusions listed below?','क्या आपका परिवार नीचे दिए PM-KISAN के किसी अपवर्जन में आता है?'),
 pensionExcluded:c('Are you an income-tax payer, covered by EPFO/ESIC/NPS, or receiving another government pension?','क्या आप आयकरदाता हैं, EPFO/ESIC/NPS में शामिल हैं या अन्य सरकारी पेंशन लेते हैं?'),
 existingLpg:c('Does your household already have an LPG connection?','क्या आपके परिवार में पहले से LPG कनेक्शन है?'),
 puccaHouse:c('Does any family member own a pucca house anywhere in India?','क्या परिवार के किसी सदस्य का भारत में कहीं भी पक्का घर है?'),
 housingBenefit:c('Has your family received a government housing allotment/benefit in the last 20 years?','क्या आपके परिवार को पिछले 20 वर्षों में सरकारी आवास आवंटन/लाभ मिला है?'),
 maternityExcluded:c('Are you regularly employed by Central/State government or a PSU, or receiving similar maternity benefits under law?','क्या आप नियमित केंद्रीय/राज्य सरकारी या PSU कर्मचारी हैं या कानून के तहत समान मातृत्व लाभ लेती हैं?'),
}
questions.forEach(q=>{if(exclusionQuestions[q.id])q.text=exclusionQuestions[q.id]})
const plainQuestions:Record<string,Copy> = {
 "technical":c("Are you enrolled in an AICTE-approved technical degree?","क्या आप AICTE से मान्य तकनीकी डिग्री में पढ़ रहे हैं?"),
 "woman":c("Is the applicant a woman or girl?","क्या आवेदक महिला या लड़की है?"),
 "pragatiFamily":c("Will no more than two girls from your family receive Pragati?","क्या आपके परिवार से अधिकतम दो लड़कियाँ प्रगति का लाभ लेंगी?"),
 "labourParent":c("Does a parent work in one of the listed labour sectors?","क्या माता या पिता सूचीबद्ध श्रम क्षेत्रों में काम करते हैं?"),
 "labourStudy":c("Does your course meet the study conditions below?","क्या आपका पाठ्यक्रम नीचे दी गई पढ़ाई की शर्तें पूरी करता है?"),
 "farmerLand":c("Does your family hold cultivable land under the scheme’s rules?","क्या योजना के नियमों के अनुसार आपके परिवार के पास खेती की भूमि है?"),
 "citizen":c("Is the applicant an Indian citizen?","क्या आवेदक भारतीय नागरिक है?"),
 "unorganised":c("Do you work in the unorganised sector?","क्या आप असंगठित क्षेत्र में काम करते हैं?"),
 "newUnit":c("Is this a new business meeting the PMEGP conditions below?","क्या यह नया व्यवसाय नीचे दी गई PMEGP शर्तें पूरी करता है?"),
 "pmegpEducation":c("Do you meet the education condition for your project size?","क्या आप अपनी परियोजना के आकार के लिए शिक्षा की शर्त पूरी करते हैं?"),
 "pmegpFamily":c("Will only one person — you or your spouse — receive PMEGP assistance?","क्या आप या आपके जीवनसाथी में से केवल एक व्यक्ति PMEGP सहायता लेगा?"),
 "ujjwalaPoor":c("Does your household meet the PMUY poor-household conditions?","क्या आपका परिवार PMUY की गरीब परिवार संबंधी शर्तें पूरी करता है?"),
 "urban":c("Does your family live in an urban area?","क्या आपका परिवार शहरी क्षेत्र में रहता है?"),
 "nfsaListed":c("Is your household listed as NFSA Priority (PHH) or Antyodaya (AAY)?","क्या आपका परिवार NFSA प्राथमिकता (PHH) या अंत्योदय (AAY) में सूचीबद्ध है?"),
 "maternityAge":c("Is the mother between 18 years 7 months and 55 years old?","क्या माता की आयु 18 वर्ष 7 माह से 55 वर्ष के बीच है?"),
 "maternityChild":c("Is this the first child, or a second child who is a girl?","क्या यह पहला बच्चा है, या दूसरा बच्चा लड़की है?"),
 "maternityCategory":c("Do you have one of the eligibility proofs listed below?","क्या आपके पास नीचे सूचीबद्ध पात्रता प्रमाणों में से कोई एक है?"),
 "maternityTiming":c("Do you meet the registration and health-check conditions below?","क्या आप नीचे दी गई पंजीकरण और स्वास्थ्य जाँच की शर्तें पूरी करते हैं?"),
 "recognizedDisability":c("Do you have a disability covered by the RPwD Act?","क्या आपको RPwD अधिनियम में शामिल कोई दिव्यांगता है?"),
 "bankConsent":c("Do you have a participating bank/post-office account and agree to premium auto-debit?","क्या आपका सहभागी बैंक/डाकघर खाता है और आप प्रीमियम ऑटो-डेबिट से सहमत हैं?"),
 "jsskCare":c("Will a pregnant woman or sick infant receive care at a public health facility?","क्या गर्भवती महिला या बीमार शिशु सरकारी स्वास्थ्य संस्थान में सेवा लेगा?"),
 "mudraActivity":c("Is the loan for an income-generating microenterprise?","क्या ऋण आय देने वाले सूक्ष्म व्यवसाय के लिए है?"),
 "jobseeker":c("Are you looking for work, career guidance or skill information?","क्या आप काम, करियर मार्गदर्शन या कौशल की जानकारी खोज रहे हैं?"),
}
questions.forEach(q=>{if(plainQuestions[q.id])q.text=plainQuestions[q.id]})
export function relevantQuestions(answers:Answers,chosen:readonly Category[]=['education']):Question[] {
 const schemes=catalog.filter(s=>s.categories.some(c=>chosen.includes(c))).filter(s=>{
  const level=s.rules.find(r=>r.field==='level')
  return !level||!answers.level||answers.level==='unknown'||passes(level,answers.level)
 })
 const fields=new Set(schemes.flatMap(s=>s.rules.map(r=>r.field)))
 const education=chosen.includes('education')
 return questions.filter(q=>(q.id==='level'&&education)||fields.has(q.id))
}
export const allCategoryIds=categories.map(c=>c.id)
