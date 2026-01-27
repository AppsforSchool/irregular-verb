// share modal
let shareModalBtn, shareModal, shareModalClose;
document.addEventListener('DOMContentLoaded', () => {
  // DOM
  shareModalBtn = document.getElementById('share-modal-btn');
  shareModal = document.getElementById('share-modal');
  shareModalClose = document.getElementById('share-modal-close');
  
  // event listener
  shareModalBtn.addEventListener('click', () => {
    shareModal.classList.remove('hidden');
  });
  shareModalClose.addEventListener('click', () => {
    shareModal.classList.add('hidden');
  });
});


// mode buttons
let modeButtons, modeMessage;
document.addEventListener('DOMContentLoaded', () => {
  modeButtons = document.querySelectorAll('.mode-button');
  modeMessage = document.getElementById('mode-message');
  
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 選択状態をリセット
      modeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      if (button.dataset.mode === "normal") {
        modeMessage.textContent = "全ての単語から出題";
      } else {
        modeMessage.textContent = "｢苦手な単語｣から出題";
      }
    });
  });
});

// type buttons
let typeSelectionState = "card";
let typeButtons;
document.addEventListener('DOMContentLoaded', () => {
  typeButtons = document.querySelectorAll('.type-button');
  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 選択状態をリセット
      typeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      typeSelectionState = button.dataset.type;
    });
  });
});

// countent selects
let contentSelectionState = ["base_form", "past_participle"];
let questionContent, answerContent, contentMessage;
function checkContentSelectStatus(isMatch) {
  if (isMatch) {
    contentMessage.textContent = "この組み合わせは不可能です";
  } else {
    contentMessage.textContent = "";
  }
}
document.addEventListener('DOMContentLoaded', () => {
  questionContent = document.getElementById('question-content');
  answerContent = document.getElementById('answer-content');
  contentMessage = document.getElementById('content-message');
  
  questionContent.addEventListener('change', () => {
    contentSelectionState[0] = questionContent.value;
    checkContentSelectStatus(questionContent.value === answerContent.value);
    checkStartButtonState();
  });
  answerContent.addEventListener('change', () => {
    contentSelectionState[1] = answerContent.value;
    checkContentSelectStatus(questionContent.value === answerContent.value);
    checkStartButtonState();
  });
});

// detail buttons
let detailSelectionState = new Set(["AAA", "ABA", "ABB", "ABC"]);
let allQuestionCount = 61;
let detailButtons, allQuestion;
document.addEventListener('DOMContentLoaded', () => {
  detailButtons = document.querySelectorAll('.detail-button');
  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 選択状態をリセット
      button.classList.toggle("active");
      if (button.classList.contains("active")) {
        detailSelectionState.add(button.dataset.detail);
        allQuestionCount += parseInt(button.dataset.count);
      } else {
        detailSelectionState.delete(button.dataset.detail);
        allQuestionCount -= parseInt(button.dataset.count);
      }
      allQuestion.textContent = allQuestionCount;
      checkStartButtonState();
    });
  });
  
  allQuestion = document.getElementById('all-question');
  
  
});

// count buttons
let countSelectionState = "5";
let countButtons;
document.addEventListener('DOMContentLoaded', () => {
  countButtons = document.querySelectorAll('.count-button');
  countButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 選択状態をリセット
      countButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      countSelectionState = button.dataset.count;
    });
  });
});

// start button
let startButton;
function checkStartButtonState() {
  const contentOK = contentSelectionState[0] !== contentSelectionState[1];
  const detailOK = detailSelectionState.size > 0;
  if (contentOK && detailOK) {
    startButton.disabled = false;
  } else {
    startButton.disabled = true;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  startButton = document.getElementById('start-button');
  startButton.addEventListener('click', () => {
    startButton.disabled = true;
    startButton.textContent = "処理中...";
    const params = new URLSearchParams();
    params.append("question", contentSelectionState[0]);
    params.append("answer", contentSelectionState[1]);
    detailSelectionState.forEach((g) => {
      params.append("detail", g);
    });
    params.append("count", countSelectionState);
    
    if (typeSelectionState === "card") {
      //console.log(`card.html?${params.toString()}`);
      window.location.href = `card.html?${params.toString()}`;
    } else {
      //console.log(`output.html?${params.toString()}`);
      window.location.href = `output.html?${params.toString()}`;
    }
  });
});

/*
let plusButton, minusButton, countInput;
document.addEventListener('DOMContentLoaded', () => {
  plusButton = document.getElementById('count-plus');
  minusButton = document.getElementById('count-minus');
  countInput = document.getElementById('count-input');
  
  plusButton.addEventListener('click', () => {
    const regex = /^[0-9]+$/;
    if (regex.test(countInput.value)) {
      countInput.value = parseInt(countInput.value) + 1;
    }
  });
  
  minusButton.addEventListener('click', () => {
    const regex = /^[0-9]+$/;
    if (regex.test(countInput.value) && countInput.value > 1) {
      countInput.value = parseInt(countInput.value) - 1;
    }
  });
  
  countInput.addEventListener('beforeinput', (e) => {
    // 入力されようとしているデータが数字（0-9）でない場合は拒否
    if (e.data && !/^[0-9]+$/.test(e.data)) {
      e.preventDefault();
    }
  });
});
*/


  // select buttons - DOM
  
  
  // select buttons - event listener
/*
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 選択状態をリセット
      modeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const value = button.dataset.mode;
      selectionState.mode = value;
    });
  });*/