/* Site router.
   Every visit opens on #home: who Peter is in a few lines, then three featured projects.
   The scroll story (#story) is optional, opened from the "Read my story" button on Profile. */
(function(){
const {wireCase,DATA,CONTACT,THEMES,THEME_ALIAS,caseHTML,ctxHTML,metaIn,profileHTML,resumeHTML,wireProfile,Fog,reduce,esc}=Presence;
const $=id=>document.getElementById(id);
const main=$("main"),nav4=$("nav4"),sub=$("sub"),subList=$("sub-list"),prog=$("prog"),story=$("story");
const byId=id=>DATA.all.find(p=>p.id===id);
const SECTIONS={research:DATA.researchAll,design:DATA.design};
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- background ---------- */
const S=Fog($("gl"),{blob:true,blobAt:()=>[.95,.5]});
/* per-page background strength: thin 1 = plain page colour, calm 1 = lens subdued */
const BG={story:[.45,0],home:[.72,0],research:[.84,.3],design:[.84,.3],page:[.97,1]};
function setBg(k){const [t,c]=BG[k]||BG.page;S.thinT=t;S.calmT=c;S.blob=k==="home"&&innerWidth>1560?1:0;S.pause=!BG[k]||k==="page";S.wake&&S.wake()}

/* ---------- themes: Land ⇄ Sea, one toggle ----------
   The button shows the swatch of the theme it switches TO. */
const themesEl=document.querySelector(".themes");
const TNAMES={land:"Land",sea:"Sea"};
const tbtn=document.createElement("button");tbtn.className="th";tbtn.type="button";tbtn.innerHTML=`<i aria-hidden="true"></i><span class="th-l" aria-hidden="true"></span>`;themesEl.appendChild(tbtn);
tbtn.onclick=()=>setTheme(document.documentElement.dataset.theme==="sea"?"land":"sea",true);
function setTheme(id,save){id=THEME_ALIAS[id]||id;if(!THEMES[id])id="land";
  /* switch every colour in the same frame: hover transitions would otherwise lag behind the text */
  const R=document.documentElement;R.classList.add("theme-switch");requestAnimationFrame(()=>requestAnimationFrame(()=>R.classList.remove("theme-switch")));document.documentElement.dataset.theme=id;S.theme=THEMES[id];S.wake&&S.wake();
  const next=id==="sea"?"land":"sea";tbtn.dataset.t=next;tbtn.setAttribute("aria-label",`Switch to ${TNAMES[next]} theme`);tbtn.title=`${TNAMES[next]} theme`;tbtn.querySelector(".th-l").textContent=`${TNAMES[next]} theme`;
  if(save){store.set("ph-theme",id);S.revT=1;S.wake&&S.wake();setTimeout(()=>S.revT=0,600)}}
setTheme(store.get("ph-theme")||"land");

/* ---------- rail ---------- */
nav4.innerHTML=[["research","Research"],["design","Design"],["profile","Profile"],["contact","Contact"]]
  .map(([id,t])=>`<li><a href="#${id}" data-sec="${id}">${t}</a></li>`).join("");
/* Résumé + Email: one pair, same labels and behaviour everywhere (rail, home on phones, contact).
   Résumé opens an in-site page (the PDF embedded, plus a download), so it works inside sandboxed previews.
   Email opens the mail app and also copies the address, so it still works where mailto is blocked. */
const ctaPair=()=>`<div class="cta"><a class="btn" href="#resume" data-cta="resume">Résumé</a><a class="btn" href="mailto:${CONTACT.email}" data-cta="email">Email</a></div>`;
$("rail-foot").innerHTML=ctaPair();
async function copyEmail(){try{await navigator.clipboard.writeText(CONTACT.email);return true}catch(e){
  try{const t=document.createElement("textarea");t.value=CONTACT.email;t.setAttribute("readonly","");t.style.cssText="position:fixed;opacity:0";document.body.appendChild(t);t.select();const ok=document.execCommand("copy");t.remove();return ok}catch(_){return false}}}
document.addEventListener("click",async e=>{const a=e.target.closest('[data-cta="email"],#copy');if(!a)return;
  if(a.id==="copy")e.preventDefault();
  const ok=await copyEmail();const mail=a.dataset.cta==="email";
  toast(ok?(mail?`Opening your mail app. Address copied: ${CONTACT.email}`:`Email copied: ${CONTACT.email}`):CONTACT.email)});

/* ---------- main logo (profile) ----------
   p and h stay; the rest rolls through PAIRS, then back to the name.
   To add a pair, write both words without their first letter: ["ianist","…"] is pianist / h….
   Keep each h-word no wider than "human factors" so it never wraps.
   Screen readers get one label. Pause button for motion that repeats; reduced motion shows the name, still. */
const PAIRS=[["eter","uang"],["sychology","uman factors"],["rototype","ypothesis"],["roduct","euristics"]];
/* the roll lists end with a copy of the first pair, so the loop always moves forward and snaps back unseen */
const LOOP=[...PAIRS,PAIRS[0]];
const ARR=`<span class="arr" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 9H15M10 4L15 9L10 14"/></svg></span>`;
const roll=list=>`<span class="phm-w"><span class="phm-r">${list.map((w,i)=>`<span${i?' class="lt"':""}>${w}</span>`).join("")}</span></span>`;
const PHM_LABEL="Peter Huang. The p and h also stand for "+PAIRS.slice(1).map(([a,b])=>`p${a} and h${b}`).join(", ")+".";
const PHM=`<figure class="phm" role="img" aria-label="${PHM_LABEL}" style="--n:${LOOP.length};--k:0">
  <div class="phm-t" aria-hidden="true"><span class="phm-l"><span>p</span>${roll(LOOP.map(x=>x[0]))}</span><span class="phm-bar"></span><span class="phm-l h"><span>h</span>${roll(LOOP.map(x=>x[1]))}</span></div></figure>
  <div class="phm-act"><button class="replay phm-toggle" type="button" aria-pressed="false">Pause animation</button></div>`;
let phmT=null;
function wireLogo(root){
  clearInterval(phmT);phmT=null;
  const f=root.querySelector(".phm"),b=root.querySelector(".phm-toggle");if(!f)return;
  if(reduce){b.hidden=true;return}
  let k=0;
  const run=()=>{phmT=setInterval(()=>{k++;f.style.setProperty("--k",k);
    /* reached the copy of the first pair: once both words have rolled in, jump to the real first pair with no motion */
    if(k===PAIRS.length)setTimeout(()=>{f.classList.add("snap");k=0;f.style.setProperty("--k",0);void f.offsetWidth;f.classList.remove("snap")},1000)},2800)};
  run();
  b.onclick=()=>{const on=!!phmT;if(on){clearInterval(phmT);phmT=null}else run();
    b.textContent=on?"Play animation":"Pause animation";b.setAttribute("aria-pressed",String(on))};
}

/* ---------- home intro: typed out over about one second, once per visit ----------
   The full sentence holds its space from the start (no layout jump) and is what screen readers get. */
const TYPE_MS=1000;
let typed=false,twT=null;
function typeIntro(root){
  cancelAnimationFrame(twT);
  const p=root.querySelector(".mission");if(!p||typed||reduce)return;typed=true;
  const full=p.textContent.trim();
  p.innerHTML=`<span class="sr">${esc(full)}</span><span class="tw" aria-hidden="true"><span class="tw-g">${esc(full)}</span><span class="tw-l"></span></span>`;
  const l=p.querySelector(".tw-l");let t0=null;
  const tick=t=>{if(t0===null)t0=t;const k=Math.min(1,(t-t0)/TYPE_MS);l.textContent=full.slice(0,Math.round(k*full.length));
    if(k<1)twT=requestAnimationFrame(tick);else l.classList.add("done")};
  setTimeout(()=>{twT=requestAnimationFrame(tick)},250);
}

/* ---------- pages ---------- */
const idxRows=list=>`<ol class="idx">${list.map(p=>`<li><a href="#${p.id}"><span class="t">${esc(p.t)}</span><span class="k">${esc(p.tag)}</span></a></li>`).join("")}</ol>`;
const workBlock=p=>`<article class="work${p.kind==="research"?" r":""}" id="w-${p.id}" data-id="${p.id}"><a href="#${p.id}">
  <div class="work-h"><h2>${esc(p.t)}</h2>${ARR}</div>
  ${ctxHTML(p.ctx)}${p.line?`<p class="line">${esc(p.line)}</p>`:""}
  ${p.hero?`<img class="work-img" src="${p.hero.src}" alt="" loading="lazy"${p.hero.w?` width="${p.hero.w}" height="${p.hero.h}"`:""}>`:""}</a></article>`;
/* Featured work: three projects, one after another, research first. Chorvivo is under wraps: Profile > Work only.
   kind = research, design, or both; format = what it was (startup, paper, design-a-thon).
   img = a picture of the work; until there is one, the slot shows what belongs there. */
const FEATURED=[
  {id:"connection",kind:"UX research",format:"Self-directed · 7 interviews",year:"2025",img:"media/paper-codebook.webp",w:1355,h:882,alt:"The paper’s codebook (Appendix B): theme, codes, definitions and participant quotes",
    line:"How relationships through technology relate to life satisfaction among emerging adults. 7 semi-structured interviews, grounded-theory coding, and a 27-page paper."},
  {id:"wayfarer",kind:"UX design + research",format:"Design-a-thon winner",year:"2026",img:"media/wayfarer/hero.webp",w:1414,h:920,alt:"Three Wayfarer app screens",
    line:"Winner of Cornell University’s CU Design-a-thon 2026: a two-day sprint, 71 participants. An app that accompanies you on your walk, with asynchronous social connection and easy journaling."},
  {id:"glenergy",kind:"UX design + research",format:"Dark patterns study · Team of 3",year:"2025",img:"media/glenergy/feature.webp",w:1728,h:1100,alt:"Glenergy high-fidelity screen: the Give Back retirement plan page, $1 to $2 employer match",
    line:"A design of an Employee Onboarding Portal that incentivizes users to choose cost-effective options for the distributor/business. We tested to identify the effectiveness of “Dark Patterns” and discern perceptions of AI integration in business applications."}
];
const featBlocks=()=>FEATURED.map((f,i)=>{const p=byId(f.id);if(!p)return"";
  return `<article class="fw"><a href="#${p.id}">
    <div class="fw-h"><span class="fw-t">${esc(p.t)}</span>${ARR}</div>
    ${ctxHTML(p.ctx)}
    ${f.img?`<img class="fw-img" src="${f.img}" alt="${esc(f.alt||"")}" loading="lazy"${f.w?` width="${f.w}" height="${f.h}"`:""}>`:""}</a></article>`}).join("");
const PAGES={
  home:()=>`<div class="hi"><div class="hi-txt"><h1 class="ph1 greet">Hello! I’m Peter Huang.</h1>
    <p class="mission">I’m a UX researcher with a background in psychology, digital media, and design. I’m curious about how we design safer systems and more effective experiences.</p>
    <p class="hi-now"><span class="hi-sq" aria-hidden="true"></span>Currently working at Chorvivo.</p>
    <div class="hi-act">${ctaPair()}</div></div>
    <img class="hi-photo" src="media/me-smile.jpg" alt="Peter Huang, smiling, in a cap" width="556" height="520"></div>
    <h2 class="label feat-h">Featured work</h2>${featBlocks()}
    <p class="fw-more"><a href="#research">All research</a><a href="#design">All design</a></p>`,
  research:()=>`<h1 class="ph1">Research</h1>${DATA.research.map(workBlock).join("")}`,
  design:()=>`<h1 class="ph1">Design</h1>${DATA.design.map(workBlock).join("")}`,
  profile:()=>`<div class="case">${profileHTML({h:"h1"}).replace('<h1 class="c-t">Profile</h1>',`<h1 class="sr">Profile</h1><div class="phm-hero">${PHM}</div>`)}</div>`,
  resume:()=>`<h1 class="ph1">Résumé</h1>
    <div class="cv-act"><a class="btn" href="${CONTACT.resume}" download="Peter-Huang-Resume.pdf">Download PDF</a><a class="btn" href="${CONTACT.resume}" target="_blank" rel="noopener">Open PDF</a><a class="btn" href="mailto:${CONTACT.email}" data-cta="email">Email</a></div>
    <div class="case cv-html">${resumeHTML().replace('<p class="cv-top"><span>Human factors focus</span><a class="btn" href="${CONTACT.resume}" target="_blank" rel="noopener">Open PDF</a></p>','')}</div>`,
  contact:()=>`<h1 class="ph1 contact-h">Seems like you’re curious!</h1>
    <p class="contact-sub">I’m open to connecting and collaborating on new projects!</p>
    <div class="contact-mail"><output id="mail">${CONTACT.email}</output></div>
    <div class="contact-act">${ctaPair()}<button class="btn" id="copy" type="button">Copy email</button></div>
    <dl class="kv"><dt>LinkedIn</dt><dd><a href="${CONTACT.linkedin}" target="_blank" rel="noopener">${CONTACT.linkedinLabel}</a></dd>
      <dt>Based in</dt><dd>${CONTACT.city}</dd></dl>`
};
function projectPage(p){const list=p.kind==="design"?DATA.design:DATA.researchAll,i=list.indexOf(p),prev=list[(i+list.length-1)%list.length],next=list[(i+1)%list.length];
  const sec=p.kind==="design"?"Design":"Research";
  return `<p class="back"><a class="back-a" href="#${p.kind}" aria-label="Back to ${sec}">← ${sec}</a></p><div class="case">${caseHTML(p,{h:"h1"}).replace('class="fig"','class="fig hero"')}</div>
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
/* Experience timeline: one node per step, drawn on as the reader scrolls. Earlier steps stay drawn ("keep"); the timeline is not erased between steps ("hold"). */
const sq=(cx,cy)=>({d:`M${cx-7} ${cy-7} H${cx+7} V${cy+7} H${cx-7} Z`});
const TL_X=56,TL=[["Psychology",30],["Observation",94],["Behavioral data",158],["Usability testing",222],["Design + research",286],["Human factors",350]];
const tlStep=j=>{const art=[],labels=[];TL.slice(0,j+1).forEach(([t,y],m)=>{if(m)art.push({d:`M${TL_X} ${TL[m-1][1]+7} V${y-7}`});art.push(sq(TL_X,y));labels.push([t,TL_X+28,y,"start"])});
  return {art,labels,keep:j?2*j-1:0,keepT:j,hold:true}};
const STORY=[
  {s:"Technology can bring us closer, or distance us from each other.",art:[]},
  {s:"How we use this power depends upon how we research, develop, and apply it in society.",labels:[["Practice",200,95],["Research",88,300],["Theory",312,300]],
    art:[hex(200,95),...arrow(166,126,104,266),hex(88,300),...arrow(156,300,244,300),hex(312,300),...arrow(296,266,234,126)]},
  {s:"I studied applied psychology at NYU, fascinated by how people think.",...tlStep(0)},
  {s:"At Nordoff-Robbins, I coded about 130 music therapy sessions and learned to observe behavior closely.",...tlStep(1)},
  {s:"At DOROT, I analyzed data from 400+ older adults to find the usability and accessibility barriers in their programs.",...tlStep(2)},
  {s:"At Designity, I ran usability tests and turned what users showed me into design recommendations.",...tlStep(3)},
  {s:"Now, at Chorvivo, I lead design and research, from discovery interviews to user flows.",...tlStep(4)},
  {s:"Safety-critical domains and human error have interested me since graduation, after realizing how AI infrastructure and its consequences have impacted fields such as healthcare, finance, and social well-being.",...tlStep(5)},
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
      ${STORY.map((c,i)=>`<g class="art" data-i="${i}">${c.art.map(a=>`<path class="halo" d="${a.d}"/>`).join("")}${c.art.map(a=>`<path class="ln" d="${a.d}"/>`).join("")}${(c.labels||[]).map(([t,x,y,a])=>`<text x="${x}" y="${y+7}" text-anchor="${a||"middle"}">${t}</text>`).join("")}</g>`).join("")}</svg></div>
    <div class="story-copy"><p class="story-line" id="sl" aria-live="polite">${STORY[0].s}</p>
      <a class="btn story-enter" id="enter" href="#profile" hidden>Back to profile</a></div></div>
    <div class="story-track" style="height:${N*100}vh"></div><span class="story-prog" aria-hidden="true"><i id="sprog"></i></span>
    <a class="btn story-skip" href="#profile" id="skip">Close story</a><span class="story-hint" id="hint" aria-hidden="true">Scroll</span>`;
  const G=[...story.querySelectorAll(".art")].map((g,gi)=>{const ln=[...g.querySelectorAll(".ln")],ha=[...g.querySelectorAll(".halo")],tx=[...g.querySelectorAll("text")];
    const keep=STORY[gi].keep||0,keepT=STORY[gi].keepT||0;
    const L=ln.map(p=>p.getTotalLength());const st=[];let acc=0;L.forEach((l,k)=>{if(k<keep){st.push(-1e9);return}st.push(acc);acc+=l});
    [...ln,...ha].forEach((p,k)=>{const l=L[k%ln.length];p.style.strokeDasharray=`${l} ${l}`;p.style.strokeDashoffset=l});return {ln,ha,tx,L,st,total:acc||1,keepT}});
  const tiles=[...story.querySelectorAll(".tile")];
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,cl=x=>Math.max(0,Math.min(1,x));
  function paint(g,draw,erase){g.ln.forEach((p,k)=>{const l=g.L[k],s=g.st[k];const shown=draw<=0?0:Math.max(0,Math.min(l,draw*g.total-s));const gone=erase<=0?0:Math.max(0,Math.min(l,erase*g.total-s));
    const off=gone>0?-gone:l-shown;const vis=shown>.5&&gone<l-.5?"visible":"hidden";[p,g.ha[k]].forEach(e=>{e.style.strokeDashoffset=off;e.style.visibility=vis})});
    g.tx.forEach((t,k)=>t.style.opacity=(k<g.keepT&&draw>0?1:cl((draw-.55)*4))*(1-cl(erase*3)))}
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
      const draw=Math.max(.001,ease(Math.min(1,lp/(fin?.65:.5))));const erase=fin||STORY[k].hold?0:ease(Math.max(0,(lp-.82)/.18));paint(g,draw,erase)});
    hint.style.opacity=p>.02?0:1;enter.hidden=!fin;$("sprog").style.setProperty("--p",p.toFixed(3));
    if(i!==last){last=i;const put=()=>{sl.textContent=STORY[i].s;sl.classList.toggle("long",STORY[i].s.length>140)};if(reduce){put()}else{sl.classList.add("swap");setTimeout(()=>{put();sl.classList.remove("swap")},220)}}};
  addEventListener("scroll",onScroll,{passive:true});scrollTo(0,0);onScroll();
  storyCleanup=()=>{removeEventListener("scroll",onScroll);story.hidden=true;story.innerHTML="";document.body.classList.remove("story-mode");storyOn=false};
  document.title="Peter Huang";
}

/* ---------- router ---------- */
let current=null,io=null;
function route(){
  let h=(location.hash||"").slice(1);
  if(!h){h="home";history.replaceState(null,"","#home")}
  if(h==="story"){if(!storyOn)openStory();return}
  if(storyOn)storyCleanup();
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
    if(p)wireCase(main,p);
    wireLogo(main);typeIntro(main);
    setBg(p||key==="profile"||key==="contact"?"page":key);S.revT=1;setTimeout(()=>S.revT=0,700);onScroll();current=h};
  const old=main.querySelector(".page");if(old&&!reduce){old.classList.add("leaving");setTimeout(swap,200)}else swap();
}
function toast(t){const el=document.createElement("div");el.className="toast";el.setAttribute("role","status");el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),1800)}
function onScroll(){if(storyOn)return;const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?scrollY/max:0;prog.style.setProperty("--p",p.toFixed(3))}
addEventListener("scroll",onScroll,{passive:true});addEventListener("hashchange",route);route();
})();
