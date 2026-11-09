// gyors szakaszképek intro nélkül. node teszt/shot3.js [desk|phone] [lang]
const {chromium,devices}=require('playwright');
(async()=>{
 const mode=process.argv[2]||'desk', lang=process.argv[3]||'hu';
 const b=await chromium.launch();
 const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13'],locale:lang}):await b.newContext({viewport:{width:1440,height:900},locale:lang});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push('ERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await p.addInitScript(l=>{sessionStorage.setItem('dl-intro','1');localStorage.setItem('dl-lang',l)},lang);
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 const out='/tmp/claude-0/v3-'+mode+'-'+lang; const shots=[];
 for(const [id,off] of [['rolunk',-70],['rolunk',600],['etlap',-70],['bar',0],['foglalas',-70]]){
   await p.evaluate(([id,off])=>{const e=document.getElementById(id);const y=e.getBoundingClientRect().top+scrollY+off;if(window.__lenis)window.__lenis.scrollTo(y,{immediate:true});else scrollTo(0,y)},[id,off]);
   await p.waitForTimeout(2600); const f=out+'-'+shots.length+'.jpg'; await p.screenshot({path:f,type:'jpeg',quality:60}); shots.push(f);
 }
 if(mode==='desk'){ for(const t of [2,5]){ await p.evaluate(()=>{const e=document.getElementById('etlap');window.__lenis.scrollTo(e.getBoundingClientRect().top+scrollY-70,{immediate:true})}); await p.waitForTimeout(800); await p.click('#tab'+t); await p.waitForTimeout(1600); const f=out+'-'+shots.length+'.jpg'; await p.screenshot({path:f,type:'jpeg',quality:60}); shots.push(f);} }
 console.log(errs.join('\n')||'no errors'); console.log(shots.join(' '));
 await b.close();
})();
