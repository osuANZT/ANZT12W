let allBeatmaps
async function getBeatmaps() {
    const response = await axios.get("../_data/showcase-beatmaps.json")
    allBeatmaps = response.data.beatmaps
}
getBeatmaps()
const findBeatmaps = beatmap_string => allBeatmaps.find(beatmap => beatmap.beatmap_string === beatmap_string)

// Gameplay information
const replayerNameEl = document.getElementById("replayer-name")
const mapperNameEl = document.getElementById("mapper-name")
// Now Playing Metadata
const songNameEl = document.getElementById("song-name")
const songArtistEl = document.getElementById("song-artist")
const songDifficultyEl = document.getElementById("song-difficulty")
let currentId, currentChecksum

// Stats
const bpmMumberEl = document.getElementById("bpm-number")
const csMumberEl = document.getElementById("cs-number")
const arMumberEl = document.getElementById("ar-number")
const odMumberEl = document.getElementById("od-number")
const srMumberEl = document.getElementById("sr-number")

// Song Timeline Information
const songTimelineForegroundEl = document.getElementById("song-timeline-foreground")
const songTimelineCircleEl = document.getElementById("song-timeline-circle")
const songCurrentTimeEl = document.getElementById("song-current-time")
const songEndTimeEl = document.getElementById("song-end-time")
let mp3Length, liveTime

// Mod Icon
const modIconEl = document.getElementById("mod-icon")

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)

    if (currentId !== data.beatmap.id || currentChecksum !== data.beatmap.checksum) {
        currentId = data.beatmap.id
        currentChecksum = data.beatmap.checksum

        // Set mod id based on map
        const currentMap = findBeatmaps(`${data.beatmap.artist} - ${data.beatmap.title} [${data.beatmap.version}]`)
        if (currentMap) {
            modIconEl.style.display = "block"
            modIconEl.setAttribute("src", `static/mods/${currentMap.mod}${currentMap.order}.png`)
        } else {
            modIconEl.style.display = "none"
        }

        // Set metadata details
        songNameEl.textContent = data.beatmap.title
        songArtistEl.textContent = data.beatmap.artist
        songDifficultyEl.textContent = data.beatmap.version
        mapperNameEl.textContent = data.beatmap.mapper

        // Set a few timing details
        const backgroundUrl = data.directPath.beatmapBackground.replace(/\\/g, "/")
        const imagePath = `../../Songs/${backgroundUrl}?a=${Math.random(10000)}`

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
            songTimelineForegroundEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            songTimelineCircleEl.style.backgroundColor = `rgb(${scaledColor.join(",")})`
            songTimelineCircleEl.style.borderColor = `rgb(${borderColor.join(",")})`
        }

        // Set end time
        mp3Length = Math.round((data.play.mods.name.includes("DT") ? data.beatmap.time.mp3Length / 3 * 2 : data.beatmap.time.mp3Length) / 1000)
        songEndTimeEl.textContent = setLengthDisplay(mp3Length)
    }

    // Set replayer name
    replayerNameEl.textContent = data.resultsScreen.playerName
    
    // Set stat numbers
    bpmMumberEl.textContent = data.beatmap.stats.bpm.common
    csMumberEl.textContent = data.beatmap.stats.cs.converted
    arMumberEl.textContent = data.beatmap.stats.ar.converted
    odMumberEl.textContent = data.beatmap.stats.od.converted
    srMumberEl.textContent = `${data.beatmap.stats.stars.total}*`

    // Set live time
    let liveTime = Math.round((data.play.mods.name.includes("DT") ? data.beatmap.time.live / 3 * 2 : data.beatmap.time.live) / 1000)
    
    // Get time
    songCurrentTimeEl.textContent = setLengthDisplay(liveTime)
    const timelineWidth = 427 * data.beatmap.time.live / data.beatmap.time.mp3Length
    songTimelineForegroundEl.style.width = `${timelineWidth}px`
    songTimelineCircleEl.style.left = `${timelineWidth}px`
}