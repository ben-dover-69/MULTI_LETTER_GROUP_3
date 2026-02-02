// Initialize EmailJS
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
const recipientInput = document.getElementById("recipient");
const sendBtn = document.getElementById("sendBtn");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const exportBtn = document.getElementById("exportBtn");

// MUSIC FILES
const musicFiles = {
  love: "kuped.mp3",
  birthday: "bdaysmegs.mp3",
  formal: "peynknwite.mp3"
};

// OPEN ENVELOPE (No animation transition)
openBtn.onclick = () => {
  envelopeScreen.style.display = "none";
  app.classList.remove("hidden");
  
  setTimeout(() => {
    waxSeal.classList.add("show");
  }, 1000);
  
  // Start correct music
  const type = letterType.value;
  music.src = musicFiles[type];
  music.play();
  musicToggle.textContent = "⏸ Pause Music";
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
  
  music.src = musicFiles[type];
  music.play();
  musicToggle.textContent = "⏸ Pause Music";
};

// MUSIC TOGGLE
musicToggle.onclick = () => {
  if (music.paused) {
    music.play();
    musicToggle.textContent = "⏸ Pause Music";
  } else {
    music.pause();
    musicToggle.textContent = "▶ Play Music";
  }
};

// SAVE DRAFT
saveDraftBtn.onclick = () => {
  localStorage.setItem("draft", letter.innerHTML);
  localStorage.setItem("draftType", letterType.value);
  alert("Draft saved!");
};

// EXPORT PDF
exportBtn.onclick = () => {
  html2pdf().from(letter).save("letter.pdf");
};

// SEND LETTER (FIXED)
sendBtn.onclick = () => {
  const email = recipientInput.value.trim();
  if (!email) return alert("Please enter recipient email!");
  
  emailjs.send("service_blwhkvs", "template_ka72mdg", {
      to_email: email,
      letter_content: letter.innerHTML,
      letter_type: letterType.value,
      sender_name: document.getElementById("senderName").textContent
    }, "WodD_TueS-UN6i-Va")
    .then(() => {
      localStorage.setItem("sentLetter", letter.innerHTML);
      localStorage.setItem("sentLetterType", letterType.value);
      alert("Letter sent successfully!");
    })
    .catch(err => {
      console.error("EmailJS Error:", err);
      alert("Error sending letter. Check console for details.");
    });
};