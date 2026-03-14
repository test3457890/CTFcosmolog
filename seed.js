const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite');
const defaultPassword = bcrypt.hashSync('password123', 10);

const decoyUsers = [
    ['lunar_strider', defaultPassword, 'Always tracking my moonwalks on my smartwatch. Love a good low-gravity 5K.', '/images/default.jpg', 0],
    ['orbital_gamer', defaultPassword, 'Catch me playing Halo on the station monitors during downtime.', '/images/default.jpg', 0],
    ['bash_astronaut', defaultPassword, 'Pop!_OS loyalist. I automate all our telemetry with Bash scripts.', '/images/default.jpg', 0],
    ['crater_wanderer', defaultPassword, 'Exploring the Martian trails.', '/images/default.jpg', 0],
    ['rover_sysadmin', defaultPassword, 'Just trying to keep the comms servers running.', '/images/default.jpg', 0]
];

console.log('Planting space-themed decoy users and posts...');

db.serialize(() => {
    decoyUsers.forEach(user => {
        db.run("INSERT OR IGNORE INTO users (username, password, bio, profile_pic, is_private) VALUES (?, ?, ?, ?, ?)", user);
    });

    setTimeout(() => {
        const posts = [
            { user: 'lunar_strider', text: 'Anyone want to hit the craters this weekend? Need to get my steps in.' },
            { user: 'orbital_gamer', text: 'Just logged another 2 hours in the pod. The orbital views never get old.' },
            { user: 'bash_astronaut', text: 'Spent 3 hours debugging a telemetry script only to realize I missed a syntax error.' },
            { user: 'crater_wanderer', text: 'Make sure you bring extra oxygen if you are heading out today, the solar radiation is brutal.' },
            { user: 'rover_sysadmin', text: 'Have you tried turning the rover off and on again?' },
            { user: 'lunar_strider', text: 'New personal best on my spacewalk today!' },
            { user: 'bash_astronaut', text: 'Kali Linux is great, but Pop!_OS is just so smooth for analyzing star maps.' }
        ];

        posts.forEach(post => {
            db.get("SELECT id FROM users WHERE username = ?", [post.user], (err, row) => {
                if (row) {
                    db.run("INSERT INTO posts (user_id, content, is_private) VALUES (?, ?, 0)", [row.id, post.text]);
                }
            });
        });
        
        console.log('Decoys successfully added to the timeline!');
    }, 1000);
});