/* Exact feasibility search with suffix bounds and memoized failed states. */
function findBuild(items, targets, mode='minimum') {
 const groups=Array.from({length:6},(_,slot)=>items.filter(x=>x.slot===slot));
 if(groups.some(g=>!g.length))return null;
 groups.sort((a,b)=>a.length-b.length);
 const vectors=groups.map(g=>g.map(item=>{const v=Array(10).fill(0);item.skills.forEach(s=>v[s]++);return {item,v}}));
 const bounds=Array.from({length:7},()=>Array(10).fill(0));
 for(let d=5;d>=0;d--)for(let s=0;s<10;s++)bounds[d][s]=bounds[d+1][s]+Math.max(...vectors[d].map(x=>x.v[s]));
 const failed=new Set();const chosen=[];
 function dfs(d,sum){
  if(sum.some((v,s)=>v+bounds[d][s]<targets[s]||(mode==='exact'&&v>targets[s])))return null;
  if(d===6)return chosen.slice().sort((a,b)=>a.slot-b.slot);
  const key=d+':'+sum.map((v,s)=>mode==='exact'?v:Math.min(v,targets[s])).join(',');if(failed.has(key))return null;
  for(const {item,v} of vectors[d]){chosen.push(item);const result=dfs(d+1,sum.map((n,s)=>n+v[s]));if(result)return result;chosen.pop()}
  failed.add(key);return null;
 }
 return dfs(0,Array(10).fill(0));
}
if(typeof module!=='undefined')module.exports={findBuild};
