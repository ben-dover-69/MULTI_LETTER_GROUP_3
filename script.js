/* ===== DATE ===== */
document.getElementById("date").innerText =
  new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});

/* ===== ELEMENTS ===== */
const format=document.getElementById("format");
const title=document.getElementById("title");
const letterBox=document.getElementById("letterBox");
const fontSelect=document.getElementById("fontSelect");
const textColor=document.getElementById("textColor");
const fontSize=document.getElementById("fontSize");
const message=document.getElementById("message");
const recipient=document.getElementById("recipient");
const sender=document.getElementById("sender");
const email=document.getElementById("email");
const openBtn=document.getElementById("openBtn");
const pdfBtn=document.getElementById("pdfBtn");
const saveDraft=document.getElementById("saveDraft");
const sendBtn=document.getElementById("sendBtn");
const musicBtn=document.getElementById("musicBtn");
const bgMusic=document.getElementById("bgMusic");
const envelope=document.getElementById("envelope");
const flap=document.getElementById("flap");
const waxSeal=document.getElementById("waxSeal");

/* ===== MUSIC ===== */
let playing=false;
const music={
  love:"kuped.mp3",
  formal:"peynknwite.mp3",
  informal:"arizonab.mp3",
  birthday:"bdaysmegs.mp3",
  invitation:"when.mp3"
};
bgMusic.src=music.love;

musicBtn.onclick=()=>{
  if(!playing){ bgMusic.play(); musicBtn.innerText="⏸"; }
  else{ bgMusic.pause(); musicBtn.innerText="▶"; }
  playing=!playing;
};

/* ===== LETTER SWITCH ===== */
format.onchange=()=>{
  document.body.className=format.value;
  title.innerText=format.options[format.selectedIndex].text;
  bgMusic.src=music[format.value];
  if(playing) bgMusic.play();
};

/* ===== STYLE CONTROLS ===== */
fontSelect.onchange=()=>letterBox.style.fontFamily=fontSelect.value;
textColor.oninput=()=>letterBox.style.color=textColor.value;
fontSize.oninput=()=>letterBox.style.fontSize=fontSize.value+"px";

/* ===== OPEN LETTER ===== */
openBtn.onclick=()=>{
  // flap folds first
  flap.style.transition="transform 0.6s ease";
  flap.style.transform="rotateX(-180deg)";

  // letter slides up
  setTimeout(()=>{
    letterBox.style.transition="transform 0.6s ease, opacity 0.6s ease";
    letterBox.style.transform="translateY(-20px)";
    letterBox.style.opacity=1;

    // letter content shown
    document.querySelector(".letter-content").style.display="block";
  },600);

  // wax seal pops in after letter slides
  setTimeout(()=>{
    waxSeal.style.transition="transform 0.5s ease";
    waxSeal.style.transform="scale(1)";
  }, 1200);

  // enable controls and buttons
  setTimeout(()=>{
    [fontSelect,textColor,fontSize,email,musicBtn,pdfBtn,saveDraft,sendBtn].forEach(el=>el.disabled=false);
  }, 1200);

  // hide open button
  openBtn.style.display="none";
};

/* ===== SAVE DRAFT ===== */
saveDraft.onclick=()=>{
  localStorage.setItem("draft",JSON.stringify({
    r:recipient.value,
    m:message.value,
    s:sender.value
  }));
  alert("Draft saved");
};

/* ===== EXPORT PDF ===== */
pdfBtn.onclick=()=>{
  html2canvas(letterBox).then(canvas=>{
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','pt','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = canvas.height * pdfWidth / canvas.width;
    pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
    pdf.save('letter.pdf');
  });
};

/* ===== SEND EMAIL WITH WAX SEAL ANIMATION ===== */
sendBtn.onclick = () => {
  if(!email.value){ 
    alert("Enter recipient email"); 
    return; 
  }

  // stamp animation
  waxSeal.style.transition="transform 0.4s ease";
  waxSeal.style.transform="scale(0.8) rotate(-15deg)";
  setTimeout(()=>{ waxSeal.style.transform="scale(1) rotate(0deg)"; },400);

  setTimeout(()=>{
    const data={
      title:title.innerText,
      recipient:recipient.value,
      message:message.value,
      sender:sender.value||"Anonymous",
      date:document.getElementById("date").innerText,
      type:format.value,
      font:getComputedStyle(letterBox).fontFamily,
      color:getComputedStyle(letterBox).color,
      size:getComputedStyle(letterBox).fontSize
    };

    const encoded=btoa(JSON.stringify(data));
    const link=`https://ben-dover-69.github.io/MULTI_LETTER_GROUP3/view.html?data=${encoded}`;

    emailjs.send("service_blwhkvs","template_ka72mdg",{
      email:email.value,
      view_link:link
    }).then(()=>{ alert("Letter sent successfully 💌"); })
    .catch(()=>{ alert("Send failed"); });
  },500);
};