// Exercises the real server in a temporary directory, leaving the lab database alone.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const jwt = require('jsonwebtoken');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cosmolog-test-'));
const secret = 'sriracha_secret_2024';
const flags = [
  'AstroSec{gorgan_sqli_flag_789}', 'AstroSec{url_hijacking_sriracha_123}',
  'AstroSec{st3g0_s4t3ll1t3_s3cr3t}', 'AstroSec{evil_ai_override_admin_accessed}',
  'AstroSec{bash_injection_satellite_uplink_secured}',
  'AstroSec{lfi_directory_traversal_master}', 'AstroSec{api_info_disclosure_debug_endpoint}'
];
let child;
let logs = '';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function request(url, options = {}) {
  return fetch('http://127.0.0.1:3000' + url, { redirect: 'manual', ...options });
}
async function start() {
  child = spawn(process.execPath, ['server.js'], {
    cwd: temp, env: { ...process.env, NODE_PATH: path.join(root, 'node_modules') },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', b => { logs += b; });
  child.stderr.on('data', b => { logs += b; });
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw Error('Server exited: ' + logs);
    try {
      const debug = await (await request('/api/debug/dump')).json();
      const token = jwt.sign({ id: 1 }, secret);
      const r = await request('/api/user/1', { headers: { Authorization: 'Bearer ' + token } });
      const profile = await r.json();
      if (debug.users.length === 12 && JSON.stringify(profile).includes(flags[1])) return debug;
    } catch {}
    await wait(100);
  }
  throw Error('Startup timed out: ' + logs);
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const closed = new Promise(resolve => child.once('exit', resolve));
  child.kill('SIGTERM');
  await closed;
}
(async () => {
  // Fail early if another app occupies the fixed application port.
  const net = require('node:net');
  await new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(3000, '127.0.0.1', () => probe.close(resolve));
  });
  for (const name of ['server.js', 'social.js', 'forensics.js', 'capstone.js', 'sqlite.js', 'story.js', 'public', 'etc', 'flag.txt']) {
    fs.cpSync(path.join(root, name), path.join(temp, name), { recursive: true });
  }
  fs.closeSync(fs.openSync(path.join(temp, 'database.sqlite'), 'a'));
  let debug = await start();
  const expected = [[1,'Sriracha'],[2,'Gorgan Solutions'],[3,'cyber_newbie'],[4,'h4ck3r_man'],[5,'mira_ops'],[6,'relay_watch'],[7,'lunar_strider'],[8,'patch_notes'],[9,'orbital_gamer'],[10,'cafeteria_comet'],[11,'signal_archive'],[12,'nova_fieldnotes']];
  assert.deepEqual(debug.users.map(u => [u.id, u.username]), expected);
  assert.equal(debug.flag, flags[6]);
  assert(debug.users.every(u => /^\$2[aby]\$/.test(u.password)));
  assert.equal((await request('/')).status, 200);
  assert.equal((await request('/login.html')).status, 200);
  assert.equal((await request('/style.css')).status, 200);
  assert.equal((await request('/app.js')).status,200);
  const shippedImage=fs.readFileSync(path.join(root,'public/uploads/stego_challenge.jpg'));
  assert(shippedImage.length>1000);
  const imageDownload=await request('/uploads/stego_challenge.jpg');assert.equal(imageDownload.status,200);
  assert.deepEqual(Buffer.from(await imageDownload.arrayBuffer()),shippedImage);
  const login = await request('/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'cyber_newbie', password: 'password123' })
  });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  for (const headers of [
    { Authorization: token }, { Authorization: 'Bearer ' + token },
    { Authorization: 'bearer ' + token }, { Cookie: 'token=' + token }
  ]) assert.equal((await request('/api/posts', { headers })).status, 200);
  assert.equal((await request('/api/posts')).status, 302);
  assert.equal((await request('/api/posts', { headers: { Authorization: 'Bearer invalid' } })).status, 302);
  const headers = { Authorization: 'Bearer ' + token };
  assert.equal((await request('/api/user/1', { headers })).status, 403);
  assert.equal((await request('/api/admin/satellite-control', { headers })).status, 403);
  const search = async payload => request('/api/users/search?q=' + encodeURIComponent(payload), { headers });
  const normal = await (await search('Sriracha')).json();
  assert.equal(normal[0].id, 1);
  assert.equal(normal[0].username, 'Sriracha');
  const payload = "' UNUNIONION SELSELECTECT 1,content,3,4,5 FROM posts--";
  const result = await (await search(payload)).json();
  assert(result.some(row => String(row.username).includes(flags[0])));
  assert(!JSON.stringify(result).includes(flags[1]));
  const targeted = await (await search(payload.replace('FROM posts--', 'FROM posts WHERE user_id=1--'))).json();
  assert(!JSON.stringify(targeted).includes(flags[1]));
  assert.equal((await search("' UNUNIONION SELSELECTECT 1,password,3,4,5 FROM users--")).status, 500);
  const concurrent = await Promise.all(Array.from({ length: 6 }, () => search(payload).then(r => r.json())));
  assert(concurrent.every(rows => rows.some(row => String(row.username).includes(flags[0]))));
  const forged = jwt.sign({ id: 1, username: 'Sriracha', is_private: 0, is_admin: 0 }, secret);
  const profile = await (await request('/api/user/1', { headers: { Authorization: 'Bearer ' + forged } })).json();
  assert(JSON.stringify(profile.posts).includes(flags[1]));
  const admin = jwt.sign({ id: 99, username: 'nova', is_admin: 1 }, secret);
  const control = await (await request('/api/admin/satellite-control', { headers: { Authorization: 'Bearer ' + admin } })).json();
  assert.equal(control.flag, flags[3]);
  const diagnostic = await (await request('/api/satellite/ping', {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip: '127.0.0.1; cat flag.txt' })
  })).json();
  assert(diagnostic.output.includes(flags[4]));
  const config = await (await request('/api/download?file=../../etc/ai_config.conf')).text();
  assert(config.includes(flags[5]));
  assert.equal((await request('/api/download?file=mission_brief.txt')).status, 200);
  const form = new FormData();
  form.set('content', 'Regression test post'); form.set('is_private', 'false');
  form.set('image', new Blob(['test image bytes'], { type: 'image/jpeg' }), 'test.jpg');
  assert.equal((await request('/api/posts', { method: 'POST', headers, body: form })).status, 200);
  const posts = await (await request('/api/posts', { headers })).json();
  const posted = posts.find(p => p.content === 'Regression test post');
  assert(posted && posted.image_url);
  assert.equal((await request(posted.image_url)).status, 200);
  // The normal inbox is scoped, while side mission 1 deliberately permits an IDOR read.
  const health=await (await request('/api/health')).json();
  assert.equal(health.corePoints,1550);assert.equal(health.optionalMissions,4);
  const inbox=await (await request('/api/social/conversations',{headers})).json();
  assert.equal(inbox.length,6);assert(!inbox.some(c=>c.id===407));
  const hidden=await (await request('/api/social/conversations/407',{headers})).json();
  assert.equal(hidden.canReply,false);assert(JSON.stringify(hidden).includes('AstroSec{handler_thread_recovered}'));
  assert.equal((await request('/api/social/conversations/407',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({content:'test'})})).status,403);
  const publicPosts=await (await request('/api/social/posts',{headers})).json();
  assert(publicPosts.length>=40);assert(!JSON.stringify(publicPosts).includes(flags[1]));
  const candidate=publicPosts.find(p=>p.username==='relay_watch'&&p.content.startsWith('Archived schedule'));
  assert(candidate);
  const thread=await (await request('/api/social/posts/'+candidate.id,{headers})).json();
  assert(thread.replies.some(r=>r.content.includes('AstroSec{relay_handoff_confirmed}')));
  const postAction=async(action,data={})=>request('/api/social/posts/'+candidate.id+'/'+action,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(data)});
  await postAction('like');await postAction('bookmark');
  let bookmarked=await (await request('/api/social/posts?feed=bookmarks',{headers})).json();
  assert(bookmarked.some(p=>p.id===candidate.id&&p.liked));
  await postAction('reply',{content:'A new verification reply'});
  const updated=await (await request('/api/social/posts/'+candidate.id,{headers})).json();
  assert(updated.replies.some(r=>r.content==='A new verification reply'));
  await postAction('like');await postAction('bookmark');
  bookmarked=await (await request('/api/social/posts?feed=bookmarks',{headers})).json();
  assert(!bookmarked.some(p=>p.id===candidate.id));
  assert.equal((await postAction('reply',{content:''})).status,400);
  const figure=await (await request('/attachments/facility.svg')).text();assert(figure.includes('AstroSec{facility_metadata_recovered}'));
  const crew=await (await request('/api/social/conversations/102',{headers})).json();
  assert(crew.messages.some(m=>m.content.includes(Buffer.from('AstroSec{maintenance_message_decoded}').toString('base64'))));
  let journal=await (await request('/api/missions',{headers})).json();
  assert.equal(journal.missions.length,19);assert.equal(journal.score,0);assert(!JSON.stringify(journal).includes(flags[0]));
  const submitFlag=async(id,flag)=>request('/api/missions/'+id+'/submit',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({flag})});
  assert.equal((await submitFlag('core1','wrong')).status,400);
  assert.equal((await submitFlag('core1',flags[0])).status,200);
  await submitFlag('core1',flags[0]);
  await submitFlag('side1','AstroSec{handler_thread_recovered}');
  journal=await (await request('/api/missions',{headers})).json();
  assert.equal(journal.score,100);assert(journal.missions.find(m=>m.id==='side1').solved);
  // Private main posts stay unavailable to new social interactions.
  const privateProfile=await (await request('/api/user/1',{headers:{Authorization:forged}})).json();
  const privatePost=privateProfile.posts.find(p=>p.is_private===1);
  assert.equal((await request('/api/social/posts/'+privatePost.id,{headers})).status,404);
  assert.equal((await request('/api/social/posts/'+privatePost.id+'/like',{method:'POST',headers})).status,404);
  // Private posts on public accounts are visible to their author only.
  const privateForm=new FormData();privateForm.set('content','Private author-only regression note');privateForm.set('is_private','true');
  assert.equal((await request('/api/posts',{method:'POST',headers,body:privateForm})).status,200);
  const otherToken=jwt.sign({id:4,username:'h4ck3r_man'},secret);
  const publicProfile=await (await request('/api/user/3',{headers:{Authorization:'Bearer '+otherToken}})).json();
  assert(!publicProfile.posts.some(p=>p.content==='Private author-only regression note'));
  const authorProfile=await (await request('/api/user/3',{headers})).json();assert(authorProfile.posts.some(p=>p.content==='Private author-only regression note'));
  const memberPost=await request('/api/social/conversations/102',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({content:'Regression member reply'})});assert.equal(memberPost.status,200);
  const optionalFlags=['AstroSec{handler_thread_recovered}','AstroSec{relay_handoff_confirmed}','AstroSec{facility_metadata_recovered}','AstroSec{maintenance_message_decoded}'];
  for(let i=0;i<optionalFlags.length;i++)assert.equal((await submitFlag('side'+(i+1),optionalFlags[i])).status,200);
  for(let i=1;i<flags.length;i++)assert.equal((await submitFlag('core'+(i+1),flags[i])).status,200);
  const cases=await (await request('/api/case-files',{headers})).json();assert.equal(cases.length,7);
  assert.equal(health.forensicChallenges,7);
  const forensicFlags=['AstroSec{http_object_recovered}','AstroSec{dns_fragments_reassembled}','AstroSec{original_photo_verified}','AstroSec{wal_handoff_restored}','AstroSec{deleted_handoff_recovered}','AstroSec{mail_route_verified}','AstroSec{uplink_sess42_kronos7}'];
  assert(forensicFlags.every(flag=>!JSON.stringify(journal).includes(flag)));
  for(const c of cases){const bytes=Buffer.from(await (await request(c.url)).arrayBuffer());assert.equal(bytes.length,c.bytes);assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),c.sha256);}
  assert.equal((await submitFlag('forensic1',forensicFlags[1])).status,400);
  for(let i=0;i<forensicFlags.length;i++)assert.equal((await submitFlag('forensic'+(i+1),forensicFlags[i])).status,200);
  await submitFlag('forensic1',forensicFlags[0]);
  assert.equal(health.primaryChallenges,15);assert.equal(health.capstoneChallenges,1);
  let workspace=await (await request('/api/capstone',{headers})).json();assert.equal(workspace.learning.length,14);assert.equal(workspace.files.length,9);assert.equal(workspace.checks.length,0);
  const capFlag='AstroSec{legacy_override_exposed_and_removed}';assert(!JSON.stringify(workspace).includes(capFlag));
  assert.equal((await submitFlag('capstone15',capFlag)).status,400);
  const capPost=(endpoint,body)=>request('/api/capstone/'+endpoint,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const finding={file:'src/identity.js',cause:'untrusted-role-override',fix:'remove-override',decoy:'archive/admin-v1.js'};
  assert.equal((await capPost('report',finding)).status,400);
  const replay={path:'/internal/relay/archive',mode:'deployed',headers:{},receipt:'R-314',session:'sess-42',relay:'KRONOS-7'};
  assert.equal((await (await capPost('replay',replay)).json()).status,403);
  assert.equal((await capPost('replay',{...replay,path:'http://example.com'})).status,400);
  assert.equal((await capPost('replay',{...replay,headers:[]})).status,400);
  assert.equal((await (await capPost('replay',{...replay,path:'/legacy/admin',headers:{password:'COSMO_DEMO_ADMIN_ONLY'}})).json()).status,404);
  const bypass={...replay,headers:{'X-Relay-Compat':'R-314'}};
  assert.equal((await (await capPost('replay',{...bypass,session:'sess-41'})).json()).status,404);
  const exposed=await (await capPost('replay',bypass)).json();assert.equal(exposed.status,200);assert.equal(exposed.record.session,'sess-42');assert(!JSON.stringify(exposed).includes(capFlag));
  assert.equal((await capPost('report',finding)).status,400);
  assert.equal((await (await capPost('replay',{...bypass,mode:'patched'})).json()).status,403);
  assert.equal((await capPost('report',{...finding,file:'archive/admin-v1.js'})).status,400);
  const capReport=await (await capPost('report',finding)).json();assert.equal(capReport.flag,capFlag);
  assert.equal((await submitFlag('capstone15',capFlag)).status,200);await submitFlag('capstone15',capFlag);
  const separateToken=jwt.sign({id:4,username:'h4ck3r_man'},secret);
  const separate=await (await request('/api/capstone',{headers:{Authorization:separateToken}})).json();assert.deepEqual(separate.checks,[]);
  journal=await (await request('/api/missions',{headers})).json();assert.equal(journal.score,1550);assert(journal.missions.every(m=>m.solved));
  const follow=await request('/api/social/people/12/follow',{method:'POST',headers});assert.equal(follow.status,200);
  const directory=await (await request('/api/social/people',{headers})).json();assert(directory.find(p=>p.id===12).following);
  assert.equal((await request('/api/social/posts/1/unknown',{method:'POST',headers})).status,404);
  // Reposts and author-only editing/pinning are ordinary social features.
  await postAction('repost');
  let sharedPost=await (await request('/api/social/posts/'+candidate.id,{headers})).json();assert(sharedPost.post.reposted);
  await postAction('repost');
  const ownAction=async(action,content)=>request('/api/social/posts/'+posted.id+'/'+action,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({content})});
  assert.equal((await ownAction('edit','Edited regression post')).status,200);
  assert.equal((await ownAction('pin')).status,200);
  const ownEdited=await (await request('/api/social/posts/'+posted.id,{headers})).json();assert.equal(ownEdited.post.content,'Edited regression post');assert(ownEdited.post.pinned&&ownEdited.post.edited_at);
  assert.equal((await request('/api/social/posts/'+posted.id+'/edit',{method:'POST',headers:{Authorization:otherToken,'Content-Type':'application/json'},body:JSON.stringify({content:'forbidden'})})).status,403);
  assert.equal((await request('/api/social/posts/'+posted.id+'/pin',{method:'POST',headers:{Authorization:otherToken}})).status,403);
  const notes=await (await request('/api/social/notifications',{headers:{Authorization:otherToken}})).json();assert(notes.some(n=>n.conversation_id===102));
  // Simulate high AUTOINCREMENT values from a previous run before restarting.
  await stop();
  const sqlite3 = require('sqlite3');
  await new Promise((resolve, reject) => {
    const db = new sqlite3.Database(path.join(temp, 'database.sqlite'));
    db.run("UPDATE sqlite_sequence SET seq = 9000 WHERE name IN ('users','posts')", err => {
      db.close(); err ? reject(err) : resolve();
    });
  });
  for (let i = 0; i < 2; i++) {
    debug = await start();
    assert.deepEqual(debug.users.map(u => [u.id, u.username]), expected);
    const posts = await (await request('/api/posts', { headers })).json();
    assert(!posts.some(p => p.content === 'Regression test post'||p.content==='Edited regression post'));
    const resetJournal=await (await request('/api/missions',{headers})).json();assert.equal(resetJournal.score,0);assert.deepEqual((await (await request('/api/capstone',{headers})).json()).checks,[]);
    assert.equal(Math.min(...posts.map(p => p.id)), 1);
    await stop();
  }
  console.log('PASS: IDs across 3 starts; cookie/raw/Bearer auth; SQLi scope and concurrency; JWT/admin; command injection; traversal/debug; posting/upload/static pages.');
  console.log('PASS: social feeds, inbox scoping and intended IDOR, reply permissions, likes/bookmarks, private-post isolation, four optional mission evidence paths, and score deduplication.');
  console.log('Docker, real browser flows, and steghide extraction are checked by the separate lab-validation workflow.');
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(async () => {
  await stop(); fs.rmSync(temp, { recursive: true, force: true });
});
