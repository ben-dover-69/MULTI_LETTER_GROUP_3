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

      switchLetter(letterType.value);

      Object.values(letters).forEach(l => {
        const seal = l.querySelector(".waxSeal");
        if (seal) seal.classList.remove("show");
      });

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

  // Switch letter
  function switchLetter(type) {
    Object.keys(letters).forEach(key => letters[key].classList.add("hidden"));
    letters[type].classList.remove("hidden");

    const activeLetter = letters[type];
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";

    const currentMusic = musicFiles[type];
    if (currentMusic) {
      music.src = currentMusic;
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }

    updateLetterIntro(type);
    updateButtonColors(type);
  }

  function updateButtonColors(type) {
    const color = letterColors[type] || "#7a1c24";
    document.querySelectorAll(".action-buttons button").forEach(btn => {
      btn.style.background = color;
      btn.style.color = "#fff";
    });
    musicToggle.style.background = color;
  }

  function updateLetterIntro(type) {
    const titleEl = letters[type].querySelector("#title");
    if (!titleEl) return;

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

  letterType.onchange = () => {
    document.body.className = letterType.value;
    switchLetter(letterType.value);
  };

  fontSelect.onchange = e => {
    letters[letterType.value].style.fontFamily = e.target.value;
  };
  fontColor.oninput = e => {
    letters[letterType.value].style.color = e.target.value;
  };
  fontSizeSlider.oninput = e => {
    letters[letterType.value].style.fontSize = e.target.value + "px";
  };

  musicToggle.onclick = () => {
    if (music.paused) {
      music.play();
      musicToggle.textContent = "⏸️";
    } else {
      music.pause();
      musicToggle.textContent = "▶️";
    }
  };

  saveDraftBtn.onclick = () => {
    const activeLetter = letters[letterType.value];
    localStorage.setItem("draft", activeLetter.innerHTML);
    localStorage.setItem("draftType", letterType.value);
    alert("Draft saved!");
  };

  exportBtn.onclick = () => {
    html2pdf().from(letters[letterType.value]).save("letter.pdf");
  };

  const stampSound = new Audio("stamp.mp3");

  /* =====================================================
     ✅ ADDITION ONLY — FIX REAL CONTENT SENDING
  ===================================================== */
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid recipient email!");
      return;
    }

    const activeLetter = letters[letterType.value];

    // 🔧 ADD: extract ACTUAL edited content
    const receiver = activeLetter.querySelector(".dear span")?.textContent || "";
    const title = activeLetter.querySelector("#title")?.textContent || "";
    const body = activeLetter.querySelector(".body")?.innerHTML || "";
    const sender = activeLetter.querySelector("#senderName")?.textContent || "";

    // 🔧 ADD: store for view.html
    localStorage.setItem("letter_type", letterType.value);
    localStorage.setItem("receiver", receiver);
    localStorage.setItem("title", title);
    localStorage.setItem("body", body);
    localStorage.setItem("sender", sender);

    const seal = activeLetter.querySelector(".waxSeal");
    if (seal) {
      seal.classList.remove("show");
      setTimeout(() => {
        seal.classList.add("show");
        stampSound.currentTime = 0;
        stampSound.play();
      }, 150);
    }

    // 🔧 ADD: send CLEAN params (not raw innerHTML)
    emailjs.send(
      "service_blwhkvs",
      "template_ka72mdg",
      {
        to_email: email,
        letter_type: letterType.value,
        receiver_name: receiver,
        letter_title: title,
        letter_body: body,
        sender_name: sender
      }
    )
    .then(() => alert("Letter sent successfully!"))
    .catch(err => {
      console.error(err);
      alert("Error sending letter.");
    });
  };

  switchLetter(letterType.value);

});