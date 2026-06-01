# Project Instructions for Codex

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules (Essential):
- Product ideas/Brainstorming → invoke /office-hours
- Architecture/Design Review → invoke /plan-eng-review
- Full review pipeline → invoke /autoplan
- Bugs/Errors/Troubleshooting → invoke /investigate
- QA/Testing → invoke /qa
- Code Review → invoke /review
- Ship/Deploy/PR → invoke /ship
- Second opinion/Review → invoke /codex
- Save/Restore progress → invoke /context-save or /context-restore
