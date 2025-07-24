// Elements
const mainEl = document.getElementById("main")
const dvdLogoEl = document.getElementById("dvd-logo")

// Set initial x/y values
let x = Math.floor(Math.random() * 2186)
let y = Math.floor(Math.random() * 1266)

// Set speeds
// on the off chance that Math.random() * 2 === 2, use -6
const directionOption = [6, -6, -6]
let dx = directionOption[Math.floor(Math.random() * 2)]
let dy = directionOption[Math.floor(Math.random() * 2)]

// Randomise Logo
let logoNo = Math.floor(Math.random() * 8)
dvdLogoEl.setAttribute("src", `static/dvdlogo-0${logoNo % 8 + 1}.svg`)

function animate() {
    const screenWidth = mainEl.getBoundingClientRect().width
    const screenHeight = mainEl.getBoundingClientRect().height
    const dvdWidth = dvdLogoEl.offsetWidth
    const dvdHeight = dvdLogoEl.offsetHeight

    x += dx
    y += dy

    // Bounce off left/right
    if (x <= 0 || x + dvdWidth >= screenWidth) {
        dx *= -1
        changeLogo()
    }

    // Bounce off top/bottom
    if (y <= 0 || y + dvdHeight >= screenHeight) {
        dy *= -1
        changeLogo()
    }

    function changeLogo() {
        logoNo++
        dvdLogoEl.setAttribute("src", `static/dvdlogo-0${logoNo % 8 + 1}.svg`)
    }

    dvdLogoEl.style.left = `${x}px`
    dvdLogoEl.style.top = `${y}px`

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)