# 보안 설정 및 배포

## 적용 사항
- Supabase RLS: 본인 프로필/일지만 수정, 비공개 일지는 소유자만 조회.
- 공개용 publishable 키만 사용. 이 키는 브라우저에 노출되는 것이 정상이며 관리자 키가 아닙니다.
- .env / .env.*를 Git에서 제외. .env.example은 빈 설정 예시입니다.
- npm run build는 필요한 웹 파일만 dist로 복사합니다. .env, Git 기록, 서버 파일은 배포하지 않습니다.
- 로컬 서버도 dist의 index.html/src/assets만 제공합니다.
- Vercel CSP, iframe 차단, MIME 타입 보호, referrer 제한 및 카메라/마이크/위치 차단 헤더 설정.

## 로컬
기존 서버에서 Ctrl+C 후 npm run dev 실행.
필요하면 .env.example을 .env로 복사하고 URL과 공개 키만 입력합니다. 환경변수가 없으면 공개 설정 src/supabase-config.js를 사용하므로 배포가 중단되지는 않습니다. 관리자 키는 넣지 마세요.

## 업로드
프로젝트 최상위에 덮어쓴 후:
git add .gitignore .env.example index.html package.json package-lock.json server.mjs vercel.json scripts src assets SECURITY-DEPLOY.md
git diff --cached --stat
git commit -m "Connect Supabase and harden deployment"
git push origin main

Vercel Root Directory는 기본값(빈 값). vercel.json이 빌드와 출력 폴더를 지정합니다. Build Command: npm run build / Output Directory: dist.

## Supabase에서 확인할 설정
Authentication > URL Configuration의 Site URL을 https://ditto12.kro.kr 로 설정하고, 필요한 로컬 주소 http://localhost:5173 을 Redirect URLs에 등록하세요. 기존 허용 주소는 확인 없이 삭제하지 마세요.
Security Advisor는 유출된 비밀번호 차단 기능이 꺼져 있다는 경고 1건을 반환했습니다. Auth 비밀번호 보안 설정에서 플랜이 지원하면 Leaked Password Protection을 활성화하세요. 플랜 업그레이드는 자동 진행하지 않았습니다.

## 검증 및 남은 확인
JS 문법/빌드/.env ignore/RLS 검사 통과. 브라우저 로그인 및 저장은 이전 버전을 사용자가 확인했습니다. 이번 보안 헤더를 포함한 배포 후 로그인, 일지, 댓글, 새로고침을 다시 확인해야 합니다. 실행 환경의 localhost 연결 제한으로 이번 변경의 브라우저 QA는 완료하지 못했습니다.
GitHub 연결 계정의 저장소 push 권한이 false이므로 원격 업로드와 배포는 완료하지 못했습니다.
