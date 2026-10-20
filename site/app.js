/* Site router.
   First visit (no hash, never visited) → #story, a scroll-driven introduction. Afterwards → #home.
   In production: peterhua.fyi serves the story to first-time visitors, peterhua.fyi/home is the main page. */
(function(){
const {DATA,CONTACT,THEMES,THEME_ALIAS,caseHTML,profileHTML,wireProfile,Fog,reduce,esc}=Presence;
const $=id=>document.getElementById(id);
const main=$("main"),nav4=$("nav4"),sub=$("sub"),subList=$("sub-list"),prog=$("prog"),story=$("story");
const byId=id=>DATA.all.find(p=>p.id===id);
const SECTIONS={research:DATA.researchAll,design:DATA.design};
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- background ---------- */
const S=Fog($("gl"),{blob:true,blobAt:()=>[.95,.5]});
/* per-page background strength: thin 1 = plain page colour, calm 1 = lens subdued */
const BG={story:[.45,0],home:[.72,0],research:[.84,.3],design:[.84,.3],page:[.97,1]};
function setBg(k){const [t,c]=BG[k]||BG.page;S.thinT=t;S.calmT=c;S.blob=k==="home"&&innerWidth>1560?1:0}

/* ---------- themes: Land ⇄ Sea, one toggle ----------
   The button shows the swatch of the theme it switches TO. */
const themesEl=document.querySelector(".themes");
const TNAMES={land:"Land",sea:"Sea"};
const tbtn=document.createElement("button");tbtn.className="th";tbtn.type="button";tbtn.innerHTML=`<i aria-hidden="true"></i>`;themesEl.appendChild(tbtn);
tbtn.onclick=()=>setTheme(document.documentElement.dataset.theme==="sea"?"land":"sea",true);
function setTheme(id,save){id=THEME_ALIAS[id]||id;if(!THEMES[id])id="land";document.documentElement.dataset.theme=id;S.theme=THEMES[id];
  const next=id==="sea"?"land":"sea";tbtn.dataset.t=next;tbtn.setAttribute("aria-label",`Switch to ${TNAMES[next]} theme`);tbtn.title=`${TNAMES[next]} theme`;
  if(save){store.set("ph-theme",id);S.revT=1;setTimeout(()=>S.revT=0,600)}}
setTheme(store.get("ph-theme")||"land");

/* ---------- rail ---------- */
nav4.innerHTML=[["research","Research"],["design","Design"],["profile","Profile"],["contact","Contact"]]
  .map(([id,t])=>`<li><a href="#${id}" data-sec="${id}">${t}</a></li>`).join("");
$("rail-mail").textContent=CONTACT.email;$("rail-mail").href="mailto:"+CONTACT.email;
$("rail-cv").href=CONTACT.resume;
$("replay").onclick=()=>{location.hash="story"};

/* ---------- pages ---------- */
const idxRows=list=>`<ol class="idx">${list.map(p=>`<li><a href="#${p.id}"><span class="t">${esc(p.t)}</span><span class="k">${esc(p.tag)}</span></a></li>`).join("")}</ol>`;
const workBlock=p=>`<article class="work ${p.kind==="research"?"r":""}" id="w-${p.id}" data-id="${p.id}">
  <h2>${esc(p.t)}</h2>
  <div class="fig">[ ${p.kind==="design"?"cover":p.field?"field photo":"figure"} ]</div>
  <div class="row"><span class="tag">${esc(p.tag)}</span><a class="btn" href="#${p.id}">Open ${p.kind==="design"?"case":p.field?"study":"paper"}</a></div></article>`;
const PAGES={
  home:()=>`<h1 class="ph1 greet">Hello! I'm Peter Huang.</h1>
    <p class="mission">I'm a UX researcher with a background in psychology, digital media, and design. I'm curious about how we design safer systems and more pleasurable experiences.</p>
    <ul class="cred" aria-label="Education"><li>NYU graduate</li><li>B.S. Applied Psychology</li><li>Minor in Integrated Design and Media</li></ul>
    <div class="idx-h"><h2 class="label">Research</h2><a href="#research">All research</a></div>${idxRows(DATA.researchAll)}
    <div class="idx-h"><h2 class="label">Design</h2><a href="#design">All design</a></div>${idxRows(DATA.design)}`,
  research:()=>`<h1 class="ph1">Research</h1>${DATA.research.map(workBlock).join("")}`,
  design:()=>`<h1 class="ph1">Design</h1>${DATA.design.map(workBlock).join("")}`,
  profile:()=>`<div class="case">${profileHTML({h:"h1"})}</div>`,
  contact:()=>`<h1 class="ph1">Contact</h1>
    <div class="contact-mail"><output id="mail">${CONTACT.email}</output><button class="btn" id="copy">Copy email</button></div>
    <dl class="kv"><dt>Email</dt><dd><a href="mailto:${CONTACT.email}">Write an email</a></dd>
      <dt>LinkedIn</dt><dd><a href="${CONTACT.linkedin}" target="_blank" rel="noopener">${CONTACT.linkedinLabel}</a></dd>
      <dt>Résumé</dt><dd><a href="${CONTACT.resume}" target="_blank" rel="noopener">Human factors résumé (PDF)</a></dd>
      <dt>Based in</dt><dd>${CONTACT.city}</dd></dl>`
};
function projectPage(p){const list=p.kind==="design"?DATA.design:DATA.researchAll,i=list.indexOf(p),prev=list[(i+list.length-1)%list.length],next=list[(i+1)%list.length];
  const sec=p.kind==="design"?"Design":"Research";
  return `<p class="back"><a class="btn" href="#${p.kind}">← ${sec}</a></p><div class="case">${caseHTML(p,{h:"h1"}).replace('class="fig"','class="fig hero"')}</div>
  <nav class="pager" aria-label="More ${sec.toLowerCase()}"><a href="#${prev.id}"><span class="label">Previous</span><b>${esc(prev.short)}</b></a><a href="#${next.id}"><span class="label">Next</span><b>${esc(next.short)}</b></a></nav>`}

/* ---------- story (first visit) ----------
   Three chapters, one sentence each.
   1 · app tiles pop up one by one, stacked close together, then drift apart (closer / distanced).
   2 · research ↔ theory ↔ practice, drawn as a line diagram.
   3 · the sentence alone for now (illustration options are a separate project).
   Drawings are drawn with scroll, held, then erased in the direction they were drawn. */
const TILES=[ /* generic glyphs, not brand marks */
  {k:"chat",d:"M10 12 H38 V30 H22 L14 37 V30 H10 Z"},
  {k:"photo",d:"M9 15 H17 L20 11 H28 L31 15 H39 V36 H9 Z M24 31 A6 6 0 1 0 24 19 A6 6 0 1 0 24 31"},
  {k:"assistant",d:"M24 8 C25 18 30 23 40 24 C30 25 25 30 24 40 C23 30 18 25 8 24 C18 23 23 18 24 8 Z"},
  {k:"team",d:"M18 10 L15 38 M33 10 L30 38 M10 19 H39 M9 29 H38"},
  {k:"video",d:"M9 12 H39 V36 H9 Z M20 18 V30 L31 24 Z"},
  {k:"mail",d:"M9 14 H39 V34 H9 Z M9 14 L24 26 L39 14"},
  {k:"heart",d:"M24 37 C12 29 8 23 8 18 C8 13 12 10 16 10 C20 10 22 13 24 15 C26 13 28 10 32 10 C36 10 40 13 40 18 C40 23 36 29 24 37 Z"}
];
/* stacked (close) and spread (distanced) positions, in % of the stage */
const NEAR=[[44,40,-6],[50,44,4],[46,50,-2],[54,38,7],[40,47,3],[52,52,-5],[48,45,0]];
const FAR=[[10,14,-14],[86,10,12],[12,82,9],[88,84,-10],[50,4,6],[4,48,-6],[94,46,8]];
const arrow=(x1,y1,x2,y2)=>{const a=Math.atan2(y2-y1,x2-x1),h=11,w=.45;const hd=(x,y,dir)=>{const b=a+(dir?0:Math.PI);return `M${(x-h*Math.cos(b-w)).toFixed(1)} ${(y-h*Math.sin(b-w)).toFixed(1)} L${x} ${y} L${(x-h*Math.cos(b+w)).toFixed(1)} ${(y-h*Math.sin(b+w)).toFixed(1)}`};
  return [{d:`M${x1} ${y1} L${x2} ${y2}`},{d:hd(x2,y2,1)},{d:hd(x1,y1,0)}]};
const hex=(cx,cy)=>({d:`M${cx-66} ${cy} L${cx-46} ${cy-28} L${cx+46} ${cy-28} L${cx+66} ${cy} L${cx+46} ${cy+28} L${cx-46} ${cy+28} Z`});
/* person() kept for the illustration exploration */
const person=(x,s,base=312)=>{const y=base-118*s;return [
  {d:`M${x+12*s} ${y} A${12*s} ${12*s} 0 1 0 ${x-12*s} ${y} A${12*s} ${12*s} 0 1 0 ${x+12*s} ${y}`},
  {d:`M${x} ${y+16*s} L${x} ${y+72*s} L${x-15*s} ${base} M${x} ${y+72*s} L${x+15*s} ${base}`}]};
const STORY=[
  {s:"Technology can bring us closer, or distance us from each other.",tiles:true,art:[]},
  {s:"How we use this power depends upon how we research, develop, and apply it in society.",labels:[["Practice",200,95],["Research",88,300],["Theory",312,300]],
    art:[hex(200,95),...arrow(166,126,104,266),hex(88,300),...arrow(156,300,244,300),hex(312,300),...arrow(296,266,234,126)]},
  {s:"I believe that through quality, focused research, we can steer technology towards a better world for our friends, family, and future.",art:[]}
];
let storyOn=false,storyCleanup=null;
function openStory(){
  storyOn=true;document.body.classList.add("story-mode");story.hidden=false;main.innerHTML="";setBg("story");
  const N=STORY.length;
  story.innerHTML=`<div class="story-stage"><div class="story-vis" aria-hidden="true">
      <div class="tiles">${TILES.map((t,i)=>`<span class="tile t${i%4}" data-i="${i}"><svg viewBox="0 0 48 48"><path d="${t.d}"/></svg></span>`).join("")}</div>
      <svg class="story-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
      <defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter></defs>
      ${STORY.map((c,i)=>`<g class="art" data-i="${i}">${c.art.map(a=>`<path class="halo" d="${a.d}"/>`).join("")}${c.art.map(a=>`<path class="ln" d="${a.d}"/>`).join("")}${(c.labels||[]).map(([t,x,y])=>`<text x="${x}" y="${y+7}" text-anchor="middle">${t}</text>`).join("")}</g>`).join("")}</svg></div>
    <div class="story-copy"><p class="story-line" id="sl" aria-live="polite">${STORY[0].s}</p>
      <a class="btn story-enter" id="enter" href="#home" hidden>Enter portfolio</a></div></div>
    <div class="story-track" style="height:${N*140}vh"></div>
    <a class="btn story-skip" href="#home" id="skip">Skip intro</a><span class="story-hint" id="hint" aria-hidden="true">Scroll</span>`;
  const G=[...story.querySelectorAll(".art")].map(g=>{const ln=[...g.querySelectorAll(".ln")],ha=[...g.querySelectorAll(".halo")],tx=[...g.querySelectorAll("text")];
    const L=ln.map(p=>p.getTotalLength());const st=[];let acc=0;L.forEach(l=>{st.push(acc);acc+=l});
    [...ln,...ha].forEach((p,k)=>{const l=L[k%ln.length];p.style.strokeDasharray=`${l} ${l}`;p.style.strokeDashoffset=l});return {ln,ha,tx,L,st,total:acc}});
  const tiles=[...story.querySelectorAll(".tile")];
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,cl=x=>Math.max(0,Math.min(1,x));
  function paint(g,draw,erase){g.ln.forEach((p,k)=>{const l=g.L[k],s=g.st[k];const shown=Math.max(0,Math.min(l,draw*g.total-s));const gone=Math.max(0,Math.min(l,erase*g.total-s));
    const off=gone>0?-gone:l-shown;const vis=shown>.5&&gone<l-.5?"visible":"hidden";[p,g.ha[k]].forEach(e=>{e.style.strokeDashoffset=off;e.style.visibility=vis})});
    g.tx.forEach(t=>t.style.opacity=cl((draw-.55)*4)*(1-cl(erase*3)))}
  /* tiles: pop in one by one (0–.5), stay stacked, drift apart (.55–.8), fade (.85–1) */
  function paintTiles(lp,active){const n=tiles.length;tiles.forEach((el,i)=>{
    if(!active){el.style.opacity=0;return}
    const pop=reduce?1:ease(cl((lp-i*(.5/n))/(.5/n)));const spread=reduce?0:ease(cl((lp-.55)/.25));const fade=reduce?0:cl((lp-.86)/.14);
    const [x0,y0,r0]=NEAR[i],[x1,y1,r1]=FAR[i];const x=x0+(x1-x0)*spread,y=y0+(y1-y0)*spread,r=r0+(r1-r0)*spread;
    el.style.left=x+"%";el.style.top=y+"%";el.style.zIndex=i;
    el.style.transform=`translate(-50%,-50%) rotate(${r}deg) scale(${.55+.45*pop})`;el.style.opacity=pop*(1-fade)*(1-.25*spread)})}
  let last=0;const sl=$("sl"),hint=$("hint"),enter=$("enter"),stage=story.querySelector(".story-stage");
  const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?Math.min(1,scrollY/max):0;
    const f=Math.min(N-.0001,p*N);const i=Math.floor(f);const lp=f-i;const fin=i===N-1;
    paintTiles(lp,STORY[i].tiles);stage.classList.toggle("solo",!STORY[i].tiles&&!STORY[i].art.length);
    G.forEach((g,k)=>{if(k!==i||STORY[k].tiles){paint(g,0,0);return}
      if(reduce){paint(g,1,0);return}
      const draw=ease(Math.min(1,lp/(fin?.65:.5)));const erase=fin?0:ease(Math.max(0,(lp-.82)/.18));paint(g,draw,erase)});
    hint.style.opacity=p>.02?0:1;enter.hidden=!fin;
    if(i!==last){last=i;if(reduce){sl.textContent=STORY[i].s}else{sl.classList.add("swap");setTimeout(()=>{sl.textContent=STORY[i].s;sl.classList.remove("swap")},220)}}};
  addEventListener("scroll",onScroll,{passive:true});scrollTo(0,0);onScroll();
  const done=()=>store.set("ph-visited","1");$("skip").addEventListener("click",done);enter.addEventListener("click",done);
  storyCleanup=()=>{removeEventListener("scroll",onScroll);story.hidden=true;story.innerHTML="";document.body.classList.remove("story-mode");storyOn=false};
  document.title="Peter Huang";
}

/* ---------- router ---------- */
let current=null,io=null;
function route(){
  let h=(location.hash||"").slice(1);
  if(!h){h=store.get("ph-visited")?"home":"story";history.replaceState(null,"","#"+h)}
  if(h==="story"){if(!storyOn)openStory();return}
  if(storyOn){store.set("ph-visited","1");storyCleanup()}
  const p=byId(h);const key=p?p.kind:(PAGES[h]?h:"home");
  const html=p?projectPage(p):PAGES[key]();
  const swap=()=>{main.innerHTML=`<div class="page">${html}</div>`;scrollTo(0,0);
    nav4.querySelectorAll("a").forEach(a=>a.removeAttribute("aria-current"));
    const act=nav4.querySelector(`[data-sec="${key}"]`);if(act)act.setAttribute("aria-current","page");
    /* the rail list always navigates to project pages; on a section page it also tracks scroll position */
    const list=SECTIONS[key];sub.hidden=!list;
    if(list)subList.innerHTML=list.map(x=>`<li><a href="#${x.id}" data-id="${x.id}" ${p&&x.id===p.id?'aria-current="page"':""}>${esc(x.short)}</a></li>`).join("");
    if(io)io.disconnect();
    if(list&&!p){io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)subList.querySelectorAll("a").forEach(a=>a.classList.toggle("on",a.dataset.id===en.target.dataset.id))}),{rootMargin:"-40% 0px -55% 0px"});
      main.querySelectorAll(".work").forEach(w=>io.observe(w))}
    const h1=main.querySelector("h1");if(h1){h1.setAttribute("tabindex","-1");if(current!==null)h1.focus({preventScroll:true})}
    document.title=p?`${p.short} — Peter Huang`:key==="home"?"Peter Huang — UX research & design":`${key[0].toUpperCase()+key.slice(1)} — Peter Huang`;
    if(key==="profile")wireProfile(main);
    if(key==="contact")$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(CONTACT.email);toast("Email copied")}catch(e){const r=document.createRange();r.selectNodeContents($("mail"));const s=getSelection();s.removeAllRanges();s.addRange(r);toast("Email selected")}};
    setBg(p||key==="profile"||key==="contact"?"page":key);S.revT=1;setTimeout(()=>S.revT=0,700);onScroll();current=h};
  const old=main.querySelector(".page");if(old&&!reduce){old.classList.add("leaving");setTimeout(swap,200)}else swap();
}
function toast(t){const el=document.createElement("div");el.className="toast";el.setAttribute("role","status");el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),1800)}
function onScroll(){if(storyOn)return;const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?scrollY/max:0;prog.style.setProperty("--p",p.toFixed(3))}
addEventListener("scroll",onScroll,{passive:true});addEventListener("hashchange",route);route();
})();
