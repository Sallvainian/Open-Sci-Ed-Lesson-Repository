# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The **Open Science Education Lesson Repository** is a web-based lesson planning workflow tool for organizing OpenSciEd science curriculum materials. This is a personal planning tool focused on content organization (not creation), designed for a single teacher's workflow to eliminate information overload and planning surprises.

**Core Purpose**: Structure overwhelming OpenSciEd materials into a hierarchical, easily navigable repository where a science teacher can find lesson content, teaching approaches, standards, objectives, and resources in <30 seconds.

**Key Success Metric**: User can locate complete lesson materials for any upcoming lesson in under 30 seconds.

## Project Structure

This repository uses **BMAD-METHOD** framework with creative writing agents adapted for educational content organization:

```
.bmad-core/              # BMAD core framework configuration
.bmad-creative-writing/  # Creative writing expansion pack (10 specialized agents)
.claude/                 # Claude Code slash commands and settings
claudedocs/              # Claude-generated documentation and session notes
docs/                    # Project planning documents (brief, brainstorming, lesson breakdowns)
web-bundles/             # Web application assets
AGENTS.md                # BMAD agent definitions (auto-generated, DO NOT manually edit)
```

## BMAD-METHOD Integration

This project uses BMAD (Business-Method-Agent-Design) framework for AI agent orchestration:

### Activating Agents

Reference agents naturally in conversation: "As dev, implement..." or "Use architect to design..."

**Available agent roles** (10 total):

- `dev` - Full Stack Developer (code implementation, debugging)
- `architect` - System design and technology decisions
- `pm` - Product Manager (PRDs, strategy, roadmap)
- `analyst` - Business Analyst (research, briefs, discovery)
- `ux-expert` - UI/UX design and prototypes
- Plus 5 creative writing agents (plot-architect, character-psychologist, world-builder, editor, beta-reader, etc.)

### Key BMAD Commands

**DO NOT run these automatically** - they're for reference when explicitly needed:

```bash
npx bmad-method list:agents              # List all available agents
npx bmad-method install -f -i codex      # Regenerate AGENTS.md (rarely needed)
npx bmad-method validate                 # Validate BMAD configuration
```

### Important BMAD Rules

1. **NEVER manually edit AGENTS.md** - it's auto-generated from `.bmad-core/` and `.bmad-creative-writing/`
2. **Agent commands use `*` prefix** - e.g., `*help`, `*create-prd`
3. **File resolution**: Agent dependencies map to `.bmad-core/{type}/{name}` (tasks, templates, checklists, etc.)
4. When BMAD agents execute task workflows with `elicit=true`, user interaction is **mandatory** - never skip for efficiency
5. Configuration in `.bmad-creative-writing/config.yaml` and `.bmad-core/core-config.yaml` takes precedence

## Architecture & Design Principles

### Content Organization Model

**Hierarchy**: Discipline → Unit → Lesson (matches teacher mental model)

**Dual Navigation**:

- **Conceptual**: "What's in Unit 8.1 (Forces)?" - browse by discipline/unit
- **Chronological**: "What am I teaching Day 25?" - pacing guide sequence

**Lesson Page Template** (consistent structure across all lessons):

- Standards and learning objectives
- Student-friendly "We are learning to" statements
- Teaching approach and methodology
- Resources (slides, videos, experiments, guides) - hosted within app
- Links to related lessons and prerequisites

### Design Philosophy

- **90% Organization, 10% Creation**: Focus on structuring existing OpenSciEd materials, not generating new content
- **Personal Workflow Tool**: Single-user optimization (no collaboration features in MVP)
- **Curated Simplicity**: Reduce OpenSciEd's volume to essential, well-organized materials
- **Hosted Resources**: Files stored in-app for quick access without external dependencies
- **Predictable Planning**: Every lesson follows identical template for consistency

### Technical Constraints

- Web-based application (specific stack TBD)
- Single-user focus initially
- Must handle rich educational content (standards, objectives, teaching approaches, resources)
- File hosting capability for educational materials
- Fast navigation and search (<30 second target for material lookup)

## Development Context

### Current Status

Repository is in **initial planning phase**. Key planning artifacts in `docs/`:

- `brief.md` - Comprehensive project brief (executive summary, problem statement, solution, metrics)
- `brainstorming-session-results.md` - Initial discovery and requirements exploration
- `lesson-8.1.1-breakdown.md` - Sample lesson structure analysis

### Google Drive Integration

Repository has Google Drive MCP server configured for accessing OpenSciEd teaching materials:

- Teaching edition documents not yet in Drive (as of 2025-09-30)
- Student materials available: "8.1 Lesson 1 Student Procedure", "8.1 Contact Forces - Handouts"
- See `claudedocs/google-drive-mcp-session.md` for integration details

### Next Steps (from planning documents)

1. Technology stack selection (web framework, database, hosting)
2. Lesson content structure definition (database schema, content model)
3. MVP scope definition (single unit vs. full curriculum, feature prioritization)
4. UI/UX design (wireframes, navigation patterns)
5. Content migration strategy (OpenSciEd materials → repository format)

## Working with This Repository

### Documentation Guidelines

- **Claude-specific outputs** go in `claudedocs/` directory
- **Project planning** goes in `docs/` directory
- **DO NOT create** README.md, setup guides, or generic documentation unless explicitly requested
- Session notes, analyses, and tool call documentation belong in `claudedocs/`

### BMAD Agent Workflow

When using BMAD agents:

1. Agent activation reads their definition from AGENTS.md
2. Agent immediately runs `*help` to show available commands
3. Agent awaits user command/request
4. Only load dependency files (tasks, templates) when user explicitly requests execution
5. Follow task workflows exactly as written when executing

### Key Constraints

- No code implementation yet - focus on planning and architecture
- BMAD framework is core to the project - understand agent system before making structural changes
- Single-user optimization is intentional design decision, not limitation to overcome
- OpenSciEd curriculum is the content source - don't design for generic lesson planning

## Additional Resources

- OpenSciEd curriculum materials (external): https://www.openscied.org/
- BMAD-METHOD documentation: Reference `.bmad-core/` and `.bmad-creative-writing/` directories
- Project brief (comprehensive context): `docs/brief.md`
