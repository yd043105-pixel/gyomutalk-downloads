// Release files must come from the same repository and tag; checksum files are listed when present.
export const PRODUCTS = Object.freeze({
  server:{repo:'gyomutalk-server',assets:{x64:/^gyomutalk-server-(\d+\.\d+\.\d+)-setup-win-x64\.exe$/}},
  windows:{repo:'gyomutalk-windows',assets:{x64:/^gyomutalk-windows-(\d+\.\d+\.\d+)-setup-win-x64\.exe$/}},
  mac:{repo:'gyomutalk-mac',assets:{arm64:/^gyomutalk-mac-(\d+\.\d+\.\d+)-macos-arm64\.zip$/,x64:/^gyomutalk-mac-(\d+\.\d+\.\d+)-macos-x64\.zip$/}}
});
// A whole school often shares one public IP; GitHub allows 60 anonymous API calls per hour for it.
export const CACHE_MS = 10*60*1000;
export function releasesPage(product){return `https://github.com/yd043105-pixel/${PRODUCTS[product].repo}/releases`;}
export function parseRelease(product, release) {
  const entry=PRODUCTS[product];
  if(!entry||!release||release.draft||release.prerelease) return null;
  const match=/^v?(\d+\.\d+\.\d+)$/.exec(release.tag_name||'');
  if(!match) return null;
  const version=match[1],prefix=`${releasesPage(product)}/download/${encodeURIComponent(release.tag_name)}/`;
  const uploaded=(release.assets||[]).filter(a=>a.state==='uploaded'&&a.size>0&&a.browser_download_url===prefix+a.name);
  const files={};
  for(const [key,pattern] of Object.entries(entry.assets)){
    const asset=uploaded.find(a=>pattern.exec(a.name)?.[1]===version);
    const checksum=asset&&uploaded.find(a=>a.name===asset.name+'.sha256');
    files[key]=asset?{url:asset.browser_download_url,size:asset.size,checksum:checksum?.browser_download_url||null}:null;
  }
  return {version,url:Object.values(files).find(Boolean)?.url||null,files};
}
function readCache(storage,key){try{const cached=JSON.parse(storage?.getItem(key)||'null');return cached&&Date.now()-cached.at<CACHE_MS?cached.value:null;}catch{return null;}}
function writeCache(storage,key,value){try{storage?.setItem(key,JSON.stringify({at:Date.now(),value}));}catch{}}
export async function latestRelease(product, fetcher=fetch, {storage=globalThis.localStorage,force=false}={}) {
  if(!PRODUCTS[product]) throw new Error('Unknown product');
  const key='gyomutalk-release-'+product;
  if(!force){const cached=readCache(storage,key);if(cached)return cached;}
  const response=await fetcher(`https://api.github.com/repos/yd043105-pixel/${PRODUCTS[product].repo}/releases/latest`,{headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(12000),cache:'no-cache'});
  if(response.status===404){const empty={state:'empty'};writeCache(storage,key,empty);return empty;}
  if(!response.ok) return {state:'unavailable'};
  const parsed=parseRelease(product,await response.json());
  const result=parsed?{state:parsed.url?'ready':'preparing',...parsed}:{state:'unavailable'};
  if(result.state!=='unavailable')writeCache(storage,key,result);
  return result;
}
