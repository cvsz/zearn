import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Bot, Gauge, ListChecks, LockKeyhole, Settings, Shield, SlidersHorizontal, WalletCards } from 'lucide-react';

type Page = 'Overview'|'Smart Wallets'|'Signals'|'Paper Trades'|'Portfolio'|'Risk'|'Execution'|'Alerts'|'Audit Log'|'Settings';

type Overview = {mode:string;trading_enabled:boolean;kill_switch:boolean;tracked_wallets:number;paper_equity_usd:number;paper_pnl_usd:number;open_positions:number;alerts:string[]};

type Wallet = {address:string;score:number;win_rate:number;realized_pnl_usd:number;max_drawdown_pct:number};

const pages: {name:Page; icon:any}[] = [
  {name:'Overview',icon:Gauge},{name:'Smart Wallets',icon:WalletCards},{name:'Signals',icon:Activity},
  {name:'Paper Trades',icon:Bot},{name:'Portfolio',icon:BarChart3},{name:'Risk',icon:Shield},
  {name:'Execution',icon:LockKeyhole},{name:'Alerts',icon:AlertTriangle},{name:'Audit Log',icon:ListChecks},{name:'Settings',icon:Settings}
];

const api = (path:string) => fetch(path).then(r=>{if(!r.ok) throw new Error(`${r.status}`); return r.json()});

export default function App(){
  const [page,setPage]=useState<Page>('Overview');
  const [overview,setOverview]=useState<Overview|null>(null);
  const [wallets,setWallets]=useState<Wallet[]>([]);
  const [signals,setSignals]=useState<any[]>([]);
  const [risk,setRisk]=useState<any>(null);
  const [audit,setAudit]=useState<any[]>([]);
  const [error,setError]=useState('');

  const refresh=()=>Promise.all([
    api('/api/overview').then(setOverview),api('/api/wallets').then(setWallets),api('/api/signals').then(setSignals),api('/api/risk').then(setRisk),api('/api/audit').then(setAudit)
  ]).catch(()=>setError('API unavailable — start the backend or use docker compose.'));
  useEffect(()=>{refresh()},[]);

  const title=useMemo(()=>page,[page]);
  return <div className="app">
    <aside><div className="brand"><div className="mark">Z</div><div><strong>ZEARN</strong><span>Control Plane</span></div></div>
      <nav>{pages.map(({name,icon:Icon})=><button key={name} className={page===name?'active':''} onClick={()=>setPage(name)}><Icon size={17}/>{name}</button>)}</nav>
      <div className="safety"><Shield size={18}/><div><b>SAFE MODE</b><span>Paper only · Kill switch ON</span></div></div>
    </aside>
    <main><header><div><span className="eyebrow">AUTONOMOUS WALLET INTELLIGENCE</span><h1>{title}</h1></div><div className="status"><i></i> PAPER MODE</div></header>
      {error&&<div className="notice">{error}</div>}
      {page==='Overview'&&<OverviewPage o={overview}/>} 
      {page==='Smart Wallets'&&<WalletsPage wallets={wallets}/>} 
      {page==='Signals'&&<SignalsPage signals={signals}/>} 
      {page==='Paper Trades'&&<Empty title="Paper Trade Ledger" text="Simulation executions, fees, slippage and realized PnL appear here. No live orders are sent."/>}
      {page==='Portfolio'&&<Empty title="Portfolio" text="Paper balances, exposures, allocation, PnL attribution and drawdown analytics."/>}
      {page==='Risk'&&<RiskPage risk={risk}/>} 
      {page==='Execution'&&<ExecutionPage overview={overview} refresh={refresh}/>} 
      {page==='Alerts'&&<Empty title="Alerts" text="Risk breaches, RPC degradation, abnormal slippage, contract-risk warnings and execution blocks."/>}
      {page==='Audit Log'&&<AuditPage audit={audit}/>} 
      {page==='Settings'&&<Empty title="Settings" text="Chain RPCs, scanner cadence, notification providers and operator preferences. Secrets must stay server-side."/>}
    </main>
  </div>
}

function OverviewPage({o}:{o:Overview|null}){const cards=[['Paper Equity',`$${o?.paper_equity_usd?.toFixed(2)??'—'}`],['Paper PnL',`$${o?.paper_pnl_usd?.toFixed(2)??'—'}`],['Tracked Wallets',o?.tracked_wallets??'—'],['Open Positions',o?.open_positions??'—']];return <><div className="hero"><div><span>Execution state</span><h2>Observation + simulation first.</h2><p>Wallet intelligence can generate signals, but the baseline cannot submit live trades.</p></div><div className="pill danger">KILL SWITCH {o?.kill_switch?'ON':'OFF'}</div></div><section className="cards">{cards.map(([k,v])=><article key={String(k)}><span>{k}</span><strong>{v}</strong></article>)}</section><section className="panel"><h3>Production Gates</h3><div className="gates"><Gate text="Paper-trading evidence"/><Gate text="Slippage + fee model"/><Gate text="Contract/token safety checks"/><Gate text="Custody / signer isolation"/><Gate text="Daily-loss + drawdown enforcement"/><Gate text="Rollback + incident runbook"/></div></section></>}
function WalletsPage({wallets}:{wallets:Wallet[]}){return <section className="panel"><div className="panelHead"><div><h3>Smart Wallet Leaderboard</h3><p>Ranked from observed historical behavior. Scores do not imply future profit.</p></div></div><table><thead><tr><th>Wallet</th><th>Score</th><th>Win rate</th><th>Realized PnL</th><th>Max DD</th></tr></thead><tbody>{wallets.map(w=><tr key={w.address}><td className="mono">{w.address}</td><td><b>{w.score}</b>/100</td><td>{(w.win_rate*100).toFixed(1)}%</td><td>${w.realized_pnl_usd.toFixed(2)}</td><td>{w.max_drawdown_pct}%</td></tr>)}</tbody></table></section>}
function SignalsPage({signals}:{signals:any[]}){return <section className="panel"><h3>Signal Queue</h3><table><thead><tr><th>ID</th><th>Chain</th><th>Pair</th><th>Side</th><th>Confidence</th><th>Status</th></tr></thead><tbody>{signals.map(s=><tr key={s.id}><td className="mono">{s.id}</td><td>{s.chain}</td><td>{s.pair}</td><td>{s.side}</td><td>{(s.confidence*100).toFixed(0)}%</td><td><span className="pill">{s.status}</span></td></tr>)}</tbody></table></section>}
function RiskPage({risk}:{risk:any}){return <section className="panel"><h3>Risk Envelope</h3><div className="riskgrid">{risk&&Object.entries(risk).map(([k,v])=><div key={k}><SlidersHorizontal size={16}/><span>{k.replaceAll('_',' ')}</span><strong>{String(v)}</strong></div>)}</div><p className="muted">Server-side enforcement is authoritative; UI controls are not a security boundary.</p></section>}
function ExecutionPage({overview,refresh}:{overview:Overview|null;refresh:()=>void}){const trip=async()=>{await fetch('/api/runtime/kill-switch?enabled=true',{method:'POST'});refresh()};return <section className="panel critical"><LockKeyhole size={28}/><h3>Live Execution Locked</h3><p>This baseline intentionally rejects live mode. Before enabling it, implement isolated signing, allowlisted routers/tokens, simulation, idempotency, nonce management, slippage controls, chain reorg handling and operational approval.</p><button className="kill" onClick={trip}>TRIP KILL SWITCH</button><div className="kv"><span>Mode</span><b>{overview?.mode??'—'}</b><span>Trading enabled</span><b>{String(overview?.trading_enabled??false)}</b><span>Kill switch</span><b>{String(overview?.kill_switch??true)}</b></div></section>}
function AuditPage({audit}:{audit:any[]}){return <section className="panel"><h3>Immutable Audit Feed (baseline view)</h3>{audit.map((a,i)=><div className="audit" key={i}><span className="mono">{a.time}</span><b>{a.event}</b><span>{a.actor}</span><span>{a.result}</span></div>)}</section>}
function Empty({title,text}:{title:string;text:string}){return <section className="panel empty"><h3>{title}</h3><p>{text}</p></section>}
function Gate({text}:{text:string}){return <div><span className="dot"></span>{text}<b>REQUIRED</b></div>}
