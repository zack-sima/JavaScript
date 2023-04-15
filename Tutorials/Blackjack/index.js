let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""

let messageEl = document.getElementById("message-el")

//grabs id tag (body, id name, etc)
let sumEl = document.querySelector(".sum-el")
let cardsEl = document.querySelector(".cards-el")
let playerEl = document.getElementById("player-el")

let player = {
	name: "Per",
	chips: 145,
	addMoney: function(change) {
		this.chips += change
		this.updateText()
	},
	updateText: function() {
		playerEl.textContent = player.name + ": $" + player.chips
	}
}

function startGame() {
	cards = [getRandomCard(), getRandomCard()]
	sum = cards[0] + cards[1]
	isAlive = true
	player.addMoney(-1)
	renderGame()
}
function renderGame() {
	if (sum <= 20) {
		message = "New card?"
	} else if (sum == 21) {
		message = "Blackjack!"
		player.addMoney(15)
		isAlive = false
	} else {
		message = "You're out of the game!"
		isAlive = false
	}

	cardsEl.textContent = "Cards: "
	for (let c of cards) {
		cardsEl.textContent += c + " "
	}
	sumEl.textContent = "Sum: " + sum.toString()
	messageEl.textContent = message
}
function getRandomCard() {
	let rand = Math.floor((Math.random() * 13)) + 1
	if (rand == 1) rand = 11
	if (rand > 10) rand = 10

	return rand
}
function newCard() {
	if (!isAlive) return

	player.addMoney(-1)

	let newCard = getRandomCard()
	cards.push(newCard)
	sum += newCard
	renderGame()
}