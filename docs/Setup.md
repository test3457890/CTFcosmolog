# Download and set up CosmoLog

This is the non-spoiler startup guide. Detailed instructor solutions are in the separately distributed staff vault.

## 1 Choose the layout

Use Parrot Security OS with Docker as the primary setup, or Kali Linux with Docker as the alternative. Install the browser and forensic tools directly in the VM; run CosmoLog inside Docker in that same VM. For a scored event, keep the Parrot/Kali target under organizer control and use separate student analysis VMs. Read the [VM guide](Virtual%20Machine.md) before exporting an image for students.

## 2 Prepare Docker

Check first; do not replace an existing working installation:

```sh
docker --version
docker compose version
docker-compose version
```

Check the selected distribution's package availability first. On Kali, the official documentation uses `docker.io`, not the unrelated `docker` package. The same package name can be used on Parrot when available in its supported repositories:

```sh
sudo apt update
sudo apt install -y docker.io git curl unzip
sudo systemctl enable docker --now
sudo usermod -aG docker "$USER"
```

Log out and back in after changing group membership, then run `docker ps`. Only the organizer who controls the target should receive Docker permissions. Do not add competition participants to the target's Docker group.

Use Parrot/Kali distribution packages or the distribution's documented Docker installation path. Do not mix conflicting distribution and Docker CE packages. Do not add another distribution's repositories just to satisfy a package name.

For a distribution-package installation, inspect Compose availability:

```sh
apt-cache policy docker-compose-v2 docker-compose
```

Install the available Compose V2 package for the selected distribution, or follow the official Docker Compose plugin installation guide. Verify `docker compose version` or an already-working `docker-compose version` before proceeding.

If `docker compose` works but `docker-compose` is absent, provide the classic command used by this project. First run `command -v docker-compose`; skip the wrapper if that command already exists:

```sh
# Only when docker-compose is absent and docker compose works:
printf '%s\n' '#!/bin/sh' 'exec docker compose "$@"' | \
  sudo tee /usr/local/bin/docker-compose >/dev/null
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
```

Official references:

- [Docker on Kali](https://www.kali.org/docs/containers/installing-docker-on-kali/)
- [Parrot Docker documentation](https://www.parrotsec.org/docs/containers/general-usage-docker/)
- [Compose plugin](https://docs.docker.com/compose/install/linux/)

Parrot Security OS is the primary documented environment; Kali Linux is the alternative. Verify your chosen image before the event. Ubuntu 24.04 appears only as the automated CI runner and is not the recommended student setup.

## 3 Download the project

Using Git:

```sh
git clone https://github.com/test3457890/CTFcosmolog.git
cd CTFcosmolog
```

Using a ZIP:

1. Open the repository and choose Code, Download ZIP, or use the [main branch ZIP](https://github.com/test3457890/CTFcosmolog/archive/refs/heads/main.zip).
2. Extract it to a normal VM directory.
3. Open a terminal in the extracted folder, usually `CTFcosmolog-main`.
4. Confirm `Dockerfile`, `docker-compose.yml`, and `server.js` are present.

If the repository is private, Git/ZIP access requires organizer authorization. Use GitHub's normal sign-in or credential manager; never embed personal access tokens in shared commands.

## 4 Start the lab

Run from the project directory:

```sh
touch database.sqlite
docker-compose up -d
docker-compose ps
curl -f http://localhost:3000/api/health
```

The first start needs internet access to fetch the image and dependencies. Wait for the build to complete. The service is `cosmolog`. The database path must be a regular file, created before startup.

Open http://localhost:3000 in the VM browser. Sign in as `cyber_newbie` with `password123`, or `h4ck3r_man` with `password123`. These are application credentials, not Linux or staff-vault credentials.

The health response should report ready true, 15 primary challenges, seven core challenges totaling 1,550 points, seven forensic challenges, one capstone, and four optional missions.

## 5 Prepare analysis tools

The organizer should preinstall and verify tools before distributing the Parrot/Kali VM. Use tools already supplied with the chosen security distribution where available. Confirm Wireshark/TShark, ExifTool, sqlite3 or DB Browser for SQLite, Sleuth Kit or Autopsy, and an archive viewer. Supplied acquisitions are offline files; live capture is unnecessary.

An organizer can check common command-line tools with:

```sh
sh scripts/check-setup.sh
```

The check script reads command availability, Docker access, and app health. It does not install packages or change the system. Missing analysis tools are reported separately from mandatory Docker/Compose checks.

## 6 Stop update and reset

```sh
docker-compose logs --tail=100 cosmolog
docker-compose down
# After reviewing/pulling an organizer source update:
docker-compose up -d --build
```

A server restart resets users, social activity, journal progress, and capstone checkpoints. Uploaded files remain on the host. Record event progress externally before restarting. Copying the SQLite file does not preserve in-memory progress.

## Troubleshooting

| Problem | Check |
|---|---|
| Docker permission denied | Docker service status and current login's intended group membership |
| docker-compose missing | Verify Compose plugin, then create the compatibility wrapper only if needed |
| Cannot connect | Container logs, port 3000, and the VM networking layout |
| Works inside VM only | Use the VM browser, or configure the documented local-only NAT forwarding |
| Database mount fails | Check database.sqlite is a regular file before startup |
| Old app after update | Rebuild server changes and refresh cached browser files |
| Staff vault will not open | Download the HTML, open locally, and use the separate Unlock Key file; see Access |

For more help, use [Support](../SUPPORT.md). Include distribution, commands, errors, and sanitized logs. Do not attach credentials or answers.
