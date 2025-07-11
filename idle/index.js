// Set round
const roundNameEl = document.getElementById("round-name")
const matchTypeEl = document.getElementById("match-type")
const currentStreamEl = document.getElementById("current-stream")
const setIdleTitle = () => currentStreamEl.setAttribute("src", `static/idle-icons/${matchTypeEl.value}-${roundNameEl.value}.png`)

// Now Playing Information
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
        songNameEl.textContent = data.beatmap.title
        songArtistEl.textContent = data.beatmap.artist
    }
}