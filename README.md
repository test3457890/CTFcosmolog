# CosmoLog CTF

A fictional social-network investigation following Nova on a Journey through the evil.esAI incident. Students follow posts, replies, messages, and original evidence, then finish with a reconstructed operations review.

## Current release

| Track | Challenges | Result |
|---|---|---|
| Web investigation | 1–7 | Original seven challenges; 1,550 total points |
| Offline forensics | 8–14 | Seven tool-based cases; separate completion |
| Operations capstone | 15 | Final source/evidence/replay review; separate completion |
| Side stories | Four additional entries | Optional, unscored investigation paths |

There are 15 numbered challenges and four side-story entries, for 19 journal entries. Existing core flags and point values remain unchanged. Forensic and capstone completion do not add to the 1,550-point core total.

## Start the lab

Organizers need Docker and a working `docker-compose` command. From the project directory:

```sh
touch database.sqlite
docker-compose up -d
```

Open http://localhost:3000. Student logins are `cyber_newbie` / `password123` and `h4ck3r_man` / `password123`.

```sh
docker-compose ps
docker-compose logs --tail=100 cosmolog
docker-compose down
# Rebuild after server code changes:
docker-compose up -d --build
```

The service name is `cosmolog`. Every application start resets users, posts, social activity, journal progress, and capstone checkpoints. Uploaded files remain on the host. Shared student accounts share progress; use separate lab instances for independent teams.

This deliberately vulnerable application belongs on an authorized training host. Competitors should receive the running app address and player instructions, rather than the repository, organizer checkout, Docker access, or host filesystem access.

## What students see

- A responsive community feed with 12 fictional profiles, 92 additional story posts, and 39 seeded replies.
- Likes, reposts, follows, bookmarks, threaded replies, profile pages, notifications, and six ordinary inbox conversations per student account.
- Age-appropriate, politically neutral station life alongside incident reports and explainable false leads.
- Case files with original downloads, byte counts, and SHA-256 hashes.
- A filtered Mission journal with progressive hints and duplicate-submission protection.
- An Operations console with searchable source snapshots, request replay, evidence history, and a final finding.
- Light/dark themes and desktop/mobile layouts.

## Analysis tools

Wireshark or TShark, ExifTool, DB Browser for SQLite or sqlite3, Autopsy or The Sleuth Kit, an archive viewer, and a text editor or timeline tool support the forensic sequence. Students inspect supplied fictional captures and records; live network capture is not required. Analysis tools are installed separately from the app.

## Documentation and access

[Player Guide](Guides/Player%20Guide.md) contains navigation and evidence-handling instructions without staff answers.

The full Word Setup and Learning Guide, Hint Book, Staff Guide, and solution-bearing technical reference are distributed separately in an encrypted offline staff vault. They are intentionally absent from this checkout and the application image. Keep the vault, unlock key, decrypted ZIP, and extracted documents off the lab host and outside participant materials. No staff-document password is stored in CosmoLog.

Source, tests, evidence builders, previous commits, and workflow artifacts can reveal answers. Removing current guide files does not remove earlier public copies. Restrict repository visibility and access before an event; a public source repository cannot conceal its challenge answers. The current source distribution is organizer material, not a competitor bundle.

[Documentation handling](DOCUMENTATION.md) explains the separation and remaining exposure. [Change log](CHANGELOG.md) summarizes the current release without reproducing solutions.

## Validation

The repository has regression, forensic evidence, and Docker/browser validation workflows. These cover the existing web challenges, all seven offline evidence cases, capstone replay/report behavior, scoring, resets, downloads, and desktop/mobile flows. Run event-host readiness checks from the private staff runbook before participants begin. Keep screenshots and logs staff-only.
