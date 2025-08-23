// Get osu! API
let osuApi
async function getOsuApi() {
    const response = await fetch("../_data/osu-api.json")
    const responseJson = await response.json()
    osuApi = responseJson.api
}
getOsuApi()

// Load players
let allPlayers
let playerIdLeft, playerIdRight
async function getPlayers() {
    const response = await axios.get("../_data/players.json")
    allPlayers = response.data
}
getPlayers()
// Find Player
const findPlayer = playerName => allPlayers.find(player => player.playerName.toLowerCase() === playerName.toLowerCase())

// Get beatmap information
const roundLogoEl = document.getElementById("round-logo")
let allBeatmaps
async function getBeatmaps() {
    const response = await axios.get("../_data/beatmaps.json")
    roundLogoEl.setAttribute("src", `static/round-logos/${response.data.roundName}.png`)
    allBeatmaps = response.data.beatmaps

    for (let i = 0; i < allBeatmaps.length; i++) {
        if (allBeatmaps[i].mod.includes("NM")) {
            if (allBeatmaps[i].order <= 4) {
                const element = document.getElementById(`${allBeatmaps[i].mod.toLowerCase()}-1-maps-container`)
                element.append(createBeatmapTile(allBeatmaps[i]))
            } else {
                const element = document.getElementById(`${allBeatmaps[i].mod.toLowerCase()}-2-maps-container`)
                element.append(createBeatmapTile(allBeatmaps[i]))
            }
        } else {
            const element = document.getElementById(`${allBeatmaps[i].mod.toLowerCase()}-maps-container`)
            element.append(createBeatmapTile(allBeatmaps[i]))
        }
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

// Panel Details
const panelEl = document.getElementById("panel")
const panelBackgroundEl = document.getElementById("panel-background")
const panelModIdEl = document.getElementById("panel-mod-id")
const panelTitleEl = document.getElementById("panel-title")
const panelArtistEl = document.getElementById("panel-artist")
const panelDifficultyEl = document.getElementById("panel-difficulty")
const panelMapperEl = document.getElementById("panel-mapper")
const panelLengthEl = document.getElementById("panel-length")
const panelBpmEl = document.getElementById("panel-bpm")
const panelCsEl = document.getElementById("panel-cs")
const panelArEl = document.getElementById("panel-ar")
const panelSrEl = document.getElementById("panel-sr")

// Select Map
const selectMapEl = document.getElementById("select-map")

// Map Click Event
async function mapClickEvent(event) {
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
        // Normal tile stuff
        currentPickedTile = this
        this.children[4].style.display = "block"
        this.children[5].style.display = "none"
        this.children[6].style.display = "flex"
        this.children[6].children[0].setAttribute("src", `static/map-action/${team}-pick.png`)

        // Add to be able to select winner
        if (!document.getElementById(`${currentMapId}-option`)) {
            const mapOption = document.createElement("option")
            mapOption.textContent = `${currentMap.mod}${currentMap.order}`
            mapOption.id = `${currentMapId}-option`
            mapOption.setAttribute("value", currentMapId)
            selectMapEl.append(mapOption)
            selectMapEl.setAttribute("size", `${Math.max(selectMapEl.childElementCount, 2)}`)
        }

        // Animation
        if (isAnimationToggled) {
            // Calculate stats
            let len = Number(currentMap.hit_length)
            let bpm = Number(currentMap.bpm)
            let cs = Number(currentMap.diff_size)
            let ar = Number(currentMap.diff_approach)

            if (currentMap.mod.includes("HR")) {
                cs = Math.min(Math.round(cs * 1.3 * 10) / 10, 10)
                ar = Math.min(Math.round(ar * 1.4 * 10) / 10, 10)
            }
            if (currentMap.mod.includes("DT")) {
                if (ar > 5) ar = Math.round((((1200 - (( 1200 - (ar - 5) * 150) * 2 / 3)) / 150) + 5) * 10) / 10
                else ar = Math.round((1800 - ((1800 - ar * 120) * 2 / 3)) / 120 * 10) / 10
                bpm = Math.round(bpm * 1.5)
                len = Math.round(len / 1.5)
            }

            // Set details
            panelBackgroundEl.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${currentMap.beatmapset_id}/covers/cover.jpg")`
            panelModIdEl.setAttribute("src", `../_shared/assets/mods/${currentMap.mod.toLowerCase()}${currentMap.order}.png`)
            panelTitleEl.textContent = currentMap.title
            panelArtistEl.textContent = currentMap.artist
            panelDifficultyEl.textContent = `[${currentMap.version}]`
            panelMapperEl.textContent = currentMap.creator
            panelSrEl.textContent = `${Number(currentMap.difficultyrating).toFixed(2)}*`
            panelLengthEl.textContent = setLengthDisplay(len)
            panelBpmEl.textContent = bpm
            panelCsEl.textContent = cs.toFixed(1)
            panelArEl.textContent = ar.toFixed(1)

            // Animation
            panelEl.style.display = "block"
            await delay(100)
            panelEl.style.opacity = 1
            await delay(5000)
            panelEl.style.opacity = 0
            await delay(500)
            panelEl.style.display = "none"
        }
    } else if (action === "ban") {
        if (currentPickedTile === this) {
            currentPickedTile = undefined
        }
        this.children[4].style.display = "block"
        this.children[5].style.display = "flex"
        this.children[6].style.display = "none"
        this.children[5].children[0].setAttribute("src", `static/map-action/${team}-ban.png`)
        this.children[6].children[1].removeAttribute("src")

        // Remove mappool winner override option if available
        removeMappoolWinnerOverrideOption(currentMapId)
    } else if (action === "reset") {
        if (currentPickedTile === this) {
            currentPickedTile = undefined
        }
        this.children[4].style.display = "none"
        this.children[5].style.display = "none"
        this.children[6].style.display = "none"
        this.children[6].children[1].removeAttribute("src")

        // Remove mappool winner override option if available
        removeMappoolWinnerOverrideOption(currentMapId)
    }
}

// Remove mappool winner override option if available
function removeMappoolWinnerOverrideOption(id) {
    const currentOption = document.getElementById(`${id}-option`)
    if (currentOption) currentOption.remove()
}

// Set Winner from Mappool Winner Override
const selectWinnerEl = document.getElementById("select-winner")
function setWinnerMappoolWinnerOverride() {
    if (!selectMapEl.value || !selectWinnerEl.value) return
    
    // Find element
    const element = document.getElementById(selectMapEl.value.split("-")[0])
    if (!element) return

    if (selectWinnerEl.value !== "none") {
        element.children[6].children[1].setAttribute("src", `static/map-action/${selectWinnerEl.value}-win.png`)
    } else {
        element.children[6].children[1].removeAttribute("src")
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
socket.onmessage = async event => {
    const data = JSON.parse(event.data)
    console.log(data)

    // Player names
    if (currentPlayerNameLeft !== data.tourney.team.left) {
        currentPlayerNameLeft = data.tourney.team.left
        playerNameLeftEl.textContent = currentPlayerNameLeft

        // Get player object
        const player = findPlayer(currentPlayerNameLeft)
        if (player) playerIdLeft = player.playerId
    }
    if (currentPlayerNameRight !== data.tourney.team.right) {
        currentPlayerNameRight = data.tourney.team.right
        playerNameRightEl.textContent = currentPlayerNameRight

        // Get player object
        const player = findPlayer(currentPlayerNameRight)
        if (player) playerIdRight = player.playerId
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

            // If map is picked
            await delay(5600)
            if (enableAutoAdvance && isStarToggled) {
                obsGetCurrentScene((currentScene) => {
                    if (currentScene.name === gameplay_scene_name) return
                    obsSetCurrentScene(gameplay_scene_name)
                })
            }
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
            currentPickedTile.children[6].children[1].setAttribute("src", `static/map-action/${winner}-win.png`)

            // Delay 10 sedconds
            await delay(10000)
            if (enableAutoAdvance && isStarToggled && (currentStarLeft === currentFirstTo || currentStarRight === currentFirstTo)) {
                obsGetCurrentScene((currentScene) => {
                    if (currentScene.name === winner_scene_name) return
                    obsSetCurrentScene(winner_scene_name)
                })
            } else if (enableAutoAdvance && isStarToggled) {
                obsGetCurrentScene((currentScene) => {
                    if (currentScene.name === mappool_scene_name) return
                    obsSetCurrentScene(mappool_scene_name)
                })
            }
            setWinScreenStats()
        } else if (ipcState !== 4) {
            checkedWinner = false

            if (ipcState === 2 || ipcState === 3) {
                obsGetCurrentScene((currentScene) => {
                    if (currentScene.name === gameplay_scene_name) return
                    obsSetCurrentScene(gameplay_scene_name)
                })
            }
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
    toggleAutopickEl.textContent = `Toggle Autopick: ${isAutopickToggled? "ON": "OFF"}`
    toggleAutopickEl.classList.remove(`toggle-${isAutopickToggled? "in" : ""}active`)
    toggleAutopickEl.classList.add(`toggle-${isAutopickToggled? "" : "in"}active`)
}

// Toggle Animation
const toggleAnimaionEl = document.getElementById("toggle-animation")
let isAnimationToggled = false
function toggleAnimation() {
    isAnimationToggled = !isAnimationToggled
    toggleAnimaionEl.textContent = `Toggle Animation: ${isAnimationToggled? "ON": "OFF"}`
    toggleAnimaionEl.classList.remove(`toggle-${isAnimationToggled? "in" : ""}active`)
    toggleAnimaionEl.classList.add(`toggle-${isAnimationToggled? "" : "in"}active`)
}

// MP Link
const mpLinkEl = document.getElementById("mp-link")
let currentMpLink
let leftScores = [], rightScores = [], leftAccs = [], rightAccs = []
let leftAvgScore, leftAvgAcc, rightAvgScore, rightAvgAcc
function setMpLink() {
    currentMpLink = Number(mpLinkEl.value)
    setWinScreenStats()
}

// Set stats
async function setWinScreenStats() {
    const response = await fetch(`https://osu.ppy.sh/api/get_match?k=${osuApi}&mp=${currentMpLink}`)
    const responseJson = await response.json()

    // Reset stuff
    leftScores = []
    rightScores = []
    leftAccs = []
    rightAccs = []

    for (let i = 0 ; i < responseJson.games.length; i++) {
        const currentGame = responseJson.games[i]
        const currentMap = findBeatmaps(currentGame.beatmap_id)

        console.log(currentGame)
        if (currentMap) {
            for (let j = 0; j < currentGame.scores.length; j++) {
                const currentScore = currentGame.scores[j]
                // Acc scoring method
                const totalNotes = Number(currentGame.scores[j].countmiss) + Number(currentGame.scores[j].count50) + 
                    Number(currentGame.scores[j].count100) + Number(currentGame.scores[j].count300) +
                    Number(currentGame.scores[j].countgeki) + Number(currentGame.scores[j].countkatu)
                
                // Set score and acc
                let score = Number(currentScore.score)
                let acc = (Number(currentScore.countmiss) * 0 + Number(currentScore.count50) * 1 / 6 +
                            Number(currentScore.count100) * 1 / 3 + Number(currentScore.count300) +
                            Number(currentScore.countgeki) + Number(currentScore.countkatu) * 1 / 3) / totalNotes
                if (totalNotes === 0) acc = 0

                // Apply restrictions to each mod
                if (getMods(Number(currentGame.scores[j].enabled_mods)).includes("HR")) score /= 1.1
                if (getMods(Number(currentGame.scores[j].enabled_mods)).includes("HD")) score /= 1.06
                if (getMods(Number(currentGame.scores[j].enabled_mods)).includes("DT")) score /= 1.2

                // Add for each team
                if (currentScore.user_id == playerIdLeft) {
                    leftScores.push(score)
                    leftAccs.push(acc)
                } else if (currentScore.user_id == playerIdRight) {
                    rightScores.push(score)
                    rightAccs.push(acc)
                }
            }
        }
    }

    // Set averages
    const getAverage = array => array.reduce((acc, val) => acc + val, 0) / array.length
    const leftAvgScore = getAverage(leftScores)
    const leftAvgAcc = getAverage(leftAccs)
    const rightAvgScore = getAverage(rightScores)
    const rightAvgAcc = getAverage(rightAccs)

    document.cookie = `leftAvgScore=${leftAvgScore}; path=/`
    document.cookie = `leftAvgAcc=${leftAvgAcc}; path=/`
    document.cookie = `rightAvgScore=${rightAvgScore}; path=/`
    document.cookie = `rightAvgAcc=${rightAvgAcc}; path=/`
}

document.cookie = `leftAvgScore=0; path=/`
document.cookie = `leftAvgAcc=0; path=/`
document.cookie = `rightAvgScore=0; path=/`
document.cookie = `rightAvgAcc=0; path=/`

// OBS Information
const sceneCollection = document.getElementById("sceneCollection")
let autoadvance_button = document.getElementById('auto-advance-button')
let autoadvance_timer_label = document.getElementById('autoAdvanceTimerLabel')
const pick_to_transition_delay_ms = 10000
let enableAutoAdvance = false
const gameplay_scene_name = "Gameplay"
const mappool_scene_name = "Mappool"
const winner_scene_name = "Winner"

let sceneTransitionTimeoutID

function switchAutoAdvance() {
    enableAutoAdvance = !enableAutoAdvance
    if (enableAutoAdvance) {
        autoadvance_button.innerText = 'AUTO ADVANCE: ON'
        autoadvance_button.classList.add("toggle-active")
        autoadvance_button.classList.remove("toggle-inactive")
    } else {
        autoadvance_button.innerText = 'AUTO ADVANCE: OFF'
        autoadvance_button.classList.remove("toggle-active")
        autoadvance_button.classList.add("toggle-inactive")
    }
}

const obsGetCurrentScene = window.obsstudio?.getCurrentScene ?? (() => {})
const obsGetScenes = window.obsstudio?.getScenes ?? (() => {})
const obsSetCurrentScene = window.obsstudio?.setCurrentScene ?? (() => {})

obsGetScenes(scenes => {
    for (const scene of scenes) {
        let clone = document.getElementById("sceneButtonTemplate").content.cloneNode(true)
        let buttonNode = clone.querySelector('button')
        buttonNode.id = `scene__${scene}`
        buttonNode.textContent = `GO TO: ${scene}`
        buttonNode.onclick = function() { obsSetCurrentScene(scene); }
        sceneCollection.appendChild(clone)
    }

    obsGetCurrentScene((scene) => { document.getElementById(`scene__${scene.name}`).classList.add("active-scene") })
})

window.addEventListener('obsSceneChanged', function(event) {
    let activeButton = document.getElementById(`scene__${event.detail.name}`)
    for (const scene of sceneCollection.children) { scene.classList.remove("toggle-active") }
    activeButton.classList.add("toggle-active")
})