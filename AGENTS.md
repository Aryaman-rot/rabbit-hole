<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git

- Remote `origin` is `https://github.com/Aryaman-rot/rabbit-hole.git`. Never
  change the remote URL, and never push to any other repository.
- The working branch is `rabbit-hole`. Every prompt ends with a commit
  followed by `git push` (the previous session pushed nowhere because the
  remote pointed elsewhere — see `stage-files/stage-1-prototype.md`).
- If a push fails with an auth or permission error, stop and report the exact
  message. Do not attempt to fix credentials.
- Never force-push.
