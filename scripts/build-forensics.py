#!/usr/bin/env python3
"""Build fictional offline evidence. Requires Pillow only for the EXIF carrier.
No real captures, personal data, malware, network access, or app dependencies.
"""
from pathlib import Path
import base64, csv, hashlib, io, json, shutil, socket, sqlite3, struct, tempfile, zipfile
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/attachments/cases';OUT.mkdir(parents=True,exist_ok=True)
FLAGS={
'http':'AstroSec{http_object_recovered}',
'dns':'AstroSec{dns_fragments_reassembled}',
'photo':'AstroSec{original_photo_verified}',
'wal':'AstroSec{wal_handoff_restored}',
'disk':'AstroSec{deleted_handoff_recovered}',
'email':'AstroSec{mail_route_verified}',
'timeline':'AstroSec{uplink_sess42_kronos7}'}
def bundle(files):
 b=io.BytesIO()
 with zipfile.ZipFile(b,'w',zipfile.ZIP_DEFLATED) as z:
  for name,data in files.items():
   info=zipfile.ZipInfo(name,(2026,11,13,8,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,data)
 return b.getvalue()
def checksum(data):
 if len(data)%2:data+=b'\0'
 n=sum(struct.unpack('!%dH'%(len(data)//2),data));n=(n&65535)+(n>>16);n=(n&65535)+(n>>16);return (~n)&65535
def packet(src,dst,proto,payload,ident):
 ip=struct.pack('!BBHHHBBH4s4s',0x45,0,20+len(payload),ident,0,64,proto,0,socket.inet_aton(src),socket.inet_aton(dst))
 ip=ip[:10]+struct.pack('!H',checksum(ip))+ip[12:]
 return bytes.fromhex('0200000000020200000000010800')+ip+payload
def tcp(src,dst,sp,dp,seq,ack,flags,data=b''):
 h=struct.pack('!HHIIBBHHH',sp,dp,seq,ack,0x50,flags,65535,0,0)
 pseudo=socket.inet_aton(src)+socket.inet_aton(dst)+struct.pack('!BBH',0,6,len(h)+len(data))
 h=h[:16]+struct.pack('!H',checksum(pseudo+h+data))+h[18:];return h+data
def pcap(rows,path):
 b=io.BytesIO();b.write(struct.pack('<IHHIIII',0xa1b2c3d4,2,4,0,0,65535,1))
 for i,(t,frame) in enumerate(rows):b.write(struct.pack('<IIII',1794556800+int(t),int((t-int(t))*1e6),len(frame),len(frame))+frame)
 path.write_bytes(b.getvalue())
# HTTP: complete handshakes, multiple streams, compressed object split across segments.
rows=[];ident=1
for idx,(uri,body,ctype) in enumerate([
 ('/status.txt',b'Station garden watering complete.\n','text/plain'),
 ('/handover-314.zip',bundle({'receipt.json':json.dumps({'receipt':'R-314','status':'accepted','proof':FLAGS['http']}).encode()}),'application/zip'),
 ('/handover-271.zip',bundle({'receipt.json':b'{"receipt":"R-271","status":"cancelled","proof":"Cancelled test receipt; no submission token."}'}),'application/zip'),
 ('/notice.txt',b'Use receipt number from the maintenance conversation. A newer transfer can still be a cancelled test.\n','text/plain')]):
 a,b='192.0.2.24','198.51.100.7';sp=41000+idx;seq,ack=1000+idx*100,8000+idx*100
 req=('GET '+uri+' HTTP/1.1\r\nHost: relay-store.test\r\nConnection: close\r\n\r\n').encode()
 response=('HTTP/1.1 200 OK\r\nContent-Type: '+ctype+'\r\nContent-Length: '+str(len(body))+'\r\nConnection: close\r\n\r\n').encode()+body
 frames=[(a,b,sp,80,seq,0,2,b''),(b,a,80,sp,ack,seq+1,18,b''),(a,b,sp,80,seq+1,ack+1,16,b''),(a,b,sp,80,seq+1,ack+1,24,req),(b,a,80,sp,ack+1,seq+1+len(req),16,b'')]
 for offset in range(0,len(response),83):frames.append((b,a,80,sp,ack+1+offset,seq+1+len(req),24,response[offset:offset+83]))
 frames.extend([(b,a,80,sp,ack+1+len(response),seq+1+len(req),17,b''),(a,b,sp,80,seq+1+len(req),ack+2+len(response),17,b''),(b,a,80,sp,ack+2+len(response),seq+2+len(req),16,b'')])
 for k,f in enumerate(frames):rows.append((idx*60+k*.01,packet(f[0],f[1],6,tcp(*f),ident)));ident+=1
pcap(rows,OUT/'relay-transfer.pcap')
# DNS: out-of-order hex fragments, a retry, and ordinary background questions.
def qwire(name):return b''.join(bytes([len(x)])+x.encode() for x in name.split('.'))+b'\0'
hexflag=FLAGS['dns'].encode().hex();parts=[hexflag[i:i+18] for i in range(0,len(hexflag),18)]
queries=['garden.station.test','mail.station.test','03.'+parts[2]+'.cache.telemetry.test','01.'+parts[0]+'.cache.telemetry.test','news.station.test','04.'+parts[3]+'.cache.telemetry.test','02.'+parts[1]+'.cache.telemetry.test','02.'+parts[1]+'.cache.telemetry.test']
rows=[]
for i,name in enumerate(queries):
 q=qwire(name)+struct.pack('!HH',1,1);dns=struct.pack('!HHHHHH',200+i,0x100,1,0,0,0)+q
 ans=struct.pack('!HHHHHH',200+i,0x8180,1,1,0,0)+q+b'\xc0\x0c'+struct.pack('!HHIH',1,1,60,4)+socket.inet_aton('203.0.113.9')
 for j,(src,dst,sp,dp,data) in enumerate([('192.0.2.24','192.0.2.53',53000+i,53,dns),('192.0.2.53','192.0.2.24',53,53000+i,ans)]):
  rows.append((i*7+j*.1,packet(src,dst,17,struct.pack('!HHHH',sp,dp,8+len(data),0)+data,100+i*2+j)))
pcap(rows,OUT/'resolver-window.pcap')
# EXIF: original image and stripped preview. No real location or identity.
im=Image.new('RGB',(720,420),'#1e2d40');draw=ImageDraw.Draw(im);draw.rectangle((80,110,640,330),outline='#cad5e2',width=3);draw.text((100,145),'COSMOLOG  /  RELAY SERVICE BAY',fill='white');draw.text((100,180),'Fictional station survey  /  asset CAM-17',fill='white')
exif=Image.Exif();exif[271]='CosmoLog Training';exif[272]='Station Survey Camera';exif[306]='2026:11:13 08:17:00';exif[270]='Original CAM-17 survey. The preview was re-exported without the survey record.';exif[37510]=b'ASCII\0\0\0'+base64.b64encode(FLAGS['photo'].encode())
b=io.BytesIO();im.save(b,'JPEG',exif=exif,quality=85);original=b.getvalue();b=io.BytesIO();im.resize((360,210)).save(b,'JPEG');preview=b.getvalue()
(OUT/'survey-photos.zip').write_bytes(bundle({'original-cam17.jpg':original,'feed-preview.jpg':preview,'readme.txt':b'Compare the original survey with its resized feed preview. Survey annotations used Base64 for the old export system. No real location data is present.\n'}))
# SQLite: baseline database and committed WAL. Copy before closing the source connection.
with tempfile.TemporaryDirectory() as tmp:
 db=Path(tmp)/'handoff.sqlite';c=sqlite3.connect(db);c.execute('PRAGMA journal_mode=WAL');c.execute('PRAGMA wal_autocheckpoint=0');c.execute('CREATE TABLE handoffs(receipt TEXT PRIMARY KEY,status TEXT,proof TEXT)');c.execute('INSERT INTO handoffs VALUES (?,?,?)',('R-271','cancelled','No accepted handoff in this checkpoint.'));c.commit();c.execute('PRAGMA wal_checkpoint(TRUNCATE)');c.execute('INSERT INTO handoffs VALUES (?,?,?)',('R-314','accepted',FLAGS['wal']));c.commit()
 (OUT/'handoff-snapshot.zip').write_bytes(bundle({'handoff.sqlite':db.read_bytes(),'handoff.sqlite-wal':Path(str(db)+'-wal').read_bytes(),'readme.txt':b'Acquired together from the relay workstation before shutdown. Keep the database and its sidecar together. Work on a copy. The accepted receipt is named in the maintenance chat.\n'}));c.close()
# FAT12 superfloppy with a genuinely deleted directory entry and recoverable content.
disk=bytearray(1474560);boot=bytearray(512);boot[:3]=b'\xeb\x3c\x90';boot[3:11]=b'MSDOS5.0';struct.pack_into('<HBHBHHBHHHII',boot,11,512,1,1,2,224,2880,0xf0,9,18,2,0,0);boot[36]=0;boot[38]=0x29;struct.pack_into('<I',boot,39,0x434f534d);boot[43:54]=b'COSMOLOG   ';boot[54:62]=b'FAT12   ';boot[510:]=b'\x55\xaa';disk[:512]=boot
fat=bytearray(4608);fat[:3]=b'\xf0\xff\xff';fat[3]=0xff;fat[4]=0x0f # cluster 2 allocated; deleted cluster 3 is free
for offset in [512,5120]:disk[offset:offset+4608]=fat
root=19*512;data_start=33*512
live=b'CosmoLog removable media image. A handoff text file was removed before acquisition. Recover the deleted file, not this readme.\r\n';deleted=('Receipt R-314\r\nRecovered handoff proof: '+FLAGS['disk']+'\r\n').encode()
def entry(name,cluster,size,deleted=False):
 e=bytearray(32);e[:11]=name;e[11]=0x20;struct.pack_into('<HHHHHI',e,22,8*2048,((2026-1980)<<9)|(11<<5)|13,cluster,0,0,0) if False else None
 struct.pack_into('<H',e,22,8<<11);struct.pack_into('<H',e,24,((2026-1980)<<9)|(11<<5)|13);struct.pack_into('<H',e,26,cluster);struct.pack_into('<I',e,28,size)
 if deleted:e[0]=0xe5
 return e
disk[root:root+32]=entry(b'README  TXT',2,len(live));disk[root+32:root+64]=entry(b'HANDOFF TXT',3,len(deleted),True);disk[data_start:data_start+len(live)]=live;disk[data_start+512:data_start+512+len(deleted)]=deleted
(OUT/'removable-media.zip').write_bytes(bundle({'relay-usb.img':disk,'acquisition.txt':b'Raw FAT12 filesystem image, starts at byte 0; no partition table. Inspect a copy with Autopsy or The Sleuth Kit. The device is fictional.\n'}))
# Email: matching mail gateway receipt distinguishes the accepted original from a cancelled draft.
def eml(mid,receipt,proof,date):
 payload=base64.encodebytes(('receipt,status,proof\n'+receipt+',accepted,'+proof+'\n').encode()).decode()
 return ('Received: from relay-mail.test (192.0.2.44) by station-gateway.test; '+date+'\r\nFrom: Station Maintenance <maintenance@station.test>\r\nTo: Nova <nova@station.test>\r\nDate: '+date+'\r\nMessage-ID: <'+mid+'@station.test>\r\nSubject: Handoff receipt '+receipt+'\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="cosmolog-evidence"\r\n\r\n--cosmolog-evidence\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nReceipt attached for archive review. Match the Message-ID against the gateway log.\r\n--cosmolog-evidence\r\nContent-Type: text/csv; name="receipt.csv"\r\nContent-Disposition: attachment; filename="receipt.csv"\r\nContent-Transfer-Encoding: base64\r\n\r\n'+payload.replace('\n','\r\n')+'\r\n--cosmolog-evidence--\r\n').encode()
(OUT/'mail-review.zip').write_bytes(bundle({'receipt-original.eml':eml('handoff-314','R-314',FLAGS['email'],'Fri, 13 Nov 2026 08:17:00 +0000'),'receipt-draft.eml':eml('draft-314','R-314','Cancelled draft; not an accepted gateway record.','Fri, 13 Nov 2026 08:19:00 +0000'),'gateway.log':b'2026-11-13T08:17:01Z ACCEPT id=<handoff-314@station.test> receipt=R-314\n2026-11-13T08:19:01Z DROP id=<draft-314@station.test> reason=cancelled-draft\n','readme.txt':b'These are fictional email evidence files, not messages to send. Compare gateway disposition and Message-ID, then inspect the MIME attachment. Sender display names alone do not authenticate email.\n'}))
# Timeline: out-of-order local times, exact correlation by session and request ID.
files={'relay.csv':'time,session,relay,event,request\n2026-11-13T10:17:04+02:00,sess-42,KRONOS-7,UPLINK_ACCEPTED,req-314\n2026-11-13T08:16:59+00:00,sess-41,KRONOS-6,UPLINK_REJECTED,req-271\n2026-11-13T03:18:00-05:00,sess-43,KRONOS-8,TEST_ACCEPTED,req-999\n','gateway.csv':'time,session,event,request\n2026-11-13T03:17:01-05:00,sess-42,AUTH_ACCEPTED,req-314\n2026-11-13T08:17:02+00:00,sess-41,AUTH_DENIED,req-271\n2026-11-13T08:18:01+00:00,sess-43,TEST_ONLY,req-999\n','operator.csv':'time,event,request\n2026-11-13T09:17:00+01:00,HANDOFF_APPROVED,req-314\n2026-11-13T08:16:58+00:00,DRILL_CANCELLED,req-271\n','instructions.txt':'Determine the production session whose handoff was approved, then authenticated, then accepted by a relay. Normalize timestamps to UTC before ordering events. Correlate request and session identifiers. Exclude tests and rejected events. Submit AstroSec{uplink_<session>_<relay>} with lowercase letters and all hyphens removed from the two identifiers. Example format only: AstroSec{uplink_sess00_kronos0}.\n'}
(OUT/'incident-timeline.zip').write_bytes(bundle({k:v.encode() for k,v in files.items()}))
manifest={p.name:{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for p in sorted(OUT.iterdir()) if p.is_file() and p.name!='manifest.json'}
(OUT/'manifest.json').write_text(json.dumps({'scenario':'CosmoLog fictional offline evidence','files':manifest},indent=2)+'\n')
print('Built',len(manifest),'artifacts')
