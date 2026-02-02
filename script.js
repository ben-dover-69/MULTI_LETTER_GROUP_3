document.addEventListener("DOMContentLoaded", () => {
  
  emailjs.init("WodD_TueS-UN6i-Va"); // Your public key
  
  // Elements
  const openBtn = document.getElementById("openLetterBtn");
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
  
  const musicFiles = {
    love: "kuped.mp3",
    birthday: "bdaysmegs.mp3",
    formal: "peynknwite.mp3"
  };
  
  // OPEN LETTER
  openBtn.onclick = () => {
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
  
  // DATE
  document.getElementById("date").textContent = new Date().toDateString();
  
  // FONT & COLOR
  document.getElementById("fontSelect").onchange = e => letter.style.fontFamily = e.target.value;
  document.getElementById("fontColor").onchange = e => letter.style.color = e.target.value;
  
  // LETTER TYPE CHANGE
  letterType.onchange = () => {
    const type = letterType.value;
    document.body.className = type;
    
    const title = document.getElementById("title");
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
  exportBtn.onclick = () => html2pdf().from(letter).save("letter.pdf");
  
  // SEND LETTER (fixed: preserve content at time of send)
  sendBtn.onclick = () => {
    const email = recipientInput.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid recipient email!");
      recipientInput.focus();
      return;
    }
    
    // Capture the letter content at send time
    const letterContent = letter.innerHTML; // **fixed**
    const letterTypeValue = letterType.value;
    const senderNameValue = document.getElementById("senderName").textContent;
    
    const templateParams = {
      recipient_email: email,
      letter_content: letterContent,
      letter_type: letterTypeValue,
      sender_name: senderNameValue
    };
    
    emailjs.send("service_blwhkvs", "template_ka72mdg", templateParams, "WodD_TueS-UN6i-Va")
      .then(response => alert("Letter sent successfully!"))
      .catch(error => alert("Error sending letter. Check console."));
  };
  
});