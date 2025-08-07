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

// Chat stuff
const chatDisplayContainerEl = document.getElementById("chat-display-container")
let chatLen = 0

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

    // Chat Display
    // This is also mostly taken from Victim Crasher: https://github.com/VictimCrasher/static/tree/master/WaveTournament
    if (chatLen !== data.tourney.chat.length) {
        (chatLen === 0 || chatLen > data.tourney.chat.length) ? (chatDisplayContainerEl.innerHTML = "", chatLen = 0) : null
        const fragment = document.createDocumentFragment()

        for (let i = chatLen; i < data.tourney.chat.length; i++) {
            // Chat message container
            const chatMessageContainer = document.createElement("div")
            chatMessageContainer.classList.add("chat-message-container")  

            // Name
            const chatMessageName = document.createElement("div")
            chatMessageName.classList.add("chat-message-name", data.tourney.chat[i].team)
            chatMessageName.textContent = data.tourney.chat[i].name

            // Message
            const chatMessageContent = document.createElement("div")
            chatMessageContent.classList.add("chat-message-content")
            chatMessageContent.innerText = data.tourney.chat[i].message

            chatMessageContainer.append(chatMessageName, chatMessageContent)
            fragment.append(chatMessageContainer)
        }

        chatDisplayContainerEl.append(fragment)
        chatLen = data.tourney.chat.length
        chatDisplayContainerEl.scrollTop = chatDisplayContainerEl.scrollHeight
    }
}