const $ = s => document.querySelector(s);
const themeButton = $('#theme-toggle');
let theme;
try { theme = localStorage.getItem('portfolio-theme'); } catch {}
if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
function themeLabel(){ themeButton.textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾'; themeButton.setAttribute('aria-label',document.documentElement.dataset.theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환'); }
themeLabel();
themeButton.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try{localStorage.setItem('portfolio-theme',next)}catch{} themeLabel(); });
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
// Group Markdown sections without changing the document content or heading links.
document.querySelectorAll('.doc-body').forEach(body => {
  const titles = [...body.children].filter(node => node.tagName === 'H2');
  titles.forEach((heading, index) => {
    const section = document.createElement('section');
    section.className = 'doc-section';
    section.id = heading.id || `section-${index + 1}`;
    heading.removeAttribute('id');
    heading.before(section);
    section.append(heading);
    while (section.nextSibling && section.nextSibling.nodeName !== 'H2') section.append(section.nextSibling);
    const number = document.createElement('span');
    number.className = 'section-index';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(2, '0');
    heading.prepend(number);
  });
  body.querySelectorAll('table').forEach(table => {
    table.classList.add('doc-table');
    const wrap = document.createElement('div');
    wrap.className = 'doc-table-wrap';
    table.before(wrap);
    wrap.append(table);
  });
});
const headings=[...document.querySelectorAll('main section[id]')];
const toc = $('#page-toc');
headings.forEach(section => {
  const heading = section.querySelector('h2');
  if (!heading) return;
  const link = document.createElement('a');
  link.href = '#' + section.id;
  link.textContent = [...heading.childNodes].filter(node => !node.classList?.contains('section-index')).map(node => node.textContent).join('').trim();
  toc.append(link);
});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}},{rootMargin:'-80px 0px -65% 0px'});headings.forEach(h=>observer.observe(h));}

const imageDialog = $('#image-dialog');
const fullImage = document.createElement('img');
fullImage.id = 'image-full';
fullImage.alt = '';
document.querySelectorAll('.doc-body img').forEach(img => {
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', (img.alt || '이미지') + ' 확대');
  const openImage = () => {
    fullImage.src = img.currentSrc || img.src;
    fullImage.alt = img.alt;
    $('#image-caption').before(fullImage);
    $('#image-caption').textContent = img.alt;
    imageDialog.showModal();
  };
  img.addEventListener('click', openImage);
  img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openImage(); } });
});
$('#image-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', e => { if (e.target === imageDialog) imageDialog.close(); });
