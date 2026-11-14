importScripts('solver.js');onmessage=e=>{try{postMessage({result:findBuild(e.data.items,e.data.targets,e.data.mode)})}catch(error){postMessage({error:error.message})}};
