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
    invitation: "", // leave empty
    apology: "",    // leave empty
    farewell: "farewell.mp3"
  };

  // Colors per letter type (for action buttons)
  const letterColors = {
    love: "#b30000",
    birthday: "#ff9800",
    formal: "#2c2c2c",
    informal: "#388e3c",
    invitation: "#9c27b0",
    apology: "#d17d5a",
    farewell: "#0288d1"
  };

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

  // Switch letter function
  function switchLetter(type) {
    Object.keys(letters).forEach(key => letters[key].classList.add("hidden"));
    letters[type].classList.remove("hidden");

    const activeLetter = letters[type];

    // Apply font & color & size
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";

    // Play music if file exists
    const currentMusic = musicFiles[type];
    if (currentMusic) {
      music.src = currentMusic;
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }

    // Update starting text
    updateLetterIntro(type);

    // Update action button colors dynamically
    updateButtonColors(type);
  }

  // Update action button colors
  function updateButtonColors(type) {
    const color = letterColors[type] || "#7a1c24";
    document.querySelectorAll(".action-buttons button").forEach(btn => {
      btn.style.background = color;
      btn.style.color = "#fff";
    });
    musicToggle.style.background = color;
    musicToggle.style.color = "#fff";
    musicToggle.style.borderRadius = "50%"; // circular
    musicToggle.style.width = "40px";
    musicToggle.style.height = "40px";
    musicToggle.style.fontSize = "18px";
    musicToggle.style.padding = "0";
  }

  // Unique starting texts
  function updateLetterIntro(type) {
    const activeLetter = letters[type];
    const titleEl = activeLetter.querySelector("#title");

    switch(type) {
      case "love": titleEl.textContent = "A Letter From My Heart 💖"; break;
      case "birthday": titleEl.textContent = "Happy Birthday Wishes 🎉"; break;
      case "formal": titleEl.textContent = "A Formal Letter 📝"; break;
      case "informal": titleEl.textContent = "Just Saying Hello 👋"; break;
      case "invitation": titleEl.textContent = "You’re Invited 🎀"; break;
      case "apology": titleEl.textContent = "A Sincere Apology 🙏"; break;
      case "farewell": titleEl.textContent = "Saying Goodbye 👋"; break;
    }
  }

  // Letter type change
  letterType.onchange = () => {
    const type = letterType.value;
    document.body.className = type;
    switchLetter(type);
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
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }
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
  const stampSound = new Audio("stamp.mp3"); // Add your stamp sound file

  // ==============================
  // SEND BUTTON FIXED CODE START
  // ==============================
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid recipient email!");
      recipientInput.focus();
      return;
    }

    const activeLetter = letters[letterType.value];
    const title = activeLetter.querySelector("#title")?.textContent || "";
    const body = activeLetter.querySelector("#body")?.textContent || "";
    const sender = activeLetter.querySelector("#senderName")?.textContent || "Your Name";
    const receiver = activeLetter.querySelector("#receiverName")?.textContent || "Someone";

    // Wax stamp animation
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

    // EmailJS template variables (make sure template matches these)
    const templateParams = {
      to_email: email,
      from_name: sender,
      receiver_name: receiver,
      letter_title: title,
      letter_body: body
    };

    emailjs.send("service_blwhkvs", "template_ka72mdg", templateParams, "WodD_TueS-UN6i-Va")
      .then(() => alert("Letter sent successfully!"))
      .catch(err => {
        console.error(err);
        alert("Error sending letter. Check console.");
      });
  };
  // ==============================
  // SEND BUTTON FIXED CODE END
  // ==============================

  // Initialize first letter
  switchLetter(letterType.value);

});