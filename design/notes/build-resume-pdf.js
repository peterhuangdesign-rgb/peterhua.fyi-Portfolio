global.window={};global.document={addEventListener(){},getElementById(){return null}};global.matchMedia=()=>({matches:false});global.addEventListener=()=>{};global.performance={now:()=>0};global.requestAnimationFrame=()=>{};
require('/home/claude/peterhua.fyi-portfolio/shared/core.js');
const R=window.Presence?null:null;
const fs=require('fs');
const src=fs.readFileSync('/home/claude/peterhua.fyi-portfolio/shared/core.js','utf8');
const RES=window.Presence.RESUME;
const e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const F="/home/claude/peterhua.fyi-portfolio/media/fonts/";
const mark=fs.readFileSync('/home/claude/peterhua.fyi-portfolio/index.html','utf8').match(/<svg class="mark"[\s\S]*?<\/svg>/)[0].replace('class="mark"','width="15" height="50"').replace("<path ",'<path fill="#15181A" ').replace("<rect ",'<rect fill="#7A5636" ').replace(/<path d=/g,'<path fill="#15181A" d=');
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
fs.writeFileSync('resume.html',html);
