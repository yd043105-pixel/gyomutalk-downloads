# 교무톡 · 학교톡 배포 사이트

교무톡(교직원용 PC 프로그램·교사용 앱)과 학교톡(학생·학부모용 앱)의 소개·사용법·다운로드 페이지입니다. 빌드 과정이 없는 정적 사이트이며 `dist/`를 그대로 제공합니다. 학교 서버·계정·메시지와 연결하지 않습니다.

## Vercel 배포

1. Vercel에서 이 저장소를 Import 합니다.
2. Framework Preset은 **Other**, Build Command는 비워 두고 Output Directory는 `dist`로 둡니다. `vercel.json`에 같은 설정이 들어 있습니다.
3. `main`에 푸시하면 자동으로 다시 배포됩니다.

`vercel.json`은 보안 헤더(CSP, `nosniff`, `frame-ancestors 'none'` 등)를 붙입니다. 페이지가 외부로 요청하는 곳은 GitHub 릴리즈 API(`api.github.com`) 하나뿐입니다.

## 다운로드 연결

첫 화면은 PC 교무톡·교사용 앱·학생 및 학부모용 학교톡 세 제품으로 나눕니다. PC 교무톡 버튼을 누르면 서버관리자·Windows·Mac 선택 창이, 앱 버튼을 누르면 Android·iOS 선택 창이 열립니다. 기능 소개와 역할별 사용법은 그 아래에 이어집니다.

버전과 설치파일은 각 제품 저장소의 `/releases/latest`에서 읽습니다.

| 제품 | 저장소 | 설치파일 이름 |
| --- | --- | --- |
| 서버관리자용 | `gyomutalk-server` | `gyomutalk-server-<버전>-setup-win-x64.exe` |
| Windows 사용자용 | `gyomutalk-windows` | `gyomutalk-windows-<버전>-setup-win-x64.exe` |
| Mac 사용자용 | `gyomutalk-mac` | `gyomutalk-mac-<버전>-macos-arm64.zip`, `…-macos-x64.zip` |

- 초안·사전 릴리즈, 태그와 버전이 다른 파일, 다른 저장소 주소는 다운로드로 표시하지 않습니다.
- 같은 릴리즈에 `<파일>.sha256`이 있으면 ‘SHA-256 확인값’ 링크를 함께 보여줍니다.
- Mac은 공개 릴리즈가 생기기 전까지 ‘출시 예정’으로 표시합니다. 휴대폰 앱은 스토어 출시 전까지 ‘출시 예정’입니다.
- 학교 전체가 공인 IP 하나를 함께 쓰면 GitHub 비로그인 API 한도(시간당 60회)에 걸릴 수 있어, 확인 결과를 브라우저에 10분간 저장합니다. ‘다시 확인’은 저장된 결과 없이 새로 확인합니다.
- 릴리즈 공개나 앱 출시를 이 사이트가 자동으로 수행하지 않습니다.

## 내용과 검사

스크린샷은 가상 계정을 사용한 실제 프로그램 실행 화면입니다. `dist/assets/manuals`의 PDF는 각 제품 저장소 `docs/public`의 공개 설명서에서 만든 것으로, 학교의 실제 운영 정보나 학생 자료를 포함하지 않습니다.

```bash
npm test
```

릴리즈 해석(저장소·태그·파일명 검증, 체크섬, Mac 두 아키텍처, 캐시)을 검사합니다.
