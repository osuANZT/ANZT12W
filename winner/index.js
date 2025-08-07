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
let currentPlayerNameLeft, currentPlayerNameRight

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Set player logos
    if (currentPlayerNameLeft !== data.tourney.team.left && allPlayers) {
        currentPlayerNameLeft = data.tourney.team.left.trim()
        if (currentPlayerNameLeft == "") return

        // Get player object
        const player = findPlayer(currentPlayerNameLeft)
        if (player) {
            playerLogoLeftEl.style.backgroundImage = `url("https://a.ppy.sh/${player.playerId}")`
        }
    }
    if (currentPlayerNameRight !== data.tourney.team.right && allPlayers) {
        currentPlayerNameRight = data.tourney.team.right.trim()
        if (currentPlayerNameRight == "") return

        // Get player object
        const player = findPlayer(currentPlayerNameRight)
        if (player) {
            playerLogoRightEl.style.backgroundImage = `url("https://a.ppy.sh/${player.playerId}")`
        }
    }
}