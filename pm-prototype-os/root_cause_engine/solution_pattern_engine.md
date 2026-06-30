# Solution Pattern Engine

真因候補から、要件パターン・UIパターン・実装パターンへ接続するエンジン。

## Purpose

Do not jump from request to implementation.

```text
request
cause hypothesis
requirement pattern
MVP pattern
UI pattern
technical pattern
implementation prompt
```

## Mapping Table

| Cause Hypothesis | Requirement Pattern | UI Pattern | Technical Pattern |
|---|---|---|---|
| Version confusion | Comparison / Status | Difference Review Table | metadata table + file index |
| Hard to find document content | Search + Evidence | RAG Evidence Viewer | document extraction + RAG |
| Meeting decisions not reflected | Decision Log | Workflow Kanban | minutes extraction + task table |
| BIM attributes missing | Rule Check | File Analysis Dashboard | IFC parser + rule checker |
| Revit operation is repetitive | Command Planning | Command Console | operation planner + approval step |
| Estimate conditions differ | Comparison Table | Difference Review Table | PDF/Excel extraction |
| Inspection records scattered | Asset History | Timeline / Evidence Viewer | document index + status table |
| Past cases not reused | Similarity Search | Similar Case Finder | case metadata + vector search |

## Decision Rule

### If the cause is data chaos

Use:

```text
metadata extraction
index table
version/status management
```

Avoid starting with advanced AI.

### If the cause is knowledge search

Use:

```text
RAG
source evidence
missing information display
```

### If the cause is workflow leakage

Use:

```text
decision log
task status
owner/deadline
```

### If the cause is rule checking

Use:

```text
rule table
candidate violations
human review
```

### If the cause is repetitive tool operation

Use:

```text
natural language command
operation plan
approval
execution log
```

## Output Template

```text
# Solution Pattern Output

## Selected Cause

## Requirement Pattern

## MVP Pattern

## UI Pattern

## Technical Pattern

## Data Needed

## First Demo

## Risks

## Implementation Prompt
```
