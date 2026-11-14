#!/usr/bin/env python3
"""Solve the shipped offline cases with actual forensic tools, on temporary copies."""
from pathlib import Path
import base64,csv,email,email.policy,hashlib,io,json,re,sqlite3,subprocess,tempfile,zipfile
from datetime import datetime
ROOT=Path(__file__).resolve().parents[1];E=ROOT/'public/attachments/cases'
def run(*args):return subprocess.check_output(args,stderr=subprocess.PIPE)
def expect(value,flag):assert value.strip()==flag,(value,flag)
manifest=json.loads((E/'manifest.json').read_text())['files']
assert len(manifest)==7
for name,meta in manifest.items():
 data=(E/name).read_bytes();assert len(data)==meta['bytes'];assert hashlib.sha256(data).hexdigest()==meta['sha256']
with tempfile.TemporaryDirectory() as tmp:
 t=Path(tmp);http=t/'http';http.mkdir()
 run('tshark','-r',str(E/'relay-transfer.pcap'),'--export-objects','http,'+str(http))
 with zipfile.ZipFile(http/'handover-314.zip') as z:
  receipt=json.loads(z.read('receipt.json'));assert receipt['receipt']=='R-314' and receipt['status']=='accepted';expect(receipt['proof'],'AstroSec{http_object_recovered}')
 assert (http/'handover-271.zip').is_file()
 names=run('tshark','-r',str(E/'resolver-window.pcap'),'-Y','dns.flags.response == 0','-T','fields','-e','dns.qry.name').decode().splitlines()
 pieces={}
 for name in names:
  m=re.fullmatch(r'(\d+)\.([0-9a-f]+)\.cache\.telemetry\.test',name)
  if m:
   seq=int(m[1]);assert seq not in pieces or pieces[seq]==m[2];pieces[seq]=m[2]
 assert sorted(pieces)==[1,2,3,4];expect(bytes.fromhex(''.join(pieces[i] for i in sorted(pieces))).decode(),'AstroSec{dns_fragments_reassembled}')
 photo=t/'photo';photo.mkdir()
 with zipfile.ZipFile(E/'survey-photos.zip') as z:z.extractall(photo)
 encoded=run('exiftool','-UserComment','-s3',str(photo/'original-cam17.jpg')).decode().strip();expect(base64.b64decode(encoded).decode(),'AstroSec{original_photo_verified}')
 assert not run('exiftool','-UserComment','-s3',str(photo/'feed-preview.jpg')).strip()
 db=t/'db';db.mkdir()
 with zipfile.ZipFile(E/'handoff-snapshot.zip') as z:
  z.extractall(db);base=t/'baseline.sqlite';base.write_bytes(z.read('handoff.sqlite'))
 with sqlite3.connect(base) as c:assert c.execute("SELECT count(*) FROM handoffs WHERE receipt='R-314'").fetchone()[0]==0
 with sqlite3.connect(db/'handoff.sqlite') as c:
  expect(c.execute("SELECT proof FROM handoffs WHERE receipt='R-314' AND status='accepted'").fetchone()[0],'AstroSec{wal_handoff_restored}');assert c.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
 media=t/'media';media.mkdir()
 with zipfile.ZipFile(E/'removable-media.zip') as z:z.extractall(media)
 listing=run('fls','-d',str(media/'relay-usb.img')).decode();m=re.search(r'\*\s+(\d+(?:-\d+)*):\s+_ANDOFF.TXT',listing);assert m,listing
 recovered=run('icat','-r',str(media/'relay-usb.img'),m[1]).decode();assert 'AstroSec{deleted_handoff_recovered}' in recovered
 mail=t/'mail';mail.mkdir()
 with zipfile.ZipFile(E/'mail-review.zip') as z:z.extractall(mail)
 gateway=(mail/'gateway.log').read_text();valid=[]
 for path in mail.glob('*.eml'):
  message=email.message_from_bytes(path.read_bytes(),policy=email.policy.default)
  if 'ACCEPT id='+message['Message-ID']+' ' in gateway:
   rows=list(csv.DictReader(io.StringIO(next(message.iter_attachments()).get_payload(decode=True).decode())));valid.extend(rows)
 assert len(valid)==1 and valid[0]['receipt']=='R-314';expect(valid[0]['proof'],'AstroSec{mail_route_verified}')
 with zipfile.ZipFile(E/'incident-timeline.zip') as z:
  sources={n:list(csv.DictReader(io.StringIO(z.read(n).decode()))) for n in ['operator.csv','gateway.csv','relay.csv']}
 solutions=[]
 for op in sources['operator.csv']:
  for gate in sources['gateway.csv']:
   for relay in sources['relay.csv']:
    if op['request']==gate['request']==relay['request'] and gate['session']==relay['session'] and (op['event'],gate['event'],relay['event'])==('HANDOFF_APPROVED','AUTH_ACCEPTED','UPLINK_ACCEPTED') and datetime.fromisoformat(op['time'])<datetime.fromisoformat(gate['time'])<datetime.fromisoformat(relay['time']):solutions.append('AstroSec{uplink_'+relay['session'].lower().replace('-','')+'_'+relay['relay'].lower().replace('-','')+'}')
 assert solutions==['AstroSec{uplink_sess42_kronos7}'],solutions
print('PASS: all seven cases solved with TShark, ExifTool, SQLite, Sleuth Kit, MIME parsing, and UTC correlation; evidence hashes verified.')
