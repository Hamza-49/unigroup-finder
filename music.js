

// ------------------ music controller --------------/


/* ==========================================================
   SONGS LIBRARY
   Zid l fichiers dyalek f dossier "songs/" (mp3/wav/ogg) w
   dir entry jdid hna f array. L cover mchi obligatoire.
   ========================================================== */
const songs = [
  { title: "Blank Banshee", artist: "Teen Pregnancy", src: "songs/Blank_Banshee.mp3" },
  { title: "Cuphead OST", artist: "Kristofer Maddigan", src: "songs/Cuphead_OST.mp3" },
  { title: "Deep Swim", artist: "#", src: "songs/Deep_Swim.mp3" },
  { title: "Jinsang", artist: "#", src: "songs/jinsang.mp3" },
  { title: "Sonicmania", artist: "Studiopolis Zone", src: "songs/SonicـMania.mp3" },
  { title: "Sty with me", artist: "#", src: "songs/stayـwithـme.mp3" },
];

/* ========================================================== */

const audio = document.getElementById("audio");
audio.volume = 0.05;
const playBtn = document.getElementById("play");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const vinyl = document.getElementById("vinyl");
const waveform = document.getElementById("waveform");
const volumeBtn = document.getElementById("volumeBtn");

let playing = false;
let currentIndex = -1;
let history = [];
let bars = [];

/* ---- build waveform bars ---- */
const BAR_COUNT = 46;
for (let i = 0; i < BAR_COUNT; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  const h = 6 + Math.round(Math.random() * 22); // 6px..28px
  bar.style.height = h + "px";
  bar.style.animationDelay = (Math.random() * 0.9) + "s";
  waveform.appendChild(bar);
  bars.push(bar);
}

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function pickRandomIndex() {
  if (songs.length === 1) return 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * songs.length);
  } while (idx === currentIndex);
  return idx;
}

function loadSong(index, autoplay) {
  currentIndex = index;
  const song = songs[index];
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  audio.src = song.src;
  progress.value = 0;
  updateProgressFill(0);
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  if (autoplay) {
    audio.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
  } else {
    setPlayingState(false);
  }
}

function setPlayingState(isPlaying) {
  playing = isPlaying;
  playBtn.textContent = playing ? "■" : "▶";
  vinyl.classList.toggle("spinning", playing);
  waveform.classList.toggle("playing", playing);
}

function toggle() {
  if (currentIndex === -1) {
    history = [pickRandomIndex()];
    loadSong(history[0], true);
    return;
  }
  if (playing) {
    audio.pause();
    setPlayingState(false);
  } else {
    audio.play();
    setPlayingState(true);
  }
}

function next() {
  const idx = pickRandomIndex();
  history.push(idx);
  loadSong(idx, true);
}

function prev() {
  if (history.length > 1) {
    history.pop();
    const idx = history[history.length - 1];
    loadSong(idx, true);
  } else {
    // no history behind us: just play a fresh random track
    const idx = pickRandomIndex();
    history = [idx];
    loadSong(idx, true);
  }
}

/* ---- progress bar sync ---- */
function updateProgressFill(pct) {
  progress.style.background =
    `linear-gradient(90deg, var(--blue-bright) 0%, var(--blue-bright) ${pct}%, #e0cfa0 ${pct}%, #e0cfa0 100%)`;

  const litCount = Math.round((pct / 100) * bars.length);
  bars.forEach((b, i) => b.classList.toggle("played", i < litCount));
}

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.value = pct;
  updateProgressFill(pct);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  next(); // song khlast -> tal9a wahda okhra b random
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* ---- volume toggle ---- */
volumeBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  volumeBtn.textContent = audio.muted ? "🔇" : "🔊";
});

/* ---- init: shuffle order, show first track info ---- */
(function init() {
  const first = pickRandomIndex();
  history = [first];
  loadSong(first, false);
})();

/* ==========================================================
   AUTOPLAY
   Les navigateurs bloquent l'autoplay AVEC son tant qu'il n'y
   a pas eu d'interaction utilisateur. Solution fiable:
   1) on tente un autoplay direct au chargement (marche sur
      certains n´avigateurs/mobiles selon les réglages),
   2) si ça échoue (Promise rejetée), on démarre la lecture
      automatiquement au tout premier clic/tap sur la page.
   ========================================================== */
window.addEventListener("load", () => {
  audio.play()
    .then(() => setPlayingState(true))
    .catch(() => {
      const startOnFirstInteraction = () => {
        audio.play().then(() => setPlayingState(true)).catch(() => {});
        document.removeEventListener("click", startOnFirstInteraction);
        document.removeEventListener("touchstart", startOnFirstInteraction);
        document.removeEventListener("keydown", startOnFirstInteraction);
      };
      document.addEventListener("click", startOnFirstInteraction);
      document.addEventListener("touchstart", startOnFirstInteraction);
      document.addEventListener("keydown", startOnFirstInteraction);
    });
});
