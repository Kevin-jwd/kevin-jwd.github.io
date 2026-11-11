/* Progressive enhancement: document links and both views exist without JS. */
(() => {
  if (!document.body.classList.contains('portfolio-home')) return;
  const select = selector => document.querySelector(selector);
  const assets = JSON.parse(select('#home-asset-base').textContent);
  const projects = JSON.parse(select('#home-project-base').textContent);
  // Off-canvas navigation must not receive keyboard focus while closed.
  const nav = select('#project-nav');
  const syncNavigation = () => {
    const open = document.body.classList.contains('nav-open');
    if (!open && nav.contains(document.activeElement)) select('#menu-toggle').focus();
    nav.inert = !open;
  };
  syncNavigation();
  new MutationObserver(syncNavigation).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const inspections = {
    measure: {
      label: '01 / MEASURE', title: '거리 측정을 기다리는 동안에도,\n다른 일을 처리하도록.',
      copy: 'Echo의 상승·하강 에지를 외부 인터럽트로 받고, 타이머로 펄스 폭을 측정했습니다. 메인 루프에서 Echo가 끝날 때까지 계속 대기하지 않도록 구성했습니다.',
      tags: ['C', 'Timer', 'Interrupt'], image: 'distance-processing.png', width: 3744, height: 2080,
      alt: 'Echo 측정과 거리 보정 처리 구조', evidence: '측정 구조 자세히 보기 ↗', href: 'rc-car.html#구현-내용',
      related: 'BMP180 온도 측정·보정 드라이버 ↗', relatedHref: 'smart-fan.html'
    },
    communicate: {
      label: '02 / COMMUNICATE', title: '명령 한 글자도,\n실제 비트열로 확인합니다.',
      copy: 'Bluetooth 모듈과 MCU 사이의 UART 파형을 오실로스코프로 확인했습니다. 시작·정지 비트를 구분하고, LSB부터 전송되는 데이터가 명령 문자와 일치하는지 분석했습니다.',
      tags: ['UART', '8N1', 'Oscilloscope'], image: 'uart-forward.png', width: 2816, height: 2698,
      alt: '전진 명령 f의 시작 비트, 데이터 비트, 정지 비트를 분석한 오실로스코프 파형', evidence: 'UART 파형 4종과 해석 보기 ↗', href: 'rc-car.html#bluetooth-명령의-uart-파형-확인',
      related: 'FPGA 간 I2C Master·Slave RTL 구현 ↗', relatedHref: 'i2c-rtl.html'
    },
    control: {
      label: '03 / CONTROL', title: '센서의 숫자를,\n장치의 판단으로 바꿉니다.',
      copy: '근접 장애물에서는 후진 후 해당 판단을 종료합니다. 그 외에는 전방 회피 조건과 좌우 거리·변화량을 반영해 조향을 결정하고, PWM 모터 제어로 연결했습니다.',
      tags: ['C', 'PWM', 'GPIO'], image: 'driving-logic.png', width: 3296, height: 2270,
      alt: '근접 장애물 대응과 좌우 균형 보정을 포함한 주행 판단 흐름', evidence: '주행 판단 흐름 자세히 보기 ↗', href: 'rc-car.html#주행-제어',
      related: '비전 트래커의 감지·제어 연동 ↗', relatedHref: 'vision-tracker.html'
    },
    display: {
      label: '04 / DISPLAY', title: '장치 안의 상태를,\n밖에서도 읽을 수 있도록.',
      copy: '주행 상태와 시간·동작 횟수를 두 개의 FND에 표시했습니다. 버튼으로 수동·자동 주행과 통계 조회 모드를 전환하도록 구성했습니다.',
      tags: ['FND', 'GPIO', 'Mode'], image: 'mode-fsm.png', width: 3936, height: 2016,
      alt: '수동·자동 주행과 시간·동작 통계 조회의 6개 모드 전환', evidence: '상태 표시와 모드 전환 보기 ↗', href: 'rc-car.html#동작-모드',
      related: 'Qt HMI의 상태 표시·이력 관리 ↗', relatedHref: 'vehicle-hmi.html'
    }
  };
  document.querySelectorAll('[data-inspect]').forEach(button => {
    button.addEventListener('click', () => {
      const item = inspections[button.dataset.inspect];
      document.querySelectorAll('[data-inspect]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      select('#detail-label').textContent = item.label;
      const title = select('#detail-title'); title.replaceChildren();
      item.title.split('\n').forEach((line, index) => { if (index) title.append(document.createElement('br')); title.append(document.createTextNode(line)); });
      select('#detail-copy').textContent = item.copy;
      select('#detail-tags').replaceChildren(...item.tags.map(tag => { const element = document.createElement('span'); element.textContent = tag; return element; }));
      const img = select('#detail-image'); img.alt = item.alt; img.width = item.width; img.height = item.height; img.src = assets + item.image;
      select('#detail-evidence-label').textContent = item.evidence;
      select('#detail-evidence').href = projects + item.href;
      select('#detail-related').textContent = item.related;
      select('#detail-related').href = projects + item.relatedHref;
    });
  });
  const commands = { forward: '전진', backward: '후진', left: '좌회전', right: '우회전', stop: '정지' };
  let selectedCommand = 'forward', recording = null, playing = false;
  const playButton = select('#recording-toggle'), screen = select('#recording-screen');
  function stopRecording() {
    playing = false;
    if (recording) { recording.remove(); recording.removeAttribute('src'); recording = null; }
    select('#recording-placeholder').hidden = false;
    screen.removeAttribute('aria-busy');
    playButton.textContent = commands[selectedCommand] + ' 기록 재생 ▶';
  }
  function playRecording() {
    stopRecording(); playing = true;
    select('#recording-caption').textContent = commands[selectedCommand] + ' 제어 · FND 표시와 모터 출력 확인';
    recording = document.createElement('img');
    recording.alt = commands[selectedCommand] + ' 제어의 FND 표시와 모터 출력 기록';
    recording.width = 400; recording.height = 711;
    screen.setAttribute('aria-busy', 'true');
    const current = recording;
    current.addEventListener('load', () => { if (recording === current) screen.removeAttribute('aria-busy'); });
    current.addEventListener('error', () => {
      if (recording !== current) return;
      stopRecording(); select('#recording-caption').textContent = '기록을 불러오지 못했습니다. 다시 재생하거나 구현 문서에서 확인해 주세요.';
    });
    recording.src = assets + 'output-' + selectedCommand + '.gif';
    select('#recording-placeholder').hidden = true; screen.append(recording);
    playButton.textContent = '재생 종료 ■';
  }
  playButton.addEventListener('click', () => playing ? stopRecording() : playRecording());
  document.querySelectorAll('[data-command]').forEach(button => {
    button.addEventListener('click', () => {
      selectedCommand = button.dataset.command;
      document.querySelectorAll('[data-command]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      select('#recording-caption').textContent = commands[selectedCommand] + ' 제어 · FND 표시와 모터 출력 확인';
      if (playing) playRecording(); else stopRecording();
    });
  });
  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      document.querySelectorAll('.bench-view').forEach(view => { view.hidden = view.id !== button.dataset.view; });
      if (button.dataset.view !== 'output-view') stopRecording();
    });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopRecording(); });
  const items = [...document.querySelectorAll('.archive-item')];
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      items.forEach(item => { item.hidden = category !== 'all' && item.dataset.category !== category; });
      select('#filter-status').textContent = (category === 'all' ? '전체' : category) + ' ' + items.filter(item => !item.hidden).length + '개 프로젝트';
    });
  });
  select('#output-view').hidden = true;
  document.querySelectorAll('[data-enhance-controls]').forEach(element => { element.hidden = false; });
})();
