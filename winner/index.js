// Load players
let allPlayers
async function getBeatmaps() {
    const response = await axios.get("../_data/players.json")
    allPlayers = response.data
}
getBeatmaps()

// Get player
const findPlayer = playerName => allPlayers.find(player => player.playerName.toLowerCase() === playerName.toLowerCase())

// Player Logos
const playerLogoLeftEl = document.getElementById("player-logo-left")
const playerLogoRightEl = document.getElementById("player-logo-right")
// Player Names
const playerNameLeftEl = document.getElementById("player-name-left")
const playerNameRightEl = document.getElementById("player-name-right")
let currentPlayerNameLeft, currentPlayerNameRight
let currentPlayerIdLeft, currentPlayerIdRight

// Win Status
const winStatusLeftEl = document.getElementById("win-status-left")
const winStatusRightEl = document.getElementById("win-status-right")
// SCoreline
const playerScorelineLeftEl = document.getElementById("player-scoreline-left")
const playerScorelineRightEl = document.getElementById("player-scoreline-right")
let currentPlayerStarsLeft, currentPlayerStarsRight

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Set player logos
    if (currentPlayerNameLeft !== data.tourney.team.left && allPlayers) {
        currentPlayerNameLeft = data.tourney.team.left.trim()
        if (currentPlayerNameLeft == "") return
        playerNameLeftEl.textContent = currentPlayerNameLeft
        
        // Get player object
        const player = findPlayer(currentPlayerNameLeft)
        if (player) {
            playerLogoLeftEl.style.backgroundImage = `url("https://a.ppy.sh/${player.playerId}")`
            currentPlayerIdLeft = player.playerId
        }
    }
    if (currentPlayerNameRight !== data.tourney.team.right && allPlayers) {
        currentPlayerNameRight = data.tourney.team.right.trim()
        if (currentPlayerNameRight == "") return
        playerNameRightEl.textContent = currentPlayerNameRight

        // Get player object
        const player = findPlayer(currentPlayerNameRight)
        if (player) {
            playerLogoRightEl.style.backgroundImage = `url("https://a.ppy.sh/${player.playerId}")`
            currentPlayerIdRight = player.playerId
        }
    }

    // Stars
    if (currentPlayerStarsLeft !== data.tourney.points.left ||
        currentPlayerStarsRight !== data.tourney.points.right) {
        currentPlayerStarsLeft = data.tourney.points.left
        currentPlayerStarsRight = data.tourney.points.right  
        playerScorelineLeftEl.textContent = currentPlayerStarsLeft
        playerScorelineRightEl.textContent = currentPlayerStarsRight
        
        if (currentPlayerStarsLeft > currentPlayerStarsRight) {
            winStatusLeftEl.setAttribute("src", "static/win-status/WINNER.png")
            winStatusRightEl.setAttribute("src", "static/win-status/LOSER.png")
        } else if (currentPlayerStarsLeft < currentPlayerStarsRight) {
            winStatusLeftEl.setAttribute("src", "static/win-status/LOSER.png")
            winStatusRightEl.setAttribute("src", "static/win-status/WINNER.png")
        } else {
            winStatusLeftEl.setAttribute("src", "static/win-status/WINNER.png")
            winStatusRightEl.setAttribute("src", "static/win-status/WINNER.png")
        }
    }
}