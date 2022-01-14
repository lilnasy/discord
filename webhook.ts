import { InteractionResponseData } from './types.ts'

interface MessageInit {
	interactionToken: string
	responseData: InteractionResponseData
}

interface WebhookInit extends MessageInit {
	extension?: string
	method: string
}

export function EditMessage (
	applicationID: string,
	{ interactionToken, responseData }: MessageInit
) {	
	return SendToWebhook( applicationID, {
		interactionToken,
		responseData,
		extension: '/messages/@original',
		method: 'PATCH'
	})
}


export function FollowUpMessage (
	applicationID: string,
	{ interactionToken, responseData }: MessageInit
) {
	return SendToWebhook( applicationID, {
		interactionToken,
		responseData,
		method: 'POST'
	})
}

async function SendToWebhook (
	applicationID: string,
	{ responseData, extension = '', interactionToken, method }: WebhookInit
) {	
	const webhook = 'https://discord.com/api/v9/' + 'webhooks/' + applicationID + '/' + interactionToken + extension
	
	// discord needs attachments to be sent in a format called 'multipart/form-data'
	// the FormData API creates a response in this format
	if (responseData.attachment) {
		const body = new FormData
		body.append( 'attachment', responseData.attachment, 'attachment' )
		delete responseData.attachment
		body.append( 'payload_json', JSON.stringify(responseData) )
		
		const response = await fetch( webhook, { method, body } )
	
		if (response.ok) return await response.json()
		return Promise.reject( await response.text() )
	}
	
	const response =
		await fetch( webhook, {
			method,
			body: JSON.stringify(responseData),
			headers: { 'Content-Type': 'application/json' }
		})
		
	if (response.ok) return await response.json()
	return Promise.reject( await response.text() )
}
