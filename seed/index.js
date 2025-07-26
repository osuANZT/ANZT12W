// Get seeding information
let allTeams = []
async function getAllTeams() {
    const response = await fetch("../_data/qualifier-results.json")
    allTeams = await response.json()
    allTeams = allTeams.sort((a, b) => b.seed - a.seed)

    // Display first team
    displayTeam()
}
getAllTeams()