//#region game data and logic
//Inflation variables
let clickCount = 0
let heigth = 140
let width = 100
let inflationRate = 30
let maxSize = 360
let currentPopCount = 0
let highestPopCount = 0
let currentColor = "red"
let possibleColors = ["green", "purple", "blue", "red"]

// Player variables
let currentPlayer = {}

// Variables for Timer
let gameLength = 10000
let clockId = 0
let timeRemaining = 0


function startGame(){
  document.getElementById("game-controls").classList.remove("hidden")
  document.getElementById("score-board").classList.add("hidden")
  document.getElementById("main-controls").classList.add("hidden")
  startClock()
  setTimeout(stopGame, gameLength)

}


function startClock(){
  timeRemaining = gameLength
  drawClock()
  clockId = setInterval(drawClock, 1000)
}


function stopClock(){
  clearInterval(clockId)

}


function drawClock(){
  let countdownElem = document.getElementById("countdown")
  countdownElem.innerText = (timeRemaining / 1000).toString()
  timeRemaining -= 1000

}


function inflate(){
  clickCount++
  heigth += inflationRate
  width += inflationRate
  checkBalloonPop()
  draw()
}

function checkBalloonPop(){
  if(heigth >= maxSize){
    console.log("Pop the balloon!")
    let balloonElement = document.getElementById("Balloon")
    balloonElement.classList.remove(currentColor)
    getRandomColor()
    balloonElement.classList.add(currentColor)

    document.getElementById("pop-sound").play()

    currentPopCount++
    heigth = 0;
    width = 0;
  }
}

function getRandomColor(){
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i]
}

function draw(){
  let balloonElement = document.getElementById("Balloon")
  balloonElement.style.width = width + "px"
  balloonElement.style.height = heigth + "px"

  let clickCountElem = document.getElementById("click-count")
  clickCountElem.innerText = clickCount.toString()

  let popCountElem = document.getElementById("pop-count")
  popCountElem.innerText = currentPopCount.toString()

  let highestPopCountElem = document.getElementById("high-pop-count")
  highestPopCountElem.innerText = currentPlayer.topScore.toString()

  let playerNameElem = document.getElementById("player-name")
  playerNameElem.innerText = currentPlayer.name

}


function stopGame(){
  console.log("The game is over!")

  document.getElementById("main-controls").classList.remove("hidden")
  document.getElementById("score-board").classList.remove("hidden")
  document.getElementById("game-controls").classList.add("hidden")

  clickCount = 0
  heigth = 140
  width = 100

  if (currentPopCount > currentPlayer.topScore){
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }

  currentPopCount = 0

  stopClock()
  draw()
  drawScoreboard()
}
// #endregion

// Player Array
let players = []
loadPlayers()

function setPlayer(event){
  event.preventDefault()
  let form = event.target

  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name ==playerName)

  if(!currentPlayer){
    currentPlayer = {name: playerName, topScore: 0 }
    players.push(currentPlayer)
    savePlayers()
  }
  
  form.reset()
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()

}


function changePlayer(){
  document.getElementById("player-form").classList.remove("hidden")
  document.getElementById("game").classList.add("hidden")
}


function savePlayers(){
  window.localStorage.setItem("players", JSON.stringify(players))

}


function loadPlayers(){
  let playersData = JSON.parse(window.localStorage.getItem("players"))

  if(playersData){
    players = playersData
  }

}

function drawScoreboard(){
  let template = ""

  players.sort((p1, p2) => p2.topScore - p1.topScore)

  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
    <span>
      <i class="fa fa-user-circle"></i>
      ${player.name}
    </span>
    <span>Score: ${player.topScore}</span>
  </div>`
  })

  document.getElementById("players").innerHTML = template
}

drawScoreboard()

//soruce for balloon logo https://www.clipartmax.com/middle/m2i8A0i8N4K9K9G6_logo-pop-the-balloon-logo/