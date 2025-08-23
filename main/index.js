// Title
const titleEl = document.getElementById("title")
let allBeatmaps
async function getBeatmaps() {
    const response = await axios.get("../_data/beatmaps.json")
    titleEl.setAttribute("src", `../_shared/assets/titles/${response.data.roundName}-match.png`)
    allBeatmaps = response.data.beatmaps
}
getBeatmaps()
// Find Beatmaps
const findBeatmaps = beatmapId => allBeatmaps.find(beatmap => Number(beatmap.beatmap_id) === Number(beatmapId))

// Player names
const playerNameLeftEl = document.getElementById("player-name-left")
const playerNameRightEl = document.getElementById("player-name-right")
let currentPlayerNameLeft, currentPlayerNameRight

// Player Info
let allPlayers
async function getPlayers() {
    const response = await axios.get("../_data/players.json")
    allPlayers = response.data
}
getPlayers()

// Player Seed
const playerSeedLeftEl = document.getElementById("player-seed-left")
const playerSeedRightEl = document.getElementById("player-seed-right")
const findPlayerSeed = playerId => allPlayers.find(player => player.playerId === playerId)
let currentPlayerLeftId, currentPlayerRightId

// Player Star Container
const playerStarContainerLeftEl = document.getElementById("player-star-container-left")
const playerStarContainerRightEl = document.getElementById("player-star-container-right")
let currentBestOf, currentFirstTo, currentStarLeft, currentStarRight

// Now Playing
const nowPlayingBackgroundEl = document.getElementById("now-playing-background")
const nowPlayingTitleEl = document.getElementById("now-playing-title")
const nowPlayingArtistEl = document.getElementById("now-playing-artist")
const nowPlayingModEl = document.getElementById("now-playing-mod")
const nowPlayingSrEl = document.getElementById("now-playing-sr")
const nowPlayingBpmEl = document.getElementById("now-playing-bpm")
const nowPlayingCsEl = document.getElementById("now-playing-cs")
const nowPlayingArEl = document.getElementById("now-playing-ar")
let currentId, currentChecksum, currentMappoolBeatmap
// Now Playing Timeline Information
const nowPlayingTimelineForegroundEl = document.getElementById("now-playing-timeline-foreground")
const nowPlayingTimelineCircleEl = document.getElementById("now-playing-timeline-circle")
const nowPlayingCurrentTimeEl = document.getElementById("now-playing-current-time")
const nowPlayingEndTimeEl = document.getElementById("now-playing-end-time")

// Profile Pictures
const profilePictureLeftEl = document.getElementById("profile-picture-left")
const profilePictureRightEl = document.getElementById("profile-picture-right")
let currentPlayerId1, currentPlayerId2

// UR
const playerUrLeftEl = document.getElementById("player-ur-left")
const playerUrRightEl = document.getElementById("player-ur-right")
// PP
const playerPpLeftEl = document.getElementById("player-pp-left")
const playerPpRightEl = document.getElementById("player-pp-right")
// Hit Counts
const playerHitCount100LeftEl = document.getElementById("player-hit-count-100-left")
const playerHitCount50LeftEl = document.getElementById("player-hit-count-50-left")
const playerHitCountMissLeftEl = document.getElementById("player-hit-count-miss-left")
const playerHitCount100RightEl = document.getElementById("player-hit-count-100-right")
const playerHitCount50RightEl = document.getElementById("player-hit-count-50-right")
const playerHitCountMissRightEl = document.getElementById("player-hit-count-miss-right")
// Acc
const playerAccuracyLeftEl = document.getElementById("player-accuracy-left")
const playerAccuracyRightEl = document.getElementById("player-accuracy-right")
let currentPlayerAccuracyLeft, currentPlayerAccuracyRight
// Player scores
const playerScoreLeftEl = document.getElementById("player-score-left")
const playerScoreRightEl = document.getElementById("player-score-right")
let currentPlayerScoreLeft, currentPlayerScoreRight
// Player score difference
const playerScoreDifferenceLeftEl = document.getElementById("player-score-difference-left")
const playerScoreDifferenceRightEl = document.getElementById("player-score-difference-right")
// Accuracy difference
const accuracyDifferenceLeftEl = document.getElementById("accuracy-difference-left")
const accuracyDifferenceNumberEl = document.getElementById("accuracy-difference-number")
const accuracyDifferenceRightEl = document.getElementById("accuracy-difference-right")

// Score Bar
const playerScoreBarLeftEl = document.getElementById("player-score-bar-left")
const playerScoreBarRightEl = document.getElementById("player-score-bar-right")

// Scores + Score Visible
const scoresEl = document.getElementById("scores")
let isScoreVisible
let isStarVisible

// Animation
const animation = {
    // UR
    "playerUrLeft": new CountUp(playerUrLeftEl, 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "UR"}),
    "playerUrRight": new CountUp(playerUrRightEl, 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "UR"}),
    // PP
    "playerPpLeft": new CountUp(playerPpLeftEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "pp"}),
    "playerPpRight": new CountUp(playerPpRightEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "pp"}),
    // Hit Count
    "playerHitCount100Left": new CountUp(playerHitCount100LeftEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    "playerHitCount50Left": new CountUp(playerHitCount50LeftEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    "playerHitCountMissLeft": new CountUp(playerHitCountMissLeftEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    "playerHitCount100Right": new CountUp(playerHitCount100RightEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    "playerHitCount50Right": new CountUp(playerHitCount50RightEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    "playerHitCountMissRight": new CountUp(playerHitCountMissRightEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    // Acc
    "playerAccuracyLeft": new CountUp(playerAccuracyLeftEl, 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "%" }),
    "playerAccuracyRight": new CountUp(playerAccuracyRightEl, 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "%" }),
    // Player Score
    "playerScoreLeft": new CountUp(playerScoreLeftEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "."}),
    "playerScoreRight": new CountUp(playerScoreRightEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "."}),
    // Player Score Difference
    "playerScoreDifferenceLeft": new CountUp(playerScoreDifferenceLeftEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "."}),
    "playerScoreDifferenceRight": new CountUp(playerScoreDifferenceRightEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: "."}),
    // Accuracy Difference
    "accuracyDifferenceNumber": new CountUp(accuracyDifferenceNumberEl, 0, 0, 2, 0.2, { useEasing: true, useGrouping: true, separator: ",", decimal: ".", suffix: "%" }),
}

// Chat stuff
const chatDisplayEl = document.getElementById("chat-display")
let chatLen = 0

// IPC State
let ipcState

const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)

    // Player Names
    if (currentPlayerNameLeft !== data.tourney.team.left) {
        currentPlayerNameLeft = data.tourney.team.left
        playerNameLeftEl.textContent = currentPlayerNameLeft 
    }
    if (currentPlayerNameRight !== data.tourney.team.right) {
        currentPlayerNameRight = data.tourney.team.right
        playerNameRightEl.textContent = currentPlayerNameRight 
    }

    // Player Seed
    if (currentPlayerLeftId !== data.tourney.clients[0].user.id) {
        currentPlayerLeftId = data.tourney.clients[0].user.id
        const player = findPlayerSeed(currentPlayerLeftId)
        if (player) {
            playerSeedLeftEl.textContent = `#${player.playerSeed}`
        } else {
            playerSeedLeftEl.textContent = ""
        }
    }
    if (currentPlayerRightId !== data.tourney.clients[1].user.id) {
        currentPlayerRightId = data.tourney.clients[1].user.id
        const player = findPlayerSeed(currentPlayerRightId)
        if (player) {
            playerSeedRightEl.textContent = `#${player.playerSeed}`
        } else {
            playerSeedRightEl.textContent = ""
        }
    }

    // Star Visible
    if (isStarVisible !== data.tourney.starsVisible) {
        isStarVisible = data.tourney.starsVisible

        if (isStarVisible) {
            playerStarContainerLeftEl.style.display = "flex"
            playerStarContainerRightEl.style.display = "flex"
        } else {
            playerStarContainerLeftEl.style.display = "none"
            playerStarContainerRightEl.style.display = "none"
        }
    }

    // Player Star Container
    if (currentBestOf !== data.tourney.bestOF ||
        currentStarLeft !== data.tourney.points.left ||
        currentStarRight !== data.tourney.points.right
    ) {
        currentBestOf = data.tourney.bestOF
        currentFirstTo = Math.ceil(currentBestOf / 2) 
        currentStarLeft = data.tourney.points.left
        currentStarRight = data.tourney.points.right

        playerStarContainerLeftEl.innerHTML = ""
        playerStarContainerRightEl.innerHTML = ""

        for (let i = 0; i < currentFirstTo; i++) {
            // Left Stars
            if (i < currentStarLeft) {
                playerStarContainerLeftEl.append(createStar("fill"))
            } else {
                playerStarContainerLeftEl.append(createStar("empty"))
            }

            // Right Stars
            if (i < currentStarRight) {
                playerStarContainerRightEl.append(createStar("fill"))
            } else {
                playerStarContainerRightEl.append(createStar("empty"))
            }
        }

        // Create star
        function createStar(status) {
            const star = document.createElement("div")
            star.classList.add("player-star", `player-star-${status}`)
            return star
        }
    }

    // Now Playing
    if (currentId !== data.beatmap.id || currentChecksum !== data.beatmap.checksum) {
        currentId = data.beatmap.id
        currentChecksum = data.beatmap.checksum
        currentMappoolBeatmap = findBeatmaps(currentId)

        // Metadata
        const backgroundUrl = data.directPath.beatmapBackground.replace(/\\/g, "/")
        const imagePath = `../../Songs/${backgroundUrl}?a=${Math.random(10000)}`
        nowPlayingBackgroundEl.style.backgroundImage = `url("${imagePath}")`
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
            nowPlayingBackgroundEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            nowPlayingTimelineForegroundEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            nowPlayingTimelineCircleEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            nowPlayingTimelineCircleEl.style.borderColor = `rgb(${borderColor.join(",")})`
        
            // Set end time
            let mp3Length = data.beatmap.time.mp3Length
            if (currentMappoolBeatmap && currentMappoolBeatmap.mod === "DT") mp3Length /= 1.5
            nowPlayingEndTimeEl.textContent = setLengthDisplay(Math.round(mp3Length / 1000))
        }
        
        if (currentMappoolBeatmap) {
            nowPlayingModEl.style.display = "block"
            nowPlayingModEl.setAttribute("src", `../_shared/assets/mods/${currentMappoolBeatmap.mod.toLowerCase()}${currentMappoolBeatmap.order}.png`)

            let cs = Number(currentMappoolBeatmap.diff_size)
            let ar = Number(currentMappoolBeatmap.diff_approach)
            let bpm = Number(currentMappoolBeatmap.bpm)

            if (currentMappoolBeatmap.mod.includes("HR")) {
                cs = Math.min(Math.round(cs * 1.3 * 10) / 10, 10)
                ar = Math.min(Math.round(ar * 1.4 * 10) / 10, 10)
            }
            if (currentMappoolBeatmap.mod.includes("DT")) {
                if (ar > 5) ar = Math.round((((1200 - (( 1200 - (ar - 5) * 150) * 2 / 3)) / 150) + 5) * 10) / 10
                else ar = Math.round((1800 - ((1800 - ar * 120) * 2 / 3)) / 120 * 10) / 10
                bpm = Math.round(bpm * 1.5)
            }

            // Set Stats
            nowPlayingSrEl.textContent = `${Number(currentMappoolBeatmap.difficultyrating).toFixed(2)}*`
            nowPlayingBpmEl.textContent = bpm
            nowPlayingCsEl.textContent = cs
            nowPlayingArEl.textContent = ar

            // Title
            nowPlayingTitleEl.style.width = "225px"
            nowPlayingArtistEl.style.width = "225px"
        } else {
            nowPlayingModEl.style.display = "none"
            nowPlayingTitleEl.style.width = "298px"
            nowPlayingArtistEl.style.width = "298px"
        }
    }

    if (!currentMappoolBeatmap) {
        nowPlayingSrEl.textContent = `${Number(data.beatmap.stats.stars.total)}*`
        nowPlayingBpmEl.textContent = Number(data.beatmap.stats.bpm.common)
        nowPlayingCsEl.textContent = Number(data.beatmap.stats.cs.converted)
        nowPlayingArEl.textContent = Number(data.beatmap.stats.ar.converted)
    }

    // Set IPC State
    if (ipcState !== data.tourney.ipcState) ipcState = data.tourney.ipcState

    // Set live stuff
    let live = ipcState === 2 ? 0 : data.beatmap.time.live
    if (currentMappoolBeatmap && currentMappoolBeatmap.mod === "DT") live /= 1.5
    nowPlayingCurrentTimeEl.textContent = setLengthDisplay(Math.round(live / 1000))
    const timelineWidth = Math.min(397 * data.beatmap.time.live / data.beatmap.time.mp3Length, 397)
    nowPlayingTimelineForegroundEl.style.width = `${timelineWidth}px`
    nowPlayingTimelineCircleEl.style.left = `${timelineWidth}px`

    // Profile picture
    if (currentPlayerId1 !== data.tourney.clients[0].user.id) {
        currentPlayerId1 = data.tourney.clients[0].user.id
        profilePictureLeftEl.style.backgroundImage = `url("https://a.ppy.sh/${currentPlayerId1}")`
    }
    if (currentPlayerId2 !== data.tourney.clients[1].user.id) {
        currentPlayerId2 = data.tourney.clients[1].user.id
        profilePictureRightEl.style.backgroundImage = `url("https://a.ppy.sh/${currentPlayerId2}")`
    }

    // Update stats
    // UR
    animation.playerUrLeft.update(data.tourney.clients[0].play.unstableRate)
    animation.playerUrRight.update(data.tourney.clients[1].play.unstableRate)
    // PP
    animation.playerPpLeft.update(data.tourney.clients[0].play.pp.current)
    animation.playerPpRight.update(data.tourney.clients[1].play.pp.current)
    // Hit Count
    animation.playerHitCount100Left.update(data.tourney.clients[0].play.hits["100"])
    animation.playerHitCount50Left.update(data.tourney.clients[0].play.hits["50"])
    animation.playerHitCountMissLeft.update(data.tourney.clients[0].play.hits["0"])
    animation.playerHitCount100Right.update(data.tourney.clients[1].play.hits["100"])
    animation.playerHitCount50Right.update(data.tourney.clients[1].play.hits["50"])
    animation.playerHitCountMissRight.update(data.tourney.clients[1].play.hits["0"])
    // Accuracy
    currentPlayerAccuracyLeft = data.tourney.clients[0].play.accuracy
    currentPlayerAccuracyRight = data.tourney.clients[1].play.accuracy
    animation.playerAccuracyLeft.update(currentPlayerAccuracyLeft)
    animation.playerAccuracyRight.update(currentPlayerAccuracyRight)
    // Player Score
    currentPlayerScoreLeft = data.tourney.clients[0].play.score
    currentPlayerScoreRight = data.tourney.clients[1].play.score
    animation.playerScoreLeft.update(currentPlayerScoreLeft)
    animation.playerScoreRight.update(currentPlayerScoreRight)
    // Player Score Difference
    let scoreDifference = Math.abs(data.tourney.clients[0].play.score - data.tourney.clients[1].play.score)
    animation.playerScoreDifferenceLeft.update(-scoreDifference)
    animation.playerScoreDifferenceRight.update(-scoreDifference)
    // Accuracy
    animation.accuracyDifferenceNumber.update(Math.abs(data.tourney.clients[0].play.accuracy - data.tourney.clients[1].play.accuracy))

    // Score bar width
    let movingScoreBarDifferencePercent = Math.min(scoreDifference / 300000, 1)
    let movingScoreBarRectangleWidth = Math.min(Math.pow(movingScoreBarDifferencePercent, 0.5) * 400, 400)

    // Conditions for score
    if (currentPlayerScoreLeft > currentPlayerScoreRight) {
        // Score
        playerScoreLeftEl.classList.add("player-score-leading")
        playerScoreRightEl.classList.remove("player-score-leading")

        // Score differnece
        playerScoreDifferenceLeftEl.style.display = "none"
        playerScoreDifferenceRightEl.style.display = "block"

        // Score bar
        playerScoreBarLeftEl.style.width = `${movingScoreBarRectangleWidth}px`
        playerScoreBarRightEl.style.width = `0px`
    } else if (currentPlayerScoreLeft < currentPlayerScoreRight) {
        // Score
        playerScoreLeftEl.classList.remove("player-score-leading")
        playerScoreRightEl.classList.add("player-score-leading")

        // Score differnece
        playerScoreDifferenceLeftEl.style.display = "block"
        playerScoreDifferenceRightEl.style.display = "none"

        // Score bar
        playerScoreBarLeftEl.style.width = `0px`
        playerScoreBarRightEl.style.width = `${movingScoreBarRectangleWidth}px`
    } else if (currentPlayerScoreLeft === currentPlayerScoreRight) {
        // Score
        playerScoreLeftEl.classList.remove("player-score-leading")
        playerScoreRightEl.classList.remove("player-score-leading")

        // Score differnece
        playerScoreDifferenceLeftEl.style.display = "none"
        playerScoreDifferenceRightEl.style.display = "none"

        // Score bar
        playerScoreBarLeftEl.style.width = `0px`
        playerScoreBarRightEl.style.width = `0px`
    }

    // Conditions for accuracy
    if (currentPlayerAccuracyLeft > currentPlayerAccuracyRight) {
        accuracyDifferenceLeftEl.textContent = "+"
        accuracyDifferenceRightEl.textContent = "-"
    } else if (currentPlayerAccuracyLeft < currentPlayerAccuracyRight) {
        accuracyDifferenceLeftEl.textContent = "-"
        accuracyDifferenceRightEl.textContent = "+"
    } else if (currentPlayerAccuracyLeft === currentPlayerAccuracyRight) {
        accuracyDifferenceLeftEl.textContent = ""
        accuracyDifferenceRightEl.textContent = "" 
    }

    // This is also mostly taken from Victim Crasher: https://github.com/VictimCrasher/static/tree/master/WaveTournament
    if (chatLen !== data.tourney.chat.length) {
        (chatLen === 0 || chatLen > data.tourney.chat.length) ? (chatDisplayEl.innerHTML = "", chatLen = 0) : null
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

        chatDisplayEl.append(fragment)
        chatLen = data.tourney.chat.length
        chatDisplayEl.scrollTop = chatDisplayEl.scrollHeight
    }

    // Score Visibility
    if (isScoreVisible !== data.tourney.scoreVisible) {
        isScoreVisible = data.tourney.scoreVisible
        if (isScoreVisible) {
            scoresEl.style.opacity = 1
            chatDisplayEl.style.opacity = 0
        } else {
            scoresEl.style.opacity = 0
            chatDisplayEl.style.opacity = 1
        }
    }
}