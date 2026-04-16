import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───
const W = 640;
const H = 800;

// ─── TIMELINE: 40+ events in 6 categories ───
const CAT_COLORS = {
  model: "#6b9fe8",
  news: "#ff9f43",
  business: "#4ecdc4",
  science: "#d4a0ff",
  policy: "#45b7d1",
  culture: "#ff6b9d",
};
const CAT_LABELS = {
  model: "MODEL",
  news: "NIEUWS",
  business: "BUSINESS",
  science: "SCIENCE",
  policy: "BELEID",
  culture: "CULTUUR",
};

const TIMELINE = [
  // 2022
  { name: "ChatGPT", sub: "OpenAI lanceert chatbot", pts: 100, yr: "2022", cat: "model", news: "OpenAI lanceert ChatGPT — snelst groeiende app ooit" },
  { name: "Stable Diffusion", sub: "Open-source image AI", pts: 80, yr: "2022", cat: "model", news: "Stability AI democratiseert beeldgeneratie met open-source model" },
  { name: "AI Wint Kunstprijs", sub: "Théâtre D'opéra Spatial", pts: 80, yr: "2022", cat: "culture", news: "AI-gegenereerd schilderij wint Colorado State Fair — kunstwereld in rep en roer" },
  { name: "Google Code Red", sub: "Interne paniek bij Google", pts: 70, yr: "2022", cat: "news", news: "Google roept 'code red' uit over de ChatGPT-dreiging voor search" },
  // 2023
  { name: "GPT-4", sub: "Multimodaal & vision", pts: 200, yr: "2023", cat: "model", news: "GPT-4 scoort in top 10% van de bar exam — multimodale doorbraak" },
  { name: "MS × OpenAI $10B", sub: "Megadeal gesloten", pts: 150, yr: "2023", cat: "business", news: "Microsoft investeert $10 miljard in OpenAI — AI-race escaleert" },
  { name: "100M Users", sub: "ChatGPT recordgroei", pts: 120, yr: "2023", cat: "news", news: "ChatGPT bereikt 100 miljoen gebruikers in 2 maanden — snelste ooit" },
  { name: "Claude 2", sub: "Anthropic gaat publiek", pts: 150, yr: "2023", cat: "model", news: "Anthropic lanceert Claude 2 voor het grote publiek" },
  { name: "Llama 2", sub: "Meta open-source AI", pts: 180, yr: "2023", cat: "model", news: "Meta maakt Llama 2 open source — democratisering van AI" },
  { name: "Nvidia $1T", sub: "Eerste trillion chipmaker", pts: 160, yr: "2023", cat: "business", news: "Nvidia bereikt $1 trillion marktwaarde dankzij AI-chipboom" },
  { name: "Copilot Launch", sub: "AI codeert mee", pts: 140, yr: "2023", cat: "model", news: "GitHub Copilot wordt mainstream — developers coderen met AI als copiloot" },
  { name: "Biden AI Order", sub: "110 pagina's AI-beleid", pts: 130, yr: "2023", cat: "policy", news: "President Biden tekent uitgebreide executive order over AI-veiligheid" },
  { name: "EU AI Act Deal", sub: "Eerste AI-wet ter wereld", pts: 150, yr: "2023", cat: "policy", news: "EU bereikt akkoord over 's werelds eerste AI-regulering" },
  { name: "AI Drake Song", sub: "Heart on My Sleeve viral", pts: 140, yr: "2023", cat: "culture", news: "AI-gegenereerde Drake & The Weeknd song gaat viral — muziekindustrie in paniek" },
  // 2024
  { name: "Claude 3 Opus", sub: "Menselijk niveau benchmarks", pts: 250, yr: "2024", cat: "model", news: "Claude 3 Opus behaalt menselijk niveau op academische benchmarks" },
  { name: "Sora Preview", sub: "AI genereert video", pts: 220, yr: "2024", cat: "model", news: "OpenAI toont Sora — genereert minuten-lange video's uit tekst" },
  { name: "GPT-4o", sub: "Unified multimodaal", pts: 230, yr: "2024", cat: "model", news: "GPT-4o combineert tekst, beeld en stem in één omni-model" },
  { name: "Hollywood vs AI", sub: "Writers Strike wint", pts: 300, yr: "2024", cat: "culture", news: "Hollywood writers winnen AI-beperkingen in contracten na historische staking" },
  { name: "EU AI Act Final", sub: "Wet treedt in werking", pts: 180, yr: "2024", cat: "policy", news: "EU AI Act treedt officieel in werking — bedrijven moeten compliant zijn" },
  { name: "Copilot 50M", sub: "50.000 bedrijven", pts: 200, yr: "2024", cat: "business", news: "GitHub Copilot wordt door 50.000 bedrijven gebruikt voor AI-coding" },
  { name: "Computer Use", sub: "Claude bestuurt desktop", pts: 250, yr: "2024", cat: "model", news: "Claude kan nu een computer bedienen — screenshots, klikken, typen" },
  { name: "Deepfake Verkiezing", sub: "AI-hoax in US verkiezing", pts: 150, yr: "2024", cat: "culture", news: "AI deepfake voice van Biden belt kiezers — alarm over verkiezingsintegriteit" },
  { name: "ChatGPT Voice", sub: "Je praat met AI", pts: 200, yr: "2024", cat: "model", news: "ChatGPT Advanced Voice Mode — je voert echte gesprekken met AI" },
  { name: "Llama 3", sub: "Meta 70B open model", pts: 220, yr: "2024", cat: "model", news: "Llama 3 zet nieuwe standaard voor open-weight modellen" },
  { name: "Apple Intelligence", sub: "On-device AI iPhone", pts: 180, yr: "2024", cat: "model", news: "Apple integreert on-device AI in elk nieuw iPhone en Mac" },
  // 2025
  { name: "Claude Code", sub: "Agentic Development", pts: 350, yr: "2025", cat: "model", news: "Claude Code schrijft autonome software — developers schalen 10x" },
  { name: "GPT-5", sub: "400K context frontier", pts: 350, yr: "2025", cat: "model", news: "GPT-5 verwerkt volledige codebases in één prompt" },
  { name: "Llama 4", sub: "Native multimodaal open", pts: 280, yr: "2025", cat: "model", news: "Meta Llama 4 is volledig multimodaal en open source" },
  { name: "AI Chip Race", sub: "Intel, AMD vs Nvidia", pts: 200, yr: "2025", cat: "business", news: "Intel en AMD lanceren AI-chips die Nvidia uitdagen" },
  { name: "Perplexity Search", sub: "AI vervangt Google", pts: 180, yr: "2025", cat: "model", news: "Perplexity AI Search groeit explosief — Google zoeken voelt ouderwets" },
  { name: "AI Agents", sub: "Autonome AI workers", pts: 350, yr: "2025", cat: "model", news: "AI Agents voeren zelfstandig complexe bedrijfstaken uit" },
  { name: "Gemini 3", sub: "Google Deep Think", pts: 300, yr: "2025", cat: "model", news: "Google Gemini 3 combineert zoeken, redeneren en creëren" },
  // 2026
  { name: "Claude 4.6 Opus", sub: "1M context window", pts: 450, yr: "2026", cat: "model", news: "Claude 4.6 Opus — het meest capabele AI-model ter wereld" },
  { name: "GPT-5.4", sub: "Frontier Intelligence", pts: 450, yr: "2026", cat: "model", news: "GPT-5.4 passeert menselijk niveau op alle bekende benchmarks" },
  { name: "Cowork", sub: "AI delegeert aan AI", pts: 400, yr: "2026", cat: "model", news: "AI delegeert taken aan andere AI's — autonome samenwerking begint" },
  { name: "AI Girlfriend Ban", sub: "EU verbiedt AI-relaties", pts: 400, yr: "2026", cat: "policy", news: "EU stelt regels op voor emotionele AI — 'AI-vriendinnen' aan banden gelegd" },
  { name: "AI Workforce 30%", sub: "Bedrijfsadoptie explodeert", pts: 350, yr: "2026", cat: "business", news: "30% van kenniswerk wordt door AI-agents ondersteund" },
  { name: "Vibe Coding", sub: "Iedereen codeert met AI", pts: 450, yr: "2026", cat: "culture", news: "Vibe coding wordt mainstream — non-techies bouwen apps met AI in minuten" },
];

// ─── Attack wave themes ───
const WAVE_THEMES = [
  { name: "LEGACY SYSTEMS", enemies: ["Legacy Code", "Spaghetti", "COBOL", "Mainframe"], c: "#ff5577", shape: "skull", patterns: ["straight", "zigzag"] },
  { name: "COMPLIANCE STORM", enemies: ["GDPR", "Audit", "Compliance", "Red Tape"], c: "#ff6b6b", shape: "shield", patterns: ["straight", "bounce"], mod: "armored" },
  { name: "BUDGET CUTS", enemies: ["Budget Cut", "Bezuiniging", "ROI Twijfel", "Cost Overrun"], c: "#ff9f43", shape: "bolt", patterns: ["dive", "swoop"], mod: "fast" },
  { name: "WEERSTAND", enemies: ["Weerstand", "Skepticus", "Angst", "Status Quo"], c: "#ff4d6a", shape: "wall", patterns: ["straight", "bounce"] },
  { name: "DATA CHAOS", enemies: ["Data Debt", "Silos", "Excel Hell", "Dirty Data"], c: "#ff7788", shape: "bug", patterns: ["zigzag", "orbit"] },
  { name: "SCOPE CREEP", enemies: ["Scope Creep", "Feature Bloat", "Deadline", "Overbelast"], c: "#ff5577", shape: "gear", patterns: ["orbit", "swoop"], mod: "miniboss" },
  { name: "BUREAUCRATIE", enemies: ["Bureaucratie", "Papiermolen", "Handtekening", "Vergadering"], c: "#ff6b6b", shape: "stamp", patterns: ["straight", "zigzag"] },
];

// ─── Wave formations ───
const FORMATIONS = [
  // V
  () => [{ dx: 0, dy: 0 }, { dx: -55, dy: -40 }, { dx: 55, dy: -40 }, { dx: -110, dy: -80 }, { dx: 110, dy: -80 }],
  // Line
  () => [{ dx: -120, dy: 0 }, { dx: -60, dy: 0 }, { dx: 0, dy: 0 }, { dx: 60, dy: 0 }, { dx: 120, dy: 0 }],
  // Diamond
  () => [{ dx: 0, dy: -50 }, { dx: -55, dy: 0 }, { dx: 55, dy: 0 }, { dx: 0, dy: 50 }],
  // Stagger
  () => [{ dx: -90, dy: 0 }, { dx: -30, dy: -45 }, { dx: 30, dy: 0 }, { dx: 90, dy: -45 }],
  // Wall + gap
  () => { const g = Math.floor(Math.random() * 5); return Array.from({ length: 6 }, (_, i) => ({ dx: -150 + i * 60, dy: 0 })).filter((_, i) => i !== g && i !== g + 1); },
  // Circle
  () => Array.from({ length: 6 }, (_, i) => ({ dx: Math.cos(i * Math.PI / 3) * 75, dy: Math.sin(i * Math.PI / 3) * 75 })),
  // Arrow pointing down
  () => [{ dx: 0, dy: 0 }, { dx: -50, dy: -50 }, { dx: 50, dy: -50 }, { dx: -100, dy: -50 }, { dx: 100, dy: -50 }],
];

const WEAPON_POWERUPS = [
  { name: "HOMING", desc: "Auto-seek raketten", c: "#ff9f43", dur: 350, wtype: "homing" },
  { name: "RAPID", desc: "Snelvuur modus", c: "#ff6b9d", dur: 300, wtype: "rapid" },
  { name: "TRIPLE", desc: "Drie lasers breed", c: "#45b7d1", dur: 320, wtype: "triple" },
];
const UTIL_POWERUPS = [
  { name: "SHIELD", desc: "Onkwetsbaar", c: "#00e45f", dur: 240, utype: "shield" },
  { name: "2x SCORE", desc: "Dubbele punten", c: "#ffd700", dur: 260, utype: "x2" },
];
const ALL_POWERUPS = [...WEAPON_POWERUPS, ...UTIL_POWERUPS];

const YEARS = ["2022", "2023", "2024", "2025", "2026"];
const YEAR_SUBS = { "2022": "THE SPARK", "2023": "THE RACE BEGINS", "2024": "REASONING ERA", "2025": "YEAR OF AGENTS", "2026": "FULL AUTONOMY" };
const YEAR_BG = {
  "2022": ["#050a14", "#0a1628", "#0d1a30"],
  "2023": ["#060a18", "#0c1630", "#101e3a"],
  "2024": ["#0a081e", "#1a103a", "#221440"],
  "2025": ["#060e14", "#0a1a28", "#0e2830"],
  "2026": ["#040e0a", "#081e14", "#0c2a1a"],
};

// ─── Audio ───
let audioCtx = null;
function getAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function playTone(f, d, t = "sine", v = 0.08) {
  try { const c = getAudio(), o = c.createOscillator(), g = c.createGain(); o.type = t; o.frequency.setValueAtTime(f, c.currentTime); g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); } catch {}
}
function sfxShoot() { playTone(1200, 0.06, "square", 0.03); }
function sfxCollect() { playTone(523, 0.15, "sine", 0.08); setTimeout(() => playTone(659, 0.12, "sine", 0.07), 70); setTimeout(() => playTone(880, 0.2, "sine", 0.06), 140); }
function sfxHit() { playTone(100, 0.3, "sawtooth", 0.1); }
function sfxExplode() { playTone(80, 0.3, "sawtooth", 0.08); setTimeout(() => playTone(50, 0.4, "sawtooth", 0.05), 120); }
function sfxPowerup() { playTone(660, 0.08, "sine", 0.06); setTimeout(() => playTone(990, 0.08, "sine", 0.06), 50); setTimeout(() => playTone(1320, 0.12, "sine", 0.05), 100); }
function sfxYear() { playTone(330, 0.3, "sine", 0.06); setTimeout(() => playTone(440, 0.3, "sine", 0.05), 200); setTimeout(() => playTone(660, 0.5, "sine", 0.05), 400); }
function sfxWaveWarn() { playTone(220, 0.15, "square", 0.04); setTimeout(() => playTone(220, 0.15, "square", 0.04), 200); }
function sfxWaveClear() { playTone(440, 0.1, "sine", 0.06); setTimeout(() => playTone(660, 0.1, "sine", 0.06), 70); setTimeout(() => playTone(880, 0.15, "sine", 0.05), 140); }
function sfxBoss() { playTone(80, 0.6, "sawtooth", 0.1); setTimeout(() => playTone(100, 0.6, "sawtooth", 0.08), 300); }
function sfxBossHit() { playTone(200, 0.12, "square", 0.05); }
function sfxVictory() { [440, 554, 659, 880, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.5, "sine", 0.07), i * 140)); }

// ─── Leaderboard API ───
const API_URL = "/api/scores";
async function submitScore(n, s, c, y) { try { await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: n, score: s, collected: c.length, year: y, ts: Date.now() }) }); } catch {} }
async function fetchScores() { try { const r = await fetch(API_URL); return r.ok ? await r.json() : []; } catch { return []; } }

// ─── Obstacle movement patterns ───
const PATTERNS = ["straight", "zigzag", "swoop", "orbit", "dive", "bounce"];

// ─── Game factory ───
function createGame() {
  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.3, v: Math.random() * 2 + 0.5, tw: Math.random() * Math.PI * 2,
  }));
  const nebulae = Array.from({ length: 5 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 80 + Math.random() * 120,
    c: ["#6b9fe8", "#d4a0ff", "#00e45f", "#ff6b9d", "#45b7d1"][Math.floor(Math.random() * 5)],
    v: 0.15 + Math.random() * 0.2,
  }));
  return {
    x: W / 2, tx: W / 2, y: H - 120, ty: H - 120,
    speed: 2, dist: 0, score: 0, hp: 5, combo: 0, comboT: 0,
    collected: [], obstacles: [], bullets: [], sparks: [], texts: [],
    stars, nebulae, trail: [], gridY: 0, frame: 0,
    shake: 0, flash: 0, flashC: "#00e45f", over: false,
    yearBanner: null, yearBannerT: 0, lastYear: "", curYear: "2022",
    speedLines: [], tilt: 0,
    // Weapons
    weapon: "laser", weaponT: 0, shootCD: 0,
    shieldActive: false, scoreMultiplier: 1,
    powerupName: null, powerupT: 0,
    // Portal
    mIdx: 0, portal: null,
    // Achievement toast
    toast: null, toastT: 0,
    // Wave system (decoupled)
    waveCD: 30, waveActive: false, waveNum: 0,
    waveWarning: null, waveWarnT: 0, waveTheme: null,
    // Powerup items
    powerItems: [],
    // Random powerup spawn timer
    puSpawnT: 200 + Math.floor(Math.random() * 150),
    // Boss
    boss: null, bossPhase: false, bossDefeated: false,
    shipLevel: 0,
    rockets: [],
    // Hints
    hintMove: 180, hintShoot: 250, hintMoved: false, hintShot: false,
    // Capture freeze
    freezeT: 0, freezeC: "#00e45f",
  };
}

// ─── Draw helpers ───
function drawHex(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 6; i === 0 ? ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  ctx.closePath();
}

function drawShip(ctx, g, x, y) {
  const lvl = g.shipLevel;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(g.tilt);

  if (g.shieldActive) {
    ctx.strokeStyle = `rgba(0,228,95,${0.25 + Math.sin(g.frame * 0.1) * 0.1})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 32 + lvl * 2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(0,228,95,0.04)";
    ctx.beginPath(); ctx.arc(0, 0, 32 + lvl * 2, 0, Math.PI * 2); ctx.fill();
  }

  const flameH = 24 + Math.sin(g.frame * 0.5) * 8 + g.speed * 2 + lvl * 3;
  const fc = g.shieldActive ? "0,228,95" : "107,159,232";
  const fg = ctx.createLinearGradient(0, 16, 0, 16 + flameH);
  fg.addColorStop(0, `rgba(${fc},0.7)`); fg.addColorStop(0.5, `rgba(${fc},0.2)`); fg.addColorStop(1, "transparent");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.moveTo(-10 - lvl, 20); ctx.lineTo(10 + lvl, 20);
  ctx.lineTo(3 + Math.sin(g.frame * 0.3) * 3, 20 + flameH);
  ctx.lineTo(-3 + Math.sin(g.frame * 0.3 + 1) * 3, 20 + flameH);
  ctx.fill();

  if (lvl >= 2) {
    ctx.fillStyle = "rgba(212,160,255,0.2)";
    ctx.beginPath(); ctx.moveTo(-20 - lvl, 16); ctx.lineTo(-14, 16); ctx.lineTo(-16, 16 + flameH * 0.4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(20 + lvl, 16); ctx.lineTo(14, 16); ctx.lineTo(16, 16 + flameH * 0.4); ctx.fill();
  }

  const bw = 18 + lvl * 2, bh = 26 + lvl * 2;
  const sg = ctx.createLinearGradient(0, -bh, 0, 22);
  sg.addColorStop(0, "#8bb8f0"); sg.addColorStop(0.3, "#5a8fd4"); sg.addColorStop(0.7, "#3d6abf"); sg.addColorStop(1, "#1e3a6e");
  ctx.fillStyle = sg; ctx.strokeStyle = "#b8d4f5"; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -bh); ctx.lineTo(-9, -bh + 16); ctx.lineTo(-bw, 20); ctx.lineTo(-10, 15); ctx.lineTo(0, 22); ctx.lineTo(10, 15); ctx.lineTo(bw, 20); ctx.lineTo(9, -bh + 16);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  if (lvl >= 3) {
    ctx.fillStyle = "#3d6abf"; ctx.strokeStyle = "#6b9fe8"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-bw, 20); ctx.lineTo(-bw - 10, 14); ctx.lineTo(-bw - 6, 6); ctx.lineTo(-14, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bw, 20); ctx.lineTo(bw + 10, 14); ctx.lineTo(bw + 6, 6); ctx.lineTo(14, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  const cockC = g.shieldActive ? "#00e45f" : lvl >= 4 ? "#ffd700" : "#6b9fe8";
  ctx.fillStyle = cockC; ctx.shadowColor = cockC; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(0, -8, 5.5 + lvl * 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(184,212,245,0.2)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-6, -6); ctx.lineTo(-bw + 3, 17); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6, -6); ctx.lineTo(bw - 3, 17); ctx.stroke();

  ctx.restore();
}

// ─── Styles ───
const S = {
  page: { height: "100vh", width: "100vw", background: "#060c18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New', monospace", color: "#f0f4f9", overflow: "hidden", position: "relative" },
  glow: (c, b = 30) => ({ textShadow: `0 0 ${b}px ${c}40` }),
};

function AnimatedBG() {
  const cvs = useRef(null);
  useEffect(() => {
    const el = cvs.current; if (!el) return;
    const ctx = el.getContext("2d");
    let f = 0, raf;
    const ps = Array.from({ length: 40 }, () => ({ x: Math.random() * 700, y: Math.random() * 900, vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.5 - 0.2, r: Math.random() * 2 + 0.5, c: ["#6b9fe8", "#00e45f", "#d4a0ff", "#ff6b9d"][Math.floor(Math.random() * 4)] }));
    function draw() { f++; ctx.clearRect(0, 0, 700, 900); ps.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.y < -10) { p.y = 910; p.x = Math.random() * 700; } ctx.globalAlpha = 0.15 + Math.sin(f * 0.02 + p.x) * 0.1; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1; raf = requestAnimationFrame(draw); }
    draw(); return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={cvs} width={700} height={900} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4, pointerEvents: "none" }} />;
}

// ─── MAIN APP ───
export default function App() {
  const [screen, setScreen] = useState("name");
  const [introPage, setIntroPage] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [endData, setEndData] = useState(null);
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const cvs = useRef(null);
  const game = useRef(null);
  const keys = useRef({});
  const raf = useRef(0);
  const touch = useRef(null);
  const nameRef = useRef("");
  const touchShoot = useRef(false);

  const loadScores = useCallback(async () => { setLoadingScores(true); setScores(await fetchScores()); setLoadingScores(false); }, []);
  const startGame = useCallback(() => { game.current = createGame(); setEndData(null); setScreen("play"); }, []);
  const goMenu = useCallback(() => { if (!playerName.trim()) return; nameRef.current = playerName.trim(); setIntroPage(0); setScreen("menu"); }, [playerName]);

  useEffect(() => {
    const on = (e) => { keys.current[e.key] = true; if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault(); };
    const off = (e) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", on); window.addEventListener("keyup", off);
    return () => { window.removeEventListener("keydown", on); window.removeEventListener("keyup", off); };
  }, []);

  // ═══════════════════════════════════════════
  //  GAME LOOP
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (screen !== "play") { cancelAnimationFrame(raf.current); return; }
    const el = cvs.current; if (!el) return;
    const ctx = el.getContext("2d"); if (!ctx) return;

    function tick() {
      const g = game.current;
      if (!g || g.over) return;
      // Micro-freeze on capture
      if (g.freezeT > 0) { g.freezeT--; raf.current = requestAnimationFrame(tick); return; }
      g.frame++;
      const TOTAL = 16000;

      g.speed = Math.min(6, 2 + g.dist * 0.00015);
      g.dist += g.speed;
      const prog = Math.min(1, g.dist / TOTAL);

      // Year
      const yi = Math.min(4, Math.floor(prog * 5));
      g.curYear = YEARS[yi];
      if (g.curYear !== g.lastYear) {
        g.yearBanner = g.curYear; g.yearBannerT = 140; g.lastYear = g.curYear;
        sfxYear();
      }
      if (g.yearBannerT > 0) g.yearBannerT--;

      g.shipLevel = Math.min(4, Math.floor(g.collected.length / 8));

      // Powerup timers
      if (g.weaponT > 0) { g.weaponT--; if (g.weaponT <= 0) g.weapon = "laser"; }
      if (g.powerupT > 0) { g.powerupT--; if (g.powerupT <= 0) { g.shieldActive = false; g.scoreMultiplier = 1; g.powerupName = null; } }

      // Toast timer
      if (g.toastT > 0) g.toastT--;
      if (g.toastT <= 0) g.toast = null;

      // ─── INPUT: 2D ───
      const k = keys.current;
      let mx = 0, my = 0;
      if (k.ArrowLeft || k.a) mx = -1;
      if (k.ArrowRight || k.d) mx = 1;
      if (k.ArrowUp || k.w) my = -1;
      if (k.ArrowDown || k.s) my = 1;
      if (mx !== 0 || my !== 0) g.hintMoved = true;
      g.tx += mx * 8;
      g.ty += my * 8;
      if (touch.current) { g.tx += (touch.current.x - g.x) * 0.15; g.ty += (touch.current.y - g.y) * 0.15; }
      g.tx = Math.max(30, Math.min(W - 30, g.tx));
      g.ty = Math.max(H * 0.3, Math.min(H - 40, g.ty));
      g.x += (g.tx - g.x) * 0.18;
      g.y += (g.ty - g.y) * 0.18;
      g.tilt += (mx * 0.22 - g.tilt) * 0.12;

      // ─── SHOOTING ───
      if (g.shootCD > 0) g.shootCD--;
      const wantShoot = k[" "] || touchShoot.current;
      if (wantShoot) g.hintShot = true;
      if (wantShoot && g.shootCD <= 0) {
        sfxShoot();
        if (g.weapon === "triple") {
          g.shootCD = 10;
          g.bullets.push({ x: g.x - 8, y: g.y - 22, vx: -2, vy: -13, c: "#45b7d1", s: 3.5 });
          g.bullets.push({ x: g.x, y: g.y - 25, vx: 0, vy: -14, c: "#45b7d1", s: 3.5 });
          g.bullets.push({ x: g.x + 8, y: g.y - 22, vx: 2, vy: -13, c: "#45b7d1", s: 3.5 });
        } else if (g.weapon === "homing") {
          g.shootCD = 12;
          g.rockets.push({ x: g.x, y: g.y - 22, vx: (Math.random() - 0.5) * 2, vy: -7, c: "#ff9f43", s: 5, life: 140, trail: [] });
        } else if (g.weapon === "rapid") {
          g.shootCD = 3;
          g.bullets.push({ x: g.x + (Math.random() - 0.5) * 8, y: g.y - 22, vx: (Math.random() - 0.5) * 0.5, vy: -15, c: "#ff6b9d", s: 2.8 });
        } else {
          g.shootCD = 8;
          g.bullets.push({ x: g.x, y: g.y - 22, vx: 0, vy: -12, c: "#6b9fe8", s: 3.5 });
        }
      }

      g.bullets = g.bullets.filter(b => { b.x += b.vx; b.y += b.vy; return b.y > -20 && b.y < H + 20 && b.x > -20 && b.x < W + 20; });

      // Homing rockets
      g.rockets = g.rockets.filter(r => {
        r.life--;
        if (r.life <= 0) return false;
        let nearest = null, nd = Infinity;
        g.obstacles.forEach(o => { const d = Math.hypot(o.x - r.x, o.y - r.y); if (d < nd) { nd = d; nearest = o; } });
        if (g.boss && !g.boss.dead) { const d = Math.hypot(g.boss.x - r.x, g.boss.y - r.y); if (d < nd) { nd = d; nearest = g.boss; } }
        if (nearest && nd < 350) { const dx = nearest.x - r.x, dy = nearest.y - r.y, d = Math.hypot(dx, dy); r.vx += (dx / d) * 0.7; r.vy += (dy / d) * 0.7; }
        r.vx *= 0.97; r.vy *= 0.97;
        const spd = Math.hypot(r.vx, r.vy);
        if (spd < 5) { r.vx *= 5 / spd; r.vy *= 5 / spd; }
        r.x += r.vx; r.y += r.vy;
        r.trail.push({ x: r.x, y: r.y, l: 14 });
        r.trail = r.trail.filter(t => { t.l--; return t.l > 0; });
        return r.y > -30 && r.y < H + 30 && r.x > -30 && r.x < W + 30;
      });

      // Trail + environment
      if (g.frame % 2 === 0) g.trail.push({ x: g.x, y: g.y + 22, l: 20, c: g.shieldActive ? "#00e45f" : "#6b9fe8" });
      g.trail = g.trail.filter(t => { t.y += 2.5; t.l--; return t.l > 0; });
      if (g.speed > 3 && g.frame % 2 === 0) g.speedLines.push({ x: Math.random() * W, y: -10, l: 20 + Math.random() * 50, v: g.speed * 3 });
      g.speedLines = g.speedLines.filter(s => { s.y += s.v; return s.y < H + 50; });
      g.gridY = (g.gridY + g.speed * 1.2) % 50;
      g.stars.forEach(s => { s.y += s.v * g.speed * 0.3; s.tw += 0.03; if (s.y > H) { s.y = 0; s.x = Math.random() * W; } });
      g.nebulae.forEach(n => { n.y += n.v * g.speed * 0.2; if (n.y > H + n.r) { n.y = -n.r; n.x = Math.random() * W; } });

      // ─── PORTAL SPAWNING (smooth, no freeze) ───
      if (!g.portal && g.mIdx < TIMELINE.length && !g.bossPhase) {
        const nextDist = (g.mIdx + 1) * (TOTAL / (TIMELINE.length + 3));
        if (g.dist >= nextDist) {
          const m = TIMELINE[g.mIdx];
          g.portal = { ...m, c: CAT_COLORS[m.cat], idx: g.mIdx, y: -60, pulse: 0 };
          g.mIdx++;
        }
      }

      if (g.portal) {
        g.portal.y += g.speed * 1.3;
        g.portal.pulse++;

        // Capture — pass through portal
        if (Math.abs(g.portal.y - g.y) < 40) {
          g.combo++; g.comboT = 150;
          const mul = Math.min(5, g.combo) * g.scoreMultiplier;
          const p = Math.round(g.portal.pts * mul);
          g.score += p;
          g.collected.push(g.portal);
          sfxCollect();

          // Micro-freeze for impact
          g.freezeT = 4;

          // BIG particle burst along full width
          for (let j = 0; j < 50; j++) {
            g.sparks.push({ x: Math.random() * W, y: g.portal.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 7 - 3, l: 45, c: g.portal.c, s: Math.random() * 4 + 2 });
          }
          // Burst around player
          for (let j = 0; j < 25; j++) {
            const a = (Math.PI * 2 / 25) * j;
            g.sparks.push({ x: g.x, y: g.y, vx: Math.cos(a) * (4 + Math.random() * 4), vy: Math.sin(a) * (4 + Math.random() * 4), l: 35, c: g.portal.c, s: Math.random() * 4 + 1.5 });
          }

          g.flash = 16; g.flashC = g.portal.c;
          g.texts.push({ x: W / 2, y: g.portal.y - 30, t: "+" + p, l: 65, c: g.portal.c, sub: g.combo > 1 ? g.combo + "x COMBO" : "", big: g.portal.name });
          g.portal = null;
        } else if (g.portal.y > H + 40) {
          // MISSED — negative feedback
          g.combo = 0;
          g.flash = 10; g.flashC = "#ff4d6a";
          g.texts.push({ x: W / 2, y: H - 60, t: "MISSED!", l: 50, c: "#ff4d6a", sub: "", big: "" });
          sfxHit();
          g.portal = null;
        }
      }

      // ─── WAVE SYSTEM (decoupled from portals) ───
      if (!g.bossPhase) {
        if (g.waveWarnT > 0 && !g.portal) g.waveWarnT--;

        if (!g.waveActive) {
          if (!g.portal) g.waveCD--;
          if (g.waveCD <= 0 && !g.portal) {
            g.waveNum++;
            const theme = WAVE_THEMES[Math.floor(Math.random() * WAVE_THEMES.length)];
            const form = FORMATIONS[Math.floor(Math.random() * FORMATIONS.length)]();
            const cx = 140 + Math.random() * (W - 280);

            g.waveTheme = theme;
            g.waveWarning = theme.name;
            g.waveWarnT = 120;
            sfxWaveWarn();

            const isFast = theme.mod === "fast";
            const isArmored = theme.mod === "armored";
            const isMiniboss = theme.mod === "miniboss";
            form.forEach((pos, idx) => {
              const enemyName = theme.enemies[Math.floor(Math.random() * theme.enemies.length)];
              const pattern = theme.patterns[Math.floor(Math.random() * theme.patterns.length)];
              let hp = 1 + Math.floor(g.waveNum / 5);
              if (isArmored) hp += 1;
              let isMini = false;
              if (isMiniboss && idx === 0) { hp += 4; isMini = true; }
              const spawnX = Math.max(40, Math.min(W - 40, cx + pos.dx));
              g.obstacles.push({
                x: spawnX, y: -60 + pos.dy,
                name: isMini ? "MINI-BOSS" : enemyName, c: theme.c, hp, curHp: hp,
                pattern, age: 0, startX: spawnX,
                shape: theme.shape, fast: isFast, mini: isMini,
                orbitCx: spawnX, orbitR: 40 + Math.random() * 30,
              });
            });
            g.waveActive = true;
          }
        } else {
          if (g.obstacles.filter(o => !o.bossSpawn).length === 0) {
            g.waveActive = false;
            g.waveCD = 80 + Math.max(0, 50 - g.waveNum * 2);
            g.score += 100 * g.scoreMultiplier;
            sfxWaveClear();
            g.texts.push({ x: W / 2, y: H * 0.4, t: "WAVE " + g.waveNum + " CLEAR!", l: 55, c: "#00e45f", sub: "+100", big: "" });

            // Drop powerup after wave (35% chance)
            if (Math.random() < 0.35) {
              const pu = ALL_POWERUPS[Math.floor(Math.random() * ALL_POWERUPS.length)];
              g.powerItems.push({ x: W / 2 + (Math.random() - 0.5) * 200, y: -40, ...pu, pulse: 0 });
            }
          }
        }

        // Random powerup spawn between waves
        g.puSpawnT--;
        if (g.puSpawnT <= 0) {
          g.puSpawnT = 250 + Math.floor(Math.random() * 200);
          const pu = ALL_POWERUPS[Math.floor(Math.random() * ALL_POWERUPS.length)];
          g.powerItems.push({ x: 60 + Math.random() * (W - 120), y: -40, ...pu, pulse: 0 });
        }
      }

      // ─── Move obstacles with patterns ───
      g.obstacles = g.obstacles.filter(o => {
        o.age++;
        const spd = o.fast ? g.speed * 1.8 : g.speed * 1.3;
        o.y += spd;
        if (o.pattern === "zigzag") o.x = o.startX + Math.sin(o.age * 0.055) * 65;
        else if (o.pattern === "swoop" && o.age > 25 && o.age < 80) o.x += (g.x - o.x) * 0.018;
        else if (o.pattern === "orbit") o.x = (o.orbitCx || o.startX) + Math.sin(o.age * 0.04) * (o.orbitR || 50);
        else if (o.pattern === "dive" && o.age > 30) { o.x += (g.x - o.x) * 0.035; o.y += 1.5; }
        else if (o.pattern === "bounce") { o.x = o.startX + Math.sin(o.age * 0.055) * 65; if (o.x < 30 || o.x > W - 30) o.startX = W / 2; }
        o.x = Math.max(25, Math.min(W - 25, o.x));
        // Push enemies away from portal so they don't visually overlap
        if (g.portal && Math.abs(o.y - g.portal.y) < 60) {
          o.y += (o.y < g.portal.y ? -2.5 : 2.5);
        }
        return o.y < H + 60;
      });

      // Move powerups
      g.powerItems.forEach(p => { p.y += g.speed * 0.9; p.pulse++; });
      g.powerItems = g.powerItems.filter(p => p.y < H + 60);

      // ─── Bullet-obstacle collisions ───
      g.obstacles.forEach(o => {
        for (let i = g.bullets.length - 1; i >= 0; i--) {
          const b = g.bullets[i];
          if (Math.abs(b.x - o.x) < 24 && Math.abs(b.y - o.y) < 24) {
            g.bullets.splice(i, 1); o.curHp--;
            for (let j = 0; j < 5; j++) g.sparks.push({ x: b.x, y: b.y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, l: 14, c: o.c, s: 2 });
            break;
          }
        }
        for (let i = g.rockets.length - 1; i >= 0; i--) {
          const r = g.rockets[i];
          if (Math.abs(r.x - o.x) < 28 && Math.abs(r.y - o.y) < 28) {
            g.rockets.splice(i, 1); o.curHp -= 3;
            for (let j = 0; j < 10; j++) g.sparks.push({ x: r.x, y: r.y, vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8, l: 20, c: "#ff9f43", s: 2.5 });
            break;
          }
        }
      });

      // Remove dead obstacles
      g.obstacles = g.obstacles.filter(o => {
        if (o.curHp <= 0) {
          g.score += 50 * g.scoreMultiplier; sfxExplode();
          for (let j = 0; j < 18; j++) { const a = (Math.PI * 2 / 18) * j; g.sparks.push({ x: o.x, y: o.y, vx: Math.cos(a) * (3 + Math.random() * 3), vy: Math.sin(a) * (3 + Math.random() * 3), l: 28, c: o.c, s: Math.random() * 3 + 1 }); }
          g.texts.push({ x: o.x, y: o.y, t: "+50", l: 30, c: "#ff9f43", sub: "", big: "" });
          return false;
        }
        return true;
      });

      // ─── Player-obstacle collision ───
      g.obstacles.forEach(o => {
        if (Math.abs(o.x - g.x) < 22 && Math.abs(o.y - g.y) < 22) {
          if (g.shieldActive) {
            o.curHp = 0;
            g.texts.push({ x: g.x, y: g.y - 30, t: "BLOCKED!", l: 40, c: "#00e45f", sub: "", big: "" });
          } else {
            g.hp--; g.shake = 20; g.combo = 0; sfxHit();
            g.flashC = "#ff4d6a"; g.flash = 12;
            for (let j = 0; j < 18; j++) g.sparks.push({ x: g.x, y: g.y, vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, l: 30, c: "#ff4d6a", s: Math.random() * 3 + 1 });
            g.texts.push({ x: g.x, y: g.y - 30, t: o.name, l: 50, c: "#ff4d6a", sub: "-1 HP", big: "" });
            o.curHp = 0;
            if (g.hp <= 0) {
              g.over = true;
              setEndData({ score: g.score, collected: g.collected, year: g.curYear, total: TIMELINE.length, name: nameRef.current });
              submitScore(nameRef.current, g.score, g.collected, g.curYear);
              setScreen("end");
            }
          }
        }
      });

      // ─── Player-powerup collision ───
      g.powerItems = g.powerItems.filter(p => {
        if (Math.abs(p.x - g.x) < 30 && Math.abs(p.y - g.y) < 30) {
          sfxPowerup(); g.flash = 6; g.flashC = p.c;
          if (p.wtype) { g.weapon = p.wtype; g.weaponT = p.dur; }
          if (p.utype === "shield") { g.shieldActive = true; g.powerupT = p.dur; g.powerupName = "SHIELD"; }
          if (p.utype === "x2") { g.scoreMultiplier = 2; g.powerupT = p.dur; g.powerupName = "2x SCORE"; }
          for (let j = 0; j < 16; j++) { const a = (Math.PI * 2 / 16) * j; g.sparks.push({ x: p.x, y: p.y, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4, l: 25, c: p.c, s: 2.5 }); }
          g.texts.push({ x: p.x, y: p.y, t: p.name, l: 45, c: p.c, sub: p.desc || "", big: "" });
          return false;
        }
        return true;
      });

      if (g.comboT > 0) g.comboT--; else g.combo = 0;
      g.sparks = g.sparks.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.98; p.l--; return p.l > 0; });
      g.texts = g.texts.filter(t => { t.y -= 1.2; t.l--; return t.l > 0; });

      // ─── BOSS ───
      if (g.dist >= TOTAL && g.mIdx >= TIMELINE.length && !g.portal && !g.bossPhase && !g.bossDefeated) {
        g.bossPhase = true;
        g.boss = { x: W / 2, y: -100, ty: 130, hp: 40, maxHp: 40, phase: 0, timer: 0, dead: false, deathT: 0, attackCD: 0, moveT: 0 };
        sfxBoss();
        g.yearBanner = "AGI"; g.yearBannerT = 140;
      }

      if (g.boss && !g.boss.dead) {
        const b = g.boss;
        b.timer++;
        b.y += (b.ty - b.y) * 0.025;
        b.moveT++;
        b.x = W / 2 + Math.sin(b.moveT * 0.012) * 200;

        if (b.hp < b.maxHp * 0.3) b.phase = 2;
        else if (b.hp < b.maxHp * 0.6) b.phase = 1;

        b.attackCD--;
        if (b.attackCD <= 0 && b.y > 60) {
          b.attackCD = b.phase === 2 ? 20 : b.phase === 1 ? 30 : 40;
          const names = ["Hallucination", "Alignment", "Compute Limit"];
          const count = b.phase === 2 ? 7 : b.phase === 1 ? 3 : 1;
          for (let i = 0; i < count; i++) {
            const ox = b.phase === 2 ? b.x + (i - 3) * 45 : b.phase === 1 ? b.x + (i - 1) * 50 : b.x;
            g.obstacles.push({ x: ox, y: b.y + 55, name: names[b.phase], c: "#ff3366", hp: 1, curHp: 1, pattern: b.phase === 1 ? "swoop" : b.phase === 2 ? "straight" : "zigzag", age: 0, startX: ox, bossSpawn: true });
          }
        }

        for (let i = g.bullets.length - 1; i >= 0; i--) {
          if (Math.abs(g.bullets[i].x - b.x) < 55 && Math.abs(g.bullets[i].y - b.y) < 45) {
            const bu = g.bullets.splice(i, 1)[0]; b.hp--; sfxBossHit(); g.score += 20;
            for (let j = 0; j < 5; j++) g.sparks.push({ x: bu.x, y: bu.y, vx: (Math.random() - .5) * 6, vy: (Math.random() - .5) * 6, l: 15, c: "#ff3366", s: 2 });
          }
        }
        for (let i = g.rockets.length - 1; i >= 0; i--) {
          if (Math.abs(g.rockets[i].x - b.x) < 60 && Math.abs(g.rockets[i].y - b.y) < 50) {
            g.rockets.splice(i, 1); b.hp -= 3; sfxBossHit(); g.score += 60;
            for (let j = 0; j < 10; j++) g.sparks.push({ x: g.boss.x + (Math.random() - .5) * 40, y: g.boss.y + (Math.random() - .5) * 40, vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8, l: 20, c: "#ff9f43", s: 3 });
          }
        }

        if (b.hp <= 0) {
          b.dead = true; b.deathT = 130; sfxExplode(); sfxVictory();
          g.score += g.hp * 500 + 2000;
          for (let j = 0; j < 80; j++) { const a = (Math.PI * 2 / 80) * j, spd = 3 + Math.random() * 7; g.sparks.push({ x: b.x, y: b.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, l: 55, c: ["#ff3366", "#ff9f43", "#ffd700", "#00e45f", "#d4a0ff"][j % 5], s: Math.random() * 5 + 2 }); }
        }
      }

      if (g.boss && g.boss.dead) {
        g.boss.deathT--;
        if (g.boss.deathT % 7 === 0 && g.boss.deathT > 30) {
          const ex = g.boss.x + (Math.random() - .5) * 100, ey = g.boss.y + (Math.random() - .5) * 80;
          for (let j = 0; j < 12; j++) g.sparks.push({ x: ex, y: ey, vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8, l: 25, c: ["#ff3366", "#ffd700"][j % 2], s: 2.5 });
          sfxExplode();
        }
        if (g.boss.deathT <= 0) {
          g.bossDefeated = true; g.over = true;
          setEndData({ score: g.score, collected: g.collected, year: "2026", total: TIMELINE.length, name: nameRef.current, won: true, bossDefeated: true });
          submitScore(nameRef.current, g.score, g.collected, "2026");
          setScreen("end"); return;
        }
      }

      // ═══════════ DRAW ═══════════
      const sx = g.shake > 0 ? (Math.random() - .5) * g.shake * .6 : 0;
      const sy = g.shake > 0 ? (Math.random() - .5) * g.shake * .6 : 0;
      if (g.shake > 0) g.shake--;
      ctx.save();
      ctx.translate(sx, sy);

      // BG
      const bgCols = YEAR_BG[g.curYear] || YEAR_BG["2022"];
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, bgCols[0]); bg.addColorStop(0.5, bgCols[1]); bg.addColorStop(1, bgCols[2]);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Nebulae
      g.nebulae.forEach(n => {
        const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        ng.addColorStop(0, n.c + "08"); ng.addColorStop(1, "transparent");
        ctx.fillStyle = ng; ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
      });

      // Stars
      g.stars.forEach(s => { ctx.globalAlpha = 0.12 + Math.sin(s.tw) * 0.1 + s.r * 0.12; ctx.fillStyle = s.r > 1.2 ? "#b8d4f5" : "#6b9fe8"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.6, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;

      // Flash
      if (g.flash > 0) {
        const fa = Math.min(0.3, g.flash * 0.02);
        ctx.fillStyle = g.flashC; ctx.globalAlpha = fa; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
        g.flash--;
      }

      // Trail
      g.trail.forEach(t => { ctx.globalAlpha = t.l / 22 * 0.08; ctx.fillStyle = t.c; ctx.beginPath(); ctx.arc(t.x, t.y, 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;

      // ═══ PORTAL — THE DOMINANT VISUAL ═══
      if (g.portal) {
        const p = g.portal;
        const pulse = Math.sin(p.pulse * 0.08);
        const gateH = 70;
        const gateTop = p.y - gateH / 2;
        const gateBot = p.y + gateH / 2;

        // Outer glow — wide, soft
        ctx.shadowColor = p.c; ctx.shadowBlur = 50;
        const outerGlow = ctx.createLinearGradient(0, gateTop - 40, 0, gateBot + 40);
        outerGlow.addColorStop(0, "transparent");
        outerGlow.addColorStop(0.2, p.c + "08");
        outerGlow.addColorStop(0.5, p.c + "15");
        outerGlow.addColorStop(0.8, p.c + "08");
        outerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = outerGlow; ctx.fillRect(0, gateTop - 40, W, gateH + 80);

        // Top bar — thick, bright
        ctx.shadowBlur = 35;
        ctx.strokeStyle = p.c; ctx.lineWidth = 4 + pulse;
        ctx.beginPath(); ctx.moveTo(20, gateTop); ctx.lineTo(W - 20, gateTop); ctx.stroke();
        // Bottom bar
        ctx.beginPath(); ctx.moveTo(20, gateBot); ctx.lineTo(W - 20, gateBot); ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner glow fill between bars
        const innerGlow = ctx.createLinearGradient(0, gateTop, 0, gateBot);
        innerGlow.addColorStop(0, p.c + "20");
        innerGlow.addColorStop(0.5, p.c + "0c");
        innerGlow.addColorStop(1, p.c + "20");
        ctx.fillStyle = innerGlow; ctx.fillRect(20, gateTop, W - 40, gateH);

        // Thick side pillars
        ctx.fillStyle = p.c + "90";
        ctx.fillRect(8, gateTop - 8, 8, gateH + 16);
        ctx.fillRect(W - 16, gateTop - 8, 8, gateH + 16);
        // Pillar caps
        ctx.fillStyle = p.c;
        ctx.fillRect(6, gateTop - 12, 12, 5);
        ctx.fillRect(6, gateBot + 7, 12, 5);
        ctx.fillRect(W - 18, gateTop - 12, 12, 5);
        ctx.fillRect(W - 18, gateBot + 7, 12, 5);

        // Corner accents
        ctx.strokeStyle = p.c; ctx.lineWidth = 3;
        const cSz = 16;
        // Top-left
        ctx.beginPath(); ctx.moveTo(20, gateTop + cSz); ctx.lineTo(20, gateTop); ctx.lineTo(20 + cSz, gateTop); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(W - 20, gateTop + cSz); ctx.lineTo(W - 20, gateTop); ctx.lineTo(W - 20 - cSz, gateTop); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(20, gateBot - cSz); ctx.lineTo(20, gateBot); ctx.lineTo(20 + cSz, gateBot); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(W - 20, gateBot - cSz); ctx.lineTo(W - 20, gateBot); ctx.lineTo(W - 20 - cSz, gateBot); ctx.stroke();

        // ─── Text INSIDE the gate ───
        ctx.textAlign = "center";
        ctx.font = "bold 26px 'Courier New', monospace";
        const headline = p.name + ": " + p.sub;
        const fits = ctx.measureText(headline).width < W - 100;
        ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 20;
        if (fits) {
          ctx.fillText(headline, W / 2, p.y + 8);
        } else {
          ctx.fillText(p.name, W / 2, p.y - 6);
          ctx.fillText(p.sub, W / 2, p.y + 22);
        }
        ctx.shadowBlur = 0;
      }

      // ═══ OBSTACLES ═══
      g.obstacles.forEach(o => {
        ctx.save(); ctx.translate(o.x, o.y);
        const sz = o.mini ? 30 : 22;
        const rot = o.age * 0.02;
        ctx.shadowColor = o.c; ctx.shadowBlur = o.mini ? 20 : 10;
        ctx.fillStyle = o.c + "20"; ctx.strokeStyle = o.c + "80"; ctx.lineWidth = o.mini ? 3 : 2;
        const sh = o.shape || "diamond";
        if (sh === "skull") {
          ctx.beginPath(); ctx.arc(0, -4, sz * 0.7, Math.PI, 0); ctx.lineTo(sz * 0.5, sz * 0.4); ctx.lineTo(sz * 0.2, sz * 0.25); ctx.lineTo(0, sz * 0.45); ctx.lineTo(-sz * 0.2, sz * 0.25); ctx.lineTo(-sz * 0.5, sz * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = o.c + "90"; ctx.beginPath(); ctx.arc(-5, -3, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(5, -3, 3.5, 0, Math.PI * 2); ctx.fill();
        } else if (sh === "shield") {
          ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz, -sz * 0.3); ctx.lineTo(sz * 0.8, sz * 0.5); ctx.lineTo(0, sz); ctx.lineTo(-sz * 0.8, sz * 0.5); ctx.lineTo(-sz, -sz * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = o.c + "50"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -sz * 0.6); ctx.lineTo(0, sz * 0.5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-sz * 0.5, 0); ctx.lineTo(sz * 0.5, 0); ctx.stroke();
        } else if (sh === "bolt") {
          ctx.beginPath(); ctx.moveTo(2, -sz); ctx.lineTo(sz * 0.7, -sz * 0.2); ctx.lineTo(3, -sz * 0.1); ctx.lineTo(sz * 0.5, sz); ctx.lineTo(-2, sz * 0.1); ctx.lineTo(-sz * 0.5, sz * 0.3); ctx.lineTo(0, -sz * 0.1); ctx.lineTo(-sz * 0.6, -sz * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        } else if (sh === "bug") {
          ctx.beginPath(); ctx.ellipse(0, 0, sz * 0.55, sz * 0.75, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = o.c + "60"; ctx.lineWidth = 1.5;
          for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-sz * 0.55, i * 8); ctx.lineTo(-sz, i * 8 - 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sz * 0.55, i * 8); ctx.lineTo(sz, i * 8 - 5); ctx.stroke(); }
          ctx.fillStyle = o.c + "90"; ctx.beginPath(); ctx.arc(-5, -6, 3, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(5, -6, 3, 0, Math.PI * 2); ctx.fill();
        } else if (sh === "gear") {
          ctx.save(); ctx.rotate(rot);
          ctx.beginPath();
          for (let i = 0; i < 8; i++) { const a = (Math.PI / 4) * i, ro = i % 2 === 0 ? sz : sz * 0.65; ctx.lineTo(Math.cos(a) * ro, Math.sin(a) * ro); }
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = o.c + "10"; ctx.beginPath(); ctx.arc(0, 0, sz * 0.35, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = o.c + "60"; ctx.beginPath(); ctx.arc(0, 0, sz * 0.35, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        } else if (sh === "wall") {
          ctx.fillRect(-sz, -sz * 0.6, sz * 2, sz * 1.2); ctx.strokeRect(-sz, -sz * 0.6, sz * 2, sz * 1.2);
          ctx.strokeStyle = o.c + "40"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(0, -sz * 0.6); ctx.lineTo(0, sz * 0.6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-sz, 0); ctx.lineTo(sz, 0); ctx.stroke();
        } else if (sh === "stamp") {
          ctx.beginPath(); ctx.arc(0, 0, sz * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = o.c + "60"; ctx.font = "bold " + (sz * 0.6) + "px 'Courier New', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("!", 0, 0);
        } else {
          ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz, 0); ctx.lineTo(0, sz); ctx.lineTo(-sz, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.shadowBlur = 0;

        if (o.curHp > 1) { for (let i = 0; i < Math.min(o.curHp, 8); i++) { ctx.fillStyle = o.c; ctx.beginPath(); ctx.arc(-Math.min(o.curHp, 8) * 3 + 3 + i * 6, -sz - 6, 2.5, 0, Math.PI * 2); ctx.fill(); } }
        if (o.mini) { ctx.strokeStyle = o.c; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, sz + 6, 0, Math.PI * 2); ctx.stroke(); }

        // Only show enemy label briefly after spawn (fade out)
        if (o.age < 30) {
          ctx.globalAlpha = Math.max(0, 1 - o.age / 30);
          ctx.font = "bold 11px 'Courier New', monospace"; ctx.fillStyle = o.c; ctx.textAlign = "center";
          ctx.fillText(o.name, 0, sz + 16);
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      });

      // ═══ POWERUP ITEMS ═══
      g.powerItems.forEach(p => {
        ctx.save(); ctx.translate(p.x, p.y);
        const pulse = Math.sin((p.pulse || 0) * 0.08) * 0.3 + 0.7;
        const R = 26;

        // Pulsing outer ring (makes it clearly a pickup)
        ctx.strokeStyle = p.c + "40"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, R + 8 + pulse * 5, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = p.c + "20"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, 0, R + 14 + pulse * 8, 0, Math.PI * 2); ctx.stroke();

        // Main circle body — clearly different from angular enemies
        ctx.shadowColor = p.c; ctx.shadowBlur = 25;
        ctx.fillStyle = p.c + "18";
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = p.c; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner icon per powerup type
        ctx.fillStyle = p.c; ctx.strokeStyle = p.c; ctx.lineWidth = 2;
        const pn = p.name;
        if (pn === "HOMING") {
          // Rocket icon
          ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(-5, -2); ctx.lineTo(-3, -2); ctx.lineTo(-3, 6); ctx.lineTo(-7, 10); ctx.lineTo(7, 10); ctx.lineTo(3, 6); ctx.lineTo(3, -2); ctx.lineTo(5, -2); ctx.closePath(); ctx.fill();
        } else if (pn === "RAPID") {
          // Triple bullet icon
          for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i * 7, -4 + Math.abs(i) * 3, 3.5, 0, Math.PI * 2); ctx.fill(); }
          ctx.beginPath(); ctx.moveTo(-8, 6); ctx.lineTo(8, 6); ctx.lineTo(0, -2); ctx.closePath(); ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
        } else if (pn === "TRIPLE") {
          // Three arrows up
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath(); ctx.moveTo(i * 8, -10); ctx.lineTo(i * 8 - 4, -2); ctx.lineTo(i * 8 - 1.5, -2); ctx.lineTo(i * 8 - 1.5, 8); ctx.lineTo(i * 8 + 1.5, 8); ctx.lineTo(i * 8 + 1.5, -2); ctx.lineTo(i * 8 + 4, -2); ctx.closePath(); ctx.fill();
          }
        } else if (pn === "SHIELD") {
          // Shield icon
          ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10, -6); ctx.lineTo(10, 2); ctx.quadraticCurveTo(10, 10, 0, 14); ctx.quadraticCurveTo(-10, 10, -10, 2); ctx.lineTo(-10, -6); ctx.closePath();
          ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 8); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.stroke();
        } else if (pn === "2x SCORE") {
          // 2x text as icon
          ctx.font = "bold 18px 'Courier New', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("2×", 0, 0);
        }

        // Label below
        ctx.font = "bold 11px 'Courier New', monospace"; ctx.fillStyle = p.c; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(p.name, 0, R + 6);

        ctx.restore();
      });

      // ═══ BOSS ═══
      if (g.boss && !g.boss.dead) {
        const b = g.boss;
        ctx.save(); ctx.translate(b.x, b.y);
        const bSize = 50 + b.phase * 6;
        ctx.shadowColor = "#ff3366"; ctx.shadowBlur = 35;
        drawHex(ctx, 0, 0, bSize);
        const bGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, bSize);
        bGrad.addColorStop(0, b.phase === 2 ? "#ff336640" : "#ff336625"); bGrad.addColorStop(1, "transparent");
        ctx.fillStyle = bGrad; ctx.fill();
        ctx.strokeStyle = b.phase === 2 ? "#ff3366" : "#ff336690"; ctx.lineWidth = 2 + b.phase; ctx.stroke();
        ctx.shadowBlur = 0;
        drawHex(ctx, 0, 0, bSize * 0.55); ctx.strokeStyle = "#ff336630"; ctx.lineWidth = 1; ctx.stroke();
        ctx.save(); ctx.rotate(b.timer * 0.02); drawHex(ctx, 0, 0, bSize * 0.35); ctx.strokeStyle = "#ff336650"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
        ctx.fillStyle = "#ff3366"; ctx.shadowColor = "#ff3366"; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(0, 0, 9 + b.phase * 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = "bold 18px 'Courier New', monospace"; ctx.fillStyle = "#ff3366"; ctx.textAlign = "center";
        ctx.fillText("A G I", 0, -bSize - 14);
        ctx.font = "10px 'Courier New', monospace"; ctx.fillStyle = "#ff336680";
        ctx.fillText(b.phase === 2 ? "FINAL FORM" : b.phase === 1 ? "REASONING MODE" : "THE SINGULARITY", 0, -bSize - 3);
        const hpW = 160;
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.beginPath(); ctx.roundRect(-hpW / 2 - 2, bSize + 8, hpW + 4, 16, 6); ctx.fill();
        ctx.strokeStyle = "#ff336660"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(-hpW / 2 - 2, bSize + 8, hpW + 4, 16, 6); ctx.stroke();
        const hpFill = Math.max(0, b.hp / b.maxHp) * hpW;
        const hpGrad = ctx.createLinearGradient(-hpW / 2, 0, -hpW / 2 + hpFill, 0);
        hpGrad.addColorStop(0, "#ff3366"); hpGrad.addColorStop(1, b.phase === 2 ? "#ff0000" : "#ff6b9d");
        ctx.fillStyle = hpGrad; ctx.beginPath(); ctx.roundRect(-hpW / 2, bSize + 10, hpFill, 12, 4); ctx.fill();
        ctx.font = "bold 9px 'Courier New', monospace"; ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.fillText(Math.ceil(b.hp) + " / " + b.maxHp, 0, bSize + 20);
        ctx.restore();
      }
      if (g.boss && g.boss.dead && g.boss.deathT > 0) {
        const al = Math.min(1, (130 - g.boss.deathT) / 40);
        ctx.font = "bold 32px 'Courier New', monospace"; ctx.fillStyle = `rgba(0,228,95,${al})`; ctx.textAlign = "center";
        ctx.shadowColor = "#00e45f"; ctx.shadowBlur = 25;
        ctx.fillText("AGI DEFEATED!", W / 2, H / 2 - 25);
        ctx.font = "16px 'Courier New', monospace"; ctx.fillStyle = `rgba(255,215,0,${al})`;
        ctx.fillText("De toekomst is hier", W / 2, H / 2 + 10);
        ctx.shadowBlur = 0;
      }

      // ═══ BULLETS ═══
      g.bullets.forEach(b => {
        ctx.fillStyle = b.c; ctx.shadowColor = b.c; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.s, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = b.c + "40"; ctx.beginPath(); ctx.arc(b.x, b.y + 7, b.s * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ═══ ROCKETS ═══
      g.rockets.forEach(r => {
        r.trail.forEach(t => { ctx.globalAlpha = t.l / 14 * 0.3; ctx.fillStyle = "#ff9f43"; ctx.beginPath(); ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2); ctx.fill(); });
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ff9f43"; ctx.shadowColor = "#ff9f43"; ctx.shadowBlur = 10;
        const angle = Math.atan2(r.vy, r.vx);
        ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(angle + Math.PI / 2);
        ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(-4, 5); ctx.lineTo(4, 5); ctx.closePath(); ctx.fill();
        ctx.restore(); ctx.shadowBlur = 0;
      });

      // Sparks
      g.sparks.forEach(p => { ctx.globalAlpha = Math.max(0, p.l / 45); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;

      // Floating texts
      g.texts.forEach(t => {
        ctx.globalAlpha = Math.min(1, t.l / 15);
        if (t.big) { ctx.font = "bold 24px 'Courier New', monospace"; ctx.fillStyle = t.c + "50"; ctx.textAlign = "center"; ctx.fillText(t.big, t.x, t.y - 35); }
        ctx.font = "bold 18px 'Courier New', monospace"; ctx.fillStyle = t.c; ctx.textAlign = "center"; ctx.fillText(t.t, t.x, t.y);
        if (t.sub) { ctx.font = "bold 12px 'Courier New', monospace"; ctx.fillStyle = "#00e45f"; ctx.fillText(t.sub, t.x, t.y - 20); }
      });
      ctx.globalAlpha = 1;

      // ═══ SHIP ═══
      drawShip(ctx, g, g.x, g.y);

      // ═══ HUD ═══
      const hudH = 72;
      const hudGrad = ctx.createLinearGradient(0, 0, 0, hudH);
      hudGrad.addColorStop(0, "rgba(6,12,24,0.95)"); hudGrad.addColorStop(1, "rgba(6,12,24,0)");
      ctx.fillStyle = hudGrad; ctx.fillRect(0, 0, W, hudH);

      ctx.font = "bold 22px 'Courier New', monospace"; ctx.fillStyle = "#b8d4f5"; ctx.textAlign = "left";
      ctx.fillText(g.score.toLocaleString(), 14, 24);
      ctx.font = "11px 'Courier New', monospace"; ctx.fillStyle = "rgba(184,212,245,0.35)"; ctx.fillText("SCORE", 14, 36);

      ctx.font = "bold 12px 'Courier New', monospace"; ctx.fillStyle = "rgba(0,228,95,0.5)"; ctx.textAlign = "center";
      ctx.fillText(nameRef.current.toUpperCase(), W / 2, 16);

      if (g.combo > 1) { ctx.font = "bold 16px 'Courier New', monospace"; ctx.fillStyle = "#00e45f"; ctx.fillText(Math.min(5, g.combo) + "x COMBO", W / 2, 34); }

      ctx.textAlign = "right";
      for (let i = 0; i < 5; i++) {
        const active = i < g.hp, hx = W - 24 - i * 26;
        ctx.fillStyle = active ? "#6b9fe820" : "rgba(107,159,232,0.06)";
        ctx.beginPath(); ctx.arc(hx, 20, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = active ? "#6b9fe8" : "rgba(107,159,232,0.12)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(hx, 20, 10, 0, Math.PI * 2); ctx.stroke();
        if (active) { ctx.fillStyle = "#b8d4f5"; ctx.beginPath(); ctx.arc(hx, 20, 4.5, 0, Math.PI * 2); ctx.fill(); }
      }

      // Progress bar
      const pbY = 52;
      ctx.fillStyle = "rgba(61,106,191,0.08)"; ctx.beginPath(); ctx.roundRect(14, pbY, W - 28, 9, 4); ctx.fill();
      const pbw = (W - 28) * prog;
      if (pbw > 0) { const pbg = ctx.createLinearGradient(14, 0, 14 + pbw, 0); pbg.addColorStop(0, "#3d6abf"); pbg.addColorStop(1, "#00e45f"); ctx.fillStyle = pbg; ctx.beginPath(); ctx.roundRect(14, pbY, pbw, 9, 4); ctx.fill(); }
      YEARS.forEach((yr, i) => { const px = 14 + (W - 28) * (i / 4); const portalMatch = g.portal && g.portal.yr === yr; const pulse = portalMatch ? 0.7 + Math.sin(g.frame * 0.12) * 0.3 : 0; ctx.font = (i === yi || portalMatch) ? "bold 10px 'Courier New', monospace" : "10px 'Courier New', monospace"; if (portalMatch) { ctx.shadowColor = "#00e45f"; ctx.shadowBlur = 8 + pulse * 6; ctx.fillStyle = "#00e45f"; } else { ctx.shadowBlur = 0; ctx.fillStyle = i === yi ? "#00e45f" : "rgba(240,244,249,0.2)"; } ctx.textAlign = "center"; ctx.fillText(yr, px, pbY - 3); ctx.shadowBlur = 0; });

      // Wave warning — BIG and prominent
      if (g.waveWarnT > 0 && g.waveWarning) {
        const wa = Math.min(1, g.waveWarnT / 15);
        ctx.globalAlpha = wa;
        // Full-width dark background band
        ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, H * 0.22, W, 55);
        // Colored accent lines
        const wc = g.waveTheme?.c || "#ff4d6a";
        ctx.fillStyle = wc + "40"; ctx.fillRect(0, H * 0.22, W, 2); ctx.fillRect(0, H * 0.22 + 53, W, 2);
        // Warning icon + text
        ctx.font = "bold 22px 'Courier New', monospace"; ctx.fillStyle = wc; ctx.textAlign = "center";
        ctx.shadowColor = wc; ctx.shadowBlur = 15;
        ctx.fillText("⚠ INCOMING: " + g.waveWarning + " ⚠", W / 2, H * 0.22 + 28);
        ctx.shadowBlur = 0;
        // Subtext with modifier info
        const modText = g.waveTheme?.mod === "fast" ? "SNEL — Extra snelle vijanden!" : g.waveTheme?.mod === "armored" ? "GEPANTSERD — Extra HP!" : g.waveTheme?.mod === "miniboss" ? "MINI-BOSS — Pas op voor de leider!" : "Schiet ze neer!";
        ctx.font = "12px 'Courier New', monospace"; ctx.fillStyle = wc + "90";
        ctx.fillText(modText, W / 2, H * 0.22 + 46);
        ctx.globalAlpha = 1;
      }

      // Weapon + powerup indicators
      if (g.weapon !== "laser") {
        const wc = g.weapon === "homing" ? "#ff9f43" : g.weapon === "rapid" ? "#ff6b9d" : "#45b7d1";
        ctx.font = "bold 12px 'Courier New', monospace"; ctx.fillStyle = wc; ctx.textAlign = "left";
        ctx.fillText("⚡ " + g.weapon.toUpperCase(), 14, H - 30);
        const maxD = g.weapon === "homing" ? 350 : g.weapon === "rapid" ? 300 : 320;
        ctx.fillStyle = wc + "30"; ctx.fillRect(14, H - 22, 90, 6);
        ctx.fillStyle = wc; ctx.fillRect(14, H - 22, 90 * (g.weaponT / maxD), 6);
      }
      if (g.powerupName) {
        const uc = g.shieldActive ? "#00e45f" : "#ffd700";
        ctx.font = "bold 12px 'Courier New', monospace"; ctx.fillStyle = uc; ctx.textAlign = "right";
        ctx.fillText(g.powerupName, W - 14, H - 30);
        const maxD = g.shieldActive ? 240 : 260;
        ctx.fillStyle = uc + "30"; ctx.fillRect(W - 104, H - 22, 90, 6);
        ctx.fillStyle = uc; ctx.fillRect(W - 104, H - 22, 90 * (g.powerupT / maxD), 6);
      }

      // ─── In-game hints (first seconds, fade when player acts) ───
      if (!g.hintMoved && g.hintMove > 0) {
        g.hintMove--;
        ctx.globalAlpha = Math.min(1, g.hintMove / 30) * 0.6;
        ctx.font = "bold 18px 'Courier New', monospace"; ctx.fillStyle = "#6b9fe8"; ctx.textAlign = "center";
        ctx.fillText("← → ↑ ↓  BEWEGEN", W / 2, H * 0.55);
        ctx.globalAlpha = 1;
      }
      if (!g.hintShot && g.hintShoot > 0) {
        g.hintShoot--;
        const showAt = g.hintMoved || g.hintMove <= 0;
        if (showAt) {
          ctx.globalAlpha = Math.min(1, g.hintShoot / 30) * 0.6;
          ctx.font = "bold 18px 'Courier New', monospace"; ctx.fillStyle = "#ff9f43"; ctx.textAlign = "center";
          ctx.fillText("SPACE  SCHIETEN", W / 2, H * 0.62);
          ctx.globalAlpha = 1;
        }
      }

      // (Achievement toast removed — portal text is enough)

      // ─── Collected counter (simple) ───
      if (g.collected.length > 0) {
        ctx.font = "bold 14px 'Courier New', monospace";
        ctx.fillStyle = "#00e45f"; ctx.textAlign = "right";
        ctx.fillText("✓ " + g.collected.length + "/" + TIMELINE.length, W - 14, H - 10);
      }

      // Year banner
      if (g.yearBannerT > 0 && g.yearBanner) {
        const ba = g.yearBannerT > 110 ? (140 - g.yearBannerT) / 30 : g.yearBannerT < 30 ? g.yearBannerT / 30 : 1;
        ctx.globalAlpha = ba * 0.9;
        const isAGI = g.yearBanner === "AGI";
        ctx.font = "bold 80px 'Courier New', monospace";
        ctx.fillStyle = isAGI ? "#ff3366" : "#00e45f"; ctx.textAlign = "center";
        ctx.shadowColor = isAGI ? "#ff3366" : "#00e45f"; ctx.shadowBlur = 50;
        ctx.fillText(g.yearBanner, W / 2, H / 2 - 15);
        ctx.shadowBlur = 0;
        ctx.font = "bold 16px 'Courier New', monospace"; ctx.fillStyle = isAGI ? "#ff6b9d" : "#b8d4f5";
        ctx.fillText(isAGI ? "FINAL BOSS — DESTROY THE SINGULARITY" : (YEAR_SUBS[g.yearBanner] || ""), W / 2, H / 2 + 25);
        ctx.globalAlpha = 1;
      }

      // Vignette (scanlines removed)
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.8);
      vig.addColorStop(0, "transparent"); vig.addColorStop(1, "rgba(0,0,0,0.25)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

      ctx.restore();
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [screen]);

  // ═══ NAME ENTRY ═══
  if (screen === "name") {
    return (
      <div style={S.page}>
        <AnimatedBG />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem", maxWidth: 520 }}>
          <div style={{ fontSize: "0.85rem", letterSpacing: ".5em", color: "#00e45f", marginBottom: "2.5rem", opacity: 0.7 }}>&SAMHOUD × ADC</div>
          <div style={{ fontSize: "clamp(3rem, 12vw, 5.5rem)", fontWeight: 900, lineHeight: 0.95, marginBottom: "0.8rem" }}>
            <span style={{ color: "#6b9fe8", ...S.glow("#6b9fe8") }}>AI</span>{" "}
            <span style={{ color: "#00e45f", ...S.glow("#00e45f", 50) }}>RACER</span>
          </div>
          <div style={{ fontSize: "1.1rem", color: "rgba(240,244,249,.45)", marginBottom: "3rem", lineHeight: 1.6 }}>Race door de AI-revolutie van 2022 tot 2026</div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.85rem", color: "rgba(240,244,249,.4)", letterSpacing: ".2em", marginBottom: ".8rem" }}>VOER JE NAAM IN</div>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value.slice(0, 16))} onKeyDown={e => { if (e.key === "Enter") goMenu(); }} placeholder="Je naam..." autoFocus
              style={{ background: "rgba(107,159,232,0.06)", border: "1px solid rgba(107,159,232,0.2)", borderRadius: 10, padding: "1rem 1.5rem", color: "#f0f4f9", fontSize: "1.3rem", fontFamily: "'Courier New', monospace", textAlign: "center", outline: "none", width: "min(340px, 80vw)" }}
              onFocus={e => e.target.style.borderColor = "rgba(0,228,95,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(107,159,232,0.2)"} />
          </div>
          <button onClick={goMenu} disabled={!playerName.trim()} style={{ padding: "1rem 3.5rem", border: "2px solid #00e45f", borderRadius: 10, background: playerName.trim() ? "rgba(0,228,95,0.08)" : "rgba(0,228,95,0.02)", color: playerName.trim() ? "#00e45f" : "rgba(0,228,95,0.3)", fontSize: "1.2rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: playerName.trim() ? "pointer" : "default", letterSpacing: ".25em", boxShadow: playerName.trim() ? "0 0 30px rgba(0,228,95,.1)" : "none" }}>ENTER</button>
        </div>
      </div>
    );
  }

  // ═══ MENU — 3 ONBOARDING PAGES ═══
  if (screen === "menu") {
    const dot = (i) => ({ width: 10, height: 10, borderRadius: "50%", background: introPage === i ? "#00e45f" : "rgba(240,244,249,.15)", transition: "background .3s", cursor: "pointer" });
    const btnNext = { padding: "1rem 3rem", border: "2px solid #00e45f", borderRadius: 10, background: "rgba(0,228,95,0.07)", color: "#00e45f", fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: ".2em", boxShadow: "0 0 30px rgba(0,228,95,.1)" };
    const btnSec = { padding: "1rem 2rem", border: "1px solid rgba(107,159,232,0.3)", borderRadius: 10, background: "rgba(107,159,232,0.04)", color: "#6b9fe8", fontSize: "1rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: ".15em" };

    return (
      <div style={S.page}>
        <AnimatedBG />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem", maxWidth: 560 }}>

          {introPage === 0 && (<>
            <div style={{ fontSize: "0.8rem", letterSpacing: ".5em", color: "#00e45f", marginBottom: "1.5rem", opacity: 0.6 }}>&SAMHOUD × ADC PRESENTEERT</div>
            <div style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)", fontWeight: 900, lineHeight: 0.95, marginBottom: ".6rem" }}>
              <span style={{ color: "#6b9fe8", ...S.glow("#6b9fe8") }}>AI</span>{" "}
              <span style={{ color: "#00e45f", ...S.glow("#00e45f", 50) }}>RACER</span>
            </div>
            <div style={{ fontSize: "1rem", color: "#6b9fe8", marginBottom: "1.8rem" }}>Welkom, <span style={{ color: "#00e45f", fontWeight: 700 }}>{nameRef.current}</span></div>

            <div style={{ fontSize: "1.1rem", color: "rgba(240,244,249,.55)", lineHeight: 2, marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
              Het is <span style={{ color: "#6b9fe8", fontWeight: 700 }}>2022</span>. ChatGPT is net gelanceerd.<br />
              Jij vliegt door <span style={{ color: "#00e45f", fontWeight: 700 }}>5 jaar AI-revolutie</span> —<br />
              van de eerste chatbots tot <span style={{ color: "#ff3366", fontWeight: 700 }}>volledige autonomie</span>.
            </div>

            <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
              {Object.entries(CAT_COLORS).map(([cat, c]) => (
                <div key={cat} style={{ textAlign: "center" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: c, margin: "0 auto .4rem", boxShadow: `0 0 8px ${c}50` }} />
                  <div style={{ fontSize: "0.7rem", color: c, opacity: 0.8 }}>{CAT_LABELS[cat]}</div>
                </div>
              ))}
            </div>
          </>)}

          {introPage === 1 && (<>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#6b9fe8", marginBottom: "1.8rem", ...S.glow("#6b9fe8") }}>HOE SPEEL JE?</div>

            <div style={{ textAlign: "left", maxWidth: 460, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.4rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.8rem", lineHeight: 1 }}>🚀</div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#6b9fe8", marginBottom: ".3rem" }}>Vlieg & verzamel</div>
                  <div style={{ fontSize: "0.9rem", color: "rgba(240,244,249,.5)", lineHeight: 1.5 }}>Vlieg door <span style={{ color: "#00e45f" }}>lichtpoortjes</span> om AI-milestones te verzamelen. Elk event vertelt een stuk van het verhaal.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.8rem", lineHeight: 1 }}>💥</div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ff4d6a", marginBottom: ".3rem" }}>Schiet vijanden neer</div>
                  <div style={{ fontSize: "0.9rem", color: "rgba(240,244,249,.5)", lineHeight: 1.5 }}>Aanvalsgolven met thema's als <span style={{ color: "#ff5577" }}>Legacy Systems</span>, <span style={{ color: "#ff9f43" }}>Budget Cuts</span> en <span style={{ color: "#ff6b6b" }}>Bureaucratie</span> proberen je te stoppen.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.8rem", lineHeight: 1 }}>⭐</div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ff9f43", marginBottom: ".3rem" }}>Pak power-ups</div>
                  <div style={{ fontSize: "0.9rem", color: "rgba(240,244,249,.5)", lineHeight: 1.5 }}>Homing raketten, rapid fire, triple laser, shield en score boost. Versla golven om ze te laten droppen.</div>
                </div>
              </div>
            </div>
          </>)}

          {introPage === 2 && (<>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#ff3366", marginBottom: "1.8rem", ...S.glow("#ff3366") }}>BESTEMMING: AGI</div>

            <div style={{ textAlign: "center", maxWidth: 460, margin: "0 auto", marginBottom: "2rem" }}>
              <div style={{ fontSize: "1rem", color: "rgba(240,244,249,.55)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Vlieg door alle <span style={{ color: "#6b9fe8", fontWeight: 700 }}>38 AI-events</span> van 2022 tot 2026.<br />
                Aan het einde wacht de <span style={{ color: "#ff3366", fontWeight: 700 }}>eindbaas: AGI</span>.<br />
                Versla de singulariteit om te winnen!
              </div>

              <div style={{ background: "rgba(255,51,102,0.06)", border: "1px solid rgba(255,51,102,0.15)", borderRadius: 10, padding: "1.2rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>👾</div>
                <div style={{ fontSize: "1rem", color: "#ff3366", fontWeight: 700, marginBottom: ".3rem" }}>AGI — 3 fases, 40 HP</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(240,244,249,.4)", lineHeight: 1.5 }}>Schiet projectielen als Hallucination, Alignment en Compute Limits. Gebruik power-ups!</div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", fontSize: "0.85rem" }}>
                <div style={{ padding: ".5rem 1rem", borderRadius: 6, border: "1px solid rgba(107,159,232,0.15)", color: "rgba(240,244,249,.4)" }}>↑↓←→ Bewegen</div>
                <div style={{ padding: ".5rem 1rem", borderRadius: 6, border: "1px solid rgba(107,159,232,0.15)", color: "rgba(240,244,249,.4)" }}>SPACE Schieten</div>
                <div style={{ padding: ".5rem 1rem", borderRadius: 6, border: "1px solid rgba(107,159,232,0.15)", color: "rgba(240,244,249,.4)" }}>5 Levens</div>
              </div>
            </div>
          </>)}

          {/* Navigation dots */}
          <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", marginBottom: "1.5rem" }}>
            {[0, 1, 2].map(i => <div key={i} style={dot(i)} onClick={() => setIntroPage(i)} />)}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: ".8rem", justifyContent: "center", flexWrap: "wrap" }}>
            {introPage < 2 ? (
              <button onClick={() => setIntroPage(introPage + 1)} style={btnNext}>VOLGENDE →</button>
            ) : (
              <button onClick={startGame} style={btnNext}>🚀 START GAME</button>
            )}
            {introPage === 0 && (
              <button onClick={() => { loadScores(); setScreen("board"); }} style={btnSec}>LEADERBOARD</button>
            )}
            {introPage > 0 && (
              <button onClick={() => setIntroPage(introPage - 1)} style={btnSec}>← TERUG</button>
            )}
            {introPage < 2 && (
              <button onClick={startGame} style={{ ...btnSec, opacity: 0.5, fontSize: "0.8rem" }}>SKIP → SPELEN</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══ LEADERBOARD ═══
  if (screen === "board") {
    return (
      <div style={S.page}>
        <AnimatedBG />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "1.5rem", maxWidth: 500, width: "100%" }}>
          <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", fontWeight: 900, marginBottom: "1.5rem" }}>
            <span style={{ color: "#6b9fe8" }}>LEADER</span><span style={{ color: "#00e45f" }}>BOARD</span>
          </div>
          {loadingScores ? (
            <div style={{ color: "rgba(240,244,249,.3)", fontSize: "1rem", padding: "2rem" }}>Laden...</div>
          ) : scores.length === 0 ? (
            <div style={{ color: "rgba(240,244,249,.3)", fontSize: "1rem", padding: "2rem" }}>Nog geen scores. Wees de eerste!</div>
          ) : (
            <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
              {scores.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".7rem 1rem", marginBottom: ".4rem", borderRadius: 8, background: i === 0 ? "rgba(0,228,95,0.06)" : i < 3 ? "rgba(107,159,232,0.04)" : "rgba(240,244,249,0.02)", border: `1px solid ${i === 0 ? "rgba(0,228,95,0.15)" : i < 3 ? "rgba(107,159,232,0.08)" : "rgba(240,244,249,0.04)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 900, width: 28, color: i === 0 ? "#00e45f" : i < 3 ? "#6b9fe8" : "rgba(240,244,249,.3)" }}>{i + 1}.</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: i === 0 ? "#00e45f" : "#f0f4f9" }}>{s.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: ".75rem", color: "rgba(240,244,249,.3)" }}>{s.collected}/{TIMELINE.length} · {s.year}</span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: i === 0 ? "#00e45f" : "#6b9fe8" }}>{(s.score || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: "1.5rem" }}>
            <button onClick={() => setScreen("menu")} style={{ padding: ".8rem 2rem", border: "1px solid rgba(107,159,232,0.2)", borderRadius: 8, background: "rgba(107,159,232,0.04)", color: "#6b9fe8", fontSize: "1rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: "pointer", marginRight: ".5rem" }}>TERUG</button>
            <button onClick={loadScores} style={{ padding: ".8rem 1.5rem", border: "1px solid rgba(0,228,95,0.2)", borderRadius: 8, background: "rgba(0,228,95,0.04)", color: "#00e45f", fontSize: "1rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: "pointer" }}>REFRESH</button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ END ═══
  if (screen === "end" && endData) {
    const won = endData.won;
    const pct = Math.round(endData.collected.length / endData.total * 100);
    return (
      <div style={S.page}>
        <AnimatedBG />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "1.5rem", maxWidth: 500 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".5rem", color: won ? "#00e45f" : "#ff4d6a", ...S.glow(won ? "#00e45f" : "#ff4d6a", 40) }}>{won ? "★ ★ ★" : "— X —"}</div>
          <div style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", fontWeight: 900, marginBottom: ".3rem" }}>
            {won ? (endData.bossDefeated ? <span style={{ color: "#00e45f" }}>AGI VERSLAGEN!</span> : <span style={{ color: "#00e45f" }}>2026 BEREIKT!</span>) : (<>GESTRAND IN <span style={{ color: "#ff4d6a" }}>{endData.year}</span></>)}
          </div>
          {won && <div style={{ fontSize: "1rem", color: "#ffd700", marginBottom: ".5rem" }}>De toekomst van AI is veilig</div>}
          <div style={{ fontSize: "1rem", color: "rgba(240,244,249,.4)", marginBottom: ".8rem" }}>{nameRef.current}</div>
          <div style={{ fontSize: "clamp(2.5rem, 7vw, 3.5rem)", fontWeight: 900, color: "#00e45f", ...S.glow("#00e45f", 30) }}>{endData.score.toLocaleString()}</div>
          <div style={{ fontSize: ".7rem", color: "rgba(240,244,249,.25)", letterSpacing: ".2em", marginBottom: "1rem" }}>PUNTEN</div>
          <div style={{ fontSize: "0.9rem", color: "rgba(240,244,249,.4)", marginBottom: ".8rem" }}>{endData.collected.length}/{endData.total} events verzameld ({pct}%)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem", justifyContent: "center", maxWidth: 480, margin: "0 auto 1.5rem" }}>
            {endData.collected.map((m, i) => (
              <span key={i} style={{ padding: ".2rem .5rem", fontSize: ".65rem", borderRadius: 4, border: "1px solid " + (CAT_COLORS[m.cat] || "#6b9fe8") + "30", background: (CAT_COLORS[m.cat] || "#6b9fe8") + "0a", color: CAT_COLORS[m.cat] || "#6b9fe8" }}>{m.name}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: ".8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={startGame} style={{ padding: "1rem 2.5rem", border: "2px solid #00e45f", borderRadius: 8, background: "rgba(0,228,95,0.06)", color: "#00e45f", fontSize: "1rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: ".15em" }}>OPNIEUW</button>
            <button onClick={() => { loadScores(); setScreen("board"); }} style={{ padding: "1rem 2rem", border: "1px solid rgba(107,159,232,0.3)", borderRadius: 8, background: "rgba(107,159,232,0.04)", color: "#6b9fe8", fontSize: "1rem", fontWeight: 700, fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: ".15em" }}>LEADERBOARD</button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ PLAY ═══
  return (
    <div style={{ height: "100vh", width: "100vw", background: "#060c18", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none" }}
      onTouchStart={e => { const r = cvs.current?.getBoundingClientRect(); if (r && e.touches[0]) touch.current = { x: (e.touches[0].clientX - r.left) / r.width * W, y: (e.touches[0].clientY - r.top) / r.height * H }; touchShoot.current = true; }}
      onTouchMove={e => { e.preventDefault(); const r = cvs.current?.getBoundingClientRect(); if (r && e.touches[0]) touch.current = { x: (e.touches[0].clientX - r.left) / r.width * W, y: (e.touches[0].clientY - r.top) / r.height * H }; }}
      onTouchEnd={() => { touch.current = null; touchShoot.current = false; }}
    >
      <canvas ref={cvs} width={W} height={H} style={{ maxWidth: "min(100vw, 640px)", maxHeight: "100vh", width: "auto", height: "auto", borderRadius: 12, border: "1px solid rgba(107,159,232,.06)", boxShadow: "0 0 60px rgba(0,228,95,.03), 0 20px 80px rgba(0,0,0,.6)" }} />
    </div>
  );
}
