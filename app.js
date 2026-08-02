// 2D Cricket Field Strategy Animator - Robust Canvas Sizing for Desktop & Mobile (PIN: 1996)

const DEFAULT_SCENARIOS = {
  s1: {
    id: 1,
    title: "1) Power Play - Righty (Bowling Down)",
    phase: "Power Play",
    maxOutfield: 2,
    bowler: "KN",
    bowlerPos: { x: 0, y: -60 },
    bowlerDir: "down",
    wk: { name: "WK", pos: { x: 0, y: 70 } },
    notes: [
      "Lefty Rule: Deep Leg moves to 30yd circle, Cover moves to boundary.",
      "Outgoing bowler covers position of the next bowler."
    ],
    players: [
      { name: "Sandeepa", role: "Long on", pos: { x: 0, y: -260 }, defaultPos: { x: 0, y: -260 } },
      { name: "Shirly", role: "Mid on", pos: { x: -45, y: -110 }, defaultPos: { x: -45, y: -110 } },
      { name: "Wycliff", role: "Mid off", pos: { x: 55, y: -110 }, defaultPos: { x: 55, y: -110 } },
      { name: "Ali R", role: "Mid W", pos: { x: -110, y: -45 }, defaultPos: { x: -110, y: -45 } },
      { name: "Deepal", role: "Cover", pos: { x: 110, y: 0 }, defaultPos: { x: 110, y: 0 }, leftyPos: { x: 260, y: 0 } },
      { name: "Chathura", role: "Deep leg", pos: { x: -260, y: 20 }, defaultPos: { x: -260, y: 20 }, leftyPos: { x: -115, y: 20 } },
      { name: "Rimash", role: "SQL", pos: { x: -110, y: 70 }, defaultPos: { x: -110, y: 70 } },
      { name: "Isuru", role: "Point", pos: { x: 110, y: 70 }, defaultPos: { x: 110, y: 70 } },
      { name: "Achala", role: "Gully", pos: { x: 65, y: 115 }, defaultPos: { x: 65, y: 115 }, leftyPos: { x: 40, y: 125 } }
    ]
  },
  s2: {
    id: 2,
    title: "2) Power Play - Righty (Bowling Up)",
    phase: "Power Play",
    maxOutfield: 2,
    bowler: "B2",
    bowlerPos: { x: 0, y: 60 },
    bowlerDir: "up",
    wk: { name: "WK", pos: { x: 0, y: -70 } },
    notes: [
      "Lefty Rule: Deep Leg moves to 30yd circle, Cover moves to boundary.",
      "Outgoing bowler covers position of the next bowler."
    ],
    players: [
      { name: "Shirly", role: "Gully", pos: { x: -65, y: -115 }, defaultPos: { x: -65, y: -115 }, leftyPos: { x: -40, y: -125 } },
      { name: "Ali", role: "Point", pos: { x: -110, y: -70 }, defaultPos: { x: -110, y: -70 } },
      { name: "Sandeepa", role: "SQL", pos: { x: 110, y: -70 }, defaultPos: { x: 110, y: -70 } },
      { name: "Chathura", role: "Cover", pos: { x: -110, y: 0 }, defaultPos: { x: -110, y: 0 }, leftyPos: { x: -260, y: 0 } },
      { name: "Deepal", role: "Deep leg", pos: { x: 260, y: -20 }, defaultPos: { x: 260, y: -20 }, leftyPos: { x: 115, y: -20 } },
      { name: "Wycliff", role: "Mid W", pos: { x: 110, y: 45 }, defaultPos: { x: 110, y: 45 } },
      { name: "Rimash", role: "Mid off", pos: { x: -55, y: 110 }, defaultPos: { x: -55, y: 110 } },
      { name: "Krish", role: "Mid on", pos: { x: 45, y: 110 }, defaultPos: { x: 45, y: 110 } },
      { name: "Achala", role: "Long on", pos: { x: 0, y: 260 }, defaultPos: { x: 0, y: 260 } }
    ]
  },
  s3: {
    id: 3,
    title: "3) After Power Play - Righty (Bowling Down)",
    phase: "After Power Play",
    maxOutfield: 5,
    bowler: "Wycliff",
    bowlerPos: { x: 0, y: -60 },
    bowlerDir: "down",
    wk: { name: "WK", pos: { x: 0, y: 70 } },
    notes: [
      "Option to bowler: Send 45's to Boundary at first ball of the over.",
      "Lefty Rule applies."
    ],
    players: [
      { name: "Sandeepa", role: "Long on", pos: { x: 0, y: -260 }, defaultPos: { x: 0, y: -260 } },
      { name: "Shirly", role: "Mid on 45", pos: { x: -90, y: -160 }, defaultPos: { x: -90, y: -160 }, b45Pos: { x: -180, y: -230 } },
      { name: "Krish", role: "Mid off 45", pos: { x: 90, y: -160 }, defaultPos: { x: 90, y: -160 }, b45Pos: { x: 180, y: -230 } },
      { name: "Ali", role: "Mid W", pos: { x: -110, y: -45 }, defaultPos: { x: -110, y: -45 } },
      { name: "Deepal", role: "Cover", pos: { x: 110, y: 0 }, defaultPos: { x: 110, y: 0 }, leftyPos: { x: 260, y: 0 } },
      { name: "Chathura", role: "Deep leg", pos: { x: -260, y: 20 }, defaultPos: { x: -260, y: 20 }, leftyPos: { x: -115, y: 20 } },
      { name: "Rimash", role: "SQL", pos: { x: -110, y: 70 }, defaultPos: { x: -110, y: 70 } },
      { name: "Isuru", role: "Point", pos: { x: 110, y: 70 }, defaultPos: { x: 110, y: 70 } },
      { name: "Achala", role: "Gully", pos: { x: 65, y: 115 }, defaultPos: { x: 65, y: 115 }, leftyPos: { x: 40, y: 125 } }
    ]
  },
  s4: {
    id: 4,
    title: "4) After Power Play - Righty (Bowling Up)",
    phase: "After Power Play",
    maxOutfield: 5,
    bowler: "Deepal",
    bowlerPos: { x: 0, y: 60 },
    bowlerDir: "up",
    wk: { name: "WK", pos: { x: 0, y: -70 } },
    notes: [
      "Option to bowler: Send 45's to Boundary at first ball of the over.",
      "Lefty Rule applies."
    ],
    players: [
      { name: "Shirly", role: "Gully", pos: { x: -65, y: -115 }, defaultPos: { x: -65, y: -115 }, leftyPos: { x: -40, y: -125 } },
      { name: "Ali", role: "Point", pos: { x: -110, y: -70 }, defaultPos: { x: -110, y: -70 } },
      { name: "Sandeepa", role: "SQL", pos: { x: 110, y: -70 }, defaultPos: { x: 110, y: -70 } },
      { name: "Chathura", role: "Cover", pos: { x: -110, y: 0 }, defaultPos: { x: -110, y: 0 }, leftyPos: { x: -260, y: 0 } },
      { name: "Krish", role: "Deep leg", pos: { x: 260, y: -20 }, defaultPos: { x: 260, y: -20 }, leftyPos: { x: 115, y: -20 } },
      { name: "Isuru", role: "Mid W", pos: { x: 110, y: 45 }, defaultPos: { x: 110, y: 45 } },
      { name: "Rimash", role: "Mid off 45", pos: { x: -90, y: 160 }, defaultPos: { x: -90, y: 160 }, b45Pos: { x: -180, y: 230 } },
      { name: "Wycliff", role: "Mid on 45", pos: { x: 90, y: 160 }, defaultPos: { x: 90, y: 160 }, b45Pos: { x: 180, y: 230 } },
      { name: "Achala", role: "Long on", pos: { x: 0, y: 260 }, defaultPos: { x: 0, y: 260 } }
    ]
  }
};

class CricketAnimator {
  constructor() {
    this.canvas = document.getElementById("fieldCanvas");
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.currentScenarioKey = "s1";
    this.isLefty = false;
    this.is45Boundary = false;
    
    // 0.25x Slow Speed Default
    this.animSpeed = 0.018; 

    this.selectedPlayer = null;
    this.hoveredPlayer = null;

    this.isDragging = false;
    this.draggedEntity = null;
    this.ruleWarningText = null;

    this.scenarios = this.loadScenariosFromStorage() || JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));

    this.activePlayers = [];
    this.activeBowler = { name: "KN", x: 0, y: -60, targetX: 0, targetY: -60 };
    this.activeWK = { name: "WK", x: 0, y: 70, targetX: 0, targetY: 70 };
    this.bowlerDir = "down";

    this.isBallAnimating = false;
    this.ballSimTime = 0;

    this.initPinLock();
    this.initCanvas();
    this.initScenarios();
    this.bindEvents();
    this.updateScenarioUI();
    this.requestFrame();
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

    const checkPin = () => {
      const entered = pinInput.value.trim();
      if (entered === "1996") {
        sessionStorage.setItem("cricket_pin_unlocked", "true");
        if (overlay) {
          overlay.classList.add("unlocked");
          setTimeout(() => {
            overlay.style.display = "none";
          }, 350);
        }
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

  loadScenariosFromStorage() {
    try {
      const saved = localStorage.getItem("cricket_scenarios_v1");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveScenariosToStorage() {
    try {
      localStorage.setItem("cricket_scenarios_v1", JSON.stringify(this.scenarios));
    } catch (e) {
      console.error(e);
    }
  }

  initCanvas() {
    const isMobile = window.innerWidth <= 900;
    let availableSize = 620;

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

    this.displaySize = Math.max(340, availableSize || 620);

    this.canvas.width = 1800;
    this.canvas.height = 1800;

    this.canvas.style.width = `${this.displaySize}px`;
    this.canvas.style.height = `${this.displaySize}px`;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  }

  initScenarios() {
    const sc = this.scenarios[this.currentScenarioKey] || this.scenarios["s1"];
    this.bowlerDir = sc.bowlerDir;
    this.activeBowler = { name: sc.bowler, x: sc.bowlerPos.x, y: sc.bowlerPos.y, targetX: sc.bowlerPos.x, targetY: sc.bowlerPos.y };
    this.activeWK = { name: sc.wk.name, x: sc.wk.pos.x, y: sc.wk.pos.y, targetX: sc.wk.pos.x, targetY: sc.wk.pos.y };

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
    if (this.isLefty && playerData.leftyPos) {
      return playerData.leftyPos;
    }
    if (this.is45Boundary && playerData.b45Pos) {
      return playerData.b45Pos;
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

  switchScenario(key) {
    this.currentScenarioKey = key;
    const sc = this.scenarios[key] || this.scenarios["s1"];
    this.bowlerDir = sc.bowlerDir;

    this.activeBowler.targetX = sc.bowlerPos.x;
    this.activeBowler.targetY = sc.bowlerPos.y;
    this.activeBowler.name = sc.bowler;

    this.activeWK.targetX = sc.wk.pos.x;
    this.activeWK.targetY = sc.wk.pos.y;

    this.activePlayers = sc.players.map(p => {
      const target = this.calculateTargetPos(p);
      const roleName = this.calculateCricketPositionName(target.x, target.y);
      let existing = this.activePlayers.find(ap => ap.name === p.name);
      if (existing) {
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

    this.updateScenarioUI();
  }

  createCustomScenario(title, phase, bowler, bowlerDir, maxOutfield, note) {
    const key = `custom_${Date.now()}`;
    const bowlerY = bowlerDir === "down" ? -60 : 60;
    const wkY = bowlerDir === "down" ? 70 : -70;

    const currentSc = this.scenarios[this.currentScenarioKey] || this.scenarios["s1"];
    const clonedPlayers = currentSc.players.map(p => JSON.parse(JSON.stringify(p)));

    this.scenarios[key] = {
      id: Object.keys(this.scenarios).length + 1,
      title: title || "Custom Scenario",
      phase: phase || "Custom Match Phase",
      maxOutfield: parseInt(maxOutfield) || 5,
      bowler: bowler || "Bowler",
      bowlerPos: { x: 0, y: bowlerY },
      bowlerDir: bowlerDir || "down",
      wk: { name: "WK", pos: { x: 0, y: wkY } },
      notes: [note || "Custom tactics created by Captain."],
      isCustom: true,
      players: clonedPlayers
    };

    this.saveScenariosToStorage();
    this.switchScenario(key);
  }

  deleteCustomScenario(key) {
    if (this.scenarios[key] && this.scenarios[key].isCustom) {
      delete this.scenarios[key];
      this.saveScenariosToStorage();
      this.switchScenario("s1");
    }
  }

  updateTargets() {
    const sc = this.scenarios[this.currentScenarioKey];
    this.activePlayers.forEach(ap => {
      const pData = sc.players.find(p => p.name === ap.name);
      if (pData) {
        const target = this.calculateTargetPos(pData);
        ap.targetX = target.x;
        ap.targetY = target.y;
        ap.role = this.calculateCricketPositionName(target.x, target.y);
      }
    });
  }

  updateScenarioUI() {
    const sc = this.scenarios[this.currentScenarioKey] || this.scenarios["s1"];
    
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
          ${item.isCustom ? `<button class="btn-icon-small" data-del="${key}" style="color:#fb7185; padding:0 0.2rem;">🗑️</button>` : ''}
        `;

        btn.onclick = (e) => {
          if (e.target.dataset.del) {
            e.stopPropagation();
            if (confirm(`Delete custom scenario "${item.title}"?`)) {
              this.deleteCustomScenario(key);
            }
            return;
          }
          this.switchScenario(key);
        };

        gridContainer.appendChild(btn);
      });
    }

    const scTitle = document.getElementById("scTitle");
    if (scTitle) scTitle.textContent = sc.title;

    const scPhase = document.getElementById("scPhase");
    if (scPhase) scPhase.textContent = sc.phase;

    const scBowlerInfo = document.getElementById("scBowlerInfo");
    if (scBowlerInfo) scBowlerInfo.textContent = `Bowler: ${sc.bowler}`;

    const notesContainer = document.getElementById("tacticalNotes");
    if (notesContainer) {
      notesContainer.innerHTML = "";
      sc.notes.forEach((note, idx) => {
        const box = document.createElement("div");
        box.className = `note-box ${idx === 1 ? 'amber' : 'blue'}`;
        box.innerHTML = `<h4>Note ${idx + 1}</h4><p>${note}</p>`;
        notesContainer.appendChild(box);
      });
    }

    const editableRoster = document.getElementById("editableRosterList");
    const countLabel = document.getElementById("fielderCountLabel");
    if (countLabel) countLabel.textContent = `${this.activePlayers.length} Active Fielders`;

    if (editableRoster) {
      editableRoster.innerHTML = "";
      this.activePlayers.forEach((p, idx) => {
        const row = document.createElement("div");
        row.className = "fielder-edit-row";
        row.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span style="color:var(--text-muted); font-size:0.7rem; font-weight:700;">#${idx+1}</span>
            <input type="text" class="fielder-edit-input" value="${p.name}" data-index="${idx}">
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span class="fielder-role-badge">${p.role}</span>
            <button class="btn-icon-small" data-remove="${p.name}">🗑️</button>
          </div>
        `;

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
        removeBtn.onclick = () => {
          this.removePlayer(p.name);
        };

        editableRoster.appendChild(row);
      });
    }
  }

  addPlayer(name) {
    if (!name) return;
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
    const sc = this.scenarios[this.currentScenarioKey];
    sc.players = sc.players.filter(p => p.name !== name);
    this.activePlayers = this.activePlayers.filter(p => p.name !== name);
    if (this.selectedPlayer === name) this.selectedPlayer = null;
    this.saveScenariosToStorage();
    this.updateScenarioUI();
  }

  bindEvents() {
    window.addEventListener("resize", () => this.initCanvas());
    window.addEventListener("load", () => this.initCanvas());

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

    const createScenarioBtn = document.getElementById("createScenarioBtn");
    const customScenarioForm = document.getElementById("customScenarioForm");
    const submitCustomScBtn = document.getElementById("submitCustomScBtn");

    if (createScenarioBtn && customScenarioForm) {
      createScenarioBtn.onclick = () => {
        customScenarioForm.style.display = customScenarioForm.style.display === "none" ? "flex" : "none";
      };
    }

    if (submitCustomScBtn) {
      submitCustomScBtn.onclick = () => {
        const title = document.getElementById("scNameInput").value.trim();
        const phase = document.getElementById("scPhaseInput").value;
        const bowler = document.getElementById("scBowlerInput").value.trim();
        const dir = document.getElementById("scDirInput").value;
        const note = document.getElementById("scNoteInput").value.trim();

        if (title) {
          this.createCustomScenario(title, phase, bowler, dir, phase.includes("Power Play") ? 2 : 5, note);
          customScenarioForm.style.display = "none";
          document.getElementById("scNameInput").value = "";
        } else {
          alert("Please enter a scenario title.");
        }
      };
    }

    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const newPlayerNameInput = document.getElementById("newPlayerNameInput");
    if (addPlayerBtn && newPlayerNameInput) {
      addPlayerBtn.onclick = () => {
        const name = newPlayerNameInput.value.trim();
        if (name) {
          this.addPlayer(name);
          newPlayerNameInput.value = "";
        } else {
          alert("Please enter a player name.");
        }
      };
    }

    const leftyToggle = document.getElementById("leftyToggle");
    if (leftyToggle) {
      leftyToggle.onchange = (e) => {
        this.isLefty = e.target.checked;
        this.updateTargets();
      };
    }

    const b45Toggle = document.getElementById("b45Toggle");
    if (b45Toggle) {
      b45Toggle.onchange = (e) => {
        this.is45Boundary = e.target.checked;
        this.updateTargets();
      };
    }

    const exportPngBtn = document.getElementById("exportPngBtn");
    if (exportPngBtn) {
      exportPngBtn.onclick = () => this.exportPNG();
    }

    // MOUSE DRAG EVENT LISTENERS
    this.canvas.onmousedown = (e) => {
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
      }
    };

    // TOUCH DRAG EVENT LISTENERS (iOS & ANDROID SMARTPHONES)
    const getTouchCoords = (evt) => {
      const touch = evt.touches[0] || evt.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scale = 650 / this.displaySize;
      const x = ((touch.clientX - rect.left) - this.displaySize / 2) * scale;
      const y = ((touch.clientY - rect.top) - this.displaySize / 2) * scale;
      return { x, y };
    };

    this.canvas.addEventListener("touchstart", (e) => {
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
      }
    });
  }

  handleEntityDrag(targetX, targetY) {
    const sc = this.scenarios[this.currentScenarioKey] || this.scenarios["s1"];
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
      if (this.isLefty && scP.leftyPos) {
        scP.leftyPos = { x: Math.round(clampedX), y: Math.round(clampedY) };
      } else if (this.is45Boundary && scP.b45Pos) {
        scP.b45Pos = { x: Math.round(clampedX), y: Math.round(clampedY) };
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
      ctx.fillStyle = isSelected ? "#38bdf8" : (p.data.b45Pos && this.is45Boundary ? "#f43f5e" : "#ffffff");
      if (isHovered) ctx.fillStyle = "#38bdf8";
      
      ctx.shadowColor = isSelected ? "rgba(56, 189, 248, 0.9)" : "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = isSelected ? 14 : 9;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dark Navy Inner Ring Core for Pure White Dots
      if (!isSelected && !(p.data.b45Pos && this.is45Boundary)) {
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

      ctx.fillStyle = isSelected ? "#38bdf8" : "#38bdf8"; // HARMONIOUS SKY BLUE POSITION ROLE COLOR!
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
