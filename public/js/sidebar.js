const mqMobile=()=>!!(window.matchMedia&&matchMedia("(max-width:780px)").matches);
function sideApply(){let m="";try{m=localStorage.getItem("mn_side")||""}catch(x){}document.body.classList.toggle("sc",m=="mini")}
function sideToggle(){if(mqMobile())document.body.classList.toggle("so");else{const c=document.body.classList.toggle("sc");try{localStorage.setItem("mn_side",c?"mini":"open")}catch(x){}}}
function sideHeight(){const h=document.querySelector("header");if(!h)return;const f=()=>document.body.style.setProperty("--hh",h.offsetHeight+"px");f();if(window.ResizeObserver)new ResizeObserver(f).observe(h);else window.addEventListener("resize",f)}
