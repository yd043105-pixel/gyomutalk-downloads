import {latestRelease,releasesPage} from './releases.js';
for(const button of document.querySelectorAll('[data-download-dialog]')){
  button.addEventListener('click',()=>document.getElementById(`download-dialog-${button.dataset.downloadDialog}`).showModal());
}
for(const modal of document.querySelectorAll('.product-download-dialog')){
  modal.querySelector('[data-close-download]').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target!==modal)return;const box=modal.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)modal.close();});
}
// Local Figma capture only; never load third-party design tools on the public page.
if(location.hostname==='localhost'&&location.hash.startsWith('#figmacapture=')){const script=document.createElement('script');script.src='https://mcp.figma.com/mcp/html-to-design/capture.js';script.async=true;document.head.append(script);}
const features={message:['compose.png','교무톡 · 메시지 작성','받는 사람을 확인하고, 메시지와 자료를 함께 보내세요.'],todo:['tasks.png','교무톡 · 할 일 목록','추가할 일을 직접 확인하고, 기한에 맞춰 관리하세요.'],submit:['submissions.png?v=20261029-compact','교무톡 · 파일 제출 현황','한 줄에 최대 4명씩 확인하고, 제출 상태·전체 파일명은 마우스를 올려 확인하세요. 제출 면제는 이름 옆 ‘…’ 버튼에서 관리합니다.'],admin:['admin.png','교무톡 · 관리자','학교 구성원과 권한을 관리자 화면에서 관리하세요.']};
function setupTabs(selector,onChange){const tabs=[...document.querySelectorAll(selector)];for(const tab of tabs){tab.addEventListener('click',()=>{for(const other of tabs){const active=other===tab;other.setAttribute('aria-selected',String(active));other.tabIndex=active?0:-1;}onChange(tab);});tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();let i=tabs.indexOf(tab);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+tabs.length)%tabs.length;tabs[i].click();tabs[i].focus();});}}
setupTabs('[data-feature]',tab=>{const [src,title,caption]=features[tab.dataset.feature];document.querySelector('#feature-image').src='assets/'+src;document.querySelector('#feature-image').alt=title+' 실제 실행 화면';document.querySelector('#preview-title').textContent=title;document.querySelector('#feature-caption').textContent=caption;document.querySelector('#feature-panel').setAttribute('aria-labelledby',tab.id);});
const guides={admin:{file:'admin',label:'관리자',steps:[['학교 도입 준비','적용 기준과 학교 도입 절차를 확인하고, 전용 서버 PC·백업 장치·운영 책임자를 준비합니다.'],['서버 설치와 구성원 등록','서버관리자용 설치파일을 실행합니다. 관리자 화면에서 서버와 교직원·학생·권한을 설정합니다.'],['학교 등록 후 연결 확인','학교 등록을 신청하고 승인 후 검색 연결을 확인합니다. 교직원 PC에서 로그인·메시지·첨부 전송을 시험합니다.']]},teacher:{file:'teacher',label:'교직원',steps:[['교무톡 설치','학교 관리자가 서버 준비를 마친 뒤 Windows 사용자용 설치파일을 실행합니다.'],['학교 선택과 첫 로그인','학교를 검색해 선택하고 등록된 이름과 초기 비밀번호로 로그인한 뒤 개인 비밀번호를 설정합니다.'],['조직도에서 업무 시작','받는 사람을 선택해 메시지를 보내고, 받은 메시지의 할 일 후보와 파일 제출 요청을 확인합니다.']]},student:{file:'student',label:'학생·학부모',steps:[['앱 출시 후 설치','학교톡은 Android·iOS 출시 준비 중입니다. 출시되면 해당 앱 스토어에서 설치합니다.'],['학교 선택과 계정 연결','학생은 학교가 등록한 계정을 사용합니다. 학부모는 가입 후 학교에서 안내받은 자녀 고유번호를 연결합니다.'],['학교 소식 확인','본인에게 공개된 공지와 가정통신문을 확인하고, 시간표·급식·상담 신청 등을 이용합니다.']]}};
function showGuide(key){const guide=guides[key];document.querySelector('#steps').replaceChildren(...guide.steps.map(([title,text],i)=>{const el=document.createElement('article');el.className='step';const n=document.createElement('span');n.textContent=`STEP 0${i+1}`;const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=text;el.append(n,h,p);return el;}));const link=document.querySelector('#manual');link.href=`assets/manuals/${guide.file}.pdf`;link.textContent=`${guide.label} 설명서 PDF 보기 ↗`;document.querySelector('#guide-panel').setAttribute('aria-labelledby',`guide-${key}`);}
setupTabs('[data-guide]',tab=>showGuide(tab.dataset.guide));showGuide('admin');
const dialog=document.querySelector('#screenshot-dialog');document.querySelector('#expand').addEventListener('click',()=>{const source=document.querySelector('#feature-image'),target=document.querySelector('#large-image');target.src=source.src;target.alt=source.alt;document.querySelector('#dialog-title').textContent=source.alt;dialog.showModal();});document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const LABELS={x64:'설치파일 다운로드 ↓'},MAC_LABELS={arm64:'Apple Silicon용 ↓',x64:'Intel용 ↓'};
function link(text,href,className){const a=document.createElement('a');a.className=className;a.href=href;a.target='_blank';a.rel='noopener';a.textContent=text;return a;}
function renderRelease(product,release){
  const row=document.querySelector(`[data-product="${product}"]`),status=row.querySelector('.release-status'),action=row.querySelector('.download-action');
  status.replaceChildren();action.replaceChildren();
  if(release.version){const strong=document.createElement('strong');strong.textContent=`v${release.version}`;status.append(strong);}
  if(release.state==='ready'){
    status.append('GitHub 최신 공개 릴리즈');
    for(const [key,file] of Object.entries(release.files)){if(!file)continue;action.append(link((product==='mac'?MAC_LABELS:LABELS)[key],file.url,'button primary'));if(file.checksum)action.append(link('SHA-256 확인값',file.checksum,'checksum'));}
    return;
  }
  status.append(release.state==='preparing'?'설치파일 준비 중':release.state==='empty'?(product==='mac'?'출시 예정 · Apple 서명·공증 준비 중':'첫 공개 릴리즈 준비 중'):'자동 확인 불가');
  if(product==='mac'&&release.state==='empty'){const soon=document.createElement('button');soon.className='button secondary';soon.type='button';soon.disabled=true;soon.textContent='출시 예정';action.append(soon);}
  else action.append(link('릴리즈 확인 ↗',releasesPage(product),'button secondary'));
}
let checking=false;
async function checkReleases(force=false){
  if(checking)return;checking=true;const button=document.querySelector('#refresh-releases');button.disabled=true;
  document.querySelector('#release-check').textContent='GitHub 공개 릴리즈를 확인하고 있습니다.';
  const states=await Promise.all(['server','windows','mac'].map(async product=>{let release;try{release=await latestRelease(product,fetch,{force});}catch{release={state:'unavailable'};}renderRelease(product,release);return release.state;}));
  document.querySelector('#pc-release-summary').textContent=states.includes('ready')?'설치파일 다운로드 가능':states.includes('unavailable')?'선택 창에서 버전 확인':states.includes('preparing')?'설치파일 준비 중':'첫 공개 릴리즈 준비 중';
  document.querySelector('#release-check').textContent=states.includes('unavailable')?'일부 릴리즈를 확인하지 못했습니다. GitHub 릴리즈 페이지에서 직접 확인해 주세요.':`확인 완료 · ${new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeStyle:'short'}).format(new Date())}`;
  checking=false;button.disabled=false;
}
document.querySelector('#refresh-releases').addEventListener('click',()=>checkReleases(true));checkReleases();
