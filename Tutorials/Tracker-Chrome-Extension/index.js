const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")
let myLeads = []

const tabBtn = document.getElementById("tab-btn")

if (localStorage.getItem("data")) {
	myLeads = JSON.parse(localStorage.getItem("data"))
	render(myLeads)
}

// const tabs = [
// 	{url: "https://www.youtube.com/"}
// ]
tabBtn.addEventListener("click", function() {
	chrome.tabs.query({  active: true, currentWindow: true}, function (tabs) {
		myLeads.push(tabs[0].url)
		localStorage.setItem("data", JSON.stringify(myLeads))
		render(myLeads)
	});
})

inputBtn.addEventListener("click", function() {
	myLeads.push(inputEl.value)
	inputEl.value = ""
	localStorage.setItem("data", JSON.stringify(myLeads))
	render(myLeads)
})
deleteBtn.addEventListener("dblclick", function() {
	myLeads = []
	localStorage.setItem("data", JSON.stringify(myLeads))
	render(myLeads)
})


function render(leads) {
	let leadsText = ""
	ulEl.textContent = ""

	for (let i = 0; i < leads.length; i++) {
		//url
		console.log(leads[i])
		if (leads[i] && leads[i].length > 4 && leads[i].slice(0, 4) == "http") {
			leadsText += `
			<li>
				<a target='_blank' href='${leads[i]}'>
					${leads[i]}
				</a>
			</li>
			`
		} else {
			leadsText += `
			<li>
				${leads[i]}
			</li>
			`
		}

		//alternative (pushes one list html item, doesn't need for loop)
		// const li = document.createElement("li")
		// li.textContent = myLeads[i]
		// ulEl.append(li)
	}
	//textContent is real text, innerHTML is raw html
	ulEl.innerHTML = leadsText

}