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
  
  // Background colors for buttons per letter (slightly darker)
  const buttonColors = {
    love: "#700000",
    birthday: "#e6c200",
    formal: "#a0a0a0",
    informal: "#228b22",
    invitation: "#9a2fd3",
    apology: "#e55337",
    farewell: "#009b9b"
  };
  
  // Pause/play symbol toggle
  let isPlaying = false;
  
  function updateMusicToggleSymbol() {
    musicToggle.textContent = isPlaying ? "❚❚" : "►";
  }
  
  // Open envelope
  openBtn.onclick = () => {
    const flap = document.querySelector(".env-flap");
    flap.style.transition = "transform 0.7s ease";
    flap.style.transform = "rotateX(180deg)";
    
    setTimeout(() => {
      envelopeScreen.style.display = "none";
      app.classList.remove("hidden");
      
      // Show default letter
      switchLetter(letterType.value);
      
      // Reset wax seals
      Object.values(letters).forEach(l => {
        const seal = l.querySelector(".waxSeal");
        if (seal) seal.classList.remove("show");
      });
      
    }, 700);
  };
  
  // Set date for all letters
  Object.values(letters).forEach(letter => {
    const dateEl = letter.querySelector(".date");
    if (dateEl) dateEl.textContent = new Date().toDateString();
  });
  
  // Switch letter function
  function switchLetter(type) {
    Object.keys(letters).forEach(key => letters[key].classList.add("hidden"));
    const activeLetter = letters[type];
    activeLetter.classList.remove("hidden");
    
    // Apply font & color & size
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";
    
    // Set body background for page
    document.body.className = type;
    
    // Update button colors
    const btnColor = buttonColors[type];
    [sendBtn, saveDraftBtn, exportBtn, musicToggle].forEach(btn => {
      btn.style.background = btnColor;
      btn.style.color = "#fff";
    });
    
    // Play music if file exists
    const currentMusic = musicFiles[type];
    if (currentMusic) {
      music.src = currentMusic;
      music.play();
      isPlaying = true;
    } else {
      music.pause();
      isPlaying = false;
    }
    updateMusicToggleSymbol();
    
    // Update title font & text color (already in CSS, so no overwrite here)
  }
  
  // Letter type change
  letterType.onchange = () => {
    switchLetter(letterType.value);
  };
  
  // Font & color changes
  fontSelect.onchange = e => {
    const activeLetter = letters[letterType.value];
    activeLetter.style.fontFamily = e.target.value;
  };
  fontColor.oninput = e => {
    const activeLetter = letters[letterType.value];
    activeLetter.style.color = e.target.value;
  };
  
  // Font size slider
  fontSizeSlider.oninput = e => {
    const activeLetter = letters[letterType.value];
    activeLetter.style.fontSize = e.target.value + "px";
  };
  
  // Music toggle
  musicToggle.onclick = () => {
    if (music.paused) {
      music.play();
      isPlaying = true;
    } else {
      music.pause();
      isPlaying = false;
    }
    updateMusicToggleSymbol();
  };
  
  // Save draft
  saveDraftBtn.onclick = () => {
    const activeLetter = letters[letterType.value];
    localStorage.setItem("draft", activeLetter.innerHTML);
    localStorage.setItem("draftType", letterType.value);
    alert("Draft saved!");
  };
  
  // Export PDF
  exportBtn.onclick = () => {
    const activeLetter = letters[letterType.value];
    html2pdf().from(activeLetter).save("letter.pdf");
  };
  
  // Stamp sound
  const stampSound = new Audio("stamp.mp3");
  
  // Send letter with stamp animation
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid recipient email!");
      recipientInput.focus();
      return;
    }
    
    const activeLetter = letters[letterType.value];
    const letterContent = activeLetter.innerHTML;
    const senderNameValue = activeLetter.querySelector("#senderName")?.textContent || "Your Name";
    
    // Show stamp animation
    const seal = activeLetter.querySelector(".waxSeal");
    if (seal) {
      seal.classList.add("show");
      seal.style.transform = "scale(0)";
      setTimeout(() => {
        seal.style.transition = "transform 0.6s ease-out";
        seal.style.transform = "scale(1)";
        stampSound.play();
      }, 100);
    }
    
    const templateParams = {
      recipient_email: email,
      letter_content: letterContent,
      letter_type: letterType.value,
      sender_name: senderNameValue
    };
    
    emailjs.send("service_blwhkvs", "template_ka72mdg", templateParams, "WodD_TueS-UN6i-Va")
      .then(() => alert("Letter sent successfully!"))
      .catch(err => {
        console.error(err);
        alert("Error sending letter. Check console.");
      });
  };
  
});