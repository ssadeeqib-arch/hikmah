/* Hikmah illustration engine: original, generated covers (no stock images). */
const TOPICS = {
  "Tafsir":                  {c1:"#0F9D74", c2:"#34D399", ink:"#063D2E", motifs:["lantern","crescent","book","arch"], islamic:true},
  "Character":               {c1:"#7C3AED", c2:"#A78BFA", ink:"#2E1065", motifs:["heart","seedling","mountain","sun"]},
  "Work & Leadership":       {c1:"#2563EB", c2:"#60A5FA", ink:"#172554", motifs:["compass","key","scales","road"]},
  "Family":                  {c1:"#E11D48", c2:"#FB7185", ink:"#4C0519", motifs:["tree","people","heart","sun"]},
  "Heart":                   {c1:"#C026D3", c2:"#F0ABFC", ink:"#4A044E", motifs:["heart","crescent","eye","lantern"]},
  "Leading People":          {c1:"#EA580C", c2:"#FDBA74", ink:"#431407", motifs:["people","compass","mountain","flag"]},
  "Thinking & Decisions":    {c1:"#0891B2", c2:"#67E8F9", ink:"#083344", motifs:["bulb","scales","eye","hourglass"]},
  "Strategy & Execution":    {c1:"#D97706", c2:"#FCD34D", ink:"#451A03", motifs:["target","road","compass","flag"]},
  "Influence & Negotiation": {c1:"#0D9488", c2:"#5EEAD4", ink:"#042F2E", motifs:["chat","people","key","bridge"]},
  "The Good Life":           {c1:"#65A30D", c2:"#BEF264", ink:"#1A2E05", motifs:["sun","tree","seedling","heart"]},
  "Habits & Productivity":   {c1:"#0284C7", c2:"#7DD3FC", ink:"#082F49", motifs:["loop","hourglass","target","seedling"]},
  "Mind & Meaning":          {c1:"#4F46E5", c2:"#A5B4FC", ink:"#1E1B4B", motifs:["bulb","mountain","eye","sun"]},
  "Money & Wealth":          {c1:"#CA8A04", c2:"#FDE047", ink:"#422006", motifs:["coins","key","scales","seedling"]},
  "Communication & People":  {c1:"#DB2777", c2:"#F9A8D4", ink:"#500724", motifs:["chat","people","bridge","heart"]},
  "Islamic Classics":        {c1:"#166534", c2:"#4ADE80", ink:"#052E16", motifs:["quill","book","lantern","arch"], islamic:true},
  "African Wisdom":          {c1:"#C2410C", c2:"#FB923C", ink:"#431407", motifs:["baobab","drum","sun","people"]},
  "Asia & the Arab World":   {c1:"#A31621", c2:"#F2C14E", ink:"#3B0A0F", motifs:["mountain","bridge","quill","compass"]}
};
const W = "#FFFFFF";
const MOTIFS = {
  book:`<path d="M10 28c14-6 28-6 40 4v52c-12-10-26-10-40-4z" fill="${W}"/><path d="M90 28c-14-6-28-6-40 4v52c12-10 26-10 40-4z" fill="${W}" opacity=".85"/><path d="M50 32v52" stroke="rgba(0,0,0,.15)" stroke-width="2"/>`,
  lantern:`<path d="M44 8h12v8H44z" fill="${W}"/><path d="M50 2v6" stroke="${W}" stroke-width="3"/><path d="M34 22h32l6 14H28z" fill="${W}"/><rect x="32" y="36" width="36" height="38" rx="6" fill="${W}" opacity=".9"/><path d="M40 42h20v26H40z" fill="rgba(255,200,80,.85)"/><path d="M50 46c4 6 4 12 0 18-4-6-4-12 0-18z" fill="#fff6"/><path d="M28 74h44l-6 12H34z" fill="${W}"/>`,
  crescent:`<path d="M58 14a36 36 0 1 0 22 62A30 30 0 1 1 58 14z" fill="${W}"/><path d="M74 24l3 8 8 1-6 6 2 8-7-4-7 4 2-8-6-6 8-1z" fill="${W}"/>`,
  arch:`<path d="M18 90V48C18 28 34 14 50 8c16 6 32 20 32 40v42z" fill="${W}"/><path d="M32 90V54c0-12 8-22 18-26 10 4 18 14 18 26v36z" fill="rgba(0,0,0,.18)"/><circle cx="50" cy="20" r="3" fill="${W}"/>`,
  heart:`<path d="M50 86S12 62 12 36c0-12 10-22 22-22 7 0 13 4 16 9 3-5 9-9 16-9 12 0 22 10 22 22 0 26-38 50-38 50z" fill="${W}"/>`,
  seedling:`<path d="M50 90V46" stroke="${W}" stroke-width="5" stroke-linecap="round"/><path d="M50 52C50 30 34 20 16 22c0 18 14 30 34 30z" fill="${W}"/><path d="M50 44c0-18 14-28 32-26 0 16-12 26-32 26z" fill="${W}" opacity=".85"/><path d="M28 90h44" stroke="${W}" stroke-width="5" stroke-linecap="round"/>`,
  mountain:`<path d="M4 88l30-46 14 20 14-30 34 56z" fill="${W}"/><path d="M62 32l-7 15 7-4 7 5z" fill="rgba(0,0,0,.15)"/><circle cx="26" cy="24" r="9" fill="${W}" opacity=".9"/>`,
  sun:`<circle cx="50" cy="50" r="20" fill="${W}"/>${[...Array(12)].map((_,i)=>{const a=i*Math.PI/6,x1=50+Math.cos(a)*28,y1=50+Math.sin(a)*28,x2=50+Math.cos(a)*40,y2=50+Math.sin(a)*40;return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${W}" stroke-width="5" stroke-linecap="round"/>`}).join("")}`,
  compass:`<circle cx="50" cy="50" r="38" fill="none" stroke="${W}" stroke-width="6"/><path d="M50 18l10 32-10 32-10-32z" fill="${W}"/><path d="M50 18l10 32H40z" fill="rgba(0,0,0,.18)"/><circle cx="50" cy="50" r="4" fill="${W}"/>`,
  key:`<circle cx="30" cy="40" r="18" fill="none" stroke="${W}" stroke-width="7"/><path d="M44 50l38 30M66 68l8-8M74 74l6-6" stroke="${W}" stroke-width="7" stroke-linecap="round"/>`,
  scales:`<path d="M50 12v72M30 88h40M18 28h64" stroke="${W}" stroke-width="5" stroke-linecap="round"/><path d="M18 28L8 54h20zM82 28L72 54h20z" fill="none" stroke="${W}" stroke-width="3"/><path d="M6 54a12 8 0 0 0 24 0zM70 54a12 8 0 0 0 24 0z" fill="${W}"/><circle cx="50" cy="12" r="5" fill="${W}"/>`,
  road:`<path d="M38 92L46 8h8l8 84z" fill="${W}"/><path d="M50 16v8M50 36v10M50 60v12" stroke="rgba(0,0,0,.25)" stroke-width="3"/><path d="M8 92c10-20 22-30 30-34M92 92c-10-20-22-30-30-34" stroke="${W}" stroke-width="3" opacity=".6"/>`,
  tree:`<path d="M46 92V58h8v34z" fill="${W}"/><circle cx="50" cy="38" r="26" fill="${W}"/><circle cx="30" cy="50" r="16" fill="${W}" opacity=".9"/><circle cx="70" cy="50" r="16" fill="${W}" opacity=".9"/>`,
  people:`<circle cx="30" cy="32" r="10" fill="${W}" opacity=".8"/><path d="M14 74c0-14 7-24 16-24s16 10 16 24z" fill="${W}" opacity=".8"/><circle cx="70" cy="32" r="10" fill="${W}" opacity=".8"/><path d="M54 74c0-14 7-24 16-24s16 10 16 24z" fill="${W}" opacity=".8"/><circle cx="50" cy="28" r="13" fill="${W}"/><path d="M30 86c0-18 9-30 20-30s20 12 20 30z" fill="${W}"/>`,
  eye:`<path d="M6 50C20 26 34 18 50 18s30 8 44 32C80 74 66 82 50 82S20 74 6 50z" fill="${W}"/><circle cx="50" cy="50" r="18" fill="rgba(0,0,0,.2)"/><circle cx="50" cy="50" r="9" fill="${W}"/>`,
  hourglass:`<path d="M24 8h52M24 92h52" stroke="${W}" stroke-width="6" stroke-linecap="round"/><path d="M30 12c0 22 16 28 16 38S30 66 30 88h40c0-22-16-28-16-38s16-16 16-38z" fill="${W}"/><path d="M38 84c4-10 8-14 12-16 4 2 8 6 12 16z" fill="rgba(0,0,0,.2)"/>`,
  flag:`<path d="M24 92V8" stroke="${W}" stroke-width="6" stroke-linecap="round"/><path d="M27 12c14-6 26 6 46 0v34c-20 6-32-6-46 0z" fill="${W}"/>`,
  bulb:`<path d="M50 8c-18 0-30 13-30 29 0 12 8 19 12 26 2 4 2 8 2 11h32c0-3 0-7 2-11 4-7 12-14 12-26C80 21 68 8 50 8z" fill="${W}"/><path d="M36 80h28M38 88h24" stroke="${W}" stroke-width="5" stroke-linecap="round"/><path d="M44 50l6 8 6-8" stroke="rgba(0,0,0,.2)" stroke-width="3" fill="none"/>`,
  target:`<circle cx="46" cy="54" r="36" fill="${W}"/><circle cx="46" cy="54" r="24" fill="rgba(0,0,0,.18)"/><circle cx="46" cy="54" r="13" fill="${W}"/><path d="M46 54L88 12" stroke="${W}" stroke-width="5" stroke-linecap="round"/><path d="M80 10l10 2-2 10z" fill="${W}"/>`,
  loop:`<path d="M30 50c0-12 8-20 20-20 18 0 18 40 36 40 10 0 14-8 14-20S96 30 86 30c-18 0-18 40-36 40-12 0-20-8-20-20z" fill="none" stroke="${W}" stroke-width="8" transform="translate(-14 0)"/>`,
  chat:`<path d="M10 16h52a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H32l-14 12V58h-8a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z" fill="${W}"/><path d="M48 46h34a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-4v10L66 82H48a8 8 0 0 1-8-8V54a8 8 0 0 1 8-8z" fill="${W}" opacity=".75"/>`,
  bridge:`<path d="M4 64h92" stroke="${W}" stroke-width="6"/><path d="M8 64C20 30 80 30 92 64" fill="none" stroke="${W}" stroke-width="6"/><path d="M26 64V44M38 64V38M50 64V36M62 64V38M74 64V44" stroke="${W}" stroke-width="3"/><path d="M4 76c10-4 20 4 30 0s20 4 30 0 20 4 32 0" stroke="${W}" stroke-width="3" fill="none" opacity=".6"/>`,
  coins:`${[0,1,2,3].map(k=>`<ellipse cx="38" cy="${82-k*12}" rx="26" ry="9" fill="${W}"/><path d="M12 ${82-k*12}v-8a26 9 0 0 0 52 0v8" fill="${W}"/><ellipse cx="38" cy="${74-k*12}" rx="26" ry="9" fill="${W}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`).join("")}<circle cx="74" cy="58" r="20" fill="${W}" stroke="rgba(0,0,0,.18)" stroke-width="2"/><circle cx="74" cy="58" r="12" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`,
  quill:`<path d="M84 8C56 14 34 36 26 70l8 4C44 44 62 26 84 8z" fill="${W}"/><path d="M26 70l-6 18 14-14" stroke="${W}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="12" y="76" width="30" height="16" rx="4" fill="${W}" opacity=".85"/>`,
  baobab:`<path d="M38 92c3-18 2-34-4-44h32c-6 10-7 26-4 44z" fill="${W}"/><path d="M36 50C24 44 18 34 20 24M42 48c-3-10-2-20 3-28M58 48c3-10 2-20-3-28M64 50c12-6 18-16 16-26" stroke="${W}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="20" cy="22" r="10" fill="${W}"/><circle cx="44" cy="16" r="11" fill="${W}"/><circle cx="58" cy="16" r="11" fill="${W}"/><circle cx="80" cy="22" r="10" fill="${W}"/><path d="M6 92h88" stroke="${W}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  drum:`<ellipse cx="50" cy="26" rx="30" ry="10" fill="${W}"/><path d="M20 26c0 22 10 30 18 36l-4 26h32l-4-26c8-6 18-14 18-36" fill="${W}" opacity=".85"/><path d="M24 32l52 20M76 32L24 52" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`
};
let ART_N=0;
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed||1;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function topicOf(cat){return TOPICS[cat]||TOPICS["Character"]}
function starPattern(id,col){return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 4l4 10 10-4-4 10 10 4-10 4 4 10-10-4-4 10-4-10-10 4 4-10-10-4 10-4-4-10 10 4z" fill="none" stroke="${col}" stroke-width="1.2"/></pattern>`}
/* cover(seed, cat, opts) -> SVG string. opts.motif to force a motif, opts.ratio "wide"|"square"|"tall" */
function cover(seed, cat, opts={}){
  const T=topicOf(cat), r=rng(hashStr(seed)), ratio=opts.ratio||"wide";
  const vw=ratio==="tall"?300:ratio==="square"?300:400, vh=ratio==="tall"?400:300;
  const motif=opts.motif||T.motifs[Math.floor(r()*T.motifs.length)];
  const uid="g"+(++ART_N)+"_"+(hashStr(seed+cat+ratio)%1e6);
  const blobs=[...Array(5)].map(()=>{const x=r()*vw,y=r()*vh,rad=40+r()*110,o=(.12+r()*.18).toFixed(2);return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(0)}" fill="#fff" opacity="${o}"/>`}).join("");
  const dots=[...Array(14)].map(()=>{const x=r()*vw,y=r()*vh,s=(1.5+r()*3).toFixed(1);return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s}" fill="#fff" opacity=".55"/>`}).join("");
  const spark=[...Array(3)].map(()=>{const x=(r()*vw).toFixed(0),y=(r()*vh*.6).toFixed(0),s=(.5+r()*.6).toFixed(2);return `<path transform="translate(${x} ${y}) scale(${s})" d="M0-12L3-3 12 0 3 3 0 12-3 3-12 0-3-3z" fill="#fff" opacity=".8"/>`}).join("");
  const ms=Math.min(vw,vh)*(opts.small?.36:.5), mx=(vw-ms)/2+(r()-.5)*vw*.12, my=(vh-ms)/2+(opts.small?-vh*.05:vh*.02);
  const rot=((r()-.5)*14).toFixed(1);
  const angle=Math.floor(r()*360);
  const pat=T.islamic?`<rect width="${vw}" height="${vh}" fill="url(#p${uid})" opacity=".35"/>`:"";
  const hill=`<path d="M0 ${vh*.82} C ${vw*.25} ${vh*(.7+r()*.1)}, ${vw*.6} ${vh*(.92+r()*.05)}, ${vw} ${vh*.76} V ${vh} H 0z" fill="${T.ink}" opacity=".18"/>`;
  return `<svg viewBox="0 0 ${vw} ${vh}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true"><defs><linearGradient id="${uid}" gradientTransform="rotate(${angle%90+20} .5 .5)"><stop offset="0" stop-color="${T.c1}"/><stop offset="1" stop-color="${T.c2}"/></linearGradient><filter id="s${uid}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="${T.ink}" flood-opacity=".35"/></filter>${T.islamic?starPattern("p"+uid,"#fff"):""}</defs><rect width="${vw}" height="${vh}" fill="url(#${uid})"/>${pat}${blobs}${hill}${dots}${spark}<g filter="url(#s${uid})" transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${rot} ${ms/2} ${ms/2}) scale(${(ms/100).toFixed(3)})">${MOTIFS[motif]||MOTIFS.book}</g></svg>`;
}
function topicIcon(cat,size=28){const T=topicOf(cat);return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${(MOTIFS[T.motifs[0]]||"").replace(/#FFFFFF/g,"currentColor")}</svg>`}
