# Architecture Recommender

MVPの種類から、最初の技術構成を素早く選ぶための推奨パターン。

## Principle

Choose the smallest architecture that can validate the cause hypothesis.

```text
validate value first
then validate scale
then validate production constraints
```

## Pattern A: Document Search MVP

### Use When

- Users need to find information inside documents
- Source evidence is important
- PDFs, specs, minutes, reports are the main input

### Suggested Stack

```text
Next.js
shadcn/ui
PDF extraction
LlamaIndex or LangChain
Chroma or Qdrant
source evidence viewer
```

### Do Not Build First

- complex permissions
- full document management system
- automatic final judgment

## Pattern B: File / Version Management MVP

### Use When

- The latest file is unclear
- file naming differs
- drawing number / revision / approval status matters

### Suggested Stack

```text
Next.js
SQLite or local JSON
metadata extraction
status table
filter/search UI
```

### Do Not Build First

- full storage migration
- enterprise approval workflow
- deep AI search

## Pattern C: Rule Check MVP

### Use When

- Rules are clear
- data can be structured
- output is a candidate list

### Suggested Stack

```text
Next.js
rule table
CSV/JSON intermediate data
candidate review UI
export report
```

For BIM/IFC:

```text
IfcOpenShell
IFC to JSON
rule checker
review dashboard
```

## Pattern D: Decision Log MVP

### Use When

- meeting decisions disappear
- changes are not tracked
- owners and due dates are unclear

### Suggested Stack

```text
minutes input
LLM extraction
decision/change/task table
kanban or status board
CSV export
```

## Pattern E: Agent Operation MVP

### Use When

- repeated tool operations are painful
- users want natural language commands
- execution risk must be controlled

### Suggested Stack

```text
command input
intent classification
operation plan
approval step
mock execution log
```

### First Demo Rule

Show the operation plan first. Do not execute real operations in the first demo.

## Pattern F: Comparison MVP

### Use When

- estimates, specs, versions, or alternatives need comparison

### Suggested Stack

```text
file upload
structured extraction
comparison table
difference priority
clarification questions
```

## Pattern G: Similar Case MVP

### Use When

- past projects are not reused
- experienced people are bottlenecks
- similar decisions are repeated

### Suggested Stack

```text
case metadata
vector search
similarity reason
reuse notes
risk notes
```

## Recommendation Output

```text
# Architecture Recommendation

## MVP Type

## Why This Pattern

## Stack

## Data Flow

## Screens

## What To Mock

## What To Validate With Real Data

## Production Risks

## Codex / Claude Code Prompt
```
