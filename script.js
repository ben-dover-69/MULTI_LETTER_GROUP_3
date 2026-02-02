// Initialize EmailJS with your public key
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

// Music files
const musicFiles = {
  love: "kuped.mp3",
  birthday: "bdaysmegs.mp3",
  formal: "peynknwite.mp3"
};

// OPEN LETTER / ENVELOPE ANIMATION
openBtn.onclick = function() {
  envelope.classList.add("open");
  const flap = document.querySelector(".env-flap");
  flap.style.transition = "transform 0.7s ease";
  flap.style.transform = "rotateX(180deg)";
  
  setTimeout(() => {
    envelopeScreen.style.display = "none";
    app.classList.remove("hidden");
    
    setTimeout(() => {
      waxSeal.classList.add("show");
    }, 1000);
    
    const type = letterType.value;
    music.src = musicFiles[type];
    music.play();
    musicToggle.textContent = "⏸ Pause Music";
  }, 700);
};

// Date
document.getElementById("date").textContent = new Date().toDateString();

// Font & Color
document.getElementById("fontSelect").onchange = e => letter.style.fontFamily = e.target.value;
document.getElementById("fontColor").onchange = e => letter.style.color = e.target.value;

// Letter type changes
letterType.onchange = function() {
  const type = this.value;
  const title = document.getElementById("title");
  document.body.className = type;
  
  if (type === "love") title.textContent = "A Letter From My Heart";
  else if (type === "birthday") title.textContent = "Happy Birthday Wishes";
  else if (type === "formal") title.textContent = "A Formal Letter";
  
  letter.style.background = type === "love" ? "#fde2e2" :
    type === "birthday" ? "#fff5e1" : "#f0f0f0";
  
  music.src = musicFiles[type];
  music.play();
  musicToggle.textContent = "⏸ Pause Music";
};

// Music toggle
musicToggle.onclick = function() {
  if (music.paused) {
    music.play();
    this.textContent = "⏸ Pause Music";
  } else {
    music.pause();
    this.textContent = "▶ Play Music";
  }
};

// Save draft
saveDraftBtn.onclick = function() {
  localStorage.setItem("draft", letter.innerHTML);
  localStorage.setItem("draftType", letterType.value);
  alert("Draft saved!");
};

// Export PDF
exportBtn.onclick = function() {
  html2pdf().from(letter).save("letter.pdf");
};

// SEND LETTER (Working logic from old code)
sendBtn.onclick = function() {
  const email = recipientInput.value.trim();
  if (!email) return alert("Please enter recipient email!");
  
  // Using working payload format from old code
  const templateParams = {
    to_email: email,
    letter_content: letter.innerHTML,
    letter_type: letterType.value,
    sender_name: document.getElementById("senderName").textContent
  };
  
  console.log("Sending EmailJS payload:", templateParams);
  
  emailjs.send("service_blwhkvs", "template_ka72mdg", templateParams, "WodD_TueS-UN6i-Va")
    .then(function(response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Letter sent successfully!");
    }, function(error) {
      console.error("FAILED...", error);
      alert("Error sending letter.");
    });
};