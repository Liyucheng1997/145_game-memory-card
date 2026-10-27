(() => {
  "use strict";

  /* ---------------------------------------------------------
   *  图标（线性，24 网格）
   * --------------------------------------------------------- */

  const ICONS = {
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11.5l-2.2 4 2.2 4H5"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.2 2"/><path d="M9.5 2.5h5"/>',
    layers: '<path d="m12 3.5 8.5 4.75L12 13 3.5 8.25 12 3.5Z"/><path d="m3.5 12.5 8.5 4.75 8.5-4.75"/><path d="m3.5 16.5 8.5 4.75 8.5-4.75"/>',
    shuffle: '<path d="M16 3.5h4.5V8"/><path d="M4 20 20.5 3.5"/><path d="M20.5 16v4.5H16"/><path d="m14.5 14.5 6 6"/><path d="M4 4l5 5"/>',
    pause: '<rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/>',
    restart: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',
    home: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9"/>',
    soundOn: '<path d="M11 5 6.5 9H3v6h3.5L11 19V5Z"/><path d="M15.5 8.8a4.5 4.5 0 0 1 0 6.4"/><path d="M18.5 5.8a8.7 8.7 0 0 1 0 12.4"/>',
    soundOff: '<path d="M11 5 6.5 9H3v6h3.5L11 19V5Z"/><path d="m16 9.5 5 5"/><path d="m21 9.5-5 5"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M15 14.5c.2-1 .7-1.7 1.5-2.5a6 6 0 1 0-9 0c.8.8 1.3 1.5 1.5 2.5"/>',
    eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    left: '<path d="m14.5 18-6-6 6-6"/>',
    right: '<path d="m9.5 18 6-6-6-6"/>',
    check: '<path d="M20 6.5 9.5 17 4 11.5"/>',
  };
  const SOLID = {
    heart: '<path d="M12 20.5s-8-4.9-8-10.6A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 8 2.6c0 5.7-8 10.6-8 10.6Z"/>',
    star: '<path d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93Z"/>',
    sparkle: '<path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5v4c-4.6.6-6.9 2.9-7.5 7.5h-0c-.6-4.6-2.9-6.9-7.5-7.5v-4c4.6-.6 6.9-2.9 7.5-7.5Z" transform="rotate(45 12 12) scale(.82) translate(2.6 2.6)"/>',
  };

  function icon(name, size = 18, cls = "") {
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  }
  function solid(name, size = 18, cls = "") {
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true">${SOLID[name]}</svg>`;
  }

  /* ---------------------------------------------------------
   *  玩法、难度、卡面
   * --------------------------------------------------------- */

  const MODES = [
    { key: "classic",   name: "经典", icon: "grid",    desc: "两张相同即配对，步数越少星越多" },
    { key: "adventure", name: "闯关", icon: "flag",    desc: "关卡越来越大，记忆失误会扣生命" },
    { key: "timed",     name: "限时", icon: "timer",   desc: "和时间赛跑，配对成功还能加时" },
    { key: "triple",    name: "三连", icon: "layers",  desc: "一次翻三张，三张相同才算成功" },
    { key: "chaos",     name: "洗牌", icon: "shuffle", desc: "每隔几步有两张卡交换位置，盯紧" },
  ];

  // groups：两张一组时的组数；triples：三连模式的组数
  const DIFFICULTIES = [
    { key: "d1", name: "入门", groups: 6,  triples: 4 },
    { key: "d2", name: "简单", groups: 8,  triples: 5 },
    { key: "d3", name: "中等", groups: 10, triples: 6 },
    { key: "d4", name: "困难", groups: 12, triples: 8 },
    { key: "d5", name: "专家", groups: 15, triples: 10 },
    { key: "d6", name: "大师", groups: 18, triples: 12 },
  ];

  const PREVIEWS = [
    { key: "off",    name: "关闭", k: 0 },
    { key: "short",  name: "短",   k: 0.6 },
    { key: "normal", name: "标准", k: 1 },
    { key: "long",   name: "长",   k: 1.6 },
  ];

  // 苹果系统色：作为卡面内容色，不用于界面装饰
  const PALETTE = ["#ff3b30", "#ff9500", "#f2b600", "#34c759", "#00c7be", "#32ade6", "#007aff", "#5856d6", "#af52de", "#ff2d55", "#a2845e", "#8e8e93"];

  function polygon(n, r, rot = -90, cx = 50, cy = 50) {
    return Array.from({ length: n }, (_, i) => {
      const a = ((rot + (360 / n) * i) * Math.PI) / 180;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  }
  function starPoints(n, R, r, cx = 50, cy = 52) {
    return Array.from({ length: n * 2 }, (_, i) => {
      const a = ((-90 + (180 / n) * i) * Math.PI) / 180;
      const rad = i % 2 ? r : R;
      return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  }

  const SHAPES = [
    '<circle cx="50" cy="50" r="36"/>',
    '<rect x="16" y="16" width="68" height="68" rx="12"/>',
    `<polygon points="${polygon(3, 42, -90, 50, 57)}"/>`,
    '<polygon points="50,9 88,50 50,91 12,50"/>',
    `<polygon points="${starPoints(5, 44, 19)}"/>`,
    '<path d="M50 86C24 68 12 54 12 38a19 19 0 0 1 38-6 19 19 0 0 1 38 6c0 16-12 30-38 48Z"/>',
    `<polygon points="${polygon(6, 40, 0)}"/>`,
    '<path d="M39 13h22v26h26v22H61v26H39V61H13V39h26Z"/>',
    '<path d="M60 12a38 38 0 1 0 28 54A30 30 0 1 1 60 12Z"/>',
    '<path d="M50 10s-28 33-28 52a28 28 0 0 0 56 0C78 43 50 10 50 10Z"/>',
    '<polygon points="57,7 19,56 46,56 40,93 81,41 54,41"/>',
    '<circle cx="50" cy="50" r="30" fill="none" stroke-width="15"/>',
    '<circle cx="50" cy="29" r="19"/><circle cx="71" cy="50" r="19"/><circle cx="50" cy="71" r="19"/><circle cx="29" cy="50" r="19"/>',
    `<polygon points="${polygon(5, 42, -90, 50, 53)}"/>`,
    '<path d="M12 68a38 38 0 0 1 76 0Z"/>',
    `<polygon points="${starPoints(4, 44, 16, 50, 50)}"/>`,
  ];

  function shapeSvg(i, color) {
    return `<svg class="shape" viewBox="0 0 100 100" aria-hidden="true"><g fill="${color}" stroke="${color}" stroke-width="5" stroke-linejoin="round">${SHAPES[i]}</g></svg>`;
  }

  const EMOJI = {
    fruits:  ["🍎","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒","🍑","🥭","🍍","🥝","🍅","🥥","🥑","🍐","🍈","🌽","🥕"],
    animals: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐧","🐺","🦄","🐙","🦋"],
    food:    ["🍔","🍟","🍕","🌭","🥪","🌮","🍣","🍜","🍩","🍪","🎂","🍰","🧁","🍦","🍫","🍿","🥐","🥟","🍤","🍙"],
    sports:  ["⚽","🏀","🏈","⚾","🎾","🏐","🎱","🏓","🎯","🎳","🪁","🎮","🎲","🧩","🎸","🎺","🥁","🎨","🚀","⛵"],
  };
  const HANZI = ["日","目","田","由","甲","申","电","旦","己","已","巳","未","末","土","士","大","太","犬","天","夫","人","入","刀","力"];

  const THEMES = [
    { key: "shapes",  name: "形状",   chip: () => shapeSvg(4, PALETTE[6]) },
    { key: "fruits",  name: "水果",   chip: () => "🍓" },
    { key: "animals", name: "动物",   chip: () => "🐼" },
    { key: "food",    name: "美食",   chip: () => "🍩" },
    { key: "sports",  name: "游戏",   chip: () => "🎲" },
    { key: "numbers", name: "数字",   chip: () => '<b style="font-family:var(--font);font-size:12px">7</b>' },
    { key: "hanzi",   name: "形近字", chip: () => '<b style="font-family:var(--font);font-size:12px">日</b>' },
    { key: "mixed",   name: "大杂烩", chip: () => "🎁" },
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 返回 n 组互不相同的卡面 { key, html }
  function generateFaces(theme, n) {
    if (theme === "shapes") {
      const shapes = shuffle(SHAPES.map((_, i) => i));
      const colors = shuffle(PALETTE.slice(0, 10));
      return Array.from({ length: n }, (_, i) => {
        const s = shapes[i % shapes.length];
        const c = colors[(i + Math.floor(i / shapes.length) * 3) % colors.length];
        return { key: `s${s}-${c}`, html: shapeSvg(s, c) };
      });
    }
    if (theme === "numbers") {
      const nums = shuffle(Array.from({ length: 99 }, (_, i) => i + 1)).slice(0, n);
      return nums.map((v, i) => ({ key: `n${v}`, html: `<span class="num" style="color:${PALETTE[i % PALETTE.length]}">${v}</span>` }));
    }
    if (theme === "hanzi") {
      return shuffle(HANZI).slice(0, n).map((ch) => ({ key: `h${ch}`, html: `<span class="hanzi">${ch}</span>` }));
    }
    const pool = theme === "mixed"
      ? shuffle([...EMOJI.fruits, ...EMOJI.animals, ...EMOJI.food, ...EMOJI.sports])
      : shuffle(EMOJI[theme] || EMOJI.fruits);
    const tints = shuffle(PALETTE);
    return pool.slice(0, n).map((e, i) => ({
      key: `e${e}`,
      html: `<span class="disc" style="--tint:${tints[i % tints.length]}"><span class="emoji">${e}</span></span>`,
    }));
  }

  /* ---------------------------------------------------------
   *  本地存储（可能不可用，全部容错）
   * --------------------------------------------------------- */

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem("fm3_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("fm3_" + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    },
  };

  const settings = Object.assign(
    { mode: "classic", difficulty: "d2", theme: "shapes", preview: "normal", level: 1, muted: false, dark: null },
    store.get("settings", {})
  );
  const saveSettings = () => store.set("settings", settings);

  /* ---------------------------------------------------------
   *  DOM
   * --------------------------------------------------------- */

  const $ = (id) => document.getElementById(id);
  const homeEl = $("home"), gameEl = $("game");
  const modeGrid = $("modeGrid"), difficultySeg = $("difficultySeg"), previewSeg = $("previewSeg"), themeRow = $("themeRow");
  const difficultyRowWrap = $("difficultyRowWrap"), levelRowWrap = $("levelRowWrap"), previewRowWrap = $("previewRowWrap");
  const levelPrev = $("levelPrev"), levelNext = $("levelNext"), levelValue = $("levelValue"), levelHint = $("levelHint");
  const bestLine = $("bestLine"), startBtn = $("startBtn");
  const soundBtn = $("soundBtn"), themeBtn = $("themeBtn");
  const hudMode = $("hudMode"), hudSub = $("hudSub"), hudStats = $("hudStats");
  const hintBtn = $("hintBtn"), peekBtn = $("peekBtn"), hintCount = $("hintCount"), peekCount = $("peekCount");
  const pauseBtn = $("pauseBtn"), restartBtn = $("restartBtn"), homeBtn = $("homeBtn");
  const statusBar = $("statusBar"), statusText = $("statusText"), progressFill = $("progressFill"), readyBtn = $("readyBtn");
  const boardWrap = $("boardWrap"), board = $("board");
  const pauseModal = $("pauseModal"), resumeBtn = $("resumeBtn"), pauseHomeBtn = $("pauseHomeBtn");
  const resultModal = $("resultModal"), resultEyebrow = $("resultEyebrow"), resultTitle = $("resultTitle");
  const resultStars = $("resultStars"), resultScore = $("resultScore"), resultRecord = $("resultRecord");
  const resultGrid = $("resultGrid"), resultHomeBtn = $("resultHomeBtn"), resultPrimaryBtn = $("resultPrimaryBtn");
  const toastHost = $("toastHost");

  document.querySelectorAll(".ico-slot[data-ico]").forEach((s) => { s.innerHTML = icon(s.dataset.ico, 19); });
  pauseBtn.innerHTML = icon("pause");
  restartBtn.innerHTML = icon("restart");
  homeBtn.innerHTML = icon("home");
  levelPrev.innerHTML = icon("left", 16);
  levelNext.innerHTML = icon("right", 16);

  /* ---------------------------------------------------------
   *  音效（WebAudio，无外部资源）
   * --------------------------------------------------------- */

  let audioCtx = null;
  function tone(freq, dur, { type = "sine", gain = 0.12, delay = 0, slide = 0 } = {}) {
    if (settings.muted) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const t = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (e) { /* audio not available */ }
  }

  const sfx = {
    flip: () => tone(560, 0.07, { type: "triangle", gain: 0.06, slide: 1.25 }),
    match: (streak) => {
      const base = 620 * Math.pow(1.06, Math.min(streak, 8));
      tone(base, 0.14, { gain: 0.1 });
      tone(base * 1.5, 0.2, { gain: 0.09, delay: 0.08 });
    },
    miss: () => tone(240, 0.18, { type: "triangle", gain: 0.08, slide: 0.75 }),
    error: () => { tone(200, 0.14, { type: "square", gain: 0.04 }); tone(160, 0.2, { type: "square", gain: 0.04, delay: 0.12 }); },
    swap: () => tone(300, 0.4, { type: "sine", gain: 0.06, slide: 2.4 }),
    tick: () => tone(1200, 0.04, { type: "square", gain: 0.025 }),
    reveal: () => tone(880, 0.25, { gain: 0.05, slide: 1.5 }),
    win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.28, { gain: 0.09, delay: i * 0.1 })),
    lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.3, { type: "triangle", gain: 0.08, delay: i * 0.16 })),
  };

  /* ---------------------------------------------------------
   *  提示条
   * --------------------------------------------------------- */

  let lastToast = { text: "", at: 0 };
  function toast(text, kind = "") {
    const now = Date.now();
    if (text === lastToast.text && now - lastToast.at < 1200) return;
    lastToast = { text, at: now };
    const t = document.createElement("div");
    t.className = `toast ${kind}`;
    t.textContent = text;
    toastHost.appendChild(t);
    while (toastHost.children.length > 3) toastHost.firstChild.remove();
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 1900);
  }

  /* ---------------------------------------------------------
   *  首页
   * --------------------------------------------------------- */

  const difficultyOf = (key) => DIFFICULTIES.find((d) => d.key === key) || DIFFICULTIES[1];
  const modeOf = (key) => MODES.find((m) => m.key === key) || MODES[0];
  const unlockedLevel = () => store.get("adv_unlocked", 1);

  function adventureConfig(level) {
    const boss = level % 5 === 0;
    const size = boss ? 3 : 2;
    const groups = boss ? Math.min(2 + Math.floor(level / 2), 12) : Math.min(3 + level, 18);
    const base = previewBase(groups, size);
    return {
      size,
      groups,
      boss,
      preview: Math.max(2.5, base * Math.max(0.5, 1 - (level - 1) * 0.035)),
      lives: boss ? 4 : 3,
      swapEvery: level >= 12 ? 3 : level >= 6 ? 4 : 0,
    };
  }

  function previewBase(groups, size) {
    return size === 3 ? clamp(2 + groups * 0.9, 4, 14) : clamp(2 + groups * 0.55, 3, 13);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function bestKey() {
    return `best_${settings.mode}_${settings.difficulty}_${settings.theme}`;
  }

  function renderSegment(container, items, activeKey, onPick) {
    container.innerHTML = "";
    items.forEach((it) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = it.name;
      b.className = it.key === activeKey ? "active" : "";
      b.addEventListener("click", () => onPick(it.key));
      container.appendChild(b);
    });
  }

  function renderHome() {
    modeGrid.innerHTML = "";
    MODES.forEach((m) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mode-card" + (m.key === settings.mode ? " active" : "");
      b.innerHTML = `<span class="mode-ico">${icon(m.icon, 21)}</span><span class="mode-name">${m.name}</span><span class="mode-desc">${m.desc}</span>`;
      b.addEventListener("click", () => { settings.mode = m.key; saveSettings(); renderHome(); });
      modeGrid.appendChild(b);
    });

    renderSegment(difficultySeg, DIFFICULTIES, settings.difficulty, (k) => { settings.difficulty = k; saveSettings(); renderHome(); });
    renderSegment(previewSeg, PREVIEWS, settings.preview, (k) => { settings.preview = k; saveSettings(); renderHome(); });

    themeRow.innerHTML = "";
    THEMES.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (t.key === settings.theme ? " active" : "");
      b.innerHTML = `<span class="chip-ico">${t.chip()}</span>${t.name}`;
      b.addEventListener("click", () => { settings.theme = t.key; saveSettings(); renderHome(); });
      themeRow.appendChild(b);
    });

    const adventure = settings.mode === "adventure";
    difficultyRowWrap.hidden = adventure;
    levelRowWrap.hidden = !adventure;
    previewRowWrap.hidden = adventure;

    if (adventure) {
      const unlocked = unlockedLevel();
      settings.level = clamp(settings.level, 1, unlocked);
      const cfg = adventureConfig(settings.level);
      levelValue.textContent = `第 ${settings.level} 关`;
      levelPrev.disabled = settings.level <= 1;
      levelNext.disabled = settings.level >= unlocked;
      const stars = store.get(`adv_stars_${settings.level}`, 0);
      levelHint.textContent = `${cfg.boss ? "三连 Boss 关 · " : ""}${cfg.groups} 组 · ${cfg.lives} 条命${cfg.swapEvery ? " · 会洗牌" : ""}${stars ? " · 已获 " + "★".repeat(stars) : ""}`;
      bestLine.innerHTML = `已解锁 <b>${unlocked}</b> 关`;
      startBtn.textContent = `开始第 ${settings.level} 关`;
    } else {
      const best = store.get(bestKey(), null);
      bestLine.innerHTML = best
        ? `当前设置最佳 <b>${best.score}</b> 分${best.stars ? " · " + "★".repeat(best.stars) : ""}`
        : "当前设置还没有记录";
      startBtn.textContent = "开始游戏";
    }
  }

  levelPrev.addEventListener("click", () => { settings.level -= 1; saveSettings(); renderHome(); });
  levelNext.addEventListener("click", () => { settings.level += 1; saveSettings(); renderHome(); });

  function applyTheme() {
    const dark = settings.dark == null ? matchMedia("(prefers-color-scheme: dark)").matches : settings.dark;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    themeBtn.innerHTML = icon(dark ? "sun" : "moon");
  }
  themeBtn.addEventListener("click", () => {
    settings.dark = document.documentElement.dataset.theme !== "dark";
    saveSettings();
    applyTheme();
  });

  function applySound() { soundBtn.innerHTML = icon(settings.muted ? "soundOff" : "soundOn"); }
  soundBtn.addEventListener("click", () => {
    settings.muted = !settings.muted;
    saveSettings();
    applySound();
    sfx.flip();
  });

  /* ---------------------------------------------------------
   *  对局状态
   * --------------------------------------------------------- */

  let g = null;

  // 绑定到当前对局的定时器：对局切换后旧回调自动失效
  function later(fn, ms) {
    const owner = g;
    const t = setTimeout(() => {
      owner.timers.delete(t);
      if (g === owner) fn();
    }, ms);
    owner.timers.add(t);
    return t;
  }

  function startGame() {
    if (g) g.timers.forEach(clearTimeout);
    const mode = settings.mode;
    const diff = difficultyOf(settings.difficulty);
    const pk = (PREVIEWS.find((p) => p.key === settings.preview) || PREVIEWS[2]).k;

    g = {
      mode,
      timers: new Set(),
      size: 2,
      groups: diff.groups,
      previewSec: 0,
      cards: [],
      turn: [],
      pending: null,
      seen: new Set(),
      matchedGroups: 0,
      totalFound: 0,
      moves: 0,
      streak: 0,
      bestStreak: 0,
      score: 0,
      errors: 0,
      elapsed: 0,
      remain: 0,
      remainCap: 0,
      round: 1,
      level: 0,
      lives: 0,
      maxLives: 0,
      swapEvery: 0,
      sinceSwap: 0,
      hints: 2,
      peeks: 1,
      phase: "idle",
      paused: false,
      lock: true,
      previewLeft: 0,
      previewTotal: 0,
      lastSecond: -1,
    };

    if (mode === "triple") {
      g.size = 3;
      g.groups = diff.triples;
    }
    if (mode === "chaos") g.swapEvery = 3;
    if (mode === "adventure") {
      const cfg = adventureConfig(settings.level);
      Object.assign(g, { level: settings.level, size: cfg.size, groups: cfg.groups, lives: cfg.lives, maxLives: cfg.lives, swapEvery: cfg.swapEvery, hints: 1, peeks: 1 });
      g.previewSec = cfg.preview;
    } else {
      g.previewSec = previewBase(g.groups, g.size) * pk;
    }
    if (mode === "timed") {
      g.remain = g.remainCap = (20 + g.groups * 3.5) * 1000;
      g.hints = 3;
    }

    homeEl.hidden = true;
    gameEl.hidden = false;
    document.body.classList.add("in-game");
    resultModal.hidden = true;
    pauseModal.hidden = true;
    board.classList.remove("hidden-cards");

    const m = modeOf(mode);
    hudMode.textContent = m.name;
    hudSub.textContent = mode === "adventure"
      ? (adventureConfig(g.level).boss ? "Boss 关" : `第 ${g.level} 关`)
      : `${difficultyOf(settings.difficulty).name} · ${THEMES.find((t) => t.key === settings.theme).name}`;
    buildStats();
    dealRound();
  }

  /* ---------------------------------------------------------
   *  HUD
   * --------------------------------------------------------- */

  const STAT_SETS = {
    classic:   [["time", "用时"], ["moves", "步数"], ["streak", "连击"], ["score", "得分"]],
    triple:    [["time", "用时"], ["moves", "步数"], ["streak", "连击"], ["score", "得分"]],
    chaos:     [["time", "用时"], ["moves", "步数"], ["streak", "连击"], ["score", "得分"]],
    adventure: [["level", "关卡"], ["lives", "生命"], ["moves", "步数"], ["score", "得分"]],
    timed:     [["remain", "剩余"], ["found", "配对"], ["streak", "连击"], ["score", "得分"]],
  };
  const statEls = {};

  function buildStats() {
    hudStats.innerHTML = "";
    STAT_SETS[g.mode].forEach(([key, label]) => {
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = `<span class="stat-label">${label}</span><span class="stat-value"></span>`;
      hudStats.appendChild(d);
      statEls[key] = d.querySelector(".stat-value");
    });
    Object.keys(statEls).forEach((k) => { if (!STAT_SETS[g.mode].some(([s]) => s === k)) delete statEls[k]; });
    updateStats();
  }

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  function setStat(key, html, bump) {
    const e = statEls[key];
    if (!e) return;
    if (e.innerHTML !== String(html)) {
      e.innerHTML = html;
      if (bump) { e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); }
    }
  }

  function updateStats(bumpKey) {
    setStat("time", formatTime(g.elapsed));
    setStat("moves", g.moves, bumpKey === "moves");
    setStat("streak", g.streak ? `×${g.streak}` : "0", bumpKey === "streak");
    setStat("score", g.score, bumpKey === "score");
    setStat("level", g.level);
    setStat("found", g.totalFound, bumpKey === "found");
    if (statEls.remain) {
      setStat("remain", Math.ceil(g.remain / 1000) + "s");
      statEls.remain.classList.toggle("warn", g.remain < 10000);
    }
    if (statEls.lives) {
      const hearts = Array.from({ length: g.maxLives }, (_, i) => solid("heart", 18, i < g.lives ? "" : "lost")).join("");
      statEls.lives.innerHTML = `<span class="hearts">${hearts}</span>`;
    }
    hintCount.textContent = g.hints;
    peekCount.textContent = g.peeks;
    const toolsOn = g.phase === "play";
    hintBtn.disabled = !toolsOn || g.hints <= 0;
    peekBtn.disabled = !toolsOn || g.peeks <= 0;
  }

  function updateStatus() {
    statusBar.classList.toggle("preview", g.phase === "preview");
    readyBtn.hidden = g.phase !== "preview";
    progressFill.classList.remove("warn", "done");
    if (g.phase === "preview") {
      progressFill.classList.add("linear");
      statusText.innerHTML = `记住卡片位置 · <b>${Math.ceil(g.previewLeft / 1000)}</b> 秒`;
      progressFill.style.width = `${(g.previewLeft / g.previewTotal) * 100}%`;
      return;
    }
    if (g.mode === "timed") {
      progressFill.classList.add("linear");
      progressFill.classList.toggle("warn", g.remain < 10000);
      statusText.innerHTML = `第 <b>${g.round}</b> 轮 · 本轮 <b>${g.matchedGroups}</b> / ${g.groups}`;
      progressFill.style.width = `${clamp(g.remain / g.remainCap, 0, 1) * 100}%`;
      return;
    }
    progressFill.classList.remove("linear");
    let text = `已配对 <b>${g.matchedGroups}</b> / ${g.groups}`;
    if (g.swapEvery && g.phase === "play") text += ` · <b>${g.swapEvery - g.sinceSwap}</b> 步后洗牌`;
    if (g.phase === "dealing") text = "发牌中…";
    statusText.innerHTML = text;
    progressFill.style.width = `${(g.matchedGroups / g.groups) * 100}%`;
    if (g.matchedGroups === g.groups) progressFill.classList.add("done");
  }

  /* ---------------------------------------------------------
   *  棋盘
   * --------------------------------------------------------- */

  const BACK_HTML = `<div class="face face-down"><span class="mark">${solid("sparkle", 20)}</span></div>`;

  function dealRound() {
    g.phase = "dealing";
    g.lock = true;
    g.turn = [];
    g.pending = null;
    g.seen = new Set();
    g.matchedGroups = 0;
    g.sinceSwap = 0;

    const faces = generateFaces(settings.theme, g.groups);
    const deck = shuffle(faces.flatMap((f) => Array.from({ length: g.size }, () => f)));
    board.innerHTML = "";
    g.cards = deck.map((f, id) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "card deal";
      el.dataset.id = id;
      el.setAttribute("aria-label", "卡片");
      el.style.animationDelay = `${Math.min(id * 16, 500)}ms`;
      el.innerHTML = `<div class="card-inner">${BACK_HTML}<div class="face face-up">${f.html}</div></div>`;
      board.appendChild(el);
      return { id, key: f.key, el, up: false, matched: false };
    });
    fitBoard();
    updateStats();
    updateStatus();

    const dealTime = Math.min(g.cards.length * 16, 500) + 450;
    later(() => {
      g.cards.forEach((c) => c.el.classList.remove("deal"));
      const sec = g.mode === "timed" && g.round > 1 ? g.previewSec * 0.6 : g.previewSec;
      if (sec >= 1) startPreview(sec);
      else beginPlay();
    }, dealTime);
  }

  // 根据可用空间选出让卡片最大的列数
  function fitBoard() {
    if (!g || !g.cards.length) return;
    const W = boardWrap.clientWidth;
    const H = boardWrap.clientHeight;
    const n = g.cards.length;
    const gap = clamp(Math.round(Math.min(W, H) / 60), 6, 14);
    let best = { cols: 1, w: 0, score: 0 };
    for (let cols = 2; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      const w = Math.min((W - gap * (cols - 1)) / cols, ((H - gap * (rows - 1)) / rows) * 0.75);
      const score = n % cols ? w * 0.93 : w; // 尽量填满最后一行
      if (score > best.score) best = { cols, w, score };
    }
    const cw = Math.floor(Math.min(best.w, 150));
    board.style.setProperty("--cw", `${cw}px`);
    board.style.gridTemplateColumns = `repeat(${best.cols}, ${cw}px)`;
    board.style.gap = `${gap}px`;
  }
  new ResizeObserver(() => fitBoard()).observe(boardWrap);

  function setUp(c, up, delay = 0) {
    c.up = up;
    const inner = c.el.firstElementChild;
    inner.style.transitionDelay = delay ? `${delay}ms` : "";
    c.el.classList.toggle("up", up);
  }

  function startPreview(sec) {
    g.phase = "preview";
    g.previewTotal = g.previewLeft = sec * 1000;
    g.previewGrace = 450 + g.cards.length * 14; // 等卡片全部翻开再开始倒计时
    g.cards.forEach((c, i) => setUp(c, true, i * 14));
    sfx.reveal();
    updateStats();
    updateStatus();
  }

  function endPreview(early) {
    if (g.phase !== "preview") return;
    if (early && g.previewLeft > 800) {
      const bonus = Math.round(g.previewLeft / 1000) * 15;
      g.score += bonus;
      toast(`提前开始 +${bonus} 分`, "success");
    }
    g.phase = "hiding";
    g.cards.forEach((c, i) => setUp(c, false, i * 10));
    updateStats("score");
    updateStatus();
    later(beginPlay, 520 + g.cards.length * 10);
  }

  function beginPlay() {
    g.cards.forEach((c) => { c.el.firstElementChild.style.transitionDelay = ""; });
    g.phase = "play";
    g.lock = false;
    board.classList.remove("locked");
    updateStats();
    updateStatus();
  }

  /* ---------------------------------------------------------
   *  翻牌核心
   * --------------------------------------------------------- */

  board.addEventListener("click", (e) => {
    const el = e.target.closest(".card");
    if (el) flip(Number(el.dataset.id));
  });

  function flip(id) {
    if (!g || g.phase !== "play" || g.paused || g.lock) return;
    const c = g.cards[id];
    if (!c || c.matched) return;
    if (g.pending) flushPending(false);
    if (c.up) return;

    setUp(c, true);
    sfx.flip();
    g.turn.push(id);

    const first = g.cards[g.turn[0]];
    if (c.key !== first.key) { resolveMiss(); return; }
    if (g.turn.length === g.size) resolveMatch();
  }

  function partnersOf(c) {
    return g.cards.filter((o) => o.key === c.key && o.id !== c.id);
  }

  function resolveMatch() {
    const ids = g.turn;
    g.turn = [];
    g.moves += 1;
    g.streak += 1;
    g.bestStreak = Math.max(g.bestStreak, g.streak);
    g.matchedGroups += 1;
    g.totalFound += 1;
    ids.forEach((id) => g.seen.add(id));

    const pts = 100 + (g.streak - 1) * 25;
    g.score += pts;
    let extra = "";
    if (g.mode === "timed") {
      const add = 2000 + Math.min(g.streak, 5) * 400;
      g.remain += add;
      extra = ` +${(add / 1000).toFixed(1)}s`;
    }

    ids.forEach((id) => { g.cards[id].matched = true; });
    // 等最后一张翻完再播放配对动画
    const label = `+${pts}${g.streak >= 2 ? ` 连击×${g.streak}` : ""}${extra}`;
    const streak = g.streak;
    later(() => {
      ids.forEach((id) => {
        const c = g.cards[id];
        c.el.classList.add("matched");
        c.el.querySelector(".face-up").insertAdjacentHTML("beforeend", `<span class="check">${icon("check", 14)}</span>`);
      });
      floatText(g.cards[ids[ids.length - 1]].el, label);
      sfx.match(streak);
    }, 260);
    later(() => ids.forEach((id) => g.cards[id].el.classList.add("settled")), 1000);

    updateStats("score");
    if (g.streak >= 2) updateStats("streak");
    updateStatus();

    if (g.matchedGroups === g.groups) {
      g.lock = true;
      later(roundCleared, 900);
      return;
    }
    stepSwapCounter();
  }

  function resolveMiss() {
    const ids = g.turn;
    g.turn = [];
    g.moves += 1;
    g.streak = 0;

    // 记忆失误：第一张卡的同伴在本回合之前已经翻开过，却没有翻对
    const first = g.cards[ids[0]];
    const knew = partnersOf(first).some((p) => !p.matched && g.seen.has(p.id) && !ids.includes(p.id));
    ids.forEach((id) => g.seen.add(id));

    later(() => ids.forEach((id) => { const c = g.cards[id]; if (c.up && !c.matched) c.el.classList.add("wrong"); }), 280);
    if (knew) {
      g.errors += 1;
      sfx.error();
      if (g.mode === "adventure") {
        g.lives -= 1;
        toast(g.lives > 0 ? `记忆失误，还剩 ${g.lives} 条命` : "生命耗尽", "error");
      } else if (g.mode === "timed") {
        g.remain -= 2000;
        floatText(first.el, "-2s", true);
        toast("记忆失误 · 它的同伴你见过", "error");
      } else {
        g.score = Math.max(0, g.score - 30);
        floatText(first.el, "-30", true);
        toast("记忆失误 · 它的同伴你见过", "error");
      }
    } else {
      sfx.miss();
    }
    updateStats("moves");
    updateStatus();

    if (g.mode === "adventure" && g.lives <= 0) {
      g.lock = true;
      later(() => finish("lose"), 900);
      return;
    }
    g.pending = { ids, timer: later(() => flushPending(true), 1000) };
  }

  // 把没配对上的卡翻回去；玩家抢先点下一张时会立即执行
  function flushPending(fromTimer) {
    const p = g.pending;
    if (!p) return;
    clearTimeout(p.timer);
    g.timers.delete(p.timer);
    g.pending = null;
    p.ids.forEach((id) => {
      const c = g.cards[id];
      c.el.classList.remove("wrong");
      setUp(c, false);
    });
    stepSwapCounter(fromTimer);
  }

  /* ---------------------------------------------------------
   *  洗牌：两张背面朝上的卡交换位置
   * --------------------------------------------------------- */

  function stepSwapCounter(canSwapNow = true) {
    if (!g.swapEvery) return;
    g.sinceSwap += 1;
    if (g.sinceSwap >= g.swapEvery && canSwapNow) later(trySwap, 500);
    updateStatus();
  }

  function trySwap() {
    if (g.sinceSwap < g.swapEvery) return;
    if (g.phase !== "play" || g.turn.length || g.pending || g.lock || g.paused) {
      if (g.phase === "play") later(trySwap, 400);
      return;
    }
    const pool = g.cards.filter((c) => !c.matched && !c.up);
    if (pool.length < 2) { g.sinceSwap = 0; return; }
    // 优先挑已经看过的卡，交换才有意义
    const seen = shuffle(pool.filter((c) => g.seen.has(c.id)));
    const rest = shuffle(pool.filter((c) => !g.seen.has(c.id)));
    const [a, b] = [...seen, ...rest].slice(0, 2);
    g.sinceSwap = 0;
    g.lock = true;
    a.el.classList.add("swapping");
    b.el.classList.add("swapping");
    sfx.swap();
    statusText.innerHTML = "<b>注意！</b>两张卡正在交换位置";

    later(() => {
      const ra = a.el.getBoundingClientRect();
      const rb = b.el.getBoundingClientRect();
      const marker = document.createComment("");
      a.el.replaceWith(marker);
      b.el.replaceWith(a.el);
      marker.replaceWith(b.el);
      [[a.el, ra, rb], [b.el, rb, ra]].forEach(([el, from, to]) => {
        el.style.transition = "none";
        el.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px)`;
      });
      void board.offsetWidth;
      [a.el, b.el].forEach((el) => {
        el.style.transition = "transform .7s cubic-bezier(.65,0,.35,1)";
        el.style.transform = "";
      });
      later(() => {
        [a.el, b.el].forEach((el) => { el.style.transition = ""; el.classList.remove("swapping"); });
        g.lock = false;
        updateStatus();
      }, 900);
    }, 450);
  }

  /* ---------------------------------------------------------
   *  道具
   * --------------------------------------------------------- */

  function flash(cards, ms, cls) {
    g.lock = true;
    cards.forEach((c) => { setUp(c, true); c.el.classList.add(cls); });
    sfx.reveal();
    later(() => {
      cards.forEach((c) => { setUp(c, false); c.el.classList.remove(cls); });
      later(() => { g.lock = false; }, 300);
    }, ms);
  }

  function useHint() {
    if (!g || g.phase !== "play" || g.lock || g.paused || g.hints <= 0) return;
    if (g.pending) flushPending(false);
    let targets;
    if (g.turn.length) {
      // 已翻开一张：直接亮出它的同伴
      const first = g.cards[g.turn[0]];
      targets = partnersOf(first).filter((c) => !c.up && !c.matched);
    } else {
      const keys = [...new Set(g.cards.filter((c) => !c.matched).map((c) => c.key))];
      const key = keys[Math.floor(Math.random() * keys.length)];
      targets = g.cards.filter((c) => c.key === key && !c.matched);
    }
    if (!targets.length) return;
    g.hints -= 1;
    if (g.mode !== "timed" && g.mode !== "adventure") g.score = Math.max(0, g.score - 40);
    flash(targets, 1000, "hinted");
    updateStats("score");
  }

  function usePeek() {
    if (!g || g.phase !== "play" || g.lock || g.paused || g.peeks <= 0) return;
    if (g.pending) flushPending(false);
    g.peeks -= 1;
    if (g.mode !== "timed" && g.mode !== "adventure") g.score = Math.max(0, g.score - 80);
    flash(g.cards.filter((c) => !c.up && !c.matched), 1300, "hinted");
    updateStats("score");
  }

  hintBtn.addEventListener("click", useHint);
  peekBtn.addEventListener("click", usePeek);
  readyBtn.addEventListener("click", () => endPreview(true));

  /* ---------------------------------------------------------
   *  计时
   * --------------------------------------------------------- */

  let lastTick = performance.now();
  setInterval(() => {
    const now = performance.now();
    const dt = now - lastTick;
    lastTick = now;
    if (!g || g.paused) return;

    if (g.phase === "preview") {
      if (g.previewGrace > 0) { g.previewGrace -= dt; return; }
      g.previewLeft -= dt;
      if (g.previewLeft <= 0) endPreview(false);
      else updateStatus();
      return;
    }
    if (g.phase !== "play") return;

    g.elapsed += dt;
    if (g.mode === "timed") {
      g.remain -= dt;
      const sec = Math.ceil(g.remain / 1000);
      if (sec !== g.lastSecond && sec <= 5 && sec > 0) sfx.tick();
      g.lastSecond = sec;
      if (g.remain <= 0) {
        g.remain = 0;
        updateStats();
        updateStatus();
        finish("timeup");
        return;
      }
      updateStatus();
    }
    updateStats();
  }, 100);

  /* ---------------------------------------------------------
   *  回合结束与结算
   * --------------------------------------------------------- */

  function roundCleared() {
    if (g.mode === "timed") {
      const bonus = 150 + g.groups * 20;
      g.score += bonus;
      g.remain += 5000;
      toast(`第 ${g.round} 轮完成 · +${bonus} 分 +5 秒`, "success");
      sfx.win();
      g.round += 1;
      updateStats("score");
      dealRound();
      return;
    }
    finish("win");
  }

  function computeStars(outcome) {
    if (outcome === "lose") return 0;
    if (g.mode === "adventure") return clamp(g.lives - (g.maxLives - 3), 1, 3);
    if (g.mode === "timed") {
      const r = g.totalFound / g.groups;
      return r >= 3 ? 3 : r >= 2 ? 2 : r >= 1 ? 1 : 0;
    }
    const ratio = g.moves / g.groups;
    const [a, b] = g.size === 3 ? [2.2, 3.2] : [1.6, 2.3];
    return ratio <= a ? 3 : ratio <= b ? 2 : 1;
  }

  function finish(outcome) {
    g.phase = "over";
    g.lock = true;
    if (g.pending) { clearTimeout(g.pending.timer); g.pending = null; }
    board.classList.add("locked");

    if (outcome === "win" && g.mode !== "adventure") {
      const par = g.groups * (g.size === 3 ? 6 : 4) * 1000;
      g.score += Math.max(0, Math.round((par - g.elapsed) / 1000) * 5);
    }
    if (outcome === "win" && g.mode === "adventure") g.score += g.lives * 100;

    const stars = computeStars(outcome);
    let record = "";
    if (g.mode === "adventure") {
      if (outcome === "win") {
        if (store.get(`adv_stars_${g.level}`, 0) < stars) store.set(`adv_stars_${g.level}`, stars);
        if (unlockedLevel() <= g.level) {
          store.set("adv_unlocked", g.level + 1);
          record = `已解锁第 ${g.level + 1} 关`;
        }
      }
    } else {
      const best = store.get(bestKey(), null);
      if (!best || g.score > best.score) {
        store.set(bestKey(), { score: g.score, stars, moves: g.moves, time: Math.round(g.elapsed / 1000) });
        if (best) record = "新纪录！";
      }
    }

    // 亮出所有未配对的卡：展示答案
    if (outcome !== "win") g.cards.forEach((c, i) => { if (!c.matched) setUp(c, true, i * 10); });

    if (outcome === "lose") sfx.lose();
    else { sfx.win(); if (stars >= 2 || g.mode === "adventure") confetti(); }

    later(() => showResult(outcome, stars, record), outcome === "win" ? 700 : 1100);
  }

  function showResult(outcome, stars, record) {
    const titles = ["再接再厉", "完成挑战", "表现不错", "完美记忆"];
    resultEyebrow.classList.toggle("fail", outcome === "lose");
    if (outcome === "lose") {
      resultEyebrow.textContent = `第 ${g.level} 关 · 挑战失败`;
      resultTitle.textContent = "生命耗尽";
    } else if (outcome === "timeup") {
      resultEyebrow.textContent = "时间到";
      resultTitle.textContent = titles[stars];
    } else {
      resultEyebrow.textContent = g.mode === "adventure" ? `第 ${g.level} 关 · 通过` : `${modeOf(g.mode).name}模式 · 完成`;
      resultTitle.textContent = titles[stars];
    }

    resultStars.innerHTML = [0, 1, 2].map((i) => solid("star", 34, i < stars ? "on" : "")).join("");
    resultScore.textContent = g.score;
    resultRecord.textContent = record;

    const rows = {
      time: ["用时", formatTime(g.elapsed)],
      moves: ["步数", g.moves],
      errors: ["记忆失误", g.errors],
      streak: ["最高连击", g.bestStreak],
      lives: ["剩余生命", `${Math.max(0, g.lives)} / ${g.maxLives}`],
      found: ["共配对", g.totalFound],
      rounds: ["完成轮次", g.round - 1],
    };
    const pick = g.mode === "adventure" ? ["lives", "moves", "errors", "time"]
      : g.mode === "timed" ? ["found", "rounds", "streak", "errors"]
      : ["time", "moves", "errors", "streak"];
    resultGrid.innerHTML = pick.map((k) => `<div><span>${rows[k][0]}</span><b>${rows[k][1]}</b></div>`).join("");

    if (g.mode === "adventure") {
      resultPrimaryBtn.textContent = outcome === "win" ? "下一关" : "重试本关";
      resultPrimaryBtn.dataset.action = outcome === "win" ? "next" : "retry";
    } else {
      resultPrimaryBtn.textContent = "再来一局";
      resultPrimaryBtn.dataset.action = "retry";
    }
    resultModal.hidden = false;
    resultPrimaryBtn.focus();
  }

  resultPrimaryBtn.addEventListener("click", () => {
    if (resultPrimaryBtn.dataset.action === "next") {
      settings.level = g.level + 1;
      saveSettings();
    }
    startGame();
  });
  resultHomeBtn.addEventListener("click", goHome);

  function floatText(cardEl, text, negative = false) {
    const wr = boardWrap.getBoundingClientRect();
    const r = cardEl.getBoundingClientRect();
    const f = document.createElement("div");
    f.className = "float-score" + (negative ? " neg" : "");
    f.textContent = text;
    f.style.left = `${r.left - wr.left + r.width / 2}px`;
    f.style.top = `${r.top - wr.top + r.height / 2}px`;
    boardWrap.appendChild(f);
    setTimeout(() => f.remove(), 950);
  }

  /* ---------------------------------------------------------
   *  暂停 / 返回
   * --------------------------------------------------------- */

  function pause() {
    if (!g || g.paused || !["preview", "play", "hiding", "dealing"].includes(g.phase)) return;
    g.paused = true;
    board.classList.add("hidden-cards");
    pauseModal.hidden = false;
    resumeBtn.focus();
  }
  function resume() {
    if (!g || !g.paused) return;
    g.paused = false;
    lastTick = performance.now();
    board.classList.remove("hidden-cards");
    pauseModal.hidden = true;
  }
  function goHome() {
    if (g) { g.timers.forEach(clearTimeout); g.phase = "over"; }
    g = null;
    pauseModal.hidden = true;
    resultModal.hidden = true;
    gameEl.hidden = true;
    homeEl.hidden = false;
    document.body.classList.remove("in-game");
    board.classList.remove("hidden-cards", "locked");
    renderHome();
  }

  pauseBtn.addEventListener("click", pause);
  resumeBtn.addEventListener("click", resume);
  pauseHomeBtn.addEventListener("click", goHome);
  restartBtn.addEventListener("click", startGame);
  homeBtn.addEventListener("click", goHome);
  startBtn.addEventListener("click", startGame);

  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
  document.addEventListener("keydown", (e) => {
    if (!g || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "p" || k === "escape") { e.preventDefault(); g.paused ? resume() : pause(); }
    else if (k === "h") useHint();
    else if (k === "v") usePeek();
    else if (k === "enter" && g.phase === "preview") { e.preventDefault(); endPreview(true); }
  });

  /* ---------------------------------------------------------
   *  撒花
   * --------------------------------------------------------- */

  const canvas = $("confettiCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#0071e3", "#0a84ff", "#34c759", "#ff9f0a", "#ff2d55", "#af52de"];
    particles = Array.from({ length: 160 }, () => {
      const fromLeft = Math.random() < 0.5;
      return {
        x: fromLeft ? -10 : innerWidth + 10,
        y: innerHeight * (0.55 + Math.random() * 0.3),
        vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 7),
        vy: -(9 + Math.random() * 9),
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 0,
      };
    });
    if (!animId) loop();
  }

  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles = particles.filter((p) => p.life < 220 && p.y < innerHeight + 40);
    particles.forEach((p) => {
      p.life += 1;
      p.vy += 0.32;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, (220 - p.life) / 40);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)));
      ctx.restore();
    });
    animId = particles.length ? requestAnimationFrame(loop) : null;
    if (!animId) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  /* ---------------------------------------------------------
   *  初始化
   * --------------------------------------------------------- */

  applyTheme();
  applySound();
  renderHome();
})();
