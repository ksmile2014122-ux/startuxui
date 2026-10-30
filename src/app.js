const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
let entries=read('ditto.entries',[]),draft=read('ditto.draft',{title:'매매일지',stock:'삼성전자',entry:'',memo:'',visibility:'전체 공개'}),nickname=read('ditto.name','원칙투자자_현'),follow=read('ditto.follow',false),saved=read('ditto.saved',false),liked=false,tab='추천';
const store=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const button=(label,action,cls='')=>`<button class="${cls}" data-action="${action}">${label}</button>`;
const chart=()=>`<div class="chart"><div><strong>삼천당제약 (000250)</strong><b>+8.74%</b></div><svg viewBox="0 0 360 150" role="img" aria-label="시연용 상승 차트"><path d="M10 125L60 115L110 95L160 105L210 70L260 40L310 35L350 20" fill="none" stroke="#ffb5cf" stroke-width="3"/><g stroke="#e81a78" stroke-width="7"><path d="M40 110v22M90 98v24M135 80v30M220 55v42M270 35v30M320 18v35"/></g></svg><small>예시 체결 기록 · 시연 데이터</small></div>`;
const nav=()=>`<nav>${[['⌂','Main','home'],['◉','Ditto Live','live'],['▷','Ditto Shorts','shorts'],['▣','My Ditto','my']].map(([i,l,a])=>button(`<span>${i}</span>${l}`,a,location.hash.slice(1)===a?'active':'')).join('')}</nav>`;
function header(title,home=false){return `<header>${home?'<strong>DITTO</strong>':button('‹','back','back')+`<strong>${title}</strong>`}<div>${button('⌕','search','icon')}${button('♧','notifications','icon')}</div></header>`}
function card(content){return `<section class="card">${content}</section>`}
function go(page){location.hash=page;if(location.hash.slice(1)===page)render()}
function profile(){return `<div class="person"><div class="avatar">현</div><div><h2>${esc(nickname)}</h2><span class="badge">✦ 학습 인증</span><p>기록 180일차 · 복기 142건</p></div></div>`}
function summary(p){return card(`<span class="badge">${esc(p.visibility)}</span>${profile()}<div class="stock">#${esc(p.stock)} <span>+3.6% 목표</span></div><h3>복기 3단계 요약</h3><div class="inset"><small>1. 진입 근거</small><p>${esc(p.entry)}</p></div><div class="inset"><small>2. 청산 전략</small><p class="pink">목표가 77,200원 (+3.6%)</p><p>손절가 73,100원 (-1.8%)</p></div><div class="inset"><small>3. 멘탈 & 반성 메모</small><p>${esc(p.memo||'기록된 메모가 없습니다.')}</p></div><p class="notice">시연용 투자 기록입니다. 실제 거래나 계좌 조회와 연결되지 않습니다.</p>`)}
function render(){const page=location.hash.slice(1)||'start';let body='',title='',home=false;
if(page==='start'){title='DITTO 시작하기';body=`<div class="intro"><small>DITTO · 01</small><h1>투자의 경험을 공유하고,<br>함께 기록하세요.</h1><p>원칙 기반의 클린 소셜 투자 문화.<br>예시 계정으로 시작하는 프론트엔드 시연입니다.</p>${button('로그인하고 처음 시작하기','nickname','primary')}${button('기존 이용자로 시작','home')}${button('계좌 개설 안내','account')}</div>`}
else if(page==='nickname'){title='닉네임 설정';body=`${card('<small class="pink">KIWOOM SOCIAL DITTO</small><h1>투자 페르소나 설정</h1><p>함께 기록할 나만의 이름을 정해주세요.</p>')}<form id="nameform"><label>나만의 닉네임<input name="nickname" maxlength="12" required value="${esc(nickname)}"></label><p>최대 12자 · 실명과 계좌정보는 입력하지 마세요.</p><button class="primary">DITTO 투자 시작하기 →</button></form>`}
else if(page==='home'){home=true;body=`<div class="tabs">${button('추천','recommend',tab==='추천'?'selected':'')}${button('팔로잉','following',tab==='팔로잉'?'selected':'')}<small>KOSDAQ 890.42 <em>+1.24%</em></small></div><div class="stories">${button('＋<small>나도 기록하기</small>','write','story')}${button('◉<small>여의도제시… · LIVE</small>','live','story live')}${button('◉<small>스윙의정석</small>','profile','story')}</div>${tab==='팔로잉'&&!follow?card('<h2>아직 팔로우한 투자자가 없어요</h2><p>관심 있는 투자자의 기록을 살펴보세요.</p>'+button('투자자 찾아보기','search','primary')):card(`${profile()}${button(follow?'팔로잉 ✓':'팔로우','follow','pill')}<div class="tags">#삼천당제약　 #바이오돌파　 #손절기준철저</div>${chart()}<p>오늘 장 초반 거래량 실린 갭상승 확인 후 1차 분할 진입. 계획된 원칙에 따라 매매 과정을 기록합니다.</p>${button('투자일지 자세히 보기','detail')}${button(liked?'♥ 공감함':'♡ 공감','like','inline')}${button(saved?'▣ 저장됨':'♧ 저장','save','inline')}${button('댓글','comments','inline')}`)}${entries.map(p=>summary(p)).join('')}${button('▧ 일지 작성','write','floating')}`}
else if(page==='write'){title='투자일지 작성';body=`<p class="eyebrow">04 사진과 글로 남기는 투자 기록 <span>작성 중 · 임시저장 가능</span></p><form id="journal"><input aria-label="일지 제목" name="title" value="${esc(draft.title)}">${card(`<h3>매매 종목 & 전략 태그</h3><label>종목<input name="stock" required value="${esc(draft.stock)}"></label><div class="tags">단기 스윙 ✓　 돌파 매매 ✓　 분할 매수</div>`)}${card(`<label><h3>1. 진입 근거 <small class="pink">필수 입력</small></h3><textarea name="entry" required placeholder="진입 근거를 작성해 주세요.">${esc(draft.entry)}</textarea></label>`)}${card('<h3>2. 청산 및 손익 가격</h3><div class="metrics"><div>익절가<p class="pink">77,200원</p></div><div>손절 기준가<p>73,100원</p></div></div>')}${card(`<label><h3>3. 멘탈 & 반성 메모</h3><textarea name="memo" placeholder="오늘의 복기를 작성해 주세요.">${esc(draft.memo)}</textarea></label>`)}${card(`<label>공개범위<select name="visibility">${['전체 공개','팔로워에게만 공개','나만 보기'].map(v=>`<option ${draft.visibility===v?'selected':''}>${v}</option>`).join('')}</select></label>`)}<button class="primary">미리보기 · 입력 확인하기</button>${button('임시저장','draft')}${button('예시 내용 채우기','example')}</form>`}
else if(page==='preview'){title='투자일지 미리보기';body=summary(draft)+button('이 내용으로 게시하기','publish','primary')+button('일지 내용 수정하기','write')}
else if(page==='published'){title='게시 완료';body=`<div class="intro"><small>DITTO · 03</small><h1>투자일지가 게시되었어요</h1><p>이 브라우저에 저장했습니다. 다른 이용자에게 전송되지는 않습니다.</p>${button('내 게시물 보기','my')}${button('메인 피드로 가기','home','primary')}</div>`}
else if(page==='my'||page==='profile'){title='My Ditto';body=card(profile()+'<p>시장의 변동성은 예측 대상이 아닌 대응의 영역입니다.</p>'+button('프로필 수정','nickname')+button('계좌 연동 관리','account'))+`<div class="metrics">${card('<h2>124일</h2>연속 기록')}${card(`<h2>${entries.length}개</h2>작성 일지`)}${card('<h2>94%</h2>원칙 준수율')}</div>`+card('<h2>♜ My 배지</h2><div class="medals">🥇　 📅　 🛡</div><p>10억 자산 · 60일 연속 · 위험관리 방패</p>'+button('배지 전체보기','badges'))+button('임시저장 이어쓰기','write')+button('저장한 콘텐츠','saved')+entries.map(summary).join('')}
else if(page==='search'){title='종목·투자자 검색';body=`<form id="searchform"><input name="query" placeholder="종목 또는 투자자 검색" required><button class="primary">검색</button></form><h2>실시간 인기 검색 종목</h2>${['삼성전자 005930','삼천당제약 000250','SK하이닉스 000660','알테오젠 196170','현대차 005380'].map((v,i)=>card(`<strong>${i+1}　${v}</strong>${button('투자일지 보기','detail')}`)).join('')}`}
else if(page==='detail'){title='투자일지 상세';body=card(profile()+button(follow?'팔로잉 ✓':'팔로우','follow')+chart()+'<h2>1. 진입 근거</h2><p>20일 이동평균선 지지 반등과 거래량을 확인한 후 진입했습니다.</p><h2>2. 대응 전략</h2><p>사전에 설정한 손절 기준과 분할 청산 계획을 준수합니다.</p>'+button('댓글 보기','comments')+button('게시물 저장','save')+button('신고하기','report'))}
else if(page==='live'||page==='shorts'){title=page==='live'?'Ditto Live':'Ditto Shorts';body=`<div class="media"><span class="badge">시연 콘텐츠 · 정지 화면</span><h1>${page==='live'?'DITTO LIVE':'DITTO SHORTS'}</h1>${chart()}<h2>여의도 제시리버모어</h2><p>손익비와 투자 원칙을 함께 기록하세요.</p></div>`+card('<h3>실제 방송 대신 화면 흐름을 확인하는 시연입니다.</h3>'+button('질문과 응원 남기기','comments')+button(saved?'저장됨':'저장하기','save'))}
else if(page==='comments'){title='댓글';body=card('<h1>함께 나누는 투자 기록</h1><p>스윙마스터K<br>원칙을 지킨 과정이 인상적이에요.</p><div id="commentlist"></div><form id="commentform"><label>댓글<textarea name="comment" required maxlength="500" placeholder="어떤 생각이 드셨나요?"></textarea></label><button class="primary">댓글 등록</button></form>')}
else if(page==='account'||page==='badges'){title=page==='account'?'계좌 안내':'배지 모음 & 자산 인증';body=`<div class="intro"><small>DITTO · 05</small><h1>${page==='account'?'영웅문 계좌와 연결하기':'자산과 기록을 구분해요'}</h1><p>이 프로젝트는 프론트엔드 시연입니다. 실제 로그인, 계좌 조회, 자산 인증을 수행하지 않습니다.</p>${page==='badges'?'<div class="medals">🥇　📅　🛡</div><p>배지는 예시이며 투자 실력이나 수익을 보장하지 않습니다.</p>':''}${button('My Ditto로 돌아가기','my','primary')}</div>`}
else if(page==='saved'){title='Saved Content';body=saved?card('<h2>저장한 투자일지</h2>'+chart()+button('상세 보기','detail')):card('<h2>저장한 콘텐츠가 없어요</h2>'+button('메인 피드로 가기','home'))}
else if(page==='notifications'){title='알림';body=card('<h1>새로운 소식</h1><p>참여한 댓글과 투자자의 소식을 확인하세요.</p>'+button('댓글 보기','comments')+button('관심 투자자의 라이브 보기','live'))}
else if(page==='report'){title='신고하기';body=`<form id="reportform"><h1>건전한 투자 생태계 보호</h1><p>시연용 신고 양식입니다. 외부로 접수하지 않습니다.</p><label>신고 사유<select required><option value="">선택해주세요</option><option>허위 매매 인증 및 과장 수익</option><option>불법 리딩방 및 광고</option><option>비방 및 모욕</option><option>기타 가이드라인 위반</option></select></label><label>상세 설명<textarea maxlength="500" required></textarea></label><button class="primary">시연 신고 확인</button></form>`}
else {go('home');return}
app.innerHTML=header(title,home)+`<main>${body}</main>`+(!['start','nickname'].includes(page)?nav():'')+'<div id="toast" role="status"></div>';window.scrollTo(0,0);
}
function toast(t){const el=document.querySelector('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2500)}
function capture(){const f=document.querySelector('#journal');if(f)draft=Object.fromEntries(new FormData(f));store('ditto.draft',draft)}
app.addEventListener('input',e=>{if(e.target.closest('#journal'))capture()});
app.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
if(a==='back'){go('home')}else if(a==='follow'){follow=!follow;store('ditto.follow',follow);render()}else if(a==='like'){liked=!liked;render()}else if(a==='save'){saved=!saved;store('ditto.saved',saved);toast(saved?'콘텐츠를 저장했습니다':'저장을 해제했습니다')}else if(a==='following'||a==='recommend'){tab=a==='following'?'팔로잉':'추천';render()}else if(a==='draft'){capture();toast('이 브라우저에 임시저장했습니다')}else if(a==='example'){draft.entry='20일 이동평균선 지지와 거래량 증가를 확인한 뒤 분할 진입했습니다.';draft.memo='계획한 손절 기준을 지켰습니다. 다음에는 진입 전 거래량을 더 확인하겠습니다.';store('ditto.draft',draft);render()}else if(a==='publish'){entries.unshift({...draft,id:Date.now()});store('ditto.entries',entries);go('published')}else go(a)});
app.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='journal'){capture();go('preview')}else if(e.target.id==='nameform'){nickname=new FormData(e.target).get('nickname').trim();if(!nickname){toast('닉네임을 입력해주세요');return}store('ditto.name',nickname);go('home')}else if(e.target.id==='searchform'){const q=new FormData(e.target).get('query').trim();if(/삼성|삼천|여의도|제시/.test(q))go('detail');else toast('검색 결과가 없어요. 삼성전자 또는 삼천당제약으로 검색해 보세요.')}else if(e.target.id==='commentform'){const p=document.createElement('p');p.textContent=nickname+' · '+new FormData(e.target).get('comment');document.querySelector('#commentlist').append(p);e.target.reset();toast('시연 댓글을 등록했습니다')}else if(e.target.id==='reportform')toast('시연 신고가 확인되었습니다. 실제 전송되지 않습니다.')});
window.addEventListener('hashchange',()=>render());render();

/* Reference-driven screen system. Screens remain live HTML; image regions use supplied references as sprites. */
const icons={home:'<path d="m3 10 9-8 9 8v11h-6v-7H9v7H3z"/>',live:'<circle cx="12" cy="12" r="2"/><path d="M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M3 3a13 13 0 0 0 0 18M21 3a13 13 0 0 1 0 18"/>',shorts:'<circle cx="12" cy="12" r="10"/><path d="m10 7 7 5-7 5z"/>',my:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 9H12v7h9"/><circle cx="16" cy="12.5" r="1"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',bell:'<path d="M5 17h14l-2-3V8a5 5 0 0 0-10 0v6zM10 21h4M12 1v2"/>',back:'<path d="m15 3-9 9 9 9"/>',share:'<circle cx="18" cy="4" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="18" cy="20" r="3"/><path d="m8 10 7-4M8 14l7 4"/>'};
const icon=k=>`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[k]||icons.my}</svg>`;
const photo=(kind,cls='')=>`<div class="photo ${kind} ${cls}" role="img" aria-label="디자인에 사용된 시연 이미지"></div>`;
const originalRender=render;
const screen=(title,heading,description,actions,step='03')=>({title,heading,description,actions,step});
const screens={
start:screen('DITTO 시작하기','투자의 경험을 공유하고,<br>함께 기록하세요.','영웅문 로그인 후 DITTO를 이용할 수 있어요. 이 프로토타입에서는 예시 계정으로 진행합니다.',[['로그인하고 처음 시작하기','nickname'],['기존 이용자로 로그인','home'],['계좌 개설 안내','account']],'01'),
account:screen('계좌 안내','영웅문 계좌와 연결하기','실제 계좌 개설과 본인 확인은 영웅문 서비스에서 진행합니다. 이 시연에서는 안내 단계까지 확인할 수 있어요.',[['자산 인증 안내 보기','verify'],['돌아가기','my']],'05'),
verify:screen('자산 인증','공개할 정보부터 확인해요','정확한 잔고는 공개하지 않고 자산구간 배지만 표시합니다. 실제 계좌 조회 없이 예시 결과를 보여줍니다.',[['□ 자산구간 배지 공개에 동의','consent1'],['□ 실력 보증이 아님을 확인','consent2'],['동의하고 인증하기','verify-submit'],['인증 실패 예시 보기','verify-fail'],['취소','my']],'05'),
'Verify-unused':null,
'verify-fail':screen('인증 확인','인증을 완료하지 못했어요','필수 동의 항목과 연결 상태를 확인해 주세요. 인증 전에는 새 배지를 표시하지 않습니다.',[['다시 확인하기','verify'],['인증 취소','my']],'05'),
'verify-done':screen('인증 완료','자산구간을 확인했어요','예시 계정의 10억 구간 배지가 반영되었습니다. 자산 규모는 투자 실력이나 수익을 보장하지 않습니다.',[['프로필에서 확인','my'],['배지 모음으로 가기','badges']],'05'),
'badge-info':screen('배지 안내','자산과 기록을 구분해요','자산 배지는 보유 규모를, 기록 배지는 기록 이력을 나타냅니다. 위험관리 배지의 상세 평가 기준은 기획 검토 단계입니다.',[['닫기','badges']],'05'),
comments:screen('댓글','함께 나누는 투자 기록','스윙마스터K<br>원칙을 지킨 과정이 인상적이에요.<br><br>밸류파인더<br>진입 근거를 자세히 남겨주셔서 감사합니다.',[['댓글 작성','comment-write'],['닫기','detail']],'02'),
'comment-write':screen('댓글 작성','어떤 생각이 드셨나요?','원칙을 지킨 과정이 도움이 됐어요.',[['원칙을 지킨 과정이 도움이 됐어요.','comment-input'],['댓글 등록','comment-submit'],['취소','comments']],'02'),
exit:screen('작성 중 나가기','작성한 내용을 남겨둘까요?','임시저장하면 My Ditto에서 이어서 작성할 수 있어요.',[['임시저장하고 나가기','draft-exit'],['저장하지 않고 나가기','home'],['계속 작성하기','write']]),
published:screen('게시 완료','투자일지가 게시되었어요','선택한 공개범위로 기록을 저장했습니다. 내 일지에서 다시 확인할 수 있어요.',[['내 게시물 보기','my-post'],['메인 피드로 가기','home'],['My Ditto로 가기','my']]),
drafts:screen('임시저장','이어서 기록하기','임시저장한 기록이 있으면 아래에 이어쓰기 버튼이 표시됩니다. 게시 전까지 나에게만 보여요.',[['이어서 작성하기','write'],['My Ditto로 돌아가기','my']],'04'),
content:screen('내용 작성','오늘의 판단을 기록하세요','시연용 내용을 선택하면 작성 화면과 미리보기에 같은 내용이 반영됩니다.',[['진입 근거와 복기 예시 채우기','fill-example'],['입력 지우기 · 필수 오류 확인','clear-example'],['취소','write']]),
attachments:screen('사진 첨부','기록을 설명하는 이미지','기존 예시 이미지 2장을 사용합니다. 계좌번호 등 민감한 정보는 직접 확인하고 가려주세요.',[['예시 이미지 2장 첨부','attach'],['첨부 이미지 모두 삭제','detach'],['취소','write']]),
visibility:screen('공개범위','누구와 공유할까요?','선택한 범위가 미리보기와 게시된 내 일지에도 적용됩니다.',[['전체 공개','visibility-all'],['팔로워에게만 공개','visibility-follow'],['나만 보기','visibility-private'],['취소','write']]),
validation:screen('작성 내용 확인','진입 근거가 필요해요','진입 근거를 작성한 뒤 미리보기를 확인해 주세요. 현재 작성한 내용은 유지됩니다.',[['내용 작성하기','content'],['작성 화면으로 돌아가기','write']]),
'record-type':screen('기록 유형','어떤 기록을 남기시나요?','사진과 글로 매매 과정이나 포트폴리오의 구성 원칙을 기록해 보세요.',[['매매일지','type-trade'],['포트폴리오','type-portfolio'],['취소','write']]),
notifications:screen('알림','새로운 소식','참여한 댓글과 팔로우한 투자자의 소식을 확인하세요.',[['내가 참여한 일지에 새 댓글','comments'],['관심 투자자의 라이브 보기','live-room'],['닫기','home']],'04'),
'no-results':screen('검색 결과','검색 결과가 없어요','검색어를 확인하거나 인기 종목과 추천 투자자를 살펴보세요.',[['다시 검색하기','search'],['메인 피드로 가기','home']],'04'),
results:screen('검색 결과','종목 또는 투자자 검색','종목과 관련 기록, 투자자를 함께 살펴보세요.',[['삼천당제약 · 투자일지 보기','detail'],['여의도 제시리버모어 · 프로필','profile'],['다른 검색어 · 결과 없음','no-results'],['검색으로 돌아가기','search']],'04'),
menu:screen('게시물 메뉴','이 투자일지','선택한 게시물의 저장·공유·신고를 관리합니다.',[['북마크','save'],['공유하기','share'],['신고하기','report'],['닫기','detail']],'02'),
share:screen('공유','투자 기록 공유','프로토타입에서는 공유 완료 상태를 체험합니다. 실제 링크는 외부로 전송되지 않아요.',[['공유 링크 복사','copy-share'],['취소','home']],'02'),
'report-done':screen('신고 접수 완료','신고가 접수되었어요','접수한 내용은 검토 후 처리됩니다. 신고자의 정보는 게시물 작성자에게 공개되지 않습니다.<br><br>시연 접수번호 DITTO-001',[['게시물로 돌아가기','detail'],['메인 피드로 가기','home']],'07'),
'report-check':screen('신고 내용 확인','필수 항목을 확인해 주세요','신고 사유를 선택하고 신고 내용 확인에 동의하면 제출할 수 있어요.',[['신고 내용 수정','report'],['신고 취소','detail']],'07'),
'live-join':screen('라이브 참여','질문과 응원 남기기','예시 메시지: 손익비를 정하는 기준이 도움이 됐어요.',[['예시 메시지 보내기','send-live'],['취소','live-room']],'06'),
'edit-profile':screen('프로필 수정','나의 투자 이름','예시 닉네임을 적용하고 프로필로 돌아갑니다.',[['원칙투자자_현으로 저장','profile-save'],['취소','my']],'05')};
let consent1=false,consent2=false,attached=true;
function navHTML(p){const active=['write','preview','my-post','badges'].includes(p)?'my':p.startsWith('live')?'live':p.startsWith('short')?'shorts':['my','saved'].includes(p)?'my':'home';return `<nav>${[['home','Main'],['live','Ditto Live'],['shorts','Ditto Shorts'],['my','My Ditto']].map(([a,l])=>button(`${icon(a)}<span>${l}</span>`,a,active===a?'active':'')).join('')}</nav>`}
function headHTML(title,p){const dark=['home','my','live','search','detail','profile','report','write'].includes(p);return `<header class="${dark?'dark':'light'}">${p==='home'?'<strong>DITTO</strong>':button(icon('back'),p==='write'?'exit':'home','head-icon')+`<strong>${title}</strong>`}<div>${['home','my','live'].includes(p)?button(icon('search'),'search','head-icon')+button(icon('bell'),'notifications','head-icon'):button(icon('share'),'share','head-icon')}</div></header>`}
function mount(p,title,body,{nav=true,cls=''}={}){app.className=cls;app.innerHTML=headHTML(title,p)+`<main>${body}</main>`+(nav?navHTML(p):'')+'<div id="toast" role="status"></div>';window.scrollTo(0,0)}
function photoPerson(name='여의도 제시리버모어'){return `<div class="person">${photo('avatar-photo')}<div><h2>${name}</h2><span class="badge">✦ 학습 인증</span><p>🔥 기록 180일차 · 복기 142건</p></div></div>`}
function evidence(){return `<div class="evidence"><div class="evidence-head">♧ 체결 타점 및 분봉 차트 <span>● 체결 기록 예시</span></div>${photo('evidence-photo')}<div class="evidence-foot">사용자가 첨부한 체결 기록 · 시연 데이터 ${button('차트 확대보기 ↗','chart-full','inline')}</div></div>`}
function previewHTML(){return `<article class="preview-card"><div class="row"><span class="tag">◉ ${esc(draft.visibility)}</span><small>게시 전</small></div>${photoPerson(esc(nickname))}<div class="stock">삼　#${esc(draft.stock)} <span>+3.6% 목표</span></div><h3>♧ 복기 3단계 요약</h3>${[['진입 근거',draft.entry||'눌러서 진입 근거를 작성해 주세요.'],['청산 전략 (Target & Cut)','목표가 77,200원 (+3.6%)<br>손절가 73,100원 (-1.8%)'],['멘탈 & 반성 메모',draft.memo||'눌러서 오늘의 복기를 작성해 주세요.']].map(([t,c],i)=>`<div class="summary-row"><b>${i+1}</b><div><small>${t}</small><p>${i===1?c:esc(c)}</p></div></div>`).join('')}<h4>첨부된 증빙 차트 & 체결</h4>${attached?evidence():''}<p class="notice">예시 이미지입니다. 게시 전 개인정보 노출 여부를 확인해 주세요.</p><div class="row">♡ 0　▢ 0　♧ 0 <strong class="pink">⇄ 게시 전 최종 확인</strong></div></article>${button('▤ '+(location.hash==='#my-post'?'메인 피드로 가기':'이 내용으로 게시하기'),location.hash==='#my-post'?'home':'publish','primary')}${button('☷ 일지 내용 수정하기','write')}`}
render=function(){let p=location.hash.slice(1)||'start';if(screens[p]){const s=screens[p];mount(p,s.title,`<div class="info-screen"><small>DITTO · ${s.step}</small><h1>${s.heading}</h1><p>${s.description}</p><div class="info-actions">${s.actions.map(([l,a],i)=>button(l,a,i===0?'primary':'')).join('')}</div></div>`,{nav:false,cls:'info-layout'});return}
if(p==='home'){mount(p,'DITTO',`<div class="feed-tabs">${button('추천 ●','recommend',tab==='추천'?'selected':'')}${button('팔로잉','following',tab==='팔로잉'?'selected':'')}<span>● KOSDAQ 890.42 <em>+1.24%</em></span></div><div class="story-strip">${button('<b>＋</b><small>나도 기록하기</small>','write','add-story')}<button class="story-person" data-action="live-room">${photo('story-one')}<strong>LIVE</strong><small>여의도제시…</small></button><button class="story-person" data-action="profile">${photo('story-two')}<small>스윙의정석</small></button></div>${tab==='팔로잉'&&!follow?card('<h2>아직 팔로우한 투자자가 없어요</h2><p>관심 있는 투자자를 팔로우하면 이곳에서 기록을 볼 수 있어요.</p>'+button('투자자 찾아보기','search','primary')):`<article class="feed-card">${photoPerson()}${button(follow?'팔로잉':'팔로우','follow','follow-pill')}<small class="muted">25분 전 · 코스닥 890.4p <em>체결완료</em></small><div class="tags">#삼천당제약　 <em>#바이오돌파</em>　 #손절기준철저</div><div data-action="detail" class="clickable">${chart()}</div><p>오늘 장 초반 거래량 실린 갭상승 확인 후 1차 분할 진입. 전일 고가 지지 확인 실패 시 기계적 손절 원칙 준수했습니다. 욕심내지 않고 계획된 50% 분할 익절 완료했습니다.</p><div class="row">${button(liked?'♥':'♡','like','inline')}${button('▢ 댓글','comments','inline')}${button(saved?'▣ 저장됨':'♧ 저장','save','inline')}${button('⋯','menu','inline')}</div></article>`}${entries.map(summary).join('')}${button('▧ 일지 작성','write','floating')}`);return}
if(p==='write'){mount(p,'투자일지 작성',`<div class="eyebrow"><b>04</b> 사진과 글로 남기는 투자 기록 <span>작성 중 · 임시저장 가능</span></div>${button(esc(draft.title),'record-type','type-button')}<form id="journal"><input type="hidden" name="title" value="${esc(draft.title)}"><input type="hidden" name="visibility" value="${esc(draft.visibility)}"><input type="hidden" name="stock" value="${esc(draft.stock)}">${card(`<h3>♧ 매매 종목 & 전략 태그 <small>최대 3종목</small></h3><div class="chips"><span>● ${esc(draft.stock)}　005930　×</span>${button('＋ 종목 추가','stock-add','inline')}</div><h5>매매 구분 스타일</h5><div class="chips">${['단기 스윙','돌파 매매','분할 매수','눌림목 반등'].map((t,i)=>button(t+(i<2?' ✓':''),'tag-toggle',i<2?'chosen':'')).join('')}</div>`)}${card(`<h3 class="section-title">1. 진입 근거 <small>필수 입력</small></h3><textarea name="entry" placeholder="눌러서 진입 근거를 작성해 주세요.">${esc(draft.entry)}</textarea>${button('예시 내용 선택','content','text-link')}`)}${card('<h3 class="section-title">2. 청산 및 손익 가격 (PnL Target)</h3><div class="metrics"><div><small>익절가 (Target)</small><p class="pink">77,200원 <small>+3.6%</small></p></div><div><small>설정한 손절 기준가</small><p>73,100원 <small>-1.8%</small></p></div></div>')}${card(`<h3 class="section-title">3. 멘탈 & 반성 메모</h3><textarea name="memo" placeholder="눌러서 오늘의 복기를 작성해 주세요.">${esc(draft.memo)}</textarea>`)}${card('<h3>첨부 이미지 및 공개범위</h3>'+button('사진 첨부','attachments')+button(esc(draft.visibility),'visibility')+button('임시저장','draft'))}<div class="write-actions">${button('◎ 미리보기','check-preview')}<button class="primary">입력 확인하기 ⓥ</button></div></form>`);return}
if(p==='preview'||p==='my-post'){mount(p,p==='preview'?'투자일지 미리보기':'내 투자일지',previewHTML(),{nav:false});return}
if(p==='detail'||p==='chart-full'){mount(p,p==='detail'?'투자일지 상세':'체결 기록 자세히 보기',p==='chart-full'?evidence()+'<p>매수 83,500원 → 일부 매도 87,000원</p><p>첨부한 차트를 확인하는 시연 화면입니다.</p>'+button('닫기','detail'):card(photoPerson()+button(follow?'팔로잉':'팔로우','follow','follow-pill')+'<p class="notice">※ 자산 배지는 규모 확인용이며 실력이나 미래 수익을 보장하지 않습니다. 본 일지는 교육 및 원칙 검증 목적의 가상 시연 데이터입니다.</p><div class="tags">● 삼천당제약 000250　 스윙 매매　 손익비 1:2 원칙 매매</div>')+evidence()+card('<h2>❶ 진입 근거 (Entry Thesis)</h2><p>5분봉 20일 이동평균선 정배열 지지 반등을 실시간 포착했습니다. 장초반 프로그램 및 외국인 순매수가 45억 이상 유입되며 호가창 체결강도 135% 이상 안정적으로 유지되는 흐름을 확인 후 진입했습니다.</p>')+card('<h2>❷ 대응 전략 (Execution Plan)</h2><p>계획한 손절 기준을 준수하고 분할 청산합니다.</p>'+button('댓글 보기','comments')+button('게시물 메뉴','menu')));return}
if(p==='my'||p==='profile'){mount(p,p==='my'?'My Ditto':'개인 피드',`<section class="profile-top">${photoPerson(p==='my'?esc(nickname):'여의도 제시리버모어')}<p>“시장의 변동성은 예측 대상이 아닌 대응의 영역입니다. 철저한 분할매수와 손절 기준 준수로 누적 수익 곡선을 지킵니다.”</p><div class="row">${button(p==='my'?'☷ 프로필 수정':follow?'팔로잉 ✓':'팔로우',p==='my'?'edit-profile':'follow')}${button(p==='my'?'♜ 계좌 연동 관리':'▢ 댓글 보기',p==='my'?'account':'comments','navy-button')}</div></section><div class="metrics stats">${[['124일','연속 기록'],['87개','작성 일지'],['94%','원칙 준수율']].map(([n,t])=>card(`<h2>${n}</h2><small>${t}</small>`)).join('')}</div>${card('<div class="row"><h2>♜ My 배지</h2>'+button('배지 전체보기 ›','badges','text-link')+'</div><div class="badge-grid">'+[['gold','＄','10억 자산','규모 확인용'],['rose','▦','60일 연속','기록 챌린저'],['steel','⬟','위험관리 방패','손실폭 제어']].map(([c,i,t,d])=>`<div><div class="medal ${c}">${i}</div><b>${t}</b><small>${d}</small></div>`).join('')+'</div><p class="notice">ⓘ ※ 자산 배지는 규모 확인용이며 실력 보증이 아닙니다. 위험관리 배지는 정기 평가 기준 검토 중입니다.</p>')}<section class="principles"><h2>⚖ 나의 투자 3대 원칙</h2>${['단일 종목 비중은 총 운용자산의 25%를 넘기지 않는다.','진입 시 손절선(-5%)을 시스템 주문으로 선설정한다.','모든 매매는 당일 DITTO 일지로 복기한다.'].map((t,i)=>`<p><b>${i+1}</b>${t}</p>`).join('')}</section>${button('내 투자일지','my-post')}${button('임시저장 이어쓰기','drafts')}${button('저장한 콘텐츠','saved')}`);return}
if(p==='badges'){mount(p,'배지 모음 & 자산 인증',`<h2>♜ 수집 배지 & 인증 센터</h2><section class="proof"><span>VERIFIED PROOF</span><h1>총 5개 중 4개 획득 완료</h1><p>예시 계정의 자산구간과 투자 기록 배지를 확인합니다.</p>${button('● 시연 계정 · 실제 계좌 조회 없음　인증하기','verify','navy-button')}</section><h2>보유 및 컬렉션 배지</h2><p class="notice">※ 자산 배지는 잔고 규모 확인용이며 거래 실력, 미래 수익률을 보장하지 않습니다.</p><div class="badge-collection">${[['gold','♢','10억 자산 인증','자산구간 확인 예시','verify'],['silver','♜','1억 자산 인증','2024.01 획득','badge-info'],['rose','▦','60일 연속기록','출석률 100% 달성','badge-info'],['green','⬟','위험관리 수호자','평가 기준 검토 필요','badge-info']].map(([c,i,t,d,a])=>card(`<div class="medal ${c}">${i}</div><h2>${t}</h2><p>투자 기록과 보유 규모 확인</p>${button(d,a)}`)).join('')}</div>`);return}
if(p==='live'||p==='live-room'||p==='live-full'){const media=`<div class="live-picture">${photo('live-photo')}<span class="live-tag">● LIVE　◉ 1,420명 시청 중</span><div class="live-person"><h2>여의도 제시리버모어 <small>검증 V3</small></h2><p>누적 수익률 +218.4% · 원칙매매</p></div>${button('⛶',p==='live-full'?'live-room':'live-full','fullscreen')}</div>`;mount(p,p==='live'?'DITTO 투자':'Live Room',p==='live'?`<section class="live-hero">${media}<h2>26.10.28 오늘 꽤 괜?</h2><div class="row"><span>#국내주식　 #반도체수급</span>${button('지금 입장하기 →','live-room','primary')}</div></section><div class="chips">${['전체','국내주식 🔥','미국주식 🇺🇸','선물옵션 ⚡'].map(t=>button(t,'category','inline')).join('')}</div><h2>실시간 Ditto 채널</h2><div class="channel-grid">${['알고리즘 외인·기관 실시간 수급 포착 라이브','월배당 리츠 10종 포트폴리오 안정성 종합점검'].map(t=>card(photo('live-photo')+`<h3>${t}</h3>`+button('● LIVE · 입장하기','live-room'))).join('')}</div>`:media+(p==='live-full'?'<h2 class="center">여의도 제시리버모어<br>시연 방송 화면</h2>'+button('전체화면 닫기','live-room'): '<p class="notice">📣 비방·선동·불법 리딩 유도 시 즉각 강제 퇴장 처리됩니다. 클린 DITTO 원칙 준수</p><div class="brief"><h3>멘토 핵심 브리핑</h3><p>오늘 삼천당제약 진입은 20일선 지지 후 3분봉 거래량 돌파 확인 타점입니다. 손익비 1:2.4 확보가 최우선입니다.</p></div><div class="chat-bubble">민트초코홀릭<br>손익비 잡는 기준이 인상적이네요. 감정에 휘둘리지 않는 셋업 배웠습니다!</div><div class="chat-bubble">KellyKim<br>오늘 삼천당제약 진입 타점 복기 감사드립니다 🙏</div>'+button('질문이나 응원의 피드백을 남겨보세요 ▷','live-join')),{nav:p!=='live-full',cls:p==='live-full'?'full-live':''});return}
if(p==='shorts'||p==='shorts-full'){mount(p,p==='shorts'?'Ditto Shorts':'Shorts Full Viewer',`<section class="short-view">${photo('short-photo')}<div class="short-top"><span>◌ 시연 콘텐츠 · 재생 상태</span>${button('♬','mute','inline')}</div><div class="short-target">⚑ 목표가 51,500원 (1:2 R/R)</div><div class="short-buy">● 1차 매수 진입 48,200원</div><aside>${[['♡','like'],['▢','comments'],['♧','save'],['♧','share']].map(([t,a])=>button(t,a)).join('')}</aside><div class="short-caption"><h2>@여의도 제시리버모어 ✦</h2><p>3분봉 20일선 눌림목 반등 타점 공략법 📉 손익비 1:2 세팅 기준입니다.</p><p class="pink">#손익비 #차트복기 #원칙매매 #DITTO전략</p>${button('눌러서 다음 클립 보기　⌃<br>초보 탈출 1:3 손익비 계산 공식','next-short')}<small>※ 가상 교육 시연 영상이며 투자 권유가 아닙니다.</small><progress value="42" max="100"></progress></div></section>`);return}
originalRender();document.querySelector('nav')?.replaceWith(document.createRange().createContextualFragment(navHTML(p)));};
const customActions=new Set(['consent1','consent2','verify-submit','comment-input','comment-submit','draft-exit','fill-example','clear-example','attach','detach','visibility-all','visibility-follow','visibility-private','type-trade','type-portfolio','copy-share','send-live','profile-save','check-preview','stock-add','tag-toggle','category','mute','next-short']);
app.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;if(!customActions.has(a))return;e.stopImmediatePropagation();
if(a==='consent1'||a==='consent2'){if(a==='consent1')consent1=!consent1;else consent2=!consent2;b.textContent=b.textContent.replace(/^[□☑]/,(a==='consent1'?consent1:consent2)?'☑':'□')}
else if(a==='verify-submit')go(consent1&&consent2?'verify-done':'verify-fail');
else if(a==='check-preview'){capture();go(draft.entry.trim()?'preview':'validation')}
else if(a==='draft-exit'){capture();store('ditto.draft',draft);go('drafts')}
else if(a==='fill-example'){draft.entry='5분봉 20일 이동평균선 지지 반등을 확인했습니다. 거래량과 체결강도를 확인한 뒤 분할 진입했습니다.';draft.memo='손절 기준을 준수하고 계획한 분할 청산을 지켰습니다.';store('ditto.draft',draft);go('write')}
else if(a==='clear-example'){draft.entry='';draft.memo='';go('write')}
else if(a==='attach'||a==='detach'){attached=a==='attach';go('write')}
else if(a.startsWith('visibility-')){draft.visibility=({'visibility-all':'전체 공개','visibility-follow':'팔로워에게만 공개','visibility-private':'나만 보기'})[a];store('ditto.draft',draft);go('write')}
else if(a.startsWith('type-')){draft.title=a==='type-trade'?'매매일지':'포트폴리오';go('write')}
else if(a==='profile-save'){nickname='원칙투자자_현';store('ditto.name',nickname);go('my')}
else if(a==='comment-input'){const input=document.createElement('textarea');input.id='new-comment';input.value='원칙을 지킨 과정이 도움이 됐어요.';b.replaceWith(input);input.focus()}
else if(a==='comment-submit'){const text=document.querySelector('#new-comment')?.value||'원칙을 지킨 과정이 도움이 됐어요.';go('comments');const p=document.createElement('p');p.textContent=nickname+' · '+text;document.querySelector('.info-screen>p').append(p)}
else if(a==='send-live'){go('live-room');toast('시연 메시지를 보냈습니다.')}
else if(a==='copy-share')toast('시연용 공유 완료 상태입니다.');
else if(a==='next-short'){go(location.hash==='#shorts'?'shorts-full':'shorts')}
else if(a==='stock-add'){const name=prompt('추가할 종목 이름을 입력하세요','삼천당제약');if(name?.trim()){draft.stock=name.trim().slice(0,30);store('ditto.draft',draft);render()}}
else if(a==='tag-toggle'||a==='category')b.classList.toggle('chosen');else if(a==='mute'){b.textContent=b.textContent==='♬'?'♩':'♬'}
},true);
app.addEventListener('submit',e=>{if(e.target.id==='journal'){e.preventDefault();e.stopImmediatePropagation();capture();go(draft.entry.trim()?'preview':'validation')}else if(e.target.id==='searchform'){e.preventDefault();e.stopImmediatePropagation();const q=new FormData(e.target).get('query')||'';go(/삼성|삼천|여의도|제시/.test(q)?'results':'no-results')}else if(e.target.id==='reportform'){e.preventDefault();e.stopImmediatePropagation();go('report-done')}},true);
window.addEventListener('hashchange',()=>render());render();


/* Local review fixes: stable SVG controls and explicit following state. */
icons.comment='<path d="M21 15a3 3 0 0 1-3 3H8l-5 4V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/>';
icons.bookmark='<path d="M6 3h12v19l-6-4-6 4z"/>';
icons.edit='<path d="M13 4H4v17h17v-9M16 2l6 6-11 11-5 1 1-5z"/>';
icons.ditto='<path d="M7 4H3v6h4zM21 14h-4v6h4zM7 7h7a5 5 0 0 1 0 10H9M17 17h-7a5 5 0 0 1 0-10h5"/>';
const renderBeforeControlFix=render;
function updateControls(){
  document.querySelectorAll('[data-action="follow"]').forEach(b=>{b.textContent=follow?'팔로잉':'팔로우';b.classList.toggle('is-following',follow);b.setAttribute('aria-pressed',String(follow))});
  document.querySelectorAll('[data-action="like"]').forEach(b=>{b.innerHTML=icon('ditto')+'<span>Ditto</span>';b.classList.toggle('is-selected',liked);b.setAttribute('aria-pressed',String(liked))});
  document.querySelectorAll('[data-action="comments"]').forEach(b=>{if(b.closest('nav')||b.closest('.info-actions'))return;b.innerHTML=icon('comment')+'<span>댓글</span>'});
  document.querySelectorAll('[data-action="save"]').forEach(b=>{b.innerHTML=icon('bookmark')+`<span>${saved?'저장됨':'저장'}</span>`;b.classList.toggle('is-selected',saved);b.setAttribute('aria-pressed',String(saved))});
  document.querySelectorAll('.floating[data-action="write"]').forEach(b=>{b.innerHTML=icon('edit')+'<span>일지 작성</span>'});
  const shortPhoto=document.querySelector('.short-photo');
  if(shortPhoto){shortPhoto.classList.add('clean-short-background');shortPhoto.innerHTML='<div class="short-chart-grid"></div>'+chart();shortPhoto.setAttribute('aria-label','중복 문구와 아이콘이 없는 시연 차트 배경')}
}
render=function(){renderBeforeControlFix();updateControls()};
app.addEventListener('click',e=>{if(e.target.closest('[data-action="save"]'))queueMicrotask(updateControls)});
render();

// Image-backed local prototype: keep the supplied Shorts composition intact.
const renderBeforeShortsReference=render;
render=function(){
 const page=location.hash.slice(1);
 if(!['shorts','shorts-full'].includes(page)){renderBeforeShortsReference();return}
 const zone=(label,action,x,y,w,h)=>`<button type="button" class="shorts-hit" aria-label="${label}" title="${label}" data-action="${action}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></button>`;
 app.className='shorts-reference-layout';
 app.innerHTML=`<section class="shorts-reference-screen" aria-label="Shorts Full Viewer 이미지 기반 시연"><img src="assets/shorts-full-viewer.png" alt="쇼츠 시연 화면. 목표가 51,500원, 매수 진입 48,200원. 여의도 제시리버모어의 손익비 교육 콘텐츠." width="780" height="1688">${zone('이전 화면','home',0,0,15,6.6)}${zone('내 프로필','my',85,0,15,6.6)}${zone('쇼츠 닫기','home',3,7.5,12,5.5)}<button class="shorts-hit" aria-label="음소거 전환 (영상 없는 시연)" title="음소거 전환" data-action="shorts-audio" style="left:85%;top:7.5%;width:12%;height:5.5%"></button>${zone('작성자 팔로우','follow',83,31,14,8)}${zone('Ditto 공감','like',83,39,14,9)}${zone('댓글 128개 보기','comments',83,49,14,9)}${zone('콘텐츠 저장','save',83,58,14,9)}${zone('공유','share',83,67,14,9)}${zone('다음 클립 보기','next-short',4,76,92,6)}${zone('Main','home',0,92.4,25,7.6)}${zone('Ditto Live','live',25,92.4,25,7.6)}${zone('Ditto Shorts','shorts',50,92.4,25,7.6)}${zone('My Ditto','my',75,92.4,25,7.6)}</section><div id="toast" role="status"></div>`;
 window.scrollTo(0,0);
};
app.addEventListener('click',event=>{if(!app.classList.contains('shorts-reference-layout'))return;const control=event.target.closest('[data-action]');if(!control)return;const action=control.dataset.action;if(['follow','like','save','shorts-audio'].includes(action)){event.stopImmediatePropagation();if(action==='follow'){follow=!follow;store('ditto.follow',follow);toast(follow?'팔로잉으로 변경했습니다':'팔로우를 해제했습니다')}else if(action==='like'){liked=!liked;toast(liked?'Ditto 공감했습니다':'공감을 취소했습니다')}else if(action==='save'){saved=!saved;store('ditto.saved',saved);toast(saved?'콘텐츠를 저장했습니다':'저장을 해제했습니다')}else toast('정지 이미지 시연입니다. 재생되는 음성은 없습니다.');control.setAttribute('aria-pressed',String(action==='follow'?follow:action==='like'?liked:saved));}},true);
render();

// Persist comments per post in this browser.
const commentStorageKey='ditto.comments.v1';
let postComments=read(commentStorageKey,{});
let commentPostId='sample-main';
const renderBeforeComments=render;
function commentsForPost(){const list=postComments[commentPostId];return Array.isArray(list)?list:[]}
function persistComments(){store(commentStorageKey,postComments)}
function commentListHTML(){const comments=commentsForPost();return comments.length?comments.map(c=>`<article class="user-comment"><div class="row"><strong>${esc(c.author)}</strong><button type="button" class="comment-delete" data-comment-delete="${esc(c.id)}" aria-label="내 댓글 삭제">삭제</button></div><p>${esc(c.text)}</p><small>${esc(new Date(c.createdAt).toLocaleString('ko-KR'))}</small></article>`).join(''):'<p class="comments-empty">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</p>'}
render=function(){
 const page=location.hash.slice(1);
 if(page!=='comments'&&page!=='comment-write'){renderBeforeComments();return}
 mount(page,page==='comments'?'댓글':'댓글 작성',`<section class="comments-post"><small>선택한 게시물</small><h2>${commentPostId==='sample-main'?'삼천당제약 · 투자일지':commentPostId==='sample-shorts'?'Ditto Shorts':commentPostId==='sample-live'?'Ditto Live':'내 투자일지'}</h2></section><section class="comments-panel"><h2>댓글 <span>${commentsForPost().length}</span></h2><div id="persisted-comments">${commentListHTML()}</div></section><form id="persisted-comment-form"><label for="comment-body">댓글 작성</label><textarea id="comment-body" name="body" required maxlength="500" placeholder="게시물에 대한 생각을 남겨주세요."></textarea><div class="row"><small id="comment-count">0 / 500</small><button type="submit" class="primary">댓글 등록</button></div><p class="comment-help">댓글은 이 브라우저에 저장됩니다.</p></form>${button('게시물로 돌아가기',commentPostId==='sample-main'?'detail':commentPostId==='sample-shorts'?'shorts':commentPostId==='sample-live'?'live-room':'my-post')}`,{nav:true});
 if(page==='comment-write')document.querySelector('#comment-body').focus();
};
app.addEventListener('click',event=>{
 const deleteButton=event.target.closest('[data-comment-delete]');
 if(deleteButton){event.preventDefault();event.stopImmediatePropagation();postComments[commentPostId]=commentsForPost().filter(c=>c.id!==deleteButton.dataset.commentDelete);persistComments();render();toast('댓글을 삭제했습니다.');return}
 const commentButton=event.target.closest('[data-action="comments"],[data-action="comment-write"]');
 if(commentButton){event.preventDefault();event.stopImmediatePropagation();const current=location.hash.slice(1);if(current!=='comments'&&current!=='comment-write'){commentPostId=current==='my-post'||current==='preview'?'own-'+(entries[0]?.id||'draft'):current.startsWith('shorts')?'sample-shorts':current.startsWith('live')?'sample-live':'sample-main'}go(commentButton.dataset.action);}
},true);
app.addEventListener('submit',event=>{
 if(event.target.id!=='persisted-comment-form')return;
 event.preventDefault();event.stopImmediatePropagation();
 const text=new FormData(event.target).get('body').trim();
 if(!text){document.querySelector('#comment-body').setCustomValidity('댓글 내용을 입력해주세요.');document.querySelector('#comment-body').reportValidity();return}
 if(text.length>500)return;
 const comment={id:globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random(),author:nickname,text,createdAt:Date.now()};
 postComments[commentPostId]=[...commentsForPost(),comment];persistComments();
 if(location.hash==='#comments')render();else go('comments');
 toast('게시물에 댓글을 등록했습니다.');
},true);
app.addEventListener('input',event=>{if(event.target.id!=='comment-body')return;event.target.setCustomValidity('');document.querySelector('#comment-count').textContent=event.target.value.length+' / 500'});
render();


// Comment Ditto reactions are stored with each comment, per post.
const commentListBeforeDitto=commentListHTML;
commentListHTML=function(){const list=commentsForPost();return list.length?list.map(c=>`<article class="user-comment"><div class="row"><strong>${esc(c.author)}</strong><button type="button" class="comment-delete" data-comment-delete="${esc(c.id)}" aria-label="내 댓글 삭제">삭제</button></div><p>${esc(c.text)}</p><div class="row"><small>${esc(new Date(c.createdAt).toLocaleString('ko-KR'))}</small><button type="button" class="comment-ditto ${c.ditto?'selected':''}" data-comment-ditto="${esc(c.id)}" aria-pressed="${Boolean(c.ditto)}">${icon('ditto')}<span>Ditto ${c.ditto?1:0}</span></button></div></article>`).join(''):'<p class="comments-empty">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</p>'};
app.addEventListener('click',event=>{const b=event.target.closest('[data-comment-ditto]');if(!b)return;event.preventDefault();event.stopImmediatePropagation();const c=commentsForPost().find(c=>c.id===b.dataset.commentDitto);if(!c)return;c.ditto=!c.ditto;persistComments();b.classList.toggle('selected',c.ditto);b.setAttribute('aria-pressed',String(c.ditto));b.querySelector('span').textContent='Ditto '+(c.ditto?1:0)},true);
const renderBeforePremium=render;
render=function(){renderBeforePremium();
 const p=location.hash.slice(1);
 if(['shorts','shorts-full'].includes(p)){
  const react=document.querySelector('.shorts-reference-screen [data-action="like"]');
  if(react){react.classList.add('shorts-ditto-visible');react.setAttribute('aria-label','Ditto 공감');react.innerHTML=icon('ditto')+'<span>Ditto</span>';react.setAttribute('aria-pressed',String(liked));react.classList.toggle('selected',liked)}
  const next=document.querySelector('.shorts-reference-screen [data-action="next-short"]');
  if(next){next.classList.add('shorts-next-visible');next.innerHTML='<span class="next-clip-icon">↟</span><span class="next-clip-copy"><small>눌러서 다음 클립 보기</small><span class="marquee-window"><span class="marquee-track"><b>초보 탈출: 손익비 1:3 계산 방법</b><b aria-hidden="true">초보 탈출: 손익비 1:3 계산 방법</b></span></span></span><span class="next-chevron">⌃</span>'}
 }
 document.querySelectorAll('.badge-grid .medal,.badge-collection .medal').forEach(el=>{const tier=el.classList.contains('gold')?'billion':el.classList.contains('silver')?'hundred-million':el.classList.contains('rose')?'calendar':'shield';el.className='premium-badge '+tier;el.textContent='';el.setAttribute('role','img');el.setAttribute('aria-label',({'billion':'10억 자산 배지','hundred-million':'1억 자산 배지','calendar':'연속 기록 배지','shield':'위험관리 배지'})[tier]);});
};
app.addEventListener('click',event=>{const b=event.target.closest('.shorts-ditto-visible');if(b)queueMicrotask(()=>{b.classList.toggle('selected',liked);b.setAttribute('aria-pressed',String(liked))})});
render();

// Editable profile and post-aware journal feeds (browser-local prototype).
let nameChanges=read('ditto.nameChanges',0);
let userPrinciples=read('ditto.principles',['단일 종목 비중은 총 운용자산의 25%를 넘기지 않는다.','진입 시 손절선(-5%)을 시스템 주문으로 선설정한다.','모든 매매는 당일 22시 전 DITTO 일지로 복기한다.']);
let activeJournalId=null;
const sampleJournals=[{id:'sample-breakout',author:'여의도 제시리버모어',title:'삼천당제약 돌파매매 복기',stock:'삼천당제약',entry:'거래량 증가와 전일 고가 돌파를 확인한 뒤 분할 진입했습니다.',memo:'추격 매수를 피하고 사전에 설정한 손절 기준을 준수했습니다.',visibility:'전체 공개',demo:true},{id:'sample-risk',author:'스윙의정석',title:'원칙 손절 기록',stock:'삼성전자',entry:'지지 구간을 확인했으나 거래량이 기대에 미치지 못했습니다.',memo:'원칙에 따라 손절하고 다음 진입 조건을 기다렸습니다.',visibility:'전체 공개',demo:true},{id:'sample-review',author:'밸류파인더',title:'월간 매매복기',stock:'SK하이닉스',entry:'기업 실적과 밸류에이션 기준을 먼저 검토했습니다.',memo:'매매 횟수보다 기록의 일관성을 유지하겠습니다.',visibility:'전체 공개',demo:true}];
const ownJournal=id=>entries.find(p=>String(p.id)===String(id));
const selectedJournal=()=>ownJournal(activeJournalId)||sampleJournals.find(p=>p.id===activeJournalId);
function journalTiles(posts,own=false){return `<div class="journal-grid">${posts.map((p,i)=>`<button class="journal-tile" data-journal-id="${esc(p.id)}" aria-label="${esc(p.title||p.stock)} 열기"><div class="journal-thumb thumb-${i%3}">${chart()}</div><span>${esc(p.title||p.stock+' 투자일지')}</span><small>${own?esc(nickname):esc(p.author)}${p.demo?' · 시연':''}</small></button>`).join('')}</div>`}
function journalFeed(posts){return posts.map(p=>`<article class="journal-feed-card"><div class="row"><strong>${esc(p.demo?p.author:nickname)}</strong><small>${p.demo?'시연 게시물':esc(p.visibility||'전체 공개')}</small></div><button class="journal-open" data-journal-id="${esc(p.id)}"><h3>${esc(p.title||'투자일지')}</h3><span class="tag">#${esc(p.stock)}</span><p>${esc(p.entry)}</p>${chart()}<small>게시물 자세히 보기 →</small></button></article>`).join('')}
const renderBeforeProfileFeeds=render;
render=function(){const page=location.hash.slice(1);
 if(page==='edit-profile'){
 mount(page,'프로필 수정',`<form id="profile-settings"><section class="card"><h2>나의 투자 이름</h2><label for="profile-nickname">닉네임</label><input id="profile-nickname" name="nickname" maxlength="12" required value="${esc(nickname)}" ${nameChanges>=2?'readonly':''}><p class="profile-limit">닉네임 변경 ${nameChanges} / 2회 · 남은 횟수 ${Math.max(0,2-nameChanges)}회</p>${nameChanges>=2?'<p>닉네임 변경 횟수를 모두 사용했습니다. 투자 원칙은 계속 수정할 수 있어요.</p>':''}</section><section class="card"><h2>나의 투자 3대 원칙</h2>${userPrinciples.map((t,i)=>`<label for="principle-${i}">원칙 ${i+1}</label><textarea id="principle-${i}" name="principle${i}" maxlength="200" required>${esc(t)}</textarea>`).join('')}</section><button type="submit" class="primary">변경 내용 저장</button>${button('취소','my')}</form>`,{nav:false});return;
 }
 if(page==='journal-detail'){
 const p=selectedJournal();if(!p){go('my');return}
 const own=!p.demo;
 mount(page,own?'내 투자일지':'투자일지 상세',`<article class="journal-detail-card"><div class="row"><strong>${esc(own?nickname:p.author)}</strong><span class="tag">${p.demo?'시연 게시물':esc(p.visibility||'전체 공개')}</span></div><h1>${esc(p.title||'투자일지')}</h1><div class="stock">#${esc(p.stock)}</div>${chart()}<h3>1. 진입 근거</h3><p>${esc(p.entry)}</p><h3>2. 청산 전략</h3><p>목표가 77,200원 · 손절가 73,100원</p><h3>3. 멘탈 & 반성 메모</h3><p>${esc(p.memo||'기록된 메모가 없습니다.')}</p><div class="row">${button(icon('comment')+' 댓글','selected-post-comments')}${button(icon('bookmark')+' 저장','save')}</div></article>${own?button('일지 내용 수정하기','edit-selected-journal','primary'):''}${button('피드로 돌아가기',own?'my':'home')}`);return;
 }
 renderBeforeProfileFeeds();
 if(page==='my'){
 const stats=document.querySelector('.stats');
 if(stats){const days=[...new Set(entries.map(p=>new Date(p.updatedAt||Number(p.id)||Date.now()).toLocaleDateString('en-CA')))].sort().reverse();let streak=0;let cursor=new Date();cursor.setHours(0,0,0,0);if(!days.includes(cursor.toLocaleDateString('en-CA')))cursor.setDate(cursor.getDate()-1);while(days.includes(cursor.toLocaleDateString('en-CA'))){streak++;cursor.setDate(cursor.getDate()-1)}const compliant=entries.filter(p=>p.entry?.trim()&&p.memo?.trim()).length;stats.innerHTML=[[(streak||0)+'일','연속 기록'],[entries.length+'개','작성 일지'],[entries.length?Math.round(compliant/entries.length*100)+'%':'—','원칙 준수율']].map(([n,t])=>`<div class="stat-frame"><strong>${n}</strong><span>${t}</span></div>`).join('');stats.title='원칙 준수율은 진입 근거와 복기 메모를 모두 작성한 일지의 비율인 시연 지표입니다.';}
 const principles=document.querySelector('.principles');if(principles)principles.innerHTML='<div class="row"><h2>⚖ 나의 투자 3대 원칙</h2>'+button('수정','edit-profile','text-link')+'</div>'+userPrinciples.map((t,i)=>`<p><b>${i+1}</b>${esc(t)}</p>`).join('');
 document.querySelectorAll('[data-action="my-post"]').forEach(b=>b.remove());
 const main=document.querySelector('main');main.insertAdjacentHTML('beforeend',`<section class="my-journal-section"><h2>투자일지 피드 <small>${entries.length}개</small></h2>${entries.length?journalTiles(entries,true):'<div class="card"><p>아직 작성한 투자일지가 없어요.</p>'+button('첫 일지 작성하기','write','primary')+'</div>'}</section>`);
 }
 if(page==='profile')document.querySelector('main').insertAdjacentHTML('beforeend','<section class="my-journal-section"><h2>투자일지 그리드</h2>'+journalTiles(sampleJournals)+'</section>');
 if(page==='home'){
 const main=document.querySelector('main');
 // Replace duplicate old own-entry summaries with a single linked post feed.
 main.querySelectorAll(':scope > section.card').forEach(el=>{if(el.querySelector('.stock'))el.remove()});
 main.insertAdjacentHTML('beforeend','<section class="main-journal-section"><h2>투자일지 피드</h2><p class="feed-local-note">내 기록과 다른 투자자의 시연 게시물을 함께 살펴보세요.</p>'+journalFeed([...entries,...sampleJournals])+'</section>');
 }
};
app.addEventListener('submit',event=>{if(event.target.id!=='profile-settings')return;event.preventDefault();event.stopImmediatePropagation();const data=new FormData(event.target);const newName=String(data.get('nickname')||'').trim();const newPrinciples=[0,1,2].map(i=>String(data.get('principle'+i)||'').trim());if(!newName||newName.length>12||newPrinciples.some(v=>!v)){toast('닉네임과 투자 원칙 3개를 모두 입력해주세요.');return}if(newName!==nickname){if(nameChanges>=2){toast('닉네임은 최대 2회까지만 변경할 수 있어요.');return}nickname=newName;nameChanges++;store('ditto.name',nickname);store('ditto.nameChanges',nameChanges)}userPrinciples=newPrinciples;store('ditto.principles',userPrinciples);go('my');toast('프로필과 투자 원칙을 저장했습니다.');},true);
app.addEventListener('click',event=>{
 const tile=event.target.closest('[data-journal-id]');if(tile){event.preventDefault();event.stopImmediatePropagation();activeJournalId=tile.dataset.journalId;go('journal-detail');return}
 const b=event.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
 if(action==='edit-selected-journal'){event.preventDefault();event.stopImmediatePropagation();const p=ownJournal(activeJournalId);if(!p)return;draft={...p};store('ditto.draft',draft);go('write')}
 if(action==='selected-post-comments'){event.preventDefault();event.stopImmediatePropagation();commentPostId='journal-'+activeJournalId;go('comments')}
 if(action==='publish'&&activeJournalId&&ownJournal(activeJournalId)){
 event.preventDefault();event.stopImmediatePropagation();const index=entries.findIndex(p=>String(p.id)===String(activeJournalId));entries[index]={...entries[index],...draft,id:entries[index].id,updatedAt:Date.now()};store('ditto.entries',entries);go('journal-detail');toast('일지 내용을 수정했습니다.');
 }
 if(action==='write'&&!event.target.closest('#journal')&&location.hash!=='#journal-detail'&&location.hash!=='#preview'){activeJournalId=null}
},true);
render();

// Supabase-backed input handlers. Capture at document level before legacy local handlers.
let db=null,cloudUser=null,cloudReady=false,cloudError='',cloudFeed=[],cloudProfiles=new Map(),cloudBusy=false;
const localEntriesBackup=[...entries];
const cloudVisibility=v=>({'전체 공개':'public','팔로워에게만 공개':'followers','나만 보기':'private'})[v]||'private';
const displayVisibility=v=>({public:'전체 공개',followers:'팔로워에게만 공개',private:'나만 보기'})[v]||'나만 보기';
const isUUID=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v));
function cloudRequired(){if(!cloudReady){toast(cloudError||'데이터베이스 연결을 준비 중입니다.');return false}if(!cloudUser){go('cloud-login');return false}return true}
function cloudMessage(error){const msg=error?.message||'저장하지 못했습니다. 연결 상태를 확인하고 다시 시도해주세요.';toast(msg)}
function unwrap(result){if(result.error)throw result.error;return result.data}
async function refreshCloud(){
 const rows=unwrap(await db.from('ditto_journals').select('*').order('created_at',{ascending:false}).limit(200));
 const profiles=unwrap(await db.from('ditto_profiles').select('user_id,nickname').limit(1000));cloudProfiles=new Map(profiles.map(p=>[p.user_id,p.nickname]));
 const mapRow=p=>({...p,visibility:displayVisibility(p.visibility),author:cloudProfiles.get(p.author_id)||'투자자',cloud:true,updatedAt:Date.parse(p.created_at)});
 cloudFeed=rows.map(mapRow);entries=cloudFeed.filter(p=>p.author_id===cloudUser?.id);
 if(cloudUser){const profile=unwrap(await db.from('ditto_profiles').select('*').eq('user_id',cloudUser.id).maybeSingle());if(profile){nickname=profile.nickname;nameChanges=profile.nickname_changes;userPrinciples=profile.principles}else{nickname='투자자_'+cloudUser.id.slice(0,6);nameChanges=0;userPrinciples=['진입 전 손절 기준을 정합니다.','종목 비중을 관리합니다.','모든 매매를 복기합니다.'];unwrap(await db.from('ditto_profiles').insert({user_id:cloudUser.id,nickname,principles:userPrinciples}));}}
}
async function loadCloudComments(journalId){
 const rows=unwrap(await db.from('ditto_comments').select('*').eq('journal_id',journalId).order('created_at'));
 const ids=rows.map(c=>c.id);let reactions=[];if(ids.length)reactions=unwrap(await db.from('ditto_comment_reactions').select('*').in('comment_id',ids));
 postComments['journal-'+journalId]=rows.map(c=>({id:c.id,text:c.body,author:cloudProfiles.get(c.author_id)||'투자자',authorId:c.author_id,createdAt:Date.parse(c.created_at),cloud:true,ditto:reactions.some(r=>r.comment_id===c.id&&r.user_id===cloudUser?.id),count:reactions.filter(r=>r.comment_id===c.id).length}));
}
const renderBeforeCloud=render;
render=function(){const page=location.hash.slice(1);
 if(page==='cloud-login'){
 mount(page,'DITTO 로그인',`<section class="card"><h1>기록을 안전하게 저장하세요</h1><p>이메일 계정으로 로그인하면 일지와 댓글을 Supabase에 저장합니다.</p><form id="cloud-auth"><label>이메일<input type="email" name="email" required autocomplete="email"></label><label>비밀번호<input type="password" name="password" required minlength="8" autocomplete="current-password"></label><button type="submit" class="primary">로그인</button><button type="submit" name="signup" value="yes">이메일로 회원가입</button></form><p id="auth-feedback" role="status"></p></section>${button('피드 둘러보기','home')}`,{nav:false});return;
 }
 const selected=cloudFeed.find(p=>p.id===activeJournalId);
 if(page==='journal-detail'&&selected&&selected.author_id!==cloudUser?.id){
 mount(page,'투자일지 상세',`<article class="journal-detail-card"><div class="row"><strong>${esc(selected.author)}</strong><span class="tag">${esc(selected.visibility)}</span></div><h1>${esc(selected.title)}</h1><div class="stock">#${esc(selected.stock)}</div>${chart()}<h3>진입 근거</h3><p>${esc(selected.entry)}</p><h3>멘탈 & 반성 메모</h3><p>${esc(selected.memo)}</p>${button('댓글','selected-post-comments')}${button('피드로 돌아가기','home')}</article>`);return;
 }
 renderBeforeCloud();
 if(page==='start'){document.querySelectorAll('[data-action="nickname"],[data-action="home"]').forEach(b=>{if(b.closest('.info-actions'))b.dataset.action='cloud-login'})}
 if(page==='home'&&cloudReady){const section=document.querySelector('.main-journal-section');if(section)section.innerHTML='<h2>투자일지 피드</h2>'+ (cloudFeed.length?journalFeed(cloudFeed.map(p=>({...p,demo:true,author:p.author}))):'<div class="card"><p>아직 공개된 투자일지가 없어요.</p>'+button('첫 일지 작성하기','write','primary')+'</div>');section?.querySelectorAll('small').forEach(s=>{s.textContent=s.textContent.replace('시연 게시물','게시물')})}
 if(page==='my'){document.querySelector('main')?.insertAdjacentHTML('afterbegin',`<div class="cloud-account">${cloudUser?'<span>● 로그인됨 · Supabase 저장</span>'+button('로그아웃','cloud-signout','text-link'):button('로그인하고 데이터 저장하기','cloud-login','primary')}</div>`)}
 if(['comments','comment-write'].includes(page)&&commentPostId.startsWith('journal-')){
 const list=commentsForPost();document.querySelectorAll('.user-comment').forEach((el,i)=>{const c=list[i];if(c?.cloud&&c.authorId!==cloudUser?.id)el.querySelector('[data-comment-delete]')?.remove();const count=el.querySelector('.comment-ditto span');if(count&&c?.cloud)count.textContent='Ditto '+c.count});
 document.querySelector('.comment-help')?.replaceChildren(document.createTextNode('댓글은 Supabase에 저장됩니다.'));
 }
 if(cloudBusy)document.querySelectorAll('button[type="submit"]').forEach(b=>b.disabled=true);
};
async function cloudTask(fn){if(cloudBusy)return;cloudBusy=true;document.querySelectorAll('button[type="submit"]').forEach(b=>b.disabled=true);try{await fn()}catch(e){cloudMessage(e)}finally{cloudBusy=false;document.querySelectorAll('button[type="submit"]').forEach(b=>b.disabled=false)}}
document.addEventListener('submit',event=>{
 const form=event.target;if(!['cloud-auth','profile-settings','persisted-comment-form','nameform'].includes(form.id))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(form.id==='cloud-auth'){cloudTask(async()=>{if(!db)throw new Error(cloudError||'연결을 준비 중입니다.');const d=new FormData(form);const credentials={email:d.get('email'),password:d.get('password')};const signup=event.submitter?.name==='signup';const result=signup?await db.auth.signUp(credentials):await db.auth.signInWithPassword(credentials);unwrap(result);form.querySelector('[name="password"]').value='';if(signup&&!result.data.session){document.querySelector('#auth-feedback').textContent='이메일로 보낸 인증 링크를 확인한 뒤 로그인해주세요.';return}cloudUser=result.data.user;await refreshCloud();go('my')});return}
 if(!cloudRequired())return;
 if(form.id==='nameform'){toast('닉네임은 My Ditto의 프로필 수정에서 변경해주세요.');return}
 if(form.id==='profile-settings'){const d=new FormData(form);cloudTask(async()=>{const n=String(d.get('nickname')).trim();const principles=[0,1,2].map(i=>String(d.get('principle'+i)).trim());if(!n||n.length>12||principles.some(p=>!p))throw new Error('닉네임과 투자 원칙 3개를 확인해주세요.');unwrap(await db.from('ditto_profiles').update({nickname:n,principles}).eq('user_id',cloudUser.id).select().single());await refreshCloud();go('my');toast('Supabase에 프로필을 저장했습니다.')});return}
 const id=commentPostId.replace(/^journal-/,'');if(!isUUID(id)){toast('시연 게시물이 아닌 실제 투자일지를 선택해주세요.');return}
 const text=String(new FormData(form).get('body')||'').trim();if(!text||text.length>500){toast('댓글을 1~500자로 입력해주세요.');return}
 cloudTask(async()=>{unwrap(await db.from('ditto_comments').insert({journal_id:id,author_id:cloudUser.id,body:text}));await loadCloudComments(id);go('comments');render();toast('댓글을 저장했습니다.')});
},true);
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||!app.contains(b))return;const action=b.dataset.action;
 const reaction=b.dataset.commentDitto,del=b.dataset.commentDelete;
 if(reaction||del){event.preventDefault();event.stopImmediatePropagation();if(!cloudRequired())return;const c=commentsForPost().find(c=>c.id===(reaction||del));if(!c?.cloud){toast('실제 투자일지의 댓글을 선택해주세요.');return}cloudTask(async()=>{if(del){unwrap(await db.from('ditto_comments').delete().eq('id',del).eq('author_id',cloudUser.id))}else if(c.ditto){unwrap(await db.from('ditto_comment_reactions').delete().eq('comment_id',reaction).eq('user_id',cloudUser.id))}else{unwrap(await db.from('ditto_comment_reactions').insert({comment_id:reaction,user_id:cloudUser.id}))}await loadCloudComments(commentPostId.slice(8));render()});return}
 if(b.dataset.journalId&&cloudFeed.some(p=>p.id===b.dataset.journalId)){event.preventDefault();event.stopImmediatePropagation();activeJournalId=b.dataset.journalId;go('journal-detail');return}
 if(action==='cloud-signout'){event.preventDefault();event.stopImmediatePropagation();cloudTask(async()=>{unwrap(await db.auth.signOut());cloudUser=null;entries=[];nickname='게스트';nameChanges=0;activeJournalId=null;postComments={};await refreshCloud();go('home')});return}
 if(action==='publish'){event.preventDefault();event.stopImmediatePropagation();if(!cloudRequired())return;cloudTask(async()=>{if(!draft.entry?.trim())throw new Error('진입 근거를 입력해주세요.');const row={author_id:cloudUser.id,title:draft.title||'매매일지',stock:draft.stock,entry:draft.entry,memo:draft.memo||'',visibility:cloudVisibility(draft.visibility),updated_at:new Date().toISOString()};const editing=entries.some(p=>p.id===activeJournalId);const result=editing?db.from('ditto_journals').update(row).eq('id',activeJournalId).eq('author_id',cloudUser.id).select().single():db.from('ditto_journals').insert(row).select().single();const savedRow=unwrap(await result);activeJournalId=savedRow.id;await refreshCloud();go('journal-detail');toast('Supabase에 일지를 저장했습니다.')});return}
 if(action==='selected-post-comments'){event.preventDefault();event.stopImmediatePropagation();if(!isUUID(activeJournalId)){toast('실제 투자일지를 선택해주세요.');return}cloudTask(async()=>{commentPostId='journal-'+activeJournalId;await loadCloudComments(activeJournalId);go('comments')});return}
 if(['comments','comment-write'].includes(action)&&!commentPostId.startsWith('journal-')){event.preventDefault();event.stopImmediatePropagation();toast('투자일지 피드에서 게시물을 연 뒤 댓글을 선택해주세요.');return}
 if(['edit-profile','write','nickname','profile-save'].includes(action)&&!cloudUser){event.preventDefault();event.stopImmediatePropagation();cloudRequired();return}
 if(action==='edit-selected-journal'&&!entries.some(p=>p.id===activeJournalId)){event.preventDefault();event.stopImmediatePropagation();toast('본인 일지만 수정할 수 있습니다.');return}
},true);
(async()=>{try{const {supabaseConfig}=await import('./supabase-config.js');const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.57.4');db=createClient(supabaseConfig.url,supabaseConfig.key);const {data,error}=await db.auth.getUser();if(error&&error.status!==400&&error.status!==401)throw error;cloudUser=data.user||null;entries=[];await refreshCloud();cloudReady=true;render();}catch(error){cloudError='Supabase 연결 실패: '+error.message;cloudReady=false;render();toast(cloudError)}})();
render();
