let counter = 0
let countHistory = ""

updateCounter()

function increment() {
	counter++
	updateCounter()
}
function updateCounter() {
	document.getElementById("count-el").innerText = counter
}
function save() {
	if (countHistory == "")
		countHistory = counter.toString()
	else
		countHistory += " - " + counter.toString()

	document.getElementById("count-hist").textContent = "Previous entries: " + countHistory

	counter = 0
	updateCounter()
}