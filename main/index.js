// Title
const titleEl = document.getElementById("title")
let allBeatmaps
async function getBeatmaps() {
    const response = await axios.get("../_data/beatmaps.json")
    titleEl.setAttribute("src", `static/titles/${response.data.roundName}-match.png`)
    allBeatmaps = response.data.beatmaps
}
getBeatmaps()
// Find Beatmaps
const findBeatmaps = beatmapId => allBeatmaps.find(beatmap => Number(beatmap.beatmap_id) === Number(beatmapId))

// Player names
const playerNameLeftEl = document.getElementById("player-name-left")
const playerNameRightEl = document.getElementById("player-name-right")
let currentPlayerNameLeft, currentPlayerNameRight

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

const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Player Names
    if (currentPlayerNameLeft !== data.tourney.team.left) {
        currentPlayerNameLeft = data.tourney.team.left
        playerNameLeftEl.textContent = currentPlayerNameLeft 
    }
    if (currentPlayerNameRight !== data.tourney.team.right) {
        currentPlayerNameRight = data.tourney.team.right
        playerNameRightEl.textContent = currentPlayerNameRight 
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
            nowPlayingEndTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.mp3Length / 1000))
        }
        
        if (currentMappoolBeatmap) {
            nowPlayingModEl.style.display = "block"
            nowPlayingModEl.setAttribute("src", `../_shared/assets/mods/${currentMappoolBeatmap.mods.toLowerCase()}${currentMappoolBeatmap.order}.png`)

            let cs = Number(currentMappoolBeatmap.diff_size)
            let ar = Number(currentMappoolBeatmap.diff_approach)
            let bpm = Number(currentMappoolBeatmap.bpm)

            if (currentBeatmap.mod.includes("HR")) {
                cs = Math.min(Math.round(cs * 1.3 * 10) / 10, 10)
                ar = Math.min(Math.round(ar * 1.4 * 10) / 10, 10)
            }
            if (currentBeatmap.mod.includes("DT")) {
                if (ar > 5) ar = Math.round((((1200 - (( 1200 - (ar - 5) * 150) * 2 / 3)) / 150) + 5) * 10) / 10
                else ar = Math.round((1800 - ((1800 - ar * 120) * 2 / 3)) / 120 * 10) / 10
                bpm = Math.round(bpm * 1.5)
            }

            // Set Stats
            nowPlayingSrEl.textContent = Number(currentMappoolBeatmap.difficultyrating).toFixed(2)
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

    nowPlayingCurrentTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.live / 1000))
    const timelineWidth = 298 * data.beatmap.time.live / data.beatmap.time.mp3Length
    nowPlayingTimelineForegroundEl.style.width = `${timelineWidth}px`
    nowPlayingTimelineCircleEl.style.left = `${timelineWidth}px`
}