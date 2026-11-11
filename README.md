# 도재우 · Embedded Software Portfolio

[포트폴리오](https://kevin-jwd.github.io/)

처음 제작한 문서형 디자인을 복원한 Jekyll 포트폴리오입니다.
왼쪽 프로젝트 목록, 중앙 본문, 오른쪽 목차로 구성하며 프로젝트 본문은 Markdown으로 관리합니다.
Chirpy 전환 이후 작성한 본문·이미지·태그·카테고리는 유지했습니다.

## 수정할 파일

| 경로 | 용도 |
| --- | --- |
| `_posts/*.md` | 프로젝트 제목·요약·기간·인원·본문 |
| `_layouts/` | 홈·프로젝트·분류 페이지의 화면 구성 |
| `assets/style.css` | 처음 제작한 디자인 |
| `assets/readability.css` | 항목 제목·본문·표·이미지의 가독성 개선 |
| `assets/app.js` | 검색·목차·테마 전환·이미지 확대 |
| `assets/img/projects/` | 웹사이트에 실제 게시하는 이미지 |
| `_data/project_order.json` | 홈·왼쪽 메뉴의 프로젝트 순서 |
| `_config.yml` | 사이트 주소·빌드·분류 설정 |

프로젝트 front matter의 `period`, `people`, `project_type`을 상단 정보에 표시합니다.
`##` 제목은 번호를 붙인 본문 항목과 오른쪽 목차로 표시하며, `###` 제목은 하위 구현 항목입니다.
기존 `/projects/<slug>.html` 주소는 유지합니다.

기본 화면은 다크 모드이며 상단 버튼으로 라이트 모드로 전환합니다. 선택은 브라우저에 저장합니다.
RC카 UART 파형은 2×2로 표시하고 모든 본문 이미지는 클릭하면 확대합니다.

## 배포

저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다.

```powershell
git push origin main
```

Actions의 **Build and Deploy**가 Jekyll 빌드·내부 링크 검사·배포를 수행합니다.
프로젝트 원본 폴더의 사진을 수정했다면 `assets/img/projects/`의 게시용 파일도 교체해야 합니다.

## 로컬 확인

Ruby와 Bundler가 설치된 환경에서 실행합니다.

```powershell
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://127.0.0.1:4000`을 엽니다. `index.html`을 직접 열면 Jekyll 템플릿이 처리되지 않습니다.
이전 Python HTML 생성기는 사용하지 않습니다. `content/projects.json`은 이전 원본의 보관용입니다.

## 이전 버전

- `backup/static-portfolio-before-chirpy`: 이전 정적 사이트
- `backup/chirpy-before-document-restore`: 문서형 디자인 복원 직전

배포 워크플로의 기반인 Chirpy Starter의 MIT 라이선스는 `LICENSE`에 보존했습니다.
