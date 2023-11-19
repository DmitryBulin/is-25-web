class ModelContract {
    constructor(userId, id, title, body) {
        this.userId = userId
        this.id = id
        this.title = title
        this.body = body
    }
}

function getRandomInt(min, max) {
    max++
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getModelUrl(id) {
    const baseUrl = 'https://jsonplaceholder.typicode.com/posts/'
    return baseUrl + id.toString()
}

function getUrls() {
    const minObjs = 3
    const maxObjs =  25
    const minId = 1
    const maxId = 100

    let objCount = getRandomInt(minObjs, maxObjs)
    let urls = []

    for (let i = 0; i < objCount; i++) {
        let modelId = getRandomInt(minId, maxId)
        urls.push(getModelUrl(modelId))
    }

    return urls
}

function getModelPreview(id) {
    const baseUrl = "/is-25-web/sources/img/models/placeholder"
    const suffix = ".png"
    let imageId = id % 2 + 1
    return baseUrl + imageId.toString() + suffix
}

function createModelCard(model) {
    const newCard = document.createElement("div")
    newCard.classList.add("model-card", "card")

    const cardImg = document.createElement("img")
    cardImg.src = getModelPreview(model.userId)
    newCard.appendChild(cardImg)

    const cardTitle = document.createElement("p")
    cardTitle.classList.add("text-highlight")
    cardTitle.innerText = "Модель №" + model.id
    newCard.appendChild(cardTitle)

    const cardMainInfo = document.createElement("p")
    cardMainInfo.classList.add("text-muted")
    cardMainInfo.innerText = model.title
    newCard.appendChild(cardMainInfo)

    const cardAdditionalInfo = document.createElement("p")
    cardAdditionalInfo.classList.add("text-muted")
    cardAdditionalInfo.innerText = model.body
    newCard.appendChild(cardAdditionalInfo)

    const settingsButton = document.createElement("a")
    settingsButton.classList.add("button-primary", "text-highlight")
    settingsButton.role = "button"
    settingsButton.href = "/is-25-web/pages/configurator.html"
    settingsButton.innerText = "Настроить"
    newCard.appendChild(settingsButton)

    const infoButton = document.createElement("a")
    infoButton.classList.add("button-secondary", "text-highlight")
    infoButton.role = "button"
    infoButton.href = "/is-25-web/pages/models.html"
    infoButton.innerText = "Подробнее"
    newCard.appendChild(infoButton)

    return newCard
}

let preloaderState = true
function disablePreloader() {
    if (!preloaderState) {
        return
    }

    preloaderState = false
    const preloaderId = "models-preloader"
    let preloader = document.getElementById(preloaderId)
    preloader.style.display = "none"
}

function addNewModel(model) {
    const modelFrameId = "model-frame"
    let modelFrame = document.getElementById(modelFrameId)
    let modelCard = createModelCard(model)
    modelFrame.appendChild(modelCard)
    disablePreloader()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function handleResponse(response) {
    await sleep(getRandomInt(50, 2000))

    if (!response.ok) {
        throw new Error("Failed to get url " + response.url)
    }

    return response.json()
}

async function loadModels() {
    await sleep(600)

    try {
        let urls = getUrls()
        for (let i = 0; i < urls.length; i++) {
            fetch(urls[i])
                .then(handleResponse)
                .then(model => addNewModel(model))
                .catch(error => console.error(error))
        }
    }
    catch(err) {
        alert("Something went wrong while fetching urls: " + err.toString())
    }
}

window.addEventListener("load", loadModels)
