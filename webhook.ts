export { EditMessage, FollowUpMessage }

import { InteractionResponseData } from './types.ts'


function EditMessage (
	applicationID: string,
	interactionToken: string,
	data: InteractionResponseData
) {	
	return SendToWebhook('PATCH', '/messages/@original', applicationID, interactionToken, data)
}


function FollowUpMessage (
	applicationID: string,
	interactionToken: string,
	data: InteractionResponseData
) {	
	return SendToWebhook('POST', '', applicationID, interactionToken, data)        
}

	
async function SendToWebhook (
	method: string,
	extension: string,
	applicationID: string,
	interactionToken: string,
	data: InteractionResponseData
) {	
	const webhook = 'https://discord.com/api/v9/' + 'webhooks/' + applicationID + '/' + interactionToken + extension
	
	// discord needs attachments to be sent in a format called 'multipart/form-data'
	// the FormData API creates a response in this format
	if (data.attachment) {
		const body = new FormData
		body.append( 'attachment', data.attachment, 'attachment' )
		delete data.attachment
		body.append( 'payload_json', JSON.stringify(data) )
		
		const response = await fetch( webhook, { method, body } )
	
		return (response.ok)
			? response.json()
			: Promise.reject( await response.text() )
	}
	
	const response =
		await fetch( webhook, {
			method,
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' }
		})
		
	return (response.ok)
		? response.json()
		: Promise.reject( await response.text() )
}
