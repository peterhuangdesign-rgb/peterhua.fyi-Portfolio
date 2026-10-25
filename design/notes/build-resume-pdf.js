/* Builds media/resume-human-factors.pdf from RESUME in shared/core.js, so the download matches Profile and the résumé page.
   Run from the repo root:  node design/notes/build-resume-pdf.js
   Needs Node and Playwright with Chromium (npx playwright install chromium). Keep the result to one page. */
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','..');
global.window={};global.document={addEventListener(){},getElementById(){return null}};global.matchMedia=()=>({matches:false});global.addEventListener=()=>{};global.performance={now:()=>0};global.requestAnimationFrame=()=>{};
require(path.join(ROOT,'shared','core.js'));
const RES=window.Presence.RESUME;
const e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const F=path.join(ROOT,'media','fonts')+'/';
const mark=`<svg width="15" height="50" viewBox="42 555 402 1328" aria-hidden="true"><path fill="#15181A" d="M265 972Q226 972 199 958.5Q172 945 154.5 927Q137 909 128.5 893Q120 877 118 872H116V1130H50V555H105L116 657H118Q120 652 128 636Q136 620 152.5 601Q169 582 196.5 568.5Q224 555 265 555Q324 555 364 582Q404 609 424 656.5Q444 704 444 765Q444 825 423.5 872Q403 919 363 945.5Q323 972 265 972ZM252 915Q299 915 327.5 893Q356 871 368.5 836.5Q381 802 381 764Q381 725 367 691Q353 657 323.5 635.5Q294 614 246 614Q207 614 178 632Q149 650 133.5 684Q118 718 118 764Q118 810 134.5 844.5Q151 879 181.5 897Q212 915 252 915Z"/><rect fill="#7A5636" x="42" y="1200" width="402" height="50"/><path fill="#15181A" d="M42 1883V1320H107V1577H109Q111 1572 118.5 1555.5Q126 1539 142 1521Q158 1503 185 1489.5Q212 1476 253 1476Q295 1476 323 1488.5Q351 1501 368 1523Q385 1545 393.5 1572.5Q402 1600 405 1628Q408 1656 408 1682V1883H345V1682Q345 1638 335.5 1604.5Q326 1571 302.5 1552.5Q279 1534 235 1534Q189 1534 161 1555.5Q133 1577 120 1612.5Q107 1648 107 1690V1883Z"/></svg>`;
const html=`<!doctype html><html><head><meta charset="utf-8"><title>Peter Huang — Résumé</title><style>
@font-face{font-family:DG;font-weight:500;src:url(file://${F}darker-grotesque-latin-500-normal.woff2)}
@font-face{font-family:DG;font-weight:600;src:url(file://${F}darker-grotesque-latin-600-normal.woff2)}
@font-face{font-family:AS;font-weight:400;src:url(file://${F}albert-sans-latin-400-normal.woff2)}
@font-face{font-family:AS;font-weight:500;src:url(file://${F}albert-sans-latin-500-normal.woff2)}
@page{size:letter;margin:0.3in 0.5in}
body{margin:0;font:400 8.8pt/1.24 AS,sans-serif;color:#15181A}
header{display:flex;align-items:center;gap:12px;padding-bottom:7px;border-bottom:1px solid #15181A}
header .div{width:1px;height:38px;background:#15181A}
h1{margin:0;font:600 25pt/1 DG,sans-serif}
.role{font:500 8pt/1.3 AS;letter-spacing:.12em;text-transform:uppercase;color:#585E62;margin-top:3px}
.contact{margin-left:auto;text-align:right;font-size:8.6pt;color:#15181A;line-height:1.5}
h2{margin:6px 0 3px;font:500 8pt/1.3 AS;letter-spacing:.14em;text-transform:uppercase;color:#585E62;border-bottom:1px solid #15181A33;padding-bottom:2px}
.it{margin:0 0 3px;break-inside:avoid}
.hd{display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.hd b{font:600 12pt/1.1 DG,sans-serif}.hd span{font-size:8.6pt;color:#585E62;white-space:nowrap}
.sub{font-size:9pt}.ctx{font-size:8.6pt;color:#585E62;text-transform:lowercase}
ul{margin:2px 0 0;padding-left:14px}li{margin:0 0 1px}
.sk{display:grid;grid-template-columns:110px 1fr;gap:1px 10px;font-size:8.4pt;line-height:1.25}.sk dt{font-weight:500}.sk dd{margin:0}
.two{display:grid;grid-template-columns:1.25fr 1fr;gap:0 22px}.st{display:grid;gap:2px;font-size:8.4pt;line-height:1.28}.st b{font-weight:500}.st span{color:#585E62}</style></head><body>
<header>${mark}<span class="div"></span><div><h1>Peter Huang</h1><div class="role">UX research / human factors</div></div>
<div class="contact">${(c=>[c[0]+" · "+c[1],c[2],c[3]+" · "+c[4]].map(e).join("<br>"))(RES.contact.split(" · "))}</div></header>
<h2>Education</h2>
<div class="it"><div class="hd"><b>${e(RES.education.school)}</b><span>${e(RES.education.when)}</span></div><div class="sub"><b style="font-weight:500">${e(RES.education.degree)}</b> · ${e(RES.education.minors)}</div><div class="sub" style="color:#585E62">${e(RES.education.unit)} · ${e(RES.education.extra)}</div><div class="sub" style="color:#585E62">Coursework: ${e(RES.education.courses)}</div></div>
<h2>Experience</h2>
${RES.experience.map(x=>`<div class="it"><div class="hd"><b>${e(x.org)}</b><span>${e(x.when)}</span></div><div class="sub">${e(x.role)} <span class="ctx">· ${x.ctx.map(e).join(" / ")}</span></div><ul>${x.pts.map(p=>`<li>${e(p)}</li>`).join("")}</ul></div>`).join("")}
<h2>Research</h2>
${RES.research.map(([t,d,w])=>`<div class="it"><div class="hd"><b>${e(t)}</b><span>${e(w)}</span></div><div class="sub">${e(d)}</div></div>`).join("")}
<div class="two"><div><h2>Strengths</h2>
<div class="st">${RES.strengths.map(([a,b])=>`<div><b>${e(a)}</b> · <span>${e(b)}</span></div>`).join("")}</div></div>
<div><h2>Skills</h2>
<div class="st">${RES.skills.map(([a,b])=>`<div><b>${e(a)}</b> · <span>${e(b)}</span></div>`).join("")}</div></div></div>
</body></html>`;
const out=path.join(ROOT,'media','resume-human-factors.pdf'),tmp=path.join(__dirname,'.resume.html');fs.writeFileSync(tmp,html);
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const pg=await b.newPage();await pg.goto('file://'+tmp);await pg.waitForTimeout(500);
  await pg.pdf({path:out,format:'Letter',printBackground:true,preferCSSPageSize:true});await b.close();fs.unlinkSync(tmp);console.log('wrote',out)})();
