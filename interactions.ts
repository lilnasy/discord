export { content, embed }

import  { Embed
        , InteractionResponseData
        } from './types.ts'

function content (text: string) {
	return <InteractionResponseData> { content: text }
}

function embed (embed: Embed) {
	return <InteractionResponseData> { embeds: [ embed ] }
}
