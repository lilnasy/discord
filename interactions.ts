export { content, embed }

import  { Embed
        , InteractionResponseData
        } from './types.ts'

function content (text: string): InteractionResponseData {
	return { content: text }
}

function embed (embed: Embed): InteractionResponseData {
	return { embeds: [ embed ] }
}