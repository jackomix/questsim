# questsim
by jackomix

## original idea
Originally, I wanted to make a simple but peculiar COYA game using AI Horde for text generation. I was going to have randomly added events and prompts, actively encourage foreshadowing, and etc. I also intended to let the AI generate their own stat bars, party members, inventory items, and any number of choices. This is technically possible, as the "stats" object contains your entire game, and is dynamic with these additions and removals. The problem is that the current level of AI, at least on AI Horde, is not "smart" enough to take this task. While bigger models do exist on AI Horde, the wait times are too long to still be enjoyable. I wanted to stick with AI Horde as well since I want the game to be free, for everyone's sake (lol).

## optimizations i took
After configuring everything, this was what I settled the closest on.
- Using bullet points for English instructions in the prompt.
- Using YAML format instead of minified JSON format for data structuring.
- Current temperature, top_p, and top_k settings after experimentation.