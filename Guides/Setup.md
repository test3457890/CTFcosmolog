# CosmoLog Setup and Learning Guide

Organizer runbook and student workstation preparation

Prepare and run the CosmoLog teaching lab, guide students through its social clues and forensic evidence, and finish with Challenge 15 in the simulated Operations console. This guide explains the current application and the checks an organizer should complete before a session.

| Track | Count | Scoring |
| --- | --- | --- |
| Original web challenges | 1 through 7 | 1,550 points total |
| Forensic investigations | 8 through 14 | Completion only |
| Operations capstone | 15 | Completion only |
| Optional side stories | 4 separate entries | Completion only |

There are 15 numbered challenges and four side-story entries, for 19 journal entries. The original AstroSec{} flags, seven point values, Node application dependencies, and Docker startup workflow are preserved. The new challenges do not add to the 1,550-point total.

### Quick start on a prepared host

```text
cd CTFcosmolog
touch database.sqlite
docker-compose up -d
```

Run those commands from the directory containing docker-compose.yml. Open http://localhost:3000 and sign in as cyber_newbie with password123. The alternative student account is h4ck3r_man with the same password. A first start builds the container and may take longer than later starts.

### How to use this guide

Read host preparation and startup first. Prepare student tools and verify the evidence before the event. Use the learning sequence and console walkthrough while teaching. Use operations, readiness, and troubleshooting when maintaining the lab. The Staff Guide contains answers and exact judging procedures; the Hint Book contains progressive hints and final methods.

This is a deliberately vulnerable education prototype. Use a dedicated authorized lab host and fictional student data. Its existing command execution and traversal exercises mean public source and cross-challenge shortcuts remain possible. Keep staff solutions separate from student handouts.

## Prepare the host and obtain the project

### Choose a lab host

Use a Linux training VM or prepared Docker host with Docker Engine, a working docker-compose command, internet access for the first build, and free port 3000. Ubuntu 24.04 is the runner used by the Docker and forensic validation jobs. A practical starting allocation is 2 GB RAM and 10 GB free disk space; analysis tools may need additional resources on the student workstation.

A student workstation and the application host can be different machines. The host runs CosmoLog. Workstations run browsers and analysis tools. Students analyze supplied captures, so they do not need capture access to the event network. Keep lab traffic within the network approved by the organizer.

### Obtain the current repository

```text
git clone https://github.com/test3457890/CTFcosmolog.git
cd CTFcosmolog
ls -l Dockerfile docker-compose.yml package.json server.js
ls -ld public Guides
```

If using GitHub Download ZIP instead, extract it once and enter the extracted directory, commonly CTFcosmolog-main. Archive folder names differ from older supplied ZIPs. Use the directory containing Dockerfile and docker-compose.yml; do not assume the old cosmolog-clone-ctf folder name.

### Confirm the required commands

```text
docker --version
docker-compose version
docker ps
```

If Docker is unavailable, follow the next page. If Docker works but docker-compose is missing, verify the Compose plugin and create the compatibility wrapper described there. If either command reports a permission error, resolve it before starting the application.

### Check the supplied assets

Confirm public/uploads/stego_challenge.jpg, public/attachments/cases/manifest.json, seven acquisition files in public/attachments/cases, capstone.js, and forensics.js are present. Case files are shipped assets, not generated at application startup. The Guides directory is for handouts and organizer references; it is not served as a normal application page.

## Install Docker and preserve the startup command

On a prepared Ubuntu VM, these distribution-package commands are a starting procedure. Package names and repository availability vary by distribution. Docker’s official Engine and Compose installation documentation is the fallback if a listed package is unavailable. Do not mix unrelated package installation methods without reviewing their instructions.

```text
sudo apt-get update
sudo apt-get install -y docker.io unzip git curl
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker "$USER"
```

Log out and back in after adding the Docker group, then verify docker ps. Use one consistent account for project files and Compose operations. Switching between sudo and non-sudo commands can create ownership problems. The Docker group controls the local Docker service; use it only for authorized organizers.

### Install or verify Compose

```text
sudo apt-get install -y docker-compose-v2
docker compose version
```

If that package is unavailable, install the Compose plugin using the supported method for the chosen Docker distribution. Confirm docker compose version succeeds before continuing. If docker-compose already works, leave it in place. Otherwise, create the classic-command wrapper below after checking that it will not replace an existing installation.

```text
command -v docker-compose
# Only if the classic command is absent and docker compose works:
printf '%s\n' '#!/bin/sh' 'exec docker compose "$@"' | \
  sudo tee /usr/local/bin/docker-compose >/dev/null
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
```

### Windows and macOS hosts

A prepared Linux VM is the simplest match for these commands. If using Docker Desktop, run the project in its supported shell/environment, confirm bind mounts work, and ensure the classic docker-compose command resolves to the working Compose installation. Keep touch database.sqlite before docker-compose up -d. Use official Docker installation instructions for the host operating system rather than copying Linux package commands into PowerShell.

References: https://docs.docker.com/engine/install/ and https://docs.docker.com/compose/install/linux/. The application Dockerfile remains unchanged; analysis tooling is installed separately.

## Start the application and verify access

```text
# From the project directory:
touch database.sqlite
ls -l database.sqlite
docker-compose up -d
docker-compose ps
curl -f http://localhost:3000/api/health
```

database.sqlite must be a regular file before the bind mount is created. Do not create a directory with that name. The service name is cosmolog. The first startup builds the image and installs the existing Node dependencies. If startup fails, inspect logs rather than repeatedly deleting the database.

```text
docker-compose logs --tail=100 cosmolog
```

### Expected health response

```text
{"ready":true,"coreChallenges":7,"corePoints":1550,
 "optionalMissions":4,"forensicChallenges":7,
 "capstoneChallenges":1,"primaryChallenges":15}
```

Field order is not significant. ready true means initialization finished. It does not replace the functional and evidence checks later in this guide.

### Browser and network check

Open http://localhost:3000 on the host. From an authorized student workstation, use http://HOST-IP:3000, replacing HOST-IP with the lab host address. hostname -I can help identify the VM address; choose the address reachable from that workstation. Confirm the VM networking mode and host firewall permit the approved lab connection. The supplied Compose file publishes port 3000.

Sign in with a student account, open Home, Explore, Messages, Case files, and Operations console. Check the site from the same network and browser students will use. If only the host can connect, investigate networking and firewall configuration before changing application code.

### Stable accounts

| ID | Account | Use |
| --- | --- | --- |
| 1 | Sriracha | Private-profile target |
| 2 | Gorgan Solutions | Original challenge organization |
| 3 | cyber_newbie | Student login |
| 4 | h4ck3r_man | Alternative student login |
| 5 through 12 | Fictional community accounts | Story and evidence context |

Every server start clears and reseeds application state with stable IDs. Use separate instances for independent teams. Two students sharing one account on the same instance share that account’s state and progress.

## Prepare the student experience

### Explain the investigation

Nova is following the evil.esAI incident through a fictional social community. Most posts are ordinary station life. Some reports lead to evidence; others resolve rumors or explain cancelled tests. Students should record why an item matters, not assume every unusual sentence contains a flag.

| Page | Student task |
| --- | --- |
| Home and profiles | Follow accounts; read posts and replies; inspect original attachments. |
| Explore | Search topics and use Search Users for account lookup. |
| Messages | Compare crew records, receipts, and ordinary side conversations. |
| Bookmarks | Keep links to sources used in the investigation. |
| Case files | Download original acquisitions and record integrity hashes. |
| Mission journal | Choose Core, Forensics, Side stories, or Final; submit flags. |
| Operations console | Audit the reconstructed backend and prove the final finding. |
| Station tools | Use the original diagnostic, download, and control exercises. |

### Use a simple evidence notebook

For each challenge, record the question, source post/message, downloaded filename, SHA-256, tool and action used, relevant result, rejected alternative, and final explanation. Store originals separately from working copies. A flag records completion; the notebook demonstrates the reasoning.

### Hints and instructor pacing

The forensic cases and final challenge have three progressively more specific hints. Ask students to explain their current evidence before opening the next hint. Start with smaller tasks, then pair students for correlation and recovery. Students may review any earlier challenge from the console Evidence tab; the capstone is not locked behind completing all 14 earlier flags.

### Materials to distribute

Provide the app address, student login, authorized scope, tool list, notebook expectations, and help procedure. The Hint Book includes final methods and flags later in each section, so distribute it according to the intended hint policy. The Staff Guide includes target passwords and all answers. Public source remains accessible; this lab evaluates learning, not resistance to source inspection.

## Install and check analysis tools

Install analysis tools before students arrive. Wireshark or TShark reads the supplied packet captures. ExifTool inspects metadata. DB Browser for SQLite or sqlite3 inspects database state. Autopsy or The Sleuth Kit handles the disk image. An archive viewer, text editor, and Python or spreadsheet support the remaining cases.

| Learning task | Graphical option | Command line option |
| --- | --- | --- |
| Network evidence | Wireshark | tshark |
| Photo metadata | Metadata viewer supporting EXIF comments | exiftool |
| Database evidence | DB Browser for SQLite | sqlite3 |
| Deleted files | Autopsy | fls and icat |
| Email export | Offline email viewer | Python email parser |
| Time correlation | Timeline Explorer or spreadsheet | Python datetime |

```text
# Organizer example on an Ubuntu analysis workstation:
sudo apt-get update
sudo apt-get install -y tshark libimage-exiftool-perl sqlite3 \
  sleuthkit unzip python3 steghide
```

During TShark installation, a capture-permission prompt may appear. Live capture is not required for these supplied-file exercises. For GUI tools on Windows or another platform, use the tool project’s official downloads and verify one sample file opens before the session. Do not require a specific GUI when an equivalent analysis method proves the same result.

```text
tshark --version
exiftool -ver
sqlite3 --version
fls -V
python3 --version
```

### Create an evidence workspace

```text
mkdir -p cosmolog-work/originals cosmolog-work/working cosmolog-work/notes
# Save downloaded acquisitions in originals.
# Copy an acquisition to working before extracting or opening it.
```

Use SHA-256 to compare a download with Case files. Linux: sha256sum filename. PowerShell: Get-FileHash filename -Algorithm SHA256. macOS: shasum -a 256 filename. A matching hash confirms the bytes match the supplied acquisition; it does not independently prove the story’s claims.

## Verify the original exercises and stego image

The seven original challenges still award 100, 200, 200, 300, 300, 300, and 150 points. Use the Staff Guide for exact solutions and flags. Confirm each exercise works from a normal student session and that the intended access restrictions remain visible before the student changes identity or input.

### Download and extract the supplied JPEG

```text
curl -f http://localhost:3000/uploads/stego_challenge.jpg \
  -o /tmp/cosmolog-stego.jpg
steghide extract -sf /tmp/cosmolog-stego.jpg -p cosmolog \
  -xf /tmp/cosmolog-stego-proof.txt -f
cat /tmp/cosmolog-stego-proof.txt
```

Expected result: AstroSec{st3g0_s4t3ll1t3_s3cr3t}. Test the downloaded file, because it is what students receive. The original JPEG challenge is separate from the optional facility.svg metadata exercise and from the later survey-photo forensic case.

### Recover a damaged carrier only when necessary

```text
sudo apt-get install -y imagemagick fonts-dejavu-core steghide
sh scripts/prepare-stego.sh
```

The recovery helper keeps a valid existing carrier. If the image is missing or fails extraction, restore the repository version or run the helper, then repeat download and extraction. Normal startup does not require image generation.

### Authentication checks

Protected endpoints accept a token cookie, raw JWT Authorization header, or Authorization: Bearer <token>. A cookie takes precedence. A missing or invalid token redirects to login. After editing a token cookie for a challenge, refresh the page before judging the result. Sriracha is always ID 1; ID 2 is Gorgan Solutions.

Verify the original SQLi payload at /api/users/search exposes the Gorgan flag without exposing Sriracha posts. The search snapshot is isolated from the new social state. Other intentional vulnerabilities remain; a source or command-execution shortcut does not demonstrate every intended skill. Ask students to show their method.

## Run the forensic learning sequence

| Challenge | Acquisition | Required reasoning |
| --- | --- | --- |
| 8 | relay-transfer.pcap | Export HTTP objects and match accepted receipt R-314. |
| 9 | resolver-window.pcap | Filter DNS; remove retries; reorder and decode fragments. |
| 10 | survey-photos.zip | Compare original metadata with a stripped preview. |
| 11 | handoff-snapshot.zip | Preserve database and WAL; inspect committed state. |
| 12 | removable-media.zip | Recover a deleted FAT12 entry from the image. |
| 13 | mail-review.zip | Match Message-ID to gateway disposition and decode MIME. |
| 14 | incident-timeline.zip | Normalize UTC offsets and correlate the production request. |

### Acquisition checks

Download all seven files from Case files and compare their hashes. Open both captures in Wireshark. Confirm the photo bundle has original and preview JPEGs, the SQLite bundle has handoff.sqlite and handoff.sqlite-wal, and the removable-media bundle contains relay-usb.img. Read the acquisition notes before interpreting the contents.

### Common reasoning traps

R-271 is a cancelled receipt, not the accepted handoff. The preview may look like the original while lacking its annotation. The SQLite main file alone lacks newer committed state. Deleted content can be recoverable without being active. A successful test event is not the production uplink. The records explain these alternatives so students can resolve them rather than guess.

### Preserve state while analyzing

Keep the SQLite main file and WAL together with their exact names in a writable working directory. Opening a working copy may checkpoint or remove a WAL, so retain the untouched ZIP. The FAT12 image begins at byte zero, without a partition table. Use the metadata address reported by the tool for the deleted entry; do not substitute a filename where the tool expects an address.

The captures and records are fictional. Documentation addresses and .test domains are evidence labels, not destinations students need to contact. Source inspection is possible in this public training app; review explanations as well as flags.

## Walk through Challenge 15

Challenge 15 is The compatibility exception. Open Operations console from the sidebar. The workspace reconstructs a relay service with deployment settings, source files, logs, archived code, and example credentials. The Source, Replay, Evidence, and Finding tabs form a single audit workflow.

### Source

Read README.txt, identify the configured entry point, follow imports, and compare defaults with runtime settings. Search the snapshot by path or text. Source is displayed as text; the viewer does not execute or edit it. A suspicious archived function or credential-looking string is only a lead until the deployment path and observed behavior support it.

### Evidence

The Evidence tab lists the 14 earlier numbered challenges with their learning objective and whether this account recorded the flag. That is journal history, not proof of which tool the student used. Review links return to the corresponding earlier challenge. Use the accepted receipt and production session established by the crew conversation and forensic timeline.

### Replay

The model identity is training-analyst regardless of a forged CosmoLog administrator claim. Choose a listed route and As deployed mode. Run a baseline with empty headers. Record its denied result. Then use evidence from the source/configuration and prior acquisitions to test a modified request. Compare verified role, effective role, identity source, and the final route decision.

### Patch preview

Keep the same successful request inputs and change only the mode to Patch preview. Verify the analyst is denied after the caller-controlled override is removed. The model returns a decision trace; it does not alter real services or install a backdoor. The HTTP API response contains a simulated status field, so a model denial is not necessarily an HTTP transport error.

### Finding

Identify the loaded source file responsible, the observed trust failure, the effective remediation, and an inactive alternative. Submission requires this account’s denied baseline, successful deployed replay, and denied patch-preview checkpoints. The final flag appears only after the finding is accepted. Record it under Final in Mission journal to complete Challenge 15.

## Teach the final review and judge the result

### Make the distinction observable

The archived admin function and example account file are deliberately visible but inactive. They teach students to distinguish retained content from reachable behavior. The live issue combines a default setting, a deployment override, caller-controlled input, and an authorization decision. Students should trace that chain rather than label every old file a backdoor.

### Ask for a defensible explanation

Ask the student to show the import path, identify which setting wins, name the input they control, compare the verified and effective roles, and show the resulting access decision. Then ask them to repeat the same request against the patch preview and explain why removing the override is more effective than renaming an archived file or deleting a comment.

### Evidence expected for completion

| Checkpoint | Expected model behavior |
| --- | --- |
| Baseline | Analyst request without the compatibility header is denied. |
| Access reproduced | Evidence-matched request reaches the archive only as deployed. |
| Fix verified | The same request is denied in patch-preview mode. |
| Finding accepted | Loaded source, trust failure, remediation, and inactive alternative match the traces. |
| Journal completion | Final flag recorded once; core score remains unchanged. |

### Balance challenge and accessibility

The relevant files are readable and searchable. Difficulty comes from deciding what is deployed, combining earlier findings, and demonstrating a cause and fix. Allow students to use the three hints in order. A student who identifies the issue quickly should still demonstrate the three replay states and explain the inactive alternative.

### Teaching boundaries

Discuss techniques and evidence without attributing this fictional issue to a nationality or real organization. The lesson is trust, configuration, execution paths, and verification. No real credentials, persistence mechanisms, arbitrary code execution, outbound requests, or real management endpoints are added by this simulator. The original intentionally vulnerable web exercises remain elsewhere in the lab.

## Operate reset back up and update the lab

```text
# Inspect
docker-compose ps
docker-compose logs --tail=100 cosmolog
# Stop
docker-compose down
# Start
touch database.sqlite
docker-compose up -d
# Rebuild after server source changes
docker-compose up -d --build
```

### Understand the reset boundary

Every server process start deletes and reseeds users/posts and recreates in-memory social state. Replies, likes, follows, messages, notifications, journal submissions, and capstone replay/report checkpoints reset. Uploaded files persist in the host public/ bind mount. docker-compose down -v does not delete the host database file.

Record student explanations and completion evidence before stopping or restarting. Copying database.sqlite does not preserve in-memory social progress or capstone checkpoints. Treat a restart as a new session. Do not rebuild or run reset checks during an active event unless the loss of progress is intentional.

### Back up project assets

After stopping the app, back up public/, the intended regular database.sqlite file, and any local configuration you maintain. Keep backups outside the repository and container build context. An asset backup protects uploads and local file changes; it is not a restoration mechanism for in-memory progress.

### Update a Git checkout

```text
git status --short
# Review and preserve any local changes before pulling.
git pull --ff-only
touch database.sqlite
docker-compose up -d --build
```

For ZIP installations, preserve local uploads before replacing files. Keep evidence artifacts with their matching manifest. A rebuilt acquisition may have different bytes; do not combine a new acquisition with an old hash. If replacing an older twitter-clone deployment, stop it with its original Compose file first. Use --remove-orphans only after confirming the containers belong to that lab project.

## Complete event readiness and validation

Run these checks on the actual event host before students begin. Repository CI verifies the shipped project but cannot verify the event VM’s networking, local permissions, or student tool installations.

Confirm health reports 15 primary challenges, seven forensic cases, one capstone, four side stories, and 1,550 core points.

Sign in from a student workstation. Open all navigation pages and confirm light/dark and narrow layouts remain usable.

Verify normal private-profile restrictions, then run the original seven solutions using the Staff Guide. Confirm SQLi does not expose Sriracha’s flag.

Download and extract the core stego JPEG; verify all seven acquisition hashes and sample tool compatibility.

Complete one member reply, bookmark, forensic submission, and capstone review. Repeated submissions must not inflate the core score.

Verify the capstone rejects a copied final flag before this account has the required replay/report checkpoints.

Before students arrive, restart once and confirm IDs remain stable while progress and capstone checkpoints reset.

Keep the final staff solutions out of competitor handouts and retain a separate place to record student methods.

### Automated checks on an organizer workstation

Use Node 22 or another supported test-runner version and installed project dependencies for regression checks. The suite starts a server on port 3000 in a temporary directory, so stop the separate lab first and preserve any event records. Analysis tools are needed only for the forensic validation command.

```text
npm install
node tests/regression.cjs
python3 tests/forensics.py
```

GitHub workflows cover regression, real Docker startup and HTTP-served stego extraction, Chromium desktop/mobile flows, and forensic solutions with actual analysis tools. Browser tooling is installed separately in CI. The regression suite verifies capstone report gating, account isolation, invalid inputs, inactive alternatives, patch behavior, scoring, and reset behavior.

## Troubleshoot the session

| Symptom | First checks |
| --- | --- |
| Site unreachable | Inspect service status/logs, port 3000, VM address, and approved firewall path. |
| Docker permission denied | Confirm the service runs and the login session has the intended group membership. |
| Database bind mount fails | Confirm database.sqlite is a regular file before startup; inspect unexpected directories before removing anything. |
| Old behavior after update | Rebuild server changes; refresh cached frontend files; verify the checkout used by Compose. |
| Login redirect on curl | Use a valid Bearer token; a token cookie takes precedence if supplied. |
| Wrong profile after cookie edit | Refresh after changing token; verify Sriracha ID 1 and Gorgan ID 2. |
| Stego extraction fails | Use a fresh downloaded original, passphrase cosmolog, and a verified carrier. |
| Acquisition hash differs | Redownload without conversion; compare manifest; restore the correct matching version. |
| SQLite accepted row missing | Extract fresh working copies; keep exact database/WAL names together and use a writable directory. |
| Disk image shows no partition | It is a FAT12 filesystem starting at byte zero; a partition table is not required. |
| Replay modified request denied | Compare source/configuration, exact receipt/session/relay values, route, mode, and header JSON. |
| Patch checkpoint not recorded | Use the same valid bypass inputs in Patch preview; an unrelated denied request is insufficient. |
| Final flag rejected | Accept the finding in the same account first, then record the flag under Challenge 15. |
| Progress disappeared | A restart resets in-memory state; verify the active JWT account and instance. |

### Useful reference pages

Docker: https://docs.docker.com/engine/install/ and https://docs.docker.com/compose/install/. Tool references and detailed solutions are in the Hint Book and Staff Guide. The authorization lesson follows the principle that role decisions must rely on trusted identity rather than caller-controlled metadata: https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/.
