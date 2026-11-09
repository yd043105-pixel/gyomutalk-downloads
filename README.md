# 교무톡 PC 배포 사이트

교무톡 교직원용 PC 프로그램의 소개·사용법·다운로드 페이지입니다. 모바일 앱과 연계 기능은 운영 범위에서 제거했습니다. 빌드 과정이 없는 정적 사이트이며 `dist/`를 그대로 제공합니다. 학교 서버·계정·메시지와 연결하지 않습니다.

## Vercel 배포

1. Vercel에서 이 저장소를 Import 합니다.
2. Framework Preset은 **Other**, Build Command는 비워 두고 Output Directory는 `dist`로 둡니다. `vercel.json`에 같은 설정이 들어 있습니다.
3. `main`에 푸시하면 자동으로 다시 배포됩니다.

`vercel.json`은 보안 헤더(CSP, `nosniff`, `frame-ancestors 'none'` 등)를 붙입니다. 페이지가 외부로 요청하는 곳은 GitHub 릴리즈 API(`api.github.com`) 하나뿐입니다.

## 다운로드 연결

첫 화면 아래에 서버관리자용·Windows용·Mac용 다운로드 카드 세 개를 바로 보여 줍니다. 기능 소개는 교사용 프로그램의 왼쪽 메뉴를 그대로 옮겨, 메뉴를 누르면 해당 화면이 바뀝니다. 색과 아이콘은 프로그램의 ‘맑은 청’ 디자인(`SchoolMessenger.Desktop/Theme.xaml`)을 따릅니다.

버전과 설치파일은 각 제품 저장소의 `/releases/latest`에서 읽습니다.

| 제품 | 저장소 | 설치파일 이름 |
| --- | --- | --- |
| 서버관리자용 | `gyomutalk-server` | `gyomutalk-server-<버전>-setup-win-x64.exe` |
| Windows 사용자용 | `gyomutalk-windows` | `gyomutalk-windows-<버전>-setup-win-x64.exe` |
| Mac 사용자용 | `gyomutalk-mac` | `gyomutalk-mac-<버전>-macos-arm64.zip`, `…-macos-x64.zip` |

- 초안·사전 릴리즈, 태그와 버전이 다른 파일, 다른 저장소 주소는 다운로드로 표시하지 않습니다.
- 같은 릴리즈에 `<파일>.sha256`이 있으면 ‘SHA-256 확인값’ 링크를 함께 보여줍니다.
- Mac은 Apple 서명·공증 전까지 사전 릴리즈(시험판)로만 나가므로, 공개 릴리즈가 없으면 ‘GitHub에서 시험판 받기’로 릴리즈 목록을 엽니다.
- 학교 전체가 공인 IP 하나를 함께 쓰면 GitHub 비로그인 API 한도(시간당 60회)에 걸릴 수 있어, 확인 결과를 브라우저에 10분간 저장합니다. ‘다시 확인’은 저장된 결과 없이 새로 확인합니다.
- 릴리즈 공개나 앱 출시를 이 사이트가 자동으로 수행하지 않습니다.

## 내용과 검사

스크린샷(`dist/assets/shots`)은 가상 학교·가상 계정으로 실제 프로그램을 실행해 찍은 화면입니다. 대부분은 서버 저장소의 검증 실행(`tests/smoke.mjs --ui`, `window-order.mjs`, `server-manager.mjs`)에 `SCHOOL_UI_SCALE=2`를 주어 2배 해상도로 남긴 것을 절반 크기로 표시합니다. 할 일 추천(`tasks.webp`)과 학사일정(`calendar.webp`)은 실제 창 크기 그대로 찍었습니다. 원격 지원처럼 캡처하는 PC의 실제 화면이 찍히는 장면은 넣지 않습니다. `dist/assets/manuals`의 PDF는 각 제품 저장소 `docs/public`의 공개 설명서에서 만든 것으로, 학교의 실제 운영 정보나 학생 자료를 포함하지 않습니다.

```bash
npm test
```

릴리즈 해석(저장소·태그·파일명 검증, 체크섬, Mac 두 아키텍처, 캐시)을 검사합니다.
