document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('word-input');
  const btn = document.getElementById('add-btn');
  const wordCountEl = document.getElementById('word-count');
  const statusMsg = document.getElementById('status-message');
  const wordsCloud = document.getElementById('words-cloud');
  const treeImg = document.getElementById('tree-img');

  const stages = [
    { image: '1789320691951.jpg', text: 'День 1: Посажено священное семя (Кетер)' },
    { image: '1789320940879.jpg', text: 'День 2: Появились ветви! (Бина и Хохма)' },
    { image: '1789321156651.jpg', text: 'День 3: Ствол наполнился светом! (Гвура, Хесед, Тиферет)' },
    { image: '1789321283408.jpg', text: 'День 4: Раскрываются сферы! (Ход и Нецах)' },
    { image: '1789321336043.jpg', text: 'День 5: Сияние оси! (Йесод)' },
    { image: '1789321524805.jpg', text: '✨ День 6: Древо Сефирот полностью расцвело!' }
  ];

  const DAILY_GOAL = 12;

  // Безопасное получение даты
  const todayDate = new Date().toDateString();

  // Загрузка данных
  let savedDate = localStorage.getItem('tree_date');
  let todayWords = parseInt(localStorage.getItem('tree_words_count') || '0', 10);
  let currentStage = parseInt(localStorage.getItem('tree_stage') || '0', 10);
  let goalReached = localStorage.getItem('tree_goal_reached') === 'true';
  let savedWordsArray = JSON.parse(localStorage.getItem('tree_words_list') || '[]');

  // Проверка смены дня
  if (savedDate && savedDate !== todayDate) {
    if (goalReached && currentStage < stages.length - 1) {
      currentStage++;
      localStorage.setItem('tree_stage', currentStage);
    }
    todayWords = 0;
    goalReached = false;
    savedWordsArray = [];
    localStorage.setItem('tree_words_count', '0');
    localStorage.setItem('tree_goal_reached', 'false');
    localStorage.setItem('tree_words_list', '[]');
  }
  
  localStorage.setItem('tree_date', todayDate);

  // Отрисовка старых слов
  wordsCloud.innerHTML = '';
  savedWordsArray.forEach(wordText => {
    const tag = document.createElement('span');
    tag.className = 'word-tag';
    tag.textContent = wordText;
    wordsCloud.appendChild(tag);
  });

  function updateUI() {
    wordCountEl.textContent = `${todayWords} / ${DAILY_GOAL}`;
    treeImg.src = stages[currentStage].image;

    if (goalReached) {
      if (currentStage < stages.length - 1) {
        statusMsg.textContent = '🎉 Норма на сегодня (12 слов) выполнена! Новая стадия дерева откроется завтра!';
      } else {
        statusMsg.textContent = '✨ Древо полностью выросло! Поздравляем!';
      }
    } else {
      statusMsg.textContent = `${stages[currentStage].text}. Напишите ещё ${DAILY_GOAL - todayWords} слов(а) сегодня!`;
    }
  }

  function addWord() {
    const text = input.value.trim();
    if (text === '' || goalReached) return;

    todayWords++;
    savedWordsArray.push(text);

    localStorage.setItem('tree_words_count', todayWords);
    localStorage.setItem('tree_words_list', JSON.stringify(savedWordsArray));

    const tag = document.createElement('span');
    tag.className = 'word-tag';
    tag.textContent = text;
    wordsCloud.appendChild(tag);

    input.value = '';

    if (todayWords >= DAILY_GOAL) {
      goalReached = true;
      localStorage.setItem('tree_goal_reached', 'true');
    }

    updateUI();
  }

  btn.onclick = addWord;
  input.onkeypress = (e) => {
    if (e.key === 'Enter') addWord();
  };

  updateUI();
});
