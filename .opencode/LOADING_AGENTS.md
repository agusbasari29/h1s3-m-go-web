# Loading Custom Agents in Opencode

## Overview

This document explains how to load custom agents in opencode from an empty shell.

## Prerequisites

- Opencode installed globally
- Custom agents and skills configured in project

## Directory Structure

```
project-root/
├── .opencode/
│   ├── agents/
│   │   ├── planner.json
│   │   ├── builder.json
│   │   ├── tester.json
│   │   ├── reviewer.json
│   │   └── coordinator.json
│   ├── skills/
│   │   ├── planner/
│   │   │   └── SKILL.md
│   │   ├── builder/
│   │   │   └── SKILL.md
│   │   ├── tester/
│   │   │   └── SKILL.md
│   │   ├── reviewer/
│   │   │   └── SKILL.md
│   │   └── coordinator/
│   │       └── SKILL.md
│   ├── PROJECT_CONFIG.json
│   └── agents.json
└── (your project files)
```

## Loading Agents from Empty Shell

### Step 1: Initialize Opencode Project

```bash
# Navigate to your project directory
cd /path/to/h1s3-m-go-web

# Initialize opencode in the current directory
opencode
```

This will start opencode and load the custom agents from the `.opencode` directory.

### Step 2: Verify Agents are Loaded

```bash
# List all available agents
opencode agent list
```

Expected output should include:

- planner
- builder
- tester
- reviewer
- coordinator

### Step 3: Use Agents in Opencode

```bash
# Start opencode with a specific agent
opencode --agent planner

# Start opencode normally (uses coordinator as default)
opencode

# Use agents via @autocomplete
# In opencode prompt, type @ to see available agents
# For example: @planner analyze requirements...
# Or: @builder implement feature
# Or: @tester verify tests
```

## Agent Configuration Files

### Agent JSON Format

Each agent configuration follows this structure:

```json
{
  "model": "",
  "description": "Agent description",
  "mode": "subagent",
  "hidden": false,
  "color": "primary",
  "steps": 5,
  "prompt": "Agent instructions and workflow...",
  "permission": {
    "read": true,
    "bash": true,
    "write": true,
    "edit": true,
    "glob": true,
    "grep": true,
    "webfetch": true,
    "task": true,
    "question": true,
    "doom_loop": "ask",
    "plan_enter": "allow",
    "plan_exit": "allow",
    "skill": true
  },
  "options": {}
}
```

### Agent Modes

- **primary**: Main agent that orchestrates tasks (Coordinator)
- **subagent**: Assistant agent for specific tasks (Planner, Builder, Tester, Reviewer)
- **all**: Both primary and subagent modes

### Permission Settings

- **true/false**: Allow/deny specific tool access
- **"ask"**: Ask user before executing tool
- **"allow"**: Automatically allow tool access

### Color Codes

- primary, secondary, accent
- success, warning, error
- info

## Skills Directory

Skills are defined in `.opencode/skills/<agent-name>/SKILL.md`

Each skill file contains:

- Overview of the agent's role
- Responsibilities
- Workflow instructions
- Code examples
- Rules and guidelines

## Example Workflows

### Workflow 1: Starting New Feature

```bash
# 1. Start opencode
opencode

# 2. Assign to planner
@planner create task breakdown for: add device monitoring dashboard

# 3. Assign to builder
@builder implement the planned feature from phase 1

# 4. Assign to tester
@tester verify the implementation

# 5. Assign to reviewer
@reviewer check code quality
```

### Workflow 2: Issue-Based Development

```bash
# 1. Start opencode
opencode

# 2. Use coordinator to assign tasks
@coordinator handle issue #1: add device registration form

# The coordinator will:
# - Break down the issue into tasks
# - Assign tasks to appropriate agents
# - Track progress
# - Coordinate handoffs
```

## Troubleshooting

### Agents Not Loading

1. Check file structure:

```bash
ls -la .opencode/agents/
ls -la .opencode/skills/
```

2. Verify agent JSON format:

```bash
opencode debug agent planner
```

3. Check skill files exist:

```bash
opencode debug skill
```

4. Restart opencode:

```bash
# Stop current opencode instance
Ctrl+C

# Restart
opencode
```

### Common Issues

**Issue**: Agents not showing in autocomplete
**Solution**: Ensure agent JSON files are in correct location and have proper JSON syntax

**Issue**: Agents not executing tools
**Solution**: Check permission settings in agent JSON

**Issue**: Skills not loaded
**Solution**: Ensure SKILL.md files exist in `.opencode/skills/<agent-name>/` directory

## Project Configuration

The project configuration file (`.opencode/PROJECT_CONFIG.json`) provides:

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "agents": [
    {
      "name": "agent-name",
      "role": "Agent Role",
      "description": "Description",
      "path": "./.opencode/agents/agent-name.json"
    }
  ],
  "skills": [
    {
      "name": "agent-name",
      "path": "./.opencode/skills/agent-name/SKILL.md"
    }
  ]
}
```

This configuration helps opencode discover and load custom agents and skills.

## Quick Start

For an empty shell, use this command sequence:

```bash
# 1. Navigate to project
cd /path/to/h1s3-m-go-web

# 2. Initialize opencode
opencode

# 3. Verify agents
opencode agent list

# 4. Start working
# Type @ to see available agents
# Example: @planner analyze my requirements
```

That's it! Your custom agents are now loaded and ready to use.
