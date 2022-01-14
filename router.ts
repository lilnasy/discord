import { content } from './interactions.ts'
import { FollowUpMessage } from './webhook.ts'
import  {
	Command,
	Interaction,
	InteractionType,
	InteractionResponse,
	InteractionResponseType,
	InteractionResponseData
} from './types.ts'

export function route (commands: Array<Command>) {

	const defaultCommand: Command =  {
		name: 'unknown command',
		description: `this gets used when the interaction sent by discord isn't intended for any of commands provided to 'route'`,
		handler: (ix: Interaction) => content(`
			The command named ${ix.data?.name}with id ${ix.data?.id}is not implemented.
			This might mean that the command was registered with a mistyped name,
			or that the command was removed from the application without being unregistered with Discord.`)
	}
		
	
	return (interaction: Interaction): InteractionResponse => {

		const {	Ping,
			ApplicationCommand,
			MessageComponent } = InteractionType
		
		const {	Pong,
			ImmediateReply,
			DeferredReply,
			ImmediateUpdate,
			DeferredUpdate } = InteractionResponseType

		const Deferred = (responseData: InteractionResponseData) =>
			FollowUpMessage( interaction.application_id, {
				interactionToken: interaction.token,
				responseData
			})

		// To make working with options easier, add custom properties into the interaction.
		// userID is the unique ID given to every user by Discord
		// input is the user-provided input to the first option, undefined when there's no input
		const ix = {
			...interaction,
			userID : interaction.member?.user?.id || interaction.user?.id,
			input : interaction.data?.options?.[0].value }
		
		// find the command whose name matches the name of the command in interaction data, use defaultCommand if a match can't be found
		const matchedCommand: Command = commands.find(command => command.name == ix.data?.name) || defaultCommand
		
		// use the matched command by providing the interaction to it
		const responseData = matchedCommand.handler(ix)
		
		switch (ix.type) {
			
			// a ping request, part of discord verification
			case Ping: return { type: Pong }
			
			// chat, user, and message commands
			case ApplicationCommand: {
				
				// if the response data is going to take a while to arrive,
				// schedule sending it to a webhook for when it does
				if (responseData instanceof Promise) {
					
					responseData
					.then ( data	=> Deferred(data) )
					.catch( reason	=> Deferred(content(String(reason))) )
					
					// in the meanwhile, let discord know we will send out actual data in a bit
					return { type: DeferredReply }
				}
				
				// send out the data immedately if it's here
				try {
					return { type: ImmediateReply, data: responseData }
				}
				
				catch (reason) {
					return { type: ImmediateReply, data: content( String(reason) ) }
				}
			}
			
			// triggered on interactions with buttons and menus
			case MessageComponent: return {
				type: DeferredUpdate,
				data: content('x')
			}
			
			default: return {
				type: ImmediateUpdate,
				data: content(ix.type + ' is not a known interaction type')
			}
		}
	}
}
