// nyitás füsttel: képkockák. node teszt/introsmk.js
const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[];
 p.on('pageerror',e=>errs.push('ERR '+e.message));
 await p.goto('http://localhost:8811/',{waitUntil:'load'});
 const t0=Date.now(); const out=[];
 for(const t of [2600,3600,4600,5800,7200]){ const w=t-(Date.now()-t0); if(w>0) await p.waitForTimeout(w); const f='/tmp/claude-0/intro-'+t+'.jpg'; await p.screenshot({path:f,type:'jpeg',quality:60}); out.push(f); }
 console.log(errs.join('\n')||'no errors'); console.log(out.join(' ')); await b.close();
})();
