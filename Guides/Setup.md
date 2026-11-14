# CosmoLog Setup Guide

Installation and event operations

Prepare and run the corrected seven-challenge CosmoLog training app. The required startup sequence remains touch database.sqlite followed by docker-compose up -d. This guide covers the current application, including the manually prepared steganography image.

## Before you begin

Use an Ubuntu training VM with Docker Engine, a working docker-compose command, and the project ZIP. The original installation target is Ubuntu 20.04 or newer, with at least 2 GB RAM and 10 GB free disk space. Docker installation needs administrator access and internet connectivity. Keep the VM on the authorized lab network; this app deliberately permits command execution and file traversal.

### Confirm the required commands

```text
docker --version
docker-compose version
```

If either command is missing, complete the installation steps on the next page before continuing. Package availability and Compose plugin locations depend on the Ubuntu image. The installation commands below are retained from the supplied Ubuntu guide and were not executed in this review environment.

## Quick start for a prepared VM

```text
cd ~/Downloads
unzip -o cosmolog-clone-ctf-updated.zip
cd cosmolog-clone-ctf
touch database.sqlite
docker-compose up -d
```

Open http://localhost:3000. Sign in as cyber_newbie with password123. The alternative student account is h4ck3r_man with the same password. For another lab machine, replace localhost with the VM address returned by hostname -I, keeping port 3000.

Do not score Challenge 3 until the image has been created and extraction verified using the instructions below. Application startup alone does not make that challenge ready.

## What this release preserves

Seven challenges, all existing AstroSec{} flags, and 1,550 points. Sriracha is user ID 1, Gorgan Solutions is ID 2, cyber_newbie is ID 3, and h4ck3r_man is ID 4. Every server startup clears and reseeds users and posts with these stable IDs. Uploaded files remain on the host.

## Install Docker and Compose

Run the following commands separately in a terminal. The first command updates the package list; the following commands install and start Docker.

```text
sudo apt-get update
sudo apt-get install -y docker.io unzip
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker "$USER"
newgrp docker
```

Log out and back in if the group change is not active. Confirm docker ps works before proceeding. Avoid mixing sudo and non-sudo Compose invocations because that can leave project files with inconsistent ownership.

### Provide the classic docker-compose command

```text
sudo apt-get install -y docker-compose-v2
docker compose version
```

If the V2 plugin works but docker-compose is missing, create a small compatibility wrapper. If docker-compose already works, skip this step.

```text
printf '%s\n' '#!/bin/sh' 'exec docker compose "$@"' | sudo tee /usr/local/bin/docker-compose >/dev/null
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
```

If docker-compose-v2 is unavailable, install the Compose V2 plugin supported by your VM distribution, then verify docker compose version before creating the wrapper. Do not use a guessed plugin filesystem path.

### Extract and check the project

```text
cd ~/Downloads
unzip -o cosmolog-clone-ctf-updated.zip
cd cosmolog-clone-ctf
ls -la
touch database.sqlite
ls -l database.sqlite
```

Confirm Dockerfile, docker-compose.yml, package.json, server.js, public/, etc/, and flag.txt exist. database.sqlite must be a regular file. The Guides directory in the ZIP is separate from the application. Keep staff credentials and solutions out of competitor distribution.

### Replacing an older installation

Stop the old twitter-clone service with its original Compose file before replacing files. If the old container remains in the same Compose project, run docker-compose up -d --build --remove-orphans once. Normal startup remains docker-compose up -d.

## Prepare the steganography image

The project ZIP does not include stego_challenge.jpg. Create it before a scored event. An existing suitable JPEG can be used instead of generating a plain carrier. Embedding changes the image bytes, so perform these steps on the lab copy.

```text
cd ~/Downloads/cosmolog-clone-ctf
sudo apt-get install -y steghide imagemagick
mkdir -p public/uploads
convert -size 640x480 xc:gray public/uploads/stego_challenge.jpg
```

Embed the existing Challenge 3 flag with the existing passphrase cosmolog. The temporary hidden file is an organizer setup artifact, not a download for competitors.

```text
printf '%s\n' 'AstroSec{st3g0_s4t3ll1t3_s3cr3t}' > /tmp/cosmolog-hidden-flag.txt
steghide embed -cf public/uploads/stego_challenge.jpg \
  -sf /tmp/cosmolog-hidden-flag.txt -p cosmolog -f
```

Start the application, then verify extraction from a downloaded copy. This checks the actual file players receive rather than only the source image.

```text
touch database.sqlite
docker-compose up -d
curl -f http://localhost:3000/uploads/stego_challenge.jpg \
  -o /tmp/cosmolog-downloaded-stego.jpg
steghide extract -sf /tmp/cosmolog-downloaded-stego.jpg \
  -p cosmolog -xf /tmp/cosmolog-extracted-flag.txt -f
cat /tmp/cosmolog-extracted-flag.txt
```

Expected result: AstroSec{st3g0_s4t3ll1t3_s3cr3t}. If embedding or extraction fails, resolve it before normal Challenge 3 scoring. A running site or visible JPEG does not prove that the hidden flag can be recovered. The Staff Guide retains the existing judge-discretion fallback.

After verifying the result, remove the temporary setup and extraction files if they are no longer needed. Do not remove public/uploads/stego_challenge.jpg.

### Verification limits

Local regression checks passed for stable IDs, authentication, scoped SQL injection, JWT and admin forgery, command injection, traversal, debug disclosure, posting, and upload. Docker installation, image build, container runtime, and manual stego preparation have not been executed in this review environment. Run the readiness checks on the actual lab VM.

## Run and verify a session

### Routine operation

```text
# Start
docker-compose up -d
# Inspect the renamed service
docker-compose ps
docker-compose logs -f cosmolog
# Stop
docker-compose down
# Rebuild after server code changes
docker-compose up -d --build
```

Press Ctrl+C to exit live logs. Stopping the log viewer does not stop the application. Run commands from the directory containing docker-compose.yml.

### Event readiness checks

- Open the login page and sign in with a student account. Confirm the public timeline and user search load.

- Confirm Sriracha is ID 1 and a normal student cannot open her private profile.

- Use the Staff Guide to verify the Challenge 1 payload returns Gorgan content and does not reveal the Sriracha flag.

- Verify Bearer authentication with curl and check the remaining challenge solutions using the Staff Guide.

- Download the stego image and recover its hidden flag with passphrase cosmolog.

- Confirm each player or team can reach the VM on the intended lab network. Keep the staff guide and target passwords separate from their materials.

### Scoring

| Challenge | Points |
| --- | --- |
| 1 SQL injection | 100 |
| 2 JWT forgery | 200 |
| 3 Steganography | 200 |
| 4 Privilege escalation | 300 |
| 5 Command injection | 300 |
| 6 File traversal | 300 |
| 7 API disclosure | 150 |
| Total | 1,550 |

## Resets and troubleshooting

### Understand the reset behavior

Every application process start deletes and reseeds users and posts. Student-created database content is lost at that point. The database file is a host bind mount, so docker-compose down -v does not delete it. Uploaded files remain in public/. An ordinary down followed by up already produces the application reset.

If the database file itself must be recreated, stop the app first, confirm you are in the project directory, and remove only the intended file. If database.sqlite is unexpectedly a directory, inspect it before removing anything.

```text
docker-compose down
pwd
ls -ld database.sqlite
# Only when database.sqlite is the intended regular file:
rm database.sqlite
touch database.sqlite
docker-compose up -d
```

### Common problems

#### Site does not load

Check docker-compose ps and docker-compose logs cosmolog. Confirm port 3000 is available. Use docker ps and sudo lsof -i :3000 to identify a conflict before stopping any process.

#### Docker permission denied

Confirm Docker is running and that your new docker group membership is active. Log out and back in, then try docker ps again.

#### Bearer request redirects to login

Use a valid JWT with Authorization: Bearer <token>. A token cookie takes precedence over the header. Invalid or missing tokens still redirect to /login.html.

#### Forged cookie has no effect

Refresh the page after editing the token cookie. The page caches its token when loaded. Sriracha is ID 1; ID 2 is Gorgan Solutions.

#### Changes do not appear

Rebuild server changes with docker-compose up -d --build. public/ is bind mounted, so browser caching can also hide page changes.

#### Image missing or flag cannot be extracted

Complete and verify the image preparation procedure. Do not count Challenge 3 as ready solely because the app starts.

## Using the community edition

The seven core exercises still total 1,550 points. Four optional investigations are unscored. Their flags use AstroSec{} and are documented in the Hint Book and Staff Guide.

### Home and profiles

Home has For you and Following feeds. Twelve profiles and 36 additional story posts provide context. Like, reply, follow, bookmark, or open a timestamp to view a post conversation. Initials avatars avoid missing profile image dependencies.

### Explore and private accounts

Explore has two searches: topic search for posts and Search Users for account lookup. The original SQL injection exercise remains in Search Users. Sriracha remains ID 1 and Gorgan Solutions ID 2. Private profile access and existing JWT forgery remain part of the core lab.

### Messages and notifications

Each student account starts with six visible inbox conversations. Maintenance, receipts, club chat, games, and support provide scripted context. Members can send replies. Conversation 407 is intentionally absent from the normal student inbox but has a vulnerable read endpoint for an optional investigation.

### Mission journal and tools

Submit recovered flags in Mission journal. Accepted core flags contribute their existing points once. Side investigations record completion for zero points. Station tools contains the diagnostics input, satellite control button, and mission brief download.

### Progress and resets

All social state and submissions reset when the server restarts. Progress follows the active JWT account; switching or forging an identity changes the displayed journal. Shared accounts share progress. Use separate instances for independent teams. This is a learning aid rather than an authoritative competition leaderboard.

### Additional checks

Confirm /api/health reports seven core challenges, 1,550 core points, and four optional missions. Verify a reply, a bookmark, a member message, and a flag submission. A duplicate core flag must not add points twice. After a restart, profiles retain stable IDs and social activity returns to the scenario seed.

The core stego JPEG is still prepared manually. The new facility.svg attachment is already supplied and belongs to a separate optional metadata exercise. The basic startup remains touch database.sqlite followed by docker-compose up -d.
