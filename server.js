const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');  // Challenge 5: Command Injection
const fs = require('fs');                    // Challenge 6: LFI

const app = express();
const PORT = Number(process.env.PORT) || 3000;
fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });

// VULNERABILITY: Weak JWT Secret (Challenge 2 & 4)
// Students crack this with: hashcat -a 0 -m 16500 <token> rockyou.txt
const JWT_SECRET = 'sriracha_secret_2024';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'public/uploads/') },
    filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)) }
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database('./database.sqlite');

// Initialization completes before the server accepts players.
const { run, all, get } = require('./sqlite');
async function initialize() {
    await run(db, `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT,
        bio TEXT, profile_pic TEXT, is_private INTEGER DEFAULT 0, is_admin INTEGER DEFAULT 0
    )`);
    await run(db, `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, content TEXT, image_url TEXT,
        is_private INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    await run(db, 'DELETE FROM posts');
    await run(db, 'DELETE FROM users');
    await run(db, "DELETE FROM sqlite_sequence WHERE name IN ('users', 'posts')");
    const users = [
        [1, 'Sriracha', 'sriracha123', 'Customer service at Gorgan Solutions. Coffee before comms.', 1, 0],
        [2, 'Gorgan Solutions', 'gorgan456', 'Connecting people across the orbital frontier.', 1, 1],
        [3, 'cyber_newbie', 'password123', 'Nova on a Journey. Learning the network, one connection at a time.', 0, 0],
        [4, 'h4ck3r_man', 'password123', 'Root access or bust. Also here for the games.', 0, 0]
    ];
    for (const [id, username, password, bio, priv, admin] of users) {
        await run(db, 'INSERT INTO users (id,username,password,bio,profile_pic,is_private,is_admin) VALUES (?,?,?,?,?,?,?)',
            [id, username, bcrypt.hashSync(password, 10), bio, '/images/default.jpg', priv, admin]);
    }
    const posts = [
        [2, 'Welcome to the official Gorgan Solutions CosmoLog page.', null, 0],
        [2, 'PRIVATE: AstroSec{gorgan_sqli_flag_789} - Keep this safe!', null, 1],
        [2, 'Our new satellite uplink facility. Nothing suspicious here.', '/uploads/stego_challenge.jpg', 0],
        [1, 'Just joined this platform!', null, 0],
        [1, 'PRIVATE: My handler flag is AstroSec{url_hijacking_sriracha_123}', null, 1],
        [1, 'PRIVATE: I analyzed the station logs... the AI is making decisions on its own now. I am scared.', null, 1],
        [3, 'Has anyone noticed the comms going down in waves? #AIScare', null, 0],
        [2, 'Internal Memo: AI systems in Sector 7 are non-responsive to manual override. Proceed with caution.', null, 1],
        [4, 'The code is writing itself now. We are not the pilots anymore.', null, 0]
    ];
    for (const [user, content, image, priv] of posts) {
        await run(db, 'INSERT INTO posts (user_id,content,image_url,is_private) VALUES (?,?,?,?)', [user,content,image,priv]);
    }
    await require('./social')(app, db, authenticateToken);
}

// ── Auth Middleware ────────────────────────────────────────────────────────────
const authenticateToken = (req, res, next) => {
    const suppliedToken = req.cookies.token || req.headers['authorization'];
    const token = typeof suppliedToken === 'string'
        ? suppliedToken.replace(/^Bearer\s+/i, '')
        : suppliedToken;
    if (!token) return res.redirect('/login.html');
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/login.html');
    }
};

// ── Login ──────────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, username: user.username, is_private: user.is_private, is_admin: user.is_admin || 0 },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.cookie('token', token, { httpOnly: false });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// ── CHALLENGE 1: Filtered SQL Injection (Easy) ────────────────────────────────
// The filter strips UNION and SELECT but is NOT recursive.
// Bypass: ' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts--
// Goal: dump private posts from Gorgan Solutions
app.get('/api/users/search', authenticateToken, (req, res) => {
    let searchTerm = req.query.q || '';
    // VULNERABILITY: Single-pass filter — nested keywords survive one strip
    searchTerm = searchTerm.replace(/UNION/ig, '').replace(/SELECT/ig, '');
    const query = "SELECT id, username, bio, profile_pic, is_private FROM users WHERE username LIKE '%" + searchTerm + "%'";
    // Preserve the SQLi exercise without exposing another challenge's data.
    // A separate, unattached database contains only public user fields and
    // Gorgan's posts. A WHERE clause in the example payload is not a boundary.
    db.all('SELECT id, username, bio, profile_pic, is_private FROM users', [], (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all('SELECT posts.* FROM posts JOIN users ON posts.user_id = users.id WHERE users.username = ?',
            ['Gorgan Solutions'], (err, posts) => {
                if (err) return res.status(500).json({ error: err.message });
                const searchDb = new sqlite3.Database(':memory:');
                let setupError = null;
                const recordError = (err) => { if (err && !setupError) setupError = err; };
                searchDb.serialize(() => {
                    searchDb.run('CREATE TABLE users (id INTEGER, username TEXT, bio TEXT, profile_pic TEXT, is_private INTEGER)', recordError);
                    searchDb.run('CREATE TABLE posts (id INTEGER, user_id INTEGER, content TEXT, image_url TEXT, is_private INTEGER, created_at TEXT)', recordError);
                    users.forEach(user => searchDb.run('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
                        [user.id, user.username, user.bio, user.profile_pic, user.is_private], recordError));
                    posts.forEach(post => searchDb.run('INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?)',
                        [post.id, post.user_id, post.content, post.image_url, post.is_private, post.created_at], recordError));
                    searchDb.all(query, [], (err, results) => {
                        searchDb.close();
                        if (setupError || err) return res.status(500).json({ error: (setupError || err).message });
                        res.json(results);
                    });
                });
            });
    });
});

// ── CHALLENGE 2: JWT Forgery — bypass private profile (Medium) ───────────────
// Crack the secret with hashcat/jwt_tool, then forge a token with target's id
// Goal: view Sriracha's private posts
app.get('/api/user/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
    db.get('SELECT id, username, bio, profile_pic, is_private FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        // VULNERABILITY: Trusts JWT payload for identity — forge id to match target
        if (user.is_private === 1 && req.user.id != userId) {
            return res.status(403).json({ error: 'Access Denied: Account is private.' });
        }
        db.all('SELECT * FROM posts WHERE user_id = ? AND (is_private = 0 OR user_id = ?) ORDER BY created_at DESC', [userId, req.user.id], (err, posts) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ user, posts });
        });
    });
});

app.get('/api/posts', authenticateToken, (req, res) => {
    db.all(
        'SELECT posts.*, users.username, users.bio, users.profile_pic FROM posts JOIN users ON posts.user_id = users.id WHERE posts.is_private = 0 OR posts.user_id = ? ORDER BY posts.created_at DESC',
        [req.user.id],
        (err, posts) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(posts);
        }
    );
});

app.post('/api/posts', authenticateToken, upload.single('image'), (req, res) => {
    const { content, is_private } = req.body;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
    db.run('INSERT INTO posts (user_id, content, image_url, is_private) VALUES (?, ?, ?, ?)',
        [req.user.id, content, imageUrl, is_private === 'true' ? 1 : 0],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, success: true });
        }
    );
});

// ── CHALLENGE 4: Privilege Escalation via JWT Forgery (Medium-Hard) ───────────
// Crack JWT secret → forge token with is_admin:1 → call this endpoint
// python3: jwt.encode({'id':2,'username':'hacker','is_admin':1,'is_private':0}, 'sriracha_secret_2024', algorithm='HS256')
app.get('/api/admin/satellite-control', authenticateToken, (req, res) => {
    // VULNERABILITY: Trusts is_admin from JWT payload — forgeable
    if (req.user.is_admin === 1 || req.user.is_admin === true) {
        res.json({
            success: true,
            message: '🛰️ Admin access granted. evil.esAI uplink channel open.',
            intel: 'Broadcast origin: satellite KRONOS-7. Destroy it before the full download completes.',
            flag: 'AstroSec{evil_ai_override_admin_accessed}'
        });
    } else {
        res.status(403).json({
            error: 'Access Denied: Only Gorgan Solutions admins may access satellite controls.',
            hint: 'The secret might not be as strong as they think...'
        });
    }
});

// ── CHALLENGE 5: Bash Command Injection (Hard) ────────────────────────────────
// Endpoint simulates a satellite diagnostic ping tool.
// VULNERABILITY: User input is concatenated directly into a shell command.
// Payload: POST {"ip": "127.0.0.1; cat flag.txt"}
// The flag lives in flag.txt in the application root.
app.post('/api/satellite/ping', authenticateToken, (req, res) => {
    const targetIp = req.body.ip || '127.0.0.1';
    // VULNERABILITY: Unsanitized — try: 127.0.0.1; ls -la   or   127.0.0.1; cat flag.txt
    const command = 'ping -c 1 ' + targetIp;
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ output: stderr || error.message });
        res.json({ output: stdout });
    });
});

// ── CHALLENGE 6: Local File Inclusion (Hard) ──────────────────────────────────
// Students find the mission_brief.txt link, tamper with the file= param,
// and traverse directories to read etc/ai_config.conf which contains the flag.
// Payload: /api/download?file=../../etc/ai_config.conf
app.get('/api/download', (req, res) => {
    const filename = req.query.file;
    if (!filename) return res.status(400).json({ error: 'No file specified.' });
    // VULNERABILITY: No traversal sanitization — ../ sequences pass through path.join
    const filePath = path.join(__dirname, 'public', 'uploads', filename);
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.send(fileContent);
    } catch (err) {
        res.status(404).json({ error: 'File not found or unreadable.' });
    }
});

// ── CHALLENGE 7: API Information Disclosure (Easy-Medium) ─────────────────────
// A forgotten debug endpoint with no auth leaks all user records + hashes.
// Discoverable via directory brute-force (gobuster, ffuf, dirb).
// Students can crack the hashes offline to gain access as any account.
app.get('/api/debug/dump', (req, res) => {
    // VULNERABILITY: No authentication, exposes password hashes and all user data
    db.all('SELECT * FROM users', [], (err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            warning: '⚠️ DEBUG ENDPOINT — REMOVE BEFORE PRODUCTION',
            flag: 'AstroSec{api_info_disclosure_debug_endpoint}',
            users: users
        });
    });
});

initialize().then(() => {
    app.listen(PORT, () => console.log('CosmoLog ready on port ' + PORT));
}).catch(err => {
    console.error('CosmoLog initialization failed:', err.message);
    process.exitCode = 1;
    db.close();
});
