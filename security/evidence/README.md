# ZEARN Security Evidence Pack

This directory defines the evidence expected from security and supply-chain controls. Generated artifacts belong in CI artifacts or release attachments unless they are small, deterministic reference files.

## Required evidence

- SBOM: CycloneDX or SPDX for backend and frontend dependencies.
- SARIF: CodeQL and any additional static-analysis findings.
- Dependency review result for pull requests.
- Container scan report for backend and dashboard images.
- Secret-scan result proving no tracked private keys, seed phrases, or credentials.
- Agent safety review showing `AGENTS.md` invariants remain enforced.
- Signer-boundary review before any live execution work is accepted.

## Current baseline

| Evidence | Status | Source |
| --- | --- | --- |
| CodeQL SARIF | CI-generated | `.github/workflows/codeql.yml` |
| Dependency Review | CI-generated | `.github/workflows/dependency-review.yml` |
| Tracked-secret baseline | CI-generated | `.github/workflows/ci.yml` |
| SBOM | Planned in evidence workflow | `security/evidence/manifest.json` |
| Container scan | Planned in evidence workflow | `security/evidence/manifest.json` |
| AgentShield-style policy evidence | Reference baseline | `AGENTS.md` + harness corpus |

Security evidence is not equivalent to a claim that ZEARN is production-ready for live funds. Live execution remains gated by `docs/production-readiness.md`.
