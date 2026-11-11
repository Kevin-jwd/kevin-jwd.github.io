# 포트폴리오 사이트 수정 안내

GitHub Pages용 정적 사이트입니다. 별도 패키지 설치가 필요 없습니다.

## 디자인과 테마

Chirpy의 프로필 사이드바와 카드형 목록 구성을 참고한 정적 디자인입니다.
Jekyll Chirpy 테마 패키지를 설치한 형태는 아니며 기존 빌드 방식과 문서 주소를 유지합니다.

- 첫 방문은 다크 테마로 열립니다.
- 왼쪽 프로필 하단의 해/달 버튼으로 라이트·다크 테마를 전환합니다.
- 모바일에서는 왼쪽 위 메뉴를 열면 테마 버튼이 보입니다.
- 선택값은 브라우저에 저장되어 새로고침과 프로젝트 이동 후에도 유지됩니다.
- 저장소 접근이 차단된 브라우저에서도 테마 전환은 동작합니다.

## 프로젝트 내용 수정

`content/projects.json`에서 프로젝트별 내용을 수정합니다.

- `period`: 수행 기간 (예: `2026.06 ~ 2026.07`)
- `people`: 본인 포함 인원 (예: `4명`)
- `type`: 개인·팀 프로젝트 등 구분
- `overview`, `role`, `features`: 개요, 담당 역할, 구현 내용
- `interfaces`: 배선·통신 관련 표
- `trouble`: 증상, 원인 분석, 조치, 확인 결과. 미작성은 `null`
- `refs`: 코드·발표 등 참고 자료 링크

수정한 뒤 프로젝트 폴더에서 `python build.py`를 실행하면 웹 문서가 갱신됩니다.

현재 기간과 미확인 인원은 `—`로 표시합니다. 실제 자료를 확인해 입력해 주세요.
핀이 확정되기 전에는 번호와 전압을 추정해서 입력하지 않습니다.
IMU PT 시스템은 원본 코드가 없어 세부 자세 추정 알고리즘을 확정하지 않았습니다.

## 미리보기

`python -m http.server 8765 --bind 127.0.0.1` 실행 후 `http://127.0.0.1:8765`를 엽니다.
`index.html`을 직접 열어도 본문·탐색·검색이 동작합니다.

## GitHub Pages 반영

이 폴더의 파일을 `Kevin-jwd/kevin-jwd.github.io` 저장소 루트에 반영합니다.
GitHub Pages 소스가 `main` 브랜치의 `/(root)`인지 확인합니다.
GitHub 쓰기 권한 문제로 이번 작업의 원격 반영은 완료되지 않았습니다.

## 프로필 README 연결 주소

프로젝트별 `관련 문서`에는 다음 주소 중 하나만 연결하면 됩니다.

| 프로젝트 | 주소 |
| --- | --- |
| 스마트 선풍기 | https://kevin-jwd.github.io/projects/smart-fan.html |
| 차량 HMI | https://kevin-jwd.github.io/projects/vehicle-hmi.html |
| 인물 추적 | https://kevin-jwd.github.io/projects/vision-tracker.html |
| I2C RTL | https://kevin-jwd.github.io/projects/i2c-rtl.html |
| RC Car | https://kevin-jwd.github.io/projects/rc-car.html |
| LCD·RTC | https://kevin-jwd.github.io/projects/lcd-rtc.html |
| IMU PT | https://kevin-jwd.github.io/projects/imu-pt.html |

위 주소는 저장소에 반영하고 Pages 배포가 끝난 뒤 사용할 수 있습니다.
