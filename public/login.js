if(localStorage.getItem('darkMode')==='true')document.body.classList.add('dark-mode');
document.getElementById('theme').onclick=()=>{document.body.classList.toggle('dark-mode');localStorage.setItem('darkMode',document.body.classList.contains('dark-mode'));};
document.getElementById('login').addEventListener('submit',async e=>{
 e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;document.getElementById('error').textContent='';
 try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:document.getElementById('username').value,password:document.getElementById('password').value})});const data=await r.json();if(!r.ok)throw Error(data.error||'Sign in failed.');let next='';try{next=sessionStorage.getItem('cosmolog_next')||'';sessionStorage.removeItem('cosmolog_next');}catch{}location.href='/'+(next.startsWith('#')?next:'');}
 catch(err){document.getElementById('error').textContent=err.message||'Connection error. Check that the lab is running.';button.disabled=false;}
});
