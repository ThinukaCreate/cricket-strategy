// 2D Cricket Field Strategy Animator - Universal Cloud Master State Synchronizer (PIN: 1996 Admin | 0000 Viewer)

// Polyfill CanvasRenderingContext2D.prototype.roundRect for older Desktop & Mobile browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radii) {
    let r = typeof radii === "number" ? radii : 6;
    if (r > width / 2) r = width / 2;
    if (r > height / 2) r = height / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + width, y, x + width, y + height, r);
    this.arcTo(x + width, y + height, x, y + height, r);
    this.arcTo(x, y + height, x, y, r);
    this.arcTo(x, y, x + width, y, r);
    this.closePath();
    return this;
  };
}

const DEFAULT_SCENARIOS = {
  s1: {
    id: 1,
    title: "1) Scenario 1 - Power Play (Bowling Down)",
    phase: "Power Play",
    maxOutfield: 2,
    bowler: "KN",
    bowlerPos: { x: 0, y: -60 },
    bowlerDir: "down",
    wk: { name: "WK", pos: { x: 0, y: 70 } },
    notes: [
      "Lefty Rule: Position adjustments apply only when Captain drags fielders.",
      "Outgoing bowler covers position of the next bowler."
    ],
    players: [
      { name: "Sandeepa", role: "Long on", pos: { x: 0, y: -260 }, defaultPos: { x: 0, y: -260 } },
      { name: "Shirly", role: "Mid on", pos: { x: -45, y: -110 }, defaultPos: { x: -45, y: -110 } },
      { name: "Wycliff", role: "Mid off", pos: { x: 55, y: -110 }, defaultPos: { x: 55, y: -110 } },
      { name: "Ali R", role: "Mid W", pos: { x: -110, y: -45 }, defaultPos: { x: -110, y: -45 } },
      { name: "Deepal", role: "Cover", pos: { x: 110, y: 0 }, defaultPos: { x: 110, y: 0 } },
      { name: "Chathura", role: "Deep leg", pos: { x: -260, y: 20 }, defaultPos: { x: -260, y: 20 } },
      { name: "Rimash", role: "SQL", pos: { x: -110, y: 70 }, defaultPos: { x: -110, y: 70 } },
      { name: "Isuru", role: "Point", pos: { x: 110, y: 70 }, defaultPos: { x: 110, y: 70 } },
      { name: "Achala", role: "Gully", pos: { x: 65, y: 115 }, defaultPos: { x: 65, y: 115 } }
    ]
  }
};

class CricketAnimator {
  constructor() {
    this.canvas = document.getElementById("fieldCanvas");
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.currentScenarioKey = "s1";
    this.isLefty = false;
    
    // Smooth 0.25x Speed Transition
    this.animSpeed = 0.025; 

    this.selectedPlayer = null;
    this.hoveredPlayer = null;

    this.isDragging = false;
    this.draggedEntity = null;
    this.ruleWarningText = null;

    this.isRemoteUpdate = false;
    this.broadcastTimer = null;
    this.syncVersion = 0;
    this.lastSyncVersion = 0;

    // Role state: 'admin' (PIN 1996) or 'viewer' (PIN 0000)
    this.userRole = sessionStorage.getItem("cricket_user_role") || "viewer";

    this.scenarios = this.loadScenariosFromStorage() || JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));

    if (!this.scenarios[this.currentScenarioKey]) {
      this.currentScenarioKey = Object.keys(this.scenarios)[0] || "s1";
    }

    this.activePlayers = [];
    this.activeBowler = { name: "KN", x: 0, y: -60, targetX: 0, targetY: -60 };
    this.activeWK = { name: "WK", x: 0, y: 70, targetX: 0, targetY: 70 };
    this.bowlerDir = "down";

    this.initPinLock();
    this.initCanvas();
    this.initScenarios();
    this.initRealtimeStreamSync();
    this.bindEvents();
    this.updateRoleUI();
    this.updateScenarioUI();
    this.requestFrame();
  }

  initRealtimeStreamSync() {
    this.syncChannel = "cricket_strategy_live_sync_2026";
    this.sseUrl = `https://ntfy.sh/${this.syncChannel}/sse`;
    this.pubUrl = `https://ntfy.sh/${this.syncChannel}`;

    // 1) Local BroadcastChannel & Storage Sync (Instant same-device/browser sync)
    try {
      this.bc = new BroadcastChannel("cricket_strategy_bc_channel");
      this.bc.onmessage = (event) => {
        if (event.data) {
          this.applySnapshotData(event.data);
        }
      };
    } catch (e) {}

    window.addEventListener("storage", (e) => {
      if (e.key === "cricket_live_broadcast_state" && e.newValue) {
        try {
          const val = JSON.parse(e.newValue);
          this.applySnapshotData(val);
        } catch (err) {}
      }
    });

    // 2) Firebase Cloud Realtime Database Initialization (Cloud Master State)
    const firebaseConfig = {
      databaseURL: "https://cricket-9854b-default-rtdb.firebaseio.com"
    };

    if (window.firebase && !window.firebase.apps.length) {
      try {
        window.firebase.initializeApp(firebaseConfig);
        this.dbRef = window.firebase.database().ref("live_sync");

        // Immediately fetch Master State on startup across all browsers & devices!
        this.dbRef.once("value", (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.applySnapshotData(val, true);
          }
        });

        // Listen for all live updates
        this.dbRef.on("value", (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.applySnapshotData(val);
          }
        });
      } catch (err) {
        console.warn("Firebase sync init fallback:", err);
      }
    }

    // 3) Primary SSE Stream Listener
    try {
      this.eventSource = new EventSource(this.sseUrl);
      this.eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.message) {
            const val = JSON.parse(parsed.message);
            this.applySnapshotData(val);
          }
        } catch (err) {}
      };
    } catch (e) {}

    // Initial Cloud Fetch & Polling Fallback (1.0s)
    this.fetchCloudState();
    setInterval(() => {
      if (!this.isDragging) {
        this.fetchCloudState();
      }
    }, 1000);
  }

  fetchCloudState() {
    fetch(`https://ntfy.sh/${this.syncChannel}/json?poll=1`)
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split("\n");
        for (let i = lines.length - 1; i >= 0; i--) {
          try {
            const parsed = JSON.parse(lines[i]);
            if (parsed && parsed.message) {
              const val = JSON.parse(parsed.message);
              this.applySnapshotData(val);
              break;
            }
          } catch (e) {}
        }
      })
      .catch(() => {});
  }

  updateStanceBtnUI() {
    const leftyToggleBtn = document.getElementById("leftyToggleBtn");
    const stanceText = document.getElementById("stanceText");
    if (stanceText) {
      stanceText.textContent = this.isLefty ? "LHB" : "RHB";
    }
    if (leftyToggleBtn) {
      if (this.isLefty) {
        leftyToggleBtn.classList.add("lhb-active");
        leftyToggleBtn.title = "🏏 Batsman: Left Handed (LHB) - Tap to switch to RHB";
      } else {
        leftyToggleBtn.classList.remove("lhb-active");
        leftyToggleBtn.title = "🏏 Batsman: Right Handed (RHB) - Tap to switch to LHB";
      }
    }
  }

  applySnapshotData(val, forceInit = false) {
    if (!val || typeof val !== "object") return;
    
    // Incremental Sync Version Check (Independent of Phone Clock Differences!)
    if (!forceInit && val.syncVersion) {
      if (this.lastSyncVersion && val.syncVersion <= this.lastSyncVersion) {
        return;
      }
    }

    if (val.syncVersion) {
      this.lastSyncVersion = val.syncVersion;
    }

    this.isRemoteUpdate = true;

    if (val.scenarios && typeof val.scenarios === "object") {
      this.scenarios = val.scenarios;
      try {
        localStorage.setItem("cricket_scenarios_v1", JSON.stringify(this.scenarios));
      } catch (e) {}
    }

    if (val.currentKey && this.scenarios[val.currentKey]) {
      this.currentScenarioKey = val.currentKey;
    }

    if (typeof val.isLefty === "boolean") {
      this.isLefty = val.isLefty;
      this.updateStanceBtnUI();
    }

    this.updateTargets();
    this.updateScenarioUI();
    this.isRemoteUpdate = false;
  }

  broadcastLiveState() {
    if (this.isRemoteUpdate || this.userRole === "viewer") return;

    this.syncVersion = (this.syncVersion || 0) + 1;

    const payload = {
      scenarios: this.scenarios,
      currentKey: this.currentScenarioKey,
      isLefty: this.isLefty,
      syncVersion: this.syncVersion,
      updatedAt: Date.now()
    };

    // 1) Local Broadcast (Tab-to-tab / window-to-window)
    try {
      if (this.bc) this.bc.postMessage(payload);
      localStorage.setItem("cricket_live_broadcast_state", JSON.stringify(payload));
    } catch (e) {}

    // 2) Firebase Cloud Realtime Push
    try {
      if (this.dbRef) {
        this.dbRef.set(payload);
      }
    } catch (e) {}

    // 3) HTTP SSE Cloud Broadcast
    if (this.broadcastTimer) clearTimeout(this.broadcastTimer);
    this.broadcastTimer = setTimeout(() => {
      fetch(this.pubUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }, 30);
  }

  initPinLock() {
    const overlay = document.getElementById("pinLockOverlay");
    const pinInput = document.getElementById("pinInput");
    const submitBtn = document.getElementById("pinSubmitBtn");
    const errorMsg = document.getElementById("pinErrorMsg");

    if (sessionStorage.getItem("cricket_pin_unlocked") === "true") {
      if (overlay) overlay.style.display = "none";
      return;
    }

    if (overlay) {
      overlay.style.display = "flex";
      overlay.classList.remove("unlocked");
    }

    const checkPin = () => {
      const entered = pinInput.value.trim();
      if (entered === "1996") {
        this.userRole = "admin";
        sessionStorage.setItem("cricket_pin_unlocked", "true");
        sessionStorage.setItem("cricket_user_role", "admin");
        this.unlockOverlay(overlay);
      } else if (entered === "0000") {
        this.userRole = "viewer";
        sessionStorage.setItem("cricket_pin_unlocked", "true");
        sessionStorage.setItem("cricket_user_role", "viewer");
        this.unlockOverlay(overlay);
      } else {
        if (errorMsg) errorMsg.style.display = "block";
        pinInput.value = "";
        pinInput.focus();

        const card = document.querySelector(".pin-card");
        if (card) {
          card.style.transform = "translateX(-10px)";
          setTimeout(() => card.style.transform = "translateX(10px)", 80);
          setTimeout(() => card.style.transform = "translateX(-6px)", 160);
          setTimeout(() => card.style.transform = "translateX(0)", 240);
        }
      }
    };

    if (submitBtn) submitBtn.onclick = checkPin;
    if (pinInput) {
      pinInput.onkeyup = (e) => {
        if (e.key === "Enter" || pinInput.value.length === 4) {
          checkPin();
        }
      };
    }
  }

  unlockOverlay(overlay) {
    if (overlay) {
      overlay.classList.add("unlocked");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 350);
    }
    this.updateRoleUI();
    this.updateScenarioUI();
  }

  switchRole() {
    sessionStorage.removeItem("cricket_pin_unlocked");
    sessionStorage.removeItem("cricket_user_role");
    const overlay = document.getElementById("pinLockOverlay");
    const pinInput = document.getElementById("pinInput");
    const errorMsg = document.getElementById("pinErrorMsg");
    if (pinInput) pinInput.value = "";
    if (errorMsg) errorMsg.style.display = "none";
    if (overlay) {
      overlay.style.display = "flex";
      overlay.classList.remove("unlocked");
      if (pinInput) pinInput.focus();
    }
  }

  // Update Role Access & Navigation UI (Hides single tab bar for Viewers!)
  updateRoleUI() {
    const roleBadge = document.getElementById("roleBadge");
    const roleBadgeText = document.getElementById("roleBadgeText");
    const scenarioAdminControls = document.getElementById("scenarioAdminControls");
    const addPlayerSection = document.getElementById("addPlayerSection");
    const sidebarNavTabs = document.querySelector(".sidebar-nav-tabs");
    const tabFieldersBtn = document.getElementById("tabFieldersBtn");
    const tabOptionsBtn = document.getElementById("tabOptionsBtn");
    const tabOptions = document.getElementById("tabOptions");
    const tabFielders = document.getElementById("tabFielders");

    if (this.userRole === "admin") {
      if (roleBadge) {
        roleBadge.className = "badge";
        roleBadge.title = "👑 Captain Admin Mode (Full Access)";
      }
      if (roleBadgeText) roleBadgeText.textContent = "👑";
      if (sidebarNavTabs) sidebarNavTabs.style.display = "flex";
      if (scenarioAdminControls) scenarioAdminControls.style.display = "flex";
      if (addPlayerSection) addPlayerSection.style.display = "flex";
      if (tabFieldersBtn) tabFieldersBtn.style.display = "flex";
    } else {
      if (roleBadge) {
        roleBadge.className = "badge viewer-badge";
        roleBadge.title = "👁️ Viewer Mode (Read Only)";
      }
      if (roleBadgeText) roleBadgeText.textContent = "👁️";
      if (sidebarNavTabs) sidebarNavTabs.style.display = "none"; // Hide tab bar completely for Viewers!
      if (scenarioAdminControls) scenarioAdminControls.style.display = "none";
      if (addPlayerSection) addPlayerSection.style.display = "none";

      if (tabOptionsBtn) tabOptionsBtn.classList.add("active");
      if (tabOptions) tabOptions.classList.add("active");
      if (tabFielders) tabFielders.classList.remove("active");
    }

    this.updateStanceBtnUI();
  }

  loadScenariosFromStorage() {
    try {
      const saved = localStorage.getItem("cricket_scenarios_v1");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveScenariosToStorage() {
    if (this.userRole === "viewer") return;
    try {
      localStorage.setItem("cricket_scenarios_v1", JSON.stringify(this.scenarios));
      this.broadcastLiveState();
    } catch (e) {
      console.error(e);
    }
  }

  initCanvas() {
    const isMobile = window.innerWidth <= 900;
    let availableSize = 600;

    if (isMobile) {
      const w = window.innerWidth - 24;
      const h = window.innerHeight * 0.55;
      availableSize = Math.min(w, h);
    } else {
      const stage = document.querySelector(".stage-section");
      const stageW = stage ? (stage.clientWidth - 40) : (window.innerWidth - 380);
      const stageH = window.innerHeight - 80;
      availableSize = Math.min(stageW, stageH);
    }

    this.displaySize = Math.max(320, availableSize || 600);

    this.canvas.width = 1800;
    this.canvas.height = 1800;

    this.canvas.style.width = `${this.displaySize}px`;
    this.canvas.style.height = `${this.displaySize}px`;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  }

  setScenarioBowler(sc, newBowlerName) {
    const oldBowlerName = sc.bowler || "Bowler";
    if (oldBowlerName === newBowlerName) return;

    const fielderIdx = sc.players.findIndex(p => p.name === newBowlerName);
    if (fielderIdx !== -1) {
      sc.players[fielderIdx].name = oldBowlerName;
    }

    sc.bowler = newBowlerName;
  }

  initScenarios() {
    const sc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
    this.bowlerDir = sc.bowlerDir || "down";
    const bowlerY = this.bowlerDir === "down" ? -60 : 60;
    const wkY = this.bowlerDir === "down" ? 70 : -70;

    this.activeBowler = { name: sc.bowler, x: 0, y: bowlerY, targetX: 0, targetY: bowlerY };
    this.activeWK = { name: sc.wk.name, x: 0, y: wkY, targetX: 0, targetY: wkY };

    this.activePlayers = sc.players.map(p => {
      const target = this.calculateTargetPos(p);
      const roleName = this.calculateCricketPositionName(target.x, target.y);
      return {
        name: p.name,
        role: roleName,
        x: target.x,
        y: target.y,
        targetX: target.x,
        targetY: target.y,
        data: p
      };
    });
  }

  calculateTargetPos(playerData) {
    if (this.isLefty) {
      if (playerData.leftyPos) return playerData.leftyPos;
      return playerData.pos || playerData.defaultPos;
    }
    return playerData.pos || playerData.defaultPos;
  }

  calculateCricketPositionName(x, y) {
    const strikerY = this.bowlerDir === "down" ? 40 : -40;
    const relX = x;
    const relY = y - strikerY;

    const distFromPitch = Math.hypot(relX, relY);
    const isDeep = distFromPitch > 142;

    let angleRad = Math.atan2(relX, (this.bowlerDir === "down" ? -relY : relY));
    let angleDeg = angleRad * (180 / Math.PI);

    if (this.isLefty) {
      angleDeg = -angleDeg;
    }

    const absAngle = Math.abs(angleDeg);

    if (absAngle < 20) {
      if (angleDeg >= 0) return isDeep ? "Long off" : "Mid off";
      return isDeep ? "Long on" : "Mid on";
    } else if (angleDeg >= 20 && angleDeg < 65) {
      return isDeep ? "Deep Extra Cover" : "Cover";
    } else if (angleDeg >= 65 && angleDeg < 110) {
      return isDeep ? "Deep Point" : "Point";
    } else if (angleDeg >= 110 && angleDeg < 145) {
      return isDeep ? "Third Man" : "Gully";
    } else if (angleDeg >= 145 && angleDeg <= 180) {
      return isDeep ? "Third Man" : "Slip";
    } else if (angleDeg < -20 && angleDeg >= -65) {
      return isDeep ? "Deep Mid-Wicket" : "Mid W";
    } else if (angleDeg < -65 && angleDeg >= -110) {
      return isDeep ? "Deep Square Leg" : "Square Leg";
    } else if (angleDeg < -110 && angleDeg >= -150) {
      return isDeep ? "Deep Fine Leg" : "SQL";
    } else {
      return isDeep ? "Deep Fine Leg" : "Leg Slip";
    }
  }

  populateBowlerDropdown(targetElement, selectedName) {
    if (!targetElement) return;

    const playerNames = this.activePlayers.map(p => p.name);
    if (selectedName && !playerNames.includes(selectedName)) {
      playerNames.unshift(selectedName);
    }
    const standardBowlers = ["KN", "B2", "Wycliff", "Deepal", "Shirly", "Sandeepa", "Ali", "Chathura", "Rimash", "Isuru", "Achala", "Krish"];
    standardBowlers.forEach(b => {
      if (!playerNames.includes(b)) playerNames.push(b);
    });

    targetElement.innerHTML = "";
    playerNames.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (name === selectedName) opt.selected = true;
      targetElement.appendChild(opt);
    });
  }

  switchScenario(key) {
    this.currentScenarioKey = key;
    this.updateTargets();
    this.updateScenarioUI();
    this.broadcastLiveState();
  }

  duplicateCurrentScenario() {
    if (this.userRole === "viewer") return;

    const currentSc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
    const newKey = `custom_${Date.now()}`;
    const newCount = Object.keys(this.scenarios).length + 1;

    const clonedPlayers = currentSc.players.map(p => {
      return {
        name: p.name,
        role: p.role,
        pos: p.pos ? { ...p.pos } : { ...p.defaultPos },
        defaultPos: p.defaultPos ? { ...p.defaultPos } : { x: 0, y: 0 },
        leftyPos: p.leftyPos ? { ...p.leftyPos } : undefined
      };
    });

    this.scenarios[newKey] = {
      id: newCount,
      title: `${newCount}) Scenario ${newCount}`,
      phase: currentSc.phase || "Power Play",
      maxOutfield: currentSc.maxOutfield || 2,
      bowler: currentSc.bowler || "Bowler",
      bowlerPos: { ...currentSc.bowlerPos },
      bowlerDir: currentSc.bowlerDir || "down",
      wk: { name: currentSc.wk.name, pos: { ...currentSc.wk.pos } },
      notes: [...(currentSc.notes || ["Copied scenario tactic."])],
      isCustom: true,
      players: clonedPlayers
    };

    this.saveScenariosToStorage();
    this.switchScenario(newKey);
  }

  openScenarioEditor(key = null) {
    if (this.userRole === "viewer") return;

    const form = document.getElementById("customScenarioForm");
    const editingKeyInput = document.getElementById("editingScenarioKey");
    const formTitle = document.getElementById("formTitleText");
    const scNameInput = document.getElementById("scNameInput");
    const scPhaseInput = document.getElementById("scPhaseInput");
    const scBowlerInput = document.getElementById("scBowlerInput");
    const scDirInput = document.getElementById("scDirInput");
    const scNoteInput = document.getElementById("scNoteInput");

    if (key && this.scenarios[key]) {
      const item = this.scenarios[key];
      editingKeyInput.value = key;
      if (formTitle) formTitle.textContent = `⚙️ Edit Settings: ${item.title}`;
      if (scNameInput) scNameInput.value = item.title;
      if (scPhaseInput) scPhaseInput.value = item.phase || "Power Play";
      if (scDirInput) scDirInput.value = item.bowlerDir || "down";
      if (scNoteInput) scNoteInput.value = (item.notes && item.notes[0]) ? item.notes[0] : "";
      
      this.populateBowlerDropdown(scBowlerInput, item.bowler);
    } else {
      editingKeyInput.value = "";
      if (formTitle) formTitle.textContent = "✨ Create New Scenario";
      if (scNameInput) scNameInput.value = "";
      if (scPhaseInput) scPhaseInput.value = "Power Play";
      if (scDirInput) scDirInput.value = "down";
      if (scNoteInput) scNoteInput.value = "";

      const currentSc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
      this.populateBowlerDropdown(scBowlerInput, currentSc ? currentSc.bowler : "KN");
    }

    if (form) form.style.display = "flex";
  }

  saveScenarioForm() {
    if (this.userRole === "viewer") return;

    const editingKey = document.getElementById("editingScenarioKey").value;
    const title = document.getElementById("scNameInput").value.trim();
    const phase = document.getElementById("scPhaseInput").value;
    const bowler = document.getElementById("scBowlerInput").value;
    const dir = document.getElementById("scDirInput").value;
    const note = document.getElementById("scNoteInput").value.trim();

    const maxOutfield = phase.includes("Power Play") ? 2 : 5;
    const bowlerY = dir === "down" ? -60 : 60;
    const wkY = dir === "down" ? 70 : -70;

    if (editingKey && this.scenarios[editingKey]) {
      const item = this.scenarios[editingKey];
      if (title) item.title = title;
      item.phase = phase;
      item.maxOutfield = maxOutfield;
      
      this.setScenarioBowler(item, bowler);

      item.bowlerDir = dir;
      item.bowlerPos = { x: 0, y: bowlerY };
      item.wk.pos = { x: 0, y: wkY };
      item.notes = [note || "Custom scenario settings updated."];

      this.saveScenariosToStorage();
      if (editingKey === this.currentScenarioKey) {
        this.switchScenario(editingKey);
      } else {
        this.updateScenarioUI();
      }
    } else {
      const key = `custom_${Date.now()}`;
      const currentSc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
      const clonedPlayers = currentSc.players.map(p => {
        return {
          name: p.name,
          role: p.role,
          pos: p.pos ? { ...p.pos } : { ...p.defaultPos },
          defaultPos: p.defaultPos ? { ...p.defaultPos } : { x: 0, y: 0 },
          leftyPos: p.leftyPos ? { ...p.leftyPos } : undefined
        };
      });

      const newCount = Object.keys(this.scenarios).length + 1;

      const newSc = {
        id: newCount,
        title: title ? `${newCount}) ${title}` : `${newCount}) Scenario ${newCount}`,
        phase: phase,
        maxOutfield: maxOutfield,
        bowler: bowler || "Bowler",
        bowlerPos: { x: 0, y: bowlerY },
        bowlerDir: dir,
        wk: { name: "WK", pos: { x: 0, y: wkY } },
        notes: [note || "Custom tactics created by Captain."],
        isCustom: true,
        players: clonedPlayers
      };

      this.setScenarioBowler(newSc, bowler);
      this.scenarios[key] = newSc;

      this.saveScenariosToStorage();
      this.switchScenario(key);
    }

    const form = document.getElementById("customScenarioForm");
    if (form) form.style.display = "none";
  }

  deleteCustomScenario(key) {
    if (this.userRole === "viewer") return;
    if (this.scenarios[key]) {
      delete this.scenarios[key];
      const remainingKeys = Object.keys(this.scenarios);
      this.saveScenariosToStorage();
      this.switchScenario(remainingKeys[0] || "s1");
    }
  }

  updateTargets() {
    const sc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
    if (!sc) return;

    this.bowlerDir = sc.bowlerDir || "down";
    const bowlerY = this.bowlerDir === "down" ? -60 : 60;
    const wkY = this.bowlerDir === "down" ? 70 : -70;

    this.activeBowler.name = sc.bowler || "Bowler";
    this.activeBowler.targetX = 0;
    this.activeBowler.targetY = bowlerY;

    this.activeWK.name = (sc.wk && sc.wk.name) ? sc.wk.name : "WK";
    this.activeWK.targetX = 0;
    this.activeWK.targetY = wkY;

    this.activePlayers = sc.players.map(p => {
      const target = this.calculateTargetPos(p);
      const roleName = this.calculateCricketPositionName(target.x, target.y);
      let existing = this.activePlayers.find(ap => ap.name === p.name);
      if (existing) {
        existing.name = p.name;
        existing.role = roleName;
        existing.targetX = target.x;
        existing.targetY = target.y;
        existing.data = p;
        return existing;
      } else {
        return {
          name: p.name,
          role: roleName,
          x: target.x,
          y: target.y,
          targetX: target.x,
          targetY: target.y,
          data: p
        };
      }
    });
  }

  updateScenarioUI() {
    const sc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
    const isAdmin = (this.userRole === "admin");
    
    const gridContainer = document.getElementById("scenarioGrid");
    if (gridContainer) {
      gridContainer.innerHTML = "";
      Object.keys(this.scenarios).forEach(key => {
        const item = this.scenarios[key];
        const btn = document.createElement("div");
        btn.className = `sc-btn ${key === this.currentScenarioKey ? 'active' : ''}`;
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "space-between";
        
        btn.innerHTML = `
          <span style="white-space:normal; word-break:break-word; flex:1; padding-right:0.4rem;">${item.title}</span>
          ${isAdmin ? `
            <div style="display:flex; gap:0.2rem; align-items:center;">
              <button class="btn-icon-small" data-edit="${key}" title="Edit Scenario Settings" style="color:var(--accent-sky); font-size:0.75rem;">⚙️ Edit</button>
              ${Object.keys(this.scenarios).length > 1 ? `<button class="btn-icon-small" data-del="${key}" title="Delete Scenario" style="color:#fb7185; font-size:0.75rem;">🗑️</button>` : ''}
            </div>
          ` : ''}
        `;

        btn.onclick = (e) => {
          if (e.target.dataset.edit) {
            e.stopPropagation();
            this.openScenarioEditor(key);
            return;
          }
          if (e.target.dataset.del) {
            e.stopPropagation();
            if (confirm(`Delete scenario "${item.title}"?`)) {
              this.deleteCustomScenario(key);
            }
            return;
          }
          this.switchScenario(key);
        };

        gridContainer.appendChild(btn);
      });
    }

    const editableRoster = document.getElementById("editableRosterList");
    const countLabel = document.getElementById("fielderCountLabel");
    if (countLabel) countLabel.textContent = `${this.activePlayers.length} Active Fielders ${!isAdmin ? '(Read Only)' : ''}`;

    if (editableRoster) {
      editableRoster.innerHTML = "";
      this.activePlayers.forEach((p, idx) => {
        const row = document.createElement("div");
        row.className = "fielder-edit-row";
        row.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span style="color:var(--text-muted); font-size:0.7rem; font-weight:700;">#${idx+1}</span>
            <input type="text" class="fielder-edit-input" value="${p.name}" data-index="${idx}" ${!isAdmin ? 'disabled style="opacity:0.7;"' : ''}>
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span class="fielder-role-badge">${p.role}</span>
            ${isAdmin ? `<button class="btn-icon-small" data-remove="${p.name}">🗑️</button>` : ''}
          </div>
        `;

        if (isAdmin) {
          const nameInput = row.querySelector(".fielder-edit-input");
          nameInput.onchange = (evt) => {
            const newName = evt.target.value.trim();
            if (newName) {
              const oldName = p.name;
              p.name = newName;
              p.data.name = newName;
              if (this.selectedPlayer === oldName) this.selectedPlayer = newName;
              this.saveScenariosToStorage();
              this.updateScenarioUI();
            }
          };

          const removeBtn = row.querySelector("[data-remove]");
          if (removeBtn) {
            removeBtn.onclick = () => {
              this.removePlayer(p.name);
            };
          }
        }

        editableRoster.appendChild(row);
      });
    }

    this.updateStanceBtnUI();
  }

  addPlayer(name) {
    if (this.userRole === "viewer" || !name) return;
    const sc = this.scenarios[this.currentScenarioKey];
    
    const spawnPos = { x: 90, y: -90 };
    const roleName = this.calculateCricketPositionName(spawnPos.x, spawnPos.y);

    const newPlayerData = {
      name: name,
      role: roleName,
      pos: spawnPos,
      defaultPos: spawnPos
    };

    sc.players.push(newPlayerData);
    this.saveScenariosToStorage();
    this.switchScenario(this.currentScenarioKey);
  }

  removePlayer(name) {
    if (this.userRole === "viewer") return;
    const sc = this.scenarios[this.currentScenarioKey];
    sc.players = sc.players.filter(p => p.name !== name);
    this.activePlayers = this.activePlayers.filter(p => p.name !== name);
    if (this.selectedPlayer === name) this.selectedPlayer = null;
    this.saveScenariosToStorage();
    this.switchScenario(this.currentScenarioKey);
  }

  bindEvents() {
    window.addEventListener("resize", () => this.initCanvas());
    window.addEventListener("load", () => this.initCanvas());

    const switchRoleBtn = document.getElementById("switchRoleBtn");
    if (switchRoleBtn) {
      switchRoleBtn.onclick = () => this.switchRole();
    }

    const tabOptionsBtn = document.getElementById("tabOptionsBtn");
    const tabFieldersBtn = document.getElementById("tabFieldersBtn");
    const tabOptions = document.getElementById("tabOptions");
    const tabFielders = document.getElementById("tabFielders");

    if (tabOptionsBtn && tabFieldersBtn) {
      tabOptionsBtn.onclick = () => {
        tabOptionsBtn.classList.add("active");
        tabFieldersBtn.classList.remove("active");
        tabOptions.classList.add("active");
        tabFielders.classList.remove("active");
      };

      tabFieldersBtn.onclick = () => {
        tabFieldersBtn.classList.add("active");
        tabOptionsBtn.classList.remove("active");
        tabFielders.classList.add("active");
        tabOptions.classList.remove("active");
      };
    }

    const duplicateScenarioBtn = document.getElementById("duplicateScenarioBtn");
    if (duplicateScenarioBtn) {
      duplicateScenarioBtn.onclick = () => this.duplicateCurrentScenario();
    }

    const createScenarioBtn = document.getElementById("createScenarioBtn");
    const customScenarioForm = document.getElementById("customScenarioForm");
    const submitCustomScBtn = document.getElementById("submitCustomScBtn");
    const cancelCustomScBtn = document.getElementById("cancelCustomScBtn");
    const cancelCustomScBtn2 = document.getElementById("cancelCustomScBtn2");

    const hideForm = () => {
      if (customScenarioForm) customScenarioForm.style.display = "none";
    };

    if (createScenarioBtn) {
      createScenarioBtn.onclick = () => this.openScenarioEditor(null);
    }

    if (cancelCustomScBtn) cancelCustomScBtn.onclick = hideForm;
    if (cancelCustomScBtn2) cancelCustomScBtn2.onclick = hideForm;

    if (submitCustomScBtn) {
      submitCustomScBtn.onclick = () => this.saveScenarioForm();
    }

    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const newPlayerNameInput = document.getElementById("newPlayerNameInput");
    if (addPlayerBtn && newPlayerNameInput) {
      addPlayerBtn.onclick = () => {
        if (this.userRole === "viewer") return;
        const name = newPlayerNameInput.value.trim();
        if (name) {
          this.addPlayer(name);
          newPlayerNameInput.value = "";
        } else {
          alert("Please enter a player name.");
        }
      };
    }

    // Ultra-Compact Stance Switcher Pill Button (RHB / LHB)
    const leftyToggleBtn = document.getElementById("leftyToggleBtn");
    if (leftyToggleBtn) {
      leftyToggleBtn.onclick = () => {
        this.isLefty = !this.isLefty;
        this.updateStanceBtnUI();
        this.updateTargets();
        this.broadcastLiveState();
      };
    }

    const exportPngBtn = document.getElementById("exportPngBtn");
    if (exportPngBtn) {
      exportPngBtn.onclick = () => this.exportPNG();
    }

    // MOUSE DRAG EVENT LISTENERS (Blocked in Viewer Mode)
    this.canvas.onmousedown = (e) => {
      if (this.userRole === "viewer") return;

      const rect = this.canvas.getBoundingClientRect();
      const scale = 650 / this.displaySize;
      const mouseX = ((e.clientX - rect.left) - this.displaySize / 2) * scale;
      const mouseY = ((e.clientY - rect.top) - this.displaySize / 2) * scale;

      let hit = this.activePlayers.find(p => Math.hypot(p.x - mouseX, p.y - mouseY) < 26);
      if (hit) {
        this.isDragging = true;
        this.draggedEntity = hit;
        this.selectedPlayer = hit.name;
        this.updateScenarioUI();
      }
    };

    this.canvas.onmousemove = (e) => {
      if (this.userRole === "viewer") {
        this.canvas.style.cursor = "default";
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const scale = 650 / this.displaySize;
      const mouseX = ((e.clientX - rect.left) - this.displaySize / 2) * scale;
      const mouseY = ((e.clientY - rect.top) - this.displaySize / 2) * scale;

      if (this.isDragging && this.draggedEntity) {
        this.handleEntityDrag(mouseX, mouseY);
        return;
      }

      let found = null;
      this.activePlayers.forEach(p => {
        if (Math.hypot(p.x - mouseX, p.y - mouseY) < 22) found = p.name;
      });
      this.hoveredPlayer = found;
      this.canvas.style.cursor = found ? "grab" : "crosshair";
    };

    window.onmouseup = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.draggedEntity = null;
        this.ruleWarningText = null;
        this.updateScenarioUI();
        this.broadcastLiveState();
      }
    };

    // TOUCH DRAG EVENT LISTENERS (Blocked in Viewer Mode)
    const getTouchCoords = (evt) => {
      const touch = evt.touches[0] || evt.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scale = 650 / this.displaySize;
      const x = ((touch.clientX - rect.left) - this.displaySize / 2) * scale;
      const y = ((touch.clientY - rect.top) - this.displaySize / 2) * scale;
      return { x, y };
    };

    this.canvas.addEventListener("touchstart", (e) => {
      if (this.userRole === "viewer") return;

      const { x: touchX, y: touchY } = getTouchCoords(e);
      let hit = this.activePlayers.find(p => Math.hypot(p.x - touchX, p.y - touchY) < 30);
      if (hit) {
        e.preventDefault();
        this.isDragging = true;
        this.draggedEntity = hit;
        this.selectedPlayer = hit.name;
        this.updateScenarioUI();
      }
    }, { passive: false });

    this.canvas.addEventListener("touchmove", (e) => {
      if (this.userRole === "viewer") return;

      if (this.isDragging && this.draggedEntity) {
        e.preventDefault();
        const { x: touchX, y: touchY } = getTouchCoords(e);
        this.handleEntityDrag(touchX, touchY);
      }
    }, { passive: false });

    this.canvas.addEventListener("touchend", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.draggedEntity = null;
        this.ruleWarningText = null;
        this.updateScenarioUI();
        this.broadcastLiveState();
      }
    });
  }

  handleEntityDrag(targetX, targetY) {
    if (this.userRole === "viewer") return;

    const sc = this.scenarios[this.currentScenarioKey] || Object.values(this.scenarios)[0];
    const maxOutfieldAllowed = sc.maxOutfield || 5;

    const distFromCenter = Math.hypot(targetX, targetY);
    const isTryingOutfield = distFromCenter > 140;

    const currentOutfieldersCount = this.activePlayers.filter(
      p => p.name !== this.draggedEntity.name && Math.hypot(p.x, p.y) > 140
    ).length;

    let clampedX = targetX;
    let clampedY = targetY;

    if (isTryingOutfield && currentOutfieldersCount >= maxOutfieldAllowed) {
      clampedX = (targetX / distFromCenter) * 138;
      clampedY = (targetY / distFromCenter) * 138;
      this.ruleWarningText = `⚠️ ${sc.phase} Rule: Max ${maxOutfieldAllowed} fielders outside 30yd circle!`;
    } else {
      if (distFromCenter > 285) {
        clampedX = (targetX / distFromCenter) * 285;
        clampedY = (targetY / distFromCenter) * 285;
      }
      this.ruleWarningText = null;
    }

    const newRoleName = this.calculateCricketPositionName(clampedX, clampedY);

    this.draggedEntity.x = clampedX;
    this.draggedEntity.y = clampedY;
    this.draggedEntity.targetX = clampedX;
    this.draggedEntity.targetY = clampedY;
    this.draggedEntity.role = newRoleName;

    const scP = sc.players.find(p => p.name === this.draggedEntity.name);
    if (scP) {
      scP.role = newRoleName;

      if (this.isLefty) {
        scP.leftyPos = { x: Math.round(clampedX), y: Math.round(clampedY) };
      } else {
        scP.pos = { x: Math.round(clampedX), y: Math.round(clampedY) };
      }
      this.saveScenariosToStorage();
    }
  }

  exportPNG() {
    this.draw(true);
    const dataURL = this.canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Cricket_Field_Plan_${this.currentScenarioKey}_${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }

  requestFrame() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.requestFrame());
  }

  update() {
    if (!this.isDragging) {
      const speed = this.animSpeed;
      this.activePlayers.forEach(p => {
        p.x += (p.targetX - p.x) * speed;
        p.y += (p.targetY - p.y) * speed;
      });

      this.activeBowler.x += (this.activeBowler.targetX - this.activeBowler.x) * speed;
      this.activeBowler.y += (this.activeBowler.targetY - this.activeBowler.y) * speed;

      this.activeWK.x += (this.activeWK.targetX - this.activeWK.x) * speed;
      this.activeWK.y += (this.activeWK.targetY - this.activeWK.y) * speed;
    }
  }

  draw(isExport = false) {
    try {
      const ctx = this.ctx;
      ctx.fillStyle = "#0b0f19";
      ctx.fillRect(0, 0, 1800, 1800);

      ctx.save();
      ctx.translate(900, 900);

      const scale = 2.769;
      ctx.scale(scale, scale);

      const outfieldRadius = 290;
      const innerRadius = 140;

      // Plain Natural Green Grass Turf Background
      const grassGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, outfieldRadius);
      grassGrad.addColorStop(0, "#057857");
      grassGrad.addColorStop(0.7, "#045e45");
      grassGrad.addColorStop(1, "#034533");
      
      ctx.beginPath();
      ctx.arc(0, 0, outfieldRadius, 0, Math.PI * 2);
      ctx.fillStyle = grassGrad;
      ctx.fill();

      // Boundary Rope
      ctx.beginPath();
      ctx.arc(0, 0, outfieldRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 3.5;
      ctx.setLineDash([9, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pitch Centerline
      ctx.beginPath();
      ctx.moveTo(0, -outfieldRadius);
      ctx.lineTo(0, outfieldRadius);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dynamic Off-side / Leg-side orientation logic
      let isOffSideOnRight = true;
      if (this.bowlerDir === "down") {
        isOffSideOnRight = !this.isLefty;
      } else {
        isOffSideOnRight = this.isLefty;
      }

      const leftSideLabel = isOffSideOnRight ? "LEG SIDE" : "OFF SIDE";
      const rightSideLabel = isOffSideOnRight ? "OFF SIDE" : "LEG SIDE";
      const leftSideColor = isOffSideOnRight ? "#fbbf24" : "#38bdf8";
      const rightSideColor = isOffSideOnRight ? "#38bdf8" : "#fbbf24";

      // Dynamic Side Header Banners
      this.drawSideBanner(-200, -265, leftSideLabel, leftSideColor);
      this.drawSideBanner(200, -265, rightSideLabel, rightSideColor);

      // ELEGANT VERTICAL GRASS TURF WATERMARKS ("OFF SIDE" and "LEG SIDE")
      ctx.save();
      ctx.font = "900 42px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255, 255, 255, 0.095)";

      const leftWatermarkText = isOffSideOnRight ? "LEG SIDE" : "OFF SIDE";
      const rightWatermarkText = isOffSideOnRight ? "OFF SIDE" : "LEG SIDE";

      // Left Outfield Vertical Watermark (-90 deg rotation)
      ctx.save();
      ctx.translate(-225, 0);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(leftWatermarkText, 0, 0);
      ctx.restore();

      // Right Outfield Vertical Watermark (+90 deg rotation)
      ctx.save();
      ctx.translate(225, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(rightWatermarkText, 0, 0);
      ctx.restore();

      ctx.restore();

      // 30 Yard Inner Circle
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = this.ruleWarningText ? "#ef4444" : "rgba(251, 191, 36, 0.85)";
      ctx.lineWidth = this.ruleWarningText ? 3.5 : 2;
      ctx.stroke();

      ctx.fillStyle = this.ruleWarningText ? "#fca5a5" : "rgba(251, 191, 36, 0.95)";
      ctx.font = "700 10px Inter";
      ctx.fillText("30 Yard Circle", 5, -innerRadius + 14);

      // Pitch
      const pW = 26;
      const pH = 110;
      ctx.fillStyle = "#d97706";
      ctx.fillRect(-pW / 2, -pH / 2, pW, pH);

      // Pitch Crease lines & Stumps
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-pW / 2 - 8, -pH / 2 + 15);
      ctx.lineTo(pW / 2 + 8, -pH / 2 + 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-pW / 2 - 8, pH / 2 - 15);
      ctx.lineTo(pW / 2 + 8, pH / 2 - 15);
      ctx.stroke();

      ctx.fillStyle = "#fef08a";
      ctx.fillRect(-6, -pH / 2 + 4, 12, 3);
      ctx.fillRect(-6, pH / 2 - 7, 12, 3);

      // Bowler Arrow
      ctx.strokeStyle = "#38bdf8";
      ctx.fillStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (this.bowlerDir === "down") {
        ctx.moveTo(0, -pH / 2 + 25);
        ctx.lineTo(0, pH / 2 - 25);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-6, pH / 2 - 35);
        ctx.lineTo(0, pH / 2 - 25);
        ctx.lineTo(6, pH / 2 - 35);
        ctx.fill();
      } else {
        ctx.moveTo(0, pH / 2 - 25);
        ctx.lineTo(0, -pH / 2 + 25);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-6, -pH / 2 + 35);
        ctx.lineTo(0, -pH / 2 + 25);
        ctx.lineTo(6, -pH / 2 + 35);
        ctx.fill();
      }

      // Badges for Bowler & WK
      this.drawRoleBadge(this.activeBowler.x, this.activeBowler.y, `Bowler (${this.activeBowler.name})`, "#38bdf8");
      this.drawRoleBadge(this.activeWK.x, this.activeWK.y, `WK`, "#fbbf24");

      const placedLabels = [];
      placedLabels.push({ x: this.activeBowler.x - 30, y: this.activeBowler.y + 12, w: 60, h: 18 });
      placedLabels.push({ x: this.activeWK.x - 20, y: this.activeWK.y + 12, w: 40, h: 18 });

      // Draw Player Nodes & Smart Non-Overlapping Labels with Broadcast Grade Crisp White Dots & Sky Blue Role Names
      this.activePlayers.forEach(p => {
        const isSelected = (this.selectedPlayer === p.name);
        const isHovered = (this.hoveredPlayer === p.name);
        const dotRadius = 9;

        if ((isSelected || isHovered) && !isExport) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // BROADCAST TV GRAPHIC PLAYER NODE DOT: Crisp Pure White (#ffffff) with Dark Navy Core & Sky Blue Halo!
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 11.5 : dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#38bdf8" : "#ffffff";
        if (isHovered) ctx.fillStyle = "#38bdf8";
        
        ctx.shadowColor = isSelected ? "rgba(56, 189, 248, 0.9)" : "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = isSelected ? 14 : 9;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Dark Navy Inner Ring Core for Pure White Dots
        if (!isSelected) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#0f172a";
          ctx.fill();
        }

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        const distFromCenter = Math.hypot(p.x, p.y) || 1;
        const dirX = p.x / distFromCenter;
        const dirY = p.y / distFromCenter;

        const nameText = p.name;
        const roleText = p.role;
        ctx.font = "bold 10px Inter";
        const nameWidth = ctx.measureText(nameText).width;
        ctx.font = "9px Inter";
        const roleWidth = ctx.measureText(roleText).width;
        const boxW = Math.max(nameWidth, roleWidth) + 14;
        const boxH = 24;

        let labelX = p.x + dirX * 20;
        let labelY = p.y + dirY * 20;

        let attempts = 0;
        let hasOverlap = true;
        let labelShifted = false;

        while (hasOverlap && attempts < 15) {
          hasOverlap = false;

          const curBox = {
            x: labelX - boxW / 2,
            y: labelY - boxH / 2,
            w: boxW,
            h: boxH
          };

          // 1) Check overlap with other dialog boxes
          for (let b of placedLabels) {
            if (
              curBox.x < b.x + b.w &&
              curBox.x + curBox.w > b.x &&
              curBox.y < b.y + b.h &&
              curBox.y + curBox.h > b.y
            ) {
              hasOverlap = true;
              labelShifted = true;
              break;
            }
          }

          // 2) 60%+ DOT VISIBILITY PROTECTION
          const overlapX = Math.max(0, Math.min(curBox.x + curBox.w, p.x + dotRadius) - Math.max(curBox.x, p.x - dotRadius));
          const overlapY = Math.max(0, Math.min(curBox.y + curBox.h, p.y + dotRadius) - Math.max(curBox.y, p.y - dotRadius));
          const overlapArea = overlapX * overlapY;
          const totalDotArea = Math.PI * dotRadius * dotRadius;
          const visiblePercentage = (1 - (overlapArea / totalDotArea)) * 100;

          if (visiblePercentage < 60) {
            hasOverlap = true;
            labelShifted = true;
          }

          if (hasOverlap) {
            labelY += (dirY >= 0 ? 16 : -16);
            labelX += (dirX >= 0 ? 14 : -14);
          }

          attempts++;
        }

        placedLabels.push({
          x: labelX - boxW / 2,
          y: labelY - boxH / 2,
          w: boxW,
          h: boxH
        });

        // DRAW CALLOUT CONNECTOR & ARROWHEAD (SKY BLUE THEME)
        const badgeCenterX = labelX;
        const badgeCenterY = labelY;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(badgeCenterX, badgeCenterY);
        ctx.strokeStyle = isSelected ? "rgba(56, 189, 248, 0.9)" : (labelShifted ? "rgba(56, 189, 248, 0.85)" : "rgba(255, 255, 255, 0.45)");
        ctx.lineWidth = labelShifted ? 1.8 : 1.2;
        ctx.stroke();

        // Arrowhead dot near player node
        const angle = Math.atan2(p.y - badgeCenterY, p.x - badgeCenterX);
        ctx.beginPath();
        ctx.arc(p.x - Math.cos(angle) * 7, p.y - Math.sin(angle) * 7, 3, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#38bdf8" : "#38bdf8";
        ctx.fill();

        // Dialog Box Badge Container (Dark Glass with Sky Blue Border Accent)
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
        ctx.strokeStyle = isSelected ? "rgba(56, 189, 248, 0.9)" : (labelShifted ? "#38bdf8" : "rgba(56, 189, 248, 0.4)");
        ctx.lineWidth = labelShifted ? 1.5 : 1;
        
        const px = labelX - boxW / 2;
        const py = labelY - 11;
        ctx.beginPath();
        ctx.roundRect(px, py, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        // Dialog Text Content: CRISP PURE WHITE NAME + HARMONIOUS SKY BLUE ROLE/POSITION TITLE
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "center";
        ctx.fillText(nameText, labelX, labelY - 1);

        ctx.fillStyle = isSelected ? "#38bdf8" : "#38bdf8";
        ctx.font = "bold 9px Inter";
        ctx.fillText(roleText, labelX, labelY + 9);
      });

      if (this.ruleWarningText && !isExport) {
        ctx.font = "bold 12px Inter";
        const tw = ctx.measureText(this.ruleWarningText).width + 24;
        ctx.fillStyle = "rgba(239, 68, 68, 0.95)";
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -260, tw, 28, 6);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.ruleWarningText, 0, -242);
      }

      ctx.restore();
    } catch (err) {
      console.error("Canvas draw error:", err);
    }
  }

  drawSideBanner(x, y, label, color) {
    const ctx = this.ctx;
    ctx.font = "800 11px Inter";
    const tw = ctx.measureText(label).width + 16;
    const th = 22;

    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - tw / 2, y - th / 2, tw, th, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 4);
  }

  drawRoleBadge(x, y, text, color) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 10px Inter";
    const tw = ctx.measureText(text).width + 10;
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - tw / 2, y + 10, tw, 15, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 21);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.animator = new CricketAnimator();
});
