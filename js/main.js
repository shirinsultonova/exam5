//* Intro game
const gameBody = document.querySelector("body");
const gameWrapper = document.querySelector(".intro-game");
const gameForm = document.querySelector(".intro-game-form");
const gameLevel = document.querySelector(".game-level-select");
const gameTime = document.querySelector(".game-time-select");
const gameBtn = document.querySelector(".intro-game-btn");

// * Game start
const gameWrapperBox = document.querySelector(".game-wrapper-box");
const gameScoreCountText = document.querySelector(".game-score-count");
const gameLevelText = document.querySelector(
  ".game-level-text"
);
const gameTimeText = document.querySelector(".game-time-text");
const gameQuestionText = document.querySelector(".game-question-text");
const gameCardList = document.querySelector(".game-card-list");
const gameCardBox = document.querySelector(".game-card-box");

//* Over modal
const gameOverModal = document.querySelector(".game-over-modal");
const gameOverError = document.querySelector(
  ".game-over-error"
);
const gameOverModalText = document.querySelector(".game-over-img");
const gameOverScore = document.querySelector(
  ".game-over-score"
);

//* Win modal
const gameWinModal = document.querySelector(".game-win-modal");
const gameWinScore = document.querySelector(".game-win-score");
const gameWinError = document.querySelector(".game-win-error");
const gameCardTemplate = document.querySelector(".game-card-template").content;


//* Counters and other
let dataArr = [];
let levelData = [];
let gameScoreCount = 0;
let gameErrorCounter = 0;


gameScoreCountText.textContent = `Score: ${gameScoreCount}`;

gameForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  gameWrapper.classList.add("d-none");
  gameWrapperBox.classList.add("d-block");

  if (gameLevel.value === "easy") {
    gameLevelText.textContent = `Level ${gameLevel.value}`;
    levelData = selectedEasyLevel(roadSymbolGenerated);
    cardRender(levelData);
  } else if (gameLevel.value === "medium") {
    gameLevelText.textContent = `Level ${gameLevel.value}`;
    levelData = selectedMediumLevel(roadSymbolGenerated);
    cardRender(levelData);
  } else if (gameLevel.value === "hard") {
    gameLevelText.textContent = `Level ${gameLevel.value}`;
    levelData = selectedHardLevel(roadSymbolGenerated);
    cardRender(levelData);
  } else {
    gameWrapperBox.classList.remove("d-block");
    gameWrapper.classList.remove("d-none");
  }

  if (
    gameTime.value !== "3" &&
    gameTime.value !== "5" &&
    gameTime.value !== "10"
  ) {
    gameWrapperBox.classList.remove("d-block");
    gameWrapper.classList.remove("d-none");
  }

  startMinutes = Number(gameTime.value);
  setTimer(startMinutes);
});

// ! slice from 0 to ...
function selectedEasyLevel(roadSymbol) {
  const gameEasyLevel = roadSymbol.slice(0, 20);
  dataArr = gameEasyLevel.map((item) => item.id);
  return gameEasyLevel;
}


function selectedMediumLevel(roadSymbol) {
  const gameMediumLevel = roadSymbol.slice(0, 30);
  dataArr = gameMediumLevel.map((item) => item.id);
  return gameMediumLevel;
}


function selectedHardLevel(roadSymbol) {
  const gameHardLevel = roadSymbol.slice(0, 50);
  dataArr = gameHardLevel.map((item) => item.id);
  return gameHardLevel;
}

// ! Count time
let globalTime = 0;
function setTimer(startTime) {
  globalTime = startTime * 60;
  setInterval(updateCountDown, 1000);
}

function updateCountDown() {
  const minutes = Math.floor(globalTime / 60);
  let seconds = globalTime % 60;

  if (seconds === 10 && minutes === 0) {
    gameTimeText.classList.add("game-time-text--over");
  }

  if (seconds === 0 && minutes === 0) {
    gameOverModal.classList.add("d-flex");
    gameOverModalText.textContent = `Time is out`;
    gameOverScore.textContent = `Score: ${gameScoreCount}`;
    gameBody.classList.add("sitebody--js");
    return;
  }

  seconds = seconds < 10 ? "0" + seconds : seconds;
  gameTimeText.textContent = `${minutes}:${seconds}`;
  globalTime--;
}

roadSymbolGenerated = roadSymbol
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);


  //* Randomize
function gameQuestionRandom(generatedQuestion) {
  const randomIndex = Math.floor(Math.random() * dataArr.length);
  let selectedId = dataArr[randomIndex];
  let selectedObject = generatedQuestion.find((item) => item.id == selectedId);
  gameQuestionText.dataset.questionId = selectedObject.id;
  gameQuestionText.textContent = selectedObject.symbol_title;
}

function cardRender(cardRules) {
  gameCardList.innerHTML = "";
  const cardRulesFragment = document.createDocumentFragment();

  for (let gameCardRules of cardRules) {
    let cloneGameCardTemplate = gameCardTemplate.cloneNode(true);

    cloneGameCardTemplate.querySelector(".game-card-item").dataset.cardId =
      gameCardRules.id;
    cloneGameCardTemplate.querySelector(".game-card-img").src =
      gameCardRules.symbol_img;

    cardRulesFragment.appendChild(cloneGameCardTemplate);
  }

  // ! Winner modal
  if (dataArr.length == 0) {
    gameWinModal.classList.add("d-flex");
    gameOverModal.classList.remove("d-flex");
    gameWinScore.textContent = `Score: ${gameScoreCount}`;
    setTimer(0);
  }
  gameQuestionRandom(cardRules);
  gameCardList.appendChild(cardRulesFragment);
}


gameCardList.addEventListener("click", (evt) => {
  if (evt.target.matches(".game-card-item")) {
    const cardId = Number(evt.target.dataset.cardId);
    let findedItem = evt.target;

   //* Correct or wrong
    if (cardId == gameQuestionText.dataset.questionId) {
      let cardDataArr = dataArr.filter((item) => item !== cardId);
      dataArr = [...cardDataArr];
      gameScoreCount += 2;
      gameScoreCountText.textContent = `Score: ${gameScoreCount}`;
      cardRender(levelData);
      alert("Well! You choose true answer");
    } else {
      gameScoreCount--;
      gameErrorCounter++;
      gameScoreCountText.textContent = `Score: ${gameScoreCount}`;
      findedItem.style.backgroundColor = "red";
      setTimeout(() => {
        findedItem.style.backgroundColor = "transparent";
      }, 5000);

      if (gameErrorCounter == 5) {
        gameOverModal.classList.add("d-flex");
        gameBody.classList.add("sitebody--js");
        gameOverScore.textContent = `Score: ${gameScoreCount}`;
        gameOverError.textContent = `Attempts: ${gameErrorCounter}`;
      }
    }
  }
});
