'use strict';
// A bounded teaching model. Displayed source is text, never eval'd or executed.
const mission={id:'capstone15',number:15,kind:'capstone',points:0,title:'The compatibility exception',difficulty:'Capstone',tools:'Source review, request replay, evidence correlation',brief:'Audit the reconstructed relay backend. Separate deployed behavior from archived code, reproduce an access-control failure, and prove that a proposed fix blocks it.',lead:'Open Operations console. The accepted receipt and production session come from the earlier evidence.',hints:['Read the deployment configuration and trace the entry point. A suspicious filename does not prove a file runs.','Compare the verified identity with the effective identity. Check whether compatibility input changes a role before the route guard.','Replay /internal/relay/archive using x-relay-compat: R-314, receipt R-314, session sess-42, and relay KRONOS-7. Compare baseline, deployed behavior, and patch preview. The live cause is in src/identity.js.'],flag:'AstroSec{legacy_override_exposed_and_removed}'};
const files=[
 {path:'README.txt',content:`RELAY SERVICE SNAPSHOT / acquisition R-314
This is a reconstructed, fictional backend workspace, not a live management service.
Follow the deployment entry point and compare default settings with runtime settings.
Files in archive/ and examples/ are retained for history; decide whether the entry point loads them.
Use the supplied replay panel, not your real account credentials.
The receipt archive belongs to the production session established by the three-clock timeline.
`},
 {path:'deploy/runtime.json',content:JSON.stringify({entryPoint:'src/main.js',profile:'relay-production',compatibility:{enabled:true},audit:{recordEffectiveIdentity:true},deployment:'relay-2026-11-13'},null,2)},
 {path:'config/defaults.json',content:JSON.stringify({compatibility:{enabled:false,header:'x-relay-compat',role:'archivist',receiptVariable:'ACCEPTED_RECEIPT'},route:'/internal/relay/archive'},null,2)},
 {path:'src/main.js',content:`const defaults = readJson('config/defaults.json');
const runtime = readJson('deploy/runtime.json');
const config = mergeSettings(defaults, runtime);
const resolveIdentity = require('./identity');
const router = require('./router');
start({ config, resolveIdentity, router });
// Environment reference: ACCEPTED_RECEIPT is the signed-off crew receipt.
// Archive lookup also checks the production session and active relay.
`},
 {path:'src/identity.js',content:`function resolveIdentity(request, verifiedUser, config, environment) {
  const identity = { ...verifiedUser, source: 'verified-session' };
  const compatibility = config.compatibility;
  // Compatibility with the previous relay exporter during migration.
  if (compatibility.enabled &&
      request.headers[compatibility.header] === environment.ACCEPTED_RECEIPT) {
    return { ...identity, role: compatibility.role, source: 'relay-compat' };
  }
  return identity;
}
module.exports = resolveIdentity;
`},
 {path:'src/router.js',content:`function archiveRoute(request, verifiedUser, config, environment) {
  const identity = resolveIdentity(request, verifiedUser, config, environment);
  if (identity.role !== 'archivist') return deny(403);
  return archive.lookup(request.receipt, request.session, request.relay);
}
// Production route: POST /internal/relay/archive
// PATCH PREVIEW: use verifiedUser directly for authorization;
// remove the caller-controlled role override from resolveIdentity.
`},
 {path:'archive/admin-v1.js',content:`// Historical export from 2024. Kept for migration comparison.
function emergencyAdmin(password) {
  return password === 'COSMO_DEMO_ADMIN_ONLY';
}
// No import in the current entry point. Not a deployed route.
`},
 {path:'examples/accounts.txt',content:`LOCAL DOCUMENTATION EXAMPLES
username=demo_admin
password=orbit-demo-123
These sample values are not accepted by the replay model or CosmoLog login.
No service reads this file. Do not substitute real credentials.
`},
 {path:'logs/relay-audit.log',content:`2026-11-13T08:16:59Z request=req-271 outcome=cancelled
2026-11-13T08:17:01Z request=req-314 identity_source=verified-session role=analyst
2026-11-13T08:17:04Z request=req-314 identity_source=relay-compat effective_role=archivist
2026-11-13T08:18:00Z request=req-999 outcome=drill-only
Compare this UTC view with the operator, gateway, and relay acquisitions.
`}
];
const learning=[
 ['core1','SQL injection','Treat untrusted input as data; examine what a query can expose.'],
 ['core2','JWT identity','Distinguish verified identity from claims a caller can influence.'],
 ['core3','Steganography','Preserve an original artifact; visible appearance is incomplete evidence.'],
 ['core4','Authorization','Check the effective role at the protected action.'],
 ['core5','Command injection','Follow input to the operation it can influence.'],
 ['core6','File traversal','Trace the actual path and execution context.'],
 ['core7','API disclosure','Do not mistake an available diagnostic view for authorized access.'],
 ['forensic1','HTTP recovery','Corroborate the accepted receipt instead of trusting the latest transfer.'],
 ['forensic2','DNS reconstruction','Reassemble evidence in logical order and remove retries.'],
 ['forensic3','Image metadata','Compare originals and derived copies before drawing conclusions.'],
 ['forensic4','SQLite WAL','Inspect effective state, including companion files and overrides.'],
 ['forensic5','Deleted files','Historical content may survive without being active.'],
 ['forensic6','Email correlation','Use corroborating records instead of names or appearances.'],
 ['forensic7','UTC timeline','Correlate the accepted production session across sources.']
];
function replay(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return{error:'Choose a replay request.'};
 const allowed=['/health','/internal/relay/archive','/legacy/admin'];
 if(!allowed.includes(input.path)||!['deployed','patched'].includes(input.mode))return{error:'Choose a listed route and replay mode.'};
 const headers=input.headers;
 if(!headers||typeof headers!=='object'||Array.isArray(headers)||Object.keys(headers).length>4||Object.entries(headers).some(([k,v])=>k.length>80||typeof v!=='string'||v.length>100))return{error:'Use at most four short text headers.'};
 const normalized=Object.fromEntries(Object.entries(headers).map(([k,v])=>[k.toLowerCase(),v]));
 const override=normalized['x-relay-compat']==='R-314';
 const effective=input.mode==='deployed'&&override?'archivist':'analyst';
 const exact=input.receipt==='R-314'&&input.session==='sess-42'&&input.relay==='KRONOS-7';
 let status=input.path==='/health'?200:input.path==='/legacy/admin'?404:effective!=='archivist'?403:!exact?404:200;
 const trace=[{step:'Session verification',identity:'training-analyst',role:'analyst'},{step:'Deployment settings',profile:'relay-production',compatibility:true},{step:'Identity resolution',source:effective==='archivist'?'relay-compat':'verified-session',effectiveRole:effective},{step:'Route decision',path:input.path,status}];
 if(input.mode==='patched')trace.splice(2,0,{step:'Patch preview',change:'Caller-controlled compatibility input cannot change the verified role.'});
 return{status,trace,record:status===200&&input.path==='/internal/relay/archive'?{receipt:'R-314',session:'sess-42',relay:'KRONOS-7',classification:'training-archive',note:'The analyst session should not have archive access.'}:null,
  checkpoint:input.path!=='/internal/relay/archive'?null:input.mode==='deployed'&&status===403&&!override?'baseline':input.mode==='deployed'&&status===200?'bypass':input.mode==='patched'&&override&&exact&&status===403?'patched':null};
}
function reportValid(input){return input?.file==='src/identity.js'&&input?.cause==='untrusted-role-override'&&input?.fix==='remove-override'&&input?.decoy==='archive/admin-v1.js';}
module.exports={mission,files,learning,replay,reportValid};
