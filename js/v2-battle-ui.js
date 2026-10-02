
(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const modes={
    com:{start:"#autoBattleBtn",scene:"#battleScene",result:"#battleResult",log:"#battleLog",label:"COM BATTLE"},
    adventure:{start:"#storyBattleBtn",scene:"#storyBattleScene",result:"#storyResult",log:"#storyLog",label:"ADVENTURE"},
    dungeon:{start:"#dungeonAutoBattleBtn",scene:"#dungeonBattleScene",result:"#dungeonResult",log:"#dungeonLog",label:"∞ DUNGEON"}
  };
  let currentMode=null,currentScene=null,resultObserver=null,logObserver=null;

  function syncSpeed(scene,speed){
    const source=$(`.speed-btn[data-speed="${speed}"]`);
    if(source) source.click();
    $$(".v2-speed",scene).forEach(b=>b.classList.toggle("active",b.dataset.speed===speed));
  }
  function copyLog(mode){
    const panel=currentScene?.querySelector(".v2-battle-log-panel");
    const src=$(modes[mode].log);
    if(panel&&src) panel.textContent=src.textContent||"戦闘ログはまだありません。";
  }
  function createChrome(mode,scene){
    if(scene.querySelector(".v2-control-dock")) return;
    const rotate=document.createElement("div");
    rotate.className="v2-rotate-hint";
    rotate.innerHTML="";
    scene.appendChild(rotate);

    const top=document.createElement("div");
    top.className="v2-battle-topbar";
    top.innerHTML=`<span>${modes[mode].label}</span><span>PORTRAIT AUTO</span>`;
    scene.appendChild(top);

    const log=document.createElement("div");
    log.className="v2-battle-log-panel";
    log.textContent="戦闘ログ";
    scene.appendChild(log);

    const dock=document.createElement("div");
    dock.className="v2-control-dock";
    dock.innerHTML=`
      <button class="v2-speed active" data-speed="0.72">×1</button>
      <button class="v2-speed" data-speed="1.15">×2</button>
      <button class="v2-speed" data-speed="1.75">×3</button>
      <button class="v2-log">LOG</button>
      <button class="v2-exit">戻る</button>`;
    scene.appendChild(dock);

    $$(".v2-speed",dock).forEach(btn=>btn.addEventListener("click",()=>syncSpeed(scene,btn.dataset.speed)));
    $(".v2-log",dock).addEventListener("click",()=>{log.classList.toggle("open");copyLog(mode)});
    $(".v2-exit",dock).addEventListener("click",exitBattleView);
  }
  
  function setVerticalBackground(mode, scene){
    const map={
      com:"assets/backgrounds/vertical/arena_vertical.jpg",
      adventure:"assets/backgrounds/vertical/grassland_vertical.jpg",
      dungeon:"assets/backgrounds/vertical/ruins_vertical.jpg"
    };
    const src=map[mode]||map.com;
    scene.style.backgroundImage=`linear-gradient(rgba(2,8,16,.04),rgba(2,8,16,.12)),url("${src}")`;
  }


  function clearFinishButtons(scene){
    scene?.querySelectorAll(".v2-finish,.v2-next").forEach(x=>x.remove());
  }

  function continueToNext(mode){
    const scene=currentScene;
    clearFinishButtons(scene);

    if(mode==="com"){
      const next=document.querySelector("#newEnemyBtn");
      const start=document.querySelector("#autoBattleBtn");
      if(next) next.click();
      setTimeout(()=>{
        if(scene) setVerticalBackground("com",scene);
        if(start && !start.disabled) start.click();
      },180);
      return;
    }

    if(mode==="adventure"){
      const next=document.querySelector("#storyNextBtn");
      const retry=document.querySelector("#storyRetryBtn");
      const start=document.querySelector("#storyBattleBtn");
      if(next && !next.hidden){
        next.click();
        setTimeout(()=>{
          if(scene) setVerticalBackground("adventure",scene);
          if(start && !start.disabled) start.click();
        },220);
      }else if(retry){
        retry.click();
        setTimeout(()=>{
          if(scene) setVerticalBackground("adventure",scene);
          if(start && !start.disabled) start.click();
        },220);
      }
      return;
    }

    if(mode==="dungeon"){
      const next=document.querySelector("#nextFloorBtn");
      const start=document.querySelector("#dungeonAutoBattleBtn");
      if(next && !next.hidden){
        next.click();
        setTimeout(()=>{
          if(scene) setVerticalBackground("dungeon",scene);
          if(start && !start.disabled) start.click();
        },220);
      }
    }
  }

  function addPostBattleButtons(mode,scene){
    const dock=scene?.querySelector(".v2-control-dock");
    if(!dock) return;
    clearFinishButtons(scene);

    const next=document.createElement("button");
    next.className="v2-next";
    if(mode==="com") next.textContent="次の対戦";
    else if(mode==="adventure"){
      const n=document.querySelector("#storyNextBtn");
      next.textContent=(n && !n.hidden) ? "次のステージ" : "再戦";
    }else next.textContent="次の階へ";

    if(mode==="dungeon"){
      const n=document.querySelector("#nextFloorBtn");
      if(!n || n.hidden) next.disabled=true;
    }

    next.addEventListener("click",()=>continueToNext(mode));
    dock.appendChild(next);

    const finish=document.createElement("button");
    finish.className="v2-finish";
    finish.textContent="終了";
    finish.addEventListener("click",exitBattleView);
    dock.appendChild(finish);
  }

  function enterBattleView(mode){
    const cfg=modes[mode],scene=$(cfg.scene);
    if(!scene)return;
    currentMode=mode;currentScene=scene;
    clearFinishButtons(scene);
    document.body.classList.add("v2-battle-active");
    scene.classList.add("v2-immersive");
    createChrome(mode,scene);
    setVerticalBackground(mode,scene);
    syncSpeed(scene,"0.72");

    resultObserver?.disconnect();logObserver?.disconnect();
    const result=$(cfg.result);
    if(result){
      resultObserver=new MutationObserver(()=>{
        const txt=(result.textContent||"").trim();
        if(!txt)return;
        const dock=$(".v2-control-dock",scene);
        if(dock && !$(".v2-finish",dock)){
          addPostBattleButtons(mode,scene);
        }
      });
      resultObserver.observe(result,{childList:true,subtree:true,characterData:true});
    }
    const logSrc=$(cfg.log);
    if(logSrc){
      logObserver=new MutationObserver(()=>copyLog(mode));
      logObserver.observe(logSrc,{childList:true,subtree:true,characterData:true});
    }
  }
  function exitBattleView(){
    currentScene?.classList.remove("v2-immersive");
    document.body.classList.remove("v2-battle-active");
    resultObserver?.disconnect();logObserver?.disconnect();
    currentMode=null;currentScene=null;
  }
  function wireBattleButtons(){
    Object.entries(modes).forEach(([mode,cfg])=>{
      const btn=$(cfg.start);
      if(!btn||btn.dataset.v2wired)return;
      btn.dataset.v2wired="1";
      btn.addEventListener("click",()=>setTimeout(()=>enterBattleView(mode),70));
    });
  }
  function addArtLibrary(){
    const dex=$("#dex");
    if(!dex||$("#v2ArtLibrary"))return;
    const species=[
      ["rabi","ラビ"],["dragon","ドラゴン"],["beast","ビースト"],["bird","バード"],
      ["ghost","ゴースト"],["machine","マシン"],["knight","ナイト"],["slime","スライム"]
    ];
    const box=document.createElement("div");
    box.id="v2ArtLibrary";box.className="v2-art-library";
    box.innerHTML=`<div class="section-title">🎨 Art Library</div>
      <div class="muted">v2.0立ち絵コレクション。レア度ごとのアートを確認できます。</div>
      <div class="v2-art-grid"></div>`;
    const grid=$(".v2-art-grid",box);
    species.forEach(([key,name])=>{
      const card=document.createElement("div");
      card.className="v2-art-card";
      card.innerHTML=`<img src="assets/monsters/v19/legendary/${key}.png"
        onerror="this.onerror=null;this.src='assets/monsters/${key==='rabi'?'knight':key}.png'">
        <div class="name">${name}</div><div class="tier">LEGENDARY PREVIEW</div>`;
      grid.appendChild(card);
    });
    dex.appendChild(box);
  }
  window.addEventListener("load",()=>{
    wireBattleButtons();addArtLibrary();
    new MutationObserver(()=>wireBattleButtons()).observe(document.body,{childList:true,subtree:true});
  });
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&currentScene)exitBattleView()});
})();
