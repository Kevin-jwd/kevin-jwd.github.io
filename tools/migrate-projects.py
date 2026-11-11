"""One-time migration of legacy JSON into editable Chirpy Markdown documents.

Existing Markdown files are never overwritten. Dates describe document publication,
not project periods. After migration, edit _posts directly.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def table(headers, rows):
    def cell(value):
        return str(value).replace('|', '&#124;').replace('\n', '<br>')
    return '\n'.join([
        '| ' + ' | '.join(map(cell, headers)) + ' |',
        '| ' + ' | '.join('---' for _ in headers) + ' |',
        *['| ' + ' | '.join(map(cell, row)) + ' |' for row in rows],
    ])


def document(p):
    front = {
        'title': p['title'],
        'description': p['summary'],
        'date': '2026-11-11 00:00:00 +0900',
        'categories': [p['category']],
        'tags': p['tags'],
        'permalink': f"/projects/{p['slug']}.html",
        'toc': True,
        'comments': False,
    }
    text = ['---'] + [f'{k}: {json.dumps(v, ensure_ascii=False)}' for k, v in front.items()] + ['---', '']
    text += [p['summary'], '', table(['기간', '참여 인원', '구분'], [[p['period'], p['people'], p['type']]]), '',
             '## 프로젝트 개요', '', p['overview'], '', '## 담당 역할', '', p['role'], '',
             '> ' + p['boundary'], '{: .prompt-info }', '', '## 시스템 구조', '',
             table(['순서', '구성 요소'], [[str(i), step] for i, step in enumerate(p['flow'], 1)]), '',
             '## 구현 내용', '']
    for title, detail in p['features']:
        text += [f'### {title}', '', detail, '']
    text += ['## 핀맵·통신 규격', '', table(['연결 대상', '인터페이스', '용도'], p['interfaces']), '',
             '상세 핀 번호와 전압 조건은 최종 회로·배선 확인 후 추가합니다.', '', '## 트러블슈팅', '']
    if p['trouble']:
        t = p['trouble']
        text += [f"### {t['title']}", '', table(['구분', '내용'], [
            [label, t[key]] for label, key in [('증상', 'symptom'), ('원인 분석', 'cause'), ('조치', 'action'), ('확인 결과', 'result')]
        ]), '']
    else:
        text += ['문제 발생 당시의 증상과 점검 과정, 수정 내용 및 확인 결과를 정리해 추가할 예정입니다.', '']
    text += ['## 검증·시연', '', p['validation'], '', '## 참고 자료', '']
    text += [f'- [{title}]({url})' for title, url in p['refs']] or ['발표자료와 논문 자료를 확인한 뒤 연결할 예정입니다.']
    return '\n'.join(text) + '\n'


if __name__ == '__main__':
    projects = json.loads((ROOT / 'content/projects.json').read_text('utf-8'))
    target = ROOT / '_posts'
    target.mkdir(exist_ok=True)
    count = 0
    for project in projects:
        path = target / f"2026-11-11-{project['slug']}.md"
        if not path.exists():
            path.write_text(document(project), encoding='utf-8')
            count += 1
    print(f'Migrated {count} documents; existing Markdown was preserved.')
