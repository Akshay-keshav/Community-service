import { type Answers, type Scheme, type Rule, type ApplicationStatus } from './catalog.ts'
export type MatchStatus = 'likely' | 'missing' | 'fail'
export function passes(rule: Rule, value: string): boolean {
 if(rule.op==='eq') return value===rule.value
 if(rule.op==='in') return Array.isArray(rule.value)&&rule.value.includes(value)
 if(!value.trim()||value==='unknown') return false
 const n=Number(value)
 if(!Number.isFinite(n)||!Number.isInteger(n)||n<0) return false
 switch(rule.op){case 'lt':return n<Number(rule.value);case 'lte':return n<=Number(rule.value);case 'gt':return n>Number(rule.value);case 'gte':return n>=Number(rule.value)}
}
export function match(scheme:Scheme,answers:Answers):{status:MatchStatus;failed:Rule[];missing:Rule[]} {
 const missing=scheme.rules.filter(r=>!answers[r.field]?.trim()||answers[r.field]==='unknown')
 const failed=scheme.rules.filter(r=>answers[r.field]?.trim()&&answers[r.field]!=='unknown'&&!passes(r,answers[r.field]))
 return {status:failed.length?'fail':missing.length?'missing':'likely',failed,missing}
}
export const indiaDate=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'})
export function applicationStatus(s:Scheme,date=indiaDate()):ApplicationStatus {
 if(s.window.status==='offline') return 'offline'
 if(s.window.end&&date>s.window.end) return 'closed'
 if(s.window.status==='closed') return s.window.end&&date<=s.window.end?'unconfirmed':'closed'
 if(s.window.status==='open') {
  if(s.window.start&&s.window.end&&date>=s.window.start&&date<=s.window.end) return 'open'
  if(s.window.continuous&&s.window.reviewBy&&date<=s.window.reviewBy&&date>=s.window.checked) return 'open'
 }
 return 'unconfirmed'
}
export const applicationOpen=(s:Scheme,date=indiaDate())=>applicationStatus(s,date)==='open'
export function officialAction(s:Scheme,date=indiaDate()) {
 const apply=applicationOpen(s,date)&&s.mode!=='offline'&&s.applicationRoute?.kind==='portal'
 if(apply) return {url:s.applicationUrl,label:'apply' as const}
 if(s.applicationRoute?.kind==='directory') return {url:s.applicationUrl,label:'directory' as const}
 if(s.portalVerification&&s.mode!=='offline') return {url:s.applicationUrl,label:'portal' as const}
 return {url:s.instructionsUrl,label:'instructions' as const}
}

// Deadline information is separate from verified online availability.
export function applicationNotice(s:Scheme,date=indiaDate()):ApplicationStatus|'noDeadline'|'deadlineNotListed'|'personalDeadline' {
 const status=applicationStatus(s,date)
 if(status!=='unconfirmed') return status
 switch(s.window.deadline){
  case 'none': return 'noDeadline'
  case 'not-published': return 'deadlineNotListed'
  case 'personal': return 'personalDeadline'
  default: return status
 }
}
