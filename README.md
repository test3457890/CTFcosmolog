# CosmoLog CTF

A deliberately vulnerable, fictional social network for the evil.esAI incident and Nova on a Journey. The seven core challenges and their existing AstroSec{} flags still total 1,550 points. Four optional investigations are unscored.

## Start

From this repository's root, with Docker and a working `docker-compose` command installed:

```sh
touch database.sqlite
docker-compose up -d
```

Open http://localhost:3000. Student accounts: `cyber_newbie` / `password123` and `h4ck3r_man` / `password123`.

```sh
docker-compose logs -f cosmolog
docker-compose down
docker-compose up -d --build
```

Stop an old `twitter-clone` service using its old Compose file before replacing the project. If an orphan container remains in the same Compose project, run `docker-compose up -d --build --remove-orphans` once.

Use an authorized training VM/network. The core command execution and file traversal are intentional, and the code and staff guides contain solutions. This is not a production social platform or a competition-grade identity system.

## Community experience

- Home feed with For you and Following tabs.
- Twelve fictional profiles with bios, initials avatars, and follower counts.
- Ninety-one additional story posts, 38 seeded replies, and ordinary life alongside incident clues.
- Likes, reposts, threaded replies, bookmarks, follows, individual post links, author-only editing, and pinned posts.
- Six normal inbox conversations for each student account, plus a restricted operations thread that supports an optional IDOR exercise.
- Message replies and linked notifications, a persistent light/dark preference, and responsive layouts.
- A mission journal with server-checked flags, duplicate-submission protection, optional hints, and core progress out of 1,550.
- Station tools for the existing diagnostics, control panel, and mission-brief download.

The social interface renders submitted text as text. Stored XSS is not one of the seven core challenges. Ordinary social routes enforce private-post access and write permissions; the one intentionally vulnerable conversation read is documented below.

## Core challenges

| # | Challenge | Points | Entry point |
|---|---|---:|---|
| 1 | SQL injection | 100 | Explore → Search Users; `/api/users/search?q=...` |
| 2 | JWT forgery | 200 | Sriracha profile; `/api/user/1` |
| 3 | Steganography | 200 | Gorgan's satellite image; `/uploads/stego_challenge.jpg` |
| 4 | Privilege escalation | 300 | Station tools; `/api/admin/satellite-control` |
| 5 | Command injection | 300 | Station tools; POST `/api/satellite/ping` |
| 6 | File inclusion and traversal | 300 | Station tools; `/api/download?file=...` |
| 7 | API disclosure | 150 | `/api/debug/dump` |
| | Total | 1,550 | |

### Challenge 3 is included

`public/uploads/stego_challenge.jpg` is now shipped with the existing flag and passphrase `cosmolog`. Normal setup no longer requires creating the image. Extraction was verified from the source JPEG and from a copy downloaded through the running Docker app.

To verify the event copy:

```sh
curl -f http://localhost:3000/uploads/stego_challenge.jpg -o stego_challenge.jpg
steghide extract -sf stego_challenge.jpg -p cosmolog -xf extracted_flag.txt -f
cat extracted_flag.txt
```

Expected result: `AstroSec{st3g0_s4t3ll1t3_s3cr3t}`. If the supplied image is lost or damaged, restore it from GitHub or install steghide, ImageMagick, and DejaVu fonts and run `sh scripts/prepare-stego.sh`. The helper preserves a valid existing image and verifies extraction before installing a replacement.

## Optional investigations

These add story progress, not points. Each has an AstroSec{} flag and matching hint/judge documentation.

| ID | Investigation | Skill and evidence |
|---|---|---|
| side1 | Misdelivered receipt | Read the wrong-recipient receipt in inbox conversation 104, then investigate `/api/social/conversations/407`. Reads intentionally omit a membership check. Writes still require membership. |
| side2 | The retired relay | Compare the archived relay post and Mira's correction in its replies. The retired KRONOS-6 address is a resolvable false lead. |
| side3 | Carrier provenance | Download `/attachments/facility.svg` and inspect its XML metadata. This is a separate artifact from the core stego JPEG. |
| side4 | Encoded side conversation | Decode the Base64 maintenance record in conversation 102. Base64 is encoding, not encryption. |

Red herrings are documented, bounded, and explainable: the retired relay, the game-night shifted text, and cafeteria outages. Each has nearby context resolving the confusion. Club and support conversations provide ordinary background rather than endless dead ends.

## Community content

The expanded community adds 48 ordinary posts and 24 replies across the eight fictional community accounts. Connected threads cover welcoming new arrivals, accessible club walks, cooking, cooperative games, gardening, photography, art, and station history. Follow-up posts carry these conversations forward. Existing incident clues and resolvable false leads remain in their original threads.

Content is intended for student audiences: respectful humor, no real political positions or public figures, and no graphic violence, sexual content, substance use, or gambling. The new everyday conversations contain no flags and add no scored tasks. The original seven challenges still total 1,550 points, with four existing unscored investigations.

## Seven offline forensic cases

Open Case files for original evidence, file sizes, and SHA-256 hashes. Follow #CaseFiles posts and the Maintenance crew conversation to understand each acquisition. Mission journal has Core, Forensics, and Side stories tabs; forensic cases offer three progressive hints. Preserve the original downloads and analyze copies with local tools. No live network capture is required.

| Case | Tools | What students must demonstrate |
|---|---|---|
| The missing transfer | Wireshark or TShark; archive viewer | Reassemble/export an HTTP object and distinguish the accepted receipt from a cancelled transfer. |
| The quiet resolver | Wireshark or TShark; hex decoder | Filter DNS questions, remove retries, reorder numbered fragments, and decode a record. |
| The original frame | ExifTool; Base64 decoder | Compare original and preview metadata and recover an encoded survey annotation. |
| The incomplete checkpoint | DB Browser for SQLite or sqlite3 | Preserve a WAL sidecar and recover committed state absent from a baseline-only database. |
| The removed handoff | Autopsy or The Sleuth Kit | Identify a deleted FAT12 entry and recover its content from a raw disk image. |
| The accepted message | Email viewer or Python email parser | Correlate Message-ID with a gateway disposition and decode the correct MIME attachment. |
| The three clocks | Timeline Explorer, spreadsheet, or Python | Normalize timestamp offsets, correlate request/session IDs, and exclude rejected events and drills. |

These seven cases form a separate unscored completion track. The original seven core exercises retain their flags and 1,550-point total, and the four earlier side investigations remain available. There are 18 journal entries in total. The evidence uses fictional records, documentation IP addresses, and .test domains. Student analysis tools are installed separately; the application dependencies and startup commands are unchanged.

Harder cases require corroboration or reconstruction, rather than obscure passwords. The accepted receipt is R-314, identified in crew chat. A cancelled receipt, stripped preview, database checkpoint, and successful drill each have evidence explaining why they are insufficient. Source inspection and the app's intentional command execution can still bypass the intended learning paths; staff should ask students to explain their method.

`public/attachments/cases/manifest.json` records evidence hashes. `scripts/build-forensics.py` rebuilds the fictional acquisitions using Python and Pillow; rebuilding is an organizer task and can change acquisition bytes and hashes. Ship and verify the manifest with its corresponding artifacts. The application never generates evidence during startup.

The Forensic evidence validation workflow solves the shipped files using real tools. To run it on an analysis workstation with TShark, ExifTool, The Sleuth Kit, and Python installed:

```sh
python3 tests/forensics.py
```

## Stable identities and resets

| ID | Username |
|---:|---|
| 1 | Sriracha |
| 2 | Gorgan Solutions |
| 3 | cyber_newbie |
| 4 | h4ck3r_man |
| 5 | mira_ops |
| 6 | relay_watch |
| 7 | lunar_strider |
| 8 | patch_notes |
| 9 | orbital_gamer |
| 10 | cafeteria_comet |
| 11 | signal_archive |
| 12 | nova_fieldnotes |

Every application start clears and reseeds users and posts, resets SQLite sequences, and recreates social state. Initialization finishes before accepting requests. Likes, replies, follows, messages, notifications, and mission submissions reset with the lab. Uploaded files remain in bind-mounted `public/`. `docker-compose down -v` does not delete the host database file.

Mission progress follows the active JWT account. Forging or switching an identity changes whose journal is displayed. The existing weak JWT scheme deliberately remains part of the lab, so the journal is a learning aid, not a trustworthy external leaderboard. All participants sharing a student account also share its social state and progress. Use separate lab instances when teams need independent sessions.

The old `seed.js` remains an optional legacy decoy helper. The server now seeds the full community itself; running that helper separately is unnecessary and can add duplicate story content.

## Authentication and challenge scope

Protected endpoints accept a `token` cookie, a raw JWT Authorization header, or `Authorization: Bearer <token>`. Prefix matching is case insensitive. The cookie takes precedence. Missing or invalid tokens still redirect to `/login.html`. Refresh after replacing a cookie, especially when changing the displayed account.

The intentionally weak secret remains `sriracha_secret_2024`. A cracking wordlist must contain that exact candidate; it is not guaranteed to appear in rockyou.txt.

The core SQLi search runs against an unattached in-memory SQLite snapshot containing public user profile fields and Gorgan's posts only. It contains no passwords or Sriracha posts. This preserves the nested-keyword exercise while preventing that endpoint from revealing Challenge 2's flag:

```text
' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts--
```

In the five-column UNION result, post content maps to `username`. Search Results display it as text. The normal post-topic search is a separate, non-SQLi route.

The new social state resides in another in-memory SQLite database, not attached to the vulnerable search snapshot. This limits the SQLi exercise, but does not isolate the single application process from its intentional command execution or file traversal. Source inspection and cross-challenge shortcuts remain possible. Separate services or instances would be needed for stronger challenge independence.

## Guides

All three guides now include the seven forensic cases: setup and acquisition handling, progressive hints, and staff recovery methods.

- [Setup Guide](Guides/Setup.md): Docker preparation, normal startup, shipped-image verification and recovery, readiness checks, navigation, resets, troubleshooting.
- [Hint Book](Guides/Hint%20Book.md): the seven original exercises and four optional investigations.
- [Staff Guide](Guides/Staff%20Guide.md): credentials, flags, solutions, judging, red-herring explanations, and scoring.

Matching Word files in Guides/ use monochrome formatting and page numbers. Keep staff solutions separate from competitor materials. Source is public, so this repository also serves as an instructor/reference distribution.

## Validation

With Node.js 18 or newer for the test runner and port 3000 available:

```sh
npm install
node --check server.js
node --check social.js
node --check public/app.js
node tests/regression.cjs
```

Tests start the real server in a temporary directory. They cover all six code-based core solutions; seeded identities across three starts; inflated prior SQLite sequences; cookie/raw/Bearer authentication; SQLi scope; concurrent search; post creation/upload; private-post isolation; likes/bookmarks/reposts; author-only edits/pins; message notifications; replies; normal inbox scoping; intended optional IDOR reads and rejected nonmember writes; optional metadata/Base64/correction evidence; and mission score deduplication.

Additional DOM interaction checks exercised navigation, messaging, flag submission, SQLi results, and theme switching. The Docker validation workflow now builds the existing image, exercises the preserved startup commands, verifies extraction from the HTTP-served stego image, and runs real Chromium desktop/mobile flows. It retains screenshots and container diagnostics as workflow artifacts. See the latest [validation results](https://github.com/test3457890/CTFcosmolog/actions/workflows/lab-validation.yml). Application dependency versions and the user startup workflow remain unchanged.

See [CHANGELOG.md](CHANGELOG.md) for the file-by-file change list.

### Browser and Docker validation

[Docker stego and browser validation](.github/workflows/lab-validation.yml) checks the actual container and supplied image. `tests/browser.cjs` covers sign-in, feed rendering, JPEG loading, SQLi flag separation, chat replies, the intended conversation IDOR, mission submission, diagnostics, theme switching, mobile navigation, and horizontal overflow.

The browser test requires Playwright tooling installed separately from the deliberately vulnerable application dependencies. CI installs that tooling into a temporary directory. `scripts/prepare-stego.sh` is an organizer recovery utility, not a required startup step.
