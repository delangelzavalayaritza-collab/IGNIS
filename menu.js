// ====== Botones y secciones ======
const buttons = document.querySelectorAll('.menu-btn');
const contentArea = document.getElementById('content-area');
const rightPanel = document.getElementById('right-panel');
const fireTransition = document.getElementById('fire-transition');

// ====== Audios ======
const introAudio = document.getElementById('intro-audio');
const tipsAudio = document.getElementById('tips-audio');
const gamesAudio = document.getElementById('games-audio');
const downloadsAudio = document.getElementById('downloads-audio');
const helpAudio = document.getElementById('help-audio');

const audios = [introAudio, tipsAudio, gamesAudio, downloadsAudio, helpAudio];

// ====== Contenidos de texto ======
const sections = {
  tips: {
    title: "Info & Tips",
    text: "Here you’ll find awesome tips to improve your skills!"
  },
  games: {
    title: "Games Area",
    text: "Select your subject to start playing and learning!"
  },
  downloads: {
    title: "⬇ Downloads ⬇",
    text: "Choose your subject to download learning materials."
  },
  help: {
    title: "FAQ Section",
    text: "Kids can ask and answer fun questions here!"
  }
};

// ====== Fondos personalizados para cada sección ======
const backgrounds = {
  home: "img/news.jpg",
  tips: "img/class.jpeg",
  games: "img/gam.jpeg",
  downloads: "img/down.jpeg",
  help: "img/help.jpeg"
};

// ====== Reproduce el sonido de intro al primer clic ======
document.body.addEventListener('click', () => {
  if (introAudio.paused) introAudio.play();

  const welcomeVideo = document.getElementById("welcome-video");
  if (welcomeVideo && welcomeVideo.muted) {
    welcomeVideo.muted = false;
    welcomeVideo.play();
  }
}, { once: true });

// ====== Detiene todos los audios y el video ======
function stopAll() {
  audios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });

  const homeVideo = document.querySelector('#home-video');
  if (homeVideo) homeVideo.pause();
}

// ====== Función para generar los botones por materia ======
function createSubjectButtons(section) {
  const subjectsDiv = document.createElement('div');
  subjectsDiv.classList.add('subjects');

  // Rutas diferentes según la sección
  const links = {
    tips: {
      english: "infeng.html",
      math: "infmat.html",
      experiments: "infexp.html",
      art: "infart.html"
    },
    games: {
      english: "gameeng.html",
      math: "gamemat.html",
      experiments: "gamexp.html",
      art: "gameart.html"
    },
    downloads: {
      english: "downeng.html",
      math: "downmat.html",
      experiments: "downexp.html",
      art: "downart.html"
    }
  };

  const sectionLinks = links[section];

  subjectsDiv.innerHTML = `
    <button class="subject-btn" data-link="${sectionLinks.english}">📘 English</button>
    <button class="subject-btn" data-link="${sectionLinks.math}">🧮 Math</button>
    <button class="subject-btn" data-link="${sectionLinks.experiments}">🔬 Experiments</button>
    <button class="subject-btn" data-link="${sectionLinks.art}">🎨 Art & Music</button>
  `;

  rightPanel.appendChild(subjectsDiv);

  // Agrega eventos a cada botón
  const subjectButtons = subjectsDiv.querySelectorAll('.subject-btn');
  subjectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-link');
      window.location.href = link;
    });
  });
}

// ====== Cambio de secciones ======
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const section = btn.dataset.section;
    fireTransition.classList.add('fire-animate');

    setTimeout(() => {
      stopAll();

      // Quita botones anteriores
      const oldSubjects = document.querySelector('.subjects');
      if (oldSubjects) oldSubjects.remove();

      // HOME
      if (section === 'home') {
        contentArea.innerHTML = `
          <video id="home-video" src="ef/Avatar IV Video.mp4" autoplay controls></video>
        `;
        rightPanel.style.background = `url('${backgrounds.home}') center/cover no-repeat`;
      }

      // TIPS
      else if (section === 'tips') {
        contentArea.innerHTML = `
          <div class="tips-box">
            <h2>${sections.tips.title}</h2>
            <p>${sections.tips.text}</p>
          </div>
        `;
        rightPanel.style.background = `url('${backgrounds.tips}') center/cover no-repeat`;
        createSubjectButtons('tips');
      }

      // GAMES
      else if (section === 'games') {
        contentArea.innerHTML = `
          <div class="games-box">
            <h2>${sections.games.title}</h2>
            <p>${sections.games.text}</p>
          </div>
        `;
        rightPanel.style.background = `url('${backgrounds.games}') center/cover no-repeat`;
        createSubjectButtons('games');
      }

      // DOWNLOADS
      else if (section === 'downloads') {
        contentArea.innerHTML = `
          <div class="downloads-box">
            <h2>${sections.downloads.title}</h2>
            <p>${sections.downloads.text}</p>
          </div>
        `;
        rightPanel.style.background = `url('${backgrounds.downloads}') center/cover no-repeat`;
        createSubjectButtons('downloads');
      }

      // HELP
else if (section === 'help') {
  const { title, text } = sections.help;
  contentArea.innerHTML = `
    <div class="faq-container">
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="faq-form">
        <input type="text" id="question-input" placeholder="Write your question..." />
        <button id="add-question-btn">Ask</button>
      </div>
      <ul id="faq-list"></ul>
    </div>
  `;
  rightPanel.style.background = `url('${backgrounds.help}') center/cover no-repeat`;

  const faqList = document.getElementById('faq-list');
  const questionInput = document.getElementById('question-input');
  const addQuestionBtn = document.getElementById('add-question-btn');

  // Manejo de agregar pregunta
  addQuestionBtn.addEventListener('click', () => {
    const questionText = questionInput.value.trim();
    if (questionText === '') return;

    const li = document.createElement('li');
    li.classList.add('faq-item');
    li.innerHTML = `
      <p class="question"><strong>Q:</strong> ${questionText}</p>
      <div class="answer-section">
        <input type="text" class="answer-input" placeholder="Write your answer..." />
        <button class="answer-btn">Reply</button>
        <ul class="answers"></ul>
      </div>
    `;
    faqList.appendChild(li);
    questionInput.value = '';

    // Botón de responder
    const answerBtn = li.querySelector('.answer-btn');
    const answerInput = li.querySelector('.answer-input');
    const answersList = li.querySelector('.answers');

    answerBtn.addEventListener('click', () => {
      const answerText = answerInput.value.trim();
      if (answerText === '') return;

      const ans = document.createElement('li');
      ans.innerHTML = `<strong>A:</strong> ${answerText}`;
      answersList.appendChild(ans);
      answerInput.value = '';
    });
  });
}


      // Audio
      switch (section) {
        case 'tips': tipsAudio.play(); break;
        case 'games': gamesAudio.play(); break;
        case 'downloads': downloadsAudio.play(); break;
        case 'help': helpAudio.play(); break;
      }

    }, 400);

    setTimeout(() => fireTransition.classList.remove('fire-animate'), 1200);
  });
});

// ====== Fondo inicial ======
rightPanel.style.background = `url('${backgrounds.welcome}') center/cover no-repeat`;

// ====== Video de bienvenida ======
window.addEventListener("load", () => {
  contentArea.innerHTML = `
    <video id="welcome-video" src="ef/welcome.mp4" autoplay muted controls></video>
    <h2 class="welcome-floating"> Welcome to Learning with Us. Your mission starts now!</h2>
  `;
  rightPanel.style.background = "none";
});
