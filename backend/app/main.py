from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="ZEARN Control Plane", version="0.1.0")

Mode = Literal["paper", "live"]

class RiskConfig(BaseModel):
    max_position_usd: float = Field(50, gt=0)
    max_daily_loss_usd: float = Field(20, gt=0)
    max_drawdown_pct: float = Field(10, gt=0, le=100)
    min_liquidity_usd: float = Field(50000, gt=0)
    max_slippage_bps: int = Field(100, ge=1, le=5000)

class RuntimeState(BaseModel):
    mode: Mode = "paper"
    trading_enabled: bool = False
    kill_switch: bool = True
    risk: RiskConfig = RiskConfig()

STATE = RuntimeState()

WALLETS = [
    {"address": "0x1111...demo", "score": 92, "win_rate": 0.68, "realized_pnl_usd": 1842.31, "max_drawdown_pct": 8.4},
    {"address": "0x2222...demo", "score": 87, "win_rate": 0.63, "realized_pnl_usd": 1298.72, "max_drawdown_pct": 10.2},
]

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

@app.get("/api/overview")
def overview():
    return {
        "mode": STATE.mode,
        "trading_enabled": STATE.trading_enabled,
        "kill_switch": STATE.kill_switch,
        "tracked_wallets": len(WALLETS),
        "paper_equity_usd": 300.0,
        "paper_pnl_usd": 0.0,
        "open_positions": 0,
        "alerts": [],
    }

@app.get("/api/wallets")
def wallets():
    return WALLETS

@app.get("/api/risk")
def get_risk():
    return STATE.risk

@app.put("/api/risk")
def set_risk(config: RiskConfig):
    STATE.risk = config
    return STATE.risk

@app.post("/api/runtime/kill-switch")
def kill_switch(enabled: bool = True):
    STATE.kill_switch = enabled
    if enabled:
        STATE.trading_enabled = False
    return STATE

@app.post("/api/runtime/mode")
def set_mode(mode: Mode):
    if mode == "live":
        raise HTTPException(status_code=403, detail="Live execution is intentionally disabled in the baseline. Complete broker/wallet custody, simulation, and production risk review first.")
    STATE.mode = mode
    return STATE

@app.get("/api/signals")
def signals():
    return [
        {"id": "sig-demo-1", "wallet": WALLETS[0]["address"], "chain": "bsc", "pair": "BNB/USDT", "side": "BUY", "confidence": 0.81, "status": "paper-only"}
    ]

@app.get("/api/audit")
def audit():
    return [{"time": datetime.now(timezone.utc).isoformat(), "event": "baseline_running", "actor": "system", "result": "paper-only"}]
