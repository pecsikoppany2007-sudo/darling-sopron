// füst + falfolt ellenőrzés gépi módban (hamis GPU-val). node teszt/smoke.js
const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push('ERR '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});
 await p.addInitScript({path:__dirname+'/fakegpu.js'});
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1');localStorage.setItem('dl-lang','hu')});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 for(const [id,off,n] of [['rolunk',-70,0],['etlap',-70,1],['foglalas',-70,2]]){
  await p.evaluate(([id,off])=>{const e=document.getElementById(id);window.__lenis.scrollTo(e.getBoundingClientRect().top+scrollY+off,{immediate:true})},[id,off]);
  await p.mouse.move(700,500); await p.waitForTimeout(300);
  for(let i=0;i<20;i++){await p.mouse.move(700+i*12,520+i*6); await p.waitForTimeout(30);}
  await p.waitForTimeout(2600);
  await p.screenshot({path:'/tmp/claude-0/v4-smoke-'+n+'.jpg',type:'jpeg',quality:70});
 }
 const st=await p.evaluate(()=>({gl:document.documentElement.classList.contains('gl-smoke'),cv:[document.getElementById('smoke').width,document.getElementById('smoke').height],spots:[...document.querySelectorAll('.wall__spot.is-on')].length}));
 console.log(JSON.stringify(st)); console.log(errs.join('\n')||'no errors'); await b.close();
})();
