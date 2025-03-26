"use strict";
///////////////// BUILD SHAPES (got a lot of internet help with this one, I do not understand canvas drawing at all
function buildShapes(count, color, shading, shape) {
  // Create and configure canvas
  const canvas = document.createElement('canvas');
  canvas.width = 210;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  // Canvas center
  const centerY = canvas.height / 2;

  // Dynamically calculate shape size and spacing
  const margin = 2; // Margin on both sides
  const shapeSize = canvas.height * 0.6; // Shape size is 60% of canvas height
  const totalShapesWidth = count * shapeSize; // Total width occupied by shapes
  const totalAvailableSpace = canvas.width - (2 * margin) - totalShapesWidth; // Space for gaps between shapes
  let padding = 0;

  switch (count) {
    case 1:
      // For 1 shape, center it by dividing the space in half
      padding = totalAvailableSpace / 2;
      break;
    case 2:
      // For 2 shapes, define custom logic for spacing
      // Ensure they are evenly spaced with some room on either side
      padding = totalAvailableSpace / 3; // Divides the space into 3 sections for better spacing
      break;
    default:
      // For 3 or more shapes, divide the space by (count - 1) for equal gaps
      padding = totalAvailableSpace / (count - 1);
      break;
  }

  // Adjust the start position to center the shapes
  const startX = (canvas.width - totalShapesWidth - (padding * (count - 1))) / 2 + shapeSize / 2;

  // Function to draw a shape
  const drawShape = (type, x, y, size, color, shading) => {
    ctx.beginPath();

    // Define shapes (same as before)
    if (type === 'circle') {
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    } else if (type === 'triangle') {
      const adjustment = 1.5 // Adjust this value if needed
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y + size / 2 - adjustment); // Adjusted
      ctx.lineTo(x + size / 2, y + size / 2 - adjustment); // Adjusted
      ctx.closePath();
    } else if (type === 'square') {
      const adjustment = 1.5; // Adjust this value if needed
      ctx.rect(x - size / 2, y - size / 2, size, size - adjustment); // Adjusted
    }

    if (shading === 'striped') {
      ctx.fillStyle = color; // Fill the shape FIRST
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();//draw the outline

      ctx.save(); // Save context before clipping
      ctx.beginPath(); // New path for clipping
      //Redraw the shape for clipping
      if (type === 'circle') {
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      } else if (type === 'triangle') {
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.closePath();
      } else if (type === 'square') {
        ctx.rect(x - size / 2, y - size / 2, size, size);
      }
      ctx.clip(); // Clip to the shape

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      const stripeOffset = 1.5;
      for (let i = -size / 2 + stripeOffset; i < size / 2; i += 5) {
        ctx.beginPath();
        ctx.moveTo(x - size / 2, y + i);
        ctx.lineTo(x + size / 2, y + i);
        ctx.stroke();
      }
      ctx.restore(); // Restore context after clipping
    } else if (shading === 'empty') {
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  // Draw shapes evenly spaced across the canvas
  for (let i = 0; i < count; i++) {
    const x = startX + i * (shapeSize + padding);
    drawShape(shape, x, centerY, shapeSize, color, shading);
  }

  return canvas;
}


///////// DEFINE DOM CONSTANTS
const allCardsDiv = document.getElementById("allCards");
const setsFoundMessage = document.getElementById("setsFound");
const shuffleRemainingButton = document.getElementById("shuffleRemaining");
const messageContainerDiv = document.querySelector("#messageContainer");
const cardsRemainingDiv = document.getElementById("cardsRemaining");
const unselectAllCardsButton = document.querySelector("#unselectAllCards");
const dealThreeButton = document.querySelector("#dealThree");
const dealRestartButton = document.getElementById("dealRestart");
const rulesButton = document.getElementById("rulesButton");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeRulesButton = document.querySelector("#closeRules");
const getAHintButton = document.getElementById("getAHint");
const newGameButton = document.querySelector("#newGame");
const newGameHoverSpan = document.querySelector("#newGameHover");
const dealRestartHoverSpan = document.querySelector("#dealRestartHover");
const checkSetButton = document.querySelector("#testSet");
const multiplayerControlsDiv = document.querySelector("#multiplayerControls");
const playerNamesFormDiv = document.querySelector("#playerNamesForm");
const playerScoresDiv = document.querySelector("#playerScores");
const numberOfPlayersSelect = document.querySelector("#numberOfPlayers");
const playerNamesInputsDiv = document.querySelector("#playerNamesInputs");
const newGameContinueButton = document.querySelector("#newGameContinue");
const pauseButton = document.querySelector("#pauseButton");
const resumeButton = document.querySelector("#resumeButton");


////////////////// BUILD THE CARD DECK
// There are 81 total cards in the deck (indexed 0-80 in the array). Each one is an object containing 4 properties: color, number, shape, shading.

// arrays with property options
const colorArray = ["pink", "green", "purple"];
const numberArray = [1, 2, 3];
const shapeArray = ["square", "circle", "triangle"];
const shadingArray = ["empty", "filled", "striped"];
const colorMap = {
  pink: "#ee0276",
  green: "#02b008",
  purple: "#aa02ec"
};

const myDeck = [];
const dealtCards = [];
let cardNumber = 0;

function buildDeck() {
  myDeck.length = 0;
  dealtCards.length = 0;
  for (let color of colorArray) {
    for (let numberOf of numberArray) {
      for (let shape of shapeArray) {
        for (let shading of shadingArray) {
          myDeck.push({
              color: colorMap[color], // Use hex colors
              colorName: color,
              numberOf,
              shape,
              shading
              //cardNumber: cardNumber++
            }
          )
        }
      }
    }
  }
  return myDeck;
}

////////////////// Shuffle the deck (must use shuffleDeck(myDeck) when called)
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]]; // Swap cards
  }
  return deck;
}

////////////////// Deal the cards to the DOM
function dealCards() {

  allCardsDiv.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const cardCanvas = buildShapes(myDeck[i].numberOf, myDeck[i].color, myDeck[i].shading, myDeck[i].shape);
    const fullCardDiv = document.createElement('div');
    fullCardDiv.setAttribute("data-color-name", myDeck[i].colorName);
    fullCardDiv.setAttribute("data-number-of", myDeck[i].numberOf);
    fullCardDiv.setAttribute("data-shading", myDeck[i].shading);
    fullCardDiv.setAttribute("data-shape", myDeck[i].shape);
    fullCardDiv.setAttribute("onclick", "cardStyleStates(this)");
    fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
    allCardsDiv.appendChild(fullCardDiv); // Append the div to the parent
  }
  dealtCards.push(...myDeck.splice(0,12));
}

function dealRestart() {
  buildDeck();
  //console.log(myDeck.length);
  //console.log(JSON.stringify(myDeck));
  shuffleDeck(myDeck);
  dealCards();
  //console.log(dealtCards.length);
  //console.log(myDeck.length);
  //console.log(JSON.stringify(dealtCards));
  cardsRemaining();
  setsFoundNumber = 0;

  setsFoundMessage.innerHTML = `<p>Sets found: ${setsFoundNumber}</p>`;
  shuffleRemainingButton.disabled = false;

  messageContainerDiv.innerHTML = "";

  startGamePlayerScoresArray();
  displayPlayerScoresArray();

  pauseTimer();
  newTimerInstance();

  pauseButton.disabled = false;
  unselectAllCardsButton.disabled = false;
  shuffleRemainingButton.disabled = false;
  getAHintButton.disabled = false;
  pauseButton.classList.remove("hidden");
  resumeButton.classList.add("hidden");
  allCardsDiv.classList.remove("paused");
  checkSetButton.disabled = false;

}

let currentPlayerScoresArray = [];
function startGamePlayerScoresArray() {
  for (let i = 0; i< numberOfPlayersValue; i++) {
    //currentPlayerScoresArray.push(0);
    currentPlayerScoresArray[i] = 0;
  }
}

function updatePlayerScoresArray(player) {
  currentPlayerScoresArray[player] += 1;
}

function displayPlayerScoresArray() {
  playerScoresDiv.innerHTML = "";
  for (let i = 0; i < numberOfPlayersValue; i++) {
    playerScoresDiv.innerHTML += `<div>${currentGamePlayers[i]}: ${currentPlayerScoresArray[i]}</div>`;
  }
}


////////////////// Cards remaining function
function cardsRemaining() {
  cardsRemainingDiv.innerHTML = `<p>Cards remaining: ${myDeck.length}</p>`;
}

////////////////// Allows player to click on cards and highlights them
// only 3 cards are allowed to be selected at once
function cardStyleStates(cardDiv) {
  cardDiv.classList.toggle("selectedCard");
  const numberOfSelectedCards = document.querySelectorAll("div.selectedCard");
  if (numberOfSelectedCards.length > 3) {
    cardDiv.classList.remove("selectedCard"); // Undo the toggle
    messageContainerDiv.innerHTML = `<p>You may only select 3 cards.</p>`;
  } else {
    messageContainerDiv.innerHTML = ""; // Clear the message if under limit.
  }
}

////////////////// Unselect all selected cards button
function unselectAllCards() {
  const cardsOnTable = allCardsDiv.querySelectorAll("div");

  cardsOnTable.forEach(div => {
    div.classList.remove("selectedCard");
  });
  messageContainerDiv.innerHTML = "";
}

////////////////// Check set
function testSet() {
  const selectedCards = allCardsDiv.querySelectorAll("div.selectedCard");

  if (selectedCards.length === 3) {

    const cardOne = {
      colorName: selectedCards[0].dataset.colorName,
      numberOf: selectedCards[0].dataset.numberOf,
      shading: selectedCards[0].dataset.shading,
      shape: selectedCards[0].dataset.shape,
    };

    const cardTwo = {
      colorName: selectedCards[1].dataset.colorName,
      numberOf: selectedCards[1].dataset.numberOf,
      shading: selectedCards[1].dataset.shading,
      shape: selectedCards[1].dataset.shape,
    };
    const cardThree = {
      colorName: selectedCards[2].dataset.colorName,
      numberOf: selectedCards[2].dataset.numberOf,
      shading: selectedCards[2].dataset.shading,
      shape: selectedCards[2].dataset.shape,
    };

    let colorTest = false;
    if ((cardOne.colorName === cardTwo.colorName && cardTwo.colorName === cardThree.colorName) || (cardOne.colorName !== cardTwo.colorName && cardTwo.colorName !== cardThree.colorName && cardOne.colorName !== cardThree.colorName)) {
      colorTest = true;
    }
    let numberOfTest = false;
    if ((cardOne.numberOf === cardTwo.numberOf && cardTwo.numberOf === cardThree.numberOf) || (cardOne.numberOf !== cardTwo.numberOf && cardTwo.numberOf !== cardThree.numberOf && cardOne.numberOf !== cardThree.numberOf)) {
      numberOfTest = true;
    }
    let shadingTest = false;
    if ((cardOne.shading === cardTwo.shading && cardTwo.shading === cardThree.shading) || (cardOne.shading !== cardTwo.shading && cardTwo.shading !== cardThree.shading && cardOne.shading !== cardThree.shading)) {
      shadingTest = true;
    }
    let shapeTest = false;
    if ((cardOne.shape === cardTwo.shape && cardTwo.shape === cardThree.shape) || (cardOne.shape !== cardTwo.shape && cardTwo.shape !== cardThree.shape && cardOne.shape !== cardThree.shape)) {
      shapeTest = true;
    }

    let isItASet = false;
    if (colorTest && numberOfTest && shadingTest && shapeTest) {
      isItASet = true;
    }

    if (isItASet) {
      dealThreeButton.disabled = false;
      messageContainerDiv.innerHTML = `<p>Congrats! You found a set! Who found it?</p>`;

      let pointOptionsList = "";
      for (let i = 0; i < numberOfPlayersValue; i++) {
        pointOptionsList += `<option value="${i}">${currentGamePlayers[i]}</option>`;
      }
      messageContainerDiv.innerHTML += `<select id="whoFoundTheSet">${pointOptionsList}</select>`;

    } else {
      messageContainerDiv.innerHTML = `<p>Sorry! Those cards are not a set. Please try again. <span id="whyNotASet">Why?</span></p>`;
      const whyNotASetSpan = document.getElementById("whyNotASet");
      whyNotASetSpan.addEventListener("click", () => {
          whyNotASetSpan.innerHTML = "";
          let whyNotASetMessage = "";
          if (!colorTest) {
            whyNotASetMessage += `<p>The <strong>color</strong> property is incorrect.</p>`;
          }
          if (!numberOfTest) {
            whyNotASetMessage += `<p>The <strong>number of items</strong> property is incorrect.</p>`;
          }
          if (!shapeTest) {
            whyNotASetMessage += `<p>The <strong>shape</strong> property is incorrect.</p>`;
          }
          if (!shadingTest) {
            whyNotASetMessage += `<p>The <strong>shading</strong> property is incorrect.</p>`;
          }
          messageContainerDiv.innerHTML += whyNotASetMessage;
        }
      );
    }

  } else {

    messageContainerDiv.innerHTML = `<p>You must select 3 cards to test a set.</p>`;
    dealThreeButton.disabled = true;
  }
}

////////////////// keep track of total number of sets found
let setsFoundNumber = 0;
function setsFound() {
  setsFoundNumber += 1;
  setsFoundMessage.innerHTML = `<p>Sets found: ${setsFoundNumber}</p>`;
}

////////////////// function to continue after a found set
// deals 3 new cards in place of the found set cards
// if there are no more cards to deal it removes the found set cards
function dealThreeCards() {
  const selectedCards = Array.from(allCardsDiv.querySelectorAll("div.selectedCard"));
  const whoFoundTheSetIndex = document.querySelector("#whoFoundTheSet").value;

  updatePlayerScoresArray(whoFoundTheSetIndex);
  displayPlayerScoresArray();


  if (myDeck.length >= 3) {

    for (let i = 0; i < 3; i++) {
      const cardCanvas = buildShapes(myDeck[i].numberOf, myDeck[i].color, myDeck[i].shading, myDeck[i].shape);
      const fullCardDiv = document.createElement('div');
      fullCardDiv.id = `card${i}`;
      fullCardDiv.setAttribute("data-color-name", myDeck[i].colorName);
      fullCardDiv.setAttribute("data-number-of", myDeck[i].numberOf);
      fullCardDiv.setAttribute("data-shading", myDeck[i].shading);
      fullCardDiv.setAttribute("data-shape", myDeck[i].shape);
      fullCardDiv.setAttribute("onclick", "cardStyleStates(this)");
      fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
      selectedCards[i].replaceWith(fullCardDiv); // Append the div to the parent
    }
    dealtCards.push(...myDeck.splice(0, 3));
    selectedCards.length = 0;
    cardsRemaining();

    dealThreeButton.disabled = true;
    messageContainerDiv.innerHTML = "";
    setsFound();
  } else {
    messageContainerDiv.innerHTML = `<p>There are no more cards to deal! See if you can find any remaining sets.</p>`;
    for (let i = 0; i < 3; i++) {
      selectedCards[i].remove();
      dealThreeButton.disabled = true;
      setsFound();
    }
  }

  if (myDeck.length === 0) {
    shuffleRemainingButton.disabled = true;
  }
}

////////////////// function to shuffle the remaining deck cards when there are no sets on the board
// doesn't do anything if there are no cards left to deal
function shuffleRemaining() {

  // MUST RECREATE CARDS FROM WHAT IS ALREADY ON THE BOARD AS THOSE ARE ALREADY REMOVED FROM THE CARD ARRAY

  const currentCardsOnBoard = allCardsDiv.querySelectorAll("div");
  allCardsDiv.innerHTML = "";

  messageContainerDiv.innerHTML = "";

  currentCardsOnBoard.forEach((card) => {
    myDeck.push({
      color: colorMap[card.dataset.colorName], // Use hex colors
      colorName: card.dataset.colorName,
      numberOf: parseInt(card.dataset.numberOf),
      shape: card.dataset.shape,
      shading: card.dataset.shading
    })
  });

  shuffleDeck(myDeck);

  for (let i = 0; i < 12; i++) {
    const cardCanvas = buildShapes(myDeck[i].numberOf, myDeck[i].color, myDeck[i].shading, myDeck[i].shape);
    const fullCardDiv = document.createElement('div');
    fullCardDiv.setAttribute("data-color-name", myDeck[i].colorName);
    fullCardDiv.setAttribute("data-number-of", myDeck[i].numberOf);
    fullCardDiv.setAttribute("data-shading", myDeck[i].shading);
    fullCardDiv.setAttribute("data-shape", myDeck[i].shape);
    fullCardDiv.setAttribute("onclick", "cardStyleStates(this)");
    fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
    allCardsDiv.appendChild(fullCardDiv); // Append the div to the parent
  }
  dealtCards.push(...myDeck.splice(0,12));

  cardsRemaining();
}

////////////////// the rules modal open/close
function openRules() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}
function closeRules() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}
const overlayDiv = document.querySelector("#overlay");
overlayDiv.addEventListener("click", closeRules);

////////////////// function to provide a hint to players
// starts at the beginning of the cards on the board and searches for a set
// it returns the first found set only
function getAHint() {

  // MUST RECREATE CARDS FROM WHAT IS ALREADY ON THE BOARD AS THOSE ARE ALREADY REMOVED FROM THE CARD ARRAY

  const currentCardsOnBoard = allCardsDiv.querySelectorAll("div");
  unselectAllCards();

  let hintDeck = [];

  currentCardsOnBoard.forEach((card) => {
    hintDeck.push({
      color: colorMap[card.dataset.colorName], // Use hex colors
      colorName: card.dataset.colorName,
      numberOf: parseInt(card.dataset.numberOf),
      shape: card.dataset.shape,
      shading: card.dataset.shading
    })
  });

  function findMatchingSet(deck) {
    const n = deck.length;

    for (let i = 0; i < n - 2; i++) {
      for (let j = i + 1; j < n - 1; j++) {
        for (let k = j + 1; k < n; k++) {
          const set = [deck[i], deck[j], deck[k]];

          const properties = ["colorName", "numberOf", "shape", "shading"];
          let isMatch = true;

          for (const prop of properties) {
            const values = set.map(obj => obj[prop]);
            const uniqueValues = [...new Set(values)];

            if (uniqueValues.length !== 1 && uniqueValues.length !== 3) {
              isMatch = false;
              break; // No need to check other properties for this set
            }
          }

          if (isMatch) {
            return [i, j, k]; // Return the index of the first card in the set
          }
        }
      }
    }

    return []; // No matching set found
  }

  let matchedSet = findMatchingSet(hintDeck);

  if (matchedSet.length === 0) {
    messageContainerDiv.innerHTML = `<p>Sorry! There are no sets on the board. Please shuffle the remaining cards and try again.</p>`;
  } else {
    messageContainerDiv.innerHTML = `<p>There is a set containing the highlighted card. <span id="hintSecondCard">Click here</span> to reveal the second card in the set.</p>`;
    allCardsDiv.children[matchedSet[0]].classList.add("selectedCard");

    const hintSecondCardSpan = document.getElementById("hintSecondCard");
    hintSecondCardSpan.addEventListener("click", () => {
      allCardsDiv.children[matchedSet[1]].classList.add("selectedCard");
    });
  }
}

function howManyPlayers() {
  multiplayerControlsDiv.classList.remove("hidden");
  newGameContinueButton.classList.remove("hidden");

}

let currentGamePlayers = [];
let numberOfPlayersValue = 0;
function playerNamesInputs(selectedElement) {
  numberOfPlayersValue = Number(selectedElement.value);
  if (numberOfPlayersValue === 0) {
    playerNamesInputsDiv.innerHTML = "";
    messageContainerDiv.innerHTML = `<p>Please select a number of players to continue.</p>`;
    newGameContinueButton.disabled = true;
  } else if (numberOfPlayersValue >= 1) {
    newGameContinueButton.disabled = false;
    messageContainerDiv.innerHTML = "";
    playerNamesInputsDiv.innerHTML = `<div>`;
    for (let i = 0; i < numberOfPlayersValue; i++) {
      playerNamesInputsDiv.innerHTML += `<label for="player${i+1}">Player ${i+1}:</label><input type="text" name="player${i+1}" id="player${i+1}" placeholder="Player ${i+1} Name"><br>`;
    }
    playerNamesInputsDiv.innerHTML += `</div>`;
  }
  return numberOfPlayersValue;
}

function newGameContinue() {
  currentGamePlayers = [];
  for (let i = 0; i < numberOfPlayersValue; i++) {
    if (document.querySelector(`#player${i+1}`).value !== "" && numberOfPlayersValue !== 0) {
      currentGamePlayers.push(document.querySelector(`#player${i + 1}`).value);
      messageContainerDiv.innerHTML = "";
    } else {
      messageContainerDiv.innerHTML = `Please enter all names to continue.`;
      return;
    }
  }
  console.log(currentGamePlayers);

  playerScoresDiv.innerHTML = `<p>Deal the cards to continue! &#8593;</p>`;
  dealRestartButton.disabled = false;
  playerNamesFormDiv.classList.add("hidden");
  newGameContinueButton.classList.add("hidden");

  return currentGamePlayers;
}
newGameContinueButton.addEventListener("click", newGameContinue);


function newGame() {
  dealRestartButton.disabled = true;
  multiplayerControlsDiv.classList.remove("hidden");
  playerNamesFormDiv.classList.remove("hidden");
  newGameContinueButton.classList.remove("hidden");
  playerScoresDiv.innerHTML = "";
  allCardsDiv.innerHTML = "";
  howManyPlayers();
  clearTimeout(theTimer);
  document.getElementById("gameTimer").innerHTML = "";
}


/////// TIMER FUNCTION
let startTime; // = Math.floor(Date.now() / 1000); //Get the starting time (right now) in seconds
let theTimer;
let elapsedTime = 0;

function startTimeCounter() {
  let now = Math.floor(Date.now() / 1000);
  let diff = now - startTime; 
  let h = Math.floor(diff / 3600);
  let m = Math.floor((diff % 3600) / 60); 
  let s = Math.floor(diff % 60);
  h = padTime(h);
  m = padTime(m);
  s = padTime(s);
  document.getElementById("gameTimer").innerHTML = `Game Timer: ${h}:${m}:${s}`;
  return theTimer = setTimeout(startTimeCounter, 1000);
}

function padTime(i) {
  if (i < 10) { i = `0${i}`}  // add zero in front of numbers < 10
  return i;
}

function newTimerInstance() {
  startTime = Math.floor(Date.now() / 1000);
  elapsedTime = 0;
  startTimeCounter();
}

function pauseTimer() {
  clearTimeout(theTimer);
  let now = Math.floor(Date.now() / 1000); // get the time now
  return elapsedTime = now - startTime;
}

function pauseGame() {
  pauseTimer();
  resumeButton.classList.remove("hidden");
  pauseButton.classList.add("hidden");
  allCardsDiv.classList.add("paused");
}

function resumeGame() {
  startTime = (Math.floor(Date.now() / 1000)) - elapsedTime;
  startTimeCounter();
  resumeButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  allCardsDiv.classList.remove("paused");
}









////// EVENT LISTENERS
unselectAllCardsButton.addEventListener("click", unselectAllCards);
checkSetButton.addEventListener("click", testSet);
dealThreeButton.addEventListener("click", dealThreeCards);
shuffleRemainingButton.addEventListener("click", shuffleRemaining);
dealRestartButton.addEventListener("click", dealRestart);
rulesButton.addEventListener("click", openRules);
closeRulesButton.addEventListener("click", closeRules);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeRules();
  }
});
getAHintButton.addEventListener("click", getAHint);
newGameButton.addEventListener("mouseover", () => {
  messageContainerDiv.innerHTML = "Start a new game with new players. You can change the number of players (up to 6 players).";
});
newGameButton.addEventListener("mouseout", () => {
  messageContainerDiv.innerHTML = "";
});
dealRestartButton.addEventListener("mouseover", () => {
  messageContainerDiv.innerHTML = "Deal the deck to start a new game with the current players.";
});
dealRestartButton.addEventListener("mouseout", () => {
  messageContainerDiv.innerHTML = "";
});

newGameButton.addEventListener("click", newGame);

pauseButton.addEventListener("click", pauseGame);
resumeButton.addEventListener("click", resumeGame);



