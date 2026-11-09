// címek és sorok kilógása minden szélességen és nyelven
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const bad=[];
for(const lang of ['hu','de','en'])for(const w of (process.env.W?process.env.W.split(',').map(Number):[320,375,414,768,1024,1280,1440,1920])){
 const p=await b.newPage({viewport:{width:w,height:860}});
 await p.addInitScript(l=>{try{localStorage.setItem('dl-lang',l);sessionStorage.setItem('dl-intro','1')}catch(e){}},lang);
 await p.goto('http://localhost:8811/');await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const o=[];const sw=document.documentElement.scrollWidth;if(sw>innerWidth)o.push('scrollWidth '+sw);
  document.querySelectorAll('.bl .ln__i,.dish__n,.clist b,.hours th,.addr__v,.facts dd,.go').forEach(e=>{const r=e.getBoundingClientRect();const pr=e.closest('section,footer,header')||document.body;const pb=pr.getBoundingClientRect();if(r.right>pb.right+1||r.left<pb.left-1)o.push((e.className||e.tagName)+':'+e.textContent.slice(0,30)+' '+Math.round(r.right)+'>'+Math.round(pb.right))});return o});
 if(r.length)bad.push(lang+' '+w+': '+r.slice(0,4).join(' | '));await p.close()}
console.log(bad.join('\n')||'all fit');await b.close()})();
