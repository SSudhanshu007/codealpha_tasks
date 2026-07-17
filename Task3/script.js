// Songs
var songs = [
  {
    title: "Morning Breeze",
    artist: "Ethan Brooks",
    src: "Song1.mp3",
    cover: "Image1.jpg"
  },
  {
    title: "Golden Sky",
    artist: "Luna Harper",
    src: "Song2.mp3",
    cover: "Image2.avif"
  },
  {
    title: "Midnight Drive",
    artist: "Noah Carter",
    src: "Song3.mp3",
    cover: "Image3.jpg"
  }
];

// Elements
var audio = document.getElementById("audio");
var cover = document.getElementById("cover");
var title = document.getElementById("title");
var artist = document.getElementById("artist");
var playBtn = document.getElementById("playBtn");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var progressBar = document.getElementById("progressBar");
var progressFill = document.getElementById("progressFill");
var currentTimeEl = document.getElementById("currentTime");
var durationEl = document.getElementById("duration");
var volumeSlider = document.getElementById("volume");
var playlistEl = document.getElementById("playlist");

var currentIndex = 0;
var isPlaying = false;

// Functions
function loadSong(index) {
  var song = songs[index];

  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;

  highlightActiveSong();
}

function playSong() {
  isPlaying = true;
  playBtn.innerHTML = "&#10074;&#10074;";
  playBtn.setAttribute("aria-label", "Pause");
  audio.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.innerHTML = "&#9654;";
  playBtn.setAttribute("aria-label", "Play");
  audio.pause();
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function nextSong() {
  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }

  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = songs.length - 1;
  }

  loadSong(currentIndex);
  playSong();
}

function formatTime(seconds) {
  if (isNaN(seconds)) {
    return "0:00";
  }

  var mins = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);

  if (secs < 10) {
    secs = "0" + secs;
  }

  return mins + ":" + secs;
}

function updateProgress() {
  if (audio.duration) {
    var percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

function updateDuration() {
  durationEl.textContent = formatTime(audio.duration);
}

function seek(event) {
  var rect = progressBar.getBoundingClientRect();
  var clickX = event.clientX - rect.left;

  if (audio.duration) {
    audio.currentTime = (clickX / rect.width) * audio.duration;
  }
}

function changeVolume() {
  audio.volume = volumeSlider.value / 100;
}

function buildPlaylist() {
  playlistEl.innerHTML = "";

  for (var i = 0; i < songs.length; i++) {
    var item = document.createElement("li");

    item.setAttribute("data-index", i);

    item.innerHTML =
      "<span>" +
      (i + 1) +
      ". " +
      songs[i].title +
      "</span><span class='song-artist'>" +
      songs[i].artist +
      "</span>";

    item.addEventListener("click", playSelectedSong);

    playlistEl.appendChild(item);
  }

  highlightActiveSong();
}

function playSelectedSong(event) {
  currentIndex = Number(event.currentTarget.getAttribute("data-index"));

  loadSong(currentIndex);
  playSong();
}

function highlightActiveSong() {
  var items = playlistEl.querySelectorAll("li");

  for (var i = 0; i < items.length; i++) {
    if (i === currentIndex) {
      items[i].classList.add("active");
    } else {
      items[i].classList.remove("active");
    }
  }
}

function keyboardControls(event) {
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  } else if (event.code === "ArrowRight") {
    nextSong();
  } else if (event.code === "ArrowLeft") {
    prevSong();
  } else if (event.code === "ArrowUp") {
    event.preventDefault();

    var volume = Number(volumeSlider.value) + 5;

    if (volume > 100) {
      volume = 100;
    }

    volumeSlider.value = volume;
    changeVolume();
  } else if (event.code === "ArrowDown") {
    event.preventDefault();

    var volume = Number(volumeSlider.value) - 5;

    if (volume < 0) {
      volume = 0;
    }

    volumeSlider.value = volume;
    changeVolume();
  }
}

// Events
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", updateDuration);
audio.addEventListener("ended", nextSong);

progressBar.addEventListener("click", seek);
volumeSlider.addEventListener("input", changeVolume);

document.addEventListener("keydown", keyboardControls);

buildPlaylist();
loadSong(currentIndex);
changeVolume();
