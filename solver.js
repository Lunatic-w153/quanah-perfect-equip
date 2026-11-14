/* Exact feasibility search with suffix bounds and memoized failed states. */
function findBuild(items, targets, mode='minimum') {
 const groups=Array.from({length:6},(_,slot)=>items.filter(x=>x.slot===slot));
 if(groups.some(g=>!g.length))return null;
 groups.sort((a,b)=>a.length-b.length);
 const vectors=groups.map(g=>g.map(item=>{const v=Array(targets.length).fill(0);item.skills.forEach(s=>v[s]++);return {item,v}}));
 const bounds=Array.from({length:7},()=>Array(targets.length).fill(0));
 for(let d=5;d>=0;d--)for(let s=0;s<targets.length;s++)bounds[d][s]=bounds[d+1][s]+Math.max(...vectors[d].map(x=>x.v[s]));
 const failed=new Set();const chosen=[];
 function dfs(d,sum){
  if(sum.some((v,s)=>v+bounds[d][s]<targets[s]||(mode==='exact'&&v>targets[s])))return null;
  if(d===6)return chosen.slice().sort((a,b)=>a.slot-b.slot);
  const key=d+':'+sum.map((v,s)=>mode==='exact'?v:Math.min(v,targets[s])).join(',');if(failed.has(key))return null;
  for(const {item,v} of vectors[d]){chosen.push(item);const result=dfs(d+1,sum.map((n,s)=>n+v[s]));if(result)return result;chosen.pop()}
  failed.add(key);return null;
 }
 return dfs(0,Array(targets.length).fill(0));
}
if(typeof module!=='undefined')module.exports={findBuild};

// Minimize missing levels lexicographically by priority (1 is highest).
// For exact matching, excess levels also count as deviations.
function findBestBuild(items,targets,mode='minimum',priorities=targets.map((_,i)=>i>=5&&i<=8?1:2)){
 const exact=findBuild(items,targets,mode);if(exact)return {result:exact,perfect:true};
 const groups=Array.from({length:6},(_,slot)=>items.filter(x=>x.slot===slot));if(groups.some(g=>!g.length))return {result:null,perfect:false};
 groups.sort((a,b)=>a.length-b.length);
 const vectors=groups.map(g=>g.map(item=>{const v=Array(targets.length).fill(0);item.skills.forEach(s=>v[s]++);return {item,v}}));
 const levels=[...new Set(priorities)].sort((a,b)=>a-b);
 const bounds=Array.from({length:7},()=>Array(targets.length).fill(0));
 for(let d=5;d>=0;d--)for(let s=0;s<targets.length;s++)bounds[d][s]=bounds[d+1][s]+Math.max(...vectors[d].map(x=>x.v[s]));
 const compare=(a,b)=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0};
 function score(sum,d){return levels.map(p=>sum.reduce((n,v,s)=>n+(priorities[s]===p?Math.max(0,targets[s]-v-bounds[d][s])+(mode==='exact'?Math.max(0,v-targets[s]):0):0),0))}
 let best=null,bestScore=levels.map(()=>Infinity);const seen=new Set(),chosen=[];
 function dfs(d,sum){const lower=score(sum,d);if(compare(lower,bestScore)>=0)return;
 if(d===6){best=chosen.slice();bestScore=lower;return}
 const key=d+':'+sum.map((v,s)=>mode==='minimum'?Math.min(v,targets[s]):v).join(',');if(seen.has(key))return;seen.add(key);
 const ordered=vectors[d].map(x=>({...x,sum:sum.map((n,s)=>n+x.v[s])})).map(x=>({...x,bound:score(x.sum,d+1)})).sort((a,b)=>compare(a.bound,b.bound));
 for(const x of ordered){chosen.push(x.item);dfs(d+1,x.sum);chosen.pop()}
 }
 dfs(0,Array(targets.length).fill(0));return {result:best.sort((a,b)=>a.slot-b.slot),perfect:false,penalties:bestScore};
}
if(typeof module!=='undefined')module.exports.findBestBuild=findBestBuild;
