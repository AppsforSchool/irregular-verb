let cardsData = [];

function getParmFromUrl(parm) {
  const params = new URLSearchParams(window.location.search);
  return params.getAll(parm);
}

async function loadCardsData() {
  const contentQuestion = getParmFromUrl('question');
  const contentAnswer = getParmFromUrl('answer');
  if (contentQuestion === contentAnswer) {
    console.warn('無効なURLです。');
   
    if (document.referrer) {
        history.back(); // 前のページがある場合は戻る
    } else {
        window.location.href = './index.html'; // 直接アクセスされた場合はトップへ
    }
    
  }
  const contents = ["base_form", "meaning", "present_form", "past_form", "past_participle", "present_participle"];
  if (!contents.includes(contentQuestion) || !contents.includes(contentAnswer)) {
    console.warn('無効なURLです。');
    
    if (document.referrer) {
        history.back(); // 前のページがある場合は戻る
    } else {
        window.location.href = './index.html'; // 直接アクセスされた場合はトップへ
    }
    
  }
  
  const details = getParmFromUrl('detail');
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
    
    if (document.referrer) {
        history.back(); // 前のページがある場合は戻る
    } else {
        window.location.href = './index.html'; // 直接アクセスされた場合はトップへ
    }
    
    // データがない状態での後続処理を開始
    alert('無効なURLです。');
    //startCountdown(); 
    return;
  }

  try {
    // 全てのフェッチが完了するまで待機
    const results = await Promise.all(fetchPromises);
        
    // 取得したデータを一つの配列に結合
    cardsData = results.flat(); // .flat() でネストされた配列を平坦化
    // データの読み込みが完了したら後続処理を呼び出す
    alert('データロード完了');
    startCountdown();
  } catch (error) {
    console.warn('JSONファイルの取得または処理に失敗しました:', error);
    alert('JSONファイルの取得または処理に失敗しました');
    alert(error);
    if (document.referrer) {
        history.back(); // 前のページがある場合は戻る
    } else {
        window.location.href = './index.html'; // 直接アクセスされた場合はトップへ
    }
  }
}



/*
cardsData = [
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
]; // AAA
*/

let questions = [];
const detailQuestion = getParmFromUrl('question');
const detailAnswer = getParmFromUrl('answer');

let countDownOverlay, countdownTimer, questionContainer;
let headerQuestion, headerAnswer;
let nowCountArea;
let card, cardFrontContent, cardBackContent, cardBarkQuestion;
let showAnswerBtn, nextQuestionBtn;
document.addEventListener('DOMContentLoaded', () => {
  // count down - DOM
  countdownOverlay = document.getElementById('countdown-overlay');
  countdownTimer = document.getElementById('countdown-timer');
  questionContainer = document.getElementById('question-container');
  
  //
  headerQuestion = document.getElementById('header-question');
  headerAnswer = document.getElementById('header-answer');
  
  headerQuestion.textContent = detailQuestion;
  headerAnswer.textContent = detailAnswer;
  
  // card container - DOM
  nowCountArea = document.getElementById('now-count');
  // card - DOM
  card = document.getElementById('card');
  cardFrontContent = document.getElementById('front-content');
  cardBackContent = document.getElementById('back-content');
  cardBackQuestion = document.getElementById('back-question-content');
  
  
  loadCardsData();
  // count down - Event
  /*let count = 3;
  const countdownInterval = setInterval(() => {
    if (count === 0) {
      countdownTimer.textContent = 'Go!';
      count -= 1;
    } else if (count === -1) {
      clearInterval(countdownInterval); // カウントダウンを停止
      questions = shuffle(cardsData);
      const problemCount = document.getElementById('question-count');
      problemCount.textContent = questions.length;
      //console.log(questions);
      nextQuestion(0);
      
      countdownOverlay.classList.add('hidden'); // オーバーレイを非表示
      questionContainer.classList.remove('hidden'); // 問題文を表示
    } else {
      if (count === 3) {
        countdownTimer.classList.remove('loading');
      }
      countdownTimer.textContent = count;
      count -= 1;
    }
  }, 100); // 1秒ごとに実行 => 1000*/
});


function startCountDown() {
  let count = 3;
  const countdownInterval = setInterval(() => {
    if (count === 0) {
      countdownTimer.textContent = 'Go!';
      count -= 1;
    } else if (count === -1) {
      clearInterval(countdownInterval); // カウントダウンを停止
      questions = shuffle(cardsData);
      const problemCount = document.getElementById('question-count');
      problemCount.textContent = questions.length;
      //console.log(questions);
      nextQuestion(0);
      
      countdownOverlay.classList.add('hidden'); // オーバーレイを非表示
      questionContainer.classList.remove('hidden'); // 問題文を表示
    } else {
      if (count === 3) {
        countdownTimer.classList.remove('loading');
      }
      countdownTimer.textContent = count;
      count -= 1;
    }
  }, 100); // 1秒ごとに実行 => 1000
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

function flipCard() {
  const card = document.getElementById('card');
  card.classList.toggle('flipped');
}
document.addEventListener('DOMContentLoaded', () => {
  showAnswerBtn = document.getElementById('show-answer-btn');
  showAnswerBtn.addEventListener('click', () => {
    flipCard();
  });
  
  nextQuestionBtn = document.getElementById('next-question-btn');
  nextQuestionBtn.addEventListener('click', () => {
    nowQuestionIndex += 1;
  
    if (nowQuestionIndex === questions.length) {
      console.log('end');
      endCard();
    } else {
      nextQuestion(nowQuestionIndex);
    }
  });
});

let nowQuestionIndex = 0;

function nextQuestion(index) {
  const nowCountArea = document.getElementById('now-count');
  const card = document.getElementById('card');
  
  nowCountArea.textContent = index + 1;
  card.classList.remove('flipped');
  console.log('flipped');
  let question;
  if (detailQuestion === 'base_form') {
    question = questions[index].base_form;
  } else if (detailQuestion === 'meaning'){
    question = questions[index].meaning;
  } else if (detailQuestion === 'present_form'){
    question = questions[index].present_form;
  } else if (detailQuestion === 'past_form'){
    question = questions[index].past_form;
  } else if (detailQuestion === 'past_participle'){
    question = questions[index].past_participle;
  } else if (detailQuestion === 'present_participle'){
    question = questions[index].present_participle;
  }
  cardFrontContent.textContent = question;
  
  if (detailAnswer === 'base_form') {
    cardBackContent.textContent = questions[index].base_form;
  } else if (detailAnswer === 'meaning'){
    cardBackContent.textContent = questions[index].meaning;
  } else if (detailAnswer === 'present_form'){
    cardBackContent.textContent = questions[index].present_form;
  } else if (detailAnswer === 'past_form'){
    cardBackContent.textContent = questions[index].past_form;
  } else if (detailAnswer === 'past_participle'){
    cardBackContent.textContent = questions[index].past_participle;
  } else if (detailAnswer === 'present_participle'){
    cardBackContent.textContent = questions[index].present_participle;
  }
  
  setTimeout(() => {
    cardBackQuestion.textContent = question;
  }, 400);
}

function endCard() {
  document.getElementById('now-and-question').textContent = "終了！";
  document.getElementById('front-content').textContent = "終了！";
  document.getElementById('show-answer-btn').classList.add("hidden");
  document.getElementById('to-index-btn').classList.remove("hidden");
  const card = document.getElementById('card');
  card.classList.remove('flipped');
}


/*document.getElementById('show-result-btn').addEventListener('click', () => {
  showResult();
});*/
function showResult() {
  document.getElementById('back-content').classList.add("hidden");
  document.getElementById('result-correct').classList.remove("hidden");
  document.getElementById('next-question-btn').classList.add("hidden");
  document.getElementById('to-index-btn').classList.remove("hidden");
  document.getElementById('result-question-count').textContent = questions.length;
  flipCard();
}


document.getElementById('to-index-btn').addEventListener('click', () => {
  window.location.href = './index.html';
});
