# Production Readiness

ZEARN is paper-only until every live-funds gate below is evidenced.

## P0 — must exist before any live execution

- AuthN/AuthZ with operator RBAC
- Server-side kill switch and trading-state persistence
- Isolated signing boundary; browser and AI agents never receive private keys
- Allowlisted chains, routers, tokens, quote assets, recipients and spend limits
- Transaction simulation before signing
- Position, daily-loss, drawdown, liquidity and slippage enforcement
- Idempotent intent/order/transaction lifecycle
- Nonce management, replacement transaction policy and reorg handling
- Persistent append-only audit trail
- Paper engine accounting gas, spread, slippage and failed transactions
- Token/contract risk screening
- Metrics, health/readiness, structured logs and critical alerts
- Backup/restore and rollback procedures exercised

## P1 — required for production quality

- PostgreSQL persistence and migrations
- Redis-backed queues with retries and dead-letter handling
- Chain ingestion checkpoints and replay
- Wallet scoring resistant to survivorship bias, wash trading and insufficient sample size
- Backtesting with out-of-sample periods
- Portfolio exposure and correlation limits
- Rate limits and RPC failover
- SLOs, dashboards and incident runbooks
- SBOM, image scanning and signed releases
- Dependency pinning and lockfiles

## P2 — scale / enterprise

- Multi-tenant isolation and tenant-level limits
- Approval workflows for high-risk configuration changes
- Hardware/KMS-backed signing option
- HA database/cache, disaster-recovery objectives and restore drills
- Multi-chain adapters with uniform execution semantics
- Policy-as-code for deployment and runtime controls

## Evidence rule

A checkbox is not evidence. A gate is considered complete only when implementation, automated tests and operational evidence exist together. Live funds must remain disabled otherwise.
