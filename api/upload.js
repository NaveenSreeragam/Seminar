// Seminar/demo endpoint. This intentionally does not store files permanently.
// It validates the extension and returns forensic metadata. For real storage,
// connect this endpoint to an approved object-storage provider.
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"POST only"});
  const chunks=[]; for await (const chunk of req) chunks.push(chunk);
  const body=Buffer.concat(chunks);
  const contentType=req.headers["content-type"]||"";
  const match=contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if(!match) return res.status(400).json({error:"Multipart form data required"});
  const boundary=Buffer.from("--"+(match[1]||match[2]));
  const parts=body.toString("latin1").split(boundary.toString("latin1"));
  let filename="evidence.zip", data=null;
  for(const part of parts){
    const sep=part.indexOf("\r\n\r\n"); if(sep<0) continue;
    const head=part.slice(0,sep); const content=part.slice(sep+4);
    const fn=head.match(/filename="([^"]+)"/i);
    if(fn && fn[1]) { filename=fn[1]; data=Buffer.from(content.replace(/\r\n--$/,""),"latin1"); }
  }
  if(!filename.toLowerCase().endsWith(".zip")) return res.status(400).json({error:"Only ZIP files are accepted"});
  if(!data) return res.status(400).json({error:"No file received"});
  const crypto = await import("node:crypto");
  const sha256=crypto.createHash("sha256").update(data).digest("hex");
  const id="EV-"+crypto.randomBytes(5).toString("hex").toUpperCase();
  return res.status(200).json({id,name:filename,sha256,timestamp:new Date().toISOString(),downloadUrl:"#"});
}
