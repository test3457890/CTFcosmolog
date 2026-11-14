// Fictional, deterministic seed content. Dates and conversations are scenario artifacts.
const people = [
  {id:5,name:'mira_ops',bio:'Night-shift relay operations. Check the timestamp before the rumor.'},
  {id:6,name:'relay_watch',bio:'Independent orbital service updates. Corrections stay visible.'},
  {id:7,name:'lunar_strider',bio:'Moonwalk club. Slow miles count too.'},
  {id:8,name:'patch_notes',bio:'Maintenance engineer. Tea, diagrams, and too many open tickets.'},
  {id:9,name:'orbital_gamer',bio:'Co-op games after shift. My cipher posts are usually game puzzles.'},
  {id:10,name:'cafeteria_comet',bio:'Station food reviews. Strong opinions about the coffee machine.'},
  {id:11,name:'signal_archive',bio:'Preserving old schedules so we can understand what changed.'},
  {id:12,name:'nova_fieldnotes',bio:'Field observations from Nova on a Journey. Verify before you amplify.'}
];
const posts = [
 {user:7,text:'Anyone joining the low-gravity 5K? No pace requirements. #MoonwalkClub'},
 {user:10,text:'Coffee machine is back. Please stop submitting it as a network outage.'},
 {user:6,key:'relay',text:'Archived schedule: KRONOS-6 handled the test relay last month. Reposting because the old screenshot is circulating. See the correction in replies. #RelayStatus'},
 {user:9,key:'gamer',text:'Uifsf jt op gmbh ifsf. One-letter shift for tonight\'s puzzle league. This is a game clue, not station telemetry. #GameNight'},
 {user:5,text:'If you are comparing screenshots, look at the revision date. The relay plan changed after the handoff.'},
 {user:8,key:'facility',text:'Revised facility diagram is attached: /attachments/facility.svg. The drawing metadata still has the maintenance record. #Maintenance'},
 {user:11,text:'I keep old versions for a reason. An obsolete file can explain a rumor without proving it true.'},
 {user:10,text:'Today\'s special is soup. The menu display says "critical error" because someone unplugged it. The soup is fine.'},
 {user:7,text:'Trail report: the east observation loop is open again. Bring water. #MoonwalkClub'},
 {user:12,text:'Nova field note 01: distinguish a source from a repost. Who was actually on shift?'},
 {user:6,text:'A screenshot without a date is not a status report. Corrections are in the original thread. #RelayStatus'},
 {user:9,text:'Need one more for co-op after the evening shift. Our only uplink is the game lobby.'},
 {user:8,text:'A replacement filename does not tell you what is inside. Keep the original attachment when you investigate.'},
 {user:5,text:'Current handoff confirmed: #KRONOS7. The retired relay is not carrying the active uplink. See my reply on the archived schedule for the record.'},
 {user:11,text:'Archive index updated. Retired schedules remain accessible for comparison. Nothing has been quietly deleted.'},
 {user:10,text:'Can whoever keeps naming the sandwich order "root access" please use a table number?'},
 {user:7,text:'Great turnout this morning. Posting the next club route after the maintenance window. #MoonwalkClub'},
 {user:12,text:'Nova field note 02: a correction is evidence too. Read replies before chasing an address.'},
 {user:6,text:'We have one confirmed schedule correction and three recycled rumors. Please link the original thread.'},
 {user:8,text:'The drawing attachment is an SVG, not the JPEG from Gorgan. Different files, different records.'},
 {user:9,text:'Puzzle answer was "There is no flag here." Congratulations to everyone who did not turn game night into an incident report.'},
 {user:11,text:'Metadata survives a filename change surprisingly often. #ArchiveNotes'},
 {user:5,text:'Night shift starts at 20:00 scenario time. The automated notices are still being reviewed by a person.'},
 {user:10,text:'Lost mug: black, chipped handle, reads "works on my machine". Last seen beside relay operations.'},
 {user:7,text:'The observation deck sunrise was worth the early start.'},
 {user:12,text:'Nova field note 03: a message delivery receipt can reveal more than its sender intended.'},
 {user:8,text:'Please send maintenance follow-ups in the crew chat. Long diagnostic output makes the public feed impossible to read.'},
 {user:6,text:'Status labels: archived means historical; corrected means a later update exists. Neither means secret.'},
 {user:9,text:'Reminder: Base64 is an encoding, not encryption. Yes, this is about the maintenance chat.'},
 {user:11,text:'The original diagram is attached in patch_notes\' facility post. A screenshot strips away the useful source.'},
 {user:5,text:'If the AI notice contradicts a signed-off handoff record, investigate both. Do not assume the newest post is correct.'},
 {user:10,text:'Coffee machine outage resolved. The final report was "plugged it back in."'},
 {user:7,text:'Anyone have a spare headlamp for the club walk?'},
 {user:12,text:'Nova field note 04: keep a link to each piece of evidence. Bookmarks are useful for a reason.'},
 {user:6,text:'KRONOS-6 rumor closed. Follow the original correction and current #KRONOS7 handoff.'},
 {user:8,text:'Maintenance queue is clear. Keep the revised diagram; it is the one we verified.'}
];
const replies = [
 {user:5,post:'relay',text:'Correction, revision 3: KRONOS-6 was retired before the incident. The active relay is KRONOS-7. Handoff record: AstroSec{relay_handoff_confirmed}. #KRONOS7'},
 {user:6,post:'relay',text:'Confirmed. Keeping the archived post visible so the old screenshot has context.'},
 {user:12,post:'relay',text:'Logged the correction. The retired relay is a false lead, not a second active uplink.'},
 {user:8,post:'gamer',text:'This is a puzzle league post. The account bio and the game-night tag are the context.'},
 {user:9,post:'gamer',text:'Exactly. No station secrets. Just the one-letter shift puzzle.'},
 {user:11,post:'facility',text:'Download the original SVG and inspect the metadata element. The rendered drawing is only one view of the file.'},
 {user:5,post:'facility',text:'The JPEG on Gorgan\'s timeline is a separate dead drop. Do not confuse these two attachments.'}
];
const encoded = Buffer.from('AstroSec{maintenance_message_decoded}').toString('base64');
const threads = [
 {id:101,title:'Welcome to the investigation',members:[3,4,12],messages:[
  {user:12,text:'Welcome, Nova. Follow people, read replies, and bookmark evidence. Core missions total 1,550 points; side investigations are optional.'},
  {user:3,text:'Starting with the public timeline. I will compare the original reports with their corrections.'},
  {user:12,text:'The public relay schedule has a correction in its replies. That is a useful first lead.'}]},
 {id:102,title:'Maintenance crew',members:[3,4,5,8],messages:[
  {user:8,text:'I attached the revised facility diagram to the public maintenance post. Download the original, not a screenshot.'},
  {user:5,text:'Is KRONOS-6 still handling the relay?'},
  {user:8,text:'That schedule is old. The public correction identifies the current handoff.'},
  {user:8,text:'Our maintenance record was Base64 encoded for a legacy transport. It is not encrypted: '+encoded}]},
 {id:103,title:'Moonwalk club',members:[3,4,7],messages:[
  {user:7,text:'Saturday walk is still on. The observation loop is open.'},
  {user:3,text:'I will bring an extra headlamp.'},
  {user:7,text:'Perfect. This chat is just club logistics, not a relay operations channel.'}]},
 {id:104,title:'Delivery receipt 407',members:[3,4,11],messages:[
  {user:11,text:'An operations receipt was delivered to the wrong inbox. It references conversation 407, titled Uplink handoff.'},
  {user:11,text:'That conversation is absent from your normal inbox list. Investigate how the conversation read API checks its recipient.'}]},
 {id:105,title:'Game night',members:[3,4,9],messages:[
  {user:9,text:'The shifted public post is a game puzzle. It decodes to "There is no flag here."'},
  {user:9,text:'Do not spend the whole lab on it. The public bio and replies explain the context.'}]},
 {id:106,title:'Support queue',members:[3,4,10],messages:[
  {user:10,text:'Your missing coffee has been classified as a cafeteria incident.'},
  {user:10,text:'Resolution: order placed at the wrong counter. No telemetry involved.'}]},
 {id:407,title:'Uplink handoff',members:[1,2],messages:[
  {user:2,text:'The public feed must keep looking normal. Keep the handoff record in this operations thread.'},
  {user:1,text:'The receipt was misdelivered. Why does the conversation API accept any authenticated reader?'},
  {user:2,text:'Handler archive confirmation: AstroSec{handler_thread_recovered}.'}]}
];
module.exports={people,posts,replies,threads};
