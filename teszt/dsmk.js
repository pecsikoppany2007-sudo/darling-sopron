// koktélfüst ellenőrzés
const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1')});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 await p.evaluate(()=>{const r=document.getElementById('barRun');window.__lenis.scrollTo(r.getBoundingClientRect().top+scrollY+300,{immediate:true})}); await p.waitForTimeout(2000);
 console.log(JSON.stringify(await p.evaluate(()=>{const d=document.querySelector('.dsmk');if(!d)return 'none';const r=d.getBoundingClientRect(),c=getComputedStyle(d),i=getComputedStyle(d.firstChild);return {r:[r.left,r.top,r.width,r.height].map(Math.round),cls:d.className,par:d.parentNode.id,op:i.opacity,bg:i.backgroundImage.slice(0,60),deckOv:getComputedStyle(d.parentNode).overflow,deckZ:getComputedStyle(d.parentNode).zIndex}})));
 await p.screenshot({path:'/tmp/claude-0/dsmk.jpg',type:'jpeg',quality:70}); await b.close();
})();
