#!/usr/bin/env python3
"""PM Prototype OS自体の構文・知識整合を1コマンドで検証する。"""

from __future__ import annotations

import json
from pathlib import Path
import py_compile
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def json_check() -> list[str]:
    errors: list[str] = []
    targets = [ROOT / "technical_decision_os", ROOT / "mvp_factory"]
    for base in targets:
        for path in sorted(base.rglob("*.json")):
            try:
                json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                errors.append(f"JSON {path}: {exc}")
    return errors


def python_check() -> list[str]:
    errors: list[str] = []
    targets = [
        ROOT / "technical_decision_os" / "scripts",
        ROOT / "mvp_factory" / "scripts",
        ROOT / "pm_brain" / "scripts",
        ROOT / "scripts",
    ]
    for base in targets:
        if not base.exists():
            continue
        for path in sorted(base.rglob("*.py")):
            try:
                py_compile.compile(str(path), doraise=True)
            except py_compile.PyCompileError as exc:
                errors.append(f"PYTHON {path}: {exc.msg}")
    return errors


def run_knowledge_validator() -> int:
    script = ROOT / "technical_decision_os" / "scripts" / "validate_knowledge.py"
    proc = subprocess.run([sys.executable, str(script)], cwd=ROOT, check=False)
    return proc.returncode


def main() -> int:
    errors = json_check() + python_check()
    for error in errors:
        print(f"ERROR {error}")
    validator_code = run_knowledge_validator() if not errors else 1
    if errors or validator_code:
        print("OS verification failed")
        return 1
    print("OS verification passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
