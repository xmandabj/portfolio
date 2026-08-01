/* Ben OS · command center runtime */
(function(){
// clock
const pad=n=>String(n).padStart(2,'0');
function tick(){const d=new Date();const s=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;document.querySelectorAll('[data-clock]').forEach(e=>e.textContent=s)}
tick();setInterval(tick,1000);

// scroll progress
const prog=document.querySelector('.prog');
addEventListener('scroll',()=>{const h=document.documentElement;prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});

// reveal + counters
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);const c=e.target.querySelectorAll?e.target.querySelectorAll('[data-count]'):[];c.forEach(count)}})},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
function count(el){const to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,t0=performance.now(),dur=1100;
(function f(t){const p=Math.min(1,(t-t0)/dur),v=to*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec);if(p<1)requestAnimationFrame(f)})(t0)}

// mission accordions
document.querySelectorAll('.mission').forEach(m=>{const h=m.querySelector('.m-head'),t=m.querySelector('.m-title');
 if(t){const b=document.createElement('span');b.className='m-open';b.textContent='View full brief';t.appendChild(b)}
 h.setAttribute('role','button');h.setAttribute('tabindex','0');
 const toggle=()=>{const willOpen=!m.classList.contains('open');m.classList.toggle('open');
  const btn=m.querySelector('.m-open');if(btn)btn.textContent=willOpen?'Close brief':'View full brief';
  if(willOpen)setTimeout(()=>{const y=m.getBoundingClientRect().top+scrollY-90;scrollTo({top:y,behavior:'smooth'})},420)};
 h.addEventListener('click',toggle);
 h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});

// before/after sliders
document.querySelectorAll('.xfade').forEach(x=>{const r=x.querySelector('.xf-range'),a=x.querySelector('.xf-after'),hd=x.querySelector('.xf-handle');
const set=v=>{a.style.clipPath=`inset(0 0 0 ${v}%)`;hd.style.left=v+'%'};set(r.value);r.addEventListener('input',()=>set(r.value))});

// nav burger
const nav=document.querySelector('.nav');
document.querySelector('.burger').addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// scale site embeds
function scaleEmbeds(){document.querySelectorAll('.site-embed').forEach(w=>{const f=w.querySelector('iframe');if(!f)return;const s=w.clientWidth/1280;f.style.transform=`scale(${s})`;f.style.height=(w.clientHeight/s)+'px'})}
scaleEmbeds();addEventListener('resize',scaleEmbeds);

/* theme */
const tog=document.getElementById('themeTog');
function setTheme(t){document.body.dataset.theme=t;if(tog)tog.querySelector('span').textContent=t==='light'?'Light':'Dark';try{localStorage.setItem('benos-theme',t)}catch(e){}}
let saved='dark';try{saved=localStorage.getItem('benos-theme')||'dark'}catch(e){}
setTheme(saved);
if(tog)tog.addEventListener('click',()=>setTheme(document.body.dataset.theme==='light'?'dark':'light'));

/* pointer spotlight */
document.querySelectorAll('.os-card,.kpi,.mission,.edu-row').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')})});

/* ---------- neural hero canvas ---------- */
const cv=document.getElementById('neural');
if(cv&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
const ctx=cv.getContext('2d');let W,H,DPR,nodes=[],mouse={x:-999,y:-999};
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);build()}
function build(){const n=Math.round(Math.min(120,Math.max(46,W*H/16000)));nodes=[];for(let i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.6+.7,p:Math.random()*Math.PI*2})}
addEventListener('resize',resize);
cv.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mouse.x=e.clientX-b.left;mouse.y=e.clientY-b.top});
cv.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999});
function frame(t){ctx.clearRect(0,0,W,H);
const light=document.body.dataset.theme==='light';
const L=light?'31,93,255':'110,168,255',N=light?'25,70,180':'180,214,255',G=light?'31,93,255':'61,132,255';
const D=Math.min(190,W*.13);
for(let i=0;i<nodes.length;i++){const a=nodes[i];
for(let j=i+1;j<nodes.length;j++){const b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
if(d<D){const o=(1-d/D)*(light?.22:.3);ctx.strokeStyle=`rgba(${L},${o})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;
const mdx=n.x-mouse.x,mdy=n.y-mouse.y,md=Math.hypot(mdx,mdy);
if(md<130){n.x+=mdx/md*.7;n.y+=mdy/md*.7}
if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;
const pulse=.55+Math.sin(t/900+n.p)*.35;
ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,7);ctx.fillStyle=`rgba(${N},${pulse*(light?.75:1)})`;ctx.fill();
if(n.r>1.9){ctx.beginPath();ctx.arc(n.x,n.y,n.r*4,0,7);ctx.fillStyle=`rgba(${G},${pulse*.09})`;ctx.fill()}});
requestAnimationFrame(frame)}
resize();requestAnimationFrame(frame)}

/* ---------- cinematic hero sequence ---------- */
(function(){
const hero=document.querySelector('.hero.cine');if(!hero)return;
const c2=hero.querySelector('.c2'),c3=hero.querySelector('.c3'),hud=[];
const st=document.getElementById('cineState'),bar=document.getElementById('cineBar'),pct=document.getElementById('cinePct');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let t0=null,done=false,DUR=6400;
function stage(p){
 if(bar)bar.style.right=(100-p*100)+'%';
 if(pct)pct.textContent=String(Math.round(p*100)).padStart(2,'0')+'%';
 if(p>.18)hero.classList.add('arms');
 c2.style.opacity=p<.24?0:p<.68?Math.min(1,(p-.24)/.16):Math.max(0,1-(p-.68)/.14);
 c3.style.opacity=p<.66?0:Math.min(1,(p-.66)/.2);
 hud.forEach((s,i)=>s.classList.toggle('on',p>.42+i*.09));
 if(st)st.textContent=p<.16?'System calm':p<.36?'Arms engaged':p<.62?'Assembling armor':p<.88?'Core sync':'AI operator online';
 if(p>=.9){hero.classList.add('ready');hero.classList.remove('arms');hero.classList.add('done')}
}
if(reduce){hero.classList.add('ready','done');stage(1);return}
requestAnimationFrame(function loop(t){
 if(t0===null)t0=t;
 const p=Math.min(1,Math.max(0,(t-t0-900)/DUR));
 stage(p);
 if(p<1)requestAnimationFrame(loop);else done=true});
// draggable progress: scrub 100% ↔ 0%
const barWrap=hero.querySelector('.cine-status .bar');
if(barWrap){const rng=document.createElement('input');rng.type='range';rng.min=0;rng.max=100;rng.value=0;rng.className='cine-range';rng.setAttribute('aria-label','Transformation progress');barWrap.appendChild(rng);
 let manual=false;
 rng.addEventListener('input',()=>{manual=true;t0=-1e9;hero.classList.remove('showing-human','showing-ai');
  const p=rng.value/100;hero.classList.toggle('ready',p>=.9);hero.classList.toggle('done',p>=.9);
  if(p<.9){hero.classList.remove('done');hero.classList.toggle('arms',p>.18)}
  stage(p)});
 const sync=setInterval(()=>{if(manual){clearInterval(sync);return}rng.value=Math.round(parseFloat(pct.textContent))},200);
}
// hover-to-morph after the sequence completes
const L=hero.querySelector('.cine-head .l'),R=hero.querySelector('.cine-head .r'),c1=hero.querySelector('.c1');
function show(mode){
 if(!hero.classList.contains('ready'))return;
 hero.classList.toggle('showing-human',mode==='human');
 hero.classList.toggle('showing-ai',mode==='ai');
 c1.style.opacity=mode==='human'?1:0;
 c2.style.opacity=0;
 c3.style.opacity=mode==='human'?0:1;
 if(st)st.textContent=mode==='human'?'Human operator':'AI operator online';
}
if(L){L.addEventListener('pointerenter',()=>show('human'));L.addEventListener('pointerleave',()=>show('ai'));
 L.addEventListener('click',()=>show('human'))}
if(R){R.addEventListener('pointerenter',()=>show('ai'));R.addEventListener('click',()=>show('ai'))}
// parallax drift after completion
addEventListener('pointermove',e=>{
 const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
 hero.querySelector('.cine-fig').style.transform='translate('+(x*-14)+'px,calc(2vh + '+(y*-10)+'px))';
 },{passive:true});
})();

/* ---------- capability constellation (orbital) ---------- */
(function(){
const wrap=document.getElementById('constel'),cv=document.getElementById('constelCv'),lab=document.getElementById('constelLabels');
if(!wrap||!cv)return;
const ctx=cv.getContext('2d');
const CLUSTERS=[
{id:'A',name:'Product Strategy',skills:['Product Strategy','Roadmap & GTM','Requirements']},
{id:'B',name:'Research & Business',skills:['Market Research','Competitor Analysis','Pricing & Models']},
{id:'C',name:'AI & Innovation',skills:['AI Strategy','GenAI / LLM & RAG','Rapid Prototyping']},
{id:'D',name:'Delivery & Craft',skills:['System Analysis','BRD / FSD / SRS','API & Data']}];
let nodes=[],W=0,H=0,focus=null,px=0,py=0,rot=0,last=0,speed=1;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,TAU=Math.PI*2;
function el(cls,html){const d=document.createElement('div');d.className='cn-node '+cls;d.innerHTML=html;lab.appendChild(d);return d}
function build(){
 lab.innerHTML='';nodes=[];
 nodes.push({type:'core',el:el('core','Ben OS'),ring:0,ang:0});
 CLUSTERS.forEach((c,ci)=>{
  const base=ci*TAU/4-TAU/8;
  const hub={type:'hub',el:el('hub','<b>'+c.id+'</b><span>'+c.name+'</span>'),ring:.5,ang:base+TAU/12,cluster:c.id};
  hub.el.dataset.cluster=c.id;nodes.push(hub);
  c.skills.forEach((sk,j)=>{
   const n={type:'skill',el:el('skill',sk),ring:1,ang:base+j*TAU/12,parent:hub,cluster:c.id};
   n.el.dataset.cluster=c.id;nodes.push(n)})});
 lab.querySelectorAll('.cn-node').forEach(n=>{
  n.addEventListener('pointerenter',()=>{const c=n.dataset.cluster;if(!c)return;focus=c;wrap.classList.add('focus');
   lab.querySelectorAll('.cn-node').forEach(o=>o.classList.toggle('lit',o.dataset.cluster===c))});
  n.addEventListener('pointerleave',()=>{focus=null;wrap.classList.remove('focus');lab.querySelectorAll('.cn-node').forEach(o=>o.classList.remove('lit'))})});
}
function dims(){return{cx:W/2,cy:H/2,RX:Math.max(150,W/2-110),RY:Math.max(110,H/2-44)}}
function resize(){const dpr=Math.min(devicePixelRatio||1,2);W=wrap.clientWidth;H=wrap.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);place()}
wrap.addEventListener('pointermove',e=>{const r=wrap.getBoundingClientRect();px=((e.clientX-r.left)/r.width-.5)*12;py=((e.clientY-r.top)/r.height-.5)*8});
wrap.addEventListener('pointerenter',()=>speed=.22);
wrap.addEventListener('pointerleave',()=>{speed=1;px=py=0});
function place(){
 const{cx,cy,RX,RY}=dims();
 nodes.forEach(n=>{
  const a=n.ang+rot,w=n.el.offsetWidth||0,d=n.ring?1:.3;
  const x=cx+Math.cos(a)*RX*n.ring+px*d,y=cy+Math.sin(a)*RY*n.ring+py*d;
  n.x=Math.max(w/2+6,Math.min(W-w/2-6,x));n.y=y;
  n.el.style.left=n.x+'px';n.el.style.top=n.y+'px'})}
function frame(t){
 if(!last)last=t;const dt=Math.min(60,t-last);last=t;
 if(!reduce)rot+=dt*0.000042*speed;
 place();
 const light=document.body.dataset.theme==='light',col=light?'31,93,255':'110,168,255',core=nodes[0];
 const{cx,cy,RX,RY}=dims();
 ctx.clearRect(0,0,W,H);
 [.5,1].forEach(r=>{ctx.beginPath();ctx.ellipse(cx,cy,RX*r,RY*r,0,0,TAU);ctx.strokeStyle='rgba('+col+',.08)';ctx.lineWidth=1;ctx.stroke()});
 nodes.forEach(n=>{
  if(n.type==='core')return;
  const from=n.type==='hub'?core:n.parent,active=!focus||focus===n.cluster;
  const o=active?(n.type==='hub'?.5:.3):.06;
  ctx.strokeStyle='rgba('+col+','+o+')';ctx.lineWidth=n.type==='hub'?1.3:.8;
  const mx=(from.x+n.x)/2+(n.y-from.y)*.16,my=(from.y+n.y)/2-(n.x-from.x)*.16;
  ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.quadraticCurveTo(mx,my,n.x,n.y);ctx.stroke();
  if(n.type==='skill'){ctx.strokeStyle='rgba('+col+','+(active?.1:.03)+')';ctx.lineWidth=.6;
   ctx.beginPath();ctx.moveTo(core.x,core.y);ctx.lineTo(n.x,n.y);ctx.stroke()}
  ctx.beginPath();ctx.arc(n.x,n.y,n.type==='hub'?2.8:1.8,0,7);ctx.fillStyle='rgba('+col+','+(o+.3)+')';ctx.fill();
  if(active&&!reduce){const p=((t/3200)+n.ang*.4)%1;
   const qx=(1-p)*(1-p)*from.x+2*(1-p)*p*mx+p*p*n.x,qy=(1-p)*(1-p)*from.y+2*(1-p)*p*my+p*p*n.y;
   ctx.beginPath();ctx.arc(qx,qy,1.9,0,7);ctx.fillStyle='rgba('+col+','+(o+.4)+')';ctx.fill()}});
 requestAnimationFrame(frame)}
build();resize();requestAnimationFrame(frame);
addEventListener('resize',resize);
window.__constel={set rot(v){rot=v;place()},get rot(){return rot}};
})();

/* ---------- collapse finale + ECG ---------- */
(function(){
const q=document.getElementById('quake'),fl=document.getElementById('flash'),ecg=document.getElementById('ecg'),contact=document.getElementById('contact'),rb=document.getElementById('reboot');
if(!q||!ecg)return;
const qx=q.getContext('2d');let bits=[],running=false,fired=false;
function qsize(){const d=Math.min(devicePixelRatio||1,2);q.width=innerWidth*d;q.height=innerHeight*d;qx.setTransform(d,0,0,d,0,0)}
qsize();addEventListener('resize',qsize);
function collapse(){
 if(fired)return;fired=true;
 const light=document.body.dataset.theme==='light';
 bits=[];for(let i=0;i<90;i++)bits.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight*.8,w:14+Math.random()*90,h:2+Math.random()*10,vy:1+Math.random()*7,vx:(Math.random()-.5)*2,r:(Math.random()-.5)*.1,a:1,rot:Math.random()*6});
 q.classList.add('on');fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');
 document.body.classList.add('quaking');setTimeout(()=>document.body.classList.remove('quaking'),600);
 if(!running){running=true;(function step(){
  qx.clearRect(0,0,innerWidth,innerHeight);let alive=0;
  bits.forEach(b=>{b.vy+=.35;b.y+=b.vy;b.x+=b.vx;b.rot+=b.r;b.a-=.008;
   if(b.a>0&&b.y<innerHeight+80){alive++;qx.save();qx.translate(b.x,b.y);qx.rotate(b.rot);
    qx.fillStyle=(light?'rgba(31,93,255,':'rgba(150,195,255,')+Math.max(0,b.a)*.55+')';
    qx.fillRect(-b.w/2,-b.h/2,b.w,b.h);qx.restore()}});
  if(alive){requestAnimationFrame(step)}else{running=false;q.classList.remove('on')}})()}
}
new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)collapse()})},{threshold:.3}).observe(contact);
addEventListener('scroll',()=>{if(scrollY<innerHeight*.5)fired=false},{passive:true});
// ECG
const ex=ecg.getContext('2d');let t0=0;
function esize(){const d=Math.min(devicePixelRatio||1,2);ecg.width=ecg.clientWidth*d;ecg.height=ecg.clientHeight*d;ex.setTransform(d,0,0,d,0,0)}
esize();addEventListener('resize',esize);
function beat(x){const p=x%1;
 if(p<.42)return Math.sin(p*7.5)*.06;
 if(p<.46)return -.14;
 if(p<.5)return .95;
 if(p<.55)return -.32;
 if(p<.68)return Math.sin((p-.55)*12)*.16;
 return 0}
(function draw(t){
 const W=ecg.clientWidth,H=ecg.clientHeight,light=document.body.dataset.theme==='light';
 ex.clearRect(0,0,W,H);
 const col=light?'31,93,255':'110,168,255';
 ex.strokeStyle='rgba('+col+',.12)';ex.lineWidth=1;ex.beginPath();ex.moveTo(0,H/2);ex.lineTo(W,H/2);ex.stroke();
 ex.beginPath();ex.lineWidth=1.8;ex.strokeStyle='rgba('+col+',.95)';
 ex.shadowColor='rgba('+col+',.8)';ex.shadowBlur=12;
 const sp=t/1400;
 for(let i=0;i<=W;i++){const v=beat(i/230+sp);const y=H/2-v*H*.36;i?ex.lineTo(i,y):ex.moveTo(i,y)}
 ex.stroke();ex.shadowBlur=0;
 requestAnimationFrame(draw)})(0);
if(rb)rb.addEventListener('click',()=>{fired=false;scrollTo({top:0,behavior:'smooth'})});
})();
})();

/* ---------- proof map runner ---------- */
(function(){
const row=document.getElementById('platRow'),run=document.getElementById('runner');
if(!row||!run)return;
const plats=[...row.querySelectorAll('.plat')],img=run.querySelector('img'),SP=[1,2,3,4,5,7];
let cur=-1;
function setStage(i){
 if(i===cur)return;cur=i;
 img.src='assets/hero-run-'+SP[i]+'.png';
 run.style.left='calc(('+i+' * (100% - 50px)/6) + ('+i+' * 10px))';
 plats.forEach((p,k)=>p.classList.toggle('on',k<=i))}
function onScroll(){
 const r=row.getBoundingClientRect();
 const p=Math.max(0,Math.min(1,(innerHeight*.85-r.top)/(innerHeight*.75)));
 setStage(Math.min(5,Math.floor(p*6.2)))}
addEventListener('scroll',onScroll,{passive:true});onScroll();
plats.forEach((p,i)=>p.addEventListener('pointerenter',()=>setStage(i)));
})();
