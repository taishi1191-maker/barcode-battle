
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
    rotate.innerHTML="📱↻<br>iPhoneを横向きにしてください";
    scene.appendChild(rotate);

    const top=document.createElement("div");
    top.className="v2-battle-topbar";
    top.innerHTML=`<span>${modes[mode].label}</span><span>AI AUTO</span>`;
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
  function enterBattleView(mode){
    const cfg=modes[mode],scene=$(cfg.scene);
    if(!scene)return;
    currentMode=mode;currentScene=scene;
    document.body.classList.add("v2-battle-active");
    scene.classList.add("v2-immersive");
    createChrome(mode,scene);
    syncSpeed(scene,"0.72");

    resultObserver?.disconnect();logObserver?.disconnect();
    const result=$(cfg.result);
    if(result){
      resultObserver=new MutationObserver(()=>{
        const txt=(result.textContent||"").trim();
        if(!txt)return;
        const dock=$(".v2-control-dock",scene);
        if(dock&&!$(".v2-finish",dock)){
          const b=document.createElement("button");
          b.className="v2-finish";b.textContent="戦闘終了";
          b.addEventListener("click",exitBattleView);dock.appendChild(b);
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
    $("#newEnemyBtn")?.addEventListener("click",exitBattleView);
    $("#storyNextBtn")?.addEventListener("click",exitBattleView);
    $("#nextFloorBtn")?.addEventListener("click",exitBattleView);
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
