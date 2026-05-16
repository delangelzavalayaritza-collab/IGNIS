document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded and DOM ready!");

  const gradeButtons = document.querySelectorAll(".primary-btn, .secondary-btn, .high-btn");
  const difficultySection = document.querySelector(".difficulty-section");
  const difficultyButtons = document.querySelectorAll("#difficulty-select button");
  const gamesList = document.getElementById("gamesList");

  let selectedGrade = "";
  let selectedDifficulty = "";
  let currentQuestions = [];
  let timerActive = false;

  // 🎵 === CARGAR SONIDOS ===
  // 📁 Coloca los audios en una carpeta llamada "ef" junto a tu index.html
  const correctSound = new Audio("ef/yupi.m4a"); // cuando acierta
  const wrongSound = new Audio("ef/wrong.m4a");  // cuando se equivoca
  const timeoutSound = new Audio("ef/timeout.m4a"); // cuando se acaba el tiempo

  // === 1️⃣ SELECCIONAR GRADO ===
  gradeButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedGrade = button.textContent.trim();
      gamesList.innerHTML = "";
      difficultySection.style.display = "block";
      difficultySection.classList.add("fade-in");
      setTimeout(() => difficultySection.classList.remove("fade-in"), 600);
    });
  });

  // === 2️⃣ SELECCIONAR DIFICULTAD ===
  difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedDifficulty = button.textContent.trim();
      showGames(selectedGrade, selectedDifficulty);
    });
  });

  // === 3️⃣ MOSTRAR JUEGOS DISPONIBLES ===
  function showGames(grade, difficulty) {
    gamesList.innerHTML = "";
    gamesList.classList.add("fade-in");

    const games = [
      { name: "Word Match Challenge", desc: "Match English words with their meanings or pictures." },
      { name: "Grammar Sprint", desc: "Choose the correct grammar structure before time runs out!" },
      { name: "Spelling Storm", desc: "Pick the correctly spelled word!" },
      { name: "Sentence Builder", desc: "Select the best-formed sentence." }
    ];

    const title = document.createElement("h3");
    title.textContent = `${grade} – ${difficulty} Level`;
    title.style.marginBottom = "15px";
    gamesList.appendChild(title);

    games.forEach(game => {
      const btn = document.createElement("button");
      btn.textContent = game.name;
      btn.classList.add("option");
      btn.addEventListener("click", () => startGame(game.name, difficulty));
      gamesList.appendChild(btn);
    });
  }

  // === 4️⃣ BASE DE PREGUNTAS (reducida a 5 por nivel) ===
  const questions = {
    "Word Match Challenge": {
      Easy: [
        { question: "Which word means 'apple'?", options: ["pear", "manzana", "banana"], answer: "manzana", image: "img/apple.png" },
        { question: "What animal is 'dog'?", options: ["gato", "pez", "perro"], answer: "perro", image: "img/dog.png" },
        { question: "What means 'house'?", options: ["casa", "escuela", "puerta"], answer: "casa", image: "img/house.png" },
        { question: "The word 'sun' means...", options: ["luna", "sol", "estrella"], answer: "sol", image: "img/sun.png" },
        { question: "The word 'rain' means...", options: ["lluvia", "nieve", "viento"], answer: "lluvia", image: "img/rain.png" },
      ],
      Medium: [
        { question: "‘Chair’ means...", options: ["silla", "mesa", "puerta"], answer: "silla", image: "img/chair.jpg" },
        { question: "‘Window’ means...", options: ["ventana", "puerta", "pared"], answer: "ventana", image: "img/window.jpg" },
        { question: "‘Book’ means...", options: ["revista", "libro", "hoja"], answer: "libro", image: "img/book.jpg" },
        { question: "‘Friend’ means...", options: ["amigo", "enemigo", "vecino"], answer: "amigo", image: "img/friend.jpg" },
        { question: "‘Clock’ means...", options: ["reloj", "hora", "tiempo"], answer: "reloj", image: "img/clock.jpg" },
      ],
      Hard: [
        { question: "‘Put up with’ means...", options: ["To tolerate or endure", "To hang decorations", "To fix something"], answer: "To tolerate or endure", image: "img/put.png" },
        { question: "‘Come up with’ means...", options: ["To destroy it", "To invent or think of it", "To steal it"], answer: "To invent or think of it", image: "img/come.png" },
        { question: "‘Turn down’ means...", options: ["To reject it", "To make it louder", "To rewrite it"], answer: "To reject it", image: "img/turn.png" },
        { question: "‘Come down with’ means...", options: ["To jump down from somewhere", "To stop being sick", "To become ill with it"], answer: "To become ill with it", image: "img/with.png" },
        { question: "‘Turn up’ means...", options: ["To refuse to help", "To stay at home", "To arrive unexpectedly"], answer: "To arrive unexpectedly", image: "img/up.jpeg" },
      ]
    }
  };

  // === 5️⃣ INICIAR EL JUEGO ===
  function startGame(gameName, difficulty) {
    const qList = questions[gameName][difficulty];
    let index = 0;
    gamesList.innerHTML = "";
    showQuestion(qList[index]);

    function showQuestion(q) {
      gamesList.innerHTML = ""; // Limpieza segura
      const title = document.createElement("h2");
      title.textContent = gameName;
      gamesList.appendChild(title);

      timerActive = true;

      // 🖼️ Mostrar imagen (si hay)
      if (q.image) {
        const img = document.createElement("img");
        img.src = q.image;
        img.alt = "Question image";
        img.style.width = "180px";
        img.style.margin = "15px auto";
        img.style.display = "block";
        img.style.borderRadius = "10px";
        img.style.boxShadow = "0 0 10px rgba(255,255,255,0.4)";
        img.classList.add("fade-in");
        gamesList.appendChild(img);
      }

      // 📝 Pregunta
      const p = document.createElement("p");
      p.textContent = q.question;
      gamesList.appendChild(p);

      // 🔘 Opciones
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.classList.add("option");
        btn.addEventListener("click", () => {
          if (!timerActive) return;
          checkAnswer(opt, q.answer);
        });
        gamesList.appendChild(btn);
      });

      // ⏳ Barra de tiempo
      const timerBar = document.createElement("div");
      timerBar.id = "timer-bar";
      timerBar.innerHTML = '<div id="timer-fill"></div>';
      gamesList.appendChild(timerBar);

      startTimer(10, () => {
        if (timerActive) {
          timeoutSound.play();
          nextQuestion(false);
        }
      });
    }

    // ✅ Verificar respuesta
    function checkAnswer(opt, answer) {
      timerActive = false;
      if (opt === answer) {
        correctSound.play();
      } else {
        wrongSound.play();
      }
      setTimeout(() => nextQuestion(), 6000); // ⏱ Espera 6s antes de pasar
    }

    // 🔁 Siguiente pregunta
    function nextQuestion() {
      index++;
      if (index < qList.length) {
        showQuestion(qList[index]);
      } else {
        gamesList.innerHTML = `<h2>🎉 Game Over!</h2>
          <p>You finished the ${difficulty} level of ${gameName}!</p>
          <button class="back-btn">⬅ Back to Games</button>`;
        document.querySelector(".back-btn").addEventListener("click", () => showGames(selectedGrade, selectedDifficulty));
      }
    }
  }

  // === 6️⃣ TEMPORIZADOR ===
  function startTimer(seconds, callback) {
    const timerFill = document.getElementById("timer-fill");
    let elapsed = 0;
    timerFill.style.width = "100%";
    timerFill.style.background = "green";

    const countdown = setInterval(() => {
      elapsed++;
      const width = 100 - (elapsed / seconds) * 100;
      timerFill.style.width = width + "%";

      if (elapsed >= seconds) {
        clearInterval(countdown);
        callback();
      } else if (elapsed >= seconds * 0.7) {
        timerFill.style.background = "red";
      } else if (elapsed >= seconds * 0.4) {
        timerFill.style.background = "orange";
      }
    }, 1000);
  }

  difficultySection.style.display = "none";
});
