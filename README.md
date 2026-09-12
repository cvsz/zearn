# ZEARN

[![CI](https://github.com/cvsz/zearn/actions/workflows/ci.yml/badge.svg)](https://github.com/cvsz/zearn/actions/workflows/ci.yml)
[![CodeQL](https://github.com/cvsz/zearn/actions/workflows/codeql.yml/badge.svg)](https://github.com/cvsz/zearn/actions/workflows/codeql.yml)
[![Dependency Review](https://github.com/cvsz/zearn/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/cvsz/zearn/actions/workflows/dependency-review.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](backend/requirements.txt)
[![React + TypeScript](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-3178C6.svg)](frontend/package.json)
[![Execution: Paper Only](https://img.shields.io/badge/Execution-Paper%20Only-orange.svg)](docs/production-readiness.md)
[![Live Funds: Locked](https://img.shields.io/badge/Live%20Funds-Locked-critical.svg)](docs/production-readiness.md)

**Autonomous wallet intelligence + paper copy-trading control plane**

ZEARN analyzes blockchain wallet behavior, ranks candidate wallets, generates risk-scored signals, simulates copy trades, and exposes all operating controls through a dashboard. The repository is intentionally **paper-trading first**. Live execution is blocked in the baseline until custody, signer isolation, simulation, risk enforcement, and operational approvals are implemented and evidenced.

> Historical wallet performance is not a guarantee of future returns. ZEARN must not be marketed as lossless or guaranteed-profit software.

## Control panel pages

- Overview — runtime state, equity, PnL, wallet count, positions, production gates
- Smart Wallets — leaderboard, score, win rate, realized PnL, max drawdown
- Signals — normalized wallet-copy signal queue
- Paper Trades — simulated fills, fees, slippage and realized PnL
- Portfolio — balances, exposure, attribution and drawdown
- Risk — position, daily-loss, drawdown, liquidity and slippage limits
- Execution — live-mode gate, kill switch and execution-state controls
- Alerts — risk/RPC/contract/slippage incident feed
- Audit Log — operator/system event trail
- Settings — RPC, scanner cadence, notifications and non-secret preferences

## Stack

- Backend: Python 3.12 + FastAPI
- Chain integration target: Web3/EVM, starting with BSC/BNB + USDT
- Frontend: React + TypeScript + Vite
- Runtime: Docker Compose baseline
- CI: Ruff, Pytest, TypeScript/Vite build, container build

## Safe defaults

- mode: `paper`
- trading enabled: `false`
- kill switch: `true`
- live execution API: blocked with HTTP 403

These defaults are also covered by backend tests.

## Run locally

```bash
docker compose up --build
```

Dashboard: `http://localhost:8080`
API: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

## Development

Backend:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn app.main:app --app-dir backend --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

When running Vite directly, configure a development proxy or use the Docker Compose path so `/api` reaches the backend.

## Architecture

```text
Chain RPC / Indexer
        |
        v
Wallet ingestion -> Wallet profiler -> Risk scorer -> Signal engine
                                              |
                                              v
                                      Paper execution engine
                                              |
                         +--------------------+--------------------+
                         v                    v                    v
                    Portfolio             Alerts              Audit log
                         \                    |                    /
                          +---------- FastAPI control plane -----+
                                           |
                                           v
                                   React control panel
```

Planned production components include PostgreSQL, Redis queues, chain indexers, persistent audit/event storage, replayable paper fills, signer isolation, allowlists, transaction simulation, nonce/reorg management, metrics/tracing, alert routing, backups and rollback/DR evidence.

## Production gates before live execution

1. Deterministic wallet PnL accounting and survivorship-bias controls.
2. Fee, gas, spread and slippage-aware paper trading with sufficient observation history.
3. Token/contract risk screening and minimum-liquidity enforcement.
4. Isolated transaction signer; no private key exposed to browser or AI agent.
5. Server-side max-position, max-daily-loss and max-drawdown enforcement.
6. Idempotent order lifecycle, nonce handling, reorg handling and transaction simulation.
7. Authentication, RBAC and immutable operator audit trail.
8. Monitoring, alerts, backups, rollback and incident-response runbooks.
9. Security review of dependencies, containers, RPC trust boundaries and secret management.
10. Explicit operator approval to unlock live mode.

## Current status

This branch establishes the application baseline and control plane. It is **not yet production-ready for live funds**. The current execution mode is intentionally paper-only.

## Agent instructions

AI coding agents working in this repository must follow [`AGENTS.md`](AGENTS.md). Safety invariants, live-funds restrictions, validation requirements, and scope rules in that file are mandatory.

## License

MIT. See `LICENSE`.
