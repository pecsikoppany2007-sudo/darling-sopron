// menüpontok a címre érkeznek, nincs láthatatlan takarás, csökkentett mozgás is hibátlan
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const out=[];
for(const [name,opt] of [['desk',{viewport:{width:1440,height:900}}],['tablet',{viewport:{width:900,height:1100},hasTouch:true}],['reduced',{viewport:{width:1440,height:900},reducedMotion:'reduce'}]]){
 const p=await b.newPage(opt);const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1');localStorage.setItem('dl-lang','hu')});
 await p.goto('http://localhost:8811/');await p.waitForTimeout(2200);
 for(const id of ['etlap','bar','italok','foglalas','rendeles','nyitvatartas']){
  if(name==='tablet'){await p.evaluate(()=>scrollBy(0,-200));await p.waitForTimeout(600);await p.click('#burger');await p.waitForTimeout(400);await p.click('#mnav a[href="#'+id+'"]');}
  else{await p.evaluate(()=>scrollBy(0,-200));await p.waitForTimeout(500);await p.click('.hd__nav a[href="#'+id+'"]');}
  await p.waitForTimeout(2400);
  const r=await p.evaluate(id=>{const s=document.getElementById(id);const h=s.querySelector('h2');const t=Math.round(h.getBoundingClientRect().top);const el=document.elementFromPoint(innerWidth/2,innerHeight/2);return {t,cov:!!el.closest('.intro,.mnav:not([hidden])')}},id);
  if(r.t<0||r.t>innerHeightFor(name)||r.cov)out.push(name+' '+id+' top '+r.t+(r.cov?' COVERED':''));
 }
 const invis=await p.evaluate(()=>[...document.querySelectorAll('h2,.dish,.clist li')].filter(e=>getComputedStyle(e).opacity==='0').length);
 if(invis)out.push(name+' invisible '+invis);
 if(errs.length)out.push(name+' ERR '+errs.join('|'));await p.close()}
function innerHeightFor(n){return n==='tablet'?700:600}
console.log(out.join('\n')||'all ok');await b.close()})();
