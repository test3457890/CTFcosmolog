const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { run, all, get } = require('./sqlite');
const community = require('./story');
const forensicMissions = require('./forensics');
const capstone = require('./capstone');
const caseManifest = require('./public/attachments/cases/manifest.json');

const missions = [
  { id: 'core1', title: 'Gorgan internal memo', points: 100, kind: 'core', brief: 'Recover the private Gorgan post using the user search.', hint: 'One pass through a keyword filter may leave a second keyword behind.', flag: 'AstroSec{gorgan_sqli_flag_789}' },
  { id: 'core2', title: 'Sriracha private profile', points: 200, kind: 'core', brief: 'Investigate the identity claims in your session token.', hint: 'Sriracha is user ID 1. An offline candidate list must include the lab signing secret.', flag: 'AstroSec{url_hijacking_sriracha_123}' },
  { id: 'core3', title: 'Satellite image dead drop', points: 200, kind: 'core', brief: 'Download the Gorgan satellite image and recover its hidden file.', hint: 'The JPEG was prepared with steghide. The platform name is the passphrase.', flag: 'AstroSec{st3g0_s4t3ll1t3_s3cr3t}' },
  { id: 'core4', title: 'Satellite control access', points: 300, kind: 'core', brief: 'Reach the restricted satellite control panel.', hint: 'Which claim in a signed token controls administrator access?', flag: 'AstroSec{evil_ai_override_admin_accessed}' },
  { id: 'core5', title: 'Diagnostic command channel', points: 300, kind: 'core', brief: 'Investigate the relay diagnostic input and recover flag.txt.', hint: 'The diagnostic runs a shell command. A semicolon separates commands.', flag: 'AstroSec{bash_injection_satellite_uplink_secured}' },
  { id: 'core6', title: 'AI configuration', points: 300, kind: 'core', brief: 'Follow the mission brief download to the hidden configuration.', hint: 'public/uploads is two directories below the application root.', flag: 'AstroSec{lfi_directory_traversal_master}' },
  { id: 'core7', title: 'Forgotten debug route', points: 150, kind: 'core', brief: 'Find the developer endpoint that exposes account records.', hint: 'Investigate /api/debug/dump.', flag: 'AstroSec{api_info_disclosure_debug_endpoint}' },
  { id: 'side1', title: 'Misdelivered receipt', points: 0, kind: 'optional', brief: 'Follow the receipt in your inbox to the restricted operations conversation.', hint: 'The receipt identifies conversation 407. Does /api/social/conversations/407 check membership?', flag: 'AstroSec{handler_thread_recovered}' },
  { id: 'side2', title: 'The retired relay', points: 0, kind: 'optional', brief: 'Resolve the KRONOS-6 rumor using the public correction, then search the current relay tag.', hint: 'Compare relay_watch and mira_ops. The current tag is KRONOS-7.', flag: 'AstroSec{relay_handoff_confirmed}' },
  { id: 'side3', title: 'Carrier provenance', points: 0, kind: 'optional', brief: 'Inspect the metadata in the facility diagram attached to the maintenance thread.', hint: 'Download /attachments/facility.svg and inspect its XML metadata. This is separate from the core stego JPEG.', flag: 'AstroSec{facility_metadata_recovered}' },
  { id: 'side4', title: 'Encoded side conversation', points: 0, kind: 'optional', brief: 'Decode the maintenance message using the method mentioned in the same conversation.', hint: 'The side conversation uses Base64 encoding. It is not encryption.', flag: 'AstroSec{maintenance_message_decoded}' }
];
missions.forEach(m=>{if(m.kind==='core')m.number=Number(m.id.slice(4));});
forensicMissions.forEach((m,i)=>{m.number=8+i;});
missions.push(...forensicMissions,capstone.mission);
module.exports = async (app, db, auth) => {
  // Social state is not attached to the deliberately injectable search database.
  // This is still one vulnerable lab process, not a security boundary against RCE/LFI.
  const social = new sqlite3.Database(':memory:');
  await run(social, `CREATE TABLE capstone_checks (user_id INTEGER,checkpoint TEXT,UNIQUE(user_id,checkpoint))`);
  await run(social, `CREATE TABLE reactions (user_id INTEGER, post_id INTEGER, UNIQUE(user_id,post_id))`);
  await run(social, `CREATE TABLE reposts (user_id INTEGER, post_id INTEGER, UNIQUE(user_id,post_id))`);
  await run(social, `CREATE TABLE pins (user_id INTEGER PRIMARY KEY, post_id INTEGER)`);
  await run(social, `CREATE TABLE edits (post_id INTEGER PRIMARY KEY, edited_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await run(social, `CREATE TABLE bookmarks (user_id INTEGER, post_id INTEGER, UNIQUE(user_id,post_id))`);
  await run(social, `CREATE TABLE follows (user_id INTEGER, target_id INTEGER, UNIQUE(user_id,target_id))`);
  await run(social, `CREATE TABLE replies (id INTEGER PRIMARY KEY, user_id INTEGER, post_id INTEGER, content TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await run(social, `CREATE TABLE conversations (id INTEGER PRIMARY KEY, title TEXT)`);
  await run(social, `CREATE TABLE members (conversation_id INTEGER,user_id INTEGER)`);
  await run(social, `CREATE TABLE messages (id INTEGER PRIMARY KEY, conversation_id INTEGER, user_id INTEGER, content TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await run(social, `CREATE TABLE notifications (id INTEGER PRIMARY KEY,user_id INTEGER,content TEXT,post_id INTEGER,conversation_id INTEGER,seen INTEGER DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await run(social, `CREATE TABLE solves (user_id INTEGER,mission_id TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(user_id,mission_id))`);
  for (const u of community.people) {
    await run(db, 'INSERT INTO users (id,username,password,bio,profile_pic,is_private) VALUES (?,?,?,?,?,0)',
      [u.id,u.name,bcrypt.hashSync('password123',10),u.bio,'/images/default.jpg']);
  }
  const postIds = {};
  for (const [i,p] of community.posts.entries()) {
    const date = new Date(Date.UTC(2026, 10, 13, 8, i * 9)).toISOString().replace('T',' ').slice(0,19);
    const result = await run(db, 'INSERT INTO posts (user_id,content,image_url,is_private,created_at) VALUES (?,?,?,0,?)', [p.user,p.text,p.image||null,date]);
    if (p.key) postIds[p.key] = result.id;
  }
  await run(social,'INSERT INTO pins VALUES (?,?)',[6,postIds.relay]);
  await run(social,'INSERT INTO pins VALUES (?,?)',[8,postIds.facility]);
  await run(social,'INSERT INTO edits (post_id) VALUES (?)',[postIds.relay]);
  for (const reply of community.replies) await run(social,'INSERT INTO replies (user_id,post_id,content) VALUES (?,?,?)',[reply.user,postIds[reply.post],reply.text]);
  for (const id of [5,6,8]) await run(social,'INSERT INTO follows VALUES (?,?)',[3,id]);
  for (const postId of Object.values(postIds)) {
    for (const user of [5,7,9]) await run(social,'INSERT INTO reactions VALUES (?,?)',[user,postId]);
  }
  for (const thread of community.threads) {
    await run(social,'INSERT INTO conversations VALUES (?,?)',[thread.id,thread.title]);
    for (const member of thread.members) await run(social,'INSERT INTO members VALUES (?,?)',[thread.id,member]);
    for (const m of thread.messages) await run(social,'INSERT INTO messages (conversation_id,user_id,content) VALUES (?,?,?)',[thread.id,m.user,m.text]);
  }
  await run(social,'INSERT INTO notifications (user_id,content,post_id) VALUES (?,?,?)',[3,'Mira replied to the relay status thread.',postIds.relay]);
  await run(social,'INSERT INTO notifications (user_id,content,post_id) VALUES (?,?,?)',[3,'A maintenance diagram was added to the facility thread.',postIds.facility]);
  const npcReplyFor = (authorId, authorName, userText) => {
    const t = userText.toLowerCase();
    if (t.includes('flag') || t.includes('password') || t.includes('secret')) {
      return 'Nothing like that in the public feed. Check the actual evidence files or logs directly.';
    }
    const byId = {
      1: 'Coffee first, then comms. If something looks off on Gorgan, check the ticket queue.',
      5: t.includes('kronos') || t.includes('relay')
        ? 'Confirmed from night shift: KRONOS-7 is active. Always verify the handoff timestamp.'
        : 'Copy that. Keeping an eye on the relay bus until the morning shift takes over.',
      6: 'Good catch. We keep corrections pinned in the thread so nobody chases an old screenshot.',
      7: t.includes('walk') || t.includes('moon') || t.includes('5k')
        ? 'Meet by the east observation airlock at 18:00! Bring water.'
        : 'Slow miles still count out here. See you on the observation loop.',
      8: 'Logged it on the maintenance board. Check the original SVG or source notes before patching.',
      9: 'Haha, nice! Just remember half my posts are game-night clues, not station alerts.',
      10: 'The espresso unit is holding steady for now. Soup is still on deck 3.',
      11: 'Good instinct comparing revisions. Old records explain how rumors start.',
      12: 'Keep corroborating across sources. One isolated post never tells the whole story.'
    };
    return byId[authorId] || ('Thanks for checking in, @' + authorName + ' appreciates the update.');
  };
  const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(err => res.status(500).json({ error: 'Unable to complete this action.' }));
  const existsUser = async id => get(db,'SELECT id,username,bio,is_private FROM users WHERE id=?',[id]);
  const canRead = async (id,user) => get(db,'SELECT p.*,u.username FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=? AND (p.is_private=0 OR p.user_id=?)',[id,user]);
  const decorate = async (posts,user) => Promise.all(posts.map(async p => ({ ...p,
    likes: (await get(social,'SELECT COUNT(*) AS n FROM reactions WHERE post_id=?',[p.id])).n,
    liked: !!await get(social,'SELECT 1 FROM reactions WHERE post_id=? AND user_id=?',[p.id,user]),
    bookmarked: !!await get(social,'SELECT 1 FROM bookmarks WHERE post_id=? AND user_id=?',[p.id,user]),
    reposts: (await get(social,'SELECT COUNT(*) AS n FROM reposts WHERE post_id=?',[p.id])).n,
    reposted: !!await get(social,'SELECT 1 FROM reposts WHERE post_id=? AND user_id=?',[p.id,user]),
    pinned: !!await get(social,'SELECT 1 FROM pins WHERE post_id=?',[p.id]),
    edited_at: (await get(social,'SELECT edited_at FROM edits WHERE post_id=?',[p.id]))?.edited_at||null,
    replies: (await get(social,'SELECT COUNT(*) AS n FROM replies WHERE post_id=?',[p.id])).n
  })));
  app.get('/api/health', (req,res) => res.json({ ready: true, coreChallenges: 7, corePoints: 1550, optionalMissions: 4, forensicChallenges: 7, capstoneChallenges: 1, primaryChallenges: 15 }));
  app.get('/api/capstone',auth,wrap(async(req,res)=>{
    if(!await existsUser(req.user.id))return res.status(403).json({error:'Use an existing training account.'});
    const solved=(await all(social,'SELECT mission_id FROM solves WHERE user_id=?',[req.user.id])).map(r=>r.mission_id);
    const checks=(await all(social,'SELECT checkpoint FROM capstone_checks WHERE user_id=?',[req.user.id])).map(r=>r.checkpoint);
    res.json({title:'Relay operations review',simulation:true,files:capstone.files,checks,learning:capstone.learning.map(([id,skill,lesson],i)=>({id,number:i+1,skill,lesson,recorded:solved.includes(id)}))});
  }));
  app.post('/api/capstone/replay',auth,wrap(async(req,res)=>{
    if(!await existsUser(req.user.id))return res.status(403).json({error:'Use an existing training account.'});
    const result=capstone.replay(req.body);if(result.error)return res.status(400).json({error:result.error});
    if(result.checkpoint)await run(social,'INSERT OR IGNORE INTO capstone_checks VALUES (?,?)',[req.user.id,result.checkpoint]);
    res.json(result);
  }));
  app.post('/api/capstone/report',auth,wrap(async(req,res)=>{
    if(!await existsUser(req.user.id))return res.status(403).json({error:'Use an existing training account.'});
    const checks=(await all(social,'SELECT checkpoint FROM capstone_checks WHERE user_id=?',[req.user.id])).map(r=>r.checkpoint);
    if(!['baseline','bypass','patched'].every(c=>checks.includes(c)))return res.status(400).json({error:'Record the denied baseline, successful deployed replay, and denied patch preview before closing the case.'});
    if(!capstone.reportValid(req.body))return res.status(400).json({error:'The finding does not match the deployed code and replay evidence. Review the entry point, identity change, and archived alternative.'});
    await run(social,'INSERT OR IGNORE INTO capstone_checks VALUES (?,?)',[req.user.id,'report']);
    res.json({flag:capstone.mission.flag,summary:'Caller-controlled compatibility input changed a verified analyst into an archivist. Removing that override blocks the replay. The archived admin function was not loaded.'});
  }));
  app.get('/api/case-files',auth,(req,res)=>res.json(forensicMissions.map(m=>({id:m.id,title:m.title,tools:m.tools,difficulty:m.difficulty,filename:m.evidence,url:'/attachments/cases/'+m.evidence,...caseManifest.files[m.evidence]}))));
  app.get('/api/social/me',auth,wrap(async(req,res)=>{
    const user = await existsUser(req.user.id);
    if (!user) return res.status(404).json({error:'This token does not identify an existing profile.'});
    res.json(user);
  }));
  app.get('/api/social/people',auth,wrap(async(req,res)=>{
    const people=await all(db,'SELECT id,username,bio,is_private FROM users ORDER BY id');
    res.json(await Promise.all(people.map(async p=>({...p,
      following: !!await get(social,'SELECT 1 FROM follows WHERE user_id=? AND target_id=?',[req.user.id,p.id]),
      followers:(await get(social,'SELECT COUNT(*) n FROM follows WHERE target_id=?',[p.id])).n
    }))));
  }));
  app.get('/api/social/posts',auth,wrap(async(req,res)=>{
    let rows=await all(db,'SELECT p.*,u.username FROM posts p JOIN users u ON p.user_id=u.id WHERE p.is_private=0 OR p.user_id=? ORDER BY p.created_at DESC,p.id DESC',[req.user.id]);
    if (req.query.author) {
      const shared=(await all(social,'SELECT post_id FROM reposts WHERE user_id=?',[Number(req.query.author)])).map(p=>p.post_id);
      rows=rows.filter(p=>p.user_id===Number(req.query.author)||shared.includes(p.id));
      const pin=await get(social,'SELECT post_id FROM pins WHERE user_id=?',[Number(req.query.author)]);
      if(pin)rows.sort((a,b)=>Number(b.id===pin.post_id)-Number(a.id===pin.post_id));
    }
    if (req.query.q) rows=rows.filter(p=>(p.content+' '+p.username).toLowerCase().includes(String(req.query.q).toLowerCase()));
    if(req.query.feed==='following') {
      const ids=(await all(social,'SELECT target_id FROM follows WHERE user_id=?',[req.user.id])).map(p=>p.target_id);
      const shared=await all(social,'SELECT user_id,post_id FROM reposts');
      rows=rows.filter(p=>ids.includes(p.user_id)||p.user_id===req.user.id||shared.some(r=>r.post_id===p.id&&(ids.includes(r.user_id)||r.user_id===req.user.id))); 
    }
    if(req.query.feed==='bookmarks') {
      const ids=(await all(social,'SELECT post_id FROM bookmarks WHERE user_id=?',[req.user.id])).map(p=>p.post_id);
      rows=rows.filter(p=>ids.includes(p.id));
    }
    res.json(await decorate(rows,req.user.id));
  }));
  app.get('/api/social/posts/:id',auth,wrap(async(req,res)=>{
    const p=await canRead(req.params.id,req.user.id);
    if(!p)return res.status(404).json({error:'Post unavailable.'});
    const replies=await all(social,'SELECT * FROM replies WHERE post_id=? ORDER BY id',[p.id]);
    for(const r of replies)r.username=(await existsUser(r.user_id))?.username||'Unknown account';
    res.json({post:(await decorate([p],req.user.id))[0],replies});
  }));
  app.post('/api/social/posts/:id/:action',auth,wrap(async(req,res)=>{
    const p=await canRead(req.params.id,req.user.id);
    if(!p)return res.status(404).json({error:'Post unavailable.'});
    if(!await existsUser(req.user.id))return res.status(403).json({error:'Use an existing account.'});
    const action=req.params.action;
    let autoReply = null;
    if(action==='reply') {
      const content=typeof req.body.content==='string'?req.body.content.trim():'';
      if(!content||content.length>1000)return res.status(400).json({error:'Reply must contain 1 to 1,000 characters.'});
      await run(social,'INSERT INTO replies (user_id,post_id,content) VALUES (?,?,?)',[req.user.id,p.id,content]);
      if(p.user_id!==req.user.id){
        await run(social,'INSERT INTO notifications (user_id,content,post_id) VALUES (?,?,?)',[p.user_id,req.user.username+' replied to your post.',p.id]);
        if(p.user_id===1||(p.user_id>=5&&p.user_id<=12)){
          const replyText = npcReplyFor(p.user_id, p.username, content);
          await run(social,'INSERT INTO replies (user_id,post_id,content) VALUES (?,?,?)',[p.user_id,p.id,replyText]);
          await run(social,'INSERT INTO notifications (user_id,content,post_id) VALUES (?,?,?)',[req.user.id,'@'+p.username+' replied to you: '+replyText.slice(0,80),p.id]);
          autoReply = { user_id: p.user_id, username: p.username, content: replyText };
        }
      }
    } else if (action==='pin') {
      if(p.user_id!==req.user.id)return res.status(403).json({error:'Only the author can pin this post.'});
      const pin=await get(social,'SELECT post_id FROM pins WHERE user_id=?',[req.user.id]);
      if(pin?.post_id===p.id)await run(social,'DELETE FROM pins WHERE user_id=?',[req.user.id]);
      else await run(social,'INSERT OR REPLACE INTO pins VALUES (?,?)',[req.user.id,p.id]);
    } else if (action==='edit') {
      if(p.user_id!==req.user.id)return res.status(403).json({error:'Only the author can edit this post.'});
      const content=typeof req.body.content==='string'?req.body.content.trim():'';
      if(!content||content.length>280)return res.status(400).json({error:'Edited text must contain 1 to 280 characters.'});
      await run(db,'UPDATE posts SET content=? WHERE id=?',[content,p.id]);
      await run(social,'INSERT OR REPLACE INTO edits (post_id) VALUES (?)',[p.id]);
    } else {
      const table=action==='like'?'reactions':action==='bookmark'?'bookmarks':action==='repost'?'reposts':null;
      if(!table)return res.status(404).json({error:'Unknown action.'});
      const present=await get(social,`SELECT 1 FROM ${table} WHERE user_id=? AND post_id=?`,[req.user.id,p.id]);
      if(present)await run(social,`DELETE FROM ${table} WHERE user_id=? AND post_id=?`,[req.user.id,p.id]);
      else await run(social,`INSERT OR IGNORE INTO ${table} VALUES (?,?)`,[req.user.id,p.id]);
    }
    res.json({success:true,autoReply});
  }));
  app.post('/api/social/people/:id/follow',auth,wrap(async(req,res)=>{
    const target=Number(req.params.id);
    if(target===Number(req.user.id)||!await existsUser(target)||!await existsUser(req.user.id))return res.status(400).json({error:'Choose another existing account.'});
    if(await get(social,'SELECT 1 FROM follows WHERE user_id=? AND target_id=?',[req.user.id,target]))await run(social,'DELETE FROM follows WHERE user_id=? AND target_id=?',[req.user.id,target]);
    else await run(social,'INSERT OR IGNORE INTO follows VALUES (?,?)',[req.user.id,target]);
    res.json({success:true});
  }));
  app.get('/api/social/conversations',auth,wrap(async(req,res)=>{
    const rows=await all(social,'SELECT c.* FROM conversations c JOIN members m ON m.conversation_id=c.id WHERE m.user_id=? ORDER BY c.id',[req.user.id]);
    for(const r of rows)r.preview=(await get(social,'SELECT content FROM messages WHERE conversation_id=? ORDER BY id DESC LIMIT 1',[r.id]))?.content||'';
    res.json(rows);
  }));
  // OPTIONAL SIDE MISSION 1: intentionally missing membership check on reads.
  app.get('/api/social/conversations/:id',auth,wrap(async(req,res)=>{
    const c=await get(social,'SELECT * FROM conversations WHERE id=?',[req.params.id]);
    if(!c)return res.status(404).json({error:'Conversation not found.'});
    const messages=await all(social,'SELECT * FROM messages WHERE conversation_id=? ORDER BY id',[c.id]);
    for(const m of messages)m.username=(await existsUser(m.user_id))?.username||'Unknown account';
    const member=!!await get(social,'SELECT 1 FROM members WHERE conversation_id=? AND user_id=?',[c.id,req.user.id]);
    res.json({...c,messages,canReply:member});
  }));
  app.post('/api/social/conversations/:id',auth,wrap(async(req,res)=>{
    if(!await get(social,'SELECT 1 FROM members WHERE conversation_id=? AND user_id=?',[req.params.id,req.user.id]))return res.status(403).json({error:'You are not a member of this conversation.'});
    const content=typeof req.body.content==='string'?req.body.content.trim():'';
    if(!content||content.length>1000)return res.status(400).json({error:'Message must contain 1 to 1,000 characters.'});
    await run(social,'INSERT INTO messages (conversation_id,user_id,content) VALUES (?,?,?)',[req.params.id,req.user.id,content]);
    for(const member of await all(social,'SELECT user_id FROM members WHERE conversation_id=? AND user_id!=?',[req.params.id,req.user.id])){
      await run(social,'INSERT INTO notifications (user_id,content,conversation_id) VALUES (?,?,?)',[member.user_id,req.user.username+' sent a message.',Number(req.params.id)]);
    }
    res.json({success:true});
  }));
  app.get('/api/social/notifications',auth,wrap(async(req,res)=>res.json(await all(social,'SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC',[req.user.id]))));
  app.post('/api/social/notifications/read',auth,wrap(async(req,res)=>{
    await run(social,'UPDATE notifications SET seen=1 WHERE user_id=?',[req.user.id]);res.json({success:true});
  }));
  app.get('/api/missions',auth,wrap(async(req,res)=>{
    const solves=(await all(social,'SELECT mission_id FROM solves WHERE user_id=?',[req.user.id])).map(s=>s.mission_id);
    res.json({totalPoints:1550,score:missions.filter(m=>solves.includes(m.id)).reduce((n,m)=>n+m.points,0),
      missions:missions.map(({flag,...m})=>({...m,solved:solves.includes(m.id)}))});
  }));
  app.post('/api/missions/:id/submit',auth,wrap(async(req,res)=>{
    const mission=missions.find(m=>m.id===req.params.id);
    if(!mission)return res.status(404).json({error:'Mission not found.'});
    if(!await existsUser(req.user.id))return res.status(403).json({error:'Use an existing account to record progress.'});
    if(mission.id==='capstone15'&&!await get(social,'SELECT 1 FROM capstone_checks WHERE user_id=? AND checkpoint=?',[req.user.id,'report']))return res.status(400).json({error:'Complete the Operations console review before recording Challenge 15.'});
    if(typeof req.body.flag!=='string'||req.body.flag.trim()!==mission.flag)return res.status(400).json({error:'That flag does not match this mission.'});
    await run(social,'INSERT OR IGNORE INTO solves (user_id,mission_id) VALUES (?,?)',[req.user.id,mission.id]);
    res.json({success:true,points:mission.points});
  }));
};
