
Claude
App · JS
const c=document.getElementById('c'),g=c.getContext('2d'),W=960,H=540,dt=1/60;
const K={},M={x:480,y:270,l:false,r:false};let st='title',cam=0,T=0,msg='',msgT=0,AC=null;
const P=[[0,480,1000,60],[1100,480,500,60],[1250,360,160,20],[1700,480,900,60],[1900,380,200,20],[2150,300,200,20],[2700,480,700,60],[2800,380,150,20],[3500,420,600,120],[3300,300,160,20],[4200,480,900,60],[1580,300,24,180],[1700,300,24,180],[2600,300,24,180],[2700,300,24,180]];
const AN=[[1650,210],[2650,200],[3450,210],[4150,230],[1050,250]];
const LAMPS0=[600,1300,1900,2800,3600].map(x=>({x,y:330,on:1}));
const CPS=[[60,430],[1450,430],[2750,430],[4230,430]];
const GS0=[[700,480,500,900],[1300,480,1150,1500],[1850,480,1750,2050],[2250,300,2170,2330],[3100,480,2900,3300],[3650,420,3520,3900]];
const CAP0=[[1400,480],[2250,300],[3000,480]];
let p,gs,caps,lamps,pr,boss,cp,S,smoke;
function beep(f,d=.08,v=.04){try{AC=AC||new AudioContext();const o=AC.createOscillator(),a=AC.createGain();o.frequency.value=f;o.type='triangle';a.gain.value=v;o.connect(a);a.connect(AC.destination);o.start();a.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
function toast(t){msg=t;msgT=3}
function save(){try{const o=JSON.parse(localStorage.getItem('nightwire.v1')||'{}');if(!o.best||S.score>o.best.score)o.best={score:S.score,rank:S.rank,time:S.time};localStorage.setItem('nightwire.v1',JSON.stringify(o))}catch(e){}}
function best(){try{const o=JSON.parse(localStorage.getItem('nightwire.v1')||'{}');return o.best||null}catch(e){return null}}
function mkGuards(dead){return GS0.map((a,i)=>({i,x:a[0],y:a[1],a:a[2],b:a[3],d:1,sus:0,alert:0,hp:2,dead:dead&&dead.includes(i),lx:0,cd:0,inv:0}))}
function newGame(){S={t0:0,time:0,alerts:0,deaths:0,takedowns:0,score:0,rank:'C',styles:new Set()};
 p={x:60,y:430,w:20,h:36,vx:0,vy:0,face:1,ground:0,wallT:0,wall:0,coy:0,buf:0,dashT:0,dash:1,atk:0,hit:0,inv:0,hp:4,rope:null,sh:3,sm:1,crouch:0,pitch:0};
 gs=mkGuards();caps=CAP0.map(a=>({x:a[0],y:a[1],free:0}));lamps=LAMPS0.map(l=>({...l}));pr=[];smoke=null;
 boss={x:4800,y:480,hp:14,st:'idle',t:1,d:-1,vx:0,on:0,inv:0};cp={x:60,y:430,free:[],dead:[],lamps:[]};st='play';toast('Rescue three couriers, then face Sable at the signal roof.')}
function respawn(){S.deaths++;p.x=cp.x;p.y=cp.y;p.vx=p.vy=0;p.hp=4;p.rope=null;p.inv=1.5;p.sh=3;caps.forEach((q,i)=>q.free=cp.free.includes(i)?1:0);gs=mkGuards(cp.dead);lamps.forEach((l,i)=>l.on=cp.lamps.includes(i)?0:1);pr=[];boss={x:4800,y:480,hp:14,st:'idle',t:1,d:-1,vx:0,on:0,inv:0};toast('Checkpoint restored.')}
function hurt(n=1){if(p.inv>0)return;p.hp-=n;p.inv=1.1;p.vy=-250;beep(120,.2,.08);if(p.hp<=0)respawn()}
const px=()=>p.x+p.w/2,py=()=>p.y+p.h/2;
function lit(x,y){return lamps.some(l=>l.on&&Math.hypot(l.x-x,l.y-y)<190)}
function collide(o,ax){for(const r of P){if(o.x<r[0]+r[2]&&o.x+o.w>r[0]&&o.y<r[1]+r[3]&&o.y+o.h>r[1]){
 if(ax==0){if(o.vx>0){o.x=r[0]-o.w;}else o.x=r[0]+r[2];p.wall=o.vx>0?1:-1;p.wallT=.12;o.vx=0}
 else{if(o.vy>0){o.y=r[1]-o.h;o.ground=1;o.coy=.1}else o.y=r[1]+r[3];o.vy=0}}}}
function noise(x,y,rad){for(const q of gs)if(!q.dead&&Math.abs(q.x-x)<rad&&Math.abs(q.y-y)<150){q.sus=Math.max(q.sus,.5);q.lx=x;q.inv=3}}
function attack(){if(p.atk>0)return;p.atk=.28;p.hit=0;beep(500,.05);p.dashT>0&&S.styles.add('dash');!p.ground&&S.styles.add('air')}
function throwS(){if(p.sh<=0)return;p.sh--;const a=Math.atan2(M.y-(py()),M.x+cam-px());pr.push({x:px(),y:py(),vx:Math.cos(a)*620,vy:Math.sin(a)*620,t:1.2,own:1});beep(900,.05)}
function interact(){let did=0;for(const q of caps)if(!q.free&&Math.abs(q.x-px())<46&&Math.abs(q.y-p.y-p.h)<20){q.free=1;did=1;beep(660,.3,.06);toast('Courier freed ('+caps.filter(z=>z.free).length+'/3)')}
 if(!did)for(const q of gs){if(q.dead)continue;const dx=q.x-px();if(Math.abs(dx)<48&&Math.abs(q.y-p.y-p.h)<20&&q.alert<=0&&Math.sign(dx)==q.d){q.dead=1;S.takedowns++;S.styles.add('tk');beep(200,.15);toast('Silent takedown.');break}}}
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','KeyS'].includes(e.code))e.preventDefault();if(!K[e.code]){
 if(st=='title'&&(e.code=='Enter'||e.code=='Space'))newGame();
 else if(st=='results'&&e.code=='Enter')st='title';
 else if(st=='play'||st=='pause'){if(e.code=='Escape')st=st=='play'?'pause':'play';
  if(st=='pause'&&e.code=='KeyR'){respawn();st='play'}
  if(st=='play'){if(e.code=='Space')p.buf=.12;if(e.code=='ShiftLeft'&&p.dash&&p.dashT<=0){p.dashT=.16;p.dash=0;beep(300,.1)}
   if(e.code=='KeyQ')throwS();if(e.code=='KeyE')interact();
   if(e.code=='KeyR'&&p.sm>0){p.sm--;smoke={x:px(),y:py(),t:4};beep(150,.3)}}}}K[e.code]=1});
addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>{if(st=='play')st='pause'});
function mp(e){const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height}
c.addEventListener('mousemove',mp);c.addEventListener('contextmenu',e=>e.preventDefault());
c.addEventListener('mousedown',e=>{mp(e);if(st=='title'){newGame();return}if(st!='play')return;
 if(e.button==0)attack();if(e.button==2){M.r=true;let b=null,bd=1e9;for(const a of AN){const d=Math.hypot(a[0]-px(),a[1]-py());if(d<380){const m=Math.hypot(a[0]-(M.x+cam),a[1]-M.y);if(m<bd){bd=m;b=a}}}
  if(b){p.rope={x:b[0],y:b[1],len:Math.hypot(b[0]-px(),b[1]-py())};p.dash=1;beep(700,.08);S.styles.add('grap')}else toast('No anchor in range.')}});
addEventListener('mouseup',e=>{if(e.button==2){M.r=false;p.rope=null}});
function update(){T+=dt;S.time+=dt;if(msgT>0)msgT-=dt;
 const ax=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0);p.crouch=!!(K.KeyS&&p.ground);
 if(ax)p.face=ax;if(p.inv>0)p.inv-=dt;if(p.atk>0)p.atk-=dt;if(p.buf>0)p.buf-=dt;if(p.coy>0)p.coy-=dt;if(p.wallT>0)p.wallT-=dt;else p.wall=0;
 if(p.dashT>0){p.dashT-=dt;p.vx=p.face*620;p.vy=0}else{
  const sp=p.crouch?110:270;if(p.rope)p.vx+=ax*500*dt;else p.vx+=(ax*sp-p.vx)*(p.ground?.25:.1);p.vy+=1800*dt;if(p.vy>900)p.vy=900;
  if(p.wall&&!p.ground&&p.vy>90&&ax==p.wall)p.vy=90;
  if(p.buf>0){if(p.rope){p.rope=null;p.vy=-520;p.buf=0}else if(p.coy>0){p.vy=-640;p.coy=0;p.buf=0;beep(400,.06)}else if(p.wallT>0&&p.wall){p.vx=-p.wall*330;p.vy=-600;p.buf=0;p.face=-p.wall;p.dash=1;beep(450,.06)}}}
 if(p.rope&&M.r)p.rope.len=Math.max(50,p.rope.len-190*dt);
 p.ground=0;p.x+=p.vx*dt;collide(p,0);p.y+=p.vy*dt;collide(p,1);if(p.ground)p.dash=1;
 if(p.rope){const dx=px()-p.rope.x,dy=py()-p.rope.y,d=Math.hypot(dx,dy);if(d>p.rope.len){const nx=dx/d,ny=dy/d;p.x-=(d-p.rope.len)*nx;p.y-=(d-p.rope.len)*ny;const v=p.vx*nx+p.vy*ny;if(v>0){p.vx-=v*nx;p.vy-=v*ny}}}
 if(p.x<0)p.x=0;if(boss.on&&p.x<4210)p.x=4210;if(p.x>5080)p.x=5080;
 if(!boss.on&&p.x>4290){if(caps.every(q=>q.free)){boss.on=1;toast('Sable: “You always take the obvious route, Ren.”')}else{p.x=4290;toast('Free all three couriers first.')}}
 if(p.y>720){hurt();respawn();S.deaths--}
 CPS.forEach((q,i)=>{if(px()>q[0]&&cp.x<q[0]&&!boss.on){cp={x:q[0],y:q[1],free:caps.map((z,j)=>z.free?j:-1).filter(j=>j>=0),dead:gs.filter(z=>z.dead).map(z=>z.i),lamps:lamps.map((l,j)=>l.on?-1:j).filter(j=>j>=0)};if(i>0)toast('Checkpoint reached.')}});
 // sword hit
 if(p.atk>.12&&!p.hit){const hx=px()+p.face*30;for(const q of gs){if(q.dead)continue;if(Math.abs(q.x-hx)<42&&Math.abs(q.y-p.y-p.h)<30){p.hit=1;const back=q.alert<=0&&Math.sign(q.x-px())==q.d;if(back){q.dead=1;S.takedowns++}else{q.hp--;q.alert=5;q.sus=1;if(q.hp<=0)q.dead=1}beep(250,.08,.07)}}
  if(boss.on&&boss.inv<=0&&Math.abs(boss.x-hx)<48&&Math.abs(boss.y-p.y-p.h)<50){boss.hp--;boss.inv=.25;p.hit=1;beep(300,.08,.08)}}
 if(boss.inv>0)boss.inv-=dt;
 for(let i=pr.length-1;i>=0;i--){const s=pr[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.t-=dt;if(s.own)for(const l of lamps)if(l.on&&Math.hypot(l.x-s.x,l.y-s.y)<20){l.on=0;s.t=0;noise(l.x,l.y,260);toast('Lamp shattered. Shadow route opened, but guards heard it.')}
  if(s.own){for(const q of gs)if(!q.dead&&Math.abs(q.x-s.x)<18&&Math.abs(q.y-18-s.y)<28){q.sus=1;q.alert=Math.max(q.alert,3);s.t=0;q.hp--;if(q.hp<=0)q.dead=1}
   if(boss.on&&Math.abs(boss.x-s.x)<20&&Math.abs(boss.y-25-s.y)<30&&boss.inv<=0){boss.hp--;boss.inv=.2;s.t=0}}
  else if(Math.abs(px()-s.x)<14&&Math.abs(py()-s.y)<20){hurt();s.t=0}
  for(const r of P)if(s.x>r[0]&&s.x<r[0]+r[2]&&s.y>r[1]&&s.y<r[1]+r[3]){if(s.own)noise(s.x,s.y,200);s.t=0}
  if(s.t<=0)pr.splice(i,1)}
 if(smoke){smoke.t-=dt;if(smoke.t<=0)smoke=null}
 // guards
 for(const q of gs){if(q.dead)continue;if(q.cd>0)q.cd-=dt;const dx=px()-q.x,dy=py()-(q.y-18);
  let rng=250*(lit(px(),py())?1:.55)*(p.crouch?.7:1)*(Math.abs(p.vx)<20?.8:1);if(smoke&&Math.hypot(smoke.x-px(),smoke.y-py())<90)rng=0;
  const see=Math.sign(dx)==q.d&&Math.abs(dx)<rng&&Math.abs(dy)<70||Math.abs(dx)<26&&Math.abs(dy)<50&&rng>0;
  if(see){q.sus+=dt*(1+(1-Math.abs(dx)/Math.max(rng,1))*2);q.lx=px()}else q.sus=Math.max(0,q.sus-dt*.25);
  if(q.sus>=1&&q.alert<=0){S.alerts++;beep(220,.2,.07);toast('Guard alerted!')}if(q.sus>=1)q.alert=see?5:q.alert;
  if(q.alert>0){if(!see)q.alert-=dt;q.sus=1;const tx=q.lx;if(Math.abs(tx-q.x)>30){q.d=Math.sign(tx-q.x);q.x+=q.d*120*dt}
   if(Math.abs(dx)<40&&Math.abs(dy)<50&&q.cd<=0){q.cd=1.2;hurt()}if(q.alert<=0)q.sus=.4}
  else if(q.sus>.35||q.inv>0){q.inv-=dt;if(Math.abs(q.lx-q.x)>20&&q.sus>=.35&&q.inv>0){q.d=Math.sign(q.lx-q.x);q.x+=q.d*50*dt}if(q.inv<=0&&q.sus<.35)q.sus=0}
  else{q.x+=q.d*50*dt;if(q.x>q.b)q.d=-1;if(q.x<q.a)q.d=1}}
 // boss
 if(boss.on&&boss.hp>0){const b=boss,ph=b.hp<7?.7:1;b.t-=dt;const dd=Math.sign(px()-b.x)||1;
  if(b.st=='idle'){b.d=dd;const far=Math.abs(px()-b.x);b.x+=(far>220?1:-1)*dd*90*dt;if(b.t<=0){b.st=Math.random()<.5?'tele':'throw';b.t=.6*ph}}
  else if(b.st=='tele'&&b.t<=0){b.st='dash';b.t=.4;b.vx=b.d*720}
  else if(b.st=='dash'){b.x+=b.vx*dt;if(Math.abs(px()-b.x)<28&&Math.abs(py()-(b.y-25))<40)hurt();if(b.t<=0){b.st='rec';b.t=1;beep(180,.2)}}
  else if(b.st=='throw'&&b.t<=0){for(let i=-1;i<=1;i++){const a=Math.atan2(py()-b.y+25,px()-b.x)+i*.25;pr.push({x:b.x,y:b.y-25,vx:Math.cos(a)*340,vy:Math.sin(a)*340,t:2.5,own:0})}b.st='rec';b.t=.9*ph}
  else if(b.st=='rec'&&b.t<=0){b.st='idle';b.t=.7*ph}
  b.x=Math.max(4270,Math.min(5050,b.x));
  if(b.hp<=0){finish()}}}
function finish(){const f=caps.filter(q=>q.free).length;let sc=f*100+(S.alerts==0?200:Math.max(0,150-S.alerts*40))+S.styles.size*30+Math.max(0,200-Math.floor(S.time/2))-S.deaths*20;S.score=Math.max(0,sc);
 S.rank=S.score>=620?'S':S.score>=500?'A':S.score>=380?'B':'C';S.rescued=f;save();st='results'}
// drawing
const TW=[...Array(14)].map((_,i)=>({x:i*420+Math.sin(i)*80,h:160+(i*53%140)}));
function draw(){g.fillStyle='#050b14';g.fillRect(0,0,W,H);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0a1830');gr.addColorStop(1,'#050b14');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle='#d8e6ff';g.beginPath();g.arc(780,90,28,0,7);g.fill();
 TW.forEach(t=>{const x=t.x-cam*.3;g.fillStyle='#0a1424';g.fillRect(x,H-t.h-60,60,t.h+60);g.fillStyle='#0c1a30';g.fillRect(x-14,H-t.h-40,88,10);g.fillStyle='#f5b24244';for(let j=0;j<4;j++)g.fillRect(x+10,H-t.h-30+j*26,6,8)});
 g.save();g.translate(-cam,0);
 lamps.forEach(l=>{if(l.on){const rg=g.createRadialGradient(l.x,l.y,5,l.x,l.y,190);rg.addColorStop(0,'#f5b24255');rg.addColorStop(1,'#f5b24200');g.fillStyle=rg;g.fillRect(l.x-190,l.y-190,380,380);g.fillStyle='#ffd27a';g.fillRect(l.x-4,l.y-4,8,8)}g.strokeStyle='#445';g.beginPath();g.moveTo(l.x,l.y-100);g.lineTo(l.x,l.y-4);g.stroke()});
 P.forEach(r=>{g.fillStyle='#0d1626';g.fillRect(r[0],r[1],r[2],r[3]);g.fillStyle='#22d3ee';g.fillRect(r[0],r[1],r[2],2)});
 AN.forEach(a=>{g.strokeStyle='#22d3ee';g.lineWidth=2;g.beginPath();g.arc(a[0],a[1],8+Math.sin(T*4)*1.5,0,7);g.stroke()});
 g.fillStyle='#ffc857';g.fillRect(4900,380,6,100);g.fillText('SIGNAL ROOF',4860,370);
 caps.forEach(q=>{g.fillStyle=q.free?'#554':'#ffc857';g.fillRect(q.x-8,q.y-28,16,28);if(!q.free){g.fillStyle='#ffc857';g.fillText('E',q.x-3,q.y-36)}});
 gs.forEach(q=>{if(q.dead)return;g.fillStyle='#2b2347';g.fillRect(q.x-10,q.y-38,20,38);g.fillStyle='#c4b5fd';g.fillRect(q.x+q.d*6-2,q.y-32,5,4);
  if(q.alert<=0){g.fillStyle=q.sus>.35?'#f5b24222':'#8b5cf615';g.beginPath();g.moveTo(q.x,q.y-30);g.lineTo(q.x+q.d*250,q.y-90);g.lineTo(q.x+q.d*250,q.y+30);g.fill()}
  if(q.sus>.05){g.fillStyle=q.alert>0?'#ff4d6d':'#ffc857';g.fillRect(q.x-12,q.y-52,24*Math.min(1,q.sus),4);g.font='bold 16px sans-serif';g.fillText(q.alert>0?'!':q.sus>.35?'?':'',q.x-4,q.y-56)}});
 if(boss.on&&boss.hp>0){const b=boss;g.globalAlpha=b.hp<7?.25:0;g.fillStyle='#a78bfa';g.fillRect(b.x-b.d*60-10,b.y-50,20,50);g.globalAlpha=1;g.fillStyle=b.st=='tele'?'#fff':'#7c3aed';g.fillRect(b.x-12,b.y-50,24,50);g.fillStyle='#e9d5ff';g.fillRect(b.x-12,b.y-44,24,6);
  g.fillStyle='#222';g.fillRect(4300,40,360,8);}
 if(smoke){g.fillStyle='#9aa7b755';g.beginPath();g.arc(smoke.x,smoke.y,90,0,7);g.fill()}
 pr.forEach(s=>{g.fillStyle=s.own?'#22d3ee':'#c084fc';g.fillRect(s.x-4,s.y-4,8,8)});
 if(p.rope){g.strokeStyle='#22d3ee';g.lineWidth=2;g.beginPath();g.moveTo(px(),py());g.lineTo(p.rope.x,p.rope.y);g.stroke()}
 if(!(p.inv>0&&Math.floor(T*20)%2)){const h=p.crouch?24:p.h,y=p.y+p.h-h;g.fillStyle='#10192b';g.fillRect(p.x,y,p.w,h);g.fillStyle='#4338ca';g.fillRect(p.x+(p.face>0?-8:p.w),y+6,10,4);g.fillStyle='#22d3ee';g.fillRect(p.x+(p.face>0?12:2),y+7,6,3);
  if(p.atk>0){g.strokeStyle='#e0f7ff';g.lineWidth=3;g.beginPath();g.arc(px(),py(),44,p.face>0?-1:Math.PI-1,p.face>0?1:Math.PI+1);g.stroke()}}
 g.restore();
 g.strokeStyle='#9bd6ff55';g.lineWidth=1;g.beginPath();for(let i=0;i<70;i++){const x=(i*173+T*120)%W,y=(i*97+T*600)%H;g.moveTo(x,y);g.lineTo(x-3,y+12)}g.stroke();
 g.font='14px system-ui';g.fillStyle='#fff';for(let i=0;i<4;i++){g.fillStyle=i<p.hp?'#22d3ee':'#1c2a3a';g.fillRect(16+i*30,16,26,10)}
 g.fillStyle='#cfe';g.fillText('Shuriken '+p.sh+'   Smoke '+p.sm+'   Couriers '+caps.filter(q=>q.free).length+'/3   Alerts '+S.alerts,16,46);
 g.fillText(boss.on?'Defeat Sable':caps.every(q=>q.free)?'Objective: reach the signal roof':'Objective: rescue three couriers',16,66);
 if(boss.on){g.fillStyle='#7c3aed';g.fillRect(W/2-150,500,300*Math.max(0,boss.hp)/14,8);g.strokeStyle='#a78bfa';g.strokeRect(W/2-150,500,300,8)}
 if(msgT>0){g.fillStyle='#000a';g.fillRect(W/2-300,H-80,600,30);g.fillStyle='#fff';g.textAlign='center';g.fillText(msg,W/2,H-60);g.textAlign='left'}
 if(st=='pause'){g.fillStyle='#000c';g.fillRect(0,0,W,H);g.fillStyle='#fff';g.textAlign='center';g.font='28px system-ui';g.fillText('PAUSED',W/2,230);g.font='15px system-ui';g.fillText('Esc: resume   ·   R: restart from checkpoint',W/2,266);g.textAlign='left'}}
function screen(lines,title,sub){g.fillStyle='#050b14';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#22d3ee';g.font='13px system-ui';g.fillText('ORIGINAL GAME PROJECT · MISSION 1: LANTERN DISTRICT',W/2,80);g.fillStyle='#fff';g.font='bold 64px system-ui';g.fillText(title,W/2,150);g.fillStyle='#9fb3c8';g.font='16px system-ui';g.fillText(sub,W/2,185);g.font='14px system-ui';lines.forEach((l,i)=>{g.fillStyle=l[1]||'#cfe';g.fillText(l[0],W/2,230+i*24)});g.textAlign='left'}
function render(){if(st=='title'){const b=best();screen([['A / D move · S crouch · Space jump / wall-jump · Shift dash',''],['Hold right mouse: grapple and swing (release to keep momentum) · Left mouse: sword',''],['Q shuriken (breaks lamps, distracts) · R smoke bomb · E rescue / takedown from behind · Esc pause',''],['',''],['Ren (cyan) · Aya (amber) · Jiro (ash) · Sable (violet) · Garran (red) · Kuroha (crimson)','#ffc857'],['Rescue three couriers, reach the signal roof, defeat Sable.','#fff'],[b?'Best: rank '+b.rank+' · '+b.score+' pts':'No saved rank yet (progress is stored in this browser only)','#9fb3c8'],['',''],['Press Enter or click to begin','#22d3ee']],'NIGHTWIRE','Move like a shadow. Strike like a storm.')}
 else if(st=='results'){screen([['Rescued '+S.rescued+'/3 couriers','#ffc857'],['Alerts '+S.alerts+' · Takedowns '+S.takedowns+' · Retries '+S.deaths],['Techniques used '+S.styles.size+' · Time '+Math.floor(S.time)+'s'],['Score '+S.score+'   Rank '+S.rank,'#22d3ee'],['Sable falls. The signal roof lights the way to Floodline Foundry (next in the roadmap).','#9fb3c8'],['',''],['Press Enter for title','#22d3ee']],'MISSION COMPLETE','Lantern District')}
 else draw()}
let acc=0,last=performance.now();
function loop(n){acc+=Math.min(.1,(n-last)/1000);last=n;while(acc>=dt){if(st=='play'){update();cam+=(Math.max(0,Math.min(5200-W,px()-W/2))-cam)*.12}acc-=dt}render();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
 

Claude finished the response
