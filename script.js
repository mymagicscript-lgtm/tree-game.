document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('word-input');
  const btn = document.getElementById('add-btn');
  const wordCountEl = document.getElementById('word-count');
  const statusMsg = document.getElementById('status-message');
  const wordsCloud = document.getElementById('words-cloud');
  const treeImg = document.getElementById('tree-img');

  const stages = [
    { date: '2026-09-14', image: '1789320691951.jpg', text: 'День 1 (14.09): Посажено священное семя (Кетер)' },
    { date: '2026-09-15', image: '1789320940879.jpg', text: 'День 2 (15.09): Появились ветви! (Бина и Хохма)' },
    { date: '2026-09-16', image: '1789321156651.jpg', text: 'День 3 (16.09): Ствол наполнился светом! (Гвура, Хесед, Тиферет)' },
    { date: '2026-09-17', image: '1789321283408.jpg', text: 'День 4 (17.09): Раскрываются сферы! (Ход и Нецах)' },
    { date: '2026-09-18', image: '1789321336043.jpg', text: 'День 5 (18.09): Сияние оси! (Йесод)' },
    { date: '2026-09-19', image: '1789321524805.jpg', text: '✨ День 6 (19.09): Древо Сефирот полностью расцвело!' }
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

  let savedDate = localStorage.getItem('tree_date');
  let todayWords = parseInt(localStorage.getItem('tree_words_count') || '0', 10);
  let savedWordsArray = JSON.parse(localStorage.getItem('tree_words_list') || '[]');

  if (savedDate && savedDate !== todayStr) {
    todayWords = 0;
    savedWordsArray = [];
    localStorage.setItem('tree_words_count', '0');
    localStorage.setItem('tree_words_list', '[]');
  }
  
  localStorage.setItem('tree_date', todayStr);

  function renderWords() {
    wordsCloud.innerHTML = '';
    savedWordsArray.forEach(wordText => {
      const tag = document.createElement('span');
      tag.className = 'word-tag';
      tag.textContent = wordText;
      wordsCloud.appendChild(tag);
    });
  }

  function updateUI() {
    wordCountEl.textContent = `${todayWords} / ${DAILY_GOAL}`;
    treeImg.src = stages[currentStageIndex].image;

    if (todayWords >= DAILY_GOAL) {
      if (currentStageIndex < stages.length - 1) {
        statusMsg.textContent = '🎉 Отлично! 12 разных слов собрано. Новое дерево вы увидите только завтра!';
      } else {
        statusMsg.textContent = '✨ Древо полностью расцвело! Вы прошли весь путь!';
      }
    } else {
      statusMsg.textContent = `${stages[currentStageIndex].text}. Напишите ещё ${DAILY_GOAL - todayWords} разных слов(а) сегодня!`;
    }
  }

  function addWord() {
    const text = input.value.trim();
    if (text === '') return;

    const isDuplicate = savedWordsArray.some(w => w.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      alert('Это слово уже вводили! Нужно написать новое, неповторяющееся слово.');
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
  input.onkeypress = (e) => {
    if (e.key === 'Enter') addWord();
  };

  renderWords();
  updateUI();
});
