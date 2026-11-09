// gyors képernyőképek: intro, szakaszok, telefon. Használat: node teszt/shot.js [desk|phone] [lang]
const {chromium,devices}=require('playwright');
(async()=>{
 const mode=process.argv[2]||'desk', lang=process.argv[3]||'hu';
 const b=await chromium.launch();
 const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13'],locale:lang}):await b.newContext({viewport:{width:1440,height:900},locale:lang});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push('ERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await p.addInitScript(l=>{try{localStorage.setItem('dl-lang',l)}catch(e){}},lang);
 await p.goto('http://localhost:8811/',{waitUntil:'load'});
 const out='/tmp/claude-0/s-'+mode+'-'+lang;
 if(mode==='desk'){await p.waitForTimeout(700);await p.screenshot({path:out+'-i1.jpg',type:'jpeg',quality:60});await p.waitForTimeout(900);await p.screenshot({path:out+'-i2.jpg',type:'jpeg',quality:60});}
 await p.waitForTimeout(3200);
 await p.screenshot({path:out+'-0.jpg',type:'jpeg',quality:60});
 const ids=['rolunk','etlap','bar','italok','foglalas','rendeles','nyitvatartas','ft'];
 for(const id of ids){
   await p.evaluate(id=>{const e=document.getElementById(id);const y=e.getBoundingClientRect().top+scrollY-(id==='ft'?0:70);if(window.__lenis)window.__lenis.scrollTo(id==='ft'?document.body.scrollHeight:y,{immediate:true});else scrollTo(0,id==='ft'?document.body.scrollHeight:y)},id);
   await p.waitForTimeout(1700);
   await p.screenshot({path:out+'-'+id+'.jpg',type:'jpeg',quality:60});
 }
 const sw=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 console.log(errs.join('\n')||'no errors','sw',sw);
 await b.close();
})();
