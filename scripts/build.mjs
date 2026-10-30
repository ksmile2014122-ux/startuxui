import {cp,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
try { process.loadEnvFile('.env'); } catch(e) { if(e.code!=='ENOENT')throw e; }
const defaults=await import('../src/supabase-config.js');
const url=process.env.SUPABASE_URL||defaults.supabaseConfig.url;
const key=process.env.SUPABASE_PUBLISHABLE_KEY||defaults.supabaseConfig.key;
if(!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)||!key.startsWith('sb_publishable_')) throw new Error('Only a Supabase URL and publishable browser key are allowed.');
const target=path.resolve('dist');await mkdir(target,{recursive:true});
for(const file of ['index.html','src','assets'])await cp(file,path.join(target,file),{recursive:true});
await writeFile(path.join(target,'src/supabase-config.js'),'export const supabaseConfig = '+JSON.stringify({url,key})+';\n');
console.log('Built dist with public browser configuration only.');
