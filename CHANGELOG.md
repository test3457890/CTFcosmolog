# CosmoLog community edition

The attachment-based corrected project replaces the older GitHub upload. The seven original core challenges retain their flags and point values, totaling 1,550. Four optional missions add unscored investigation paths.

## Changed and added application files

| File | Purpose |
|---|---|
| `server.js` | Apply the requested stable-ID, Bearer-token, and scoped SQLi fixes; wait for deterministic seeding before listening; load the community module; create the upload directory; prevent private posts on public accounts from leaking to other identities. Existing core challenge endpoints remain. |
| `sqlite.js` | Promise wrappers for ordered SQLite initialization and social queries. |
| `social.js` | Social feeds, reactions, reposts, author-only edits/pins, bookmarks, follows, replies, inboxes, membership-checked writes, notifications, optional conversation IDOR, and mission submission/progress. Social state is an unattached in-memory database. |
| `story.js` | Eight additional fictional users, 36 story posts, seven seeded replies, six ordinary inbox conversations, one restricted operations conversation, and resolvable red herrings. |
| `public/index.html` | Social application shell with Home, Explore, Messages, Notifications, Bookmarks, Profile, Mission journal, and Station tools. |
| `public/app.js` | Navigation, safe text rendering, forms, interactions, per-post links, challenge tools, flag submission, and theme control. |
| `public/style.css` | Responsive social layout, light/dark themes, initials avatars, conversation and mission views, and keyboard focus states. |
| `public/login.html` and `public/login.js` | Updated sign-in page with the existing student credentials and matching theme behavior. |
| `public/attachments/facility.svg` | Original diagram with XML metadata for optional investigation 3, separate from the manual core stego JPEG. |
| `public/uploads/mission_brief.txt`, `flag.txt`, and `etc/ai_config.conf` | Bring in the existing supplied challenge artifacts missing from the older GitHub version. Contents remain unchanged. |
| `docker-compose.yml` | Rename the service to cosmolog, preserving startup, port, bind mounts, and restart policy. |
| `.gitignore` | Exclude node_modules, database.sqlite, and its SQLite journal/WAL sidecars. |
| `.dockerignore` | Keep local dependencies, database files, guides, and tests out of the application image context. |
| `tests/regression.cjs` | Real-server checks for the six code-based core solutions, IDs over three starts, authentication, scoped SQLi, privacy, social interactions, intentional IDOR, four side-mission evidence paths, and exact/idempotent scoring. |
| `.github/workflows/test.yml` | Run syntax and regression checks on pushes and pull requests with Node 22. |

The obsolete repository-root index.html, login.html, and style.css are removed; the served copies are under public/. Dockerfile, package.json, and seed.js retain the attachment-based dependency versions and workflow. The old optional seed.js helper is not needed for the new built-in community seed.

## Documentation

| File | Purpose |
|---|---|
| `README.md` | Current setup, navigation, account IDs, social behavior, seven scored exercises, four optional investigations, reset/scoring limitations, and verification instructions. |
| `Guides/CosmoLog Setup Guide.docx` | Monochrome setup and operations guide with community-edition navigation and readiness checks. |
| `Guides/CosmoLog Hint Book.docx` | Corrected original hints, new UI locations, four optional solutions, and explanations of false leads. |
| `Guides/CosmoLog Staff Guide.docx` | Core solutions/scoring, optional mission flags and judging steps, private-message read/write expectations, red herrings, and reset/progress limitations. |
| `Guides/Setup.md`, `Guides/Hint Book.md`, and `Guides/Staff Guide.md` | GitHub-readable equivalents of the Word guides. |
| `CHANGELOG.md` | This complete file and behavior change list. |

## Intentional boundaries and remaining checks

Only the seven core missions award points. Duplicate submissions do not add points. Progress follows the active JWT account; forged identities and shared student accounts make the local journal a learning aid, not an authoritative external leaderboard. All database and social progress resets on restart. Uploaded files remain on the host.

The isolated search snapshot cannot retrieve Sriracha posts or password hashes. The new social database is not attached to that snapshot. The single vulnerable server still permits intentional command execution and traversal, so source inspection and cross-challenge shortcuts remain possible. Conversation 407 deliberately lacks a read membership check; writing still requires membership.

Passed locally: JavaScript syntax, the expanded real-server regression suite, and DOM interaction checks for feed rendering, navigation, messages, flags, SQLi output, the intended IDOR view, and theme changes. All Word guides were rendered and reviewed. The graphical browser could not launch in this environment, so visual desktop/mobile validation remains unverified. Docker and the manually prepared core stego JPEG were not executed here. The missing-JPEG feed state is handled explicitly, and setup documentation requires extraction verification before scoring Challenge 3.
