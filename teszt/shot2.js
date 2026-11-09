// v2: intro képkockák + szakaszok, egy kontaktlapra. node teszt/shot2.js [desk|phone] [lang]
const {chromium,devices}=require('playwright');
(async()=>{
 const mode=process.argv[2]||'desk', lang=process.argv[3]||'hu';
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader']});
 const ctx=mode==='phone'?await b.newContext({...devices['iPhone 13'],locale:lang}):await b.newContext({viewport:{width:1440,height:900},locale:lang});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push('ERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await p.addInitScript(l=>{try{localStorage.setItem('dl-lang',l)}catch(e){}},lang);
 await p.goto('http://localhost:8811/',{waitUntil:'load'});
 const out='/tmp/claude-0/v2-'+mode+'-'+lang; let n=0; const shots=[];
 const sh=async()=>{const f=out+'-'+(n++)+'.jpg';await p.screenshot({path:f,type:'jpeg',quality:55});shots.push(f)};
 for(const t of [900,1300,1300,1100,900,900,1500]){await p.waitForTimeout(t);await sh();}
 await p.mouse.move(700,400);
 for(const id of ['rolunk','etlap','bar','italok','foglalas','rendeles','nyitvatartas','ft']){
   await p.evaluate(id=>{const e=document.getElementById(id);const y=e.getBoundingClientRect().top+scrollY-(id==='ft'?0:70);if(window.__lenis)window.__lenis.scrollTo(id==='ft'?document.body.scrollHeight:y,{immediate:true});else scrollTo(0,id==='ft'?document.body.scrollHeight:y)},id);
   await p.waitForTimeout(2000); await sh();
 }
 const sw=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 console.log(errs.join('\n')||'no errors','sw',sw); console.log(shots.join(' '));
 await b.close();
})();
