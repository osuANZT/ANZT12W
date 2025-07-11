// Set round
const roundNameEl = document.getElementById("round-name")
const matchTypeEl = document.getElementById("match-type")
const currentStreamEl = document.getElementById("current-stream")
const setIdleTitle = () => currentStreamEl.setAttribute("src", `static/idle-icons/${matchTypeEl.value}-${roundNameEl.value}.png`)