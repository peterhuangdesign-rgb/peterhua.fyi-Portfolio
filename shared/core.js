/* Presence core: content, résumé, themed background shader, profile media.
   Edit DATA / RESUME to change content. Drop real files into media/ and update tracks / photos paths. */
(function(){
const L={
  s:"Lorem ipsum dolor sit amet, consectetur adipiscing.",
  a:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  b:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
  c:"Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris."
};
const CONTACT={email:"peterhuangdesign@gmail.com",linkedin:"https://www.linkedin.com/in/peterhuaux",linkedinLabel:"linkedin.com/in/peterhuaux",resume:"media/resume-human-factors.pdf",city:"Orange County, California"};

const DATA={
  research:[
    {id:"connection",kind:"research",t:"Technology, Social Connection, and Life Satisfaction",short:"Social Connection",tag:"Qualitative",line:L.s,meta:[["Method","Qualitative"],["Sample","Lorem ipsum"],["Year","Lorem"],["Format","Paper"]]},
    {id:"students-ai",kind:"research",t:"Student Outcomes amidst AI",short:"Students & AI",tag:"Mixed methods",line:L.s,meta:[["Method","Mixed methods"],["Sample","Lorem ipsum"],["Year","Lorem"],["Format","Paper"]]},
    {id:"pilipino",kind:"research",t:"Ethnographic Study on Pilipino Culture",short:"Pilipino Culture",tag:"Qualitative",line:L.s,meta:[["Method","Qualitative, ethnography"],["Site","Lorem ipsum"],["Year","Lorem"],["Format","Paper"]]}
  ],
  field:[
    {id:"nordoff",kind:"research",field:true,t:"Nordoff-Robbins Center for Music Therapy",short:"Nordoff-Robbins",tag:"Clinical observation",
      line:"Structured observational research in a clinical mental-health setting.",
      meta:[["Role","Clinical observational researcher"],["Where","New York City"],["When","Jan – May 2025"],["Data","~130 sessions"]],
      sections:[["Setting","Music therapy sessions at a clinical center, reviewed with licensed therapists after each session."],
        ["What I did","Coded and managed a behavioral database of about 130 therapy sessions, using structured tracking protocols to map client progress over time."],
        ["Outcome","A detailed longitudinal case study of one client's growth, synthesized from the coded observations."]]},
    {id:"dorot",kind:"research",field:true,t:"DOROT",short:"DOROT",tag:"Behavioral data",
      line:"Program data from 400+ older adults, analyzed for usability and access barriers.",
      meta:[["Role","Research & operations assistant"],["Where","New York City"],["When","Aug – Dec 2025"],["Tools","SPSS, Salesforce"]],
      sections:[["Setting","Social programs for older adults in New York City."],
        ["What I did","Ran quantitative behavioral analysis in SPSS across 400+ program participants to find usability and accessibility barriers. Kept data collection reliable across a diverse population."],
        ["Outcome","Recommendations and stakeholder reports that fed the organization's impact assessments."]]}
  ],
  design:[
    {id:"chorvivo",kind:"design",t:"Chorvivo",short:"Chorvivo",tag:"Startup",line:L.s,meta:[["Role","Head of design"],["Type","Startup"],["Year","2026"],["Status","Lorem ipsum"]]},
    {id:"wayfarer",kind:"design",t:"Wayfarer",short:"Wayfarer",tag:"Design-a-thon win",line:L.s,meta:[["Role","Lorem ipsum"],["Event","CUXD Design-a-thon"],["Year","2026"],["Outcome","1st place"]]},
    {id:"glenergy",kind:"design",t:"Glenergy",short:"Glenergy",tag:"School · Collaboration",line:L.s,meta:[["Role","Lorem ipsum"],["Type","School project"],["Team","Collaboration"],["Year","Lorem"]]}
  ],
  me:[["Jazz piano","Self-taught, Bill Evans"],["Game audio","Music for a friend's game"],["Climbing","Ongoing practice"],["Running","Ongoing practice"],["Photography","Below"],["Contemplation","Meditation, breathwork"]],
  tracks:[
    {t:"Lorem study no. 1",note:"Piano",src:"media/track-01.mp3"},
    {t:"Ipsum, for a game",note:"Game audio",src:"media/track-02.mp3"},
    {t:"Dolor sketch",note:"Piano",src:"media/track-03.mp3"}
  ],
  /* photos of Peter: add more files to media/ and list them here */
  mePhotos:[{src:"media/portrait.jpg",alt:"Portrait of Peter"},{src:"media/me-01.jpg",alt:"Peter holding his cat"},{src:"media/me-02.jpg",alt:"Peter on a hillside"}],
  photos:[1,2,3,4,5,6].map(i=>({src:`media/photo-0${i}.jpg`,alt:`Photograph ${i}`}))
};
DATA.researchAll=[...DATA.research]; /* field work (Nordoff-Robbins, DOROT) lives on Profile, not here */
DATA.all=[...DATA.researchAll,...DATA.design];

/* From the human factors résumé (Resume_Peter_HuangHF.pdf). */
const RESUME={
  experience:[
    {role:"UX Intern",org:"Designity",when:"Aug – Sep 2026",pts:["User research and usability testing with qualitative and quantitative methods","Turned findings into design recommendations within business constraints","Ran structured feedback loops with cross-functional stakeholders","Kept research documentation consistent across touchpoints"]},
    {role:"Research & Operations Assistant",org:"DOROT, New York",when:"Aug – Dec 2025",pts:["Behavioral data analysis (SPSS) across 400+ participants to find usability and accessibility barriers for older adults","Recommendations and stakeholder reports","Reliable data collection across diverse populations"]},
    {role:"Clinical Observational Researcher",org:"Nordoff-Robbins Center for Music Therapy, New York",when:"Jan – May 2025",pts:["Structured qualitative observation in a clinical mental-health setting with licensed therapists","Coded a behavioral database of ~130 sessions","Longitudinal case study from the coded data"]},
    {role:"Operations Intern",org:"NOVA Kitchen and Bar, Orange",when:"Jul – Aug 2024",pts:["Resolved operational pain points for 100+ daily guests","Built workflows with a 30+ person team under time pressure"]}
  ],
  education:{school:"New York University, Steinhardt",degree:"B.S. Applied Psychology",minors:"Minors: Integrated Design & Media (HCI/UX), Philosophy",when:"2026",extra:"Dean's List, Spring 2024",courses:"Human-Centered Research Methods I & II, Statistics for Behavioral Sciences, Agile Product Design, Ideation & Prototyping, Dark Patterns"},
  skills:[["Research methods","Usability testing, task analysis, qualitative and quantitative research, behavioral data analysis, research protocol design"],["Tools","Figma, SPSS, Salesforce, Microsoft Office"]]
};
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- content ---------- */
function caseHTML(p,opts={}){
  const secs=p.sections||(p.kind==="design"?[["Problem",L.a],["Process",L.b],["Outcome",L.c]]:[["Question",L.a],["Method",L.b],["Findings",L.c]]);
  const H=opts.h||"h2";
  return `${opts.noTitle?"":`<${H} class="c-t${p.t.length>24?" long":""}">${esc(p.t)}</${H}>`}
  <dl class="c-meta">${p.meta.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>
  <div class="fig">[ ${p.kind==="design"?"prototype capture":p.field?"field photo":"figure"} ]</div>
  ${secs.map(([h,b])=>`<section class="c-sec"><h3>${h}</h3><p>${b}</p></section>`).join("")}
  ${p.kind==="research"&&!p.field?`<p class="c-paper"><span class="btn is-off" aria-disabled="true">Paper PDF · soon</span></p>`:""}`;
}
function resumeHTML(){
  const R=RESUME;
  return `<section class="c-sec" id="resume"><h3>Résumé</h3><div class="cv">
    <p class="cv-top"><span>Human factors focus</span><a class="btn" href="${CONTACT.resume}" target="_blank" rel="noopener">Open PDF</a></p>
    <ol class="cv-list">${R.experience.map(e=>`<li><div class="cv-h"><b>${esc(e.role)}</b><span>${esc(e.when)}</span></div><p class="cv-org">${esc(e.org)}</p><ul>${e.pts.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></li>`).join("")}</ol>
    <div class="cv-ed"><div class="cv-h"><b>${R.education.degree}</b><span>${R.education.when}</span></div><p class="cv-org">${R.education.school}</p><p>${R.education.minors}. ${R.education.extra}.</p><p class="cv-muted">${R.education.courses}</p></div>
    <dl class="cv-skills">${R.skills.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl></div></section>`;
}
/* Peter's own words (peterhua.fyi), grammar fixes only. */
const PROFILE={
  about:["My foundation in psychology is important for human-centric design, a skill needed in a future empowered by AI.",
    "I translate quantitative and qualitative data into a clear direction for design.",
    "I'm fascinated by art and science, I prioritize physical and mental health, and I'm inspired to build a future with integrity and humility.",
    "My approach is guided by curiosity, creativity, and a constant search for better ways to understand the human experience."],
  skills:[["UX design","Figma, Adobe Illustrator, Adobe InDesign, Adobe Photoshop"],["UX research","SPSS, Excel, R, qualitative and quantitative analysis"]],
  memory:{q:"To feel the memory forming while living the moment.",p:[
    "During my time at NYU in New York City, I met many unique individuals, each with their own story and journey.",
    "I explored topics in philosophy and art, music and media, and research and science. I'm now an avid climber, jazz enthusiast, and cat owner.",
    "I'm fascinated by how people think, which drives me to pursue a career in UX design. In the future, I hope to travel, read, and create a podcast."]},
  why:["I find joy in the dynamics of human connection. Through my biology or my upbringing, I've noticed that being seen truthfully by others is a guiding value I identify with. Technology has influenced these human connections, for better or for worse. It is a goal of mine to improve the connections people have with one another through digital means. As technology leaps further and further, our humanity is questioned again and again: What defines a human? What are the ideals we strive for? What makes us feel truly alive? My professional aspiration is to enhance the human experience with technology through observation, discussion, and analysis.",
    "I graduated from NYU with a Bachelor's in Applied Psychology, an experience that helped me build analytical, statistical, and empathetic skills. In addition, I focused my efforts on a minor in Integrated Design & Media, becoming familiar with common design tools and processes such as ideation, interviews, and agile product design.",
    "These experiences, coupled with my work helping disadvantaged communities, such as children with disorders and adults with functional impairments, are a testament to my goal of improving how humans interact with the world and with one another.",
    "As an emerging professional, I am driven to craft digital experiences for human connection. This is where the unfinished story stands. I'm eager, creative, and curious about future opportunities in user experience design and product design.",
    "I hope to explore and excel in this career with communication, agency, and an open curiosity."],
  substack:{url:"https://petersworld.substack.com/",label:"petersworld.substack.com",note:"Where I share all things philosophy, art, and meaning."}
};
function fieldHTML(f){
  return `<article class="xp"><div class="cv-h"><b>${esc(f.t)}</b><span>${esc(f.meta.find(m=>m[0]==="When")[1])}</span></div>
    <p class="cv-org">${esc(f.meta[0][1])} · ${esc(f.meta.find(m=>m[0]==="Where")[1])}</p>
    <dl class="xp-d">${f.sections.map(([h,b])=>`<div><dt>${esc(h)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl></article>`;
}
/* Profile reads researcher-first (about, skills, experience, why), then the personal side (photos, outside of work, music, photography). */
function profileHTML(opts={}){
  const H=opts.h||"h2",P=PROFILE,W=P.why;
  return `<${H} class="c-t">Profile</${H}>
  <div class="pf-top"><img class="pf-portrait" src="media/portrait.jpg" alt="Portrait of Peter Huang" width="512" height="512"><div class="pf-about">${P.about.map(x=>`<p>${esc(x)}</p>`).join("")}</div></div>
  <section class="c-sec"><h3>Skills</h3><dl class="pf-skills">${P.skills.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl></section>
  <section class="c-sec" id="experience"><h3>Research experience</h3><div class="xps">${DATA.field.map(fieldHTML).join("")}</div></section>
  <section class="c-sec"><h3>What is my why?</h3><div class="pf-long">
    <p>${esc(W[0])}</p><p>${esc(W[1])}</p>
    <p class="pf-q">“${esc(P.memory.q)}”</p>${P.memory.p.map(x=>`<p>${esc(x)}</p>`).join("")}
    ${W.slice(2).map(x=>`<p>${esc(x)}</p>`).join("")}
    <p class="pf-sub"><a class="btn" href="${P.substack.url}" target="_blank" rel="noopener">Substack ↗</a> <span class="pf-note">${esc(P.substack.note)}</span></p></div></section>
  <section class="pf-photos" aria-label="Photos of Peter"><ul class="photos me-photos">${DATA.mePhotos.map((p,i)=>`<li><button class="ph" data-set="me" data-i="${i}" aria-label="Open ${esc(p.alt)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy"></button></li>`).join("")}</ul></section>
  <section class="c-sec"><h3>Outside of work</h3><ul class="me">${DATA.me.map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join("")}</ul></section>
  ${opts.resume?resumeHTML():""}
  <section class="c-sec"><h3>My music</h3><div data-player>
    <ol class="tracks">${DATA.tracks.map((t,i)=>`<li><button class="trk" data-i="${i}" aria-pressed="false"><span class="glyph" aria-hidden="true"></span><span class="tt">${esc(t.t)}</span><span class="tn">${esc(t.note)}</span><span class="td" data-d>–:––</span></button></li>`).join("")}</ol>
    <div class="bar"><input type="range" min="0" max="1000" value="0" step="1" aria-label="Seek" data-seek><span data-time>0:00</span></div>
    <audio preload="none"></audio></div></section>
  <section class="c-sec"><h3>Photography</h3><ul class="photos">${DATA.photos.map((p,i)=>`<li><button class="ph" data-set="photos" data-i="${i}" aria-label="Open ${esc(p.alt)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" width="400" height="400"></button></li>`).join("")}</ul></section>`;
}
const fmt=s=>!isFinite(s)?"–:––":`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
function wireProfile(root){
  const box=root.querySelector("[data-player]");if(!box)return;
  const au=box.querySelector("audio"),seek=box.querySelector("[data-seek]"),time=box.querySelector("[data-time]");const btns=[...box.querySelectorAll(".trk")];let cur=-1;
  btns.forEach((b,i)=>{const a=new Audio();a.preload="metadata";a.src=DATA.tracks[i].src;a.addEventListener("loadedmetadata",()=>b.querySelector("[data-d]").textContent=fmt(a.duration));
    b.onclick=()=>{if(cur===i){au.paused?au.play():au.pause();return}cur=i;au.src=DATA.tracks[i].src;au.play().catch(()=>{})}});
  const sync=()=>btns.forEach((b,i)=>b.setAttribute("aria-pressed",String(i===cur&&!au.paused)));
  au.addEventListener("play",sync);au.addEventListener("pause",sync);au.addEventListener("ended",()=>{if(cur<btns.length-1)btns[cur+1].click();else sync()});
  au.addEventListener("timeupdate",()=>{const p=au.duration?au.currentTime/au.duration:0;seek.value=Math.round(p*1000);seek.style.setProperty("--p",p*100+"%");time.textContent=fmt(au.currentTime)});
  seek.addEventListener("input",()=>{if(au.duration)au.currentTime=seek.value/1000*au.duration;seek.style.setProperty("--p",seek.value/10+"%")});
  root.querySelectorAll(".ph").forEach(b=>b.onclick=()=>Lightbox.open(+b.dataset.i,b,b.dataset.set==="me"?DATA.mePhotos:DATA.photos));
}
const Lightbox=(()=>{let el,i=0,from=null,set=null;
  function build(){el=document.createElement("div");el.className="lb";el.hidden=true;el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Photograph");
    el.innerHTML=`<div class="lb-bar"><span data-n></span><div><button class="btn" data-p>Prev</button><button class="btn" data-x>Next</button><button class="btn" data-c>Close</button></div></div><img alt="">`;
    document.body.appendChild(el);el.querySelector("[data-p]").onclick=()=>show(i-1);el.querySelector("[data-x]").onclick=()=>show(i+1);el.querySelector("[data-c]").onclick=close;
    el.addEventListener("click",e=>{if(e.target===el)close()});
    addEventListener("keydown",e=>{if(el.hidden)return;if(e.key==="Escape"){e.stopPropagation();close()}if(e.key==="ArrowRight")show(i+1);if(e.key==="ArrowLeft")show(i-1)},true)}
  function show(k){const L=set||DATA.photos;const n=L.length;i=(k+n)%n;const p=L[i];const img=el.querySelector("img");img.src=p.src;img.alt=p.alt;el.querySelector("[data-n]").textContent=`${i+1} / ${n}`}
  function open(k,f,list){if(!el)build();from=f;set=list||DATA.photos;show(k);el.hidden=false;el.querySelector("[data-c]").focus()}
  function close(){el.hidden=true;from&&from.focus()}
  return{open,close};})();

/* ---------- themes ----------
   land: fog + altitude contours, earth-brown index lines (original Presence)
   sea:  underwater teal: light from the surface, caustic webs, drifting bokeh
   (Sky was removed; saved "sky"/"fx" fall back to land) */
const THEMES={
  land:{mode:0,bg:"#FCFCFA",fog:"#DADDD7",line:"#585E62",acc:"#5F6E2E",alt:"#7A5636"},
  sea:{mode:1,bg:"#0D3640",fog:"#2B808A",line:"#BFEDE6",acc:"#7FD3D6",alt:"#CFF2E6"},
};
const THEME_ALIAS={light:"land",dark:"sea",fx:"land",sky:"land"};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const FS=`precision highp float;uniform vec2 r,m,b;uniform float t,lens,rev,bs,thin,blob,mode,calm,dpr;uniform vec3 cBg,cFog,cLine,cAcc,cAlt;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;float as=r.x/r.y;vec2 p=uv*vec2(as,1.);float tt=t*.012;float k=1.-thin;
 vec2 mp=m*vec2(as,1.);float d=length(p-mp);float R=.07+.2*lens;float Lm=(1.-smoothstep(R*.7,R,d))*(1.-calm*.75);
 float M=max(Lm,rev*(1.-calm)*smoothstep(1.-rev*1.4,1.-rev*1.4+.25,uv.x+(fbm(p*2.)-.5)*.3));
 vec3 col=cBg;
 if(mode<.5){
  float f=fbm(p*2.+vec2(tt,-tt*.6)+fbm(p*1.2-tt)*.9);col=mix(cBg,cFog,smoothstep(.32,.78,f)*k);
  float soil=smoothstep(.5,.85,fbm(p*.9+vec2(3.1,tt*.3)));col=mix(col,mix(cFog,cAlt,.3),soil*.16*k);
  float e=fbm(p*1.4+vec2(0.,tt*.4));float c1=1.-smoothstep(.02,.06,abs(fract(e*16.)-.5));float mj=1.-smoothstep(.02,.05,abs(fract(e*4.)-.5));
  col=mix(col,cBg,M*.65);col=mix(col,cLine,c1*M*.3);col=mix(col,cAlt,mj*(M*.38+.03*k));col=mix(col,cAcc,c1*mj*M*.3);
  vec2 dv=p-b*vec2(as,1.);dv+=(vec2(fbm(p*1.7+tt*3.),fbm(p*1.7+5.-tt*3.))-.5)*.22;dv.x*=1.5;dv.y*=.75;
  float g=exp(-dot(dv,dv)/(.05+.05*bs))*blob*k;col=mix(col,vec3(.86,.78,.71),smoothstep(.02,.45,g)*.4*(1.-g));col=mix(col,vec3(.07,.08,.09),pow(g,1.5)*.7);
 }else if(mode<1.5){
  /* sea: a quiet teal gradient at rest; caustic webs, light shafts and bokeh surface mainly inside the cursor lens, as Land's contours do */
  float depth=smoothstep(-.15,1.1,uv.y*.85+(1.-uv.x)*.25+(fbm(p*.7+tt*.4)-.5)*.35);
  col=mix(cBg,cFog,depth*(.35+.45*k));
  float sh=fbm(vec2(p.x*2.2+p.y*.9,tt*1.4));float shaft=smoothstep(.55,.85,sh)*smoothstep(.1,1.,uv.y);
  col=mix(col,cAcc,shaft*(.05*k+.2*M));
  vec2 q=p*2.6+vec2(tt*.9,-tt*.6);float ca=abs(fbm(q)-fbm(q*1.15+vec2(5.2,1.3)+tt*.5));
  float web=1.-smoothstep(.0,.035,ca);col=mix(col,cAcc,web*(.04*k+.3*M)*(.4+.6*depth));
  vec2 g=p*4.+vec2(0.,t*.035);vec2 id=floor(g);vec2 f=fract(g)-.5;
  vec2 off=(vec2(h(id),h(id+3.1))-.5)*.5;float rad=.12+.2*h(id+7.7);float on=step(.62,h(id+1.9));
  float dd=length(f-off);float disc=1.-smoothstep(rad*.82,rad,dd);float rim=smoothstep(rad*.6,rad*.95,dd)*disc;
  vec3 bc=mix(cAcc,cAlt,h(id+4.4));col=mix(col,bc,on*(disc*.26+rim*.2)*(.1*k+.85*M)*(.55+.45*depth));
  /* lens: the water clears where the cursor rests and depth contours surface, as Land's lens reveals altitude */
  float e2=fbm(p*1.4+vec2(0.,tt*.4));float r1=1.-smoothstep(.02,.06,abs(fract(e2*16.)-.5));float r2=1.-smoothstep(.02,.05,abs(fract(e2*4.)-.5));
  col=mix(col,cFog,M*.4);col=mix(col,cLine,r1*M*.32);col=mix(col,cAcc,r2*M*.6);
  float lum=dot(col,vec3(.2126,.7152,.0722));col*=min(1.,.38/max(lum,.001));
 }
 col+=(h(gl_FragCoord.xy+fract(t*.37))-.5)*(mode>.5&&mode<1.5?.03:.035);gl_FragColor=vec4(col,1.);}`;
function Fog(canvas,{blob=true,blobAt=null}={}){
  const S={mx:.5,my:.5,tx:.5,ty:.5,last:performance.now(),lens:0,rev:0,revT:0,thin:1,thinT:.8,calm:0,calmT:0,bx:.8,by:.5,blob:blob?1:0,theme:THEMES.land,frame:null};
  addEventListener("pointermove",e=>{S.tx=e.clientX/innerWidth;S.ty=1-e.clientY/innerHeight;S.last=performance.now()});
  const gl=canvas.getContext("webgl",{antialias:false});if(!gl)return S;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}"));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(pr,"a");gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const U={};["r","m","b","t","lens","rev","bs","thin","blob","mode","calm","dpr","cBg","cFog","cLine","cAcc","cAlt"].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
  let D=1;const size=()=>{const d=D=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*d;canvas.height=innerHeight*d;gl.viewport(0,0,canvas.width,canvas.height)};size();addEventListener("resize",size);
  const t0=performance.now();
  if(blobAt){const [x,y]=blobAt(S);S.bx=x;S.by=y}
  const loop=now=>{const k=reduce?1:.08;S.mx+=(S.tx-S.mx)*k;S.my+=(S.ty-S.my)*k;
    const still=Math.max(0,Math.min(1,(now-S.last-250)/2600));const goal=still*still*(3-2*still);S.lens+=(goal-S.lens)*(goal>S.lens?.03:.15);
    S.rev+=(S.revT-S.rev)*(reduce?1:.045);S.thin+=(S.thinT-S.thin)*(reduce?1:.03);S.calm+=(S.calmT-S.calm)*(reduce?1:.06);
    const [gx,gy]=blobAt?blobAt(S):[.8,.5];S.bx+=(gx-S.bx)*.006;S.by+=(gy-S.by)*.006;const T=S.theme;
    gl.uniform2f(U.r,canvas.width,canvas.height);gl.uniform2f(U.m,S.mx,S.my);gl.uniform2f(U.b,S.bx,S.by);gl.uniform1f(U.t,reduce?40:(now-t0)/1000);
    gl.uniform1f(U.lens,S.lens);gl.uniform1f(U.rev,S.rev);gl.uniform1f(U.bs,S.lens);gl.uniform1f(U.thin,S.thin);gl.uniform1f(U.blob,S.blob);gl.uniform1f(U.calm,S.calm);
    gl.uniform1f(U.mode,T.mode);gl.uniform3fv(U.cBg,hex(T.bg));gl.uniform3fv(U.cFog,hex(T.fog));gl.uniform3fv(U.cLine,hex(T.line));gl.uniform3fv(U.cAcc,hex(T.acc));gl.uniform3fv(U.cAlt,hex(T.alt));gl.uniform1f(U.dpr,D);
    gl.drawArrays(gl.TRIANGLES,0,3);S.frame&&S.frame(S,now);if(!document.hidden)requestAnimationFrame(loop)};
  requestAnimationFrame(loop);document.addEventListener("visibilitychange",()=>{if(!document.hidden)requestAnimationFrame(loop)});
  return S;
}

window.Presence={DATA,L,CONTACT,RESUME,THEMES,THEME_ALIAS,PROFILE,caseHTML,profileHTML,resumeHTML,wireProfile,Lightbox,Fog,reduce,esc};
})();
