const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900},locale:'de'});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>localStorage.setItem('dl-lang','de'));
await p.goto('http://localhost:8811/');await p.waitForTimeout(2600);
console.log(await p.evaluate(()=>[getComputedStyle(document.querySelector('#introL1 b')).opacity,document.querySelector('#introL2').textContent,document.querySelector('#introSub').textContent]));
await p.mouse.click(500,500);await p.waitForTimeout(1200);
console.log('intro gone',await p.evaluate(()=>!document.getElementById('intro')),'title in',await p.evaluate(()=>document.getElementById('heroTitle').classList.contains('is-in')),'dark',await p.evaluate(()=>getComputedStyle(document.getElementById('heroDark')).opacity));
await p.goto('http://localhost:8811/');await p.waitForTimeout(1500);
console.log('2nd visit intro',await p.evaluate(()=>document.documentElement.classList.contains('intro-on')));
// full run timing
const p2=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();await p2.goto('http://localhost:8811/');await p2.waitForTimeout(9500);
console.log('full run removed',await p2.evaluate(()=>!document.getElementById('intro')),await p2.evaluate(()=>getComputedStyle(document.getElementById('heroDark')).opacity));
console.log(errs.join('\n')||'no errors');await b.close()})();
