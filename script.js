document.addEventListener('DOMContentLoaded', () => {
  const BIN_ID = '6aa77d61ac6210605aca014b';
  const API_KEY = '$2a$10$1LQiHDhj6H5A/7HbwHM1Fu9DHIZ3/WQP4U1fCjK5d7txdbB8d6TXq';
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
      placeholder: 'Напиши добрую поддерживающую мысль...',
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
      title: 'День 5 (18.09): Йесод 🔌 (Основа и Связь)',
      subtitle: '«Собираю всё тепло недели в единый душевный привет перед Шаббатом». Напишите 1 доброе пожелание на выходные.',
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
  let allDaysData = {}; 
  let globalWordsArray = [];

  const flowerTypes = ['🌸', '🌺', '🌼', '💮', '🏵️', '🪷', '🌺'];

  // Генерація красивих позицій для КВІТІВ по всій кроні (для будь-якої кількості!)
  function getFlowerPosition(index) {
    // Радіус та кут для спірального розміщення
    const goldenAngle = 137.5 * (Math.PI / 180);
    const r = Math.sqrt(index + 1) * 7.5; // розширюється з кожною квіточкою
    const theta = index * goldenAngle;

    // Центр крони дерева в %
    const centerX = 50; 
    const centerY = 38; 

    // Обмеження, щоб квіти не вилітали за межі крони
    const posX = Math.max(18, Math.min(82, centerX + r * Math.cos(theta)));
    const posY = Math.max(18, Math.min(58, centerY + r * Math.sin(theta)));

    return { top: `${posY}%`, left: `${posX}%` };
  }

  function playFullMagicAnimation() {
    if (!stageContainer) return;

    const starSymbols = ['✨', '⭐', '🌟', '✦'];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.className = 'star-sparkle';
        star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
        star.style.left = Math.random() * 80 + 10 + '%';
        stageContainer.appendChild(star);
        setTimeout(() => star.remove(), 1800);
      }, i * 150);
    }
  }

  async function getLatestData() {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (res.ok) {
        const data = await res.json();
        const record = data.record || {};
        allDaysData = record.days || {};
        
        if (Array.isArray(record.words) && !record.days) {
          allDaysData[record.date || todayStr] = record.words;
        }

        return allDaysData[activeStage.date] || [];
      }
    } catch (e) {
      console.log('Ошибка сервера:', e);
    }
    return globalWordsArray;
  }

  async function fetchCloudData() {
    const latestWords = await getLatestData();
    globalWordsArray = latestWords;
    renderUI();
  }

  async function saveCloudData(todayWords) {
    try {
      allDaysData[activeStage.date] = todayWords;
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ days: allDaysData })
      });
    } catch (e) {
      console.log('Ошибка сохранения:', e);
    }
  }

  function renderUI() {
    if (wordsCloud) {
      wordsCloud.innerHTML = '';
      globalWordsArray.forEach(text => {
        const tag = document.createElement('div');
        tag.className = 'word-tag';
        tag.textContent = text;
        wordsCloud.appendChild(tag);
      });
    }

    if (subtitleEl) subtitleEl.textContent = activeStage.subtitle;
    if (input) input.placeholder = activeStage.placeholder;

    const todayWordsCount = globalWordsArray.length;
    if (wordCountEl) wordCountEl.textContent = `${todayWordsCount} / ${DAILY_GOAL}`;
    if (treeImg) treeImg.src = activeStage.image;

    // Малюємо квіти, які ЛИШАЮТЬСЯ (хоч 10, хоч 25, хоч 50 штук)
    if (stageContainer) {
      const oldFlowers = stageContainer.querySelectorAll('.static-flower');
      oldFlowers.forEach(f => f.remove());

      for (let i = 0; i < todayWordsCount; i++) {
        const pos = getFlowerPosition(i);
        const flowerEl = document.createElement('div');
        flowerEl.className = 'static-flower';
        flowerEl.textContent = flowerTypes[i % flowerTypes.length];
        flowerEl.style.top = pos.top;
        flowerEl.style.left = pos.left;
        stageContainer.appendChild(flowerEl);
      }
    }

    const counterLabel = document.querySelector('.counter-label');
    if (counterLabel) {
      const capitalUnit = activeStage.unitName.charAt(0).toUpperCase() + activeStage.unitName.slice(1);
      counterLabel.textContent = `${capitalUnit} собрано:`;
    }

    if (statusMsg) {
      if (currentStageIndex === stages.length - 1 && todayWordsCount >= DAILY_GOAL) {
        statusMsg.textContent = '✨ Древо Сфирот полностью расцвело! Поздравляем с прохождением ритуала!';
        if (finalVideoContainer && finalVideo) {
          finalVideoContainer.style.display = 'block';
          if (!finalVideo.src) finalVideo.src = FINAL_VIDEO_URL;
        }
      } else if (todayWordsCount >= DAILY_GOAL) {
        statusMsg.textContent = `🎉 Цель дня выполнена (${todayWordsCount} ${activeStage.unitName})! Древо расцветает всё сильнее!`;
      } else {
        statusMsg.textContent = `Собрано: ${todayWordsCount} из ${DAILY_GOAL} ${activeStage.unitName}.`;
      }
    }
  }

  async function addWord() {
    if (!input) return;
    const text = input.value.trim();
    if (text === '') return;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Сохранение...';
    }

    const currentWords = await getLatestData();

    const isDuplicate = currentWords.some(w => w.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      alert(activeStage.dupError);
      input.value = '';
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Отправить';
      }
      return;
    }

    playFullMagicAnimation();

    currentWords.push(text);
    globalWordsArray = currentWords;
    renderUI();
    input.value = '';

    await saveCloudData(globalWordsArray);

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Отправить';
    }
  }

  if (btn) btn.onclick = addWord;

  fetchCloudData();
  setInterval(fetchCloudData, 8000);
});
