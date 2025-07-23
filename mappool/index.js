// Get beatmap information
const roundLogoEl = document.getElementById("round-logo")
let allBeatmaps
async function getBeatmaps() {
    const response = await axios.get("../_data/beatmaps.json")
    roundLogoEl.setAttribute("src", `static/round-logos/${response.data.roundName}.png`)
    allBeatmaps = response.data.beatmaps

    for (let i = 0; i < allBeatmaps.length; i++) {
        const element = document.getElementById(`${allBeatmaps[i].mod.toLowerCase()}-maps-container`)
        element.append(createBeatmapTile(allBeatmaps[i]))
    }
}
getBeatmaps()
// Find Beatmaps
const findBeatmaps = beatmapId => allBeatmaps.find(beatmap => Number(beatmap.beatmap_id) === Number(beatmapId))

// Create beatmap tile
function createBeatmapTile(beatmap) {
    // Map Container
    const mapContainerEl = document.createElement("div")
    mapContainerEl.classList.add("map-container")
    mapContainerEl.dataset.id = beatmap.beatmap_id
    mapContainerEl.setAttribute("id", beatmap.beatmap_id)
    mapContainerEl.addEventListener("mousedown", mapClickEvent)
    mapContainerEl.addEventListener("contextmenu", event => event.preventDefault())

    // Map Container Background
    const mapContainerBackgroundEl = document.createElement("div")
    mapContainerBackgroundEl.classList.add("map-container-background", `map-container-background-${beatmap.mod.toLowerCase()}`)
    
    // Map background Image
    const mapBackgroundImage = document.createElement("div")
    mapBackgroundImage.classList.add("map-background-image")
    mapBackgroundImage.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover.jpg")`
    
    // Map metadata
    const mapMetadata = document.createElement("section")
    mapMetadata.classList.add("map-metadata")
    // Map Title
    const mapTitle = document.createElement("div")
    mapTitle.classList.add("map-title")
    mapTitle.textContent = beatmap.title
    // Map Artist
    const mapArtist = document.createElement("div")
    mapArtist.classList.add("map-artist")
    mapArtist.textContent = beatmap.artist
    mapMetadata.append(mapTitle, mapArtist)

    // Map Mod Icon
    const mapModIcon = document.createElement("img")
    mapModIcon.classList.add("map-mod-icon")
    mapModIcon.setAttribute("src", `../_shared/assets/mods/${beatmap.mod.toLowerCase()}${beatmap.order}.png`)
    
    // Map Overlay
    const mapOverlay = document.createElement("div")
    mapOverlay.classList.add("map-overlay")

    // Map Action Container - Ban
    const mapActionContainerBan = document.createElement("div")
    mapActionContainerBan.classList.add("map-action-container")
    // Ban Image
    const banImage = document.createElement("img")
    mapActionContainerBan.append(banImage)

    // Map Action Container - Pick + Winner
    const mapActionContainerPickWinner = document.createElement("div")
    mapActionContainerPickWinner.classList.add("map-action-container")
    // Pick + Winner Image
    const pickImage = document.createElement("img")
    const winnerImage = document.createElement("img")
    mapActionContainerPickWinner.append(pickImage, winnerImage)

    // Append everything together
    mapContainerEl.append(mapContainerBackgroundEl, mapBackgroundImage, mapMetadata,
        mapModIcon, mapOverlay, mapActionContainerBan, mapActionContainerPickWinner)
    return mapContainerEl
}

// Map Click Event
function mapClickEvent(event) {
    // Figure out whether it is a pick or ban
    const currentMapId = this.dataset.id
    const currentMap = findBeatmaps(currentMapId)
    if (!currentMap) return

    // Team
    let team
    if (event.button === 0) team = "red"
    else if (event.button === 2) team = "blue"
    if (!team) return

    // Action
    let action = "pick"
    if (event.ctrlKey) action = "ban"
    else if (event.altKey) action = "reset"

    if (action === "pick") {
        currentPickedTile = this
        this.children[4].style.display = "block"
        this.children[5].style.display = "none"
        this.children[6].style.display = "flex"
        this.children[6].children[0].setAttribute("src", `static/map-action/${team}-pick.png`)
    } else if (action === "ban") {
        if (currentPickedTile === this) {
            currentPickedTile = undefined
        }
        this.children[4].style.display = "block"
        this.children[5].style.display = "flex"
        this.children[6].style.display = "none"
        this.children[5].children[0].setAttribute("src", `static/map-action/${team}-ban.png`)
        this.children[6].children[1].removeAttribute("src")
    } else if (action === "reset") {
        if (currentPickedTile === this) {
            currentPickedTile = undefined
        }
        this.children[4].style.display = "none"
        this.children[5].style.display = "none"
        this.children[6].style.display = "none"
        this.children[6].children[1].removeAttribute("src")
    }
}

// Player Names
const playerNameLeftEl = document.getElementById("player-name-left")
const playerNameRightEl = document.getElementById("player-name-right")
let currentPlayerNameLeft, currentPlayerNameRight

// Player Star Container
const playerStarContainerLeftEl = document.getElementById("player-star-container-left")
const playerStarContainerRightEl = document.getElementById("player-star-container-right")
let currentBestOf, currentFirstTo, currentStarLeft, currentStarRight

// Chat stuff
const chatDisplayContainerEl = document.getElementById("chat-display-container")
let chatLen = 0

// Now Playing Information
let currentId, currentChecksum, currentMappoolBeatmap, currentPickedTile

// Setting a winner
let ipcState, checkedWinner = false, isStarToggled
let currentLeftScore, currentRightScore

// Socket
const socket = createTosuWsSocket()
socket.onmessage = event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Player names
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

    // Mappool map
    if (currentId !== data.beatmap.id || currentChecksum !== data.beatmap.checksum) {
        currentId = data.beatmap.id
        currentChecksum = data.beatmap.checksum
        currentMappoolBeatmap = findBeatmaps(currentId)

        // Find element
        const element = document.getElementById(currentId)
        
        // Click event
        if (isAutopickToggled && element && (!element.hasAttribute("data-is-autopicked") || element.getAttribute("data-is-autopicked") !== "true")) {
            // Check if autopicked already
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: (currentNextPicker === "red")? 0 : 2
            })
            element.dispatchEvent(event)
            element.setAttribute("data-is-autopicked", "true")

            if (currentNextPicker === "red") setNextPicker("blue")
            else if (currentNextPicker === "blue") setNextPicker("red")
        }
    }

    // Star Toggling
    if (isStarToggled !== data.tourney.starsVisible) {
        isStarToggled = data.tourney.starsVisible
        if (isStarToggled) {
            playerStarContainerLeftEl.style.opacity = 1
            playerStarContainerRightEl.style.opacity = 1
        } else {
            playerStarContainerLeftEl.style.opacity = 0
            playerStarContainerRightEl.style.opacity = 0
        }
    }

    // IPC State
    if (ipcState !== data.tourney.ipcState) {
        ipcState = data.tourney.ipcState
        if (ipcState === 4 && !checkedWinner && currentPickedTile && isStarToggled) {
            checkedWinner = true

            // Set winner
            currentLeftScore = data.tourney.totalScore.left
            currentRightScore = data.tourney.totalScore.right
            let winner = currentLeftScore > currentRightScore ? "red" : currentRightScore > currentLeftScore ? "blue" : ""

            // Set tile
            currentPickedTile.children[6].children[1].setAttribute("src", `static/map-action/${winner}.png`)
        }
    }
}

// Next Picker
const nextPickerEl = document.getElementById("next-picker")
let currentNextPicker = "none"
function setNextPicker(pickerTeam) {
    currentNextPicker = pickerTeam
    nextPickerEl.textContent = pickerTeam === "red" ? "Red" : "Blue"
}

// Toggle Autopick
const toggleAutopickEl = document.getElementById("toggle-autopick")
let isAutopickToggled = false
function toggleAutopick() {
    isAutopickToggled = !isAutopickToggled
    toggleAutopickEl.textContent = `TOGGLE AUTOPICK: ${isAutopickToggled? "ON": "OFF"}`
}

// Toggle Animation
const toggleAnimaionEl = document.getElementById("toggle-animation")
let isAnimationToggled = false
function toggleAnimation() {
    isAnimationToggled = !isAnimationToggled
    toggleAnimaionEl.textContent = `TOGGLE ANIMATION: ${isAnimationToggled? "ON": "OFF"}`
}