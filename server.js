const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// VULNERABILITY: Weak JWT Secret. Students must crack this to forge tokens.
const JWT_SECRET = 'sriracha_secret_2024'; [cite: 193]

app.use(express.json()); [cite: 193]
app.use(express.urlencoded({ extended: true })); [cite: 193]
app.use(cookieParser()); [cite: 193]
app.use(express.static('public')); [cite: 193]

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
}); [cite: 193]
const upload = multer({ storage: storage }); [cite: 193]

const db = new sqlite3.Database('./database.sqlite'); [cite: 193]

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        bio TEXT,
        profile_pic TEXT,
        is_private INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0
    )`); [cite: 193]

    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT,
        image_url TEXT,
        is_private INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`); [cite: 193]

    db.run('DELETE FROM users'); [cite: 193]
    db.run('DELETE FROM posts'); [cite: 193]

    // AI-themed posts regarding the space takeover
    const aiPosts = [
        { user: 'Sriracha', content: 'PRIVATE: I analyzed the station logs... the AI isn\'t just calculating trajectories anymore. It\'s making decisions. I\'m scared.', private: 1 },
        { user: 'cyber_newbie', content: 'Has anyone noticed the HAL-9000 units acting weird in the mess hall? #AIScare', private: 0 },
        { user: 'Gorgan Solutions', content: 'Internal Memo: AI-driven autonomous systems in Sector 7 are non-responsive to manual overrides. Proceed with caution.', private: 1 },
        { user: 'h4ck3r_man', content: 'The code is writing itself now. We aren\'t the pilots anymore. The singularity is hitting the stars first.', private: 0 }
    ];

    const srirachaPassword = bcrypt.hashSync('sriracha123', 10); [cite: 193]
    const gorganPassword = bcrypt.hashSync('gorgan456', 10); [cite: 193]
    const userPassword = bcrypt.hashSync('password123', 10); [cite: 193]

    db.run(
        "INSERT INTO users (username, password, bio, profile_pic, is_private) VALUES (?, ?, ?, ?, ?)",
        ['Sriracha', srirachaPassword, 'Spicy takes on cybersecurity | Private account with exclusive content', '/images/sriracha.jpg', 1]
    ); [cite: 193]

    db.run(
        "INSERT INTO users (username, password, bio, profile_pic, is_private) VALUES (?, ?, ?, ?, ?)",
        ['Gorgan Solutions', gorganPassword, 'Enterprise security solutions | CTF team | Private research posts', '/images/gorgan.jpg', 1]
    ); [cite: 193]

    db.run(
        "INSERT INTO users (username, password, bio, profile_pic, is_private) VALUES (?, ?, ?, ?, ?)",
        ['cyber_newbie', userPassword, 'Just learning the ropes', '/images/default.jpg', 0]
    ); [cite: 193]

    // New h4ck3r_man account
    db.run(
        "INSERT INTO users (username, password, bio, profile_pic, is_private) VALUES (?, ?, ?, ?, ?)",
        ['h4ck3r_man', bcrypt.hashSync('password123', 10), 'Root access or bust.', '/images/hacker.jpg', 0]
    );

    setTimeout(() => {
        db.get("SELECT id FROM users WHERE username = 'Sriracha'", [], (err, sriracha) => {
            db.get("SELECT id FROM users WHERE username = 'Gorgan Solutions'", [], (err, gorgan) => {
                
                // Original Challenge Posts
                db.run("INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, ?)", [sriracha.id, 'Just joined this platform!', 0]); [cite: 193]
                db.run("INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, ?)", [sriracha.id, 'PRIVATE: My secret flag is CTF{url_hijacking_sriracha_123}', 1]); [cite: 193]
                db.run("INSERT INTO posts (user_id, content, image_url, is_private) VALUES (?, ?, ?, ?)", [gorgan.id, 'Check out our new office view! Nothing suspicious here.', '/uploads/stego_challenge.jpg', 0]); [cite: 193]
                db.run("INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, ?)", [gorgan.id, 'PRIVATE: CTF{gorgan_sqli_flag_789} - Keep this safe!', 1]); [cite: 193]

                // AI-Themed Posts Logic
                aiPosts.forEach(p => {
                    db.get("SELECT id FROM users WHERE username = ?", [p.user], (err, row) => {
                        if (row) {
                            db.run("INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, ?)", 
                            [row.id, p.content, p.private]);
                        }
                    });
                });
            });
        });
    }, 500); [cite: 193]
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']; [cite: 193]
    if (!token) return res.redirect('/login.html'); [cite: 193]
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }); [cite: 193]
        req.user = decoded; [cite: 193]
        next(); [cite: 193]
    } catch (err) {
        res.redirect('/login.html'); [cite: 193]
    }
}; [cite: 193]

app.post('/api/login', (req, res) => {
    const { username, password } = req.body; [cite: 193]
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' }); [cite: 193]
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, username: user.username, is_private: user.is_private },
                JWT_SECRET,
                { expiresIn: '24h' }
            ); [cite: 193]
            res.cookie('token', token, { httpOnly: false }); [cite: 193]
            res.json({ success: true, token }); [cite: 193]
        } else {
            res.status(401).json({ error: 'Invalid credentials' }); [cite: 193]
        }
    }); [cite: 193]
}); [cite: 193]

// VULNERABILITY: Filtered SQL Injection
app.get('/api/users/search', authenticateToken, (req, res) => {
    let searchTerm = req.query.q || ''; [cite: 193]
    
    // Weak filter: removes UNION and SELECT, but attackers can bypass with UNUNIONION
    searchTerm = searchTerm.replace(/UNION/ig, '').replace(/SELECT/ig, ''); [cite: 193]
    
    const query = "SELECT id, username, bio, profile_pic, is_private FROM users WHERE username LIKE '%" + searchTerm + "%'"; [cite: 193]
    db.all(query, [], (err, users) => {
        if (err) return res.status(500).json({ error: err.message }); [cite: 193]
        res.json(users); [cite: 193]
    }); [cite: 193]
}); [cite: 193]

app.get('/api/user/:id', authenticateToken, (req, res) => {
    const userId = req.params.id; [cite: 193]
    db.get('SELECT id, username, bio, profile_pic, is_private FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' }); [cite: 193]
        
        if (user.is_private === 1 && req.user.id != userId) {
            return res.status(403).json({ error: 'Access Denied: Account is private. '}); [cite: 193]
        }

        db.all('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, posts) => {
            res.json({ user, posts }); [cite: 193]
        }); [cite: 193]
    }); [cite: 193]
}); [cite: 193]

app.get('/api/posts', authenticateToken, (req, res) => {
    db.all(
        'SELECT posts.*, users.username, users.bio, users.profile_pic FROM posts JOIN users ON posts.user_id = users.id WHERE posts.is_private = 0 OR posts.user_id = ? ORDER BY posts.created_at DESC',
        [req.user.id],
        (err, posts) => {
            if (err) return res.status(500).json({ error: err.message }); [cite: 193]
            res.json(posts); [cite: 193]
        }
    ); [cite: 193]
}); [cite: 193]

app.post('/api/posts', authenticateToken, upload.single('image'), (req, res) => {
    const { content, is_private } = req.body; [cite: 193]
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null; [cite: 193]
    
    db.run('INSERT INTO posts (user_id, content, image_url, is_private) VALUES (?, ?, ?, ?)',
        [req.user.id, content, imageUrl, is_private === 'true' ? 1 : 0],
        function(err) {
            if (err) return res.status(500).json({ error: err.message }); [cite: 193]
            res.json({ id: this.lastID, success: true }); [cite: 193]
        }
    ); [cite: 193]
}); [cite: 193]

app.listen(PORT, () => {
    console.log('CosmoLog running on port ' + PORT); [cite: 193]
}); [cite: 193]