document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('word-input');
  const btn = document.getElementById('add-btn');
  const wordCountEl = document.getElementById('word-count');
  const statusMsg = document.getElementById('status-message');
  const wordsCloud = document.getElementById('words-cloud');
  const treeImg = document.getElementById('tree-img');
  const subtitleEl = document.querySelector('.subtitle');

  // КАЛЕНДАРЬ И ИНДИВИДУАЛЬНЫЕ ЗАДАНИЯ ПО ДНЯМ
  const stages = [
    {
      date: '2026-09-14',
      image: '1789320691951.jpg',
      title: 'День 1 (14.09): Посажено священное семя (Кетер)',
      subtitle: '«Короны — Кетер». Каждая подруга вносит предложение-намерение на день.',
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

  // Выбираем стадию текущего дня
  let currentStageIndex = 0;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (todayStr >= stages[i].date) {
      currentStageIndex = i;
      break;
    }
  }

  const activeStage = stages[currentStageIndex];

  let savedDate = localStorage.getItem('tree_date');
  let todayWords = parseInt(localStorage.getItem('tree_words_count') || '0', 10);
  let savedWordsArray = JSON.parse(localStorage.getItem('tree_words_list') || '[]');

  // При наступлении новой даты очищаем список для свежих записей
  if (savedDate && savedDate !== todayStr) {
    todayWords = 0;
    savedWordsArray = [];
    localStorage.setItem('tree_words_count', '0');
    localStorage.setItem('tree_words_list', '[]');
  }
  
  localStorage.setItem('tree_date', todayStr);

  // Отрисовка списка
  function renderWords() {
    wordsCloud.innerHTML = '';
    savedWordsArray.forEach(wordText => {
      const tag = document.createElement('div');
      tag.className = 'word-tag';
      tag.textContent = wordText;
      wordsCloud.appendChild(tag);
    });
  }

  function updateUI() {
    // Обновляем текст задания под выбранный день
    if (subtitleEl) subtitleEl.textContent = activeStage.subtitle;
    if (input) input.placeholder = activeStage.placeholder;

    wordCountEl.textContent = `${todayWords} / ${DAILY_GOAL}`;
    treeImg.src = activeStage.image;

    if (todayWords >= DAILY_GOAL) {
      if (currentStageIndex < stages.length - 1) {
        statusMsg.textContent = `🎉 Задание дня выполнено (12 из 12 ${activeStage.unitName})! Новое дерево откроется завтра!`;
      } else {
        statusMsg.textContent = '✨ Древо Сфирот полностью расцвело! Все 6 дней пройдены!';
      }
    } else {
      statusMsg.textContent = `${activeStage.title}. Добавьте ещё ${DAILY_GOAL - todayWords} ${activeStage.unitName} сегодня!`;
    }
  }

  function addWord() {
    const text = input.value.trim();
    if (text === '') return;

    // Проверка дубликатов
    const isDuplicate = savedWordsArray.some(w => w.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      alert(activeStage.dupError);
      input.value = '';
      return;
    }

    todayWords++;
    savedWordsArray.push(text);

    localStorage.setItem('tree_words_count', todayWords);
    localStorage.setItem('tree_words_list', JSON.stringify(savedWordsArray));

    renderWords();
    input.value = '';
    updateUI();
  }

  btn.onclick = addWord;

  renderWords();
  updateUI();
});
