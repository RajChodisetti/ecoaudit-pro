# Generated, Vendor, Runtime, and Workspace Policy

| Path | Classification | Agent policy |
|---|---|---|
| `src/**` | Canonical application source | Edit only within task scope. |
| `base44/entities/**` | Canonical local schema source | Edit deliberately; consider persisted-data compatibility. |
| `base44/functions/**` | Canonical serverless source | Treat as privileged code; require authorization analysis and focused verification. |
| `src/components/ui/**` | Tracked scaffolded UI source | Avoid broad cleanup; edit only for relevant component-system work. |
| `mobile/` | External Git submodule workspace | Do not scan or edit by default; never repoint without explicit scope. |
| `base44/.app.jsonc` | Platform link metadata | Do not hand-edit unless an explicit relink task requires it. |
| `node_modules/`, `dist/`, `.vite/` | Generated/vendor output | Never edit or include in routine context. Recreate using canonical commands. |
| `.env*`, except committed examples | Secret/local configuration | Never read, print, commit, or rewrite. |
| ignored `.claude/` settings | Local tool state | Non-authoritative; do not broaden permissions. |

Generated outputs must be changed through their source or generator. If a task
requires an exception, report why and obtain explicit authorization first.
