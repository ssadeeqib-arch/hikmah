/* Hikmah sync: keeps progress, likes, stashes and settings the same on every device.
   Pairing uses a private 24-character sync code. The server only stores a SHA-256 hash of the code
   and exposes two functions (pull/push); the table itself is closed to the public. */
const SB_URL="https://ptfwcxdhlzoskzqppwzr.supabase.co", SB_KEY="sb_publishable_7i2aI8mfxApUb2DBoKj_qg_EvX_wE0m";
const SYNC_ON=()=>!SB_URL.startsWith("__");
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

function collect(){
  const k={};
  for(let i=0;i<localStorage.length;i++){const K=localStorage.key(i);if(!K||!K.startsWith("hikmah:"))continue;const n=K.slice(7);if(!syncable(n)||DEV_KEYS.has(n))continue;try{k[n]=JSON.parse(localStorage.getItem(K))}catch(e){}}
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
async function rpc(fn,body){
  const h={"Content-Type":"application/json",apikey:SB_KEY};if(!SB_KEY.startsWith("sb_"))h.Authorization="Bearer "+SB_KEY;
  const r=await fetch(SB_URL+"/rest/v1/rpc/"+fn,{method:"POST",headers:h,body:JSON.stringify(body),cache:"no-store"});
  if(!r.ok)throw new Error("Sync error "+r.status);
  const t=await r.text();return t?JSON.parse(t):null;
}
let syncing=false,syncAgain=false;
async function syncNow(opts={}){
  const code=opts.code||raw.get("_sync",null);
  if(!SYNC_ON()||!code||!navigator.onLine)return false;
  if(syncing){syncAgain=true;return false}
  syncing=true;
  try{
    try{typeof flushListen==="function"&&flushListen()}catch(e){}
    const R=await rpc("hikmah_pull",{k:code})||{k:{},mt:{},dev:{},epoch:0};
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
    if(strip(out)!==strip(R)||opts.force)await rpc("hikmah_push",{k:code,d:out});
    raw.set("_synced",true);raw.set("_last",Date.now());
    if(changed)afterSyncChange();
    paintSyncRow();
    return true;
  }catch(e){console.warn(e);paintSyncRow(String(e.message||e));throw e}
  finally{syncing=false;if(syncAgain){syncAgain=false;setTimeout(()=>syncNow(),500)}}
}
function afterSyncChange(){
  try{READ=store.get("read",{});DAYS=store.get("days",{});LIKES=store.get("likes",{});STASHES=store.get("stashes",null)||STASHES}catch(e){}
  if(!document.body.classList.contains("reader-open")&&!$("#sheet").classList.contains("on")){try{route(true)}catch(e){}}
}
/* totals that include every synced device */
function listenedAll(){let s=raw.get("listened",0);for(const d of Object.values(raw.get("_others",{})))s+=d.listened||0;return s}
function ldaysAll(){const o={...raw.get("ldays",{})};for(const d of Object.values(raw.get("_others",{})))for(const [k,v] of Object.entries(d.ldays||{}))o[k]=(o[k]||0)+v;return o}

/* ---------- code + UI ---------- */
const ALPH="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newCode(){const b=crypto.getRandomValues(new Uint8Array(24));return [...b].map(x=>ALPH[x&31]).join("")}
const normCode=s=>String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
const fmtCode=c=>c.match(/.{1,4}/g).join("-");
function ago(t){if(!t)return"not yet";const s=Math.round((Date.now()-t)/1000);return s<45?"just now":s<3600?Math.round(s/60)+" min ago":s<86400?Math.round(s/3600)+" h ago":new Date(t).toLocaleDateString()}
function paintSyncRow(err){const e=document.getElementById("sync-sub");if(!e)return;const c=raw.get("_sync",null);
  e.textContent=!SYNC_ON()?"Not set up yet":!c?"Off. Keep your laptop and phone in step":err&&!navigator.onLine?"On · offline, will sync when connected":err?"On · last try failed, will retry":"On · synced "+ago(raw.get("_last",0))}
function openSync(){
  const c=raw.get("_sync",null);
  if(!SYNC_ON()){openSheet(`<h3>Sync across devices</h3><p class="muted">Sync is not switched on for this copy of Hikmah yet.</p><div class="cta"><button class="btn primary" id="sy-x">OK</button></div>`);$("#sy-x").onclick=closeSheet;return}
  if(c){
    const others=Object.values(raw.get("_others",{})).length;
    openSheet(`<h3>Sync is on</h3><p class="muted">Your progress, streak, likes, stashes, calendar and settings stay the same on every device that uses this code. ${others?`Linked with ${others} other device${others>1?"s":""}.`:"Add your other device with the code below."}</p>
      <div class="synccode">${fmtCode(c)}</div>
      <p class="muted" style="font-size:13px">On your other device, open Hikmah → You → Sync across devices → <b>Join with a code</b>, and enter this code. Keep it private: anyone with it can see and change your Hikmah progress.</p>
      <div class="cta"><button class="btn soft" id="sy-copy">Copy code</button><button class="btn primary" id="sy-now">Sync now</button></div>
      <button class="linkbtn" id="sy-off">Turn off sync on this device</button>`);
    $("#sy-copy").onclick=async()=>{try{await navigator.clipboard.writeText(fmtCode(c));toast("Code copied")}catch(e){toast("Select the code and copy it")}};
    $("#sy-now").onclick=async()=>{$("#sy-now").textContent="Syncing…";try{await syncNow({force:true});toast("Synced");closeSheet()}catch(e){$("#sy-now").textContent="Try again";toast(navigator.onLine?"Sync failed. Try again shortly.":"You are offline")}};
    $("#sy-off").onclick=()=>{raw.set("_sync",null);raw.set("_synced",false);closeSheet();paintSyncRow();toast("Sync turned off on this device")};
    return;
  }
  openSheet(`<h3>Sync across devices</h3><p class="muted">Keep your streak, progress, likes, stashes and calendar the same on your phone and laptop. Changes move across automatically whenever you are online.</p>
    <div class="group" style="margin:14px 0 10px"><button class="row" id="sy-start"><div class="l"><b>Start sync on this device</b><small>Do this on the device that has your history</small></div><span class="pill">Start</span></button></div>
    <p class="muted" style="font-size:13px;margin:12px 2px 6px">Already started on another device?</p>
    <input id="sy-in" class="syncin" placeholder="Enter the 24-character code" autocomplete="off" autocapitalize="characters" spellcheck="false">
    <div class="cta"><button class="btn soft" id="sy-x">Cancel</button><button class="btn primary" id="sy-join">Join with a code</button></div>`);
  $("#sy-x").onclick=closeSheet;
  $("#sy-start").onclick=async()=>{const code=newCode();try{$("#sy-start b").textContent="Starting…";await syncNow({code,first:true,force:true});raw.set("_sync",code);toast("Sync is on");openSync()}catch(e){$("#sy-start b").textContent="Start sync on this device";toast(navigator.onLine?"Could not start sync. Try again.":"You are offline")}};
  $("#sy-join").onclick=async()=>{const code=normCode($("#sy-in").value);if(code.length!==24){toast("The code has 24 letters and numbers");return}
    $("#sy-join").textContent="Joining…";
    try{const R=await rpc("hikmah_pull",{k:code});if(!R){$("#sy-join").textContent="Join with a code";toast("No Hikmah sync found for that code");return}
      raw.set("_synced",false);await syncNow({code,first:true,force:true});raw.set("_sync",code);toast("Joined. Your devices are in sync.");openSync()}
    catch(e){$("#sy-join").textContent="Join with a code";toast(navigator.onLine?"Could not join. Check the code.":"You are offline")}};
}
/* automatic triggers */
if(SYNC_ON()){
  addEventListener("visibilitychange",()=>{if(raw.get("_sync",null))syncNow().catch(()=>{})});
  addEventListener("online",()=>{if(raw.get("_sync",null))syncNow().catch(()=>{})});
  addEventListener("focus",()=>{if(raw.get("_sync",null)&&Date.now()-raw.get("_last",0)>5000)syncNow().catch(()=>{})});
  setInterval(()=>{if(document.visibilityState==="visible"&&raw.get("_sync",null))syncNow().catch(()=>{})},20000);
}
