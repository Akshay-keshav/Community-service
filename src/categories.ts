import { c, type Copy } from './i18n.ts'
export const categories = [
 { id:'education', name:c('Education & Scholarships','शिक्षा और छात्रवृत्तियाँ'), icon:'✎' },
 { id:'health', name:c('Health','स्वास्थ्य'), icon:'♡' },
 { id:'agriculture', name:c('Agriculture','कृषि'), icon:'♧' },
 { id:'jobs', name:c('Jobs & Skills','रोज़गार और कौशल'), icon:'↗' },
 { id:'business', name:c('Business & Self-Employment','व्यवसाय और स्वरोज़गार'), icon:'▤' },
 { id:'housing', name:c('Housing & Utilities','आवास और ज़रूरी सुविधाएँ'), icon:'⌂' },
 { id:'food', name:c('Food & Essential Support','खाद्य और आवश्यक सहायता'), icon:'◉' },
 { id:'pensions', name:c('Pensions & Social Security','पेंशन और सामाजिक सुरक्षा'), icon:'◷' },
 { id:'women', name:c('Women & Children','महिलाएँ और बच्चे'), icon:'❋' },
 { id:'disability', name:c('Disability Support','दिव्यांगजन सहायता'), icon:'◇' },
] as const
export type Category = typeof categories[number]['id']
export const states: { id:string; name:Copy }[] = [
 ['AN','Andaman and Nicobar Islands','अंडमान और निकोबार द्वीपसमूह'],['AP','Andhra Pradesh','आंध्र प्रदेश'],['AR','Arunachal Pradesh','अरुणाचल प्रदेश'],['AS','Assam','असम'],['BR','Bihar','बिहार'],['CH','Chandigarh','चंडीगढ़'],['CG','Chhattisgarh','छत्तीसगढ़'],['DN','Dadra and Nagar Haveli and Daman and Diu','दादरा और नगर हवेली और दमन और दीव'],['DL','Delhi','दिल्ली'],['GA','Goa','गोवा'],['GJ','Gujarat','गुजरात'],['HR','Haryana','हरियाणा'],['HP','Himachal Pradesh','हिमाचल प्रदेश'],['JK','Jammu and Kashmir','जम्मू और कश्मीर'],['JH','Jharkhand','झारखंड'],['KA','Karnataka','कर्नाटक'],['KL','Kerala','केरल'],['LA','Ladakh','लद्दाख'],['LD','Lakshadweep','लक्षद्वीप'],['MP','Madhya Pradesh','मध्य प्रदेश'],['MH','Maharashtra','महाराष्ट्र'],['MN','Manipur','मणिपुर'],['ML','Meghalaya','मेघालय'],['MZ','Mizoram','मिज़ोरम'],['NL','Nagaland','नागालैंड'],['OD','Odisha','ओडिशा'],['PY','Puducherry','पुदुच्चेरी'],['PB','Punjab','पंजाब'],['RJ','Rajasthan','राजस्थान'],['SK','Sikkim','सिक्किम'],['TN','Tamil Nadu','तमिलनाडु'],['TS','Telangana','तेलंगाना'],['TR','Tripura','त्रिपुरा'],['UP','Uttar Pradesh','उत्तर प्रदेश'],['UK','Uttarakhand','उत्तराखंड'],['WB','West Bengal','पश्चिम बंगाल'],
].map(([id,en,hi])=>({id,name:c(en,hi)}))
