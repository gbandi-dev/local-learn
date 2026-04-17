# Re:Earth CMS App Builder

A multi-agent platform that helps you design and automatically generate applications using the Re:Earth CMS Integration API.

Describe what you want in natural language → AI designs the data model → generates a working app.

**Demo:** Disaster Map Viewer generated from natural language

---

## Architecture

```
User (natural language)
  ↓
┌─────────────────────────────────────────┐
│  Brainstorm Agent                       │
│  - Reads CMS knowledge base             │
│  - Proposes app ideas                   │
│  - Designs data models                  │
│  - Generates app-spec.json              │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  Generator                              │
│  - Selects template (catalog/submit/map)│
│  - Scaffolds from template              │
│  - Replaces placeholders                │
│  - Generates CMS plan                   │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  Generated App (Next.js + TypeScript)   │
│  - Connects to Re:Earth CMS API         │
│  - Mock mode for demo                   │
│  - Ready to deploy                      │
└─────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Bun >= 1.0 (runtime & package manager)
- Node.js >= 20
- Archon (optional — for advanced multi-agent workflows)
- Anthropic API key (for AI brainstorm/generate features)
- Re:Earth CMS account (optional — mock mode works without it)

### Install

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install Archon CLI (optional, for workflow orchestration)
curl -fsSL https://archon.diy/install | bash

# Clone and install dependencies
git clone https://github.com/eukarya-inc/reearth-cms-app-builder.git
cd reearth-cms-app-builder
bun install

# Build the knowledge base index
bun run build-index

# Set up environment
cp .env.example .env
# Edit .env with your API keys
```

### Generate an App

One-shot generation (automatic):

```bash
bun run generate "Build a catalog app for museum artifacts with images and descriptions"
```

Interactive brainstorm (conversational):

```bash
bun run brainstorm
# or with a starting prompt:
bun run brainstorm "I want a map viewer for disaster data"
```

Manual scaffold (from existing spec):

```bash
# Create/edit artifacts/app-spec.json manually
bun run scaffold
```

### Run the Generated App

```bash
cd generated/<app-slug>
npm install
cp .env.example .env  # Fill in CMS credentials, or leave MOCK_MODE=true
npm run dev
```

---

## Available Templates

| Template | Use Case | Features |
|---|---|---|
| `catalog-next` | Read-only data browser | List, detail, search, filter |
| `submission-next` | Data entry forms | Create, edit, delete, asset upload |
| `geo-viewer-next` | Map visualization | Leaflet map, GeoJSON, popups, sidebar |

---

## Archon Workflows

This project includes Archon workflow definitions for advanced orchestration:

| Workflow | Purpose |
|---|---|
| `reearth-brainstorm` | Interactive idea generation with approval gates |
| `reearth-connect-project` | Connect to existing CMS project and discover its structure |
| `reearth-idea-to-app` | Full pipeline: idea → spec → scaffold → implement → review |
| `reearth-sync-cms-plan` | Apply CMS plan to create models/fields in your project |
| `reearth-fix-app` | Diagnose and fix build failures in generated apps |

```bash
# With Archon installed:
archon workflow run reearth-brainstorm "I need an event registration system"
archon workflow run reearth-idea-to-app "Build a disaster map viewer"
```

---

## Project Structure

```
.archon/workflows/       # Archon workflow definitions (YAML)
packages/
  kb/                    # Knowledge base
    manual/              # CMS documentation chunks (markdown)
    openapi/             # OpenAPI spec + indexed endpoints/schemas
  reearth-client/        # Typed TypeScript wrapper for CMS API
  contracts/             # JSON schemas for app-spec and cms-plan
  generator/             # Scaffolding utilities
templates/
  catalog-next/          # Read-only catalog template
  submission-next/       # Form submission template
  geo-viewer-next/       # Map viewer template
scripts/
  brainstorm.ts          # Interactive AI brainstorming CLI
  generate-app.ts        # One-shot generation
  scaffold-app.ts        # Template scaffolding
  apply-cms-plan.ts      # Apply CMS resource plan
  build-openapi-index.ts # Index the OpenAPI spec
  search-kb.ts           # Search the knowledge base
  validate-app.ts        # Validate generated apps
generated/               # Output directory for generated apps
artifacts/               # Intermediate files (specs, plans)
```

---

## How It Works

1. **Knowledge Base:** CMS documentation and API specs are chunked and indexed with MiniSearch for fast retrieval
2. **Brainstorm Agent:** Uses Claude to ideate app concepts based on user needs + CMS capabilities
3. **Spec Generation:** Produces a structured `app-spec.json` defining the app's data model, features, and UI
4. **CMS Plan:** Generates a declarative `cms-plan.json` for creating models/fields in Re:Earth CMS
5. **Scaffolding:** Copies the appropriate Next.js template and replaces placeholders with spec values
6. **Generated App:** A complete Next.js app with CMS API integration and mock mode

---

## CMS Integration

The generated apps connect to Re:Earth CMS via the Integration API:

```
Authorization: Bearer <your-integration-token>
GET /api/integration/{workspaceId}/projects/{projectId}/models/{modelKey}/items
```

### Mock Mode

All generated apps support `MOCK_MODE=true` — they return sample data without needing a CMS connection. This makes it easy to demo, develop, and test.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features | For brainstorm/generate |
| `REEARTH_CMS_BASE_URL` | CMS API base URL | For CMS connection |
| `REEARTH_CMS_TOKEN` | Integration API token | For CMS connection |
| `REEARTH_CMS_WORKSPACE_ID` | Workspace ID | For CMS connection |
| `REEARTH_CMS_PROJECT_ID` | Project ID | For CMS connection |
| `MOCK_MODE` | Enable mock data mode | Optional |

---

## Security

- API tokens are never hardcoded — always use environment variables
- `.env` is gitignored
- Generated apps keep tokens server-side only (Next.js API routes)
- Use a personal workspace for development

---

## License

MIT
