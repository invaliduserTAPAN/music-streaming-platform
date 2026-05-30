let songs = [];
let currentSongIndex = 0;
let currentSong = new Audio();
let currfolder;

async function getsong(folder) {
  currfolder = folder;
  
  try {
    let a = await fetch(`/${folder}/songs.json`);
    let data = await a.json();
    songs = data.songs;
  } catch (error) {
    console.error(`Error loading songs from ${folder}:`, error);
    songs = [];
  }
  
  return songs;
}

async function loadFolder(folder) {
  songs = await getsong(folder);
  console.log(`Loaded ${songs.length} songs from ${folder}`);
  
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  
  for (const song of songs) {
    let filename = song.split("/").pop();
    filename = decodeURIComponent(filename);
    filename = filename.replace(".mp3", "");

    filename = filename.length > 30
      ? filename.slice(0, 30) + "..." 
      : filename;

    songul.insertAdjacentHTML(
      "beforeend",
      `<li data-index="${songs.indexOf(song)}">
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${filename}</div>
          <div>Tapan</div>
        </div>
        <div class="playnow">
          <span>PlayNow</span>
          <img src="img/play.svg" alt="">
        </div>
      </li>`
    );
  }
  
  // Auto play first song
  if (songs.length > 0) {
    currentSongIndex = 0;
    playSong(currentSongIndex);
  }
}

async function displayalbums() {
  try {
    let a = await fetch('/songs/albums.json');
    let data = await a.json();
    
    let cardContenier = document.querySelector(".cardContenier");
    
    for (const folder of data.albums) {
      try {
        // Fetch info.json
        let infoResponse = await fetch(`/songs/${folder}/info.json`);
        
        if (!infoResponse.ok) {
          console.log(`No info.json for ${folder}`);
          continue; // Skip this folder
        }

        let info = await infoResponse.json();
        console.log(info);
        
        cardContenier.innerHTML += `
          <div class="card" data-folder="songs/${folder}">
            <div class="play">
              <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="24" fill="#1DB954" />
                <polygon points="19,14 34,24 19,34" fill="#000" />
              </svg>
            </div>
            <img src="/songs/${folder}/image.jpg" alt="${info.title}">
            <h2>${info.title}</h2>
            <p>${info.description}</p>
          </div>
        `;
      } catch (error) {
        console.log(`Error loading ${folder}:`, error);
      }
    }
  } catch (error) {
    console.error('Error loading albums:', error);
  }
}

async function main() {
  // ✅ FIRST: Display all album cards
  await displayalbums();
  
  // ✅ SECOND: Load default songs
  songs = await getsong("songs/ncs");
  
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  
  for (const song of songs) {
    let filename = song.split("/").pop();
    filename = decodeURIComponent(filename);
    filename = filename.replace(".mp3", "");

    filename = filename.length > 30
      ? filename.slice(0, 30) + "..." 
      : filename;

    songul.insertAdjacentHTML(
      "beforeend",
      `<li data-index="${songs.indexOf(song)}">
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${filename}</div>
          <div>Tapan</div>
        </div>
        <div class="playnow">
          <span>PlayNow</span>
          <img src="img/play.svg" alt="">
        </div>
      </li>`
    );
  }

  // ✅ THIRD: Add card click handlers AFTER cards are created
  Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", () => {
      const folder = card.getAttribute("data-folder");
      if (folder) {
        loadFolder(folder);
      }
    });
  });

  // Song list click handler
  songul.addEventListener("click", (e) => {
    let li = e.target.closest("li");
    if (!li) return;

    currentSongIndex = Number(li.dataset.index);
    playSong(currentSongIndex);
  });

  // Play/Pause button
  document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "img/pause.svg";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "img/play.svg";
    }
  });

  // Next button
  document.getElementById("next").addEventListener("click", () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
    playSong(currentSongIndex);
  });

  // Previous button
  document.getElementById("prev").addEventListener("click", () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = songs.length - 1;
    }
    playSong(currentSongIndex);
  });

  // Time update
  currentSong.addEventListener("timeupdate", () => {
    let current = formatTime(currentSong.currentTime);
    let total = formatTime(currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${current} / ${total}`;

    let percent = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = percent + "%";
  });

  // Seekbar click
  const seekbar = document.querySelector(".seekbar");
  seekbar.addEventListener("click", (e) => {
    let rect = seekbar.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let percent = clickX / rect.width;
    currentSong.currentTime = percent * currentSong.duration;
  });

  // Auto play next song when current ends
  currentSong.addEventListener("ended", () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
    playSong(currentSongIndex);
  });

  // Volume control
  const volumeRange = document.getElementById('volume');
  const volumeIcon = document.querySelector('.volume img');

  if (volumeRange) {
    currentSong.volume = 0.5;
    volumeRange.value = 50;
    volumeRange.style.background = `linear-gradient(to right, #1db954 50%, #404040 50%)`;
    
    volumeRange.addEventListener("input", (e) => {
      const value = e.target.value;
      currentSong.volume = value / 100;
      volumeRange.style.background = `linear-gradient(to right, #1db954 ${value}%, #404040 ${value}%)`;
    });
    
    if (volumeIcon) {
      let previousVolume = 50;
      
      volumeIcon.addEventListener("click", () => {
        if (currentSong.volume > 0) {
          previousVolume = volumeRange.value;
          currentSong.volume = 0;
          volumeRange.value = 0;
          volumeRange.style.background = `linear-gradient(to right, #1db954 0%, #404040 0%)`;
        } else {
          currentSong.volume = previousVolume / 100;
          volumeRange.value = previousVolume;
          volumeRange.style.background = `linear-gradient(to right, #1db954 ${previousVolume}%, #404040 ${previousVolume}%)`;
        }
      });
    }
  } else {
    console.error("Volume range input not found!");
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

function playSong(index) {
  currentSong.src = `${currfolder}/${songs[index]}`;
  currentSong.play();
  document.getElementById("play").src = "img/pause.svg";
  
  let name = decodeURIComponent(songs[index].replace(".mp3", ""));
  document.querySelector(".songinfo").innerHTML = 
    name.length > 25
      ? `<span>${name}</span>`
      : name;
}

main()