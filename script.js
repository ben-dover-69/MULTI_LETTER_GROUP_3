document.addEventListener("DOMContentLoaded", () => {
  
  // =========================
  // INITIALIZE EMAILJS
  // =========================
  emailjs.init("WodD_TueS-UN6i-Va");
  
  // =========================
  // ELEMENTS
  // =========================
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
  
  // =========================
  // LETTERS
  // =========================
  const letters = {
    love: document.getElementById("letter-love"),
    birthday: document.getElementById("letter-birthday"),
    formal: document.getElementById("letter-formal"),
    informal: document.getElementById("letter-informal"),
    invitation: document.getElementById("letter-invitation"),
    apology: document.getElementById("letter-apology"),
    farewell: document.getElementById("letter-farewell")
  };
  
  // =========================
  // MUSIC FILES
  // =========================
  const musicFiles = {
    love: "kuped.mp3",
    birthday: "bdaysmegs.mp3",
    formal: "peynknwite.mp3",
    informal: "informal.mp3",
    invitation: "",
    apology: "",
    farewell: "farewell.mp3"
  };
  
  // =========================
  // LETTER COLORS
  // =========================
  const letterColors = {
    love: "#b30000",
    birthday: "#ff9800",
    formal: "#2c2c2c",
    informal: "#388e3c",
    invitation: "#9c27b0",
    apology: "#d17d5a",
    farewell: "#0288d1"
  };
  
  // =========================
  // BASE64 ENCODER
  // =========================
  function encodeContent(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  
  // =========================
  // OPEN ENVELOPE
  // =========================
  openBtn.onclick = () => {
    const flap = document.querySelector(".env-flap");
    flap.style.transform = "rotateX(180deg)";
    
    setTimeout(() => {
      envelopeScreen.style.display = "none";
      app.classList.remove("hidden");
      switchLetter(letterType.value);
    }, 700);
  };
  
  // =========================
  // SET DATE
  // =========================
  Object.values(letters).forEach(letter => {
    const dateEl = letter.querySelector(".date");
    if (dateEl) dateEl.textContent = new Date().toDateString();
  });
  
  // =========================
  // SWITCH LETTER
  // =========================
  function switchLetter(type) {
    Object.keys(letters).forEach(k => letters[k].classList.add("hidden"));
    const activeLetter = letters[type];
    activeLetter.classList.remove("hidden");
    
    // Apply font, color, and size
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";
    
    document.body.className = type;
    updateButtonColors(type);
    updateLetterTitle(type);
    
    const musicFile = musicFiles[type];
    if (musicFile) {
      music.src = musicFile;
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }
  }
  
  // =========================
  // BUTTON COLORS
  // =========================
  function updateButtonColors(type) {
    const color = letterColors[type];
    document.querySelectorAll(".action-buttons button").forEach(btn => {
      btn.style.background = color;
      btn.style.color = "#fff";
    });
    musicToggle.style.background = color;
  }
  
  // =========================
  // LETTER TITLES
  // =========================
  function updateLetterTitle(type) {
    const titleEl = letters[type].querySelector("#title");
    if (!titleEl) return;
    
    const titles = {
      love: "A Letter From My Heart 💖",
      birthday: "Happy Birthday Wishes 🎉",
      formal: "Formal Letter",
      informal: "Just Saying Hello",
      invitation: "You're Invited 🎀",
      apology: "A Sincere Apology",
      farewell: "Farewell Letter"
    };
    
    titleEl.textContent = titles[type];
  }
  
  // =========================
  // CONTROLS
  // =========================
  letterType.onchange = () => switchLetter(letterType.value);
  fontSelect.onchange = e => letters[letterType.value].style.fontFamily = e.target.value;
  fontColor.oninput = e => letters[letterType.value].style.color = e.target.value;
  fontSizeSlider.oninput = e => letters[letterType.value].style.fontSize = e.target.value + "px";
  
  // =========================
  // MUSIC TOGGLE
  // =========================
  musicToggle.onclick = () => {
    if (music.paused) {
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }
  };
  
  // =========================
  // EXPORT PDF
  // =========================
  exportBtn.onclick = () => {
    const activeLetter = letters[letterType.value];
    html2pdf().from(activeLetter).save("letter.pdf");
  };
  
  // =========================
  // SEND LETTER (FIXED: Full GitHub Pages URL)
  // =========================
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    
    const type = letterType.value;
    const activeLetter = letters[type];
    
    // Get content
    const receiver = activeLetter.querySelector("#receiverName")?.textContent || "";
    const sender = activeLetter.querySelector("#senderName")?.textContent || "";
    const title = activeLetter.querySelector("#title")?.textContent || "";
    const bodyEl = activeLetter.querySelector(".body");
    const body = bodyEl ? bodyEl.innerHTML : "";
    
    // Encode body in Base64
    const encodedBody = encodeContent(body);
    
    // Font, size, color
    const fontFamily = bodyEl ? bodyEl.style.fontFamily || "" : "";
    const fontSize = bodyEl ? bodyEl.style.fontSize.replace("px", "") || "" : "";
    const fontColor = bodyEl ? bodyEl.style.color || "" : "";
    
    // Wax animation
    const seal = activeLetter.querySelector(".waxSeal");
    if (seal) {
      seal.classList.remove("show");
      setTimeout(() => seal.classList.add("show"), 100);
    }
    
    // =========================
    // DYNAMIC GITHUB PAGES LINK
    // =========================
    const currentOrigin = window.location.origin; // e.g., https://dwaineariel.github.io
    const repoName = window.location.pathname.split("/")[1]; // assumes /repo-name/index.html
    const githubBaseUrl = `${currentOrigin}/${repoName}/view.html`;
    
    const viewLink = `${githubBaseUrl}?type=${encodeURIComponent(type)}&receiver=${encodeURIComponent(receiver)}&sender=${encodeURIComponent(sender)}&body=${encodeURIComponent(encodedBody)}&fontFamily=${encodeURIComponent(fontFamily)}&fontSize=${encodeURIComponent(fontSize)}&fontColor=${encodeURIComponent(fontColor)}`;
    
    // EmailJS template parameters
    const templateParams = {
      recipient_email: email,
      receiver_name: receiver,
      sender_name: sender,
      letter_title: title,
      letter_type: type,
      letter_body_encoded: encodedBody,
      font_family: fontFamily,
      font_size: fontSize,
      font_color: fontColor,
      letter_color: letterColors[type],
      view_link: viewLink // <-- receiver opens the full letter here
    };
    
    emailjs
      .send("service_blwhkvs", "template_ka72mdg", templateParams)
      .then(() => alert("Letter sent successfully!"))
      .catch(err => {
        console.error(err);
        alert("Error sending letter. Check console.");
      });
  };
  
  // =========================
  // INIT
  // =========================
  switchLetter(letterType.value);
  
});