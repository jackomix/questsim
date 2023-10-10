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
    storyRecap: "After walking out of your wizard tower, you saw a dog. You gave it a bone you had in your inventory. You and the dog went into the forest. You saw a bear and hid in the bushes. Your dog made a sound and alerted the bear. The bear is now running towards you.",
    lastStoryBeat: "",
    lastChoice: "",
    newStoryBeat: "You see the bear galloping its furry and muscular legs towards you! Doggy doesn't notice, licking its bite-marks-covered stick on the ground.",
    newChoices: ["Send a fireball spell", "Alert doggy"],
}

async function sendAction(action) {
    const backupStats = structuredClone(stats)

    stats.lastStoryBeat = stats.newStoryBeat
    stats.newStoryBeat = "[Assistant replace with new story beat]"
    stats.newChoices = ["[Assistant replace with multiple strings of choices]"]
    stats.lastChoice = action

    try {
        stats = await smartGen(actionPrompt(stats), true)
        updateStats(stats)
    } catch (error) {
        updateAIStatus("format")
        console.info("error: out was YAML compatible but didn't fit game format. (or debug_mode is on?) regenerating...")
        stats = structuredClone(backupStats)
        if (!log_mode) sendAction(action)
    }
}

updateStats(stats)