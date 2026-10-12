import { useEffect, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { publicRows, publicState } from './adminBridge.js';
import { useAdminBridge } from './useAdminBridge.js';
import './promotion-carousel.css';

const defaults = [
  {id:'learn',title:'Build your next big idea',copy:'Discover workshops and campus events.',destination:'/webapp/events',tag:'Campus spotlight'},
  {id:'connect',title:'Great things start with a connection',copy:'Meet your alumni and faculty community.',destination:'/webapp/network',tag:'Community spotlight'},
  {id:'grow',title:'Make your next move',copy:'Explore opportunities within your network.',destination:'/webapp/jobs',tag:'Career spotlight'},
];
export function PromotionCarousel({authRole,onOpen}) {
  useAdminBridge();
  const state=publicState();
  const ads=state?.campaigns ? publicRows('campaigns',[],state).filter(c=>c.audience==='all'||c.audience===authRole).sort((a,b)=>a.priority-b.priority) : defaults;
  const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false);
  const active=ads.length ? index % ads.length : 0;
  useEffect(()=>{if(paused||hover||ads.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setIndex(i=>i+1),6000);return()=>clearInterval(timer);},[paused,hover,ads.length]);
  if(!ads.length)return null;
  const ad=ads[active];
  return <section className="promotion" aria-label="Campus promotions" aria-roledescription="carousel" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocus={()=>setHover(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHover(false);}}>
    <a className={`promotion-slide promotion-color-${active%3}`} href={ad.destination} onClick={e=>{if(onOpen?.(ad.destination))e.preventDefault();}} aria-label={`${ad.title} — ${ad.copy}`}>
      {ad.image && <img className="promotion-image" src={ad.image} alt=""/>}
      <div className="promotion-copy"><span className="promotion-label">{ad.tag || 'Sponsored · Campus promotion'}</span><strong>{ad.title}</strong><p>{ad.copy}</p></div><ArrowUpRight className="promotion-arrow" aria-hidden="true"/>
    </a>
    {ads.length>1 && <div className="promotion-controls"><div role="group" aria-label="Choose promotion">{ads.map((a,i)=><button key={a.id} aria-label={`Show promotion ${i+1}: ${a.title}`} aria-current={i===active?'true':undefined} onClick={()=>setIndex(i)}><span/></button>)}</div><button onClick={()=>setPaused(v=>!v)} aria-label={paused?'Play promotions':'Pause promotions'}>{paused?<Play size={13}/>:<Pause size={13}/>}</button></div>}
  </section>;
}
