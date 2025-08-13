// Set round
const roundNameEl = document.getElementById("round-name")
const matchTypeEl = document.getElementById("match-type")
matchTypeEl.value = getCookie("matchType")
roundNameEl.value = getCookie("roundName")
const currentStreamEl = document.getElementById("current-stream")
const setIdleTitle = () => {
    currentStreamEl.setAttribute("src", `static/idle-icons/${matchTypeEl.value}-${roundNameEl.value}.png`)
    document.cookie = `matchType=${matchTypeEl.value}; path=/`
    document.cookie = `roundName=${roundNameEl.value}; path=/`
}

// Set title
if (matchTypeEl.value && roundNameEl.value) setIdleTitle()

// Now Playing Information
const backgroundImageEl = document.getElementById("background-image")
const songNameEl = document.getElementById("song-name")
const songArtistEl = document.getElementById("song-artist")
let currentId, currentChecksum
// Song Timeline Information
const songTimelineForegroundEl = document.getElementById("song-timeline-foreground")
const songTimelineCircleEl = document.getElementById("song-timeline-circle")
const songCurrentTimeEl = document.getElementById("song-current-time")
const songEndTimeEl = document.getElementById("song-end-time")

// OBS Scene stuff
const obsGetCurrentScene = window.obsstudio?.getCurrentScene ?? (() => {})
const obsGetScenes = window.obsstudio?.getScenes ?? (() => {})
const obsSetCurrentScene = window.obsstudio?.setCurrentScene ?? (() => {})

const currentStatusEl = document.getElementById("current-status")
const obs = new OBSWebSocket()
obs.connect('ws://localhost:4455')
    .then(() => {
        console.log('Connected to OBS')

        return obs.call('GetCurrentProgramScene')
    })
    .then(({ currentProgramSceneName }) => {
        updateStatusImage(currentProgramSceneName)
    })

obs.on('CurrentProgramSceneChanged', data => {
    updateStatusImage(data.sceneName)
})

function updateStatusImage(sceneName) {
    switch (sceneName) {
        case "Starting Soon":
            currentStatusEl.setAttribute("src", "static/status/startingsoon.png")
            break
        case "Ending Soon":
            currentStatusEl.setAttribute("src", "static/status/endingsoon.png")
            break
        case "Intermission":
            currentStatusEl.setAttribute("src", "static/status/intermission.png")
            break
        case "Technical Difficulties":
            currentStatusEl.setAttribute("src", "static/status/technical.png")
            break
    }
}

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    if (currentId !== data.beatmap.id && currentChecksum !== data.beatmap.checksum) {
        currentId = data.beatmap.id
        currentChecksum = data.beatmap.checksum
        const backgroundUrl = data.directPath.beatmapBackground.replace(/\\/g, "/")
        const imagePath = `../../Songs/${backgroundUrl}?a=${Math.random(10000)}`
        backgroundImageEl.style.backgroundImage = `url("${imagePath}")`
        songNameEl.textContent = data.beatmap.title
        songArtistEl.textContent = data.beatmap.artist

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
            backgroundImageEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            songTimelineForegroundEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            songTimelineCircleEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            songTimelineCircleEl.style.borderColor = `rgb(${borderColor.join(",")})`
        }
    }

    // Get time
    songCurrentTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.live / 1000))
    const timelineWidth = 427 * data.beatmap.time.live / data.beatmap.time.mp3Length
    songTimelineForegroundEl.style.width = `${timelineWidth}px`
    songTimelineCircleEl.style.left = `${timelineWidth}px`
    songEndTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.mp3Length / 1000))
}