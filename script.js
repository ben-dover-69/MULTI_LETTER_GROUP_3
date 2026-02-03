document.addEventListener("DOMContentLoaded", () => {
  
  emailjs.init("WodD_TueS-UN6i-Va");
  
  const openBtn = document.getElementById("openLetterBtn");
  const envelopeScreen = document.getElementById("envelopeScreen");
  const app = document.getElementById("app");
  const letterType = document.getElementById("letterType");
  const recipientInput = document.getElementById("recipient");
  const sendBtn = document.getElementById("sendBtn");
  const saveDraftBtn = document.getElementById("saveDraftBtn");
  const exportBtn = document.getElementById("exportBtn");
  const music = document.getElementById("music");
  const musicToggle = document.getElementById("musicToggle");
  const fontSelect = document.getElementById("fontSelect");
  const fontColor = document.getElementById("fontColor");
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  
  const letters = {
    love: document.getElementById("letter-love"),
    birthday: document.getElementById("letter-birthday"),
    formal: document.getElementById("letter-formal"),
    informal: document.getElementById("letter-informal"),
    invitation: document.getElementById("letter-invitation"),
    apology: document.getElementById("letter-apology"),
    farewell: document.getElementById("letter-farewell")
  };
  
  const musicFiles = {
    love: "kuped.mp3",
    birthday: "bdaysmegs.mp3",
    formal: "peynknwite.mp3",
    informal: "informal.mp3",
    invitation: "",
    apology: "",
    farewell: "farewell.mp3"
  };
  
  const letterColors = {
    love: "#b30000",
    birthday: "#ff9800",
    formal: "#2c2c2c",
    informal: "#388e3c",
    invitation: "#9c27b0",
    apology: "#d17d5a",
    farewell: "#0288d1"
  };
  
  openBtn.onclick = () => {
    const flap = document.querySelector(".env-flap");
    flap.style.transform = "rotateX(180deg)";
    
    setTimeout(() => {
      envelopeScreen.style.display = "none";
      app.classList.remove("hidden");
      switchLetter(letterType.value);
    }, 700);
  };
  
  Object.values(letters).forEach(letter => {
    const dateEl = letter.querySelector(".date");
    if (dateEl) dateEl.textContent = new Date().toDateString();
  });
  
  function switchLetter(type) {
    Object.keys(letters).forEach(key => letters[key].classList.add("hidden"));
    letters[type].classList.remove("hidden");
    
    document.body.className = type;
    
    const activeLetter = letters[type];
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";
    
    updateButtonColors(type);
    
    const currentMusic = musicFiles[type];
    if (currentMusic) {
      music.src = currentMusic;
      music.play();
      musicToggle.textContent = "❚❚";
    } else {
      music.pause();
      musicToggle.textContent = "▶";
    }
  }
  
  function updateButtonColors(type) {
    const color = letterColors[type];
    document.querySelectorAll(".action-buttons button").forEach(btn => {
      btn.style.background = color;
      btn.style.color = "#fff";
    });
    musicToggle.style.background = color;
  }
  
  letterType.onchange = () => switchLetter(letterType.value);
  
  fontSelect.onchange = e =>
    letters[letterType.value].style.fontFamily = e.target.value;
  
  fontColor.oninput = e =>
    letters[letterType.value].style.color = e.target.value;
  
  fontSizeSlider.oninput = e =>
    letters[letterType.value].style.fontSize = e.target.value + "px";
  
  musicToggle.onclick = () => {
    if (music.paused) {
      music.play();
      musicToggle.textContent = "❚❚";
    } else {
      music.pause();
      musicToggle.textContent = "▶";
    }
  };
  
  exportBtn.onclick = () =>
    html2pdf().from(letters[letterType.value]).save("letter.pdf");
  
  const stampSound = new Audio("stamp.mp3");
  
  // ✅✅✅ FIXED SEND LOGIC (CONTENT EXTRACTION)
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email.includes("@")) {
      alert("Enter a valid email");
      return;
    }
    
    const activeLetter = letters[letterType.value];
    
    const receiver =
      activeLetter.querySelector(".dear span")?.textContent.trim() || "Receiver";
    
    const sender =
      activeLetter.querySelector(".closing span")?.textContent.trim() || "Sender";
    
    const title =
      activeLetter.querySelector("#title")?.textContent.trim() || "Letter";
    
    const body =
      activeLetter.querySelector(".body")?.innerHTML.trim() || "";
    
    const seal = activeLetter.querySelector(".waxSeal");
    if (seal) {
      seal.classList.add("show");
      stampSound.currentTime = 0;
      stampSound.play();
    }
    
    const templateParams = {
      to_email: email,
      letter_type: letterType.value,
      receiver_name: receiver,
      sender_name: sender,
      letter_title: title,
      letter_body: body
    };
    
    emailjs
      .send("service_blwhkvs", "template_ka72mdg", templateParams)
      .then(() => alert("Letter sent successfully!"))
      .catch(err => {
        console.error(err);
        alert("Email send failed. Check EmailJS template variables.");
      });
  };
  
  switchLetter(letterType.value);
});