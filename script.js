(() => {
  "use strict";

  /* ---------------------------------------------------------
   *  数据定义：难度预设 & 卡片主题
   * --------------------------------------------------------- */

  const DIFFICULTIES = [
    { key: "easy",   label: "简单",   rows: 3, cols: 4, pairs: 6,  preview: 5 },
    { key: "medium", label: "中等",   rows: 4, cols: 4, pairs: 8,  preview: 4 },
    { key: "hard",   label: "困难",   rows: 4, cols: 5, pairs: 10, preview: 4 },
    { key: "expert", label: "专家",   rows: 4, cols: 6, pairs: 12, preview: 3 },
    { key: "master", label: "大师",   rows: 6, cols: 6, pairs: 18, preview: 3 },
    { key: "custom", label: "自定义", rows: 0, cols: 0, pairs: 8,  preview: 4 },
  ];

  const EMOJI_POOLS = {
    flowers: ["🌸","🌹","🌺","🌻","🌼","🥀","🏵️","💐","🌷","🪻","🪷","🌵","🍀","☘️","🌿","🌱","🎋","🎍"],
    birds:   ["🐦","🐧","🐤","🐣","🐥","🦆","🦅","🦉","🦜","🦩","🐓","🦃","🕊️","🦢","🦚","🐔","🦤","🪿"],
    fruits:  ["🍎","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥝","🍅","🥥","🥑","🍐","🍏"],
    animals: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐺"],
  };

  const THEMES = [
    { key: "numbers", label: "🔢 数字" },
    { key: "colors",  label: "🎨 颜色" },
    { key: "flowers", label: "🌸 花卉" },
    { key: "birds",   label: "🦜 鸟类" },
    { key: "fruits",  label: "🍎 水果" },
    { key: "animals", label: "🐾 动物" },
    { key: "mixed",   label: "🎁 混合惊喜" },
  ];

  /* ---------------------------------------------------------
   *  状态
   * --------------------------------------------------------- */

  const state = {
    difficultyKey: "medium",
    themeKey: "flowers",
    customPairs: 8,
    previewEnabled: true,
    soundEnabled: true,
    muted: false,

    cards: [],
    flippedIds: [],
    matchedCount: 0,
    moves: 0,
    streak: 0,
    bestStreak: 0,
    score: 0,
    seconds: 0,
    timerId: null,
    locked: false,
    paused: false,
    started: false,
  };

  /* ---------------------------------------------------------
   *  DOM refs
   * --------------------------------------------------------- */

  const el = (id) => document.getElementById(id);
  const controls = el("controls");
  const hud = el("hud");
  const board = el("board");
  const difficultyRow = el("difficultyRow");
  const themeRow = el("themeRow");
  const customGroup = el("customGroup");
  const customPairsInput = el("customPairs");
  const customPairsValue = el("customPairsValue");
  const previewToggle = el("previewToggle");
  const soundToggle = el("soundToggle");
  const startBtn = el("startBtn");
  const muteBtn = el("muteBtn");

  const timeValue = el("timeValue");
  const movesValue = el("movesValue");
  const streakValue = el("streakValue");
  const scoreValue = el("scoreValue");
  const bestValue = el("bestValue");

  const pauseBtn = el("pauseBtn");
  const restartBtn = el("restartBtn");
  const quitBtn = el("quitBtn");

  const previewOverlay = el("previewOverlay");
  const previewCount = el("previewCount");
  const pauseOverlay = el("pauseOverlay");
  const resumeBtn = el("resumeBtn");
  const winOverlay = el("winOverlay");
  const winStars = el("winStars");
  const winTime = el("winTime");
  const winMoves = el("winMoves");
  const winStreak = el("winStreak");
  const winScore = el("winScore");
  const winRecord = el("winRecord");
  const playAgainBtn = el("playAgainBtn");
  const changeSettingsBtn = el("changeSettingsBtn");

  /* ---------------------------------------------------------
   *  音效 (WebAudio, 无需外部资源)
   * --------------------------------------------------------- */

  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function playTone(freq, duration, type = "sine", gainStart = 0.18) {
    if (state.muted || !state.soundEnabled) return;
    try {
      ensureAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(gainStart, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) { /* audio not available, ignore */ }
  }

  const sounds = {
    flip: () => playTone(420, 0.1, "triangle", 0.1),
    match: () => { playTone(660, 0.12); setTimeout(() => playTone(880, 0.16), 90); },
    mismatch: () => playTone(160, 0.22, "sawtooth", 0.12),
    win: () => {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.22), i * 120));
    },
  };

  /* ---------------------------------------------------------
   *  工具函数
   * --------------------------------------------------------- */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function getDifficulty() {
    const base = DIFFICULTIES.find((d) => d.key === state.difficultyKey);
    if (base.key !== "custom") return base;
    const pairs = state.customPairs;
    let cols = Math.ceil(Math.sqrt(pairs * 2 * 1.2));
    cols = Math.min(Math.max(cols, 3), 8);
    const rows = Math.ceil((pairs * 2) / cols);
    return { ...base, rows, cols, pairs };
  }

  function recordKey() {
    const diff = getDifficulty();
    const size = diff.key === "custom" ? `custom-${diff.pairs}` : diff.key;
    return `flipmem_best_${size}_${state.themeKey}`;
  }

  function loadBest() {
    const raw = localStorage.getItem(recordKey());
    return raw ? JSON.parse(raw) : null;
  }

  function saveBestIfBetter(entry) {
    const current = loadBest();
    if (!current || entry.score > current.score) {
      localStorage.setItem(recordKey(), JSON.stringify(entry));
      return true;
    }
    return false;
  }

  /* ---------------------------------------------------------
   *  生成卡片内容
   * --------------------------------------------------------- */

  function generateContents(pairs) {
    const type = state.themeKey;
    if (type === "numbers") {
      return Array.from({ length: pairs }, (_, i) => ({
        type: "text",
        value: String(i + 1),
        style: { background: `hsl(${Math.round((i / pairs) * 340)}, 65%, 42%)` },
      }));
    }
    if (type === "colors") {
      return Array.from({ length: pairs }, (_, i) => ({
        type: "color",
        value: "",
        style: { background: `hsl(${Math.round((i / pairs) * 340)}, 72%, 50%)` },
      }));
    }
    if (type === "mixed") {
      const pool = shuffle([
        ...EMOJI_POOLS.flowers,
        ...EMOJI_POOLS.birds,
        ...EMOJI_POOLS.fruits,
        ...EMOJI_POOLS.animals,
      ]);
      return pool.slice(0, pairs).map((e) => ({ type: "emoji", value: e, style: {} }));
    }
    const pool = EMOJI_POOLS[type] || EMOJI_POOLS.flowers;
    return shuffle(pool).slice(0, pairs).map((e) => ({ type: "emoji", value: e, style: {} }));
  }

  /* ---------------------------------------------------------
   *  UI 构建：难度 & 主题选择
   * --------------------------------------------------------- */

  function buildChipRow(container, items, activeKey, onPick) {
    container.innerHTML = "";
    items.forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (item.key === activeKey ? " active" : "");
      chip.textContent = item.label;
      chip.addEventListener("click", () => onPick(item.key));
      container.appendChild(chip);
    });
  }

  function renderDifficultyChips() {
    buildChipRow(difficultyRow, DIFFICULTIES, state.difficultyKey, (key) => {
      state.difficultyKey = key;
      customGroup.hidden = key !== "custom";
      renderDifficultyChips();
    });
  }

  function renderThemeChips() {
    buildChipRow(themeRow, THEMES, state.themeKey, (key) => {
      state.themeKey = key;
      renderThemeChips();
    });
  }

  customPairsInput.addEventListener("input", () => {
    state.customPairs = Number(customPairsInput.value);
    customPairsValue.textContent = state.customPairs;
  });

  previewToggle.addEventListener("change", () => { state.previewEnabled = previewToggle.checked; });
  soundToggle.addEventListener("change", () => { state.soundEnabled = soundToggle.checked; });

  muteBtn.addEventListener("click", () => {
    state.muted = !state.muted;
    muteBtn.textContent = state.muted ? "🔇" : "🔊";
  });

  /* ---------------------------------------------------------
   *  游戏流程
   * --------------------------------------------------------- */

  function buildCards() {
    const diff = getDifficulty();
    const contents = generateContents(diff.pairs);
    const doubled = shuffle(
      contents.flatMap((c, idx) => [
        { ...c, pairId: idx, id: idx * 2 },
        { ...c, pairId: idx, id: idx * 2 + 1 },
      ])
    );
    state.cards = doubled;
    return diff;
  }

  function renderBoard(diff) {
    board.style.gridTemplateColumns = `repeat(${diff.cols}, 1fr)`;
    board.innerHTML = "";
    state.cards.forEach((card) => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.dataset.id = card.id;
      cardEl.tabIndex = 0;

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const front = document.createElement("div");
      front.className = "card-face front";
      front.textContent = "?";

      const back = document.createElement("div");
      back.className = `card-face back type-${card.type}`;
      if (card.type === "emoji") back.textContent = card.value;
      if (card.type === "text") back.textContent = card.value;
      Object.assign(back.style, card.style);

      inner.appendChild(front);
      inner.appendChild(back);
      cardEl.appendChild(inner);

      cardEl.addEventListener("click", () => onCardClick(card.id));
      cardEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCardClick(card.id); }
      });

      board.appendChild(cardEl);
    });
  }

  function cardElById(id) {
    return board.querySelector(`.card[data-id="${id}"]`);
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(() => {
      if (!state.paused) {
        state.seconds += 1;
        timeValue.textContent = formatTime(state.seconds);
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = null;
  }

  function updateHud() {
    timeValue.textContent = formatTime(state.seconds);
    movesValue.textContent = state.moves;
    streakValue.textContent = state.streak;
    scoreValue.textContent = state.score;
    const best = loadBest();
    bestValue.textContent = best ? best.score : "--";
  }

  function onCardClick(id) {
    if (state.locked || state.paused) return;
    const cardEl = cardElById(id);
    const card = state.cards.find((c) => c.id === id);
    if (!card || cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;
    if (state.flippedIds.length >= 2) return;

    cardEl.classList.add("flipped");
    sounds.flip();
    state.flippedIds.push(id);

    if (!state.timerAlreadyStarted) {
      state.timerAlreadyStarted = true;
    }

    if (state.flippedIds.length === 2) {
      state.moves += 1;
      state.locked = true;
      const [id1, id2] = state.flippedIds;
      const c1 = state.cards.find((c) => c.id === id1);
      const c2 = state.cards.find((c) => c.id === id2);

      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          cardElById(id1).classList.add("matched");
          cardElById(id2).classList.add("matched");
          state.matchedCount += 1;
          state.streak += 1;
          state.bestStreak = Math.max(state.bestStreak, state.streak);
          state.score += 100 + state.streak * 20;
          sounds.match();
          state.flippedIds = [];
          state.locked = false;
          updateHud();
          if (state.matchedCount === state.cards.length / 2) {
            onWin();
          }
        }, 280);
      } else {
        state.streak = 0;
        cardElById(id1).classList.add("mismatch");
        cardElById(id2).classList.add("mismatch");
        sounds.mismatch();
        setTimeout(() => {
          cardElById(id1).classList.remove("flipped", "mismatch");
          cardElById(id2).classList.remove("flipped", "mismatch");
          state.flippedIds = [];
          state.locked = false;
          updateHud();
        }, 850);
      }
    }
    updateHud();
  }

  function runPreview(diff, onDone) {
    if (!state.previewEnabled) { onDone(); return; }
    board.querySelectorAll(".card").forEach((c) => c.classList.add("flipped"));
    previewOverlay.hidden = false;
    let n = diff.preview;
    previewCount.textContent = n;
    const iv = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(iv);
        previewOverlay.hidden = true;
        board.querySelectorAll(".card").forEach((c) => c.classList.remove("flipped"));
        onDone();
      } else {
        previewCount.textContent = n;
      }
    }, 1000);
  }

  function resetRunState() {
    state.flippedIds = [];
    state.matchedCount = 0;
    state.moves = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.score = 0;
    state.seconds = 0;
    state.locked = true;
    state.paused = false;
  }

  function startGame() {
    ensureAudio();
    resetRunState();
    const diff = buildCards();
    renderBoard(diff);
    board.hidden = false;
    hud.hidden = false;
    controls.hidden = true;
    updateHud();

    runPreview(diff, () => {
      state.locked = false;
      startTimer();
    });
  }

  function onWin() {
    stopTimer();
    const diff = getDifficulty();
    const efficiencyRatio = state.moves / diff.pairs;
    let stars = 1;
    if (efficiencyRatio <= 1.5) stars = 3;
    else if (efficiencyRatio <= 2.2) stars = 2;
    const timeBonus = Math.max(0, 500 - state.seconds * 2);
    state.score += timeBonus;

    winStars.textContent = "⭐".repeat(stars) + "☆".repeat(3 - stars);
    winTime.textContent = formatTime(state.seconds);
    winMoves.textContent = state.moves;
    winStreak.textContent = state.bestStreak;
    winScore.textContent = state.score;

    const isNewBest = saveBestIfBetter({
      score: state.score,
      time: state.seconds,
      moves: state.moves,
      date: new Date().toISOString(),
    });
    winRecord.textContent = isNewBest ? "🏆 新纪录！" : "";
    bestValue.textContent = loadBest().score;

    sounds.win();
    launchConfetti();
    setTimeout(() => { winOverlay.hidden = false; }, 300);
  }

  function returnToSettings() {
    stopTimer();
    state.paused = false;
    pauseOverlay.hidden = true;
    winOverlay.hidden = true;
    board.hidden = true;
    hud.hidden = true;
    controls.hidden = false;
  }

  /* ---------------------------------------------------------
   *  控制按钮
   * --------------------------------------------------------- */

  startBtn.addEventListener("click", startGame);

  pauseBtn.addEventListener("click", () => {
    state.paused = true;
    pauseOverlay.hidden = false;
  });
  resumeBtn.addEventListener("click", () => {
    state.paused = false;
    pauseOverlay.hidden = true;
  });

  restartBtn.addEventListener("click", startGame);
  quitBtn.addEventListener("click", returnToSettings);
  playAgainBtn.addEventListener("click", () => { winOverlay.hidden = true; startGame(); });
  changeSettingsBtn.addEventListener("click", () => { winOverlay.hidden = true; returnToSettings(); });

  /* ---------------------------------------------------------
   *  撒花动画 (canvas confetti)
   * --------------------------------------------------------- */

  const confettiCanvas = el("confettiCanvas");
  const ctx = confettiCanvas.getContext("2d");
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    const colors = ["#ffb347", "#ff6b9d", "#6c5ce7", "#2ecc71", "#54a0ff", "#feca57"];
    confettiParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * confettiCanvas.height * 0.3,
      r: 4 + Math.random() * 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12,
    }));
    if (!confettiAnimId) confettiLoop();
    setTimeout(() => { confettiParticles = []; }, 3200);
  }

  function confettiLoop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    if (confettiParticles.length) {
      confettiAnimId = requestAnimationFrame(confettiLoop);
    } else {
      confettiAnimId = null;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ---------------------------------------------------------
   *  初始化
   * --------------------------------------------------------- */

  function init() {
    renderDifficultyChips();
    renderThemeChips();
    customGroup.hidden = state.difficultyKey !== "custom";
    customPairsInput.value = state.customPairs;
    customPairsValue.textContent = state.customPairs;
    updateHud();
  }

  init();
})();
