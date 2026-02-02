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

  // Letter background colors for buttons
  const letterColors = {
    love: "#8B0000",       // deep red
    birthday: "#FFB347",  
    formal: "#555555",
    informal: "#4CAF50",
    invitation: "#DA70D6",
    apology: "#FF7F50",
    farewell: "#00BCD4"
  };

  // Stamp sound
  const stampSound = new Audio("stamp.mp3"); // Add your stamp sound file

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
        musicToggle.innerHTML = "❚❚"; // pause symbol
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

    // Apply font, color, size
    activeLetter.style.fontFamily = fontSelect.value;
    activeLetter.style.color = fontColor.value;
    activeLetter.style.fontSize = fontSizeSlider.value + "px";

    // Change background color of buttons to slightly darker than letter background
    const btnColor = letterColors[type];
    document.querySelectorAll(".action-buttons button, #musicToggle").forEach(btn => {
      btn.style.background = btnColor;
      btn.style.filter = "brightness(85%)"; // slightly darker
      btn.style.color = "#fff";
    });

    // Play music if file exists
    const currentMusic = musicFiles[type];
    if (currentMusic) {
      music.src = currentMusic;
      music.play();
      musicToggle.innerHTML = "❚❚"; // pause symbol
    } else {
      music.pause();
      musicToggle.innerHTML = "►"; // play symbol
    }

    // Update starting text
    updateLetterIntro(type);
  }

  // Unique starting texts
  function updateLetterIntro(type) {
    const activeLetter = letters[type];
    const titleEl = activeLetter.querySelector("#title");

    switch(type) {
      case "love": titleEl.textContent = "A Letter From My Heart 💖"; titleEl.style.fontFamily = "'Dancing Script', cursive"; break;
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

  // Music toggle button
  musicToggle.onclick = () => {
    if (music.paused) {
      music.play();
      musicToggle.innerHTML = "❚❚"; // pause
    } else {
      music.pause();
      musicToggle.innerHTML = "►"; // play
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

  // Send letter with stamp animation and proper typed content
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid recipient email!");
      recipientInput.focus();
      return;
    }

    const activeLetter = letters[letterType.value];

    // Capture typed content
    const receiverName = activeLetter.querySelector("#receiverName")?.textContent || "Someone Special";
    const senderNameValue = activeLetter.querySelector("#senderName")?.textContent || "Your Name";
    const letterTitle = activeLetter.querySelector("#title")?.textContent || "";
    const letterBody = activeLetter.querySelector("#body")?.textContent || "";

    const letterContent = `
      <p><strong>Dear ${receiverName},</strong></p>
      <h1>${letterTitle}</h1>
      <p>${letterBody}</p>
      <p>Sincerely,<br>${senderNameValue}</p>
    `;

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