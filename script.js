let count = 0;

const input = document.getElementById('word-input');
const btn = document.getElementById('add-btn');
const wordCountEl = document.getElementById('word-count');
const statusMsg = document.getElementById('status-message');
const wordsCloud = document.getElementById('words-cloud');
const treeImg = document.getElementById('tree-img');

// Конфигурация 6 стадий роста с вашими именами картинок
const stages = [
  { words: 0, image: '1789320691951.jpg', text: 'Посажено священное семя... (Зародился Кетер)' },
  { words: 2, image: '1789320940879.jpg', text: 'Появились первые ветви! (Проявились Бина и Хохма)' },
  { words: 5, image: '1789321156651.jpg', text: 'Ствол наполнился светом! (Проявились Гвура, Хесед и Тиферет)' },
  { words: 8, image: '1789321283408.jpg', text: 'Раскрываются гармоничные сферы! (Проявились Ход и Нецах)' },
  { words: 12, image: '1789321336043.jpg', text: 'Ось дерева излучает сияние! (Проявился Йесод)' },
  { words: 15, image: '1789321524805.jpg', text: '✨ Древо Сефирот полностью расцвело! (Все сферы в единстве)' }
];

let currentStageIndex = 0;

function addWord() {
  const text = input.value.trim();
  if (text === '') return;

  count++;
  wordCountEl.textContent = count;

  // Добавляем тег со словом
  const tag = document.createElement('span');
  tag.className = 'word-tag';
  tag.textContent = text;
  wordsCloud.appendChild(tag);

  input.value = '';

  // Проверяем стадию роста
  checkStageUpdate(count);
}

function checkStageUpdate(words) {
  let newStageIndex = currentStageIndex;

  for (let i = stages.length - 1; i >= 0; i--) {
    if (words >= stages[i].words) {
      newStageIndex = i;
      break;
    }
  }

  if (newStageIndex !== currentStageIndex) {
    currentStageIndex = newStageIndex;
    
    treeImg.style.opacity = '0';
    
    setTimeout(() => {
      treeImg.src = stages[currentStageIndex].image;
      statusMsg.textContent = stages[currentStageIndex].text;
      treeImg.style.opacity = '1';
    }, 400);
  }
}

btn.addEventListener('click', addWord);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addWord();
});
  // Проверяем, пора ли переключать картинку
  checkStageUpdate(count);
}

function checkStageUpdate(words) {
  let newStageIndex = currentStageIndex;

  for (let i = stages.length - 1; i >= 0; i--) {
    if (words >= stages[i].words) {
      newStageIndex = i;
      break;
    }
  }

  // Если стадия изменилась — меняем картинку с эффектом плавной смены
  if (newStageIndex !== currentStageIndex) {
    currentStageIndex = newStageIndex;
    
    treeImg.style.opacity = '0'; // Плавно скрываем текущую картинку
    
    setTimeout(() => {
      treeImg.src = stages[currentStageIndex].image;
      statusMsg.textContent = stages[currentStageIndex].text;
      treeImg.style.opacity = '1'; // Плавно проявляем новую картинку
    }, 400);
  }
}

// Реакция на нажатие кнопки и клавиши Enter
btn.addEventListener('click', addWord);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addWord();
});
