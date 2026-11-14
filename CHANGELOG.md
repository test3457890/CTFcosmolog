# CosmoLog community edition

The attachment-based corrected project replaces the older GitHub upload. The seven original core challenges retain their flags and point values, totaling 1,550. Four optional missions add unscored investigation paths.

## Changed and added application files

| File | Purpose |
|---|---|
| `server.js` | Apply the requested stable-ID, Bearer-token, and scoped SQLi fixes; wait for deterministic seeding before listening; load the community module; create the upload directory; prevent private posts on public accounts from leaking to other identities. Existing core challenge endpoints remain. |
| `sqlite.js` | Promise wrappers for ordered SQLite initialization and social queries. |
| `social.js` | Social feeds, reactions, reposts, author-only edits/pins, bookmarks, follows, replies, inboxes, membership-checked writes, notifications, optional conversation IDOR, and mission submission/progress. Social state is an unattached in-memory database. |
| `story.js` | Eight additional fictional users, 91 story posts, 38 seeded replies, six ordinary inbox conversations, one restricted operations conversation, and resolvable red herrings. |
| `public/index.html` | Social application shell with Home, Explore, Messages, Notifications, Bookmarks, Profile, Mission journal, and Station tools. |
| `public/app.js` | Navigation, safe text rendering, forms, interactions, per-post links, challenge tools, flag submission, and theme control. |
| `public/style.css` | Responsive social layout, light/dark themes, initials avatars, conversation and mission views, and keyboard focus states. |
| `public/login.html` and `public/login.js` | Updated sign-in page with the existing student credentials and matching theme behavior. |
| `public/attachments/facility.svg` | Original diagram with XML metadata for optional investigation 3, separate from the included core stego JPEG. |
| `public/uploads/mission_brief.txt`, `flag.txt`, and `etc/ai_config.conf` | Bring in the existing supplied challenge artifacts missing from the older GitHub version. Contents remain unchanged. |
| `docker-compose.yml` | Rename the service to cosmolog, preserving startup, port, bind mounts, and restart policy. |
| `.gitignore` | Exclude node_modules, database.sqlite, its SQLite journal/WAL sidecars, and browser-test artifacts. |
| `.dockerignore` | Keep local dependencies, database files, guides, tests, and browser-test artifacts out of the application image context. |
| `tests/regression.cjs` | Real-server checks for the six code-based core solutions, IDs over three starts, authentication, scoped SQLi, privacy, social interactions, intentional IDOR, four side-mission evidence paths, and exact/idempotent scoring. |
| `public/uploads/stego_challenge.jpg` | Include the prepared core Challenge 3 JPEG, verified with the original flag and cosmolog passphrase. |
| `scripts/prepare-stego.sh` | Preserve valid images or rebuild and extraction-verify a damaged carrier as an organizer recovery step. |
| `tests/browser.cjs` | Real Chromium checks for desktop/mobile navigation, login, images, SQLi separation, messages, IDOR, scoring, diagnostics, and themes; capture screenshots. |
| `.github/workflows/lab-validation.yml` | Build and start Docker using the preserved commands, extract the HTTP-served stego flag, run browser checks, and retain diagnostics. Read-only repository permissions. |
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

## Intentional boundaries and validation

Only the seven core missions award points. Duplicate submissions do not add points. Progress follows the active JWT account; forged identities and shared student accounts make the local journal a learning aid, not an authoritative external leaderboard. All database and social progress resets on restart. Uploaded files remain on the host.

The isolated search snapshot cannot retrieve Sriracha posts or password hashes. The new social database is not attached to that snapshot. The single vulnerable server still permits intentional command execution and traversal, so source inspection and cross-challenge shortcuts remain possible. Conversation 407 deliberately lacks a read membership check; writing still requires membership.

Passed: JavaScript syntax, the expanded real-server regression suite, DOM interactions, the original Docker build/startup workflow, extraction from the supplied and HTTP-served JPEG, and real Chromium desktop/mobile flows. Captured light/dark desktop and mobile screens were visually reviewed. All updated Word guides were rendered and reviewed. The Node regression suite also checks that the served JPEG matches the included file. The validation workflow uses Ubuntu 24.04 for compatibility with its pinned browser tooling, installed separately from the application dependencies. Run the documented readiness checks on the actual event host before competitors begin.

## Community content expansion

| File | Change and reason |
|---|---|
| `story.js` | Add 48 politically neutral, age-appropriate everyday posts and 24 replies in eight connected threads. Give each account a recognizable voice and include follow-ups without adding flags or changing existing evidence. |
| `README.md` | Update content counts and describe the new community conversations and audience expectations. |
| `Guides/CosmoLog Setup Guide.docx` and `Guides/Setup.md` | Update the seeded post count to 84. Startup, challenge instructions, flags, and scoring are unchanged. |
| `CHANGELOG.md` | Record the content expansion and every file changed for it. |

## Seven forensic cases and evidence archive

| File | Change and reason |
|---|---|
| `forensics.js` | Define seven server-side cases, tool recommendations, three progressive hints, and exact flags. New cases record completion for zero points. |
| `social.js` | Include forensic cases in the journal, expose sanitized evidence metadata through /api/case-files, and report seven forensic cases in health without changing core scoring or the four side missions. |
| `story.js` | Add seven acquisition posts, seven corroborating replies, and the accepted receipt reference in crew chat, tying evidence to the existing story. |
| `public/index.html` | Add Case files navigation and the CaseFiles topic link. |
| `public/app.js` | Add the evidence archive with download hashes and file sizes, attachment cards, journal filters, progressive hints, and separate forensic completion. |
| `public/style.css` | Style evidence cards, hash disclosure, attachment cards, and journal filters for desktop/mobile and light/dark themes. |
| `public/attachments/cases/relay-transfer.pcap` | Full TCP/HTTP acquisition with an accepted compressed object, cancelled receipt, and ordinary traffic. |
| `public/attachments/cases/resolver-window.pcap` | DNS query/response acquisition with numbered hex fragments, retry traffic, and normal lookups. |
| `public/attachments/cases/survey-photos.zip` | Original EXIF-bearing survey JPEG and metadata-stripped preview. |
| `public/attachments/cases/handoff-snapshot.zip` | Baseline SQLite database plus committed WAL needed to see the accepted record. |
| `public/attachments/cases/removable-media.zip` | Raw FAT12 filesystem image with a deleted entry and recoverable handoff content. |
| `public/attachments/cases/mail-review.zip` | Accepted and cancelled MIME email exports plus a gateway disposition log. |
| `public/attachments/cases/incident-timeline.zip` | Three timestamped sources, distinct UTC offsets, correlated identifiers, and an explicit answer format. |
| `public/attachments/cases/manifest.json` | Record SHA-256 and byte counts for all seven acquisitions. |
| `scripts/build-forensics.py` | Rebuild fictional offline evidence without live capture or application dependency changes. |
| `tests/forensics.py` | Solve all seven shipped cases with real tools and check acquisition hashes. |
| `.github/workflows/forensics.yml` | Install analysis tooling in CI and run the forensic evidence validation separately from the app. |
| `tests/regression.cjs` | Verify 18 journal entries, seven served evidence hashes, hidden answer fields, correct/wrong forensic submissions, and unchanged/idempotent 1,550-point core scoring. |
| `tests/browser.cjs` | Verify desktop/mobile Case files, downloads, hashes, filtered cases, progressive hints, and separate completion. Capture new screens. |
| `.dockerignore` | Include forensic ZIP acquisitions in the application image despite the general ZIP exclusion. |
| `README.md` | Describe the seven cases, audience, tools, evidence handling, separate completion, validation, and updated content counts. |
| `Guides/CosmoLog Setup Guide.docx` and `Guides/Setup.md` | Add analysis workstation preparation, acquisition readiness checks, learning sequence, limitations, and updated seed counts. |
| `Guides/CosmoLog Hint Book.docx` and `Guides/Hint Book.md` | Add seven matching cases with progressive hints, final methods, and reference sources. |
| `Guides/CosmoLog Staff Guide.docx` and `Guides/Staff Guide.md` | Add all seven answers and tested recovery methods, judging expectations, evidence checks, and reference sources. |
| `CHANGELOG.md` | Record every file changed for this expansion. |

Validation passed on the evidence/app commit: real-server regression, Docker startup and HTTP-served stego extraction, all seven forensic solutions with the intended tools, and desktop/mobile Chromium flows. Original core flags, points, dependency versions, and startup commands remain unchanged.
