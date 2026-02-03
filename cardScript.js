const isDebug = false;

const debugQuestionParm = "base_form";
const debugAnswerParm = "present_form";
const debugDetailParms = ["AAA", "AAB"];
const debugCountParm = "10";

const debugQuestionsData = [
  {
    "base_form": "beat",
    "meaning": "どきどきする",
    "present_form": "beat(s)",
    "past_form": "beat",
    "past_participle": "beaten",
    "present_participle": "beating"
  },
  {
    "base_form": "cut",
    "meaning": "切る",
    "present_form": "cut(s)",
    "past_form": "cut",
    "past_participle": "cut",
    "present_participle": "cutting"
  },
  {
    "base_form": "hurt",
    "meaning": "傷つける",
    "present_form": "hurt(s)",
    "past_form": "hurt",
    "past_participle": "hurt",
    "present_participle": "hurting"
  },
  {
    "base_form": "put",
    "meaning": "置く/つける",
    "present_form": "put(s)",
    "past_form": "put",
    "past_participle": "put",
    "present_participle": "putting"
  },
  {
    "base_form": "read",
    "meaning": "読む",
    "present_form": "read(s)",
    "past_form": "read",
    "past_participle": "read",
    "present_participle": "reading"
  },
  {
    "base_form": "set",
    "meaning": "準備する",
    "present_form": "set(s)",
    "past_form": "set",
    "past_participle": "set",
    "present_participle": "setting"
  },
  {
    "base_form": "spread",
    "meaning": "広がる",
    "present_form": "spread(s)",
    "past_form": "spread",
    "past_participle": "spread",
    "present_participle": "spreading"
  }
]; // AAA

// ----- //
let questionsData = [];
let nowQuestionIndex = 0;


function getAllParmFromUrl(parm) {
  const params = new URLSearchParams(window.location.search);
  return params.getAll(parm);
}
function getParmFromUrl(parm) {
  const params = new URLSearchParams(window.location.search);
  return params.get(parm);
}


let questionParm = getParmFromUrl('question');
let answerParm = getParmFromUrl('answer');
if (isDebug) {
  questionParm = debugQuestionParm;
  answerParm = debugAnswerParm;
}
const contents = ["base_form", "meaning", "present_form", "past_form", "past_participle", "present_participle"];
const contentsInJp = ["原形", "意味", "現在形", "過去形", "過去分詞", "ing形"];
if (!contents.includes(questionParm) || !contents.includes(answerParm)) {
  console.warn('無効なURLです。出題または回答に無効な文字列が含まれています。');
  alert('無効なURLです。出題または回答に無効な文字列が含まれています。');
  window.location.href = './index.html';
}
if (questionParm === answerParm) {
  console.warn('無効なURLです。出題内容と解答内容は異なっている必要があります。');
  alert('無効なURLです。出題内容と解答内容は異なっている必要があります。');
  window.location.href = './index.html';
}






async function loadQuestionsData() {
  let details = getAllParmFromUrl('detail');
  if (isDebug) {
    details = debugDetailParms;
  }
  if (details.length === 0) {
    console.warn('無効なURLです。出題範囲が指定されていません。');
    alert('無効なURLです。出題範囲が指定されていません。');
    window.location.href = './index.html';
  }
  
  if (isDebug) {
    questionsData = debugQuestionsData;
  } else {
    const fetchPromises = [];
    
    if (details.includes('AAA')) {
      fetchPromises.push(fetch('./AAA.json').then(res => res.json()));
    }
    if (details.includes('ABA')) {
      fetchPromises.push(fetch('./ABA.json').then(res => res.json()));
    }
    if (details.includes('ABB')) {
      fetchPromises.push(fetch('./ABB.json').then(res => res.json()));
    }
    if (details.includes('ABC')) {
      fetchPromises.push(fetch('./ABC.json').then(res => res.json()));
    }
    
    try {
      const results = await Promise.all(fetchPromises);
      questionsData = results.flat();
    } catch (error) {
      console.error('JSONファイルの取得または処理に失敗しました:', error);
      alert('JSONファイルの取得または処理に失敗しました');
      window.location.href = './index.html';
    }
  }
  
  questionsData = shuffle(questionsData);
  
  let countParm = getParmFromUrl('count');
  if (isDebug) {
    countParm = debugCountParm;
  }
  if (countParm !== 'all') {
    if (parseInt(countParm) < 1 || Number.isNaN(parseInt(countParm))) {
      console.warn('無効なURLです。出題数に文字または無効な数字が設定されています。');
  alert('無効なURLです。出題数に文字または無効な数字が設定されています。');
  window.location.href = './index.html';
    }
    if (questionsData.length > parseInt(countParm)) {
      questionsData.length = parseInt(countParm);
    }
  }
  
  questionCountArea.textContent = questionsData.length;
  updateQuestion(0);
  
  loadingOverlay.classList.add('hidden');
  questionContainer.classList.remove('hidden');
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // まだシャッフルしていない要素がある限りループを続ける
  while (currentIndex > 0) {

    // 残りの要素からランダムに1つ選ぶ
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // 現在の要素と選んだ要素を交換する
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function updateQuestion(index) {
  cardFrontContent.textContent = questionsData[index][questionParm];
  cardFrontSubContent.textContent = `${contentsInJp[contents.indexOf(questionParm)]}を${contentsInJp[contents.indexOf(answerParm)]}に直す`;
  
  setTimeout(() => {
    cardBackQuestion.textContent = `${questionsData[index][questionParm]}を${contentsInJp[contents.indexOf(answerParm)]}に直すと`;
    cardBackContent.textContent = questionsData[index][answerParm];
  }, 400);
  
  nowCountArea.textContent = index + 1;
}

function flipCard() {
  card.classList.toggle('flipped');
}



let returnButton;
document.addEventListener('DOMContentLoaded', () => {
  returnButton = document.getElementById('return-button');
  returnButton.addEventListener('click', () => {
    if (window.confirm('本当にやめますか？')) {
      window.location.href = './index.html';
    }
  });
});





let headerQuestion, headerAnswer;
document.addEventListener('DOMContentLoaded', () => {
  headerQuestion = document.getElementById('header-question');
  headerAnswer = document.getElementById('header-answer');
  
  headerQuestion.textContent = contentsInJp[contents.indexOf(questionParm)];
  headerAnswer.textContent = contentsInJp[contents.indexOf(answerParm)];
});


let loadingOverlay, questionContainer;
let nowCountArea, questionCountArea;
let card, cardFrontContent, cardFrontSubContent, cardBackContent, cardBarkQuestion;
let showAnswerBtn, toIndexBtn, nextQuestionBtn;
document.addEventListener('DOMContentLoaded', () => {
  loadingOverlay = document.getElementById('loading-overlay');
  questionContainer = document.getElementById('question-container');
  
  nowCountArea = document.getElementById('now-count');
  questionCountArea = document.getElementById('question-count');
  
  card = document.getElementById('card');
  cardFrontContent = document.getElementById('front-content');
  cardFrontSubContent = document.getElementById('front-sub-content');
  cardBackContent = document.getElementById('back-content');
  cardBackQuestion = document.getElementById('back-question-content');
  
  showAnswerBtn = document.getElementById('show-answer-btn');
  toIndexBtn = document.getElementById('to-index-btn');
  nextQuestionBtn = document.getElementById('next-question-btn');
  
  showAnswerBtn.addEventListener('click', () => {
    showAnswerBtn.disabled = true;
    nextQuestionBtn.disabled = true;
    setTimeout(() => {
      showAnswerBtn.disabled = false;
      nextQuestionBtn.disabled = false;
    }, 600);
    flipCard();
  });
  nextQuestionBtn.addEventListener('click', () => {
    showAnswerBtn.disabled = true;
    nextQuestionBtn.disabled = true;
    setTimeout(() => {
      showAnswerBtn.disabled = false;
      nextQuestionBtn.disabled = false;
    }, 600);
    
    if (nowQuestionIndex + 1 === questionsData.length) {
      cardFrontContent.textContent = '終了！';
      cardFrontSubContent.textContent = '';
      showAnswerBtn.classList.add('hidden');
      toIndexBtn.classList.remove('hidden');
    } else {
      nowQuestionIndex += 1;
      updateQuestion(nowQuestionIndex);
    }
    flipCard();
  });
  toIndexBtn.addEventListener('click', () => {
    window.location.href = './index.html';
  });
  

  loadQuestionsData();
});
