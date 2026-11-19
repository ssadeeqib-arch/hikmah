/* Hikmah 2.0 */
"use strict";
const VERSION="2.0.0";
const ASK_URL="https://claude.ai/artifact/HnMjVLK1wRDvbunz2gB6Qs#ask";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const prov=t=>esc(t).replace(/«([^»]*)»/g,'<span class="prov">$1</span>');
const plainProv=t=>String(t).replace(/[«»]/g,"");
const store={get(k,d){try{const v=localStorage.getItem("hikmah:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("hikmah:"+k,JSON.stringify(v))}catch(e){}}};
const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const dayKey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");

/* ---------- icons ---------- */
const IC={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
 play:'<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
 pause:'<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/>',
 heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
 heartf:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" fill="currentColor"/>',
 bookmarkf:'<path d="M6 3h12v18l-6-4-6 4z" fill="currentColor"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
 head:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 flame:'<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-11-2 2-3 4-3 6-1-1-2-2-2-4-2 2-4 5-4 9 0 4 3 7 7 7z" fill="currentColor" stroke="none"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 check:'<path d="M5 12l5 5 9-10"/>',
 down:'<path d="M12 4v11m0 0l-5-5m5 5l5-5"/><path d="M5 20h14"/>',
 spark:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" stroke="none"/>',
 ask:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 10h6M9 13.5h4"/>',
 next:'<path d="M5 5v14l10-7z M17 5h2.5v14H17z" fill="currentColor" stroke="none"/>',
 prev:'<path d="M19 5v14L9 12z M4.5 5H7v14H4.5z" fill="currentColor" stroke="none"/>',
 b15:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><text x="12" y="15.5" font-size="7" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif" font-weight="700">15</text>',
 f30:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/><text x="12" y="15.5" font-size="7" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif" font-weight="700">30</text>',
 follow:'<path d="M4 6h16M4 12h10M4 18h7"/><path d="M17 15l4 3-4 3z" fill="currentColor"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
 book:'<path d="M4 5c3-1 6-1 8 1v14c-2-2-5-2-8-1zM20 5c-3-1-6-1-8 1v14c2-2 5-2 8-1z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const icon=(n,s=22,extra="")=>`<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra} aria-hidden="true">${IC[n]||""}</svg>`;
$$(".ti").forEach(e=>e.innerHTML=icon(e.dataset.i,20));

/* ---------- data ---------- */
let PK=[],TM={},byId={},CARDS={},ALLIDEAS=[];
const CAT_ORDER=["Tafsir","Islamic Classics","Character","Heart","Family","Work & Leadership","Leading People","Thinking & Decisions","Strategy & Execution","Influence & Negotiation","The Good Life","Habits & Productivity","Mind & Meaning","Money & Wealth","Communication & People","African Wisdom"];
const LABEL={opening:"Opening",verses:"From the Qur'an",verse:"Understanding the verses",hadith:"From the Sunnah",scholars:"The classical scholars",modern:"Modern thought",nigerian:"Nigerian wisdom",idea:"The big idea",mechanics:"Going deeper",practice:"In the real world",faith:"In the light of the Qur'an",practices:"Practices",closing:"Closing",intro:"Introduction"};
function splitHead(text){
  const t=String(text).trim(); const m=t.match(/^(.{20,130}?[.!?])\s+(.+)$/s);
  if(m && m[1].length<=130) return [m[1],m[2]];
  return [null,t];
}
function byline(p){return p.kind==="book"?p.author:p.sub}
function buildCards(p){
  const C=[], add=(o)=>{o.pid=p.id;o.i=C.length;o.key=p.id+":"+C.length;C.push(o)};
  add({type:"intro",eb:p.cat,h:p.title,by:byline(p),body:p.tag,mark:"intro"});
  const verseCard=(mark,eb)=>add({type:"verse",eb,verses:p.verses,mark});
  const sec=(mark,text,eb)=>{if(!text)return;const [h,b]=splitHead(text);add({type:"idea",eb:eb||LABEL[mark],h:h||(eb||LABEL[mark]),body:h?b:text,mark})};
  if(p.kind==="book"){
    p.ideas.forEach(([t,b],i)=>add({type:"idea",eb:`Idea ${i+1}`,h:t,body:b,mark:"idea"+i,prov:t.startsWith("«")}));
    verseCard("verses","From the Qur'an");
    sec("faith",p.faith,"In the light of the Qur'an");
    p.hadith.forEach(h=>add({type:"hadith",eb:"From the Sunnah",h:"“"+h[0]+"”",cite:h[1],mark:"hadith"}));
  } else if(p.kind==="thinker"){
    sec("opening",p.opening,"Why it matters");
    sec("idea",p.idea,"The big idea"); sec("mechanics",p.mechanics,"Going deeper"); sec("practice",p.practice,"In the real world");
    verseCard("verses","Through the lens of faith");
    sec("faith",p.faith,"What the verses teach");
    p.hadith.forEach(h=>add({type:"hadith",eb:"From the Sunnah",h:"“"+h[0]+"”",cite:h[1],mark:"hadith"}));
    sec("nigerian",p.nigerian,"In the Nigerian context");
  } else {
    sec("opening",p.opening,"Opening");
    verseCard("verses","From the Qur'an");
    sec("verse",p.verse,"Understanding the verses");
    p.hadith.forEach(h=>add({type:"hadith",eb:"From the Sunnah",h:"“"+h[0]+"”",cite:h[1],mark:"hadith"}));
    sec("scholars",p.scholars,"The classical scholars"); sec("modern",p.modern,"Modern thought"); sec("nigerian",p.nigerian,"Nigerian wisdom");
  }
  add({type:"final",eb:"Well done",h:"You finished "+p.title,mark:"practices"});
  return C;
}
const ideaCount=p=>CARDS[p.id].filter(c=>c.type!=="intro"&&c.type!=="final").length;
const readMins=p=>Math.max(2,Math.round(CARDS[p.id].reduce((a,c)=>a+String(c.body||c.h||"").split(/\s+/).length,0)/200));
const listenMins=p=>TM[p.id]?Math.round(TM[p.id].dur/60):null;

/* ---------- progress, streaks, likes, stashes ---------- */
let READ=store.get("read",{}), DAYS=store.get("days",{}), LIKES=store.get("likes",{});
let STASHES=store.get("stashes",null)||[{id:"saved",name:"Saved ideas",cat:"Character",items:[]}];
function markRead(card){
  if(!card||card.type==="intro"||card.type==="final"||READ[card.key])return;
  READ[card.key]=today(); store.set("read",READ);
  const d=today(); DAYS[d]=(DAYS[d]||0)+1; store.set("days",DAYS);
  if(DAYS[d]===goal()) toast("Daily goal reached. Your streak is safe today.");
  checkBadges();
}
const goal=()=>store.get("goal",5);
function streak(){
  let n=0; const d=new Date(); if(!DAYS[dayKey(d)]) d.setDate(d.getDate()-1);
  while(DAYS[dayKey(d)]){n++;d.setDate(d.getDate()-1)} return n;
}
function bestStreak(){const ks=Object.keys(DAYS).sort();let best=0,run=0,prev=null;for(const k of ks){const t=new Date(k+"T12:00:00");if(prev&&(t-prev)/864e5<1.5)run++;else run=1;best=Math.max(best,run);prev=t}return best}
const totalRead=()=>Object.keys(READ).length;
const savedCount=()=>new Set(STASHES.flatMap(s=>s.items)).size;
const isSaved=k=>STASHES.some(s=>s.items.includes(k));
function saveStashes(){store.set("stashes",STASHES)}
const BADGES=[["s3","3-day streak",()=>bestStreak()>=3,"#FF6A3D"],["s7","7-day streak",()=>bestStreak()>=7,"#F59E0B"],["s30","30-day streak",()=>bestStreak()>=30,"#E11D48"],["s100","100-day streak",()=>bestStreak()>=100,"#7C3AED"],
  ["i10","10 ideas",()=>totalRead()>=10,"#0891B2"],["i50","50 ideas",()=>totalRead()>=50,"#16A34A"],["i200","200 ideas",()=>totalRead()>=200,"#2563EB"],["i500","500 ideas",()=>totalRead()>=500,"#DB2777"]];
function checkBadges(){const got=store.get("badges",{});for(const [id,name,f] of BADGES){if(!got[id]&&f()){got[id]=today();store.set("badges",got);toast("New badge: "+name);}}}

/* ---------- toast & sheet ---------- */
let toastT;function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove("on"),2400)}
function openSheet(html){$("#sheet-in").innerHTML=html;$("#sheet").classList.add("on");$("#sheet-bg").classList.add("on")}
function closeSheet(){$("#sheet").classList.remove("on");$("#sheet-bg").classList.remove("on")}
$("#sheet-bg").onclick=closeSheet;

function stashSheet(key){
  const card=cardByKey(key);
  const render=()=>openSheet(`<h3>Save to a stash</h3>
   <p class="muted" style="margin:-6px 0 10px;font-size:14px">${esc(card.h||"")}</p>
   ${STASHES.map(s=>`<button class="stash-opt" data-s="${s.id}"><span class="sq" style="background:${topicOf(s.cat).c1}">${icon("bookmarkf",20)}</span><span>${esc(s.name)}<br><small class="muted">${s.items.length} ideas</small></span>${s.items.includes(key)?'<span class="ck">Saved ✓</span>':""}</button>`).join("")}
   <div class="field"><input id="new-stash" placeholder="New stash, e.g. Leadership notes" maxlength="40"><button id="mk-stash">Create</button></div>`);
  render(); bind();
  function bind(){
    $$("#sheet-in .stash-opt").forEach(b=>b.onclick=()=>{const s=STASHES.find(x=>x.id===b.dataset.s);const i=s.items.indexOf(key);if(i>=0)s.items.splice(i,1);else{s.items.unshift(key);toast("Saved to "+s.name)}saveStashes();paintReaderActions();render();bind()});
    $("#mk-stash").onclick=()=>{const n=$("#new-stash").value.trim();if(!n)return;const cats=Object.keys(TOPICS);const s={id:"s"+Date.now(),name:n,cat:cats[STASHES.length%cats.length],items:[key]};STASHES.push(s);saveStashes();toast("Saved to "+n);paintReaderActions();render();bind()};
  }
}
function cardByKey(k){const [pid,i]=k.split(":");return CARDS[pid]?.[+i]}

/* ---------- UI pieces ---------- */
function coverEl(p,ratio="tall",small=false){return cover(p.id,p.cat,{ratio,small})}
function covHTML(p){
  const d=store.get("done",{}), pos=store.get("pos",{})[p.id], n=CARDS[p.id].length, pr=pos?Math.min(1,(pos+1)/n):0;
  return `<button class="cov" data-p="${p.id}"><div class="art">${coverEl(p)}${p.new?'<span class="newtag">NEW</span>':""}${OFF.has(p.id)?'<span class="offtag">● Offline</span>':""}${pr>0.05&&!d[p.id]?`<span class="prog"><i style="width:${pr*100}%"></i></span>`:""}</div><b>${esc(p.title)}</b><small>${esc(byline(p))}</small></button>`;
}
function icardHTML(c){const p=byId[c.pid];return `<button class="icard" data-k="${c.key}"><div class="bg">${cover(c.key,p.cat,{ratio:"tall",small:true})}</div><small>${esc(p.cat)}</small><h4>${prov(plainProv(c.h))}</h4><span>${esc(p.title)}</span></button>`}
function bindCommon(root){
  root.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{location.hash="p-"+b.dataset.p});
  root.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{const c=cardByKey(b.dataset.k);if(c)openReader(c.pid,c.i)});
  root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{exploreCat=b.dataset.cat;exploreQ="";location.hash="explore";});
}
function seeded(arr,seed,n){const r=rng(hashStr(seed));const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n)}

/* ---------- HOME ---------- */
function renderHome(){
  const t=today(), n=DAYS[t]||0, g=goal(), st=streak(), h=new Date().getHours();
  const hello=h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const pct=Math.min(1,n/g), C=2*Math.PI*32;
  const interests=store.get("interests",[]);
  const pool=ALLIDEAS.filter(c=>!interests.length||interests.includes(byId[c.pid].cat));
  const iotd=seeded(ALLIDEAS.filter(c=>c.type==="idea"&&c.h.length<110),"iotd"+t,1)[0];
  const forYou=seeded(pool.filter(c=>!READ[c.key]&&c.key!==iotd?.key),"fy"+t,8);
  const books=PK.filter(p=>p.kind==="book");
  const thinkers=PK.filter(p=>p.kind==="thinker");
  const islamic=PK.filter(p=>p.cat==="Tafsir"||p.cat==="Islamic Classics");
  const pos=store.get("pos",{}), lastR=store.get("lastRead",null), lp=lastR&&byId[lastR];
  const cont=lp&&pos[lastR]!=null&&pos[lastR]<CARDS[lastR].length-1?`<button class="cont" id="cont-read"><div class="art">${cover(lp.id,lp.cat,{ratio:"square",small:true})}</div><div style="flex:1;min-width:0"><small>Continue reading</small><b>${esc(lp.title)}</b><div class="bar"><i style="width:${((pos[lastR]+1)/CARDS[lastR].length*100).toFixed(0)}%"></i></div></div><span class="play-o">${icon("book",20)}</span></button>`:"";
  const cats=CAT_ORDER.filter(c=>PK.some(p=>p.cat===c));
  $("#home").innerHTML=`
   <div class="topbar"><div class="logo"><img src="icons/icon-96.png" alt="">Hikmah</div>
     <span class="streak ${st?"":"cold"}" title="Day streak">${icon("flame",18)} ${st}</span>
     <a class="iconbtn" href="${ASK_URL}" target="_blank" rel="noopener" aria-label="Ask Hikmah">${icon("ask",20)}</a></div>
   <div class="banner" id="install"></div>
   <div class="hello"><div style="flex:1;position:relative;z-index:1"><h1>${hello}</h1><p>${n>=g?"Goal reached today. Keep going if you like.":n?`${g-n} more idea${g-n>1?"s":""} to reach today's goal.`:`Read ${g} ideas today to keep your streak.`}</p></div>
     <div class="ring"><svg width="76" height="76" viewBox="0 0 76 76"><circle cx="38" cy="38" r="32" stroke="rgba(255,255,255,.3)" stroke-width="8" fill="none"/><circle cx="38" cy="38" r="32" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}"/></svg><b>${n}/${g}<small>today</small></b></div></div>
   ${cont}
   ${iotd?`<button class="iotd" data-k="${iotd.key}"><div class="art">${cover("iotd"+t,byId[iotd.pid].cat,{ratio:"wide"})}<span class="badge">Idea of the day</span></div><div class="txt"><h3>${prov(plainProv(iotd.h))}</h3><p>${esc(plainProv(iotd.body))}</p><div class="from"><span class="dot" style="background:${topicOf(byId[iotd.pid].cat).c1}"></span>${esc(byId[iotd.pid].title)}</div></div></button>`:""}
   <div class="h-sec"><h2>For you today</h2><a href="#you" id="edit-int">Your topics</a></div>
   <div class="rail">${forYou.map(icardHTML).join("")}</div>
   <div class="h-sec"><h2>New: book summaries</h2><button data-cat="Books">See all</button></div>
   <div class="rail">${seeded(books,"bk"+t,10).map(covHTML).join("")}</div>
   <div class="h-sec"><h2>Topics</h2></div>
   <div class="topics">${cats.map(c=>{const T=topicOf(c);return `<button class="topic" data-cat="${esc(c)}" style="background:linear-gradient(135deg,${T.c1},${T.c2})">${topicIcon(c,84).replace('<svg','<svg class="bgi"')}<b>${esc(c)}</b><span>${PK.filter(p=>p.cat===c).length} packages</span></button>`}).join("")}</div>
   <div class="h-sec"><h2>From the Qur'an & the scholars</h2><button data-cat="Tafsir">See all</button></div>
   <div class="rail">${islamic.map(covHTML).join("")}</div>
   <div class="h-sec"><h2>The great thinkers</h2><button data-cat="Thinkers">See all</button></div>
   <div class="rail">${seeded(thinkers,"th"+t,12).map(covHTML).join("")}</div>
   <p class="srcnote">${PK.length} packages · ${ALLIDEAS.length} ideas · ${(Object.values(TM).reduce((a,x)=>a+x.dur,0)/3600).toFixed(1)} hours of narration</p>`;
  bindCommon($("#home"));
  $("#cont-read")&&($("#cont-read").onclick=()=>openReader(lastR,pos[lastR]));
  $("#edit-int").onclick=e=>{e.preventDefault();openOnboarding(1)};
  paintInstall();
}

/* ---------- EXPLORE ---------- */
let exploreCat="All", exploreQ="";
function renderExplore(){
  const cats=["All","Books","Thinkers",...CAT_ORDER.filter(c=>PK.some(p=>p.cat===c))];
  $("#explore").innerHTML=`<div class="topbar"><h1 style="font-size:28px;font-weight:800">Explore</h1></div>
   <label class="search">${icon("search",20)}<input id="q" type="search" placeholder="Search ideas, books, scholars…" value="${esc(exploreQ)}" autocomplete="off"></label>
   <div class="chips" id="xchips">${cats.map(c=>`<button class="chip" aria-pressed="${c===exploreCat}" data-c="${esc(c)}">${c==="All"||c==="Books"||c==="Thinkers"?"":`<span class="dot" style="background:${topicOf(c).c1}"></span>`}${esc(c)}</button>`).join("")}</div>
   <div id="xres"></div>`;
  $("#q").oninput=e=>{exploreQ=e.target.value;results()};
  $$("#xchips .chip").forEach(b=>b.onclick=()=>{exploreCat=b.dataset.c;$$("#xchips .chip").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));results()});
  results();
  const act=$("#xchips [aria-pressed=true]");act&&act.scrollIntoView({inline:"center",block:"nearest"});
}
function inCat(p){return exploreCat==="All"||(exploreCat==="Books"?p.kind==="book":exploreCat==="Thinkers"?p.kind==="thinker":p.cat===exploreCat)}
function results(){
  const q=exploreQ.trim().toLowerCase(), words=q.split(/\s+/).filter(Boolean);
  const pk=PK.filter(p=>inCat(p)&&(!words.length||words.every(w=>p._hay.includes(w)))).sort((a,b)=>CAT_ORDER.indexOf(a.cat)-CAT_ORDER.indexOf(b.cat));
  let hits=[];
  if(words.length){hits=ALLIDEAS.filter(c=>inCat(byId[c.pid])&&words.every(w=>(c.h+" "+(c.body||"")).toLowerCase().includes(w))).slice(0,25)}
  $("#xres").innerHTML=(pk.length?`<div class="h-sec"><h2>${words.length?"Packages":esc(exploreCat==="All"?"All packages":exploreCat)}</h2><span class="muted" style="font-weight:700;font-size:14px">${pk.length}</span></div><div class="grid">${pk.map(covHTML).join("")}</div>`:"")+
   (hits.length?`<div class="h-sec"><h2>Ideas</h2><span class="muted" style="font-weight:700;font-size:14px">${hits.length}</span></div><div class="hits">${hits.map(c=>`<button class="hit" data-k="${c.key}"><span class="sw" style="background:${topicOf(byId[c.pid].cat).c1}"></span><span><b>${prov(plainProv(c.h))}</b><small>${esc(byId[c.pid].title)}</small></span></button>`).join("")}</div>`:"")+
   (!pk.length&&!hits.length?`<div class="empty">${cover("empty","Mind & Meaning",{motif:"eye",ratio:"wide",small:true})}<p>Nothing matches “${esc(q)}”. Try another word, or ask Hikmah.</p></div>`:"");
  bindCommon($("#xres"));
}

/* ---------- PACKAGE ---------- */
function renderPkg(id){
  const p=byId[id]; if(!p){location.hash="home";return}
  const T=topicOf(p.cat), C=CARDS[id], d=TM[id]?.dur, checks=store.get("chk:"+id,{}), pos=store.get("pos",{})[id];
  const related=PK.filter(x=>x.cat===p.cat&&x.id!==id).slice(0,8);
  $("#pkg").innerHTML=`
   <div class="phero">${cover(p.id,p.cat,{ratio:"wide"})}<button class="iconbtn back" id="pk-back" aria-label="Back">${icon("back",20)}</button></div>
   <div class="pbody">
    <span class="pcat" style="background:${T.c1}">${esc(p.cat)}${p.new?" · NEW":""}</span>
    <h1>${esc(p.title)}</h1><div class="by">${esc(byline(p))}</div>
    <p class="tag">${esc(p.tag)}</p>
    <div class="stats3"><div><b>${ideaCount(p)}</b><small>ideas</small></div><div><b>${readMins(p)}</b><small>min read</small></div><div><b>${d?Math.round(d/60):"–"}</b><small>min listen</small></div></div>
    <div class="cta"><button class="btn color" id="pk-read" style="background:linear-gradient(135deg,${T.c1},${T.c2})">${icon("book",20)} ${pos!=null&&pos>0&&pos<C.length-1?"Continue reading":"Read ideas"}</button>
      <button class="btn primary" id="pk-listen" ${d?"":"disabled"}>${icon("head",20)} ${d?"Listen":"Recording…"}</button></div>
    <div class="small-row"><button id="pk-off" ${d?"":"disabled"}></button><button id="pk-ask">${icon("ask",18)} Ask about it</button></div>
    <div class="h-sec"><h2>What you'll learn</h2></div>
    <div class="learn">${C.filter(c=>c.type!=="intro"&&c.type!=="final").map((c,n)=>`<button data-k="${c.key}"><span class="n" style="background:${T.c1}">${n+1}</span><b>${c.type==="verse"?esc(c.eb)+" · "+c.verses.map(v=>v.s+":"+v.v).join(", "):prov(plainProv(c.h))}</b>${READ[c.key]?'<span class="seen">✓</span>':""}</button>`).join("")}</div>
    <div class="h-sec"><h2>Practices for this week</h2></div>
    <div class="checks">${p.practices.map((x,i)=>`<label for="c-${id}-${i}"><input type="checkbox" id="c-${id}-${i}" data-i="${i}" ${checks[i]?"checked":""}><span>${prov(x)}</span></label>`).join("")}</div>
    <div class="h-sec"><h2>Reflect</h2></div>
    <ol class="reflect">${p.reflect.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
    ${related.length?`<div class="h-sec"><h2>More in ${esc(p.cat)}</h2></div><div class="rail">${related.map(covHTML).join("")}</div>`:""}
    <p class="srcnote">${p.kind==="book"?"A summary in our own words, linked to Islamic sources. ":""}Arabic: Tanzil Uthmani · Translation: Saheeh International · Recitation: Mishary Rashid Alafasy · Narration: synthetic voice.</p>
   </div>`;
  bindCommon($("#pkg"));
  $("#pk-back").onclick=()=>history.length>1?history.back():location.hash="home";
  $("#pk-read").onclick=()=>openReader(id,pos!=null&&pos<C.length-1?pos:0);
  $("#pk-listen").onclick=()=>{play(id);openNP()};
  const ob=$("#pk-off");paintOff(id,ob);ob.onclick=()=>toggleOffline(id,ob);
  $("#pk-ask").onclick=async()=>{try{await navigator.clipboard.writeText(`About the package “${p.title}” (${byline(p)}): `)}catch(e){}window.open(ASK_URL,"_blank","noopener")};
  $$("#pkg .checks input").forEach(c=>c.onchange=()=>{const k=store.get("chk:"+id,{});k[c.dataset.i]=c.checked;store.set("chk:"+id,k)});
}

/* ---------- STASHES ---------- */
function renderStashes(){
  const liked=Object.keys(LIKES).filter(k=>cardByKey(k));
  $("#stashes").innerHTML=`<div class="topbar"><h1 style="font-size:28px;font-weight:800">Your stashes</h1></div>
   <p class="muted" style="margin:4px 0 0">Ideas you saved, organised your way.</p>
   <div class="stashes">${STASHES.map(s=>`<button class="stash" data-s="${s.id}"><div class="bg">${cover(s.id,s.cat,{ratio:"square",small:true,motif:"book"})}</div><b>${esc(s.name)}</b><span>${s.items.length} idea${s.items.length===1?"":"s"}</span></button>`).join("")}
    ${liked.length?`<button class="stash" data-s="__liked"><div class="bg">${cover("liked","Family",{ratio:"square",small:true,motif:"heart"})}</div><b>Liked ideas</b><span>${liked.length} ideas</span></button>`:""}
    <button class="stash new" id="new-st">${icon("plus",26)}<b style="font-size:15px">New stash</b></button></div>
   ${!savedCount()?`<div class="empty">${cover("emptyst","Communication & People",{motif:"book",ratio:"wide",small:true})}<p>Tap the bookmark on any idea card to save it here.</p></div>`:""}`;
  $$("#stashes [data-s]").forEach(b=>b.onclick=()=>{location.hash="stash-"+b.dataset.s});
  $("#new-st").onclick=()=>{openSheet(`<h3>New stash</h3><div class="field"><input id="ns-name" placeholder="e.g. Board meeting ideas" maxlength="40"><button id="ns-go">Create</button></div>`);$("#ns-name").focus();$("#ns-go").onclick=()=>{const n=$("#ns-name").value.trim();if(!n)return;const cats=Object.keys(TOPICS);STASHES.push({id:"s"+Date.now(),name:n,cat:cats[STASHES.length%cats.length],items:[]});saveStashes();closeSheet();renderStashes()}};
}
function renderStash(id){
  const s=id==="__liked"?{id,name:"Liked ideas",cat:"Family",items:Object.keys(LIKES)}:STASHES.find(x=>x.id===id);
  if(!s){location.hash="stashes";return}
  const items=s.items.map(cardByKey).filter(Boolean);
  $("#stash").innerHTML=`<div class="topbar"><button class="iconbtn" id="st-back" aria-label="Back">${icon("back",20)}</button><h1 style="font-size:24px;font-weight:800;flex:1">${esc(s.name)}</h1>${id!=="saved"&&id!=="__liked"?`<button class="pill soft" id="st-del">Delete</button>`:""}</div>
   <p class="muted" style="margin:6px 0 0">${items.length} idea${items.length===1?"":"s"}</p>
   <div class="saved">${items.map(c=>{const p=byId[c.pid];return `<div class="it"><span class="sw" style="background:${topicOf(p.cat).c1}"></span><button class="main" data-k="${c.key}"><b>${c.type==="verse"?"Qur'an "+c.verses.map(v=>v.s+":"+v.v).join(", "):prov(plainProv(c.h))}</b>${c.body?`<p>${esc(plainProv(c.body))}</p>`:""}<small>${esc(p.title)}</small></button><button class="rm" data-rm="${c.key}" aria-label="Remove">×</button></div>`}).join("")}</div>
   ${!items.length?`<div class="empty"><p>No ideas here yet. Save ideas from any card.</p></div>`:""}`;
  bindCommon($("#stash"));
  $("#st-back").onclick=()=>location.hash="stashes";
  $$("#stash [data-rm]").forEach(b=>b.onclick=()=>{const k=b.dataset.rm;if(id==="__liked"){delete LIKES[k];store.set("likes",LIKES)}else{s.items=s.items.filter(x=>x!==k);saveStashes()}renderStash(id)});
  $("#st-del")&&($("#st-del").onclick=()=>{openSheet(`<h3>Delete “${esc(s.name)}”?</h3><p class="muted">The ideas stay in the library; only this stash is removed.</p><div class="cta"><button class="btn soft" id="dl-no">Keep</button><button class="btn primary" id="dl-yes">Delete</button></div>`);$("#dl-no").onclick=closeSheet;$("#dl-yes").onclick=()=>{STASHES=STASHES.filter(x=>x.id!==id);saveStashes();closeSheet();location.hash="stashes"}});
}

/* ---------- YOU ---------- */
function renderYou(){
  const st=streak(),best=bestStreak(),got=store.get("badges",{}),mins=Math.round(store.get("listened",0)/60),done=Object.keys(store.get("completed",{})).length;
  const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d});
  const names=["S","M","T","W","T","F","S"];
  $("#you").innerHTML=`<div class="topbar"><h1 style="font-size:28px;font-weight:800">You</h1><span class="streak ${st?"":"cold"}" style="margin-left:auto">${icon("flame",18)} ${st} day${st===1?"":"s"}</span></div>
   <div class="week">${wk.map((d,i)=>`<div><i class="${DAYS[dayKey(d)]?"hit":""} ${i===6?"today":""}">${DAYS[dayKey(d)]?icon("flame",16):""}</i>${names[d.getDay()]}</div>`).join("")}</div>
   <div class="kpis">
    <div class="kpi"><span class="ic" style="background:#FF6A3D">${icon("flame",18)}</span><b>${best}</b><small>Best streak</small></div>
    <div class="kpi"><span class="ic" style="background:#6D4AFF">${icon("spark",18)}</span><b>${totalRead()}</b><small>Ideas read</small></div>
    <div class="kpi"><span class="ic" style="background:#16A34A">${icon("check",18)}</span><b>${done}</b><small>Packages finished</small></div>
    <div class="kpi"><span class="ic" style="background:#0891B2">${icon("head",18)}</span><b>${mins}</b><small>Minutes listened</small></div></div>
   <div class="h-sec"><h2>Badges</h2></div>
   <div class="badges">${BADGES.map(([id,name,,col])=>`<div class="badge ${got[id]?"got":""}"><i style="${got[id]?`background:${col}`:""}">${id.startsWith("s")?icon("flame",24):icon("trophy",24)}</i>${esc(name)}</div>`).join("")}</div>
   <div class="h-sec"><h2>Settings</h2></div>
   <div class="group">
    <div class="row"><div class="l"><b>Daily goal</b><small>Ideas to read each day</small></div><div class="seg" id="goal-seg">${[3,5,10,15].map(v=>`<button data-v="${v}" aria-pressed="${goal()===v}">${v}</button>`).join("")}</div></div>
    <button class="row" id="edit-topics"><div class="l"><b>Your topics</b><small>${(store.get("interests",[]).length||"All")} topics shape your daily feed</small></div><span class="pill soft">Edit</span></button>
    <div class="row"><div class="l"><b>Text size</b><small>For reading idea cards</small></div><div class="seg" id="fs-seg">${[[0.92,"A−"],[1,"A"],[1.12,"A+"],[1.25,"A++"]].map(([v,l])=>`<button data-v="${v}" aria-pressed="${store.get("fs",1)===v}">${l}</button>`).join("")}</div></div>
    <div class="row"><div class="l"><b>Play the next package automatically</b><small>Within the same topic</small></div><input type="checkbox" class="switch" id="autonext" ${store.get("autonext",true)?"checked":""} aria-label="Autoplay next"></div>
   </div>
   <div class="group">
    <div class="row" style="display:block"><div style="display:flex;gap:12px;align-items:center"><div class="l"><b>Download for offline</b><small id="dl-info">All packages, about 160 MB</small></div><button class="pill" id="dl-all">Download</button></div><div class="bar"><i id="dl-bar"></i></div></div>
    <div class="row"><div class="l"><b>Saved on this phone</b><small id="dl-count">Checking…</small></div><button class="pill soft" id="dl-clear">Remove</button></div>
   </div>
   <div class="group">
    <a class="row" href="${ASK_URL}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><div class="l"><b>Ask Hikmah</b><small>Chat about any idea, verse or decision (opens in Claude)</small></div>${icon("ask",20)}</a>
    <button class="row" id="reset-prog"><div class="l"><b>Reset progress</b><small>Clears reading, streaks and listening history</small></div><span class="pill soft">Reset</span></button>
   </div>
   <p class="srcnote">Hikmah ${VERSION} · ${PK.length} packages · ${ALLIDEAS.length} ideas. Arabic text: Tanzil Uthmani. Translation: Saheeh International. Recitation: Mishary Rashid Alafasy. Book summaries are written in our own words. Narration is a synthetic voice.</p>`;
  $$("#goal-seg button").forEach(b=>b.onclick=()=>{store.set("goal",+b.dataset.v);renderYou()});
  $$("#fs-seg button").forEach(b=>b.onclick=()=>{store.set("fs",+b.dataset.v);applyFs();renderYou()});
  $("#autonext").onchange=e=>store.set("autonext",e.target.checked);
  $("#edit-topics").onclick=()=>openOnboarding(1);
  $("#dl-all").onclick=downloadAll; $("#dl-clear").onclick=clearDownloads;
  $("#reset-prog").onclick=()=>{openSheet(`<h3>Reset all progress?</h3><p class="muted">Your stashes stay. Reading history, streaks, badges and listening progress are cleared.</p><div class="cta"><button class="btn soft" id="rs-no">Cancel</button><button class="btn primary" id="rs-yes">Reset</button></div>`);$("#rs-no").onclick=closeSheet;$("#rs-yes").onclick=()=>{["read","days","badges","prog","done","pos","completed","listened","lastRead","last"].forEach(k=>store.set(k,k==="last"||k==="lastRead"?null:{}));store.set("listened",0);READ={};DAYS={};closeSheet();renderYou();toast("Progress reset")}};
  refreshOffline();
}
function applyFs(){document.documentElement.style.setProperty("--fs",store.get("fs",1))}

/* ---------- READER ---------- */
let RD={pid:null,i:0,follow:false};
function openReader(pid,i=0){
  RD={pid,i:Math.max(0,Math.min(i,CARDS[pid].length-1)),follow:cur===pid&&!A.paused};
  store.set("lastRead",pid);
  $("#reader").classList.add("on");document.body.classList.add("reader-open");
  $("#rd-title").textContent=byId[pid].title;
  $("#rd-bars").innerHTML=CARDS[pid].map(()=>"<i></i>").join("");
  $("#rd-stage").innerHTML="";
  showCard(RD.i,0);
  history.pushState({rd:1},"");
}
function closeReader(){$("#reader").classList.remove("on");document.body.classList.remove("reader-open");route(true)}
function cardHTML(c){
  const p=byId[c.pid], bg=`<div class="cbg">${cover(c.type==="intro"?p.id:c.key,p.cat,{ratio:"tall",small:c.type!=="intro"})}</div>`;
  if(c.type==="intro") return `<div class="card intro">${bg}<div class="cin"><div class="eb">${esc(p.cat)} · ${ideaCount(p)} ideas</div><h2>${esc(p.title)}</h2><div class="by">${esc(c.by)}</div><p>${esc(c.body)}</p><p style="font-size:14px;opacity:.85;font-weight:700">Swipe or tap the right side to begin →</p></div></div>`;
  if(c.type==="verse") return `<div class="card vcard">${bg}<div class="cin"><div class="eb">${esc(c.eb)}</div>${c.verses.map(v=>`<p class="arq" lang="ar">${esc(v.ar)} ﴿${v.v.toLocaleString("ar-EG")}﴾</p><p style="margin-top:4px">${esc(v.en)}</p><div class="vref">Qur'an ${v.s}:${v.v}</div>`).join("")}</div></div>`;
  if(c.type==="hadith") return `<div class="card">${bg}<div class="cin"><div class="eb">${esc(c.eb)}</div><h2>${esc(c.h)}</h2><div class="cite">${esc(c.cite)}</div></div></div>`;
  if(c.type==="final"){const checks=store.get("chk:"+p.id,{});const nx=nextPkg(p.id);
    return `<div class="card final"><div class="cin"><div class="eb">${icon("trophy",16)} Package complete</div><h2>${esc(c.h)}</h2><p>Put it into practice this week:</p><div class="checks" style="margin-top:12px">${p.practices.map((x,i)=>`<label><input type="checkbox" data-i="${i}" ${checks[i]?"checked":""}><span>${prov(x)}</span></label>`).join("")}</div>
      <div class="final-btns">${TM[p.id]?`<button id="fn-listen">${icon("head",18,'style="vertical-align:-4px"')} Listen to the narration</button>`:""}${nx?`<button class="ghost" id="fn-next">Next: ${esc(byId[nx].title)} →</button>`:""}<button class="ghost" id="fn-close">Back to the package</button></div></div></div>`}
  return `<div class="card">${bg}<div class="cin"><div class="eb">${esc(c.eb)}</div><h2>${c.prov?prov(c.h):esc(c.h)}</h2>${c.body?`<p>${prov(c.body)}</p>`:""}</div></div>`;
}
function showCard(i,dir){
  const C=CARDS[RD.pid]; i=Math.max(0,Math.min(i,C.length-1));
  const stage=$("#rd-stage"), old=stage.querySelector(".card");
  const tmp=document.createElement("div");tmp.innerHTML=cardHTML(C[i]);const el=tmp.firstElementChild;
  if(dir){el.style.transform=`translateX(${dir>0?100:-100}%)`;el.style.opacity=".6"}
  stage.appendChild(el);
  requestAnimationFrame(()=>{el.style.transform="";el.style.opacity="";if(old){old.style.transform=`translateX(${dir>0?-30:30}%)`;old.style.opacity="0";setTimeout(()=>old.remove(),330)}});
  RD.i=i;
  $$("#rd-bars i").forEach((b,k)=>{b.className=k<i?"done":k===i?"cur":""});
  const pos=store.get("pos",{});pos[RD.pid]=i;store.set("pos",pos);
  markRead(C[i]);
  if(C[i].type==="final"){const cp=store.get("completed",{});if(!cp[RD.pid]){cp[RD.pid]=today();store.set("completed",cp)}
    el.querySelectorAll(".checks input").forEach(c=>c.onchange=()=>{const k=store.get("chk:"+RD.pid,{});k[c.dataset.i]=c.checked;store.set("chk:"+RD.pid,k)});
    const L=el.querySelector("#fn-listen");L&&(L.onclick=()=>{play(RD.pid,false,0);RD.follow=true;closeReaderSoft();openNP()});
    const N=el.querySelector("#fn-next");N&&(N.onclick=()=>{const nx=nextPkg(RD.pid);openReaderReplace(nx)});
    el.querySelector("#fn-close").onclick=()=>{history.back()};
  }
  paintReaderActions();
}
function openReaderReplace(pid){RD.pid=pid;RD.i=0;$("#rd-title").textContent=byId[pid].title;$("#rd-bars").innerHTML=CARDS[pid].map(()=>"<i></i>").join("");store.set("lastRead",pid);showCard(0,1)}
function closeReaderSoft(){if($("#reader").classList.contains("on"))history.back()}
function nextPkg(pid){const o=PK.filter(x=>x.cat===byId[pid].cat);const k=o.findIndex(x=>x.id===pid);return (o[k+1]||PK[(PK.findIndex(x=>x.id===pid)+1)%PK.length]).id}
function paintReaderActions(){
  if(!RD.pid)return; const c=CARDS[RD.pid][RD.i], k=c.key, show=c.type!=="intro"&&c.type!=="final";
  $("#rd-actions").style.display=c.type==="final"?"none":"flex";
  $("#ra-like").innerHTML=icon(LIKES[k]?"heartf":"heart",22);$("#ra-like").classList.toggle("liked",!!LIKES[k]);$("#ra-like").style.display=show?"":"none";
  $("#ra-save").innerHTML=icon(isSaved(k)?"bookmarkf":"bookmark",22)+(isSaved(k)?" Saved":" Save");$("#ra-save").classList.toggle("on",isSaved(k));$("#ra-save").style.display=show?"":"none";
  const playingHere=cur===RD.pid&&loadedId===RD.pid&&!A.paused;
  $("#ra-listen").innerHTML=icon(playingHere?"pause":"head",22)+(playingHere?" Pause":" Listen");$("#ra-listen").style.display=TM[RD.pid]?"":"none";
  $("#ra-copy").innerHTML=icon("copy",22);$("#ra-copy").style.display=show?"":"none";
  $("#rd-follow").innerHTML=icon("follow",20);$("#rd-follow").classList.toggle("on",RD.follow);$("#rd-follow").style.display=cur===RD.pid&&loadedId===RD.pid?"":"none";
}
$("#ra-like").onclick=()=>{const k=CARDS[RD.pid][RD.i].key;if(LIKES[k])delete LIKES[k];else{LIKES[k]=today();toast("Liked")}store.set("likes",LIKES);paintReaderActions()};
$("#ra-save").onclick=()=>stashSheet(CARDS[RD.pid][RD.i].key);
$("#ra-copy").onclick=async()=>{const c=CARDS[RD.pid][RD.i],p=byId[RD.pid];const txt=c.type==="verse"?c.verses.map(v=>`${v.ar}\n${v.en} (Qur'an ${v.s}:${v.v})`).join("\n\n"):`${plainProv(c.h)}\n\n${plainProv(c.body||"")}`;try{await navigator.clipboard.writeText(`${txt}\n\n— ${p.title}, from Hikmah`);toast("Copied. Paste it anywhere to share.")}catch(e){toast("Copy is not allowed here")}};
$("#ra-listen").onclick=()=>{const c=CARDS[RD.pid][RD.i];if(cur===RD.pid&&loadedId===RD.pid&&!A.paused){A.pause();return}const m=TM[RD.pid]?.marks?.find(x=>x[0]===c.mark);RD.follow=true;play(RD.pid,false,c.type==="intro"?0:(m?m[1]:undefined))};
$("#rd-follow").onclick=()=>{RD.follow=!RD.follow;paintReaderActions();toast(RD.follow?"Cards will follow the narration":"Follow off")};
$("#rd-close").innerHTML=icon("x",20);$("#rd-close").onclick=()=>history.back();
$("#tz-r").onclick=()=>{RD.follow=false;if(RD.i<CARDS[RD.pid].length-1)showCard(RD.i+1,1)};
$("#tz-l").onclick=()=>{RD.follow=false;if(RD.i>0)showCard(RD.i-1,-1)};
(()=>{let x0=null,y0=null,t0=0;const st=$("#rd-stage");
  $("#reader").addEventListener("touchstart",e=>{if(e.target.closest(".rd-actions,.rd-top,.checks,.final-btns"))return;x0=e.touches[0].clientX;y0=e.touches[0].clientY;t0=Date.now()},{passive:true});
  $("#reader").addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){RD.follow=false;if(dx<0&&RD.i<CARDS[RD.pid].length-1)showCard(RD.i+1,1);else if(dx>0&&RD.i>0)showCard(RD.i-1,-1)}
    else if(dy>110&&Math.abs(dy)>Math.abs(dx)*1.5&&Date.now()-t0<600)history.back()},{passive:true});
})();
addEventListener("keydown",e=>{if(!$("#reader").classList.contains("on"))return;if(e.key==="ArrowRight")$("#tz-r").click();else if(e.key==="ArrowLeft")$("#tz-l").click();else if(e.key==="Escape")history.back()});

/* ---------- AUDIO ---------- */
const A=$("#audio"); let cur=null, loadedId=null, blobURL=null, loadSeq=0, unlocked=false, seeking=false;
const SILENT="data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAACQAABCAARUVFRUVFRUVFRUVdXV1dXV1dXV1dXXR0dHR0dHR0dHR0i4uLi4uLi4uLi4uioqKioqKioqKiorq6urq6urq6urq60dHR0dHR0dHR0dHo6Ojo6Ojo6Ojo6P//////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQD8AAAAAAAAAQgDeb0IwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExFMAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
function unlock(){if(unlocked)return;unlocked=true;try{A.src=SILENT;const p=A.play();p&&p.then(()=>{if(A.src===SILENT)A.pause()}).catch(()=>{})}catch(e){}}
const AUDIO_CACHE="hikmah-audio-v1"; let OFF=new Set();
const audioURL=id=>new URL("audio/"+id+".mp3",location.href).href;
async function audioBlob(id,onProg){
  try{const c=await caches.open(AUDIO_CACHE);const hit=await c.match(audioURL(id));if(hit)return await hit.blob()}catch(e){}
  const r=await fetch("audio/"+id+".mp3",{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);
  const total=+r.headers.get("content-length")||0;let blob;
  if(r.body&&r.body.getReader&&total){const rd=r.body.getReader(),parts=[];let got=0;for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;onProg&&onProg(got/total)}blob=new Blob(parts,{type:"audio/mpeg"})}
  else blob=new Blob([await r.arrayBuffer()],{type:"audio/mpeg"});
  try{const c=await caches.open(AUDIO_CACHE);await c.put(audioURL(id),new Response(blob,{headers:{"Content-Type":"audio/mpeg","Content-Length":String(blob.size)}}));OFF.add(id)}catch(e){}
  return blob;
}
function showPlayer(){$("#player").classList.add("on");document.documentElement.style.setProperty("--player","70px")}
async function play(id,resume,at){
  if(!TM[id])return; unlock(); showPlayer(); store.set("last",id);
  if(loadedId===id){if(at!=null)A.currentTime=at;A.play().catch(()=>{});setMeta();syncPlayer();return}
  const seq=++loadSeq; cur=id; renderChapters(); setMeta(); paintPlayerStatic();
  const pr=store.get("prog",{})[id]||0, start=at!=null?at:(pr<(TM[id]?.dur||1e9)-5?pr:0);
  const msg=t=>{if(seq===loadSeq){$("#pl-t small").textContent=t;$("#np-sec").textContent=t}};
  msg(OFF.has(id)?"Opening…":"Preparing audio…");
  let blob;try{blob=await audioBlob(id,f=>msg("Preparing audio "+Math.round(f*100)+"%"))}catch(e){if(seq===loadSeq)msg(navigator.onLine?"Couldn't load the audio. Tap play to try again.":"You're offline and this package isn't saved yet.");loadedId=null;return}
  if(seq!==loadSeq)return;
  if(blobURL)URL.revokeObjectURL(blobURL);blobURL=URL.createObjectURL(blob);
  A.src=blobURL;loadedId=id;A.playbackRate=store.get("rate",1);
  A.addEventListener("loadedmetadata",()=>{try{if(start>0&&Math.abs(A.currentTime-start)>1)A.currentTime=start}catch(e){}},{once:true});
  A.play().catch(()=>msg("Tap play to start"));
  syncPlayer();
  setTimeout(()=>{if(cur!==id||!store.get("autonext",true))return;const n=neighbour(1,true);if(n&&!OFF.has(n)&&navigator.onLine)saveOne(n).catch(()=>{})},8000);
}
function neighbour(dir,sameCat){const o=PK.filter(p=>TM[p.id]&&(!sameCat||p.cat===byId[cur].cat));const i=o.findIndex(p=>p.id===cur);return o[i+dir]?.id}
function currentMark(){const ms=TM[cur]?.marks||[];let m=null;for(const x of ms)if(A.currentTime>=x[1]-.2)m=x[0];return m}
function markLabel(m){if(!m)return"";if(/^idea\d+$/.test(m)&&byId[cur]?.kind==="book"){const n=+m.slice(4);return "Idea "+(n+1)+": "+plainProv(byId[cur].ideas[n][0])}return LABEL[m]||m}
function paintPlayerStatic(){if(!cur)return;const p=byId[cur];$("#pl-art").innerHTML=cover(p.id,p.cat,{ratio:"square",small:true});$("#pl-t b").textContent=p.title;$("#np-bg").innerHTML=cover(p.id+"bg",p.cat,{ratio:"tall"});$("#np-art").innerHTML=cover(p.id,p.cat,{ratio:"square"});$("#np-cat").textContent=p.cat;$("#np-title").textContent=p.title;$("#np-sub").textContent=byline(p)}
function syncPlayer(){
  if(!cur)return;
  const playing=loadedId===cur&&!A.paused;
  for(const b of [$("#pl-play"),$("#np-play")])b.innerHTML=icon(playing?"pause":"play",b.id==="np-play"?30:20);
  if(loadedId!==cur)return;
  const d=A.duration||TM[cur]?.dur||0,m=currentMark();
  $("#pl-t small").textContent=`${fmt(A.currentTime)} / ${fmt(d)}${sleepEnd?" · ☾":""}`;
  $("#pl-pg").style.width=(d?A.currentTime/d*100:0)+"%";
  if($("#np").classList.contains("on")){if(!seeking&&d)$("#np-seek").value=Math.round(A.currentTime/d*1000);$("#np-cur").textContent=fmt(A.currentTime);$("#np-dur").textContent="-"+fmt(d-A.currentTime);$("#np-sec").textContent=markLabel(m);$("#np-rate").textContent=A.playbackRate+"× speed";$$("#np-chap button").forEach(b=>b.classList.toggle("cur",b.dataset.mark===m))}
  if("mediaSession" in navigator&&d&&navigator.mediaSession.setPositionState){try{navigator.mediaSession.setPositionState({duration:d,playbackRate:A.playbackRate,position:Math.min(A.currentTime,d)})}catch(e){}}
  if(RD.follow&&RD.pid===cur&&$("#reader").classList.contains("on")&&m){const idx=CARDS[cur].findIndex(c=>c.mark===m);if(idx>=0&&idx!==RD.i&&!(CARDS[cur][RD.i].mark===m))showCard(idx,idx>RD.i?1:-1)}
  if($("#reader").classList.contains("on"))paintReaderActions();
}
function setMeta(){if(!("mediaSession" in navigator)||!cur)return;const p=byId[cur];navigator.mediaSession.metadata=new MediaMetadata({title:p.title,artist:byline(p),album:"Hikmah · "+p.cat,artwork:[96,192,512].map(s=>({src:`icons/icon-${s}.png`,sizes:`${s}x${s}`,type:"image/png"}))})}
if("mediaSession" in navigator){const h=(a,f)=>{try{navigator.mediaSession.setActionHandler(a,f)}catch(e){}};
  h("play",()=>loadedId===cur?A.play():cur&&play(cur,true));h("pause",()=>A.pause());h("seekbackward",()=>{A.currentTime=Math.max(0,A.currentTime-15)});h("seekforward",()=>{A.currentTime+=30});
  h("seekto",d=>{if(d.seekTime!=null)A.currentTime=d.seekTime});h("previoustrack",()=>{if(A.currentTime>5)A.currentTime=0;else{const n=neighbour(-1);n&&play(n,false,0)}});h("nexttrack",()=>{const n=neighbour(1);n&&play(n,false,0)})}
let lastSave=0,lastT=null;
A.addEventListener("timeupdate",()=>{if(loadedId!==cur)return;syncPlayer();checkSleep();
  if(!A.paused){const now=A.currentTime;if(lastT!=null&&now>lastT&&now-lastT<3){store.set("listened",store.get("listened",0)+(now-lastT))}lastT=now}
  if(Date.now()-lastSave>4000){lastSave=Date.now();const g=store.get("prog",{});g[cur]=A.currentTime;store.set("prog",g)}});
A.addEventListener("play",()=>{lastT=A.currentTime;syncPlayer()});
["pause","ratechange","loadedmetadata"].forEach(ev=>A.addEventListener(ev,syncPlayer));
A.addEventListener("pause",()=>{lastT=null;if(cur&&loadedId===cur){const g=store.get("prog",{});g[cur]=A.currentTime;store.set("prog",g)}});
A.addEventListener("ended",()=>{if(loadedId!==cur)return;const d=store.get("done",{});d[cur]=1;store.set("done",d);const g=store.get("prog",{});g[cur]=0;store.set("prog",g);
  if(sleepEnd==="end"){sleepEnd=null;updSleep();syncPlayer();return}
  const n=store.get("autonext",true)?neighbour(1,true):null;n?play(n,false,0):syncPlayer()});
A.addEventListener("error",()=>{if(!cur||!loadedId||A.src===SILENT)return;loadedId=null;$("#pl-t small").textContent="Audio could not play. Tap play to try again."});
$("#pl-play").onclick=$("#np-play").onclick=()=>{if(!cur)return;if(loadedId!==cur){play(cur,true);return}A.paused?A.play().catch(()=>{}):A.pause()};
$("#pl-b15").innerHTML=icon("b15",22);$("#np-b15").innerHTML=icon("b15",30);$("#np-f30").innerHTML=icon("f30",30);$("#np-prev").innerHTML=icon("prev",24);$("#np-next").innerHTML=icon("next",24);
$("#pl-b15").onclick=$("#np-b15").onclick=()=>{A.currentTime=Math.max(0,A.currentTime-15)};
$("#np-f30").onclick=()=>{A.currentTime=Math.min((A.duration||1e9)-1,A.currentTime+30)};
$("#np-next").onclick=()=>{const n=neighbour(1);n&&play(n,false,0)};
$("#np-prev").onclick=()=>{if(A.currentTime>5)A.currentTime=0;else{const n=neighbour(-1);n&&play(n,false,0)}};
const RATES=[0.9,1,1.15,1.3,1.5];
$("#np-rate").onclick=()=>{const r=RATES[(RATES.indexOf(A.playbackRate)+1)%RATES.length]||1;A.playbackRate=r;store.set("rate",r);syncPlayer()};
$("#np-seek").addEventListener("input",()=>{seeking=true;const d=A.duration||TM[cur]?.dur;$("#np-cur").textContent=fmt($("#np-seek").value/1000*d)});
$("#np-seek").addEventListener("change",()=>{const d=A.duration||TM[cur]?.dur;if(d)A.currentTime=$("#np-seek").value/1000*d;seeking=false});
function openNP(){if(!cur)return;paintPlayerStatic();renderChapters();$("#np").classList.add("on");syncPlayer();history.pushState({np:1},"")}
$("#pl-t").onclick=openNP;$("#pl-t").onkeydown=e=>{if(e.key==="Enter")openNP()};
$("#np-close").onclick=()=>history.back();
$("#np-read").onclick=()=>{const m=currentMark();const idx=Math.max(0,CARDS[cur].findIndex(c=>c.mark===m));$("#np").classList.remove("on");RD.follow=true;openReader(cur,idx);RD.follow=true;paintReaderActions()};
function renderChapters(){if(!cur)return;$("#np-chap").innerHTML=(TM[cur]?.marks||[]).map(m=>`<button data-mark="${m[0]}" data-t="${m[1]}"><span style="opacity:1">${esc(markLabel(m[0])||m[0])}</span><span>${fmt(m[1])}</span></button>`).join("");
  $$("#np-chap button").forEach(b=>b.onclick=()=>{if(loadedId===cur){A.currentTime=+b.dataset.t;A.play().catch(()=>{})}else play(cur,false,+b.dataset.t)})}
let sleepEnd=null,sleepMin=null;const SLEEPS=[null,15,30,45,60,"end"];
function updSleep(){const b=$("#np-sleep");b.classList.toggle("act",!!sleepEnd);b.textContent=!sleepEnd?"Sleep timer: off":sleepEnd==="end"?"Sleep: end of package":"Sleep: "+Math.max(1,Math.ceil((sleepEnd-Date.now())/60000))+" min"}
$("#np-sleep").onclick=()=>{const ci=sleepEnd==="end"?5:sleepEnd?SLEEPS.indexOf(sleepMin):0;const nx=SLEEPS[(ci+1)%SLEEPS.length];sleepMin=nx;sleepEnd=nx==="end"?"end":nx?Date.now()+nx*60000:null;updSleep();syncPlayer()};
function checkSleep(){if(sleepEnd&&sleepEnd!=="end"){if(Date.now()>=sleepEnd){A.pause();sleepEnd=null;sleepMin=null}updSleep()}}

/* ---------- OFFLINE ---------- */
async function refreshOffline(){
  if("caches" in window){try{const c=await caches.open(AUDIO_CACHE);const keys=await c.keys();OFF=new Set(keys.map(r=>(r.url.match(/audio\/([a-z0-9]+)\.mp3/)||[])[1]).filter(Boolean))}catch(e){}}
  const tot=Object.keys(TM).length,n=[...OFF].filter(x=>TM[x]).length;
  if($("#dl-count")){$("#dl-count").textContent=`${n} of ${tot} packages`;if(navigator.storage&&navigator.storage.estimate){try{const e=await navigator.storage.estimate();$("#dl-count").textContent+=` · ${Math.round((e.usage||0)/1048576)} MB used`}catch(e){}}
    $("#dl-bar").style.width=(tot?n/tot*100:0)+"%";if(!dlBusy)$("#dl-all").textContent=n>=tot&&tot?"All saved":"Download"}
}
async function saveOne(id){const c=await caches.open(AUDIO_CACHE);if(await c.match(audioURL(id))){OFF.add(id);return}const r=await fetch("audio/"+id+".mp3",{cache:"no-store"});if(!r.ok)throw new Error("fetch");await c.put(audioURL(id),r);OFF.add(id)}
let dlBusy=false;
async function downloadAll(){
  if(dlBusy)return;if(!navigator.onLine){$("#dl-info").textContent="Connect to the internet to download.";return}
  dlBusy=true;if(navigator.storage&&navigator.storage.persist){try{await navigator.storage.persist()}catch(e){}}
  const ids=PK.filter(p=>TM[p.id]&&!OFF.has(p.id)).map(p=>p.id);let i=0,fail=0;
  for(const id of ids){i++;if($("#dl-info"))$("#dl-info").textContent=`Downloading ${i} of ${ids.length}: ${byId[id].title}`;if($("#dl-all"))$("#dl-all").textContent=Math.round(i/ids.length*100)+"%";
    try{await saveOne(id)}catch(e){fail++}if($("#dl-bar"))$("#dl-bar").style.width=(OFF.size/Object.keys(TM).length*100)+"%"}
  dlBusy=false;if($("#dl-info"))$("#dl-info").textContent=fail?`${fail} failed. Tap Download again to retry.`:"Done. The whole library plays offline.";refreshOffline();
}
async function clearDownloads(){if(dlBusy)return;try{await caches.delete(AUDIO_CACHE)}catch(e){}OFF=new Set();refreshOffline();toast("Downloads removed")}
async function toggleOffline(id,btn){if(OFF.has(id)){const c=await caches.open(AUDIO_CACHE);await c.delete(audioURL(id));OFF.delete(id)}else{if(!navigator.onLine)return;btn.textContent="Downloading…";try{await saveOne(id)}catch(e){btn.textContent="Download failed. Tap to retry.";return}}paintOff(id,btn)}
function paintOff(id,btn){btn.classList.toggle("on",OFF.has(id));btn.innerHTML=icon(OFF.has(id)?"check":"down",18)+(OFF.has(id)?" Saved offline":" Save offline")}

/* ---------- ONBOARDING ---------- */
function openOnboarding(step=0){
  const o=$("#onb");o.classList.add("on");let picks=new Set(store.get("interests",[]));let g=goal();
  const cats=CAT_ORDER.filter(c=>PK.some(p=>p.cat===c));
  const draw=()=>{
    if(step===0)o.innerHTML=`<div class="art">${cover("welcome","Tafsir",{ratio:"wide",motif:"lantern"})}</div><div class="in"><h1>Welcome to Hikmah</h1><p>Bite-sized wisdom from the Qur'an, the classical scholars, the great thinkers and the great books, read in minutes, or heard with narration and recitation.</p><p>Save the ideas that speak to you into stashes, and build a daily habit of growing wiser.</p><button class="go" id="ob-next">Get started</button></div>`;
    if(step===1)o.innerHTML=`<div class="in"><h1>What do you want to grow in?</h1><p>Pick a few topics. Your daily feed will lean towards them.</p><div class="pick">${cats.map(c=>{const T=topicOf(c);return `<button aria-pressed="${picks.has(c)}" data-c="${esc(c)}" style="background:linear-gradient(135deg,${T.c1},${T.c2})">${esc(c)}</button>`}).join("")}</div><button class="go" id="ob-next">${picks.size?"Continue":"Skip, show me everything"}</button></div>`;
    if(step===2)o.innerHTML=`<div class="in"><h1>Set your daily goal</h1><p>How many ideas do you want to read each day? Meeting it keeps your streak alive.</p><div class="goals">${[[3,"Light","About 3 minutes"],[5,"Steady","About 5 minutes"],[10,"Serious","About 10 minutes"],[15,"Intense","About 15 minutes"]].map(([v,n,s])=>`<button aria-pressed="${g===v}" data-v="${v}"><span>${v} ideas a day · ${n}</span><small>${s}</small></button>`).join("")}</div><button class="go" id="ob-next">Start reading</button></div>`;
    o.querySelectorAll(".pick button").forEach(b=>b.onclick=()=>{const c=b.dataset.c;picks.has(c)?picks.delete(c):picks.add(c);b.setAttribute("aria-pressed",String(picks.has(c)));$("#ob-next").textContent=picks.size?"Continue":"Skip, show me everything"});
    o.querySelectorAll(".goals button").forEach(b=>b.onclick=()=>{g=+b.dataset.v;o.querySelectorAll(".goals button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)))});
    $("#ob-next").onclick=()=>{if(step===1)store.set("interests",[...picks]);if(step===2)store.set("goal",g);
      if(step<2){step++;draw();o.scrollTop=0}else{store.set("onb",true);o.classList.remove("on");route(true)}};
  };draw();
}

/* ---------- INSTALL & NETWORK ---------- */
const standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
let deferredPrompt=null;
function paintInstall(){const b=$("#install");if(!b||standalone||store.get("noInstall",false))return;
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  if(deferredPrompt){b.innerHTML=`<span style="flex:1"><b>Install Hikmah</b><br><span class="muted">Add it to your home screen.</span></span><button class="pill" id="do-inst">Install</button><button class="x" aria-label="Dismiss">×</button>`;b.classList.add("on");$("#do-inst").onclick=async()=>{deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch(e){}deferredPrompt=null;b.classList.remove("on")}}
  else if(isIOS){b.innerHTML=`<span style="flex:1"><b>Install Hikmah:</b> tap Share, then <b>Add to Home Screen</b>.</span><button class="x" aria-label="Dismiss">×</button>`;b.classList.add("on")}
  const x=b.querySelector(".x");x&&(x.onclick=()=>{b.classList.remove("on");store.set("noInstall",true)})}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;paintInstall()});
function net(){$("#netpill").classList.toggle("on",!navigator.onLine)}addEventListener("online",net);addEventListener("offline",net);net();

/* ---------- ROUTER ---------- */
function route(keepScroll){
  if($("#reader").classList.contains("on")&&!(history.state&&history.state.rd)){$("#reader").classList.remove("on");document.body.classList.remove("reader-open")}
  if($("#np").classList.contains("on")&&!(history.state&&history.state.np))$("#np").classList.remove("on");
  const h=location.hash.slice(1)||"home";
  let view=h, arg=null;
  if(h.startsWith("p-")){view="pkg";arg=h.slice(2)} else if(h.startsWith("stash-")){view="stash";arg=h.slice(6)} else if(!["home","explore","stashes","you"].includes(h))view="home";
  $$(".view").forEach(v=>v.classList.toggle("on",v.id==="v-"+view));
  const tab={pkg:"home",stash:"stashes"}[view]||view;
  ["home","explore","stashes","you"].forEach(t=>{const a=$("#t-"+t);t===tab?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")});
  if(view==="home")renderHome(); if(view==="explore")renderExplore(); if(view==="pkg")renderPkg(arg); if(view==="stashes")renderStashes(); if(view==="stash")renderStash(arg); if(view==="you")renderYou();
  if(!keepScroll)$("#main").scrollTop=0;
}
addEventListener("hashchange",()=>route());
addEventListener("popstate",()=>{if($("#reader").classList.contains("on")&&!(history.state&&history.state.rd)){$("#reader").classList.remove("on");document.body.classList.remove("reader-open");route(true)}if($("#np").classList.contains("on")&&!(history.state&&history.state.np))$("#np").classList.remove("on")});

/* ---------- BOOT ---------- */
applyFs();
Promise.all([fetch("data/packages.json").then(r=>r.json()),fetch("data/timings.json").then(r=>r.json()).catch(()=>({}))]).then(async([p,t])=>{
  PK=p.sort((a,b)=>CAT_ORDER.indexOf(a.cat)-CAT_ORDER.indexOf(b.cat));TM=t;
  PK.forEach(x=>{byId[x.id]=x;CARDS[x.id]=buildCards(x);x._hay=[x.title,x.sub,x.author,x.tag,x.cat,x.ref,x.opening,x.verse,x.scholars,x.modern,x.idea,x.mechanics,x.practice,x.faith,x.nigerian,(x.ideas||[]).flat().join(" "),x.practices.join(" ")].filter(Boolean).join(" ").toLowerCase()});
  ALLIDEAS=PK.flatMap(x=>CARDS[x.id].filter(c=>c.type==="idea"||c.type==="hadith"));
  await refreshOffline();
  if(!store.get("onb",false))openOnboarding(0);
  route();
  const last=store.get("last",null);
  if(last&&byId[last]&&TM[last]){cur=last;showPlayer();paintPlayerStatic();syncPlayer();$("#pl-t small").textContent=`Paused at ${fmt(store.get("prog",{})[last]||0)} · tap ▶`}
  checkBadges();
}).catch(e=>{$("#home").innerHTML='<p class="empty">The library could not load. Check your connection, then reopen the app.</p>';console.error(e)});
if("serviceWorker" in navigator){const reg=()=>navigator.serviceWorker.register("sw.js").catch(()=>{});document.readyState==="complete"?reg():addEventListener("load",reg)}
