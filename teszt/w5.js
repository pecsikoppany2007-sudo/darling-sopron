// telefonos szélesség-ellenőrzés a koktéllistára
const {chromium,devices}=require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await (await b.newContext({...devices['iPhone 13']})).newPage();
 await p.addInitScript(()=>{sessionStorage.setItem('dl-intro','1')});
 await p.goto('http://localhost:8811/',{waitUntil:'load'}); await p.waitForTimeout(1500);
 console.log(JSON.stringify(await p.evaluate(()=>['.bar__pin','.bar__l','#cList','#cList li','#cList .pr','#cList b'].map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return [s,Math.round(r.left),Math.round(r.right),c.display,c.gridTemplateColumns]}))));
 await b.close();
})();
