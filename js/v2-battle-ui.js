
(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const modes={
    com:{start:"#autoBattleBtn",scene:"#battleScene",result:"#battleResult",log:"#battleLog",label:"COM BATTLE"},
    adventure:{start:"#storyBattleBtn",scene:"#storyBattleScene",result:"#storyResult",log:"#storyLog",label:"ADVENTURE"},
    dungeon:{start:"#dungeonAutoBattleBtn",scene:"#dungeonBattleScene",result:"#dungeonResult",log:"#dungeonLog",label:"∞ DUNGEON"}
  };

  let currentMode=null,currentScene=null,resultObserver=null,logObserver=null;
  let manualBusy=false;

  function runObj(mode){
    if(mode==="com") return typeof battle!=="undefined"?battle:null;
    if(mode==="adventure") return typeof storyRun!=="undefined"?storyRun:null;
    if(mode==="dungeon") return typeof dungeonRun!=="undefined"?dungeonRun:null;
    return null;
  }
  function renderMode(mode){
    if(mode==="com") updateBattleUI();
    else if(mode==="adventure") updateStoryUI();
    else if(mode==="dungeon") renderDungeonRun();
  }
  function logger(mode){
    if(mode==="com") return logBattle;
    if(mode==="adventure") return logStory;
    return logDungeon;
  }
  function targetId(mode,enemy=true){
    if(mode==="com") return enemy?"#eFighter":"#pFighter";
    if(mode==="adventure") return enemy?"#seFighter":"#spFighter";
    return enemy?"#deFighter":"#dpFighter";
  }
  function checkEnd(mode){
    if(mode==="com") return checkBattleEnd();
    if(mode==="adventure") return checkStoryEnd();
    return checkDungeonEnd();
  }
  function stopAuto(mode){
    const r=runObj(mode); if(!r)return;
    r.autoRunning=false;
    if(r.timer){clearTimeout(r.timer);r.timer=null}
    updateModeBadge(false);
  }
  function resumeAuto(mode){
    const r=runObj(mode);if(!r||r.over||r.readyForNext)return;
    updateModeBadge(true);
    if(mode==="com") startAutoBattle();
    else if(mode==="adventure") startStoryBattle();
    else startDungeonAutoBattle();
  }

  function updateModeBadge(auto){
    const b=currentScene?.querySelector(".v21-mode-badge");
    if(b)b.textContent=auto?"AUTO":"MANUAL";
    const ab=currentScene?.querySelector(".v21-auto");
    if(ab)ab.classList.toggle("on",auto);
  }

  function syncSpeed(scene,speed){
    const source=$(`.speed-btn[data-speed="${speed}"]`);
    if(source) source.click();
  }
  function copyLog(mode){
    const panel=currentScene?.querySelector(".v2-battle-log-panel");
    const src=$(modes[mode].log);
    if(panel&&src)panel.textContent=src.textContent||"戦闘ログはまだありません。";
  }

  function initBattleBag(){
    if(typeof state==="undefined")return;
    if(!state.battleBag)state.battleBag={potion:5,cleanse:3,power:3,barrier:3};
  }
  function itemDefs(){
    return {
      potion:{icon:"🧪",name:"回復薬",desc:"最大HPの35%回復"},
      cleanse:{icon:"✨",name:"浄化薬",desc:"状態異常をすべて解除"},
      power:{icon:"🔥",name:"力の薬",desc:"この戦闘中 攻撃+15%"},
      barrier:{icon:"🛡️",name:"バリア薬",desc:"最大HP25%分のバリア"}
    };
  }
  function useBattleItem(mode,key){
    initBattleBag();
    const r=runObj(mode),p=r?.player,def=itemDefs()[key];
    if(!r||!p||!def||manualBusy)return;
    if((state.battleBag[key]||0)<=0)return;
    stopAuto(mode);
    state.battleBag[key]--;
    const log=logger(mode);
    if(key==="potion"){
      const heal=Math.max(1,Math.round(p.maxHp*.35));
      p.currentHp=Math.min(p.maxHp,p.currentHp+heal);
      log(`${def.icon}${def.name}！ HPを${heal}回復`);
    }else if(key==="cleanse"){
      p.statuses={};log(`${def.icon}${def.name}！ 状態異常を解除`);
    }else if(key==="power"){
      if(!p._v21Power){p.atk=Math.round(p.atk*1.15);p._v21Power=true}
      log(`${def.icon}${def.name}！ 攻撃力アップ`);
    }else if(key==="barrier"){
      p.barrier=(p.barrier||0)+Math.round(p.maxHp*.25);
      log(`${def.icon}${def.name}！ バリア展開`);
    }
    if(typeof save==="function")save();
    renderMode(mode);closeSubmenu();refreshItemButton(mode);
    enemyOnlyTurn(mode);
  }

  function refreshItemButton(mode){
    initBattleBag();
    const b=currentScene?.querySelector(".v21-item");
    if(!b)return;
    const total=Object.values(state.battleBag||{}).reduce((a,v)=>a+(Number(v)||0),0);
    b.innerHTML=`🎒<br>ITEM <small>${total}</small>`;
  }

  function showItemMenu(mode){
    stopAuto(mode);closeSubmenu();initBattleBag();
    const sub=document.createElement("div");
    sub.className="v21-submenu";
    const defs=itemDefs();
    sub.innerHTML=`<h4>🎒 バトルアイテム</h4><div class="menu-grid">${
      Object.entries(defs).map(([k,v])=>`<button data-item="${k}" ${(state.battleBag[k]||0)<=0?"disabled":""}>
        ${v.icon} ${v.name} ×${state.battleBag[k]||0}<small>${v.desc}</small></button>`).join("")
    }</div>`;
    currentScene.appendChild(sub);
    $$("[data-item]",sub).forEach(b=>b.addEventListener("click",()=>useBattleItem(mode,b.dataset.item)));
  }
  function closeSubmenu(){currentScene?.querySelector(".v21-submenu")?.remove()}

  function playerAction(mode,action){
    const r=runObj(mode);if(!r||r.over||r.readyForNext||manualBusy)return;
    stopAuto(mode);closeSubmenu();manualBusy=true;
    const p=r.player,e=r.enemy,log=logger(mode);
    if(mode==="adventure"){
      r.turns=(r.turns||0)+1;
      if(action==="skill")r.usedSkill=true;
    }
    const eAction=chooseAiAction(e,p);
    const playerFirst=p.spd>=e.spd;

    const actP=()=>doAiAction(p,e,action,p.name,targetId(mode,true),log);
    const actE=()=>doAiAction(e,p,eAction,e.name,targetId(mode,false),log);

    const first=playerFirst?actP:actE;
    const second=playerFirst?actE:actP;

    first();renderMode(mode);
    if(checkEnd(mode)){manualBusy=false;return}
    setTimeout(()=>{
      second();renderMode(mode);
      checkEnd(mode);manualBusy=false;
    },Math.round(520/(typeof battleSpeed!=="undefined"?battleSpeed:1)));
  }
  function enemyOnlyTurn(mode){
    const r=runObj(mode);if(!r||r.over||r.readyForNext||manualBusy)return;
    manualBusy=true;
    const e=r.enemy,p=r.player,log=logger(mode),a=chooseAiAction(e,p);
    setTimeout(()=>{
      doAiAction(e,p,a,e.name,targetId(mode,false),log);
      renderMode(mode);checkEnd(mode);manualBusy=false;
    },340);
  }

  function showSkillMenu(mode){
    stopAuto(mode);closeSubmenu();
    const r=runObj(mode),p=r?.player;if(!p)return;
    const sub=document.createElement("div");
    sub.className="v21-submenu";
    const passives=(p.skills||[]).slice(0,4);
    sub.innerHTML=`<h4>✨ 特殊攻撃</h4>
      <div class="menu-grid">
        <button data-special="1">✨ ${typeof activeBattleSkillName==="function"?activeBattleSkillName(p):"特殊攻撃"}
          <small>威力1.28倍。下記の特殊能力とシナジー</small></button>
        ${passives.map(x=>`<button disabled>${x.name}<small>${x.desc||x.tag||"パッシブ能力"}</small></button>`).join("")}
      </div>`;
    currentScene.appendChild(sub);
    $("[data-special]",sub)?.addEventListener("click",()=>playerAction(mode,"skill"));
  }

  function createActionPanel(mode,scene){
    scene.querySelector(".v21-action-panel")?.remove();
    scene.querySelector(".v21-mode-badge")?.remove();

    const badge=document.createElement("div");
    badge.className="v21-mode-badge";badge.textContent="AUTO";
    scene.appendChild(badge);

    const panel=document.createElement("div");
    panel.className="v21-action-panel";
    panel.innerHTML=`
      <button class="v21-attack primary">⚔<br>攻撃</button>
      <button class="v21-skill special">✨<br>スキル</button>
      <button class="v21-guard">🛡<br>防御</button>
      <button class="v21-item item">🎒<br>ITEM</button>
      <button class="v21-auto auto on">▶<br>AUTO</button>`;
    scene.appendChild(panel);

    $(".v21-attack",panel).addEventListener("click",()=>playerAction(mode,"attack"));
    $(".v21-skill",panel).addEventListener("click",()=>showSkillMenu(mode));
    $(".v21-guard",panel).addEventListener("click",()=>playerAction(mode,"guard"));
    $(".v21-item",panel).addEventListener("click",()=>showItemMenu(mode));
    $(".v21-auto",panel).addEventListener("click",()=>{
      const r=runObj(mode);if(!r)return;
      closeSubmenu();
      if(r.autoRunning)stopAuto(mode);else resumeAuto(mode);
    });
    refreshItemButton(mode);
  }

  function setVerticalBackground(mode,scene){
    const map={
      com:"assets/backgrounds/vertical/arena_vertical.jpg",
      adventure:"assets/backgrounds/vertical/grassland_vertical.jpg",
      dungeon:"assets/backgrounds/vertical/ruins_vertical.jpg"
    };
    scene.style.backgroundImage=`linear-gradient(rgba(2,8,16,.04),rgba(2,8,16,.12)),url("${map[mode]||map.com}")`;
  }

  function clearFinishButtons(scene){
    scene?.querySelectorAll(".v2-finish,.v2-next").forEach(x=>x.remove());
  }
  function addPostBattleButtons(mode,scene){
    const panel=scene?.querySelector(".v21-action-panel");if(!panel)return;
    panel.innerHTML="";
    const next=document.createElement("button");
    next.className="v2-next";
    next.style.gridColumn="span 3";
    next.textContent=mode==="com"?"次の対戦":mode==="adventure"?"次のステージ":"次の階へ";
    if(mode==="dungeon"){
      const n=$("#nextFloorBtn");if(!n||n.hidden)next.disabled=true;
    }
    next.addEventListener("click",()=>continueToNext(mode));
    const finish=document.createElement("button");
    finish.className="v2-finish";finish.style.gridColumn="span 2";finish.textContent="終了";
    finish.addEventListener("click",exitBattleView);
    panel.append(next,finish);
  }

  function continueToNext(mode){
    const scene=currentScene;
    closeSubmenu();
    if(mode==="com"){
      $("#newEnemyBtn")?.click();
      setTimeout(()=>{createActionPanel(mode,scene);$("#autoBattleBtn")?.click()},180);
    }else if(mode==="adventure"){
      const n=$("#storyNextBtn"),retry=$("#storyRetryBtn");
      if(n&&!n.hidden)n.click();else retry?.click();
      setTimeout(()=>{createActionPanel(mode,scene);$("#storyBattleBtn")?.click()},220);
    }else{
      const n=$("#nextFloorBtn");
      if(n&&!n.hidden)n.click();
      setTimeout(()=>{createActionPanel(mode,scene);$("#dungeonAutoBattleBtn")?.click()},220);
    }
  }

  function copyLog(mode){
    const panel=currentScene?.querySelector(".v2-battle-log-panel");
    const src=$(modes[mode].log);
    if(panel&&src)panel.textContent=src.textContent||"戦闘ログはまだありません。";
  }
  function createChrome(mode,scene){
    if(scene.querySelector(".v2-battle-log-panel"))return;
    const top=document.createElement("div");
    top.className="v2-battle-topbar";top.innerHTML=`<span>${modes[mode].label}</span><span>v2.1</span>`;
    scene.appendChild(top);
    const log=document.createElement("div");
    log.className="v2-battle-log-panel";log.textContent="戦闘ログ";scene.appendChild(log);
    log.addEventListener("click",()=>log.classList.remove("open"));
  }

  function enterBattleView(mode){
    const cfg=modes[mode],scene=$(cfg.scene);if(!scene)return;
    currentMode=mode;currentScene=scene;manualBusy=false;
    initBattleBag();
    document.body.classList.add("v2-battle-active");
    scene.classList.add("v2-immersive");
    createChrome(mode,scene);createActionPanel(mode,scene);setVerticalBackground(mode,scene);
    resultObserver?.disconnect();logObserver?.disconnect();
    const result=$(cfg.result);
    if(result){
      resultObserver=new MutationObserver(()=>{
        if((result.textContent||"").trim())addPostBattleButtons(mode,scene);
      });
      resultObserver.observe(result,{childList:true,subtree:true,characterData:true});
    }
    const src=$(cfg.log);
    if(src){
      logObserver=new MutationObserver(()=>copyLog(mode));
      logObserver.observe(src,{childList:true,subtree:true,characterData:true});
    }
  }
  function exitBattleView(){
    closeSubmenu();
    currentScene?.classList.remove("v2-immersive");
    currentScene?.querySelector(".v21-action-panel")?.remove();
    currentScene?.querySelector(".v21-mode-badge")?.remove();
    document.body.classList.remove("v2-battle-active");
    resultObserver?.disconnect();logObserver?.disconnect();
    currentMode=null;currentScene=null;manualBusy=false;
  }

  function wire(){
    Object.entries(modes).forEach(([mode,cfg])=>{
      const b=$(cfg.start);if(!b||b.dataset.v21wired)return;
      b.dataset.v21wired="1";
      b.addEventListener("click",()=>setTimeout(()=>enterBattleView(mode),70));
    });
  }
  window.addEventListener("load",()=>{
    initBattleBag();wire();
    new MutationObserver(wire).observe(document.body,{childList:true,subtree:true});
  });
})();
