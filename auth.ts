import	{
	Authorization,
	Command,
	CommandRegistration,
	OptionType
} from './types.ts'

interface RegistrationInit {
	accessToken: string
	command: Command
}

/** uses credentials to get a code needed to register commands. */
export async function Authorize (
	clientID: string,
	clientSecret: string
): Promise<Authorization> {
	const response = await fetch( 'https://discord.com/api/v9/' + 'oauth2/token', {
		method: 'POST',
		body: 'grant_type=client_credentials&scope=applications.commands.update',
		headers: {
			'Content-Type': "application/x-www-form-urlencoded",
			'Authorization': 'Basic ' + btoa( clientID + ':' + clientSecret )
		}
	})
	
	if (response.ok) return await response.json()
	return Promise.reject( await response.text() )
}

/** registers commands with discord so that they appear in chat */
export async function RegisterCommand (
	applicationID: string,
	{ accessToken, command }: RegistrationInit
): Promise<CommandRegistration>  {
	// transform the simple choices (if there are some) into discord's command options structure
	const choices =
		! command.choices
		? []
		: [{	name:		"choice",
			description:	command.choices.join('/'),		// ['artist', 'album', 'track'] -> 'artist/album/track'
			type:		OptionType.String,
			choices:	command.choices.map( choice => ({name: choice, value: choice}) ) }]

	const response =
		await fetch( 'https://discord.com/api/v9/' + 'applications/' + applicationID + '/commands', {
			method: 'POST',
			body: JSON.stringify({				// details about the command to be sent to discord
				name:		command.name,
				description:	command.description,
				type:		command.type,		// chat input(default), user, or message
				options:	command.options || choices }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + accessToken }
		})
	
	if (response.ok) return await response.json()
	return Promise.reject( await response.text() )
}
