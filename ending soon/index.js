// Set round
const roundNameEl = document.getElementById("round-name")
const matchTypeEl = document.getElementById("match-type")
const currentStreamEl = document.getElementById("current-stream")
const setIdleTitle = () => currentStreamEl.setAttribute("src", `static/idle-icons/${matchTypeEl.value}-${roundNameEl.value}.png`)

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

        // Set end time
        songEndTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.mp3Length / 1000))
    }

    // Get time
    songCurrentTimeEl.textContent = setLengthDisplay(Math.round(data.beatmap.time.live / 1000))
    const timelineWidth = 427 * data.beatmap.time.live / data.beatmap.time.mp3Length
    songTimelineForegroundEl.style.width = `${timelineWidth}px`
    songTimelineCircleEl.style.left = `${timelineWidth}px`
}