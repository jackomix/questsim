stats = {
    partyMembers: [
        {
            name: "Bob the Wizard",
            emotion: "😲",
            bars: [{
                name: "Health",
                percent: 100,
                color: "#ff0000",
            },
            {
                name: "Mana",
                percent: 50,
                color: "#0000ff",
            },
            {
                name: "Gold",
                percent: 69,
                color: "#ffff00",
            },
            ],
        },
        {
            name: "Doggy",
            emotion: "😋",
            bars: [
                {
                    name: "Health",
                    percent: 100,
                    color: "#ff0000",
                },
                {
                    name: "Bark Power",
                    percent: 75,
                    color: "#00ffff",
                },
            ],
        },
    ],
    inventory: [
        {
            name: "Wet Stick",
            emoji: "🦴",
        },
        {
            name: "Glasses",
            emoji: "👓",
        },
        {
            name: "Apple",
            emoji: "🍎",
        },
    ],

    nextPartOfStory: "You see the bear galloping its furry and muscular legs towards you! Doggy doesn't notice, licking its bite-marks-covered stick on the ground.",
    playerChoices: ["Send a fireball spell", "Alert doggy"],
    
    previousStoryPart: "",
    lastChoice: "",
}
//backstory: "After walking out of your wizard tower, you saw a dog. You gave it a bone you had in your inventory. You and the dog went into the forest. You saw a bear and hid in the bushes. Your dog made a sound and alerted the bear. The bear is now running towards you.",
async function sendAction(action) {
    // Back up current stats object incase of error
    const backupStats = structuredClone(stats)

    stats.previousStoryPart = stats.nextPartOfStory
    defaultNextPartOfStory = "(Assistant, replace this with what happens next in the story.)"
    defaultPlayerChoices = ["(Assistant, replace this with multiple choices for the player.)"]
    stats.nextPartOfStory = defaultNextPartOfStory
    stats.playerChoices = defaultPlayerChoices
    stats.lastChoice = action

    // Since smartGen could result in an error, we define a different variable, and set stats to it afterwards if it's safe
    statsAttempt = await smartGen(actionPrompt(stats), true)
    
    if (statsAttempt == null) {
        return
    } else {
        stats = structuredClone(statsAttempt)
    }

    // If output's nextPartOfStory or playerChoices is untouched, or if the length of them is 0, regenerate.
    if (stats.nextPartOfStory == defaultNextPartOfStory || 
    !stats.nextPartOfStory.replace(/\s/g,'').length > 0 ||
    stats.playerChoices == defaultPlayerChoices ||
    !stats.playerChoices[0].replace(/\s/g,'').length > 0) {
        // Restore backup stats object
        stats = structuredClone(backupStats)
        updateStats(stats)

        if (!debug_mode) sendAction(action)

        return
    }
    
    try {
        updateStats(stats)
    } catch (error) {
        console.log("no")
        // Only notify if the error is a parsing error and not a smartGen error
        if (stats) {
            updateAIStatus("format")
        }
        console.info("error: out was YAML compatible but didn't fit game format. and/or smartGen() returned a not-good output. regenerating...")

        // Restore backup stats object
        stats = structuredClone(backupStats)
        updateStats(stats)

        if (!debug_mode) sendAction(action)
    }
}

updateStats(stats)