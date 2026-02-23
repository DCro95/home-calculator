import { useState, useMemo, useCallback } from "react";

const STATES={AL:{n:"Alabama",t:"prog",r:[[0,500,.02],[500,3e3,.04],[3e3,1/0,.05]],p:.0033},AK:{n:"Alaska",t:"none",r:[],p:.0098},AZ:{n:"Arizona",t:"flat",r:.025,p:.0055},AR:{n:"Arkansas",t:"prog",r:[[0,4400,.02],[4400,8800,.04],[8800,1/0,.044]],p:.0052},CA:{n:"California",t:"prog",r:[[0,20198,.01],[20198,47884,.02],[47884,75576,.04],[75576,104910,.06],[104910,132590,.08],[132590,677278,.093],[677278,812728,.103],[812728,1354550,.113],[1354550,1/0,.123]],p:.0071},CO:{n:"Colorado",t:"flat",r:.044,p:.0049},CT:{n:"Connecticut",t:"prog",r:[[0,1e4,.03],[1e4,5e4,.05],[5e4,1e5,.055],[1e5,2e5,.06],[2e5,25e4,.065],[25e4,5e5,.069],[5e5,1/0,.0699]],p:.0163},DE:{n:"Delaware",t:"prog",r:[[0,2e3,0],[2e3,5e3,.022],[5e3,1e4,.039],[1e4,2e4,.048],[2e4,25e3,.052],[25e3,6e4,.0555],[6e4,1/0,.066]],p:.0043},FL:{n:"Florida",t:"none",r:[],p:.008},GA:{n:"Georgia",t:"prog",r:[[0,750,.01],[750,2250,.02],[2250,3750,.03],[3750,5250,.04],[5250,7e3,.05],[7e3,1/0,.0549]],p:.0072},HI:{n:"Hawaii",t:"prog",r:[[0,2400,.014],[2400,4800,.032],[4800,9600,.055],[9600,14400,.064],[14400,19200,.068],[19200,24e3,.072],[24e3,36e3,.076],[36e3,48e3,.079],[48e3,15e4,.0825],[15e4,175e3,.09],[175e3,2e5,.1],[2e5,1/0,.11]],p:.0032},ID:{n:"Idaho",t:"flat",r:.058,p:.0053},IL:{n:"Illinois",t:"flat",r:.0495,p:.0173},IN:{n:"Indiana",t:"flat",r:.0305,p:.0075},IA:{n:"Iowa",t:"prog",r:[[0,6210,.044],[6210,31050,.0482],[31050,1/0,.057]],p:.0132},KS:{n:"Kansas",t:"prog",r:[[0,15e3,.031],[15e3,3e4,.0525],[3e4,1/0,.057]],p:.0122},KY:{n:"Kentucky",t:"flat",r:.04,p:.0072},LA:{n:"Louisiana",t:"prog",r:[[0,12500,.0185],[12500,5e4,.035],[5e4,1/0,.0425]],p:.0055},ME:{n:"Maine",t:"prog",r:[[0,24500,.058],[24500,58050,.0675],[58050,1/0,.0715]],p:.0108},MD:{n:"Maryland",t:"prog",r:[[0,1e3,.02],[1e3,2e3,.03],[2e3,3e3,.04],[3e3,1e5,.0475],[1e5,125e3,.05],[125e3,15e4,.0525],[15e4,25e4,.055],[25e4,1/0,.0575]],p:.0087},MA:{n:"Massachusetts",t:"flat",r:.05,p:.0104},MI:{n:"Michigan",t:"flat",r:.0425,p:.0132},MN:{n:"Minnesota",t:"prog",r:[[0,30070,.0535],[30070,98760,.068],[98760,183340,.0785],[183340,1/0,.0985]],p:.0096},MS:{n:"Mississippi",t:"flat",r:.047,p:.0065},MO:{n:"Missouri",t:"prog",r:[[0,1207,.02],[1207,2414,.025],[2414,3621,.03],[3621,4828,.035],[4828,6035,.04],[6035,7242,.045],[7242,8449,.05],[8449,1/0,.048]],p:.0082},MT:{n:"Montana",t:"prog",r:[[0,20500,.047],[20500,1/0,.059]],p:.0074},NE:{n:"Nebraska",t:"prog",r:[[0,3700,.0246],[3700,22170,.0351],[22170,35730,.0501],[35730,1/0,.0584]],p:.0142},NV:{n:"Nevada",t:"none",r:[],p:.0048},NH:{n:"New Hampshire",t:"none",r:[],p:.0159},NJ:{n:"New Jersey",t:"prog",r:[[0,2e4,.014],[2e4,35e3,.0175],[35e3,4e4,.035],[4e4,75e3,.05525],[75e3,5e5,.0637],[5e5,1e6,.0897],[1e6,1/0,.1075]],p:.0189},NM:{n:"New Mexico",t:"prog",r:[[0,5500,.017],[5500,11e3,.032],[11e3,16e3,.047],[16e3,21e4,.049],[21e4,1/0,.059]],p:.0062},NY:{n:"New York",t:"prog",r:[[0,8500,.04],[8500,11700,.045],[11700,13900,.0525],[13900,80650,.0585],[80650,215400,.0625],[215400,1077550,.0685],[1077550,5e6,.0965],[5e6,25e6,.103],[25e6,1/0,.109]],p:.0136},NC:{n:"North Carolina",t:"flat",r:.045,p:.0069},ND:{n:"North Dakota",t:"prog",r:[[0,44725,.0195],[44725,1/0,.025]],p:.0086},OH:{n:"Ohio",t:"prog",r:[[0,26050,0],[26050,1e5,.02765],[1e5,1/0,.0388]],p:.0132},OK:{n:"Oklahoma",t:"prog",r:[[0,1e3,.0025],[1e3,2500,.0075],[2500,3750,.0175],[3750,4900,.0275],[4900,7200,.0375],[7200,1/0,.0475]],p:.0074},OR:{n:"Oregon",t:"prog",r:[[0,4050,.0475],[4050,10200,.0675],[10200,125e3,.0875],[125e3,1/0,.099]],p:.0082},PA:{n:"Pennsylvania",t:"flat",r:.0307,p:.0128},RI:{n:"Rhode Island",t:"prog",r:[[0,73450,.0375],[73450,166950,.0475],[166950,1/0,.0599]],p:.0115},SC:{n:"South Carolina",t:"prog",r:[[0,3460,0],[3460,17330,.03],[17330,1/0,.064]],p:.005},SD:{n:"South Dakota",t:"none",r:[],p:.0107},TN:{n:"Tennessee",t:"none",r:[],p:.0056},TX:{n:"Texas",t:"none",r:[],p:.016},UT:{n:"Utah",t:"flat",r:.0465,p:.0052},VT:{n:"Vermont",t:"prog",r:[[0,45400,.0355],[45400,110450,.066],[110450,228900,.076],[228900,1/0,.0875]],p:.0157},VA:{n:"Virginia",t:"prog",r:[[0,3e3,.02],[3e3,5e3,.03],[5e3,17e3,.05],[17e3,1/0,.0575]],p:.0074},WA:{n:"Washington",t:"none",r:[],p:.0082},WV:{n:"West Virginia",t:"prog",r:[[0,1e4,.0236],[1e4,25e3,.0315],[25e3,4e4,.0354],[4e4,6e4,.0472],[6e4,1/0,.0512]],p:.0049},WI:{n:"Wisconsin",t:"prog",r:[[0,14320,.0354],[14320,28640,.0465],[28640,315310,.053],[315310,1/0,.0765]],p:.0143},WY:{n:"Wyoming",t:"none",r:[],p:.0051},DC:{n:"Washington DC",t:"prog",r:[[0,1e4,.04],[1e4,4e4,.06],[4e4,6e4,.065],[6e4,25e4,.085],[25e4,5e5,.0925],[5e5,1e6,.0975],[1e6,1/0,.1075]],p:.0056}};

const FBRACKETS={mfj:[{m:23850,r:.1},{m:96950,r:.12},{m:206700,r:.22},{m:394600,r:.24},{m:501050,r:.32},{m:751600,r:.35},{m:1/0,r:.37}],single:[{m:11925,r:.1},{m:48475,r:.12},{m:103350,r:.22},{m:197300,r:.24},{m:250525,r:.32},{m:626350,r:.35},{m:1/0,r:.37}],hoh:[{m:17e3,r:.1},{m:64850,r:.12},{m:103350,r:.22},{m:197300,r:.24},{m:250500,r:.32},{m:626350,r:.35},{m:1/0,r:.37}]};
const STDDED={mfj:30000,single:15000,hoh:22500};

function fedTax(ti,f){let t=0,p=0;for(const b of(FBRACKETS[f]||FBRACKETS.mfj)){if(ti<=p)break;t+=(Math.min(ti,b.m)-p)*b.r;p=b.m;}return t;}
function stTax(ti,st){const s=STATES[st];if(!s||s.t==="none")return 0;if(s.t==="flat")return ti*s.r;let t=0,p=0;for(const b of s.r){if(ti<=p)break;t+=(Math.min(ti,b[1])-Math.max(b[0],p))*b[2];p=b[1];}return Math.max(t,0);}
function pmt(rate,yrs,pv){if(rate===0)return pv/(yrs*12);const r=rate/12,n=yrs*12;return(pv*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);}
function maxLoan(rate,yrs,mp){if(rate===0)return mp*yrs*12;const r=rate/12,n=yrs*12;return mp*(Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n));}

function buildAmort(P,ar,yrs,ex){
  const r=ar/12,n=yrs*12,bp=pmt(ar,yrs,P);const std=[],ext=[];let bS=P,bE=P,cS=0,cE=0;
  for(let i=1;i<=n;i++){
    if(bS>.01){const it=bS*r,pr=Math.min(bp-it,bS);bS=Math.max(bS-pr,0);cS+=it;std.push({m:i,p:bp,pr,it,b:bS,ci:cS});}
    else std.push({m:i,p:0,pr:0,it:0,b:0,ci:cS});
    if(bE>.01){const it=bE*r,tot=Math.min(bp+ex,bE+it),pr=tot-it;bE=Math.max(bE-pr,0);cE+=it;ext.push({m:i,p:tot,pr,it,b:bE,ci:cE});}
    else ext.push({m:i,p:0,pr:0,it:0,b:0,ci:cE});
  }
  return{std,ext,tiS:cS,tiE:cE,po:((ext.findIndex(e=>e.b<.01)+1)||n),bp};
}

function buildInv(mo,ar,yrs){const r=ar/12,a=[];for(let y=1;y<=yrs;y++){const m=y*12,fv=r>0?mo*((Math.pow(1+r,m)-1)/r):mo*m;a.push({y,c:mo*m,v:fv,g:fv-mo*m});}return a;}

const $=n=>"$"+Math.round(Math.abs(n)).toLocaleString();
const $2=n=>"$"+Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const pc=n=>(n*100).toFixed(1)+"%";

function genReport(c,inp){
  const sn=STATES[inp.st]?.n||inp.st;const now=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const rw=(l,v,cl="")=>`<tr class="${cl}"><td>${l}</td><td class="n">${v}</td></tr>`;
  const hd=t=>`<tr class="h"><td colspan="2">${t}</td></tr>`;
  const rt=(l,v,tg,d)=>{const ok=v<=tg;return`<div class="rt ${ok?'g':'w'}"><div class="rl"><b>${l}</b><br><small>${d}</small></div><div class="rv">${pc(v)}<span>${ok?'✓ GOOD':'⚠ HIGH'}</span></div></div>`;};
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Home Affordability Report</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Source Sans 3',sans-serif;color:#1e293b;padding:32px;max-width:800px;margin:0 auto;font-size:11px;line-height:1.5}
h1{font-size:22px;font-weight:900;color:#0f172a;border-bottom:3px solid #1e40af;padding-bottom:6px;margin-bottom:4px}
h2{font-size:13px;font-weight:800;color:#fff;background:#1e293b;padding:5px 10px;margin:14px 0 4px;border-radius:4px}
h2.g{background:#15803d}h2.r{background:#b91c1c}h2.p{background:#4a148c}
.sub{font-size:10px;color:#64748b;margin-bottom:10px}.dt{font-size:10px;color:#94a3b8;margin-bottom:14px}
table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:11px}td{padding:3px 8px;border-bottom:1px solid #f1f5f9}
td.n{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
tr.h td{background:#eff6ff;font-weight:800;color:#1e40af;border-bottom:2px solid #bfdbfe}
tr.t td{background:#f0fdf4;font-weight:900;border-top:2px solid #16a34a;font-size:12px}
tr.w td{background:#fef2f2;color:#dc2626}tr.hl td{background:#eff6ff;font-weight:800}
.tc{display:flex;gap:14px}.tc>div{flex:1}
.rt{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;border-radius:6px;margin-bottom:3px;border:1px solid #e2e8f0}
.rt.g{background:#f0fdf4;border-color:#bbf7d0}.rt.w{background:#fef2f2;border-color:#fecaca}
.rl{font-size:10px}.rl small{color:#94a3b8;font-size:9px}
.rv{text-align:right;font-size:15px;font-weight:900}.rv span{font-size:9px;display:block}
.rt.g .rv{color:#16a34a}.rt.w .rv{color:#dc2626}
.bx{border:2px solid #1e40af;border-radius:8px;padding:10px;margin:8px 0;text-align:center}
.bx.g{border-color:#16a34a;background:#f0fdf4}.bx.r{border-color:#dc2626;background:#fef2f2}
.big{font-size:22px;font-weight:900}.lb{font-size:9px;color:#64748b;margin-bottom:2px}
.bx.g .big{color:#16a34a}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:6px 0}.g3 .bx{margin:0}
.nt{font-size:9px;color:#94a3b8;margin-top:14px;padding-top:8px;border-top:1px solid #e2e8f0}
@media print{body{padding:16px;font-size:10px}h2{break-after:avoid}table{break-inside:avoid}.tc{break-inside:avoid}}
</style></head><body>
<h1>Home Affordability Report</h1>
<div class="sub">${sn} • ${inp.fl} Filing • ${inp.ty}-Year ${inp.lt}</div>
<div class="dt">Generated ${now}</div>
<div class="tc"><div>
<h2>Income & Taxes</h2><table>
${rw("Household Gross Income",$(c.gross))}${rw("Pre-Tax Deductions",$(c.pretax))}${rw("Taxable Income",$(c.taxable))}
${hd("TAX BREAKDOWN")}${rw("Federal Income Tax",$(c.fedTx))}${rw(sn+" State Tax",$(c.stTx))}${rw("FICA (SS + Medicare)",$(c.fica))}
${rw("Total Annual Tax",$(c.totTx),"hl")}${rw("Effective Rate",pc(c.gross>0?c.totTx/c.gross:0))}
${rw("Annual Take-Home",$(c.netA),"t")}${rw("Monthly Take-Home",$(c.netM),"t")}
</table></div><div>
<h2>Purchase & Loan</h2><table>
${rw("Home Price",$(inp.price))}${rw("Down Payment ("+inp.dp+"%)",$(c.dpAmt))}${rw("Loan Amount",$(c.loan))}
${rw("Interest Rate",(c.rate*100).toFixed(3)+"%")}${rw("Loan Term",inp.ty+" years")}
${rw("Closing Costs (~"+inp.cp+"%)",$(c.closing))}${rw("Total Cash Needed",$(c.dpAmt+c.closing),"hl")}
${hd("MONTHLY PITI")}${rw("Principal & Interest",$2(c.mPI))}${rw("Property Tax",$2(c.mTx))}${rw("Insurance",$2(c.mIns))}
${c.hasPMI?rw("PMI",$2(c.mPMI)):""}${rw("TOTAL MONTHLY PITI",$(c.piti),"t")}${rw("Total Interest Over Loan",$(c.am.tiS))}
</table></div></div>
<h2 class="g">Maximum Borrowing Power</h2>
<div class="g3">
<div class="bx g"><div class="lb">Max Home (28% Gross DTI)</div><div class="big">${$(c.mx28)}</div></div>
<div class="bx g"><div class="lb">Max Home (45% Gross DTI)</div><div class="big">${$(c.mx45)}</div></div>
<div class="bx"><div class="lb">Max Home (30% Net Income)</div><div class="big">${$(c.mxN)}</div></div>
</div>
<h2>Monthly Cash Flow</h2><table>
${rw("Monthly Net Income",$(c.netM))}${rw("Housing (PITI)","−"+$(c.piti))}
${c.extra>0?rw("Extra Mortgage Payment","−"+$(c.extra)):""}
${rw("Obligated Debts","−"+$(c.totD))}${rw("Discretionary Expenses","−"+$(c.totE))}
${rw(c.surplus>=0?"Monthly Surplus":"Monthly Shortfall",$(c.surplus),c.surplus>=0?"t":"w")}
</table>
<h2>Affordability Ratios</h2>
${rt("Front-End DTI (Housing ÷ Gross)",c.fDTI,.28,"Lender guideline ≤ 28%")}
${rt("Back-End DTI (Housing+Debts ÷ Gross)",c.bDTI,.45,"Conventional max ≤ 45%")}
${rt("Housing-to-Net Ratio",c.hNet,.30,"Comfort target ≤ 30%")}
${rt("Total Expense-to-Net",c.eRat,.85,"Target ≤ 85% for 15%+ buffer")}
${c.extra>0?`<h2 class="p">Extra Payment & Investment Analysis</h2>
<div class="tc"><div class="bx g"><div class="lb">Pay Down: Interest Saved</div><div class="big">${$(c.intSv)}</div>
<div style="font-size:10px;color:#64748b">Payoff: ${(c.am.po/12).toFixed(1)} yrs (${((inp.ty*12-c.am.po)/12).toFixed(1)} early)</div></div>
<div class="bx"><div class="lb">Invest: Portfolio at Year ${inp.ty}</div><div class="big">${$(c.invEnd.v)}</div>
<div style="font-size:10px;color:#64748b">${inp.sr}% return • Gains: ${$(c.invEnd.g)}</div></div></div>`:""}
<div class="bx" style="margin-top:10px"><div class="lb">6-Month Emergency Fund</div><div class="big" style="color:#92400e">${$(c.totOut*6)}</div></div>
<div class="nt"><b>Disclaimer:</b> Educational/planning purposes only — not financial, legal, or tax advice. Consult a licensed mortgage professional, tax advisor, and financial planner. Tax calculations use 2025 federal brackets and approximate state rates. Property tax uses ${sn} average effective rate (${(STATES[inp.st]?.p*100||0).toFixed(2)}%) — actual rates vary by county. Investment returns not guaranteed.</div>
</body></html>`;
  const b=new Blob([html],{type:'text/html'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='Home_Affordability_Report.html';a.click();URL.revokeObjectURL(u);
}

function I({label,value,onChange,prefix="$",suffix,step=100,help}){
  return(<div style={{marginBottom:7}}>
    <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"#6b7a8d",marginBottom:2}}>{label}{help&&<span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"#a0aec0",marginLeft:3,fontSize:8}}>({help})</span>}</div>
    <div style={{display:"flex",alignItems:"center",border:"2px solid #d1d9e6",borderRadius:7,background:"#fefdf8",overflow:"hidden"}}>
      {prefix&&<span style={{padding:"0 5px",fontSize:11,fontWeight:700,color:"#1e40af",background:"#eef2ff"}}>{prefix}</span>}
      <input type="number" value={value} onChange={e=>onChange(+e.target.value||0)} step={step} min={0}
        style={{flex:1,padding:"6px 4px",textAlign:"right",fontSize:12,fontWeight:700,color:"#1e40af",border:"none",outline:"none",background:"transparent",width:"100%"}}/>
      {suffix&&<span style={{padding:"0 5px",fontSize:9,fontWeight:700,color:"#64748b",background:"#f8fafc"}}>{suffix}</span>}
    </div>
  </div>);
}

function DR({label,value,onChange}){
  return(<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}>
    <span style={{flex:1,fontSize:10,color:"#475569",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
    <div style={{display:"flex",alignItems:"center",border:"1px solid #e2e8f0",borderRadius:5,background:"#fefdf8",width:88,overflow:"hidden"}}>
      <span style={{padding:"0 2px",fontSize:9,color:"#1e40af"}}>$</span>
      <input type="number" value={value} onChange={e=>onChange(+e.target.value||0)} step={10}
        style={{width:"100%",padding:"4px 2px",textAlign:"right",fontSize:10,fontWeight:700,color:"#1e40af",border:"none",outline:"none",background:"transparent"}}/>
    </div>
  </div>);
}

function St({label,value,color="#1e293b",bg="#f8fafc",sub,icon}){
  return(<div style={{borderRadius:8,padding:"5px 3px",textAlign:"center",background:bg,border:`1px solid ${color}15`}}>
    {icon&&<div style={{fontSize:12,marginBottom:1}}>{icon}</div>}
    <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:".04em",color:"#64748b"}}>{label}</div>
    <div style={{fontSize:14,fontWeight:900,color,fontFamily:"Georgia,serif"}}>{value}</div>
    {sub&&<div style={{fontSize:8,color:"#94a3b8"}}>{sub}</div>}
  </div>);
}

function Br({segs,total}){return(<div style={{display:"flex",gap:2,borderRadius:5,overflow:"hidden",height:18,background:"#1e293b",padding:2}}>
  {segs.map((s,i)=>{const w=total>0?(s.v/total)*100:0;return w>.5?<div key={i} style={{width:`${w}%`,background:s.c,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center"}}>{w>13&&<span style={{fontSize:7,fontWeight:700,color:"#fff"}}>{s.l}</span>}</div>:null;})}
</div>);}

function Sec({title,color="#1e293b",children}){return(<div style={{marginBottom:12}}><h2 style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:".08em",color,paddingBottom:3,borderBottom:`3px solid ${color}`,marginBottom:7}}>{title}</h2>{children}</div>);}

function PR({label,val,color,bg}){return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 8px",borderRadius:6,background:bg,marginBottom:2}}><span style={{fontSize:10,fontWeight:600,color}}>{label}</span><span style={{fontSize:12,fontWeight:900,color}}>{$2(val)}</span></div>);}

export default function App(){
  const[i1,sI1]=useState(85000);const[i2,sI2]=useState(65000);const[bon,sB]=useState(0);const[rI,sRI]=useState(0);const[sI,sSI]=useState(0);const[oI,sOI]=useState(0);
  const[fil,setFil]=useState("mfj");const[k4,sK]=useState(0);const[hs,sH]=useState(0);const[oP,sOP]=useState(0);const[st,setSt]=useState("MI");
  const[pr,setPr]=useState(350000);const[dp,setDp]=useState(10);const[lt,setLt]=useState("fixed");
  const[fr,setFr]=useState(6.24);const[ar,setAr]=useState(5.75);const[ty,setTy]=useState(30);
  const[mo,setMo]=useState(0);const[ins,setIns]=useState(1500);const[pm,setPm]=useState(.4);const[cp,setCp]=useState(3);
  const[ex,setEx]=useState(0);const[sr,setSr]=useState(10);
  const dL=["Car Pmt #1","Car Pmt #2","Car Insurance","Student Loan","Credit Card #1","Credit Card #2","Personal Loan","Medical","Other Debt"];
  const[dV,sDV]=useState([450,350,280,200,50,25,0,0,0]);
  const eL=["Groceries","Dining Out","Electric","Gas/Heat","Water/Sewer","Trash","Internet","Cell Phones","Streaming","Gym","Gas/Fuel","Vehicle Maint","Home Maint","Lawn/Snow","Clothing","Haircuts","Entertainment","Pets","Kids","Gifts","Medical","Rx","Life Insurance","Savings","Retirement","Vacation","Other"];
  const[eV,sEV]=useState([800,200,120,100,60,30,60,140,60,50,250,100,0,75,100,50,100,50,0,75,50,0,0,500,0,100,0]);
  const[tab,setTab]=useState("income");const[av,setAv]=useState("yearly");
  const uD=useCallback((i,v)=>sDV(d=>{const c=[...d];c[i]=v;return c;}),[]);
  const uE=useCallback((i,v)=>sEV(d=>{const c=[...d];c[i]=v;return c;}),[]);
  const TMS=[30,25,20,15,10];const sd=STATES[st]||STATES.MI;
  const pR=mo>0?mo/1000:sd.p;
  const flL=fil==="mfj"?"Married Filing Jointly":fil==="single"?"Single":"Head of Household";
  const ltL=lt==="fixed"?`${ty}-Year Fixed`:"7/1 ARM";

  const c=useMemo(()=>{
    const gross=i1+i2+bon+rI+sI+oI;const pretax=k4+hs+oP;const agi=gross-pretax;const sDed=STDDED[fil]||3e4;
    const taxable=Math.max(agi-sDed,0);const fTx=fedTax(taxable,fil);const sTx=stTax(taxable,st);
    const ss=Math.min(i1,176100)*.062+Math.min(i2,176100)*.062;const med=gross*.0145+(gross>25e4?(gross-25e4)*.009:0);
    const fica=ss+med;const totTx=fTx+sTx+fica;const netA=gross-totTx;const netM=netA/12;const grM=gross/12;
    const dpAmt=pr*dp/100;const loan=pr-dpAmt;const rate=(lt==="fixed"?fr:ar)/100;
    const mPI=pmt(rate,ty,loan);const aPT=pr*pR;const mTx=aPT/12;const mIns=ins/12;
    const hasPMI=dp<20;const mPMI=hasPMI?(loan*pm/100)/12:0;const piti=mPI+mTx+mIns+mPMI;
    const mHM=pr*.01/12;const closing=loan*cp/100;
    const totD=dV.reduce((a,b)=>a+b,0);const ec=[...eV];ec[12]=Math.round(mHM);const totE=ec.reduce((a,b)=>a+b,0);
    const totOut=piti+ex+totD+totE;const surplus=netM-totOut;
    const fDTI=grM>0?piti/grM:0;const bDTI=grM>0?(piti+totD)/grM:0;const eRat=netM>0?totOut/netM:0;const hNet=netM>0?piti/netM:0;
    const oth=mTx+mIns+mPMI;
    const mx28P=Math.max(grM*.28-oth,0);const mx28=maxLoan(rate,ty,mx28P)/(1-dp/100);
    const mx45P=Math.max(grM*.45-totD-oth,0);const mx45=maxLoan(rate,ty,mx45P)/(1-dp/100);
    const mxNP=Math.max(netM*.3-oth,0);const mxN=maxLoan(rate,ty,mxNP)/(1-dp/100);
    const am=buildAmort(loan,rate,ty,ex);const inv=buildInv(ex,sr/100,ty);
    const invEnd=inv.length>0?inv[inv.length-1]:{v:0,c:0,g:0};const intSv=am.tiS-am.tiE;
    return{gross,pretax,agi,stdDed:sDed,taxable,fedTx:fTx,stTx:sTx,fica,ss,med,totTx,netA,netM,grM,
      dpAmt,loan,rate,mPI,aPT,mTx,mIns,hasPMI,mPMI,piti,mHM,closing,
      totD,totE,ec,totOut,surplus,extra:ex,fDTI,bDTI,eRat,hNet,mx28,mx45,mxN,
      am,inv,invEnd,intSv};
  },[i1,i2,bon,rI,sI,oI,fil,k4,hs,oP,st,pr,dp,lt,fr,ar,ty,mo,ins,pm,cp,ex,sr,dV,eV,pR]);

  const sC=c.surplus>=0?"#16a34a":"#dc2626";const sB2=c.surplus>=0?"#f0fdf4":"#fef2f2";
  const tabs=[{id:"income",l:"Income",i:"💰"},{id:"mortgage",l:"Mortgage",i:"🏠"},{id:"max",l:"Max Loan",i:"🎯"},{id:"amort",l:"Amortize",i:"📅"},{id:"invest",l:"Invest",i:"📈"},{id:"budget",l:"Budget",i:"📊"},{id:"summary",l:"Summary",i:"✅"}];

  return(<div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"linear-gradient(160deg,#f1f5f9,#e8f0fe,#f0fdf4)",minHeight:"100vh"}}>
    <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",padding:"10px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:14,fontWeight:900,color:"#fff"}}>🏠 Home Affordability Calculator</div>
          <div style={{fontSize:9,color:"#93c5fd",marginTop:1}}>Mortgage, tax & budget analysis • All 50 states + DC</div></div>
        <button onClick={()=>genReport(c,{st,fl:flL,ty,lt:ltL,price:pr,dp,cp,sr})}
          style={{padding:"6px 12px",borderRadius:7,background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",fontSize:9,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 2px 8px #16a34a40"}}>📄 Download Report</button>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,padding:5,background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
      <St label="PITI" value={$(c.piti)} color="#1e40af" bg="#eff6ff" icon="🏡"/>
      <St label="Net Mo" value={$(c.netM)} color="#047857" bg="#ecfdf5" icon="💵"/>
      <St label={c.surplus>=0?"Surplus":"Short"} value={$(c.surplus)} color={sC} bg={sB2} icon={c.surplus>=0?"✅":"⚠️"}/>
      <St label="DTI" value={pc(c.bDTI)} color={c.bDTI<=.45?"#047857":"#dc2626"} bg={c.bDTI<=.45?"#ecfdf5":"#fef2f2"} sub={c.bDTI<=.45?"OK":"High"}/>
    </div>
    <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #e2e8f0",overflowX:"auto"}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:"1 0 auto",padding:"6px 1px",fontSize:8,fontWeight:700,cursor:"pointer",background:tab===t.id?"#1e40af":"transparent",color:tab===t.id?"#fff":"#64748b",border:"none",borderBottom:tab===t.id?"3px solid #3b82f6":"3px solid transparent",whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}
    </div>
    <div style={{padding:10,maxWidth:820,margin:"0 auto"}}>

    {tab==="income"&&<div>
      <Sec title="State & Filing" color="#7c3aed">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
          <div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",color:"#6b7a8d",marginBottom:2}}>State</div>
            <select value={st} onChange={e=>setSt(e.target.value)} style={{width:"100%",padding:"6px",borderRadius:7,border:"2px solid #d1d9e6",fontSize:10,fontWeight:700,color:"#1e40af",background:"#fefdf8",cursor:"pointer"}}>
              {Object.entries(STATES).sort((a,b)=>a[1].n.localeCompare(b[1].n)).map(([k,v])=><option key={k} value={k}>{v.n}{v.t==="none"?" (No Tax)":v.t==="flat"?` (${(v.r*100).toFixed(1)}%)`:""}</option>)}
            </select></div>
          <div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",color:"#6b7a8d",marginBottom:2}}>Filing Status</div>
            <div style={{display:"flex",gap:3}}>{[["mfj","MFJ"],["single","Single"],["hoh","HoH"]].map(([v,l])=>
              <button key={v} onClick={()=>setFil(v)} style={{flex:1,padding:"6px",fontSize:9,fontWeight:700,borderRadius:6,cursor:"pointer",background:fil===v?"#1e40af":"#f1f5f9",color:fil===v?"#fff":"#475569",border:fil===v?"2px solid #1e40af":"2px solid #e2e8f0"}}>{l}</button>)}</div></div>
        </div>
        <div style={{padding:5,borderRadius:5,background:"#faf5ff",border:"1px solid #e9d5ff",fontSize:9,color:"#6b21a8"}}>
          <b>{sd.n}:</b> {sd.t==="none"?"No state income tax":sd.t==="flat"?`${(sd.r*100).toFixed(2)}% flat tax`:"Progressive income tax"} • Avg property tax: {(sd.p*100).toFixed(2)}%
        </div>
      </Sec>
      <Sec title="Household Income" color="#1e40af">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          <I label="Your Salary" value={i1} onChange={sI1}/><I label="Spouse Salary" value={i2} onChange={sI2}/>
          <I label="Bonus" value={bon} onChange={sB}/><I label="Rental/Investment" value={rI} onChange={sRI}/>
          <I label="Side Business" value={sI} onChange={sSI}/><I label="Other" value={oI} onChange={sOI}/>
        </div>
      </Sec>
      <Sec title="Pre-Tax Deductions" color="#7c3aed">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
          <I label="401(k)" value={k4} onChange={sK}/><I label="HSA" value={hs} onChange={sH}/><I label="Other" value={oP} onChange={sOP}/>
        </div>
      </Sec>
      <Sec title="Tax Summary" color="#7c3aed">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
          {[{l:"Federal",v:c.fedTx,s:pc(c.gross>0?c.fedTx/c.gross:0),bg:"#faf5ff",bc:"#e9d5ff",tc:"#5b21b6"},
            {l:sd.n,v:c.stTx,s:sd.t==="none"?"No tax":pc(c.gross>0?c.stTx/c.gross:0),bg:"#fdf4ff",bc:"#f0abfc",tc:"#86198f"},
            {l:"FICA",v:c.fica,s:"SS+Med",bg:"#fff7ed",bc:"#fed7aa",tc:"#9a3412"},
            {l:"Take-Home",v:c.netA,s:$(c.netM)+"/mo",bg:"#f0fdf4",bc:"#bbf7d0",tc:"#15803d"}
          ].map((x,i)=><div key={i} style={{borderRadius:6,padding:5,background:x.bg,border:`1px solid ${x.bc}`,textAlign:"center"}}>
            <div style={{fontSize:8,fontWeight:700,color:x.tc}}>{x.l}</div>
            <div style={{fontSize:13,fontWeight:900,color:x.tc}}>{$(x.v)}</div>
            <div style={{fontSize:8,color:x.tc+"99"}}>{x.s}</div></div>)}
        </div>
        <div style={{marginTop:5,borderRadius:5,padding:4,background:"#1e293b"}}>
          <Br total={c.gross} segs={[{l:"Fed",v:c.fedTx,c:"#7c3aed"},{l:"State",v:c.stTx,c:"#a855f7"},{l:"FICA",v:c.fica,c:"#f97316"},{l:"Take-Home",v:c.netA,c:"#22c55e"}]}/>
          <div style={{textAlign:"center",fontSize:8,fontWeight:700,color:"#94a3b8",marginTop:2}}>Tax: {$(c.totTx)} ({pc(c.gross>0?c.totTx/c.gross:0)}) • Bi-weekly: {$(c.netA/26)}</div>
        </div>
      </Sec>
    </div>}

    {tab==="mortgage"&&<div>
      <Sec title="Purchase & Loan" color="#1e40af">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          <I label="Home Price" value={pr} onChange={setPr} step={5000}/>
          <I label="Down Payment %" value={dp} onChange={setDp} prefix="" suffix="%" step={1}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,padding:5,borderRadius:6,background:"#eff6ff",border:"1px solid #bfdbfe",textAlign:"center",marginBottom:7}}>
          <div><div style={{fontSize:8,color:"#64748b"}}>Down</div><div style={{fontWeight:900,fontSize:12,color:"#1e40af"}}>{$(c.dpAmt)}</div></div>
          <div><div style={{fontSize:8,color:"#64748b"}}>Loan</div><div style={{fontWeight:900,fontSize:12,color:"#1e40af"}}>{$(c.loan)}</div></div>
          <div><div style={{fontSize:8,color:"#64748b"}}>Cash Needed</div><div style={{fontWeight:900,fontSize:12,color:"#c2410c"}}>{$(c.dpAmt+c.closing)}</div></div>
        </div>
        <div style={{marginBottom:6}}><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",color:"#6b7a8d",marginBottom:2}}>Loan Type</div>
          <div style={{display:"flex",gap:3}}>{[["fixed","Fixed"],["arm","7/1 ARM"]].map(([v,l])=>
            <button key={v} onClick={()=>setLt(v)} style={{flex:1,padding:"6px",fontSize:10,fontWeight:700,borderRadius:6,cursor:"pointer",background:lt===v?"#1e40af":"#f1f5f9",color:lt===v?"#fff":"#475569",border:lt===v?"2px solid #1e40af":"2px solid #e2e8f0"}}>{l}</button>)}</div></div>
        <div style={{marginBottom:6}}><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",color:"#6b7a8d",marginBottom:2}}>Loan Term</div>
          <div style={{display:"flex",gap:3}}>{TMS.map(t=>
            <button key={t} onClick={()=>setTy(t)} style={{flex:1,padding:"6px",fontSize:10,fontWeight:700,borderRadius:6,cursor:"pointer",background:ty===t?"#1e40af":"#f1f5f9",color:ty===t?"#fff":"#475569",border:ty===t?"2px solid #1e40af":"2px solid #e2e8f0"}}>{t}yr</button>)}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
          <I label="Fixed Rate" value={fr} onChange={setFr} prefix="" suffix="%" step={.01}/>
          <I label="ARM Rate" value={ar} onChange={setAr} prefix="" suffix="%" step={.01}/>
          <I label="Closing %" value={cp} onChange={setCp} prefix="" suffix="%" step={.5}/>
        </div>
      </Sec>
      <Sec title="Property Tax & Insurance" color="#dc2626">
        <div style={{padding:5,borderRadius:5,background:"#fef2f2",border:"1px solid #fecaca",marginBottom:5,fontSize:9,color:"#991b1b"}}>
          <b>{sd.n} avg: {(sd.p*100).toFixed(2)}%</b> — Override with local millage below (0 = state avg)
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
          <I label="Millage Override" value={mo} onChange={setMo} prefix="" suffix="mills" step={.5} help="0=avg"/>
          <I label="Annual Insurance" value={ins} onChange={setIns} step={100}/>
          {c.hasPMI&&<I label="PMI Rate %" value={pm} onChange={setPm} prefix="" suffix="%" step={.05}/>}
        </div>
      </Sec>
      <Sec title="Monthly PITI" color="#15803d">
        <PR label="Principal & Interest" val={c.mPI} color="#1e40af" bg="#eff6ff"/>
        <PR label="Property Tax" val={c.mTx} color="#dc2626" bg="#fef2f2"/>
        <PR label="Insurance" val={c.mIns} color="#d97706" bg="#fffbeb"/>
        {c.hasPMI&&<PR label="PMI" val={c.mPMI} color="#7c3aed" bg="#faf5ff"/>}
        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",borderRadius:7,background:"#15803d",marginTop:2}}>
          <span style={{fontSize:11,fontWeight:900,color:"#fff"}}>TOTAL PITI</span>
          <span style={{fontSize:17,fontWeight:900,color:"#fff"}}>{$(c.piti)}</span>
        </div>
      </Sec>
    </div>}

    {tab==="max"&&<div>
      <Sec title="Maximum Borrowing Power" color="#059669">
        <div style={{padding:6,borderRadius:6,background:"#ecfdf5",border:"1px solid #a7f3d0",marginBottom:8,fontSize:9,color:"#065f46"}}>
          Based on {$(c.gross)}/yr gross & {$(c.netA)}/yr net at {(c.rate*100).toFixed(2)}% for {ty} yrs, {dp}% down
        </div>
        {[{l:"Conservative: 28% Front-End DTI",v:c.mx28,d:"PITI ≤ 28% of gross. Lender comfort zone.",c:"#059669",bg:"#ecfdf5",bc:"#a7f3d0",mp:c.grM*.28},
          {l:"Aggressive: 45% Back-End DTI",v:c.mx45,d:`PITI + debts (${$(c.totD)}/mo) ≤ 45% gross. Conv. ceiling.`,c:"#d97706",bg:"#fffbeb",bc:"#fcd34d",mp:c.grM*.45-c.totD},
          {l:"Net Income: 30% of Take-Home",v:c.mxN,d:"PITI ≤ 30% of net income. Conservative real-world.",c:"#1e40af",bg:"#eff6ff",bc:"#93c5fd",mp:c.netM*.3}
        ].map((m,i)=><div key={i} style={{borderRadius:8,padding:10,background:m.bg,border:`2px solid ${m.bc}`,marginBottom:6}}>
          <div style={{fontSize:9,fontWeight:800,color:m.c,textTransform:"uppercase"}}>{m.l}</div>
          <div style={{fontSize:8,color:"#64748b",marginTop:1,marginBottom:4}}>{m.d}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,textAlign:"center"}}>
            <div><div style={{fontSize:8,color:"#64748b"}}>Max Home</div><div style={{fontSize:16,fontWeight:900,color:m.c}}>{$(Math.max(m.v,0))}</div></div>
            <div><div style={{fontSize:8,color:"#64748b"}}>Max Loan</div><div style={{fontSize:12,fontWeight:700,color:m.c}}>{$(Math.max(m.v*(1-dp/100),0))}</div></div>
            <div><div style={{fontSize:8,color:"#64748b"}}>Max PITI</div><div style={{fontSize:12,fontWeight:700,color:m.c}}>{$(Math.max(m.mp,0))}</div></div>
          </div>
        </div>)}
        <div style={{padding:6,borderRadius:6,background:"#f8fafc",border:"1px solid #e2e8f0",marginTop:4}}>
          <div style={{fontSize:10,fontWeight:700,color:"#0f172a"}}>Your Target: {$(pr)}</div>
          <div style={{display:"flex",gap:6,fontSize:9,marginTop:3}}>
            {[{l:"28% DTI",v:c.mx28},{l:"45% DTI",v:c.mx45},{l:"30% Net",v:c.mxN}].map((x,i)=>
              <span key={i} style={{color:pr<=x.v?"#16a34a":"#dc2626"}}>{pr<=x.v?"✓":"✗"} {x.l} ({$(x.v)})</span>)}
          </div>
          <div style={{height:10,borderRadius:5,background:"#e2e8f0",marginTop:4,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min(pr/Math.max(c.mx45,1)*100,100)}%`,background:pr<=c.mx28?"#22c55e":pr<=c.mx45?"#f59e0b":"#ef4444",borderRadius:5,transition:"width .3s"}}/>
          </div>
        </div>
      </Sec>
    </div>}

    {tab==="amort"&&<div>
      <Sec title="Extra Payment Impact" color="#4A148C">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          <I label="Extra Monthly Payment" value={ex} onChange={setEx} step={25} help="→ principal"/>
          <div style={{padding:5,borderRadius:6,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
            <div style={{fontSize:8,fontWeight:700,color:"#16a34a",textTransform:"uppercase"}}>Impact</div>
            <div style={{fontSize:11,fontWeight:900,color:"#15803d"}}>{ex>0?`Save ${$(c.intSv)}`:"Enter extra pmt"}</div>
            {ex>0&&<div style={{fontSize:8,color:"#16a34a"}}>Payoff: {(c.am.po/12).toFixed(1)}yr ({((ty*12-c.am.po)/12).toFixed(1)} saved)</div>}
          </div>
        </div>
      </Sec>
      <Sec title={`${ty}-Year Amortization`} color="#1e293b">
        <div style={{display:"flex",gap:3,marginBottom:5}}>
          {[["yearly","Yearly"],["monthly","Monthly"]].map(([v,l])=>
            <button key={v} onClick={()=>setAv(v)} style={{flex:1,padding:"5px",fontSize:9,fontWeight:700,borderRadius:5,cursor:"pointer",background:av===v?"#1e293b":"#f1f5f9",color:av===v?"#fff":"#475569",border:"1px solid #e2e8f0"}}>{l}</button>)}
        </div>
        <div style={{overflowX:"auto",borderRadius:6,border:"1px solid #e2e8f0",maxHeight:480,overflowY:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
            <thead style={{position:"sticky",top:0}}><tr>
              <th style={{...TH,background:"#1e293b"}}>{av==="yearly"?"Year":"Mo"}</th>
              <th style={{...TH,background:"#1e40af"}}>Pmt</th><th style={{...TH,background:"#1e40af"}}>Princ</th>
              <th style={{...TH,background:"#1e40af"}}>Int</th><th style={{...TH,background:"#1e40af"}}>Bal</th>
              {ex>0&&<><th style={{...TH,background:"#4A148C"}}>Extra Bal</th><th style={{...TH,background:"#4A148C"}}>Saved</th></>}
            </tr></thead>
            <tbody>
              {(av==="yearly"
                ?Array.from({length:ty},(_,idx)=>{const s0=idx*12,e0=Math.min(s0+12,c.am.std.length);
                  const sl=c.am.std.slice(s0,e0),el=c.am.ext.slice(s0,e0);
                  return{pd:`Yr ${idx+1}`,pm:sl.reduce((a,s)=>a+s.p,0),pr2:sl.reduce((a,s)=>a+s.pr,0),it:sl.reduce((a,s)=>a+s.it,0),b:sl[sl.length-1]?.b||0,eb:el[el.length-1]?.b||0,sv:(sl[sl.length-1]?.ci||0)-(el[el.length-1]?.ci||0)};})
                :c.am.std.map((s,i)=>({pd:s.m,pm:s.p,pr2:s.pr,it:s.it,b:s.b,eb:c.am.ext[i]?.b||0,sv:s.ci-(c.am.ext[i]?.ci||0)}))
              ).map((r,i)=><tr key={i} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                <td style={TD}>{r.pd}</td><td style={{...TD,textAlign:"right"}}>{$(r.pm)}</td>
                <td style={{...TD,textAlign:"right",color:"#1e40af"}}>{$(r.pr2)}</td>
                <td style={{...TD,textAlign:"right",color:"#dc2626"}}>{$(r.it)}</td>
                <td style={{...TD,textAlign:"right",fontWeight:700}}>{$(r.b)}</td>
                {ex>0&&<><td style={{...TD,textAlign:"right",color:"#4A148C",fontWeight:700}}>{$(r.eb)}</td>
                <td style={{...TD,textAlign:"right",color:"#16a34a",fontWeight:700}}>{$(r.sv)}</td></>}
              </tr>)}
            </tbody>
          </table>
        </div>
      </Sec>
    </div>}

    {tab==="invest"&&<div>
      <Sec title="Pay Down vs Invest" color="#F57F17">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:6}}>
          <I label="Extra Monthly" value={ex} onChange={setEx} step={25}/>
          <I label="Market Return %" value={sr} onChange={setSr} prefix="" suffix="%" step={.5} help="S&P ~10%"/>
        </div>
        {ex>0?<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:6}}>
            <div style={{borderRadius:7,padding:8,background:"#f0fdf4",border:"2px solid #16a34a",textAlign:"center"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#16a34a"}}>PAY DOWN</div>
              <div style={{fontSize:18,fontWeight:900,color:"#15803d"}}>{$(c.intSv)}</div>
              <div style={{fontSize:8,color:"#16a34a"}}>Interest saved • {(c.rate*100).toFixed(2)}% guaranteed</div>
            </div>
            <div style={{borderRadius:7,padding:8,background:"#fffbeb",border:"2px solid #f59e0b",textAlign:"center"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#d97706"}}>INVEST</div>
              <div style={{fontSize:18,fontWeight:900,color:"#92400e"}}>{$(c.invEnd.v)}</div>
              <div style={{fontSize:8,color:"#d97706"}}>Portfolio yr {ty} • Gains: {$(c.invEnd.g)}</div>
            </div>
          </div>
          <div style={{borderRadius:7,padding:6,background:c.invEnd.v>c.intSv?"#fffbeb":"#f0fdf4",border:`2px solid ${c.invEnd.v>c.intSv?"#f59e0b":"#16a34a"}`,textAlign:"center",marginBottom:6}}>
            <div style={{fontSize:10,fontWeight:900,color:c.invEnd.v>c.intSv?"#92400e":"#15803d"}}>
              {c.invEnd.v>c.intSv?`📈 Investing wins by ${$(c.invEnd.v-c.intSv)}`:`🏠 Paying down wins by ${$(c.intSv-c.invEnd.v)}`}
            </div>
          </div>
          <div style={{overflowX:"auto",borderRadius:6,border:"1px solid #e2e8f0",maxHeight:380,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
              <thead style={{position:"sticky",top:0}}><tr>
                <th style={{...TH,background:"#1e293b"}}>Yr</th>
                <th style={{...TH,background:"#F57F17"}}>Invested</th><th style={{...TH,background:"#F57F17"}}>Portfolio</th><th style={{...TH,background:"#F57F17"}}>Gains</th>
                <th style={{...TH,background:"#16a34a"}}>Std Bal</th><th style={{...TH,background:"#16a34a"}}>Ext Bal</th>
              </tr></thead>
              <tbody>{c.inv.map((v,i)=>{const ye=(i+1)*12-1;const sb=c.am.std[Math.min(ye,c.am.std.length-1)]?.b||0;const eb=c.am.ext[Math.min(ye,c.am.ext.length-1)]?.b||0;
                return<tr key={i} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                  <td style={TD}>{v.y}</td><td style={{...TD,textAlign:"right"}}>{$(v.c)}</td>
                  <td style={{...TD,textAlign:"right",color:"#92400e",fontWeight:700}}>{$(v.v)}</td>
                  <td style={{...TD,textAlign:"right",color:"#d97706"}}>{$(v.g)}</td>
                  <td style={{...TD,textAlign:"right"}}>{$(sb)}</td>
                  <td style={{...TD,textAlign:"right",color:"#4A148C",fontWeight:700}}>{$(eb)}</td>
                </tr>;})}</tbody>
            </table>
          </div>
        </>:<div style={{padding:14,textAlign:"center",borderRadius:7,background:"#f8fafc",border:"1px solid #e2e8f0"}}>
          <div style={{fontSize:26}}>💰</div><div style={{fontSize:11,fontWeight:700,color:"#475569",marginTop:3}}>Enter extra payment to compare</div>
        </div>}
      </Sec>
    </div>}

    {tab==="budget"&&<div>
      <Sec title="Obligated Debts" color="#dc2626">
        {dL.map((l,i)=><DR key={i} label={l} value={dV[i]} onChange={v=>uD(i,v)}/>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"4px 7px",borderRadius:6,background:"#fef2f2",border:"1px solid #fecaca",marginTop:2}}>
          <span style={{fontSize:10,fontWeight:700,color:"#dc2626"}}>Total Debts</span>
          <span style={{fontSize:11,fontWeight:900,color:"#dc2626"}}>{$(c.totD)}</span>
        </div>
      </Sec>
      <Sec title="Discretionary Expenses" color="#d97706">
        {eL.map((l,i)=>i===12
          ?<div key={i} style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}>
            <span style={{flex:1,fontSize:10,color:"#16a34a",fontWeight:600}}>{l} (1% home/yr)</span>
            <span style={{fontSize:10,fontWeight:700,color:"#16a34a",width:88,textAlign:"right"}}>{$(c.mHM)}/mo</span></div>
          :<DR key={i} label={l} value={eV[i]} onChange={v=>uE(i,v)}/>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"4px 7px",borderRadius:6,background:"#fff7ed",border:"1px solid #fed7aa",marginTop:2}}>
          <span style={{fontSize:10,fontWeight:700,color:"#d97706"}}>Total Discretionary</span>
          <span style={{fontSize:11,fontWeight:900,color:"#d97706"}}>{$(c.totE)}</span>
        </div>
      </Sec>
    </div>}

    {tab==="summary"&&<div>
      <Sec title="Cash Flow" color="#0f172a">
        {[{l:"Net Income",v:c.netM,c:"#16a34a",bg:"#ecfdf5",s:""},
          {l:"Housing (PITI)",v:c.piti,c:"#1e40af",bg:"#eff6ff",s:"−"},
          ...(ex>0?[{l:"Extra Pmt",v:ex,c:"#4A148C",bg:"#faf5ff",s:"−"}]:[]),
          {l:"Debts",v:c.totD,c:"#dc2626",bg:"#fef2f2",s:"−"},
          {l:"Discretionary",v:c.totE,c:"#d97706",bg:"#fff7ed",s:"−"}
        ].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 7px",borderRadius:6,background:r.bg,marginBottom:2}}>
          <span style={{fontSize:10,fontWeight:600,color:r.c}}>{r.l}</span>
          <span style={{fontSize:11,fontWeight:700,color:r.c}}>{r.s}{$(r.v)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",borderRadius:7,background:sB2,border:`2px solid ${sC}`,marginTop:2}}>
          <span style={{fontSize:11,fontWeight:900,color:sC}}>{c.surplus>=0?"✅ Surplus":"⚠️ Shortfall"}</span>
          <span style={{fontSize:16,fontWeight:900,color:sC}}>{$(c.surplus)}/mo</span>
        </div>
      </Sec>
      <Sec title="Breakdown" color="#475569">
        <Br total={c.netM} segs={[{l:"Housing",v:c.piti+ex,c:"#3b82f6"},{l:"Debts",v:c.totD,c:"#ef4444"},{l:"Living",v:c.totE,c:"#f59e0b"},...(c.surplus>0?[{l:"Buffer",v:c.surplus,c:"#22c55e"}]:[])]}/>
      </Sec>
      <Sec title="Ratios" color="#7c3aed">
        {[{l:"Front-End DTI (Housing ÷ Gross)",v:c.fDTI,t:.28,d:"≤ 28%"},
          {l:"Back-End DTI (Housing+Debts ÷ Gross)",v:c.bDTI,t:.45,d:"≤ 45%"},
          {l:"Housing-to-Net",v:c.hNet,t:.30,d:"≤ 30%"},
          {l:"Expense-to-Net",v:c.eRat,t:.85,d:"≤ 85%"}
        ].map((r,i)=>{const ok=r.v<=r.t;return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 7px",borderRadius:6,background:ok?"#f0fdf4":"#fef2f2",border:`1px solid ${ok?"#bbf7d0":"#fecaca"}`,marginBottom:2}}>
          <div><div style={{fontSize:10,fontWeight:700,color:ok?"#16a34a":"#dc2626"}}>{r.l}</div><div style={{fontSize:8,color:"#94a3b8"}}>{r.d}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:ok?"#16a34a":"#dc2626"}}>{pc(r.v)}</div><div style={{fontSize:9}}>{ok?"✓":"⚠"}</div></div>
        </div>;})}
      </Sec>
      <Sec title="Cash Needed" color="#0f172a">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,textAlign:"center"}}>
          <div style={{borderRadius:6,padding:5,background:"#eff6ff"}}><div style={{fontSize:8,color:"#64748b"}}>Down</div><div style={{fontSize:12,fontWeight:900,color:"#1e40af"}}>{$(c.dpAmt)}</div></div>
          <div style={{borderRadius:6,padding:5,background:"#fff7ed"}}><div style={{fontSize:8,color:"#64748b"}}>Closing</div><div style={{fontSize:12,fontWeight:900,color:"#c2410c"}}>{$(c.closing)}</div></div>
          <div style={{borderRadius:6,padding:5,background:"#faf5ff"}}><div style={{fontSize:8,color:"#64748b"}}>Total</div><div style={{fontSize:12,fontWeight:900,color:"#7c3aed"}}>{$(c.dpAmt+c.closing)}</div></div>
        </div>
        <div style={{marginTop:4,borderRadius:6,padding:5,background:"#fffbeb",border:"1px solid #fcd34d",textAlign:"center"}}>
          <div style={{fontSize:8,color:"#92400e"}}>6-Mo Emergency Fund</div>
          <div style={{fontSize:12,fontWeight:900,color:"#92400e"}}>{$(c.totOut*6)}</div>
        </div>
      </Sec>
      <div style={{textAlign:"center",marginTop:6}}>
        <button onClick={()=>genReport(c,{st,fl:flL,ty,lt:ltL,price:pr,dp,cp,sr})}
          style={{padding:"8px 20px",borderRadius:8,background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",fontSize:11,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 2px 10px #16a34a40"}}>
          📄 Download Full Report
        </button>
        <div style={{fontSize:8,color:"#94a3b8",marginTop:3}}>Downloads HTML — open and Print → Save as PDF</div>
      </div>
      <div style={{borderRadius:6,padding:6,fontSize:8,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#94a3b8",marginTop:8}}>
        <b>Disclaimer:</b> Estimates only. Consult mortgage professional & tax advisor. State rates approximate. Property tax uses state average — varies by county. Investment returns not guaranteed.
      </div>
    </div>}

    </div>
  </div>);
}

const TH={padding:"4px 5px",textAlign:"center",color:"#fff",fontSize:8,fontWeight:700,textTransform:"uppercase",whiteSpace:"nowrap"};
const TD={padding:"3px 5px",borderBottom:"1px solid #f1f5f9",fontSize:9};
