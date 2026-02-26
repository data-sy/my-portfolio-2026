---
description: Analyze current branch and create a PR following PR_CONVENTION.md.
---

Read the PR convention file at `docs/PR_CONVENTION.md` (or find it in the repo).

**1. Analysis:**
- Run `git log main..HEAD --oneline` to see all commits in current branch
- Run `git diff main...HEAD --stat` to see changed files
- Determine PR type:
  - **Type A (Feature & Setup):** General implementation, config, setup, documentation
  - **Type B (Optimization):** Performance comparison with before/after metrics (v1~v4 pattern)

**2. Content Generation:**
- Title: English, following convention format
- Body: Korean, using the appropriate template (Type A or Type B) from the convention
- No watermark or AI attribution

**3. Execution:**
- Write body to temp file to preserve formatting
```bash
cat << 'EOF' > /tmp/pr_body.md
{generated body}
EOF
gh pr create --base main --title "{title}" --body-file /tmp/pr_body.md
rm /tmp/pr_body.md
```

**4. After PR creation:**
- Show the PR URL
