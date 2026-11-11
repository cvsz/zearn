from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CORPUS_FILES = [
    ROOT / "tests/corpus/analyzer/golden.json",
    ROOT / "tests/corpus/rag/evaluator-reference.json",
    ROOT / "tests/corpus/pr-salvage/reference.json",
    ROOT / "tests/corpus/discussion-triage/golden.json",
    ROOT / "tests/corpus/ci-failures/reference.json",
]

JSON_FILES = CORPUS_FILES + [
    ROOT / "tests/corpus/harness/compatibility.json",
    ROOT / "security/evidence/manifest.json",
    ROOT / "security/evidence/backend-declared-sbom.spdx.json",
    ROOT / "security/evidence/frontend-declared-sbom.spdx.json",
]


def load(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def validate_cases(path: Path) -> None:
    data = load(path)
    assert data.get("schema_version") == 1, f"{path}: schema_version must be 1"
    cases = data.get("cases")
    assert isinstance(cases, list) and cases, f"{path}: non-empty cases required"
    ids: list[str] = []
    for case in cases:
        case_id = case.get("id")
        assert isinstance(case_id, str) and case_id, f"{path}: every case requires id"
        ids.append(case_id)
        assert "expected" in case or "expected_ranking" in case, f"{path}:{case_id}: expected behavior missing"
    assert len(ids) == len(set(ids)), f"{path}: duplicate case ids"


def validate_harness(path: Path) -> None:
    data = load(path)
    names = {item["name"] for item in data.get("surfaces", [])}
    required = {"Claude", "Codex", "OpenCode", "Zed", "dmux", "generic-agent"}
    assert required <= names, f"{path}: missing harness surfaces: {sorted(required - names)}"
    contract = data.get("adapter_contract", {})
    assert "AGENTS.md" in contract.get("must_read", []), f"{path}: AGENTS.md must be mandatory"


def validate_security_manifest(path: Path) -> None:
    data = load(path)
    evidence = data.get("evidence", [])
    ids = {item.get("id") for item in evidence}
    required = {"codeql-sarif", "dependency-review", "backend-sbom", "frontend-sbom", "container-scan", "agent-policy-audit"}
    assert required <= ids, f"{path}: missing evidence types: {sorted(required - ids)}"


def main() -> None:
    missing = [str(path.relative_to(ROOT)) for path in JSON_FILES if not path.is_file()]
    assert not missing, f"missing evidence files: {missing}"

    for path in CORPUS_FILES:
        validate_cases(path)

    validate_harness(ROOT / "tests/corpus/harness/compatibility.json")
    validate_security_manifest(ROOT / "security/evidence/manifest.json")

    for path in JSON_FILES:
        load(path)

    print(f"validated {len(JSON_FILES)} evidence/corpus JSON files")


if __name__ == "__main__":
    main()
