# 도재우 · Embedded Software Portfolio

[사이트](https://kevin-jwd.github.io/) · [Chirpy 공식 가이드](https://chirpy.cotes.page/posts/getting-started/)

이 사이트는 공식 [Chirpy Starter](https://github.com/cotes2020/chirpy-starter)의 설정과 배포 구성을 바탕으로,
`jekyll-theme-chirpy` **7.6.0** 패키지의 레이아웃·CSS·JavaScript를 그대로 사용합니다.
이전 자체 CSS와 Python HTML 생성기는 제거했습니다.

## GitHub Pages 배포

1. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
2. 변경 사항을 `main`에 push합니다.
3. **Actions → Build and Deploy**에서 빌드·링크 검사·배포가 성공했는지 확인합니다.

```powershell
git push origin main
```

기존 저장소의 주소와 이력을 유지하므로 새 저장소를 만들거나 강제로 push할 필요는 없습니다.
`.github/workflows/pages-deploy.yml`이 Ruby 설치부터 빌드·배포까지 처리합니다.

## 문서 수정

| 파일 | 용도 |
| --- | --- |
| `_config.yml` | 이름, 소개, 사이트 주소, 언어 등 |
| `_posts/*.md` | 프로젝트 상세 문서 7개 |
| `_tabs/about.md` | 자기소개·개발 경험·연락처 |
| `_data/contact.yml` | 사이드바의 GitHub·이메일 링크 |
| `assets/img/avatar.svg` | 프로필 이미지 |
| `_includes/metadata-hook.html` | 첫 방문에만 다크 테마 선택 |

프로젝트의 기간·참여 인원은 각 문서 상단 표의 `—`를 수정합니다.
게시물의 `date`는 문서 게시일이며 프로젝트 수행 기간과 다릅니다.
`permalink`는 기존 README 링크가 유지되도록 `/projects/<slug>.html`로 설정했습니다.

`content/projects.json`은 이전 데이터의 보관본입니다. 이후에는 Markdown을 직접 수정합니다.
`tools/migrate-projects.py`는 최초 이전용이며, 이미 존재하는 Markdown은 덮어쓰지 않습니다.

## 다크·라이트 테마

Chirpy의 기본 전환 메뉴를 사용합니다. 왼쪽 아래에서 라이트·다크·시스템 모드를 선택할 수 있습니다.
새 브라우저의 첫 방문에는 다크를 선택하고 이후에는 사용자의 선택을 유지합니다.
`theme_mode`는 비워 둡니다. `dark`로 고정하면 Chirpy가 전환 메뉴를 숨깁니다.
추가한 코드는 공식 `metadata-hook.html` 확장 지점의 초기값 설정뿐이며, 테마 레이아웃이나 CSS는 수정하지 않습니다.

## 로컬 실행

Ruby와 Bundler 설치 후 다음을 실행합니다. Windows에서는 공식 가이드의 Dev Container 방식도 사용할 수 있습니다.

```powershell
bundle install
bundle exec jekyll serve
```

`http://127.0.0.1:4000`에서 확인합니다. `index.html`을 직접 열거나 Python 정적 서버로 실행하면
Jekyll 처리가 되지 않으므로 정상 화면을 볼 수 없습니다.

## 이전 구성

변경 전 정적 사이트는 로컬 브랜치 `backup/static-portfolio-before-chirpy`에 보존되어 있습니다.

## 라이선스

Starter와 Chirpy는 Cotes Chung의 MIT 라이선스 프로젝트입니다. 원본 라이선스는 `LICENSE`에 보존했습니다.
