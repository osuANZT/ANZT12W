// Get seeding information
let allPlayers = []
async function getallPlayers() {
    const response = await fetch("../_data/qualifier-results.json")
    allPlayers = await response.json()
    allPlayers = allPlayers.sort((a, b) => b.seed - a.seed)

    // Display first team
    displayResults()

    // Preload Images
    preloadImages()
}
getallPlayers()
let playerCounter = 0

// Preload Images
const preloadImagesEl = document.getElementById("preload-images")
function preloadImages() {
    for (let i = 0; i < allPlayers.length; i++) {
        preloadImagesEl.setAttribute("src", `https://a.ppy.sh/${allPlayers[i].playerId}`)
    }
}
// Display Player Information
const profilePictureEl = document.getElementById("profile-picture")
const playerSeedEl = document.getElementById("player-seed")
const playerNameEl = document.getElementById("player-name")

// Mod Rank
const resultsModRankNmEl = document.getElementById("results-mod-rank-nm")
const resultsModRankHdEl = document.getElementById("results-mod-rank-hd")
const resultsModRankHrEl = document.getElementById("results-mod-rank-hr")
const resultsModRankDtEl = document.getElementById("results-mod-rank-dt")

// Mod scores
const resultsContainerNmEl = document.getElementById("results-container-nm")
const resultsContainerHdEl = document.getElementById("results-container-hd")
const resultsContainerHrEl = document.getElementById("results-container-hr")
const resultsContainerDtEl = document.getElementById("results-container-dt")

// Display Results
function displayResults() {
    // Current Team
    const currentTeam = allPlayers[playerCounter]

    // Player Details
    playerNameEl.textContent = currentTeam.playerName
    profilePictureEl.style.backgroundImage = `url("https://a.ppy.sh/${currentTeam.playerId}")`
    playerSeedEl.textContent = `#${currentTeam.seed}`

    // Display mod ranks
    displayModRank(resultsModRankNmEl, currentTeam.nmTotalRank)
    displayModRank(resultsModRankHdEl, currentTeam.hdTotalRank)
    displayModRank(resultsModRankHrEl, currentTeam.hrTotalRank)
    displayModRank(resultsModRankDtEl, currentTeam.dtTotalRank)

    // Display map results
    // NM
    displayMapResults(resultsContainerNmEl.children[0], currentTeam.nm1Rank, currentTeam.nm1Score)
    displayMapResults(resultsContainerNmEl.children[1], currentTeam.nm2Rank, currentTeam.nm2Score)
    displayMapResults(resultsContainerNmEl.children[2], currentTeam.nm3Rank, currentTeam.nm3Score)
    displayMapResults(resultsContainerNmEl.children[3], currentTeam.nm4Rank, currentTeam.nm4Score)
    // HD
    displayMapResults(resultsContainerHdEl.children[0], currentTeam.hd1Rank, currentTeam.hd1Score)
    displayMapResults(resultsContainerHdEl.children[1], currentTeam.hd2Rank, currentTeam.hd2Score)
    displayMapResults(resultsContainerHdEl.children[2], currentTeam.hd3Rank, currentTeam.hd3Score)
    // HR
    displayMapResults(resultsContainerHrEl.children[0], currentTeam.hr1Rank, currentTeam.hr1Score)
    displayMapResults(resultsContainerHrEl.children[1], currentTeam.hr2Rank, currentTeam.hr2Score)
    displayMapResults(resultsContainerHrEl.children[2], currentTeam.hr3Rank, currentTeam.hr3Score)
    // DT
    displayMapResults(resultsContainerDtEl.children[0], currentTeam.dt1Rank, currentTeam.dt1Score)
    displayMapResults(resultsContainerDtEl.children[1], currentTeam.dt2Rank, currentTeam.dt2Score)
    displayMapResults(resultsContainerDtEl.children[2], currentTeam.dt3Rank, currentTeam.dt3Score)
}

// Display mod ranks
function displayModRank(element, rank) {
    element.textContent = `#${rank}`
}

// Display map results
function displayMapResults(element, rank, score) {
    element.children[0].children[2].textContent = `#${rank}`
    element.children[1].textContent = score.toLocaleString()
}

// Show team
function showTeam(direction) {
    playerCounter += direction
    if (playerCounter > allPlayers.length - 1) playerCounter = allPlayers.length - 1
    else if (playerCounter < 0) playerCounter = 0
    displayResults()
}

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