function promptWrapper(prompt) {
    return `--- User Begin ---

${prompt}

--- User End ---

--- YAML Output Begin ---

partyMembers:`
}

function rulesPrompt() {
    return `- Provide multiple choices as strings of text in "choices". 
- Modify "inventory", "partyMembers", party member's "bars" and "emotion"s as necessary. 
- Keep the inventory current and remove unusable items. 

Return the YAML object.`
}

function actionPrompt(stats) {
    return `Goal: Continue the story with what's happening next. 
- Write what happens next in "new_story_beat".
- Write new choices the player must choose in "choices". 
- Write and update "recap" and "last_story_beat". 
${rulesPrompt()}

${jsyaml.dump(stats)}`
}
