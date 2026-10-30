let cached=null,expires=0,pending=null;
export default async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.statusCode=405;res.end(JSON.stringify({error:'GET only'}));return}
 if(!process.env.YOUTUBE_API_KEY){res.statusCode=503;res.end(JSON.stringify({error:'YOUTUBE_API_KEY가 설정되지 않았습니다.'}));return}
 try{
 if(!cached||Date.now()>expires){
 if(!pending)pending=(async()=>{const params=new URLSearchParams({part:'snippet',type:'video',q:'경제 뉴스 shorts',videoDuration:'short',videoEmbeddable:'true',safeSearch:'strict',relevanceLanguage:'ko',maxResults:'8',key:process.env.YOUTUBE_API_KEY});const response=await fetch('https://www.googleapis.com/youtube/v3/search?'+params,{signal:AbortSignal.timeout(10000)});const data=await response.json();if(!response.ok)throw new Error('YouTube API 요청 실패. API 활성화·키 제한·할당량을 확인하세요.');cached={items:(data.items||[]).map(item=>({id:item.id.videoId,title:item.snippet.title,channel:item.snippet.channelTitle})),updatedAt:new Date().toISOString()};expires=Date.now()+60*60*1000;})().finally(()=>pending=null);
 await pending;
 }
 res.setHeader('Cache-Control','public, max-age=300, s-maxage=3600');res.end(JSON.stringify(cached));
 }catch{res.statusCode=502;res.end(JSON.stringify({error:'영상을 불러오지 못했습니다. API 설정 또는 할당량을 확인하세요.'}))}
}
