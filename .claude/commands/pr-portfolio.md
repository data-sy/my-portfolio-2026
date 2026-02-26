---
description: Analyze current branch and create a portfolio/resume PR with categorized changes.
---

**1. Analysis:**
- Run `git log main..HEAD --oneline` to see all commits in current branch
- Run `git diff main...HEAD --stat` to see changed files
- Categorize changes by topic (e.g., 포트폴리오, 이력서, 인프라, 기타)

**2. Content Generation:**
- Title: English, Conventional Commits style (e.g., `feat: build portfolio design system and resume template`)
- Body: Korean, using the template below
- No watermark or AI attribution

**3. Body Template:**
```
## Summary
{한 줄 요약}

## Changes
### {카테고리 1}
- 변경사항
- 변경사항

### {카테고리 2}
- 변경사항
- 변경사항

### 기타
- 변경사항

## Result
- {카테고리 1}: 최종 산출물 요약
- {카테고리 2}: 최종 산출물 요약
```

**4. Categorization Rules:**
- Group related commits into logical categories
- Common categories: 포트폴리오, 이력서, 디자인 시스템, 인프라, 문서, 기타
- Each category should have at least 2 items; merge small categories into 기타
- Order categories by importance (core changes first)

**5. Execution:**
```bash
cat << 'EOF' > /tmp/pr_body.md
{generated body}
EOF
gh pr create --base main --title "{title}" --body-file /tmp/pr_body.md
rm /tmp/pr_body.md
```

**6. After PR creation:**
- Show the PR URL
