# VM preparation and handoff

## Choose the operating system

The standard handoff is a prepared Parrot Security OS VM with Docker and analysis tools installed. Kali Linux is the alternative. Students should be able to open the VM and start the lab without installing their toolkit.

| Option | Best fit | Preparation notes |
|---|---|---|
| Parrot Security OS with Docker | Primary student/practice environment | Preinstall and verify the browser, forensic tools, Docker, and Compose |
| Kali Linux with Docker | Alternative student/practice environment | Preinstall and verify the same browser and forensic tools |
| Windows or macOS host | Runs VirtualBox and the Linux guest | CosmoLog can remain entirely inside the Linux VM |

Use official downloads and image-verification instructions. Choose a guest image compatible with the host CPU; an x86 image is not a universal fit for ARM hosts.

- [Parrot downloads](https://www.parrotsec.org/download/)
- [Parrot virtualization documentation](https://www.parrotsec.org/docs/virtualization/)
- [Kali virtual machine downloads](https://www.kali.org/get-kali/#kali-virtual-machines)
- [Kali prebuilt VirtualBox import](https://www.kali.org/docs/virtualization/import-premade-virtualbox/)

## Layout A Self-contained practice VM

Run the Linux desktop, browser, analysis tools, and CosmoLog Docker container inside one VM. Students open localhost:3000 inside the guest. This is convenient for an independent practice image with no second target machine.

Anyone controlling that VM or its Docker service can inspect the target's source, runtime files, and answers. Do not use this layout to promise answer secrecy. Never include staff vaults, unlock keys, real credentials, organizer browser sessions, or decrypted documents in the image.

## Layout B Organizer target and student workstation

Keep a Parrot Security OS or Kali Linux target VM running Docker under organizer control. Give students a separate Parrot or Kali analysis VM and the target's approved app URL. Students use tools on their own workstation but receive no target shell, Docker access, source checkout, or shared folders containing organizer files.

Use the event's approved isolated network. Configure reachability for that network and verify from a student machine. Do not expose the intentionally vulnerable app through a home router or internet port-forwarding service.

## Prepare a practice VM

Suggested starting allocation: two virtual CPUs, 4 GB RAM, and a 30 GB dynamically allocated disk, adjusted for host capacity and chosen desktop. This is a practical starting point, not a measured minimum.

1. Import an official image or install the chosen OS in VirtualBox.
2. Use NAT for downloading updates and dependencies during preparation.
3. Set the VM login deliberately; record it separately from application logins. Replace any image-default credentials before handing it out.
4. Preinstall Docker/Compose, a browser, Wireshark/TShark, ExifTool, DB Browser for SQLite or sqlite3, Autopsy or The Sleuth Kit, and an archive viewer using the Setup guide. Verify the tools on the prepared image.
5. Download CosmoLog, start it, and verify health and student login.
6. Open sample acquisitions in the intended tools. Download all needed packages before planning an offline session.
7. Stop/restart the app once and confirm progress resets as expected.
8. Save a clean powered-off snapshot or export after completing the checks below.

VirtualBox contains the guest OS; Docker contains the app inside that guest. They can be used together. The app's published container port is 3000 on the guest.

## Access the app from the host if needed

The simplest route is the guest browser at localhost:3000. If you prefer the host browser, create a VirtualBox NAT forwarding rule for TCP with host IP 127.0.0.1, host port 3000, and guest port 3000. Then use http://127.0.0.1:3000 on the host. Use a different host port if occupied. This local-only rule is not the student-network layout for a multi-machine event.

## Export a ready-to-use image

Before exporting, remove organizer GitHub sessions/tokens, SSH keys, shell history containing secrets, staff files, unnecessary shared folders, and personal documents. Keep the encrypted staff vault and its key on a separate organizer device, not in the VM. Review retained browser downloads and mounted host folders too.

For a competition workstation, do not include the target source at all. For an all-in-one practice VM, clearly label that source inspection is possible. Power down cleanly, export the VM using VirtualBox's appliance export workflow, and test the exported copy before distribution. The repository does not currently ship a tested OVA or prebuilt VM image; this guide describes how the organizer prepares one.

## Include a short handoff card

Record the VM OS, VM login, app URL, app login, startup command, shutdown/reset behavior, assigned instance/team, available tools, and help route. Keep staff answers and vault credentials off this card. Ask recipients to verify their VM starts and the app opens before the event.

For offline use, test after disconnecting the VM's network. Initial Docker builds and missing packages require downloads; do not assume a freshly cloned repository works offline without preparation.

## Automated test environment

GitHub workflows currently use Ubuntu 24.04 runners for Docker/browser validation. Those runners are CI infrastructure, not a student VM recommendation. Keep that tested workflow unchanged while verifying the actual Parrot/Kali image before handoff.
