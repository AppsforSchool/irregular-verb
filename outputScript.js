//githubプッシュ時はfalseに
const isDebug = true;
const debugQuestionParam = "base_form";
const debugAnswerParam = "meaning";




let questionsData = [];
let questions = [];

function getAllParmFromUrl(parm) {
  const params = new URLSearchParams(window.location.search);
  return params.getAll(parm);
}
function getParmFromUrl(parm) {
  const params = new URLSearchParams(window.location.search);
  return params.get(parm);
}

async function loadQuestionsData() {
  if (isDebug) {
    questionsData = [
  {
    "base_form": "beat",
    "meaning": "どきどきする",
    "present_form": "beat(s)",
    "past_form": "beat",
    "past_participle": "beat, beaten",
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
    "meaning": "置く, つける",
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
];
    questions = shuffle(questionsData);
    displayQuestions();
    return;
  }
  
  const details = getAllParmFromUrl('detail');
  const fetchPromises = [];

  // URLパラメータに含まれる学年に応じてフェッチのPromiseを作成
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

  // フェッチ対象がない場合の処理
  if (fetchPromises.length === 0) {
    console.warn('無効なURLです。');
    /*
    if (document.referrer) {
        history.back(); // 前のページがある場合は戻る
    } else {
        window.location.href = './index.html'; // 直接アクセスされた場合はトップへ
    }
    */
    return;
  }

  try {
    // 全てのフェッチが完了するまで待機
    const results = await Promise.all(fetchPromises);
        
    // 取得したデータを一つの配列に結合
    cardsData = results.flat(); // .flat() でネストされた配列を平坦化
    // データの読み込みが完了したら後続処理を呼び出す
    //alert('データロード完了');
  } catch (error) {
    console.error('JSONファイルの取得または処理に失敗しました:', error);
    alert('JSONファイルの取得または処理に失敗しました');
  }
}


/*questionsData = [
  {
    "base_form": "beat",
    "meaning": "どきどきする",
    "present_form": "beat(s)",
    "past_form": "beat",
    "past_participle": "beat, beaten",
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
    "meaning": "置く, つける",
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
]; // AAA*/


let loadingOverlay;
let headerQuestion, headerAnswer;
let returnButton;
let showAnswerButton;
let questionContainer, questionArea, answerArea;
document.addEventListener('DOMContentLoaded', () => {
  loadingOverlay = document.getElementById('loading-overlay');
  
  headerQuestion = document.getElementById('header-question');
  headerAnswer = document.getElementById('header-answer');
  
  questionContainer = document.getElementById('question-container');
  questionArea = document.getElementById('question-area');
  answerArea = document.getElementById('answer-area');
  
  let contentQuestion = getParmFromUrl('question');
  let contentAnswer = getParmFromUrl('answer');
  if (isDebug) {
    contentQuestion = debugQuestionParam;
    contentAnswer = debugAnswerParam;
  }
  if (contentQuestion === contentAnswer) {
    console.warn('無効なURLです。出題と解答は異なっている必要があります。');
    window.location.href = './index.html';
  }
  const contents = ["base_form", "meaning", "present_form", "past_form", "past_participle", "present_participle"];
  const contentsInJp = ["原形", "意味", "現在形", "過去形", "過去分詞", "...ing形"];
  if (!contents.includes(contentQuestion) || !contents.includes(contentAnswer)) {
    console.warn('無効なURLです。出題または回答に無効な文字列が含まれています。');
    window.location.href = './index.html';
  }
  headerQuestion.textContent = contentsInJp[contents.indexOf(contentQuestion)];
  headerAnswer.textContent = contentsInJp[contents.indexOf(contentAnswer)];
  
  returnButton = document.getElementById('return-button');
  returnButton.addEventListener('click', () => {
    if (window.confirm('本当にやめますか？')) {
      window.location.href = './index.html';
    }
  });
  
  showAnswerButton = document.getElementById('show-answer-button');
  showAnswerButton.addEventListener('click', () => {
    answerArea.classList.toggle('hidden');
    if (answerArea.classList.contains('hidden')) {
      showAnswerButton.textContent = "答えを表示";
    } else {
      showAnswerButton.textContent = "答えを非表示";
    }
    
  });
  
  
  loadQuestionsData();
  
});

function displayQuestions() {
  let questionCount = getParmFromUrl('count');
  if (isDebug) {
    questionCount = 12;
  }
  if (questionCount === 'all') {
    questionCount = questions.length;
  }
  if (questionCount > questions.length) {
    questionCount = questions.length;
  }
  let contentQuestion = getParmFromUrl('question');
  let contentAnswer = getParmFromUrl('answer');
  if (isDebug) {
    contentQuestion = debugQuestionParam;
    contentAnswer = debugAnswerParam;
  }
  for (let i = 0; i < questionCount; i++) {
    questionArea.innerHTML += `(${i + 1}) `;
    questionArea.innerHTML += questions[i][contentQuestion];
    questionArea.innerHTML += '<br>';
    answerArea.innerHTML += questions[i][contentAnswer];
    answerArea.innerHTML += '<br>';
  }
  
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