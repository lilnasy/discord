import  {
        Embed,
        InteractionResponseData
} from './types.ts'

export function content (text: string): InteractionResponseData {
	return { content: text }
}

export function embed (embed: Embed): InteractionResponseData {
	return { embeds: [ embed ] }
}
