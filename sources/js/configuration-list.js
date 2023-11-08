class Part {
  constructor(name, price) {
    this._name = name
    this._price = price
  }
}

class PartSection {
  _name;
  _parts;
  _allowMultiple;
  constructor(name, parts, allowMultiple = false) {
    this._name = name
    this._parts = parts
    this._allowMultiple = allowMultiple
  }
}

function totalPrice(parts) {
    let sum = 0
    parts.forEach(part => sum += part._price)
    return sum
}

function beautify(price) {
    let str = price.toString();
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
        if ((str.length - i) % 3 === 0 && i !== 0) {
            result = " " + str[i] + result;
        } else {
            result = str[i] + result;
        }
    }
    return result;
}

function priceDifference(currentPart, part) {
  let difference = ""
  if (currentPart._price > part._price) {
    difference = "-" + beautify(currentPart._price - part._price).toString()
  }
  if (currentPart._price < part._price) {
    difference = "+" + beautify(part._price - currentPart._price).toString()
  }
  return difference
}

function addPart(section, part) {
    if (!section._allowMultiple) {
        if (currentParts.get(section._name).includes(part))
            return
        currentParts.set(section._name, [part])
    } else {
        currentParts.get(section._name).push(part)
    }

    updateConfiguration()
}

function removePart(section, part) {
    let partIndex = currentParts.get(section._name).indexOf(part)

    currentParts.get(section._name).splice(partIndex, 1)

    updateConfiguration()
}

function createPartSectionElement(section, currentSectionParts, isUserConfig) {
    const newSection = document.createElement("div")
    newSection.classList.add("configurator-part-section")

    const sectionTitleElement = document.createElement("p")
    sectionTitleElement.classList.add("text-highlight", "margin-bottom")
    sectionTitleElement.innerText = section._name
    newSection.appendChild(sectionTitleElement)

    let partElements = []

    if (isUserConfig) {
        for (let i = 0; i < currentSectionParts.length; i++) {
            partElements.push(createPartElement(currentSectionParts[i], section, currentSectionParts, isUserConfig))
        }
    } else {
        for (let i = 0; i < section._parts.length; i++) {
            partElements.push(createPartElement(section._parts[i], section, currentSectionParts, isUserConfig))
        }
    }

    for (let i = 0; i < partElements.length; i++) {
        newSection.appendChild(partElements[i])
    }

    return newSection
}

function createPartElement(part, section, currentSectionParts, isUserConfig) {
    const newPartElement = document.createElement("div")
    newPartElement.classList.add("configurator-part")

    const partNameElement = document.createElement("p")
    partNameElement.innerText = part._name
    newPartElement.appendChild(partNameElement)

    const rightPartElement = document.createElement("div")
    rightPartElement.classList.add("part-right")
    newPartElement.appendChild(rightPartElement)

    const partPriceElement = document.createElement("p")
    partPriceElement.classList.add("text-muted")
    partPriceElement.innerText = beautify(part._price) + " р."
    rightPartElement.appendChild(partPriceElement)

    const buttonElement = document.createElement("a")
    const buttonImgElement = document.createElement("img")
    buttonElement.appendChild(buttonImgElement)
    rightPartElement.appendChild(buttonElement)

    buttonElement.onclick = function () { addPart(section, part) }
    if (currentSectionParts.some(currentPart => currentPart._name === part._name)) {
        if (isUserConfig) {
            buttonImgElement.src = removePartIconPath
            buttonElement.onclick = function () { removePart(section, part) }
        } else {
            if (section._allowMultiple) {
                buttonImgElement.src = addPartIconPath
            } else {
                buttonImgElement.src = removePartIconPath
                buttonElement.onclick = function () { removePart(section, part) }
            }
        }
    } else {
        if (!section._allowMultiple && currentSectionParts.length !== 0) {
            buttonImgElement.src = swapPartIconPath
            partPriceElement.innerText = priceDifference(currentSectionParts[0], part) + " р."
        } else {
            buttonImgElement.src = addPartIconPath
        }
    }

    return newPartElement
}

function updateConfiguration() {
    console.log("Update!")
    saveConfiguration()

    let availableParts = document.getElementById(availablePartsElementId)
    let userParts = document.getElementById(userPartsElementId)
    let totalPriceElement = document.getElementById(totalPriceElementId)

    while (availableParts.childNodes.length > 2) {
        availableParts.removeChild(availableParts.lastChild);
    }

    while (userParts.childNodes.length > 2) {
        userParts.removeChild(userParts.lastChild);
    }

    for (let i = 0; i < sections.length; i++) {
        let newSectionElement = createPartSectionElement(
            sections[i],
            currentParts.get(sections[i]._name),
            false
        )
        availableParts.appendChild(newSectionElement)
    }

    for (let i = 0; i < sections.length; i++) {
        if (currentParts.get(sections[i]._name).length === 0) {
            continue
        }

        let newSectionElement = createPartSectionElement(
            sections[i],
            currentParts.get(sections[i]._name),
            true
        )

        userParts.appendChild(newSectionElement)
    }

    totalPriceElement.innerText = beautify(totalPrice(Array.from(currentParts.values()).flat())) + " р."
}

function submitConfiguration(event) {
    event.preventDefault()
    alert(JSON.stringify(Array.from(currentParts.values()).flat()))
}

function loadConfiguration() {
    for (let i = 0; i < sections.length; i++) {
        currentParts.set(sections[i]._name, JSON.parse(localStorage.getItem(cacheKey + "-" + sections[i]._name) || "[]"))
    }
    console.log("Loaded")
    console.log(currentParts)
}

function saveConfiguration() {
    for (let i = 0; i < sections.length; i++) {
        localStorage.setItem(cacheKey + "-" + sections[i]._name, JSON.stringify(currentParts.get(sections[i]._name)))
    }
}

const cacheKey = "user-configuration"

const availablePartsElementId = "available-items"
const userPartsElementId = "user-items"
const totalPriceElementId = "total-price"
const configurationFormElementId = "configurator-form"

const addPartIconPath = "/is-25-web/sources/icon/configuration-add.svg"
const removePartIconPath = "/is-25-web/sources/icon/configuration-remove.svg"
const swapPartIconPath = "/is-25-web/sources/icon/configuration-swap.svg"

// Next semester - get from backend
const sections = [
  new PartSection(
      "Cpu",
      [
        new Part("Intel Core i5", 10499),
        new Part("Intel Core i7", 33999)
      ]
  ),
  new PartSection(
      "Motherboard",
      [
        new Part("ASRock H610M-HVS", 6699),
        new Part("MSI MAG Z690 TOMAHAWK", 20999)
      ]
  ),
  new PartSection(
      "Gpu",
      [
        new Part("Palit GeForce GTX 1660 SUPER", 25999),
        new Part("GIGABYTE GeForce RTX 4070 WINDFORCE OC 12G", 77999)
      ]
  ),
  new PartSection(
      "RAM",
      [
        new Part("Kingston FURY Beast Black 16 Gb", 4699),
        new Part("ADATA XPG GAMMIX D20", 7799)
      ]
  ),
  new PartSection(
      "Psu",
      [
        new Part("Cougar STX 700W", 5299),
        new Part("DeepCool PX1000G", 16699)
      ]
  ),
  new PartSection(
      "Case",
      [
        new Part("DEXP DC-201M", 1499),
        new Part("Cougar Duoface RGB White", 7099)
      ]
  ),
  new PartSection(
      "Ssd",
      [
        new Part("Kingston A400", 10499),
        new Part("Samsung 870 EVO 1000 Gb", 8999)
      ],
      true
  ),
  new PartSection(
      "Hdd",
      [
        new Part("Toshiba DT01", 5199),
        new Part("WD Blue 4 Tb", 9999)
      ],
      true
  ),
]

let currentParts = new Map()

loadConfiguration()

window.addEventListener("load", function() {
    document.getElementById(configurationFormElementId).addEventListener('submit', submitConfiguration);
})
window.addEventListener("load", updateConfiguration);
