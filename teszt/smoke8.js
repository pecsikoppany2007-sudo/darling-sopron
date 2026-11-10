// v8 füst: nyitás, lámpa, koktélok, két képkocka fél másodperc különbséggel (hamis GPU-val). node teszt/smoke8.js
const {chromium,devices}=require('playwright');
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errs=[], out=[];
 const mk=async(opt)=>{const p=await (await b.newContext(opt)).newPage(); p.on('pageerror',e=>errs.push('ERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())}); await p.addInitScript({path:__dirname+'/fakegpu.js'}); return p;};
 let p=await mk({viewport:{width:1440,height:900}});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); const t0=Date.now();
 for(const t of [3900,5200,7600]){const w=t-(Date.now()-t0); if(w>0) await p.waitForTimeout(w); const f='/tmp/claude-0/s8-intro-'+t+'.jpg'; await p.screenshot({path:f,type:'jpeg',quality:65}); out.push(f);}
 await p.waitForTimeout(1500);
 const go=async(js)=>{await p.evaluate(js); await p.waitForTimeout(3500)};
 await go(()=>{const e=document.getElementById('etlap');window.__lenis.scrollTo(e.getBoundingClientRect().top+scrollY-70,{immediate:true})});
 for(const n of ['a','b']){const f='/tmp/claude-0/s8-lamp-'+n+'.jpg'; await p.screenshot({path:f,type:'jpeg',quality:70}); out.push(f); await p.waitForTimeout(700);}
 await go(()=>{const r=document.getElementById('barRun');window.__lenis.scrollTo(r.getBoundingClientRect().top+scrollY+r.offsetHeight-innerHeight-10,{immediate:true})});
 for(const n of ['a','b']){const f='/tmp/claude-0/s8-bar-'+n+'.jpg'; await p.screenshot({path:f,type:'jpeg',quality:70}); out.push(f); await p.waitForTimeout(700);}
 console.log('desk', await p.evaluate(()=>document.documentElement.classList.contains('gl-smoke')));
 p=await mk({...devices['iPhone 13']});
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1')});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 await p.evaluate(()=>{const e=document.getElementById('bar');scrollTo(0,e.getBoundingClientRect().top+scrollY)}); await p.waitForTimeout(3500);
 let f='/tmp/claude-0/s8-phone-bar.jpg'; await p.screenshot({path:f,type:'jpeg',quality:70}); out.push(f);
 console.log('phone', await p.evaluate(()=>document.documentElement.classList.contains('gl-smoke')));
 console.log(errs.join('\n')||'no errors'); console.log(out.join(' ')); await b.close();
})();
