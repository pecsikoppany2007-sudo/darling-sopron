// füstvászon be/ki különbség a koktéloknál (hamis GPU-val)
const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
 p.on('console',m=>console.log('LOG',m.text()));
 await p.addInitScript({path:__dirname+'/fakegpu.js'});
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1')});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 await p.evaluate(()=>{const r=document.getElementById('barRun');window.__lenis.scrollTo(r.getBoundingClientRect().top+scrollY+r.offsetHeight-innerHeight-10,{immediate:true})}); await p.waitForTimeout(3000);
 console.log(await p.evaluate(()=>{const c=document.getElementById('smoke');return [c.width,c.height,getComputedStyle(c).display,getComputedStyle(c).zIndex].join(' ')}));
 await p.screenshot({path:'/tmp/claude-0/d-on.png'});
 await p.evaluate(()=>document.getElementById('smoke').style.visibility='hidden'); await p.waitForTimeout(100);
 await p.screenshot({path:'/tmp/claude-0/d-off.png'}); await b.close();
})();
