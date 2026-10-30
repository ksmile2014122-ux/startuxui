# 로컬 수정 및 YouTube API 설정

ZIP 내용물을 C:\Users\KDA\startuxui 에 덮어쓰기합니다. .git과 기존 .env는 지우지 마세요.

1. Google Cloud Console https://console.cloud.google.com 에 로그인합니다.
2. 프로젝트를 선택하거나 만듭니다.
3. APIs & Services > Library에서 YouTube Data API v3를 활성화합니다.
4. Credentials > Create credentials > API key로 키를 만듭니다.
5. 키의 API restrictions는 YouTube Data API v3만 허용합니다. 이번 코드는 서버에서 호출하므로 HTTP referrer(웹사이트) 제한은 맞지 않습니다. 고정 IP가 있는 서버라면 IP 제한을 적용할 수 있습니다.
6. 프로젝트의 .env에 YOUTUBE_API_KEY=발급받은키 를 추가합니다. 이 값은 채팅/GitHub/src에 넣지 않습니다. 기존 .env가 없으면 이 한 줄만 작성해도 됩니다. .env.example의 Supabase 예시 값을 그대로 복사하지 마세요.
7. 기존 서버를 Ctrl+C로 끄고 npm run dev를 실행합니다.
8. Ditto Shorts 탭 > 경제 영상 불러오기를 누릅니다.

API 없이도 종목/사진 수정은 동작합니다. 키가 없으면 쇼츠에 설정 안내가 나옵니다.
검색은 짧은 경제 영상(4분 미만)이며 YouTube Shorts만 보장하지 않습니다. 결과는 1시간 캐시합니다. 프로젝트별 API 할당량은 Google Console에서 확인하세요. Vercel 배포 시 키는 Vercel 서버 환경변수로 별도 등록해야 합니다. .env는 업로드하지 마세요.

사진은 여전히 현재 브라우저 IndexedDB에 저장됩니다. 다른 기기에서 볼 수 있는 Supabase Storage 업로드는 아직 아닙니다.
