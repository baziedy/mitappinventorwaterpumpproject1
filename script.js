let localConnected = false
let apiConnected = false

const localInput = document.getElementById("localId")
const apiInput = document.getElementById("apiId")

const connectButton = document.getElementById("connectButton")
const status = document.getElementById("status")

const localDot = document.getElementById("localDot")
const apiDot = document.getElementById("apiDot")


connectButton.addEventListener("click", connect)


async function connect() {

    const localId = localInput.value.trim()
    const apiId = apiInput.value.trim()

    localConnected = false
    apiConnected = false

    localDot.className = "dot"
    apiDot.className = "dot"

    if (!localId && !apiId) {
        status.textContent = "Enter a Local ID or API ID"
        return
    }

    connectButton.disabled = true
    connectButton.textContent = "Connecting..."

    status.textContent = "Testing connections..."


    // =========================
    // TEST ESP32
    // =========================

    if (localId) {

        try {

            let url = localId

            if (!url.startsWith("http://") &&
                !url.startsWith("https://")) {

                url = "http://" + url
            }

            if (!url.endsWith("/api/status")) {

                url = url.replace(/\/$/, "") + "/api/status"
            }

            console.log("Testing ESP32:", url)

            const response = await fetch(url, {
                method: "GET"
            })

            if (response.ok) {

                const data = await response.json()

                console.log("ESP32 response:", data)

                localConnected = true
                localDot.className = "dot connected"

            } else {

                localDot.className = "dot error"
            }

        } catch (error) {

            console.error("ESP32 connection failed:", error)

            localDot.className = "dot error"
        }
    }


    // =========================
    // TEST API
    // =========================

    if (apiId) {

        try {

            let url = apiId

            if (!url.startsWith("http://") &&
                !url.startsWith("https://")) {

                url = "https://" + url
            }

            console.log("Testing API:", url)

            const response = await fetch(url, {
                method: "GET"
            })

            if (response.ok) {

                apiConnected = true
                apiDot.className = "dot connected"

            } else {

                apiDot.className = "dot error"
            }

        } catch (error) {

            console.error("API connection failed:", error)

            apiDot.className = "dot error"
        }
    }


    // =========================
    // DECIDE WHAT HAPPENS NEXT
    // =========================

    if (localConnected && apiConnected) {

        status.textContent = "Connected to ESP32 and AI API"

        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 700)

    } else if (localConnected) {

        status.textContent = "ESP32 connected — AI API unavailable"

        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 700)

    } else if (apiConnected) {

        status.textContent = "AI API connected — ESP32 unavailable"

        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 700)

    } else {

        status.textContent = "Could not connect to either service"

    }

    connectButton.disabled = false
    connectButton.textContent = "Connect"
}