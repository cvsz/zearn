# AGENTS.md — ZEARN Agent Operating Rules

This file defines mandatory operating rules for AI coding agents working in `cvsz/zearn`.

## Mission

Build ZEARN into a production-grade wallet-intelligence and paper copy-trading platform with verifiable safety controls, reproducible engineering practices, and explicit evidence before any live-funds capability is enabled.

Do not optimize for speed at the expense of correctness, security, auditability, or financial-risk containment.

## Non-negotiable safety invariants

The following defaults must remain true unless a separately reviewed production-live change explicitly proves every required gate:

- runtime mode defaults to `paper`
- `trading_enabled` defaults to `false`
- kill switch defaults to `true`
- live execution requests remain blocked
- no private key, seed phrase, signing secret, exchange withdrawal secret, or unrestricted execution credential may be exposed to the browser, frontend bundle, logs, tests, fixtures, prompts, or AI agents
- no code may claim guaranteed profit, lossless performance, or a never-down equity curve
- historical wallet performance must not be represented as evidence of future returns
- production-readiness status must be evidence-based

If a requested change conflicts with these invariants, preserve the invariants and document the blocker.

## Scope hierarchy

Work in this order unless an issue or approved task says otherwise:

1. security and live-funds containment
2. deterministic accounting and data correctness
3. risk enforcement
4. chain ingestion correctness and replayability
5. paper execution fidelity
6. authentication, RBAC, and auditability
7. observability and operational resilience
8. dashboard/control-plane usability
9. performance optimization
10. optional strategy features

## Architecture expectations

Current baseline:

- backend: Python 3.12 + FastAPI
- frontend: React + TypeScript + Vite
- deployment baseline: Docker Compose
- chain target: EVM, beginning with BSC/BNB + USDT
- execution mode: paper only

Planned production components include PostgreSQL, Redis, replayable chain ingestion, deterministic wallet PnL accounting, persistent paper fills, token/contract risk screening, isolated signer infrastructure, transaction simulation, idempotent order lifecycle, nonce/reorg handling, observability, backup/restore, rollback, and incident-response evidence.

Prefer clear service boundaries over hidden coupling.

## Required control-panel surfaces

Agents must preserve or improve the following product areas:

- Overview
- Smart Wallets
- Signals
- Paper Trades
- Portfolio
- Risk
- Execution
- Alerts
- Audit Log
- Settings

New backend capabilities that materially affect operators should expose corresponding control-plane visibility when appropriate.

## Financial and risk-engine rules

Any portfolio or execution feature must account for relevant real-world costs and constraints, including where applicable:

- gas
- spread
- slippage
- price impact
- failed transactions
- partial fills
- liquidity
- token taxes or transfer restrictions
- RPC latency/failure
- chain reorgs
- stale pricing
- duplicate/replayed events

Do not use raw win rate as the sole wallet-quality metric. Prefer realized PnL, drawdown, sample size, consistency, exposure concentration, liquidity quality, holding duration, and data confidence.

Guard against survivorship bias, look-ahead bias, wash trading, self-transfers, internal routing wallets, market-maker behavior, airdrop distortions, and suspicious insider-like activity.

## Live-execution gate

Live execution must not be enabled merely because code exists.

Before any production-live unlock, evidence must exist for all of the following:

1. deterministic wallet and portfolio accounting
2. fee/gas/spread/slippage-aware paper execution with sufficient observation history
3. token and contract safety screening
4. minimum-liquidity and exposure enforcement
5. isolated signer/custody boundary
6. server-side max-position, max-daily-loss, and max-drawdown controls
7. transaction simulation before signing/broadcast
8. idempotent order lifecycle
9. nonce, replacement, timeout, and reorg handling
10. authentication and RBAC
11. immutable or append-only operator audit trail
12. metrics, alerts, incident response, backups, restore testing, and rollback evidence
13. dependency/container/secret/RPC trust-boundary security review
14. explicit human operator approval

Until all gates are evidenced, keep live mode locked.

## Secrets and credentials

Never commit secrets.

Do not add:

- `.env` files containing credentials
- private keys
- mnemonic/seed phrases
- API secrets
- JWT signing secrets
- RPC credentials with sensitive privileges
- cloud credentials
- signing material

Use environment-variable names and documented placeholders only.

Example values must be obviously non-secret.

## Backend rules

For Python/FastAPI changes:

- keep API behavior explicit and typed
- validate external input
- fail closed for risk-sensitive operations
- avoid mutable process-local state for data that must survive restart
- make financial calculations deterministic and testable
- keep side effects behind clear service interfaces
- add tests for new risk-sensitive behavior
- preserve health endpoints
- do not weaken live-mode blocking tests

When persistent state is introduced, use migrations and documented rollback paths.

## Frontend rules

For React/TypeScript changes:

- never put secrets or signing material in frontend code
- clearly distinguish simulated/paper results from live execution
- visibly surface kill-switch, execution mode, stale-data, and degraded-service states
- do not visually imply profitability guarantees
- risk controls must not be hidden behind cosmetic-only UI state
- server-side enforcement is authoritative

## Chain-ingestion rules

Blockchain ingestion must be replayable and idempotent.

Prefer:

- durable checkpoints
- deterministic block/transaction/log identifiers
- deduplication
- reorg-aware confirmation policy
- gap detection
- bounded retries
- dead-letter handling for persistent failures
- observability for lag and RPC degradation

Never assume a single RPC response is permanently final.

## Testing requirements

At minimum, preserve and run the checks relevant to the change:

```bash
ruff check backend
PYTHONPATH=backend pytest -q backend/tests
cd frontend && npm ci && npm run build
```

For container/deployment changes also validate:

```bash
docker compose build
```

Add targeted tests for:

- risk limit enforcement
- kill-switch behavior
- live-mode denial
- accounting logic
- duplicate/replay handling
- failure paths
- permission boundaries

Do not remove or weaken tests merely to make CI pass.

## CI and supply-chain rules

Keep GitHub Actions least-privileged.

Do not:

- broaden workflow permissions without need
- disable CodeQL or dependency review to bypass failures
- pin insecure dependencies intentionally
- add unreviewed install scripts that execute remote code blindly

Prefer pinned or constrained dependency versions and reproducible builds where practical.

## Repository hygiene

Before changing code:

1. inspect the current implementation
2. search for existing related code, TODOs, FIXME markers, issues, and PRs
3. avoid duplicating an existing feature
4. preserve established naming and architecture unless there is a strong reason to change it

After changing code:

1. run relevant tests and builds
2. document material architecture or operational changes
3. report exactly what changed
4. report what was actually verified
5. identify remaining blockers honestly

## Commit and PR expectations

Prefer small, reviewable commits with conventional prefixes such as:

- `feat:`
- `fix:`
- `docs:`
- `test:`
- `refactor:`
- `chore:`
- `security:`

A PR touching financial execution, signer boundaries, risk controls, authentication, secrets, or deployment must explain the security/risk impact and validation evidence.

## Documentation requirements

Update documentation when behavior, architecture, deployment, environment variables, risk controls, or production gates change.

Primary references include:

- `README.md`
- `docs/architecture.md`
- `docs/production-readiness.md`
- `SECURITY.md`
- `ROADMAP.md`

Do not mark a checklist item complete without evidence.

## Definition of done

A task is complete only when:

- implementation is present
- relevant tests/builds pass or failures are explicitly reported
- security/risk invariants remain intact
- documentation is updated where needed
- no secrets were introduced
- no production-readiness claim exceeds available evidence

For financial or execution changes, "code compiles" is not sufficient evidence of readiness.
