document.addEventListener('DOMContentLoaded', () => {
  const BIN_ID = '6aa77d61ac6210605aca014b';
  const API_KEY = '$2a$10$1LQiHDhj6H5A/7HbwHM1Fu9DHIZ3/WQP4U1fCjK5d7txdbB8d6TXq';
  
  // 🎥 Ссылка на ваше финальное видео Shorts
  const FINAL_VIDEO_URL = 'https://www.youtube.com/embed/QUOypiTKrCE?autoplay=1';

  const input = document.getElementById('word-input');
  const btn = document.getElementById('add-btn');
  const wordCountEl = document.getElementById('word-count');
  const statusMsg = document.getElementById('status-message');
  const wordsCloud = document.getElementById('words-cloud');
  const treeImg = document.getElementById('tree-img');
  const subtitleEl = document.querySelector('.subtitle');
  const stageContainer = document.querySelector('.stage');
  const finalVideoContainer = document.getElementById('final-video-container');
  const finalVideo = document.getElementById('final-video');

  const stages = [
    {
      date: '2026-09-14',
      image: '1789320691951.jpg',
      title: 'День 1 (14.09): Посажено священное семя (Кетер)',
      subtitle: '«Корона — Кетер». Каждая подруга вносит предложение-намерение на день.',
      placeholder: 'Напиши своё намерение-предложение...',
      unitName: 'намерений',
      dupError: 'Такое намерение уже было! Напишите уникальное предложение.'
    },
    {
      date: '2026-09-15',
      image: '1789320940879.jpg',
      title: 'День 2 (15.09): Хохма и Бина 💡 (Мудрость и Понимание)',
      subtitle: '«Встречаю день с теплотой в сердце и пониманием к каждой подруге». Напишите 1 хорошую, добрую мысль, которая поддержит девочек.',
      placeholder: 'Напиши доброе поддерживающее пожелание...',
      unitName: 'мыслей',
      dupError: 'Такая мысль уже была добавлена! Напишите другую.'
    },
    {
      date: '2026-09-16',
      image: '1789321156651.jpg',
      title: 'День 3 (16.09): Хесед, Гвура, Тиферет 🎨 (Любовь, Сила и Гармония)',
      subtitle: '«Раскрываю сердце для тепла и строю мир в нашей группе». Напишите короткое приятное слово или комплимент подруге.',
      placeholder: 'Напиши комплимент или приятное слово...',
      unitName: 'комплиментов',
      dupError: 'Этот комплимент уже был! Придумайте другой.'
    },
    {
      date: '2026-09-17',
      image: '1789321283408.jpg',
      title: 'День 4 (17.09): Нецах и Год ⚡ (Упорство и Благодарность)',
      subtitle: '«С благодарностью принимаю этот день и уверенно иду вперёд». Напишите 1 простую благодарность за день.',
      placeholder: 'Напиши благодарность за день...',
      unitName: 'благодарностей',
      dupError: 'Такая благодарность уже написана! Поделитесь другой.'
    },
    {
      date: '2026-09-18',
      image: '1789321336043.jpg',
      title: 'День 5 (18.09): Йесод 🫂 (Основа и Связь)',
      subtitle: '«Собираю всё тепло недели в единый душевный привет». Напишите 1 доброе пожелание на выходные.',
      placeholder: 'Напиши пожелание на выходные...',
      unitName: 'пожеланий',
      dupError: 'Такое пожелание уже есть! Пожелайте что-то ещё.'
    },
    {
      date: '2026-09-19',
      image: '1789321524805.jpg',
      title: '✨ День 6 (19.09): Малхут 👑 (Наше Общее Кли)',
      subtitle: '«Принимаю весь Свет нашей недели и чувствую наше единство». Напишите простую фразу-объятие.',
      placeholder: 'Напиши фразу-объятие...',
      unitName: 'объятий',
      dupError: 'Такая фраза уже была! Напишите свои тёплые слова.'
    }
  ];

  const DAILY_GOAL = 12;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  let currentStageIndex = 0;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (todayStr >= stages[i].date) {
      currentStageIndex = i;
      break;
    }
  }

  const activeStage = stages[currentStageIndex];
  let globalWordsArray = [];
  let isFirstLoad = true;

  // Приветственный затеняющийся экран в новый день
  function showDayWelcomeAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'day-welcome-overlay';
    
    const text = document.createElement('div');
    text.className = 'day-welcome-text';
    text.textContent = `✨ ${activeStage.title.split(':')[0]} ✨`;
    
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    playFullMagicAnimation();

    setTimeout(() => overlay.remove(), 2600);
  }

  // Плавное обновление картинки дерева
  function setTreeImageSmoothly(newSrc) {
    if (treeImg.src.includes(newSrc)) return;
    
    treeImg.classList.add('tree-transition');
    setTimeout(() => {
      treeImg.src = newSrc;
      treeImg.classList.remove('tree-transition');
    }, 600);
  }

  // Полная анимация: лейка + падающие звёзды
  function playFullMagicAnimation() {
    if (!stageContainer) return;

    const starSymbols = ['✨', '⭐', '🌟', '✦'];
    for (let i = 0; i < 9; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.className = 'star-sparkle';
        star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
        star.style.left = Math.random() * 85 + 5 + '%';
        star.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        stageContainer.appendChild(star);
        setTimeout(() => star.remove(), 2000);
      }, i * 120);
    }

    const can = document.createElement('div');
    can.className = 'watering-can';
    can.textContent = '🌟';
    stageContainer.appendChild(can);
    setTimeout(() => can.remove(), 2300);

    const lightElements = ['✨', '💦', '⭐', '🌟', '💧', '✨'];
    lightElements.forEach((symbol, i) => {
      setTimeout(() => {
        const drop = document.createElement('div');
        drop.className = 'magic-drop';
        drop.textContent = symbol;
        drop.style.left = (60 + (Math.random() * 20 - 10)) + 'px';
        drop.style.animationDuration = (1.2 + Math.random() * 0.5) + 's';
        stageContainer.appendChild(drop);
        setTimeout(() => drop.remove(), 1800);
      }, 400 + i * 120);
    });
  }

  async function fetchCloudData() {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await res.json();
      const record = data.record || {};

      if (record.date !== todayStr) {
        globalWordsArray = [];
        await saveCloudData([]);
      } else {
        globalWordsArray = record.words || [];
      }

      if (isFirstLoad) {
        showDayWelcomeAnimation();
        isFirstLoad = false;
      }

      renderUI();
    } catch (e) {
      console.error(e);
      statusMsg.textContent = 'Подключение к сети...';
    }
  }

  async function saveCloudData(newWords) {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ date: todayStr, words: newWords })
      });
    } catch (e) {
      console.error(e);
    }
  }

  function renderUI() {
    wordsCloud.innerHTML = '';
    globalWordsArray.forEach(text => {
      const tag = document.createElement('div');
      tag.className = 'word-tag';
      tag.textContent = text;
      wordsCloud.appendChild(tag);
    });

    if (subtitleEl) subtitleEl.textContent = activeStage.subtitle;
    if (input) input.placeholder = activeStage.placeholder;

    const todayWordsCount = globalWordsArray.length;
    wordCountEl.textContent = `${todayWordsCount} / ${DAILY_GOAL}`;
    
    setTreeImageSmoothly(activeStage.image);

    if (currentStageIndex === stages.length - 1 && todayWordsCount >= DAILY_GOAL) {
      statusMsg.textContent = '🌳 Древо Сфирот полностью расцвело! Поздравляем с прохождением ритуала!';
      if (finalVideoContainer && finalVideo) {
        finalVideoContainer.style.display = 'block';
        if (!finalVideo.src) {
          finalVideo.src = FINAL_VIDEO_URL;
        }
      }
    } else if (todayWordsCount >= DAILY_GOAL) {
      statusMsg.textContent = `🎉 Задание дня выполнено всей командой (12 из 12 ${activeStage.unitName})! Новое дерево откроется завтра!`;
    } else {
      statusMsg.textContent = `${activeStage.title}. Добавьте ещё ${DAILY_GOAL - todayWordsCount} ${activeStage.unitName} сегодня!`;
    }
  }

  async function addWord() {
    const text = input.value.trim();
    if (text === '') return;

    const isDuplicate = globalWordsArray.some(w => w.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      playFullMagicAnimation();
      alert(activeStage.dupError);
      input.value = '';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Отправка...';

    playFullMagicAnimation();

    globalWordsArray.push(text);
    await saveCloudData(globalWordsArray);
    renderUI();

    input.value = '';
    btn.disabled = false;
    btn.textContent = 'Отправить';
  }

  btn.onclick = addWord;

  fetchCloudData();
  setInterval(fetchCloudData, 5000);
});
