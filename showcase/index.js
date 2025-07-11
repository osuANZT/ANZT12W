// Gameplay information
const replayerNameEl = document.getElementById("replayer-name")
const mapperNameEl = document.getElementById("mapper-name")

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    replayerNameEl.textContent = data.resultsScreen.playerName
    mapperNameEl.textContent = data.beatmap.mapper
}