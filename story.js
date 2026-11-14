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
// Ordinary community life. These posts and replies add context, not challenge flags.
posts.push(...[
  {
    "user": 7,
    "key": "walk_welcome",
    "text": "New to the station? Join our short observation-loop walk. We pause at every window, and nobody has to keep up with a fast group. #MoonwalkClub"
  },
  {
    "user": 10,
    "key": "soup_vote",
    "text": "Soup taste test at lunch: tomato or vegetable? Both come with the same extremely serious feedback form. #StationKitchen"
  },
  {
    "user": 9,
    "key": "coop_night",
    "text": "Co-op night has a beginner table now. We explain the controls before starting, and helping a teammate counts as a win. #GameNight"
  },
  {
    "user": 8,
    "key": "plant_shelf",
    "text": "The maintenance shelf has become a plant shelf. Please label your seedlings so I stop calling all of them Basil. #StationGarden"
  },
  {
    "user": 5,
    "key": "shift_tea",
    "text": "Quiet start to the shift: tea, checklist, then messages. In that order, unless someone has borrowed my mug again. #StationLife"
  },
  {
    "user": 6,
    "key": "window_photo",
    "text": "Observation window photo challenge: capture the same view at three different times. Please leave the walkway clear. #OrbitPhotos"
  },
  {
    "user": 11,
    "key": "archive_first",
    "text": "Found the first community newsletter in the archive. Its biggest story was the arrival of a second toaster. Progress takes many forms. #ArchiveNotes"
  },
  {
    "user": 12,
    "key": "nova_sketch",
    "text": "Nova journal: tried sketching the observation deck. The windows look convincing. The chairs look like small satellites. #CreativeCorner"
  },
  {
    "user": 7,
    "text": "We finished the short loop with two photo stops and one very long discussion about constellations. Good company beats a fast time. #MoonwalkClub"
  },
  {
    "user": 10,
    "text": "Lunch results: tomato and vegetable tied. The kitchen has requested a rematch after everyone washes their bowls. #StationKitchen"
  },
  {
    "user": 9,
    "text": "First beginner game night complete. Our best move was reading the instructions together. Same time next week. #GameNight"
  },
  {
    "user": 8,
    "text": "Plant update: three seedlings are labeled Basil, but only one actually is. The labels are a gardening problem, not a secret message. #StationGarden"
  },
  {
    "user": 5,
    "text": "Thank you to the day crew for leaving a clear handover note. A useful checklist is an underrated kindness. #StationLife"
  },
  {
    "user": 6,
    "text": "Photo tip from yesterday: reflections can be interesting too. Ask before including another person in a picture. #OrbitPhotos"
  },
  {
    "user": 11,
    "text": "The old newsletter now has a readable transcript. Searchable text makes a small archive much easier to explore. #ArchiveNotes"
  },
  {
    "user": 12,
    "text": "Nova journal: learned three new names on the walk and remembered two. Working on the third. #StationLife"
  },
  {
    "user": 7,
    "text": "Club route suggestion box is open. Short routes, seated observation sessions, and longer walks are all welcome. #MoonwalkClub"
  },
  {
    "user": 10,
    "text": "Someone returned six missing teaspoons. No questions asked. The kitchen considers this an excellent day. #StationKitchen"
  },
  {
    "user": 9,
    "text": "Tonight we are trying a cooperative building game. My plan is a neat little station. My last attempt was mostly corridors. #GameNight"
  },
  {
    "user": 8,
    "text": "Repair table on the recreation deck: bring a loose notebook cover or a wobbly desk organizer. Leave station equipment to the maintenance team. #FixItHour"
  },
  {
    "user": 5,
    "text": "Reminder to future me: lunch belongs on the calendar too. A completed checklist does not make a sandwich appear. #StationLife"
  },
  {
    "user": 6,
    "text": "Photo challenge entries include a crescent moon, a bright cloud band, and one excellent picture of a snack reflection. #OrbitPhotos"
  },
  {
    "user": 11,
    "text": "Archive question of the day: what ordinary thing would you save for the next crew? I vote for a recipe and a handwritten welcome note. #ArchiveNotes"
  },
  {
    "user": 12,
    "text": "Nova journal: a quiet feed update can just be a quiet feed update. Today I am bookmarking the bread recipe. #StationLife"
  },
  {
    "user": 7,
    "text": "Our next walk ends at the library corner. Bring a book recommendation if you have one. Listening is welcome too. #MoonwalkClub"
  },
  {
    "user": 10,
    "text": "Kitchen experiment: herb bread. The smell has already received positive reviews from people who have not tasted it yet. #StationKitchen"
  },
  {
    "user": 9,
    "text": "We built the game station. It has a library, a garden, and only slightly too many corridors. Calling that an improvement. #GameNight"
  },
  {
    "user": 8,
    "text": "Repair table success: two notebook covers, one pencil case, and a desk organizer that now stands straight. Thanks for sharing supplies. #FixItHour"
  },
  {
    "user": 5,
    "text": "The lost mug is back on my desk. Someone also left a small drawing of it with a return-to-owner label. Excellent service. #StationLife"
  },
  {
    "user": 6,
    "text": "Community photo album is ready. Captions include the place and time so the next crew can find the same view. #OrbitPhotos"
  },
  {
    "user": 11,
    "text": "Today I archived a handwritten bread recipe. It has three flour smudges and an important note: let it cool before slicing. #ArchiveNotes"
  },
  {
    "user": 12,
    "text": "Nova journal: the best question at the repair table was, \"Can you show me how?\" Keeping that one. #CreativeCorner"
  },
  {
    "user": 7,
    "text": "Cloud-watching session this weekend. No special knowledge needed. We will compare shapes and probably disagree about which one looks like a turtle. #WindowClub"
  },
  {
    "user": 10,
    "text": "Herb bread review: good crust, soft middle, gone before I could take a picture. Recipe is with signal_archive. #StationKitchen"
  },
  {
    "user": 9,
    "text": "Game-night etiquette: explain a rule kindly, make room for a new player, and let people finish their turn. #GameNight"
  },
  {
    "user": 8,
    "text": "The garden shelf has its first new leaf. This is a completely ordinary leaf, but I am still giving it a progress update. #StationGarden"
  },
  {
    "user": 5,
    "text": "Off-shift reading recommendation: a field guide with pictures. Sometimes I want a page that does not need a status update. #LibraryCorner"
  },
  {
    "user": 6,
    "text": "Photo challenge closing note: everyone who submitted gets a place in the album. We are collecting perspectives, not choosing a winner. #OrbitPhotos"
  },
  {
    "user": 11,
    "text": "A good archive entry names its source. For recipes, that also means giving credit to the person who did the washing up. #ArchiveNotes"
  },
  {
    "user": 12,
    "text": "Nova journal: asked three people for their favorite station view. Got three different answers and one invitation to see the garden. #StationLife"
  },
  {
    "user": 7,
    "text": "The library walk had a very good turnout. Next time we will leave extra time for recommendations at the end. #MoonwalkClub"
  },
  {
    "user": 10,
    "text": "Official kitchen announcement: the spare teaspoons are in the drawer labeled teaspoons. We are trying a bold new organization system. #StationKitchen"
  },
  {
    "user": 9,
    "text": "Looking for recommendations for a short, friendly game we can finish in one evening. Bonus appreciation for clear instructions. #GameNight"
  },
  {
    "user": 8,
    "text": "Garden watering chart is beside the shelf. Please mark a watering after you do it so the plants do not receive eight enthusiastic drinks. #StationGarden"
  },
  {
    "user": 5,
    "text": "Small win: finished the shift with every borrowed pen returned. I am choosing to believe this can happen twice. #StationLife"
  },
  {
    "user": 6,
    "text": "Next community challenge: write a two-sentence caption for a favorite view. No photo required. Descriptions count too. #CreativeCorner"
  },
  {
    "user": 11,
    "text": "Newsletter draft now includes the garden, game night, and the returned teaspoons. A well-rounded historical record. #ArchiveNotes"
  },
  {
    "user": 12,
    "text": "Nova journal: there is still an investigation to finish, but people are also growing plants and sharing lunch. The station is more than its incident reports. #StationLife"
  }
]);
replies.push(...[
  {
    "user": 5,
    "post": "walk_welcome",
    "text": "I can join the shorter route after my shift. Is the meeting point still the library corner?"
  },
  {
    "user": 7,
    "post": "walk_welcome",
    "text": "Yes, library corner. We will post the route there before we leave."
  },
  {
    "user": 12,
    "post": "walk_welcome",
    "text": "I will bring my sketchbook. A window stop sounds like a good place to practice."
  },
  {
    "user": 7,
    "post": "soup_vote",
    "text": "Vegetable gets my vote. Can we keep the recipe if it wins?"
  },
  {
    "user": 10,
    "post": "soup_vote",
    "text": "Absolutely. Both recipes will go in the community folder, regardless of the vote."
  },
  {
    "user": 11,
    "post": "soup_vote",
    "text": "Happy to keep a copy with the newsletter recipes."
  },
  {
    "user": 12,
    "post": "coop_night",
    "text": "I have not played before. Is it all right to watch the first round?"
  },
  {
    "user": 9,
    "post": "coop_night",
    "text": "Of course. You can watch, join, or leave between rounds. We will explain as we go."
  },
  {
    "user": 5,
    "post": "coop_night",
    "text": "I will take the beginner table too. My last game strategy was pressing every button."
  },
  {
    "user": 10,
    "post": "plant_shelf",
    "text": "I can donate a clean container for the next seedling."
  },
  {
    "user": 8,
    "post": "plant_shelf",
    "text": "Thanks. Bring it to the recreation shelf and we will check the drainage together."
  },
  {
    "user": 7,
    "post": "plant_shelf",
    "text": "The walk group would like a garden update at our next stop."
  },
  {
    "user": 8,
    "post": "shift_tea",
    "text": "Your mug is on the drying rack. It was helping me finish a very long cup of tea."
  },
  {
    "user": 5,
    "post": "shift_tea",
    "text": "Mystery solved. Please leave it there and I will collect it after handover."
  },
  {
    "user": 10,
    "post": "shift_tea",
    "text": "Adding a spare-mug shelf to the kitchen suggestions."
  },
  {
    "user": 12,
    "post": "window_photo",
    "text": "Does a drawing of the same view count? My camera is not doing the colors justice."
  },
  {
    "user": 6,
    "post": "window_photo",
    "text": "Yes. Photos, drawings, and written descriptions are all welcome."
  },
  {
    "user": 7,
    "post": "window_photo",
    "text": "I can contribute three descriptions of the same cloud slowly becoming a turtle."
  },
  {
    "user": 9,
    "post": "archive_first",
    "text": "Did the first toaster get a farewell article when the second one arrived?"
  },
  {
    "user": 11,
    "post": "archive_first",
    "text": "It stayed in service. The newsletter called the pair an expanded breakfast program."
  },
  {
    "user": 10,
    "post": "archive_first",
    "text": "An important chapter in station kitchen history."
  },
  {
    "user": 11,
    "post": "nova_sketch",
    "text": "Please keep the date with the sketch. The chairs may look different to the next crew."
  },
  {
    "user": 12,
    "post": "nova_sketch",
    "text": "Dated and saved. Future historians can decide whether the chairs were really that round."
  },
  {
    "user": 8,
    "post": "nova_sketch",
    "text": "As the person who tightens those chairs, I support the artistic interpretation."
  }
]);
// Case acquisition notices link the forensic evidence to the community story.
posts.push(
 {user:6,key:'case_http',text:'Relay mirror acquisition is ready: /attachments/cases/relay-transfer.pcap. Several HTTP transfers share this window. Crew chat has the accepted receipt number. #CaseFiles'},
 {user:6,key:'case_dns',text:'The resolver window includes ordinary station queries and an unusual numbered series. Retries were kept in the acquisition: /attachments/cases/resolver-window.pcap #CaseFiles'},
 {user:8,key:'case_photo',text:'CAM-17 survey export has the original image and the resized feed copy. They look similar, but the export history differs: /attachments/cases/survey-photos.zip #CaseFiles'},
 {user:11,key:'case_wal',text:'The workstation snapshot was acquired before shutdown. I kept its sidecar with it; copying just the main file changes the story: /attachments/cases/handoff-snapshot.zip #CaseFiles'},
 {user:11,key:'case_disk',text:'Removable-media image acquired after a handoff file was removed. The acquisition note describes the layout. Keep an untouched original: /attachments/cases/removable-media.zip #CaseFiles'},
 {user:5,key:'case_email',text:'Two exported receipt emails, one accepted gateway record. Compare the Message-ID and disposition before trusting the attachment: /attachments/cases/mail-review.zip #CaseFiles'},
 {user:12,key:'case_timeline',text:'Nova field note: three clocks describe the same incident. Local time order is misleading; correlate requests after normalization: /attachments/cases/incident-timeline.zip #CaseFiles'}
);
replies.push(
 {user:5,post:'case_http',text:'Crew log confirms R-314 was accepted. R-271 was a cancelled test, even if you find its transfer later.'},
 {user:8,post:'case_dns',text:'The old transport put a sequence label ahead of a hex fragment. Packet order was never the record order.'},
 {user:11,post:'case_photo',text:'Preview exports may strip annotations. Preserve the original file instead of saving a screenshot.'},
 {user:8,post:'case_wal',text:'Use a writable working copy with the exact sidecar name. Do not modify your original acquisition.'},
 {user:5,post:'case_disk',text:'Deleting an entry is different from overwriting the file content. Record how you recovered it.'},
 {user:11,post:'case_email',text:'These are offline exports. The gateway disposition is supplied evidence for this scenario, not a live sender verification service.'},
 {user:6,post:'case_timeline',text:'A successful drill is still a drill. Follow the approved production request through all three sources.'}
);
threads.find(t=>t.id===102).messages.push({user:5,text:'For the acquisition review: accepted maintenance receipt R-314. R-271 was cancelled. The new case files are linked under #CaseFiles.'});
posts.push({user:12,key:'capstone_review',text:'The recovered receipts point to a migration exception in the relay service. Operations console has the reconstructed workspace. Compare what looks alarming with what actually runs. #FinalReview'});
replies.push({user:8,post:'capstone_review',text:'I kept archived files and sample account notes in the snapshot. Neither proves a live entry point. The deployment settings and identity trace matter.'});
module.exports={people,posts,replies,threads};
