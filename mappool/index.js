// Player Names
const playerNameLeftEl = document.getElementById("player-name-left")
const playerNameRightEl = document.getElementById("player-name-right")
let currentPlayerNameLeft, currentPlayerNameRight

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    if (currentPlayerNameLeft !== data.tourney.team.left) {
        currentPlayerNameLeft = data.tourney.team.left
        playerNameLeftEl.textContent = currentPlayerNameLeft
    }
    if (currentPlayerNameRight !== data.tourney.team.right) {
        currentPlayerNameRight = data.tourney.team.right
        playerNameRightEl.textContent = currentPlayerNameRight
    }
}