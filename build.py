"""Build static GitHub Pages documents: python build.py (standard library only)."""
from pathlib import Path
import json
import re
from html import escape as e

ROOT = Path(__file__).resolve().parent
PROJECTS = json.loads((ROOT / 'content/projects.json').read_text(encoding='utf-8'))
SECTIONS = [('overview','프로젝트 개요'),('role','담당 역할'),('architecture','시스템 구조'),('implementation','구현 내용'),('interfaces','핀맵·통신 규격'),('troubleshooting','트러블슈팅'),('validation','검증·시연'),('references','참고 자료')]

def section(id, title, html):
    return f'<section id="{id}"><h2>{title}</h2>{html}</section>'

def table(headers, rows):
    return '<div class="doc-table-wrap"><table class="doc-table"><thead><tr>' + ''.join(f'<th scope="col">{e(h)}</th>' for h in headers) + '</tr></thead><tbody>' + ''.join('<tr>'+''.join(f'<td>{e(c)}</td>' for c in row)+'</tr>' for row in rows) + '</tbody></table></div>'

def link(p, prefix=''):
    return f'{prefix}projects/{p["slug"]}.html'

def layout(title, body, active=None, toc=None):
    pre = '../' if active else ''
    sidebar = f'<p class="nav-heading">GETTING STARTED</p><a class="nav-link {"active" if not active else ""}" href="{pre}index.html"><span class="nav-code">⌂</span>소개 · 프로젝트 모음</a><p class="nav-heading">PROJECT DOCUMENTS</p>'
    for i,p in enumerate(PROJECTS,1):
        sidebar += f'<a class="nav-link {"active" if active == p["slug"] else ""}" {"aria-current=page" if active == p["slug"] else ""} href="{link(p,pre)}"><span class="nav-code">{i:02d}</span>{e(p["short"])}</a>'
    sidebar += '<div class="nav-footer"><b>도재우 · Jae Woo Do</b>Embedded Software Developer<br><a href="mailto:herobine159@naver.com">herobine159@naver.com ↗</a></div>'
    toc_html = ''.join(f'<a href="#{id}">{e(label)}</a>' for id,label in toc)
    search_data = [{'title':p['title'],'href':link(p,pre),'summary':p['summary'],'text':' '.join([p['overview'],p['role'],*p['tags'],*[x[1] for x in p['features']]])} for p in PROJECTS]
    search_json = json.dumps(search_data,ensure_ascii=False).replace('<','\\u003c')
    description = next((p['summary'] for p in PROJECTS if p['slug']==active),'센서·통신·제어를 연결하는 임베디드 SW 개발자 도재우의 프로젝트 문서입니다.')
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{e(description,quote=True)}"><meta name="theme-color" content="#137f73"><title>{e(title)} | 도재우</title><link rel="icon" href="{pre}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{pre}assets/style.css"><script defer src="{pre}assets/app.js"></script></head>
<body><a class="skip" href="#main">본문으로 바로가기</a>
<header class="topbar"><button class="icon-button menu-button" id="menu-toggle" aria-label="프로젝트 메뉴 열기" aria-controls="project-nav" aria-expanded="false">☰</button><a class="brand" href="{pre}index.html"><span class="mark">JW</span>JAEWOO DO <small>Engineering Notes</small></a><div class="header-right"><button class="search-open" id="search-open"><span>⌕ &nbsp; 문서 검색</span><span class="key">Ctrl K</span></button><a href="https://github.com/Kevin-jwd">GitHub ↗</a><button class="icon-button" id="theme-toggle" aria-label="어두운 테마로 전환">☾</button></div></header>
<div class="overlay"></div><div class="shell"><nav class="sidebar" id="project-nav" aria-label="프로젝트 문서">{sidebar}</nav><div class="workspace"><main class="content" id="main"><div class="breadcrumb"><a href="{pre}index.html">Portfolio</a><span>/</span><span>{e(title)}</span></div>{body}<footer class="page-footer"><span>© 도재우 · Embedded Software</span><span>설계하고, 구현하고, 기록합니다.</span></footer></main><aside class="toc" aria-label="이 페이지의 목차"><p>ON THIS PAGE</p>{toc_html}<p class="toc-note">프로젝트의 역할과 구조,<br>구현 과정을 기록합니다.</p></aside></div></div>
<dialog id="search-dialog" aria-label="프로젝트 문서 검색"><div class="search-head"><input type="search" id="search-input" aria-label="검색어" placeholder="프로젝트, 기술, 구현 내용 검색…" autocomplete="off"><button id="search-close" aria-label="검색 닫기">ESC</button></div><div class="search-results" id="search-results" aria-live="polite"></div></dialog><script type="application/json" id="search-data">{search_json}</script></body></html>'''

def home():
    body = '''<div class="hero"><p class="eyebrow">EMBEDDED SOFTWARE · PROJECT DOCUMENTATION</p><h1>센서에서 동작까지,<br>구현의 과정을 기록합니다.</h1><p class="lead">안녕하세요, 임베디드 SW 개발자 도재우입니다.<br>MCU 제어, Linux 드라이버, Qt HMI와 RTL 설계 프로젝트의<br>담당 역할과 구현 과정, 문제 해결을 정리했습니다.</p><div class="hero-note"><span><i class="dot"></i>도재우 · Jae Woo Do</span><span>전자공학 전공</span></div></div>'''
    rows = ''
    for i,p in enumerate(PROJECTS,1):
        rows += f'<a class="project-row" href="{link(p)}"><span class="project-num">{i:02d}</span><div><div class="project-title">{e(p["title"])}</div><p class="project-summary">{e(p["summary"])}</p><div class="project-details"><span>{e(p["category"])}</span><span>{e(" · ".join(p["tags"][:3]))}</span></div></div><span class="arrow" aria-hidden="true">↗</span></a>'
    body += section('projects','프로젝트 문서',f'<div class="section-heading"><p>프로젝트를 선택하면 상세 문서로 이동합니다.</p><small>01 — 07</small></div>{rows}')
    body += section('reading','문서 구성','<p>전체 시스템의 목적부터 본인 담당 범위, 구현과 검증까지 순서대로 읽을 수 있도록 구성했습니다.</p>'+table(['설계와 구현','문제 해결과 검증'],[['개요 · 담당 역할 · 시스템 구조','트러블슈팅 · 검증·시연'],['주요 기능 · 핀맵·통신 규격','소스 코드 · 발표·참고 자료']]))
    body += section('about','개발 경험',table(['분야','주요 경험'],[['MCU / Firmware','타이머·인터럽트·UART·PWM을 이용한 센서·모터 제어'],['Linux Driver','Jetson 환경의 I2C 센서·LCD 커널 드라이버'],['HMI / Vision','Qt 차량 HMI, 얼굴 인증, 인물 추적과 팬틸트 제어'],['FPGA / RTL','Verilog 기반 센서 수집과 I2C 통신·표시 설계']]))
    body += section('contact','연락처','<ul class="references"><li><a href="mailto:herobine159@naver.com">herobine159@naver.com ↗</a></li><li><a href="https://github.com/Kevin-jwd">GitHub · Kevin-jwd ↗</a></li></ul>')
    return layout('소개 · 프로젝트 모음',body,toc=[('projects','프로젝트 문서'),('reading','문서 구성'),('about','개발 경험'),('contact','연락처')])

def project(p,index):
    tags = ''.join(f'<span class="tag">{e(t)}</span>' for t in p['tags'])
    meta = ''.join(f'<div><dt>{label}</dt><dd>{e(p[key])}</dd></div>' for label,key in [('기간','period'),('참여 인원','people'),('구분','type')])
    body = f'<div class="hero"><p class="eyebrow">PROJECT {index+1:02d} / {e(p["category"]).upper()}</p><h1>{e(p["title"])}</h1><p class="lead">{e(p["summary"])}</p><dl class="meta">{meta}</dl><div class="tags">{tags}</div></div>'
    body += section('overview','프로젝트 개요',f'<p>{e(p["overview"])}</p>')
    body += section('role','담당 역할',f'<p>{e(p["role"])}</p><div class="callout"><strong>담당 범위와 자료 기준</strong><p>{e(p["boundary"])}</p></div>')
    flow = '<div class="flow" aria-label="시스템 데이터 흐름">'+'<i aria-hidden="true">→</i>'.join(f'<span>{e(step)}</span>' for step in p['flow'])+'</div>'
    body += section('architecture','시스템 구조',flow+'<p>위 흐름은 주요 데이터와 제어 경로를 요약한 것입니다.</p>')
    body += section('implementation','구현 내용',''.join(f'<h3>{i+1:02d}. {e(t)}</h3><p>{e(d)}</p>' for i,(t,d) in enumerate(p['features'])))
    body += section('interfaces','핀맵·통신 규격',table(['연결 대상','인터페이스','용도'],p['interfaces'])+'<p>상세 핀 번호와 전압 조건은 최종 회로·배선 확인 후 추가합니다.</p>')
    t=p['trouble']
    if t:
        trouble=f'<h3>{e(t["title"])}</h3>'+table(['구분','내용'],[[label,t[key]] for label,key in [('증상','symptom'),('원인 분석','cause'),('조치','action'),('확인 결과','result')]])
    else:
        trouble='<p>문제 발생 당시의 증상과 점검 과정, 수정 내용 및 확인 결과를 정리해 추가할 예정입니다.</p>'
    body += section('troubleshooting','트러블슈팅',trouble)
    body += section('validation','검증·시연',f'<p>{e(p["validation"])}</p>')
    refs='<ul class="references">'+''.join(f'<li><a href="{e(url,quote=True)}">{e(title)} ↗</a></li>' for title,url in p['refs'])+'</ul>' if p['refs'] else '<p>발표자료와 논문 자료를 확인한 뒤 연결할 예정입니다.</p>'
    body += section('references','참고 자료',refs)
    prev=PROJECTS[index-1] if index else None
    nxt=PROJECTS[index+1] if index+1<len(PROJECTS) else None
    body += '<div class="next-pages">'+(f'<a href="{prev["slug"]}.html"><small>이전 문서</small>← {e(prev["short"])}</a>' if prev else '<a href="../index.html"><small>처음으로</small>← 프로젝트 모음</a>')+(f'<a href="{nxt["slug"]}.html"><small>다음 문서</small>{e(nxt["short"])} →</a>' if nxt else '<a href="../index.html"><small>전체 문서</small>프로젝트 모음 →</a>')+'</div>'
    return layout(p['title'],body,p['slug'],SECTIONS)

if __name__=='__main__':
    (ROOT/'projects').mkdir(exist_ok=True)
    (ROOT/'index.html').write_text(home(),encoding='utf-8')
    for i,p in enumerate(PROJECTS):
        (ROOT/'projects'/f'{p["slug"]}.html').write_text(project(p,i),encoding='utf-8')
    print(f'Built index.html and {len(PROJECTS)} project documents.')
