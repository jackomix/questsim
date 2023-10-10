stats = {
    partyMembers: [
        {
            name: "bob",
            emotion: "😀",
            bars: [{
                name: "health",
                percent: 100,
                color: "#ff0000",
            },
            {
                name: "mana",
                percent: 50,
                color: "#0000ff",
            },
            {
                name: "energy",
                percent: 25,
                color: "#00ff00",
            },
            ],
        },
        {
            name: "alice",
            emotion: "😞",
            bars: [
                {
                    name: "money",
                    percent: 75,
                    color: "#ffff00",
                },
            ],
        },
    ],
    inventory: [
        {
            name: "yummy biscuit",
            emoji: "🍪",
        },
        {
            name: "car",
            emoji: "🚗",
        },
        {
            name: "apple",
            emoji: "🍎",
        },
    ],
    story_recap: "You are Bob. You were in a house. You then left the house and found some items. Then you met Alice. A bear started running towards the both of you.",
    last_story_beat: "",
    actionChosen: "",
    new_story_beat: "You see a bear running towards you!",
    choices: ["Run away!", "Stay and fight."],
}

async function sendAction(action, error) {
    const backupStats = structuredClone(stats)

    stats.last_story_beat = stats.new_story_beat
    stats.new_story_beat = "[Assistant replace with new story beat]"
    stats.choices = ["[Assistant replace with multiple strings of choices]"]
    stats.actionChosen = action

    try {
        stats = await smartGen(actionPrompt(stats))
        updateStats(stats)
    } catch (error) {
        console.info("error: out was YAML compatible but didn't fit game format. regenerating...")
        stats = structuredClone(backupStats)
        if (!log_mode) sendAction(action)
    }
}

function test() {
    stats = {
        partyMembers: [
            {
                name: "bob",
                emotion: "😟",
                bars: [
                    {
                        name: "health",
                        percent: 25,
                        color: "#ff0000",
                    },
                    {
                        name: "mana",
                        percent: 75,
                        color: "#0000ff",
                    },
                    {
                        name: "super energy",
                        percent: 100,
                        color: "#00ffff",
                    },
                ],
            },
            {
                name: "doggy",
                emotion: "🦴",
                bars: [
                    {
                        name: "ruff power",
                        percent: 100,
                        color: "#ffffff",
                    },
                ],
            },
        ],
        inventory: [
            {
                name: "car",
                emoji: "🚗",
            },
            {
                name: "bitten apple",
                emoji: "🍎",
            },
        ],
        story_recap: "You are bob. You were in a house. You then left the house and found some items. Then you met Alice. A bear was running towards you both. It killed Alice before a doggy came to save you. The bear dropped some items.",
        current_story_beat: "The doggy asks for a treat!",
        choices: ["Give it a treat", "Say no", "Dance around"],
    };
    updateStats(stats);
}
updateStats(stats)