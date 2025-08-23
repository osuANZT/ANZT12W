// Load players
let allPlayers
async function getPlayers() {
    const response = await axios.get("../_data/players.json")
    allPlayers = response.data
}
getPlayers()

// Get beatmap information
const roundLogoEl = document.getElementById("title")
async function getBeatmaps() {
    const response = await axios.get("../_data/beatmaps.json")
    roundLogoEl.setAttribute("src", `../_shared/assets/titles/${response.data.roundName}-match.png`)
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

// Now playing information
const nowPlayingSongBackgroundEl = document.getElementById("now-playing-song-background")
const nowPlayingTitleEl = document.getElementById("now-playing-title")
const nowPlayingArtistEl = document.getElementById("now-playing-artist")
let currentId, currentChecksum
// Now Playing Timeline Information
const nowPlayingTimelineForegroundEl = document.getElementById("now-playing-timeline-foreground")
const nowPlayingTimelineCircleEl = document.getElementById("now-playing-timeline-circle")
const nowPlayingCurrentTimeEl = document.getElementById("now-playing-current-time")
const nowPlayingEndTimeEl = document.getElementById("now-playing-end-time")

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

    // Now playing information
    if (currentId !== data.beatmap.id && currentChecksum !== data.beatmap.checksum) {
        currentId = data.beatmap.id
        currentChecksum = data.beatmap.checksum

        const backgroundUrl = data.directPath.beatmapBackground.replace(/\\/g, "/")
        const imagePath = `../../Songs/${backgroundUrl}?a=${Math.random(10000)}`
        nowPlayingSongBackgroundEl.style.backgroundImage = `url("${imagePath}")`
        nowPlayingTitleEl.textContent = data.beatmap.title
        nowPlayingArtistEl.textContent = data.beatmap.artist

        // Get dominant colour
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imagePath

        img.onload = function () {
            // Get base colour
            const colorThief = new ColorThief()
            const baseColor = colorThief.getColor(img)

            // Get scaled colour based on baseColor
            let scaledColor = baseColor
            let multiplier = 1
            while (scaledColor.reduce((a, b) => a + b, 0) < 500) {
                multiplier += 0.1
                scaledColor = baseColor.map(c => c * multiplier)
            }
            const borderColor = scaledColor.map(c => Math.round(c * 0.8))

            // Set backgrounds / borders
            nowPlayingSongBackgroundEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            nowPlayingTimelineForegroundEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            nowPlayingTimelineCircleEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            nowPlayingTimelineCircleEl.style.borderColor = `rgb(${borderColor.join(",")})`
        
            // Set end time
            nowPlayingEndTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.mp3Length / 1000))
        }
    }

    nowPlayingCurrentTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.live / 1000))
    const timelineWidth = 298 * data.beatmap.time.live / data.beatmap.time.mp3Length
    nowPlayingTimelineForegroundEl.style.width = `${timelineWidth}px`
    nowPlayingTimelineCircleEl.style.left = `${timelineWidth}px`
}

// Averages
const leftAverageScoreEl = document.getElementById("left-average-score")
const leftAverageAccEl = document.getElementById("left-average-acc")
const rightAverageScoreEl = document.getElementById("right-average-score")
const rightAverageAccEl = document.getElementById("right-average-acc")

setInterval(() => {
    const leftAvgScore = Number(getCookie("leftAvgScore"))
    const leftAvgAcc = Number(getCookie("leftAvgAcc"))
    const rightAvgScore = Number(getCookie("rightAvgScore"))
    const rightAvgAcc = Number(getCookie("rightAvgAcc"))


    leftAverageScoreEl.textContent = leftAvgScore.toLocaleString(undefined, { maximumFractionDigits: 0 })
    leftAverageAccEl.textContent = `${(leftAvgAcc * 100).toFixed(2)}%`
    rightAverageScoreEl.textContent = rightAvgScore.toLocaleString(undefined, { maximumFractionDigits: 0 })
    rightAverageAccEl.textContent = `${(rightAvgAcc * 100).toFixed(2)}%`
}, 200)