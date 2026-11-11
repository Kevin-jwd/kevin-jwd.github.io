const $ = s => document.querySelector(s);
const themeButton = $('#theme-toggle');
function themeLabel(){ const dark = document.documentElement.dataset.theme === 'dark'; const label = dark ? '라이트 테마로 전환' : '다크 테마로 전환'; themeButton.textContent = dark ? '☀' : '☾'; themeButton.setAttribute('aria-label',label); themeButton.title = label; themeButton.setAttribute('aria-pressed', String(!dark)); document.querySelector('meta[name="theme-color"]').content = dark ? '#1b1b1e' : '#ffffff'; }
themeLabel();
themeButton.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try{localStorage.setItem('portfolio-theme',next)}catch{} themeLabel(); });
window.addEventListener('storage', e => { if(e.key === 'portfolio-theme' || e.key === null){document.documentElement.dataset.theme = e.newValue === 'light' ? 'light' : 'dark';themeLabel();} });
const menu = $('#menu-toggle');
function closeNav(){document.body.classList.remove('nav-open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open = document.body.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(open));});
$('.overlay').addEventListener('click',closeNav);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
const dialog = $('#search-dialog'), input = $('#search-input'), results = $('#search-results');
const items = JSON.parse($('#search-data').textContent);
function search(){ const query = input.value.trim().toLocaleLowerCase();const matches=items.filter(i=>(i.title+' '+i.text).toLocaleLowerCase().includes(query));results.replaceChildren();for(const item of matches){const link=document.createElement('a');link.className='search-result';link.href=item.href;const title=document.createElement('b');title.textContent=item.title;const summary=document.createElement('small');summary.textContent=item.summary;link.append(title,summary);results.append(link);}if(!matches.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='검색 결과가 없습니다. 센서, UART, Linux 등의 단어로 검색해 보세요.';results.append(empty);}}
function openSearch(){dialog.showModal();input.focus();search();}
$('#search-open').addEventListener('click',openSearch);
$('#search-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
input.addEventListener('input',search);
input.addEventListener('keydown',e=>{if(e.key==='Enter'){const first=results.querySelector('a');if(first)first.click();}});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!dialog.open)openSearch();}});
const headings=[...document.querySelectorAll('main section[id]')];
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}},{rootMargin:'-80px 0px -65% 0px'});headings.forEach(h=>observer.observe(h));}
