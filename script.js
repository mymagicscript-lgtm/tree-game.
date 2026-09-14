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
  let globalWordsArray = [];

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

    const starIcon = document.createElement('div');
    starIcon.className = 'watering-can';
    starIcon.textContent = '🌟';
    stageContainer.appendChild(starIcon);
    setTimeout(() => starIcon.remove(), 2000);
  }

  async function fetchCloudData() {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (res.ok) {
        const data = await res.json();
        const record = data.record || {};
        if (record.date !== todayStr) {
          globalWordsArray = [];
          saveCloudData([]);
        } else {
          globalWordsArray = Array.isArray(record.words) ? record.words : [];
        }
      }
    } catch (e) {
      console.log('Ошибка связи с сервером:', e);
    } finally {
      renderUI();
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

    if (statusMsg) {
      if (currentStageIndex === stages.length - 1 && todayWordsCount >= DAILY_GOAL) {
        statusMsg.textContent = '✨ Древо Сфирот полностью расцвело! Поздравляем с прохождением ритуала!';
        if (finalVideoContainer && finalVideo) {
          finalVideoContainer.style.display = 'block';
          if (!finalVideo.src) finalVideo.src = FINAL_VIDEO_URL;
        }
      } else if (todayWordsCount >= DAILY_GOAL) {
        statusMsg.textContent = `🎉 Задание дня выполнено (12 из 12 ${activeStage.unitName})! Новое дерево откроется завтра!`;
      } else {
        statusMsg.textContent = `Собрано: ${todayWordsCount} из ${DAILY_GOAL} ${activeStage.unitName}.`;
      }
    }
  }

  async function addWord() {
    if (!input) return;
    const text = input.value.trim();
    if (text === '') return;

    const isDuplicate = globalWordsArray.some(w => w.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      alert(activeStage.dupError);
      input.value = '';
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Отправка...';
    }

    playFullMagicAnimation();

    globalWordsArray.push(text);
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
  setInterval(fetchCloudData, 6000);
});
