importScripts('solver.js?v=20261114-5');onmessage=e=>{try{postMessage(findBestBuild(e.data.items,e.data.targets,e.data.mode,e.data.priorities))}catch(error){postMessage({error:error.message})}};
