# ZEARN Regression & Evaluation Corpus

This directory contains deterministic reference cases used to detect behavior regressions in analyzers, retrieval/evaluation, PR salvage automation, discussion triage, CI diagnosis, and agent harness compatibility.

## Corpus map

- `analyzer/golden.json` — wallet analyzer quality and manipulation-risk cases.
- `rag/evaluator-reference.json` — retrieval ranking and evaluator expectations.
- `pr-salvage/reference.json` — stale PR, unresolved review, and reopen/salvage cases.
- `discussion-triage/golden.json` — informational, answered, and no-response discussion cases.
- `harness/compatibility.json` — Claude, Codex, OpenCode, Zed, dmux, and generic agent contract.
- `ci-failures/reference.json` — known workflow/build failure signatures and expected remediations.

## Validation

Run:

```bash
python tools/validate_evidence.py
```

CI runs the same validator in the `evidence-corpus` job. Corpus changes should be reviewable, deterministic, and must not encode secrets or live trading credentials.
