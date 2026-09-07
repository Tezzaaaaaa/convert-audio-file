import { FFmpeg } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/+esm';
import { fetchFile, toBlobURL } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.2/+esm';

const input=document.querySelector('#file');
const drop=document.querySelector('#drop');
const queue=document.querySelector('#queue');
const items=document.querySelector('#items');
const clear=document.querySelector('#clear');
const appearance=document.querySelector('#appearance');
const convert=document.querySelector('#convert');
const format=document.querySelector('#format');
const progress=document.querySelector('#progress');
const progressLabel=document.querySelector('#progressLabel');
const progressValue=document.querySelector('#progressValue');
const progressBar=document.querySelector('#progressBar');
const downloads=document.querySelector('#downloads');

const ffmpeg=new FFmpeg();
let loaded=false;
let converting=false;
let files=[];
let results=[];

const formats={
  MP3:'mp3',M4A:'m4a',AAC:'aac',WAV:'wav',FLAC:'flac',OGG:'ogg',OPUS:'opus',
  MP4:'mp4',MOV:'mov',WEBM:'webm',MKV:'mkv',AVI:'avi',GIF:'gif',
  JPG:'jpg',PNG:'png',WEBP:'webp'
};

const imageExt=/\.(jpg|jpeg|png|webp|gif|bmp|tif|tiff)$/i;
const videoExt=/\.(mp4|mov|m4v|webm|mkv|avi|wmv|flv|mpeg|mpg|3gp)$/i;
const audioExt=/\.(mp3|wav|m4a|aac|flac|ogg|opus|wma|aiff|aif)$/i;
const size=n=>n<1024*1024?(n/1024).toFixed(1)+' KB':(n/1024/1024).toFixed(1)+' MB';
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function fileKind(file){
  if(file.type.startsWith('image/')||imageExt.test(file.name))return 'Image';
  if(file.type.startsWith('video/')||videoExt.test(file.name))return 'Video';
  if(file.type.startsWith('audio/')||audioExt.test(file.name))return 'Audio';
  return 'File';
}

function render(){
  queue.hidden=!files.length;
  convert.disabled=!files.length||converting;
  document.querySelector('#queueTitle').textContent=files.length===1?'1 file':`${files.length} files`;
  items.innerHTML=files.map((f,i)=>`<div class="item"><div><div class="name">${esc(f.name)}</div><div class="meta">${size(f.size)} · ${fileKind(f)}</div></div><select class="select" data-i="${i}" aria-label="Output format">${[...format.options].map(o=>`<option value="${o.value}" ${o.value===format.value?'selected':''}>${o.textContent}</option>`).join('')}</select><button class="link remove" data-i="${i}">Remove</button></div>`).join('');
  document.querySelectorAll('.select').forEach(s=>s.onchange=e=>{format.value=e.target.value});
  document.querySelectorAll('.remove').forEach(b=>b.onclick=()=>{files.splice(+b.dataset.i,1);render()});
}

function add(list){
  const incoming=[...list];
  if(!incoming.length)return;
  files.push(...incoming);
  render();
  drop.classList.add('has-file');
  document.querySelector('#sourceTitle').textContent=files.length===1?files[0].name:`${files.length} files selected`;
  document.querySelector('#sourceHint').textContent='Click to add more files';
}

function setProgress(value,label){
  progress.hidden=false;
  const v=Math.max(0,Math.min(100,Math.round(value)));
  progressValue.textContent=`${v}%`;
  progressBar.style.width=`${v}%`;
  progressLabel.textContent=label;
}

async function loadEngine(){
  if(loaded)return;
  setProgress(4,'Loading conversion engine…');
  const base='https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
  await ffmpeg.load({
    coreURL:await toBlobURL(`${base}/ffmpeg-core.js`,'text/javascript'),
    wasmURL:await toBlobURL(`${base}/ffmpeg-core.wasm`,'application/wasm')
  });
  ffmpeg.on('progress',({progress:p})=>setProgress(10+p*88,`Converting ${Math.round(p*100)}%`));
  loaded=true;
}

function outputName(name,ext){
  const clean=name.replace(/\.[^.]+$/,'');
  return `${clean}.${ext}`;
}

function commandFor(ext,inputName,outputName){
  const args=['-i',inputName,'-y'];
  if(ext==='gif')args.push('-vf','fps=12,scale=1280:-1:flags=lanczos');
  if(ext==='mp3')args.push('-b:a','192k');
  if(ext==='m4a'||ext==='aac')args.push('-b:a','192k');
  if(ext==='opus')args.push('-b:a','128k');
  if(ext==='ogg')args.push('-q:a','5');
  if(ext==='mp4'||ext==='mov')args.push('-c:v','libx264','-preset','veryfast','-crf','23','-c:a','aac','-b:a','160k');
  if(ext==='webm')args.push('-c:v','libvpx-vp9','-crf','32','-b:v','0','-c:a','libopus','-b:a','128k');
  args.push(outputName);
  return args;
}

async function convertOne(file,index,total){
  const ext=formats[format.value];
  const inputName=`input-${index}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
  const output=`${index}-${outputName(file.name,ext).replace(/[^a-zA-Z0-9._-]/g,'_')}`;
  await ffmpeg.writeFile(inputName,await fetchFile(file));
  setProgress(10+index/total*80,`Preparing ${file.name}`);
  await ffmpeg.exec(commandFor(ext,inputName,output));
  const data=await ffmpeg.readFile(output);
  const mime=ext==='mp3'?'audio/mpeg':ext==='wav'?'audio/wav':ext==='flac'?'audio/flac':ext==='ogg'?'audio/ogg':ext==='opus'?'audio/opus':ext==='mp4'?'video/mp4':ext==='webm'?'video/webm':ext==='gif'?'image/gif':ext==='png'?'image/png':ext==='webp'?'image/webp':ext==='jpg'?'image/jpeg':'application/octet-stream';
  const blob=new Blob([data.buffer],{type:mime});
  const url=URL.createObjectURL(blob);
  results.push({name:output.replace(/^\d+-/,''),url,size:blob.size});
  await ffmpeg.deleteFile(inputName).catch(()=>{});
  await ffmpeg.deleteFile(output).catch(()=>{});
}

function renderDownloads(){
  downloads.hidden=!results.length;
  downloads.innerHTML=results.map(r=>`<a class="download" href="${r.url}" download="${esc(r.name)}"><span><b>${esc(r.name)}</b><small>${size(r.size)}</small></span><strong>Download</strong></a>`).join('');
}

input.onchange=e=>add(e.target.files);
['dragenter','dragover'].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>add(e.dataTransfer.files));
clear.onclick=()=>{files=[];results=[];renderDownloads();render();progress.hidden=true;document.querySelector('#sourceTitle').textContent='Add files';document.querySelector('#sourceHint').textContent='Choose files or drag and drop'};
format.onchange=render;
appearance.onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dark',document.body.classList.contains('dark'))};
if(localStorage.getItem('dark')==='true')document.body.classList.add('dark');

convert.onclick=async()=>{
  if(!files.length||converting)return;
  converting=true;results=[];renderDownloads();render();convert.textContent='Converting…';
  try{
    await loadEngine();
    for(let i=0;i<files.length;i++)await convertOne(files[i],i,files.length);
    setProgress(100,`Finished ${results.length} ${results.length===1?'file':'files'}`);
    renderDownloads();
    convert.textContent='Convert again';
  }catch(error){
    console.error(error);
    setProgress(0,'Conversion failed — try another format or file');
    convert.textContent='Try again';
  }finally{
    converting=false;render();
    if(files.length)convert.disabled=false;
  }
};
