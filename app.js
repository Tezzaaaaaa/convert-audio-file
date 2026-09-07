const input=document.querySelector('#file');
const drop=document.querySelector('#drop');
const queue=document.querySelector('#queue');
const items=document.querySelector('#items');
const clear=document.querySelector('#clear');
const appearance=document.querySelector('#appearance');
const format=document.querySelector('#format');
const convert=document.querySelector('#convert');
const sourceTitle=document.querySelector('#sourceTitle');
const sourceHint=document.querySelector('#sourceHint');
let files=[];
const formats=['MP3','WAV','M4A','AAC','FLAC','OGG'];
const size=n=>n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(1)+' MB';
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){
  queue.hidden=!files.length;
  convert.disabled=!files.length;
  sourceTitle.textContent=files.length?`${files.length} file${files.length===1?'':'s'} selected`:'Add audio file';
  sourceHint.textContent=files.length?'Choose another file or drag more here':'Click to choose or drag and drop';
  items.innerHTML=files.map((f,i)=>`<div class="item"><div><div class="name">${escapeHtml(f.name)}</div><div class="meta">${size(f.size)} · Audio · ${format.value}</div></div><button class="link remove" data-i="${i}">Remove</button></div>`).join('');
  document.querySelectorAll('.remove').forEach(b=>b.onclick=()=>{files.splice(+b.dataset.i,1);render()});
}
function add(list){
  const accepted=[...list].filter(f=>f.type.startsWith('audio/')||/\.(mp3|wav|m4a|aac|flac|ogg)$/i.test(f.name));
  files.push(...accepted);render();
}
input.onchange=e=>add(e.target.files);
['dragenter','dragover'].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>add(e.dataTransfer.files));
clear.onclick=()=>{files=[];render()};
format.onchange=render;
appearance.onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dark',document.body.classList.contains('dark'))};
convert.onclick=()=>{if(!files.length)return;alert('The converter engine is not connected yet. The interface is ready for the conversion step.')};
if(localStorage.getItem('dark')==='true')document.body.classList.add('dark');
render();
