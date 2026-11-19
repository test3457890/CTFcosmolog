# Owner VM and Windows host test checklist

Use this on November 25, 2026 or later with the Windows host and an isolated Parrot or Kali VM. Record the VM image, Docker version, date, result, and screenshots of failures. Do not publish challenge flags, staff vault material, player credentials from a real event, private IP addresses, or participant data. No item here has been marked as completed.

## Isolation and setup

- [ ] Confirm the VM is isolated before starting the intentionally vulnerable service. On the default Compose setup, verify `docker compose port cosmolog 3000` reports `127.0.0.1:3000`. Never forward the port to the internet.
- [ ] Follow the setup and VM guides from a fresh checkout. Verify Node and Docker start without installing dependencies on the Windows host. Restart the container and check the health endpoint and startup log.
- [ ] If an event needs multi-machine access, use only the organizer-approved private VM interface and test from the separate student VM. Restore loopback binding after the event.
- [ ] Confirm that the staff vault, unlock key, private source documents, tests, `.git`, and local host paths are absent from the student image and screenshots.

## Student flows

- [ ] In a disposable lab account, try login, logout, invalid credentials, and reload. Open the feed, search, profiles, follows, likes, reposts, bookmarks, replies, inbox, notifications, and light/dark theme.
- [ ] Create a post with a small image; verify it appears. Try an image over 10 MB and verify a controlled rejection with no partial upload. Try unsupported files and missing fields.
- [ ] In the Mission journal, open all 15 numbered challenges and four optional stories. Test hint progression, an incorrect submission, a correct submission, and duplicate scoring. Do not expose answers in public reports.
- [ ] Download every Case file, compare the published hashes and byte counts, and verify the original stego image with the approved offline analysis tools. Do not change shipped evidence to make a test pass.
- [ ] Use the Operations console to inspect source snapshots, request replay, evidence history, and the final finding. Check back navigation and error states.
- [ ] Review every reachable button, menu, form, link, search, and setting at desktop and phone widths. Test keyboard focus, zoom, contrast, and readable error messages.

## Recovery and handoff

- [ ] Restart the app and verify documented progress reset behavior. Check which uploaded files persist. Never use shared accounts for a scored event with independent teams.
- [ ] Run the server regression, forensic evidence validation, and Docker/browser CI on the exact release commit. Compare the nine repository screenshots with the running app and replace stale previews with authentic captures.
- [ ] Record any difference between the Parrot/Kali VM behavior and Ubuntu CI. Keep detailed challenge solutions and network identifiers in private organizer notes.
