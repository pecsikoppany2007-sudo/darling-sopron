// v5 ellenőrzés: kúp, listák ráállva, füstsávok. node teszt/shot5.js
const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const out=[];const errs=[];
 for(const [w,h] of [[1440,900],[1280,720]]){
 const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();
 p.on('pageerror',e=>errs.push('ERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await p.addInitScript({path:__dirname+'/fakegpu.js'});
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1');localStorage.setItem('dl-lang','hu')});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 const go=async(id,off)=>{await p.evaluate(([id,off])=>{const e=document.getElementById(id);window.__lenis.scrollTo(e.getBoundingClientRect().top+scrollY+off,{immediate:true})},[id,off]);await p.waitForTimeout(2400)};
 const shot=async n=>{const f='/tmp/claude-0/v5-'+w+'-'+n+'.jpg';await p.screenshot({path:f,type:'jpeg',quality:70});out.push(f)};
 if(w===1440){ await p.mouse.move(1300,200); await shot('hero');
  await go('etlap',-70); const d=await p.$$('.dish'); await d[1].hover(); await p.waitForTimeout(1200); await shot('menu'); }
 await go('bar',0); await p.evaluate(()=>{const r=document.getElementById('barRun');window.__lenis.scrollTo(r.getBoundingClientRect().top+scrollY+r.offsetHeight-innerHeight-10,{immediate:true})}); await p.waitForTimeout(2400);
 const li=await p.$$('#cList li'); await li[2].hover(); await p.waitForTimeout(900); await shot('bar');
 const ov=await p.evaluate(()=>{const pin=document.getElementById('barPin').getBoundingClientRect();const l=document.querySelector('.bar__l').getBoundingClientRect();return [Math.round(pin.bottom),Math.round(l.bottom),innerHeight]}); console.log(w,'pin/list bottom',ov);
 if(w===1440){ await go('italok',-70); const dl=await p.$$('.dl li'); await dl[1].hover(); await p.waitForTimeout(900); await shot('drinks');
  await p.evaluate(()=>window.__lenis.scrollTo(document.body.scrollHeight,{immediate:true})); await p.waitForTimeout(2000); await shot('ft'); }
 await p.close(); }
 console.log(errs.join('\n')||'no errors'); console.log(out.join(' ')); await b.close();
})();
