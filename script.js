document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('word-input');
  const btn = document.getElementById('add-btn');
  const wordCountEl = document.getElementById('word-count');
  const statusMsg = document.getElementById('status-message');
  const wordsCloud = document.getElementById('words-cloud');
  const treeImg = document.getElementById('tree-img');

  // СПИСОК СТАДИЙ (по одной стадии на каждый день после 12 слов)
  const stages = [
    { image: '1789320691951.jpg', text: 'День 1: Посажено священное семя (Кетер)' },
    { image: '1789320940879.jpg', text: 'День 2: Появились ветви! (Бина и Хохма)' },
    { image: '1789321156651.jpg', text: 'День 3: Ствол наполнился светом! (Гвура, Хесед, Тиферет)' },
    { image: '1789321283408.jpg', text: 'День 4: Раскрываются сферы! (Ход и Нецах)' },
    { image: '1789321336043.jpg', text: 'День 5: Сияние оси! (Йесод)' },
    { image: '1789321524805.jpg', text: '✨ День 6: Древо Сефирот полностью расцвело!' }
  ];

  const DAILY_GOAL = 12; // Цель — 12 слов в день
  const todayDate = new Date().toISOString().slice(0, 10); // Текущая дата

  // Считываем сохраненный прогресс из памяти устройства
  let savedDate = localStorage.getItem('last_word_date');
  let todayWords = parseInt(localStorage.getItem('today_words_count') || '0', 10);
  let currentStage = parseInt(localStorage.getItem('tree_stage') || '0', 10);

  // Проверка смены дня: если наступил новый день и вчера цель была выполнена
  if (savedDate && savedDate !== todayDate) {
    let goalReached = localStorage.getItem('goal_reached') === 'true';
    if (goalReached && currentStage < stages.length - 1) {
      currentStage++;
      localStorage.setItem('tree_stage', currentStage);
    }
    // Сбрасываем дневной счетчик для нового дня
    todayWords = 0;
    localStorage.setItem('today_words_count', '0');
    localStorage.setItem('last_word_date', todayDate);
    localStorage.setItem('goal_reached', 'false');
  }

  // Обновляем картинку и статус
  updateUI();

  function addWord() {
    const text = input.value.trim();
    if (text === '') return;

    todayWords++;
    localStorage.setItem('today_words_count', todayWords);
    localStorage.setItem('last_word_date', todayDate);

    // Добавляем слово на экран
    const tag = document.createElement('span');
    tag.className = 'word-tag';
    tag.textContent = text;
    wordsCloud.appendChild(tag);

    input.value = '';

    // Проверяем выполнение нормы в 12 слов
    if (todayWords >= DAILY_GOAL) {
      localStorage.setItem('goal_reached', 'true');
    }

    updateUI();
  }

  function updateUI() {
    wordCountEl.textContent = `${todayWords} / ${DAILY_GOAL}`;

    let isGoalReached = localStorage.getItem('goal_reached') === 'true';
    treeImg.src = stages[currentStage].image;

    if (isGoalReached) {
      if (currentStage < stages.length - 1) {
        statusMsg.textContent = '🎉 Норма на сегодня (12 слов) выполнена! Новая стадия дерева откроется завтра!';
      } else {
        statusMsg.textContent = '✨ Древо полностью выросло! Поздравляем!';
      }
    } else {
      statusMsg.textContent = `${stages[currentStage].text}. Напишите ещё ${DAILY_GOAL - todayWords} слов(а) сегодня!`;
    }
  }

  if (btn) btn.addEventListener('click', addWord);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addWord();
    });
  }
});
