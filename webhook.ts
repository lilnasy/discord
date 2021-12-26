export { EditMessage, FollowUpMessage }

import { InteractionResponseData } from './types.ts'


function EditMessage (
	applicationID: string,
	init: { 
		responseData: InteractionResponseData,
		interactionToken: string
	}
) {	
	return SendToWebhook( applicationID, {
		...init,
		extension: '/messages/@original',
		method: 'PATCH'
	})
}


function FollowUpMessage (
	applicationID: string,
	init: {
		responseData: InteractionResponseData,
		interactionToken: string
	}
) {	
	return SendToWebhook( applicationID, {
		...init,
		method: 'POST'
	})
}

	
async function SendToWebhook (
	applicationID: string,
	init: {
		responseData: InteractionResponseData
		extension?: string,
		interactionToken: string,
		method: string,
	}
) {	
	const { responseData, extension, interactionToken, method } = init

	const webhook = 'https://discord.com/api/v9/' + 'webhooks/' + applicationID + '/' + interactionToken + (extension || '')
	
	// discord needs attachments to be sent in a format called 'multipart/form-data'
	// the FormData API creates a response in this format
	if (responseData.attachment) {
		const body = new FormData
		body.append( 'attachment', responseData.attachment, 'attachment' )
		delete responseData.attachment
		body.append( 'payload_json', JSON.stringify(responseData) )
		
		const response = await fetch( webhook, { method, body } )
	
		return (response.ok)
			? response.json()
			: Promise.reject( await response.text() )
	}
	
	const response =
		await fetch( webhook, {
			method,
			body: JSON.stringify(responseData),
			headers: { 'Content-Type': 'application/json' }
		})
		
	return (response.ok)
		? response.json()
		: Promise.reject( await response.text() )
}
