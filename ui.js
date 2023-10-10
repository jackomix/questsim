function updateParty(statsObject) {
    // Create an array that we will fill with the names of all party members.
    // We use this to iterate through, to remove any listings of now non-existing members.
    var currentPartyNames = []

    // Iterate through party members list
    for (const [key, partyMember] of Object.entries(statsObject.partyMembers)) {
        // When adding the names, replace spaces with underscores, since we'll be comparing with the IDs
        currentPartyNames.push(partyMember.name.replaceAll(" ", "_"))

        // (Try to) get the listing of the party member
        var partyMemberListing = $(".party").querySelector(`#${partyMember.name}`.replaceAll(" ", "_"))
        if (partyMemberListing) {
            // If party member is already listed, update them

            // Update emoji
            partyMemberListing.querySelector(".characterEmoji").innerHTML = partyMember.emotion

            // Iterate through bars
            // We will do the same logic as we did for party members.
            var currentPartyMemberBarNames = []

            for (const [key, bar] of Object.entries(partyMember.bars)) {
                currentPartyMemberBarNames.push(bar.name.replaceAll(" ", "_"))

                var barListing = partyMemberListing.querySelector(`#${bar.name}`.replaceAll(" ", "_"))

                if (barListing) {
                    barListing.nanobar.go(bar.percent)
                    barListing.nanobar.barBg(bar.color)
                } else {
                    addProgressBar(partyMemberListing, bar.name, bar.percent, bar.color)
                }
            }

            for (const bar of partyMemberListing.querySelectorAll(".statBar:not(.toBeCloned)")) {
                if (!currentPartyMemberBarNames.includes(bar.id)) bar.remove()
            }
        } else {
            // If party member doesn't exist, create their listing
            addPartyMember(partyMember)
        }
    }

    // Iterate through all currenty listed party members
    for (const item of $(".party").querySelectorAll(".partyMember:not(.toBeCloned)")) {
        // Remove listing if party member no longer exists
        if (!currentPartyNames.includes(item.id)) item.remove()
    }
}

function addPartyMember(partyMemberObject) {
    var element = $(".toBeCloned.partyMember").cloneNode(true)

    element.querySelector(".partyMemberName").innerHTML = partyMemberObject.name + `<span class="characterEmoji">${partyMemberObject.emotion}</span>`
    element.classList.remove("toBeCloned")

    // Add party member's name to listing ID and replace spaces with underscores
    element.setAttribute("id", partyMemberObject.name.replaceAll(" ", "_"));
    $(".party").appendChild(element)

    for (const [key, value] of Object.entries(partyMemberObject.bars)) {
        addProgressBar(element, value.name, value.percent, value.color)
    }
}

function addProgressBar(parent, label, value, color) {
    var element = $(".toBeCloned.statBar").cloneNode(true)
    element.classList.remove("toBeCloned")

    // Add bar label to listing ID and replace spaces with underscores
    element.setAttribute("id", label.replaceAll(" ", "_"));
    parent.appendChild(element)

    element.nanobar = new Nanobar({ target: element, label: label })
    element.nanobar.go(value)
    element.nanobar.barBg(color)
}

function updateInventory(statsObject) {
    var inventoryItemNames = []

    for (const [key, item] of Object.entries(statsObject.inventory)) {
        inventoryItemNames.push(item.name.replaceAll(" ", "_"))

        var inventoryItemListing = $(".inventory").querySelector(`#${item.name}`.replaceAll(" ", "_"))

        if (inventoryItemListing) {
            inventoryItemListing.querySelector(".itemEmoji").innerHTML = item.emoji
        } else {
            addInventoryItem(item)
        }
    }

    for (const item of $(".inventory").querySelectorAll(".inventoryItem:not(.toBeCloned)")) {

        if (!inventoryItemNames.includes(item.id)) item.remove()
    }
}

function addInventoryItem(itemObject) {
    var element = $(".toBeCloned.inventoryItem").cloneNode(true)

    element.innerHTML = `<span class="itemEmoji">${itemObject.emoji}</span><br><span class="itemName">${itemObject.name}</span>`
    element.classList.remove("toBeCloned")

    element.setAttribute("id", itemObject.name.replaceAll(" ", "_"));
    element.setAttribute("onClick", `sendAction(\`Use ${itemObject.name} from inventory\`)`);

    $(".inventory").appendChild(element)
}

function addChoice(label, value) {
    var element = $(".toBeCloned.choice").cloneNode(true)

    element.innerHTML = label
    element.classList.remove("toBeCloned")
    element.setAttribute("onClick", `sendAction(\`${value}\`)`);

    $(".rightSide").appendChild(element)
}

function updateStats(stats) {
    // Update party and inventory with their respective functions
    updateParty(stats)
    updateInventory(stats)

    // Remove any previous choice buttons
    for (const choice of document.querySelectorAll('.choice:not(.toBeCloned)')) { choice.remove() }
    // Iterate through current choices and add them
    for (const choice of stats.newChoices) { addChoice(choice, choice) }

    // Display current text
    $(".mainText").innerHTML = stats.newStoryBeat
    typingEffect($(".mainText"), {
        speed: 15,
    })
}

function credits() {
    alert(`created by jackomix
    
    libraries used:
    - nanobar by jacoborus (edited by jackomix)
    - typing-effect by mgrsskls
    - js-yaml by nodeca
    
    special thanks to all the workers in AI Horde :)`)
}

function updateAIStatus(response) {
    var statusText = ""
    var statusState = ""

    // Starting to generate
    if (response == "start") {
        statusText = `initiating generation...`
        statusState = "info"
    } else if (response.status == 401) { // Unauthorized
        statusText = `uh oh! ai horde wouldn't let us connect. are you sure you have your api key set up (correctly)?`
        statusState = "error"
    } else if (response.waiting == 1) { // Waiting in queue
        statusText = `waiting in queue... you are at ${response.queue_position}...`
        statusState = "waiting"
    } else if (response.processing == 1) { // Processing
        statusText = `processing!! wait time is at ~~${response.wait_time} seconds...`
        statusState = "waiting"
    } else if (response.finished == 1) { // Processing
        statusText = `done!!!`
        statusState = "done"
    } else if (response == "yaml") { // Not in YAML format
        statusText = `aww... the output isn't even in a readable format... regenerating...`
        statusState = "error"
    } else if (response == "format") { // Not in game format
        statusText = `aww... the output doesn't go with our game's format... regenerating...`
        statusState = "error"
    } else if (response.status == 200) { // Good but likely redundant response (like after generation), we can just ignore it
        return
    } else { 
        statusText = `uh oh! an unknown error/response has occured... response has been sent to console!`
        statusState = "error"
        console.log("--- unknown response ---")
        console.log(response)
    }

    $(".status").innerHTML = statusText // "info" doesn't do anything
    if (statusState == "error") $(".status").innerHTML = `<i><b>${statusText}</b></i>`

    $(".status").className = "status" // Remove any animation classes before potentially adding new ones
    if (statusState == "waiting") $(".status").classList.add("floating")
    if (statusState == "done") $(".status").classList.add("skew")
}