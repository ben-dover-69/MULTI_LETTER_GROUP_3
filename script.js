emailjs.init("WodD_TueS-UN6i-Va");

// ELEMENTS
const openBtn = document.getElementById("openLetterBtn");
const envelope = document.querySelector(".envelope");
const envelopeScreen = document.getElementById("envelopeScreen");
const app = document.getElementById("app");
const waxSeal = document.getElementById("waxSeal");
const letter = document.getElementById("letter");
const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");
const letterType = document.getElementById("letterType");

// MUSIC FILES
const musicFiles = {
  love: "kuped.mp3",
  birthday: "bdaysmegs.mp3",
  formal: "peynknwite.mp3"
};

// ENVELOPE OPEN
openBtn.onclick = () => {
  envelope.classList.add("open");
  setTimeout(() => {
    envelopeScreen.style.display = "none";
    app.classList.remove("hidden");
    
    // Wax seal delay
    setTimeout(() => {
      waxSeal.classList.add("show");
    }, 1000);
    
    // Start correct music
    const type = letterType.value;
    music.src = musicFiles[type];
    music.play();
    musicToggle.textContent = "⏸ Pause Music";
  }, 700);
};

// DATE
document.getElementById("date").textContent = new Date().toDateString();

// FONT & COLOR
document.getElementById("fontSelect").onchange = e => {
  letter.style.fontFamily = e.target.value;
};
document.getElementById("fontColor").onchange = e => {
  letter.style.color = e.target.value;
};

// LETTER TYPE TITLES & COLORS
letterType.onchange = e => {
  const type = e.target.value;
  const title = document.getElementById("title");
  document.body.className = type;
  
  if (type === "love") title.textContent = "A Letter From My Heart";
  if (type === "birthday") title.textContent = "Happy Birthday Wishes";
  if (type === "formal") title.textContent = "A Formal Letter";
  
  letter.style.background = type === "love" ? "#fde2e2" :
    type === "birthday" ? "#fff5e1" : "#f0f0f0";
  
  // Change music source
  music.src = musicFiles[type];
  music.play();
  musicToggle.textContent = "⏸ Pause Music";
};

// MUSIC TOGGLE BUTTON
musicToggle.onclick = () => {
  if (music.paused) {
    music.play();
    musicToggle.textContent = "⏸ Pause Music";
  } else {
    music.pause();
    musicToggle.textContent = "▶ Play Music";
  }
};

// FUNCTIONS
function saveDraft() {
  localStorage.setItem("draft", letter.innerHTML);
  localStorage.setItem("draftType", letterType.value);
  alert("Draft saved");
}

function sendLetter() {
  const email = document.getElementById("recipient").value;
  if (!email) return alert("Enter recipient email");
  
  emailjs.send("service_blwhkvs", "template_ka72mdg", {
    to_email: email,
    message: letter.innerHTML
  }).then(() => {
    localStorage.setItem("sentLetter", letter.innerHTML);
    localStorage.setItem("sentLetterType", letterType.value);
    alert("Letter sent!");
  });
}

function exportPDF() {
  html2pdf().from(letter).save("letter.pdf");
}