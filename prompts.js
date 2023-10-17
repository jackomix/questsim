function promptWrapper(prompt) {
    return `--- User Begin ---

${prompt}

--- User End ---

--- YAML Output Begin ---

partyMembers:`
}

function actionPrompt(stats) {
    return `Choose-Your-Own-Adventure Game:

- Continue the game and story based on the player's "lastChoice."
- Write and describe what happens next in "nextPartOfStory." Be creative and entertaining!
- Give the player choices of what to do from there in "playerChoices". Write 1-2 sentences each.
- Edit/add/remove things in "inventory," "partyMembers," and their attributes if mentioned.

${jsyaml.dump(stats)}`
}
