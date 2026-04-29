const songs = [
  {
    id: 1,
    title: "Sunrise Vibes",
    artist: "Nova Beats",
    genre: "Pop",
    cover: "images/cover1.jpg",
    audio: "songs/song1.mp3"
  },
  {
    id: 2,
    title: "Night Drive",
    artist: "Luna Waves",
    genre: "Lo-fi",
    cover: "images/cover2.jpg",
    audio: "songs/song2.mp3"
  },
  {
    id: 3,
    title: "Ocean Dreams",
    artist: "Blue Horizon",
    genre: "Chill",
    cover: "images/cover3.jpg",
    audio: "songs/song3.mp3"
  },
  {
    id: 4,
    title: "City Lights",
    artist: "Skyline FM",
    genre: "Electronic",
    cover: "images/cover4.jpg",
    audio: "songs/song4.mp3"
  },
  {
    id: 5,
    title: "Calm Rain",
    artist: "Nature Tune",
    genre: "Relax",
    cover: "images/cover5.jpg",
    audio: "songs/song5.mp3"
  },
  {
    id: 6,
    title: "Starry Night",
    artist: "Moon Echo",
    genre: "Ambient",
    cover: "images/cover6.jpg",
    audio: "songs/song6.mp3"
  }
];

const audio = document.getElementById("audio");
const coverImg = document.getElementById("coverImg");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const genreBadge = document.getElementById("genreBadge");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const volumeText = document.getElementById("volumeText");
const playlistEl = document.getElementById("playlist");
const searchInput = document.getElementById("searchInput");
const songCount = document.getElementById("songCount");
const themeBtn = document.getElementById("themeBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const favBtn = document.getElementById("favBtn");
const allSongsPill = document.getElementById("allSongsPill");
const favoritesPill = document.getElementById("favoritesPill");
const recentPill = document.getElementById("recentPill");

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let filterMode = "all"; // all | favorites | recent

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];
const savedTheme = localStorage.getItem("theme") || "dark";

if(savedTheme === "light"){
  document.body.classList.add("light");
}

function formatTime(time){
  if(isNaN(time)) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function saveLocal(){
  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("recent", JSON.stringify(recent.slice(0, 10)));
}

function getFilteredSongs(){
  let list = [...songs];

  if(filterMode === "favorites"){
    list = list.filter(song => favorites.includes(song.id));
  } else if(filterMode === "recent"){
    list = recent.map(id => songs.find(s => s.id === id)).filter(Boolean);
  }

  const query = searchInput.value.trim().toLowerCase();
  if(query){
    list = list.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query)
    );
  }

  return list;
}

function loadSong(index){
  const song = songs[index];
  audio.src = song.audio;
  coverImg.src = song.cover;
  songTitle.textContent = song.title;
  songArtist.textContent = `Artist: ${song.artist}`;
  genreBadge.textContent = song.genre;

  favBtn.classList.toggle("active", favorites.includes(song.id));
  favBtn.textContent = favorites.includes(song.id) ? "♥" : "♡";

  renderPlaylist();
}

function playSong(){
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

function pauseSong(){
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
}

function togglePlay(){
  if(isPlaying) pauseSong();
  else playSong();
}

function setCurrentBySongId(songId){
  const idx = songs.findIndex(s => s.id === songId);
  if(idx !== -1){
    currentIndex = idx;
    loadSong(currentIndex);
    playSong();
    pushRecent(songId);
  }
}

function pushRecent(songId){
  recent = recent.filter(id => id !== songId);
  recent.unshift(songId);
  saveLocal();
}

function nextSong(){
  if(isShuffle){
    let randomIndex = Math.floor(Math.random() * songs.length);
    while(randomIndex === currentIndex && songs.length > 1){
      randomIndex = Math.floor(Math.random() * songs.length);
    }
    currentIndex = randomIndex;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
  playSong();
  pushRecent(songs[currentIndex].id);
}

function prevSong(){
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
  pushRecent(songs[currentIndex].id);
}

function renderPlaylist(){
  const filteredSongs = getFilteredSongs();
  playlistEl.innerHTML = "";

  if(filteredSongs.length === 0){
    playlistEl.innerHTML = `
      <div class="track" style="justify-content:center; text-align:center;">
        <div class="track-info">
          <h4>No songs found</h4>
          <p>Try a different search or filter.</p>
        </div>
      </div>
    `;
    songCount.textContent = "0 Songs";
    return;
  }

  filteredSongs.forEach(song => {
    const div = document.createElement("div");
    div.className = "track" + (songs[currentIndex].id === song.id ? " active" : "");
    div.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div class="track-info">
        <h4>${song.title}</h4>
        <p>${song.artist} • ${song.genre}</p>
      </div>
      <div class="tag">${favorites.includes(song.id) ? "★ Fav" : song.genre}</div>
    `;
    div.addEventListener("click", () => setCurrentBySongId(song.id));
    playlistEl.appendChild(div);
  });

  songCount.textContent = `${filteredSongs.length} Song${filteredSongs.length > 1 ? "s" : ""}`;
  updatePills();
}

function updatePills(){
  [allSongsPill, favoritesPill, recentPill].forEach(el => el.classList.remove("active"));
  if(filterMode === "all") allSongsPill.classList.add("active");
  if(filterMode === "favorites") favoritesPill.classList.add("active");
  if(filterMode === "recent") recentPill.classList.add("active");
}

playBtn.addEventListener("click", () => {
  togglePlay();
  pushRecent(songs[currentIndex].id);
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", () => {
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

progress.addEventListener("input", () => {
  if(audio.duration){
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

audio.addEventListener("ended", () => {
  if(isRepeat){
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
  volumeText.textContent = `${Math.round(volume.value * 100)}%`;
});

searchInput.addEventListener("input", renderPlaylist);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const theme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", theme);
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.background = isShuffle
    ? "linear-gradient(135deg,var(--accent),var(--accent2))"
    : "var(--card)";
  shuffleBtn.style.color = "#fff";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.textContent = `🔁 Repeat: ${isRepeat ? "On" : "Off"}`;
  repeatBtn.style.background = isRepeat
    ? "linear-gradient(135deg,var(--accent),var(--accent2))"
    : "var(--card)";
  repeatBtn.style.color = "#fff";
});

favBtn.addEventListener("click", () => {
  const currentSongId = songs[currentIndex].id;
  if(favorites.includes(currentSongId)){
    favorites = favorites.filter(id => id !== currentSongId);
  } else {
    favorites.push(currentSongId);
  }
  saveLocal();
  favBtn.classList.toggle("active", favorites.includes(currentSongId));
  favBtn.textContent = favorites.includes(currentSongId) ? "♥" : "♡";
  renderPlaylist();
});

allSongsPill.addEventListener("click", () => {
  filterMode = "all";
  renderPlaylist();
});

favoritesPill.addEventListener("click", () => {
  filterMode = "favorites";
  renderPlaylist();
});

recentPill.addEventListener("click", () => {
  filterMode = "recent";
  renderPlaylist();
});

// Init
audio.volume = 0.7;
loadSong(currentIndex);
renderPlaylist();