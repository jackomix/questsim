function promptWrapper(prompt) {
    return `--- User Begin ---

${prompt}

--- User End ---

--- YAML Output Begin ---

partyMembers:`
}

function rulesPrompt() {
    return `- Add multiple strings into the "newChoices" array. 
- Modify "inventory", "partyMembers", party member's "bars" and "emotion"s as necessary. 
- Keep the inventory current and remove unusable items. 

Return the YAML object.`
}

function actionPrompt(stats) {
    return `Goal: Continue the story with what's happening next after the player's "lastChoice" 
- Write what happens next in "newStoryBeat". Go further and be extraordinary creative!
- Write multiple new choices the player must choose in "newChoices". 
- Write and update "storyRecap" and "lastStoryBeat". 
${rulesPrompt()}

${jsyaml.dump(stats)}`
}
