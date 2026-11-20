/* Hikmah sync: keeps progress, likes, stashes and settings the same on every device.
   Data is saved as one private JSON file in the hidden app folder of the user's own Google Drive
   (scope drive.appdata: the app can see only its own file, nothing else in Drive). */
const G_CLIENT="294351528769-1b0reabi5qprb1gct5t9b9o8q2q2rl8s.apps.googleusercontent.com";
const G_SCOPE="https://www.googleapis.com/auth/drive.appdata", G_FILE="hikmah-sync.json";
const SYNC_ON=()=>true;
const LOCAL_ONLY=new Set(["fs","autonext","rate","onb"]);
const DEV_KEYS=new Set(["ldays","listened"]);
const UNION_KEYS=new Set(["read","completed","done","badges","days"]);
const MAP_KEYS=new Set(["pos","prog"]);
const RESET_KEYS=new Set(["read","days","badges","prog","done","pos","completed","lastRead","last"]);
const raw={get(k,d){try{const v=localStorage.getItem("hikmah:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("hikmah:"+k,JSON.stringify(v))}catch(e){}}};
const syncable=k=>k&&k[0]!=="_"&&!LOCAL_ONLY.has(k);
function devId(){let d=raw.get("_dev",null);if(!d){d=Math.random().toString(36).slice(2,10);raw.set("_dev",d)}return d}
function devName(){const u=navigator.userAgent;return /iPhone|iPad/.test(u)?"iPhone":/Android/.test(u)?"Android phone":/Windows/.test(u)?"Windows laptop":/Mac/.test(u)?"Mac":"Device"}

/* called by store.set */
function noteChange(k){
  if(!syncable(k))return;
  if(!DEV_KEYS.has(k)){const mt=raw.get("_mt",{});mt[k]=Date.now();raw.set("_mt",mt)}
  if(raw.get("_sync",null))schedulePush(DEV_KEYS.has(k)||k==="prog"?30000:2500);
}
let pushT=null,pushDue=0;
function schedulePush(ms){const due=Date.now()+ms;if(pushT&&pushDue<=due)return;clearTimeout(pushT);pushDue=due;pushT=setTimeout(()=>{pushT=null;syncNow()},ms)}

/* ---------- validation: only well-formed Hikmah data is ever written to this device ---------- */
const KEY_RE=/^[A-Za-z0-9_.:-]{1,80}$/, DATE_RE=/^\d{4}-\d{2}-\d{2}$/;
const isObj=v=>v&&typeof v==="object"&&!Array.isArray(v);
const str=(v,n)=>typeof v==="string"&&v.length<=n;
function cleanMap(v,keyOk,valOk,max=20000){if(!isObj(v))return undefined;const o={};let n=0;for(const k of Object.keys(v)){if(n>=max)break;if(keyOk(k)&&valOk(v[k])){o[k]=v[k];n++}}return o}
const num=v=>typeof v==="number"&&isFinite(v)&&v>=0&&v<1e9;
const shortStr=v=>str(v,40);
function cleanStashes(v){if(!Array.isArray(v))return undefined;const out=[];for(const s of v.slice(0,100)){if(!isObj(s)||!str(s.id,40)||!/^[A-Za-z0-9_-]+$/.test(s.id)||!str(s.name,60))continue;
  out.push({id:s.id,name:s.name.trim()||"Stash",cat:str(s.cat,40)?s.cat:"Character",items:Array.isArray(s.items)?s.items.filter(x=>str(x,80)&&KEY_RE.test(x)).slice(0,5000):[]})}return out}
const VALID={
  read:v=>cleanMap(v,k=>KEY_RE.test(k),shortStr), completed:v=>cleanMap(v,k=>KEY_RE.test(k),shortStr), badges:v=>cleanMap(v,k=>KEY_RE.test(k),shortStr),
  likes:v=>cleanMap(v,k=>KEY_RE.test(k),shortStr), done:v=>cleanMap(v,k=>KEY_RE.test(k),x=>x===1||x===true||num(x)),
  days:v=>cleanMap(v,k=>DATE_RE.test(k),num), pos:v=>cleanMap(v,k=>KEY_RE.test(k),num), prog:v=>cleanMap(v,k=>KEY_RE.test(k),num),
  goal:v=>num(v)&&v>=1&&v<=100?v:undefined, interests:v=>Array.isArray(v)?v.filter(x=>str(x,40)).slice(0,40):undefined,
  last:v=>v===null||(str(v,80)&&KEY_RE.test(v))?v:undefined, lastRead:v=>v===null||(str(v,80)&&KEY_RE.test(v))?v:undefined,
  stashes:cleanStashes
};
function cleanNote(v){if(!isObj(v))return undefined;const ent=x=>isObj(x)&&str(x.t,4000)&&num(x.at)?{t:x.t,at:x.at}:null;
  const p={};if(isObj(v.p))for(const i of Object.keys(v.p).slice(0,20))if(/^\d{1,2}$/.test(i)){const e=ent(v.p[i]);if(e)p[i]=e}
  return {p,r:ent(v.r),at:num(v.at)?v.at:0}}
function cleanKey(k,v){if(VALID[k])return VALID[k](v);if(/^note:[A-Za-z0-9_-]{1,60}$/.test(k))return cleanNote(v);if(/^chk:[A-Za-z0-9_-]{1,60}$/.test(k))return cleanMap(v,x=>/^\d{1,3}$/.test(x),x=>typeof x==="boolean");return undefined}
function cleanDoc(d){
  if(!isObj(d))return null;
  const out={v:1,epoch:num(d.epoch)?d.epoch:0,k:{},mt:{},dev:{}};
  if(isObj(d.k))for(const k of Object.keys(d.k).slice(0,2000)){const v=cleanKey(k,d.k[k]);if(v!==undefined){out.k[k]=v;out.mt[k]=isObj(d.mt)&&num(d.mt[k])?d.mt[k]:0}}
  if(isObj(d.dev))for(const id of Object.keys(d.dev).slice(0,20)){const x=d.dev[id];if(!/^[a-z0-9]{1,16}$/.test(id)||!isObj(x))continue;
    out.dev[id]={ldays:cleanMap(x.ldays,k=>DATE_RE.test(k),num)||{},listened:num(x.listened)?x.listened:0,name:str(x.name,40)?x.name:"Device",ep:num(x.ep)?x.ep:0,at:num(x.at)?x.at:0}}
  return out;
}
function collect(){
  const k={};
  for(let i=0;i<localStorage.length;i++){const K=localStorage.key(i);if(!K||!K.startsWith("hikmah:"))continue;const n=K.slice(7);if(!syncable(n)||DEV_KEYS.has(n))continue;try{const v=cleanKey(n,JSON.parse(localStorage.getItem(K)));if(v!==undefined)k[n]=v}catch(e){}}
  return {k,mt:raw.get("_mt",{}),epoch:raw.get("_epoch",0)};
}
function unionMap(key,A,B){
  const o={...B};
  for(const x in A){if(!(x in o)){o[x]=A[x];continue}
    o[x]=key==="days"?Math.max(+A[x]||0,+o[x]||0):(String(A[x])<String(o[x])?A[x]:o[x])}
  return o;
}
function mergeStashes(a,b){
  const out=(b||[]).map(s=>({...s,items:[...(s.items||[])]})),by={};out.forEach(s=>by[s.id]=s);
  for(const s of a||[]){if(by[s.id]){for(const it of s.items||[])if(!by[s.id].items.includes(it))by[s.id].items.push(it)}else out.push({...s,items:[...(s.items||[])]})}
  return out;
}
function mergeDocs(L,R,first){
  const eL=L.epoch||0,eR=R.epoch||0,out={v:1,epoch:Math.max(eL,eR),k:{},mt:{}};
  const keys=new Set([...Object.keys(L.k),...Object.keys(R.k||{})]);
  for(const k of keys){
    const a=L.k[k],b=(R.k||{})[k],ta=L.mt[k]||0,tb=(R.mt||{})[k]||0;let v;
    if(eL!==eR&&RESET_KEYS.has(k))v=eL>eR?a:b;
    else if(UNION_KEYS.has(k))v=unionMap(k,a||{},b||{});
    else if(a===undefined)v=b;else if(b===undefined)v=a;
    else if(MAP_KEYS.has(k))v=ta>=tb?{...b,...a}:{...a,...b};
    else if(first&&(k==="likes"||k.startsWith("chk:")))v={...b,...a};
    else if(first&&k==="stashes")v=mergeStashes(a,b);
    else v=ta>tb?a:b;
    if(v!==undefined){out.k[k]=v;out.mt[k]=Math.max(ta,tb)}
  }
  return out;
}
let gisP=null;
function loadGis(){if(window.google&&google.accounts&&google.accounts.oauth2)return Promise.resolve();if(gisP)return gisP;
  gisP=new Promise((res,rej)=>{const e=document.createElement("script");e.src="https://accounts.google.com/gsi/client";e.async=true;e.onload=()=>res();e.onerror=()=>{gisP=null;rej(new Error("Google sign-in could not load"))};document.head.appendChild(e)});return gisP}
const gisReady=()=>!!(window.google&&google.accounts&&google.accounts.oauth2);
function tok(){const t=raw.get("_gtok",null);return t&&t.exp>Date.now()+60000?t.token:null}
/* must be called straight from a tap: Google opens a small window */
function askToken(consent){return new Promise((res,rej)=>{
  if(!gisReady()){loadGis().catch(()=>{});rej(new Error("Google sign-in is still loading. Try again."));return}
  const c=google.accounts.oauth2.initTokenClient({client_id:G_CLIENT,scope:G_SCOPE,
    callback:r=>{if(r&&r.access_token){raw.set("_gtok",{token:r.access_token,exp:Date.now()+(+r.expires_in||3600)*1000});res(r.access_token)}else rej(new Error((r&&r.error)||"Google access was not granted"))},
    error_callback:e=>rej(new Error(e&&e.type==="popup_closed"?"The Google window was closed":"Google sign-in was blocked"))});
  c.requestAccessToken({prompt:consent?"consent":""});
})}
const authErr=()=>Object.assign(new Error("Google sign-in needed"),{auth:true});
async function gfetch(url,opt={}){
  const t=tok();if(!t)throw authErr();
  const r=await fetch(url,{...opt,headers:{...(opt.headers||{}),Authorization:"Bearer "+t},cache:"no-store"});
  if(r.status===401){raw.set("_gtok",null);throw authErr()}
  if(r.status===404){FID=null}
  if(!r.ok)throw new Error("Google Drive "+r.status);
  return r;
}
let FID=null;
async function fileId(){if(FID)return FID;const q=encodeURIComponent(`name='${G_FILE}'`);
  const j=await(await gfetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,modifiedTime)&orderBy=modifiedTime desc`)).json();
  FID=(j.files&&j.files[0]&&j.files[0].id)||null;return FID}
async function pull(){const id=await fileId();if(!id)return null;const r=await gfetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`);const t=await r.text();if(!t||t.length>5e6)return null;try{return cleanDoc(JSON.parse(t))}catch(e){return null}}
async function push(doc){
  const body=JSON.stringify(doc),id=await fileId();
  if(id){await gfetch(`https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media`,{method:"PATCH",headers:{"Content-Type":"application/json"},body});return}
  const b="hikmah"+Math.random().toString(36).slice(2),meta=JSON.stringify({name:G_FILE,parents:["appDataFolder"]});
  const r=await gfetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",{method:"POST",headers:{"Content-Type":"multipart/related; boundary="+b},
    body:`--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${b}--`});
  FID=(await r.json()).id;
}
let syncing=false,syncAgain=false;
async function syncNow(opts={}){
  if(!(opts.connecting||raw.get("_sync",null)===true)||!navigator.onLine)return false;
  if(!tok()){paintSyncRow("auth");return false}
  if(syncing){syncAgain=true;return false}
  syncing=true;
  try{
    try{typeof flushListen==="function"&&flushListen()}catch(e){}
    const R=await pull()||{k:{},mt:{},dev:{},epoch:0};
    const first=!!opts.first||!raw.get("_synced",false);
    const L=collect(),M=mergeDocs(L,R,first);
    const me=devId();
    /* apply to this device */
    let changed=false;
    for(const k in M.k){const nv=JSON.stringify(M.k[k]);if(localStorage.getItem("hikmah:"+k)!==nv){try{localStorage.setItem("hikmah:"+k,nv)}catch(e){}changed=true}}
    raw.set("_mt",M.mt);
    if(M.epoch>(L.epoch||0)){raw.set("ldays",{});raw.set("listened",0);changed=true}
    raw.set("_epoch",M.epoch);
    /* listening time is counted per device, then added up */
    const dev={};for(const [id,d] of Object.entries(R.dev||{}))if(id!==me&&(d.ep||0)>=M.epoch)dev[id]=d;
    const others={};for(const [id,d] of Object.entries(dev))others[id]={ldays:d.ldays||{},listened:d.listened||0};
    if(JSON.stringify(others)!==JSON.stringify(raw.get("_others",{}))){raw.set("_others",others);changed=true}
    dev[me]={ldays:raw.get("ldays",{}),listened:raw.get("listened",0),name:devName(),ep:M.epoch,at:Date.now()};
    const out={v:1,epoch:M.epoch,k:M.k,mt:M.mt,dev};
    const strip=d=>JSON.stringify({...d,dev:Object.fromEntries(Object.entries(d.dev||{}).map(([i,x])=>[i,{...x,at:0}]))});
    if(strip(out)!==strip(R)||opts.force)await push(out);
    raw.set("_synced",true);raw.set("_last",Date.now());
    if(changed)afterSyncChange();
    paintSyncRow();
    return true;
  }catch(e){console.warn(e);paintSyncRow(e.auth?"auth":String(e.message||e));if(e.auth&&!opts.connecting)return false;throw e}
  finally{syncing=false;if(syncAgain){syncAgain=false;setTimeout(()=>syncNow(),500)}}
}
function afterSyncChange(){
  try{READ=store.get("read",{});DAYS=store.get("days",{});LIKES=store.get("likes",{});STASHES=store.get("stashes",null)||STASHES}catch(e){}
  if(!document.body.classList.contains("reader-open")&&!$("#sheet").classList.contains("on")){try{route(true)}catch(e){}}
}
/* totals that include every synced device */
function listenedAll(){let s=raw.get("listened",0);for(const d of Object.values(raw.get("_others",{})))s+=d.listened||0;return s}
function ldaysAll(){const o={...raw.get("ldays",{})};for(const d of Object.values(raw.get("_others",{})))for(const [k,v] of Object.entries(d.ldays||{}))o[k]=(o[k]||0)+v;return o}

/* ---------- UI ---------- */
function ago(t){if(!t)return"not yet";const s=Math.round((Date.now()-t)/1000);return s<45?"just now":s<3600?Math.round(s/60)+" min ago":s<86400?Math.round(s/3600)+" h ago":new Date(t).toLocaleDateString()}
function paintSyncRow(err){const e=document.getElementById("sync-sub");if(!e)return;const on=raw.get("_sync",null)===true;
  e.textContent=!on?"Off. Connect your Google account":(err==="auth"||!tok())?"Paused · tap to reconnect Google":err&&!navigator.onLine?"On · offline, will sync when connected":err?"On · last try failed, will retry":"On · Google Drive · synced "+ago(raw.get("_last",0))}
async function connectGoogle(btn,consent){
  const lbl=btn&&btn.textContent;
  try{const p=askToken(consent);if(btn)btn.textContent="Waiting for Google…";await p;
    if(btn)btn.textContent="Syncing…";await syncNow({connecting:true,first:!raw.get("_synced",false),force:true});
    raw.set("_sync",true);paintSyncRow();return true}
  catch(e){if(btn)btn.textContent=lbl;toast(navigator.onLine?(e.message||"Could not connect to Google"):"You are offline");return false}
}
function openSync(){
  loadGis().catch(()=>{});
  const on=raw.get("_sync",null)===true;
  if(on){
    const others=Object.values(raw.get("_others",{})).length,need=!tok();
    openSheet(`<h3>Sync is on</h3><p class="muted">Your progress, streak, likes, stashes, calendar and settings are saved in your Google Drive and stay the same on every device where you connect the same Google account.${others?` Linked with ${others} other device${others>1?"s":""}.`:""}</p>
      <div class="gnote">${need?"Google asks Hikmah to reconnect about once an hour. Tap <b>Reconnect</b> and the small Google window closes by itself.":"Last synced "+ago(raw.get("_last",0))+"."}</div>
      <div class="cta"><button class="btn soft" id="sy-x">Close</button><button class="btn primary" id="sy-now">${need?"Reconnect":"Sync now"}</button></div>
      <button class="linkbtn" id="sy-off">Disconnect Google on this device</button>`);
    $("#sy-x").onclick=closeSheet;
    $("#sy-now").onclick=async()=>{const b=$("#sy-now");if(!tok()){if(await connectGoogle(b,false)){toast("Synced");closeSheet()}return}
      b.textContent="Syncing…";try{await syncNow({force:true});toast("Synced");closeSheet()}catch(e){b.textContent="Try again";toast(navigator.onLine?"Sync failed. Try again shortly.":"You are offline")}};
    $("#sy-off").onclick=()=>{raw.set("_sync",null);raw.set("_gtok",null);raw.set("_synced",false);FID=null;closeSheet();paintSyncRow();toast("Disconnected on this device. Your Drive copy is kept.")};
    return;
  }
  openSheet(`<h3>Sync with Google</h3><p class="muted">Connect your Google account to keep your streak, progress, likes, stashes and calendar the same on your phone and laptop.</p>
    <div class="gnote">Hikmah saves one private file in a hidden app folder of your Google Drive. It cannot see or change anything else in your Drive. Google may say the app is unverified: that is expected for a personal app. Choose your account, then <b>Continue</b>.</div>
    <div class="cta"><button class="btn soft" id="sy-x">Not now</button><button class="btn primary" id="sy-go">Connect Google</button></div>`);
  $("#sy-x").onclick=closeSheet;
  $("#sy-go").onclick=async()=>{if(await connectGoogle($("#sy-go"),true)){toast(Object.keys(raw.get("_others",{})).length?"Connected. Your devices are in sync.":"Connected to Google Drive");openSync()}};
}
/* old pairing-code setting from 2.4.0: switch it off; Google takes over */
if(typeof raw.get("_sync",null)==="string"){raw.set("_sync",null);raw.set("_synced",false)}
/* automatic triggers */
const syncing0=()=>raw.get("_sync",null)===true;
addEventListener("visibilitychange",()=>{if(syncing0())syncNow().catch(()=>{})});
addEventListener("online",()=>{if(syncing0())syncNow().catch(()=>{})});
addEventListener("focus",()=>{if(syncing0()&&Date.now()-raw.get("_last",0)>5000)syncNow().catch(()=>{})});
setInterval(()=>{if(document.visibilityState==="visible"&&syncing0())syncNow().catch(()=>{})},20000);
/* when Google access has expired, renew it quietly on the next tap anywhere */
let renewing=false;
addEventListener("pointerdown",e=>{if(!syncing0()||tok()||renewing||!navigator.onLine||!gisReady()||(e.target.closest&&e.target.closest("#sheet")))return;renewing=true;
  askToken(false).then(()=>syncNow()).catch(()=>{}).finally(()=>{renewing=false})},true);
if(syncing0())loadGis().catch(()=>{});
