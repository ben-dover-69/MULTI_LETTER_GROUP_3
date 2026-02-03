document.addEventListener("DOMContentLoaded", () => {
  
  emailjs.init("WodD_TueS-UN6i-Va"); // Your public key
  
  // Elements
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
  
  // Letter boxes
  const letters = {
    love: document.getElementById("letter-love"),
    birthday: document.getElementById("letter-birthday"),
    formal: document.getElementById("letter-formal"),
    informal: document.getElementById("letter-informal"),
    invitation: document.getElementById("letter-invitation"),
    apology: document.getElementById("letter-apology"),
    farewell: document.getElementById("letter-farewell")
  };
  
  // Background music per letter
  const musicFiles = {
    love: "kuped.mp3",
    birthday: "bdaysmegs.mp3",
    formal: "peynknwite.mp3",
    informal: "informal.mp3",
    invitation: "",
    apology: "",
    farewell: "farewell.mp3"
  };
  
  // Colors per letter type (for action buttons & email preview)
  const letterColors = {
    love: "#b30000",
    birthday: "#ff9800",
    formal: "#2c2c2c",
    informal: "#388e3c",
    invitation: "#9c27b0",
    apology: "#d17d5a",
    farewell: "#0288d1"
  };
  
  // Stamp sound
  const stampSound = new Audio("stamp.mp3");
  
  // OPEN ENVELOPE
  openBtn.onclick = () => {
    const flap = document.querySelector(".env-flap");
    flap.style.transition = "transform 0.7s ease";
    flap.style.transform = "rotateX(180deg)";
    
    setTimeout(() => {
      envelopeScreen.style.display = "none";
      app.classList.remove("hidden");
      
      // Show current letter
      switchLetter(letterType.value);
      
      // Reset all wax seals
      Object.values(letters).forEach(l => {
        const seal = l.querySelector(".waxSeal");
        if (seal) seal.classList.remove("show");
      });
      
      // Play music if exists
      const currentMusic = musicFiles[letterType.value];
      if (currentMusic) {
        music.src = currentMusic;
        music.play();
        musicToggle.textContent = "⏸️";
      }
    }, 700);
  };
  
  // Set date for all letters
  Object.values(letters).forEach(letter => {
    const dateEl = letter.querySelector(".date");
    if (dateEl) dateEl.textContent = new Date().toDateString();
  });
  
  // SWITCH LETTER
  function switchLetter(type) {
    Object.keys(letters).forEach(key => letters[key].classList.add("hidden"));
    const activeLetter = letters[type];
    activeLetter.classList.remove("hidden");
    
    // Apply font, color, size
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";
    
    // Play music
    const currentMusic = musicFiles[type];
    if (currentMusic) {
      music.src = currentMusic;
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }
    
    // Update button colors
    updateButtonColors(type);
  }
  
  // Update action buttons colors
  function updateButtonColors(type) {
    const color = letterColors[type] || "#7a1c24";
    document.querySelectorAll(".action-buttons button").forEach(btn => {
      btn.style.background = color;
      btn.style.color = "#fff";
    });
    musicToggle.style.background = color;
    musicToggle.style.color = "#fff";
  }
  
  // FONT & COLOR HANDLERS
  fontSelect.onchange = e => letters[letterType.value].style.fontFamily = e.target.value;
  fontColor.oninput = e => letters[letterType.value].style.color = e.target.value;
  fontSizeSlider.oninput = e => letters[letterType.value].style.fontSize = e.target.value + "px";
  
  // MUSIC TOGGLE
  musicToggle.onclick = () => {
    if (music.paused) {
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }
  };
  
  // SAVE DRAFT
  saveDraftBtn.onclick = () => {
    const activeLetter = letters[letterType.value];
    localStorage.setItem("draft", activeLetter.innerHTML);
    localStorage.setItem("draftType", letterType.value);
    alert("Draft saved!");
  };
  
  // EXPORT PDF
  exportBtn.onclick = () => html2pdf().from(letters[letterType.value]).save("letter.pdf");
  
  // ==============================
  // ✅ FIXED SEND LETTER FOR ALL TYPES
  // ==============================
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid recipient email!");
      recipientInput.focus();
      return;
    }
    
    const type = letterType.value;
    const activeLetter = letters[type];
    
    if (!activeLetter) {
      alert("No active letter found!");
      return;
    }
    
    const receiverName = activeLetter.querySelector("#receiverName")?.textContent || "Someone";
    const senderNameValue = activeLetter.querySelector("#senderName")?.textContent || "Your Name";
    const letterTitle = activeLetter.querySelector("#title")?.textContent || "Letter Title";
    const letterContent = activeLetter.querySelector(".body")?.innerHTML || "";
    
    // Wax seal animation
    const seal = activeLetter.querySelector(".waxSeal");
    if (seal) {
      seal.classList.remove("show");
      seal.style.transition = "none";
      seal.style.transform = "scale(0)";
      setTimeout(() => {
        seal.style.transition = "transform 0.6s ease-out, opacity 0.6s ease";
        seal.classList.add("show");
        seal.style.transform = "scale(1)";
        stampSound.currentTime = 0;
        stampSound.play();
      }, 100);
    }
    
    // Prepare EmailJS template
    const templateParams = {
      recipient_email: email,
      receiver_name: receiverName,
      letter_type: type,
      letter_title: letterTitle,
      letter_content: letterContent,
      sender_name: senderNameValue,
      letter_bg_color: letterColors[type] || "#fde2e2" // dynamic color for template
    };
    
    emailjs.send("service_blwhkvs", "template_ka72mdg", templateParams, "WodD_TueS-UN6i-Va")
      .then(() => alert("Letter sent successfully!"))
      .catch(err => {
        console.error(err);
        alert("Error sending letter. Check console.");
      });
  };
  
  // INITIAL LETTER
  switchLetter(letterType.value);
  
  // LETTER TYPE CHANGE
  letterType.onchange = () => {
    const type = letterType.value;
    document.body.className = type;
    switchLetter(type);
  };
  
});