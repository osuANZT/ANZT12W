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

// Create beatmap tile
function createBeatmapTile(beatmap) {
    // Map Container
    const mapContainerEl = document.createElement("div")
    mapContainerEl.classList.add("map-container")

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

// Player Names
const playerNameLeftEl = document.getElementById("player-name-left")
const playerNameRightEl = document.getElementById("player-name-right")
let currentPlayerNameLeft, currentPlayerNameRight

// Player Star Container
const playerStarContainerLeftEl = document.getElementById("player-star-container-left")
const playerStarContainerRightEl = document.getElementById("player-star-container-right")
let currentBestOf, currentFirstTo, currentStarLeft, currentStarRight

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
}