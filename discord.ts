export { slash }

import { Command } from './types.ts'

import { routeInteraction } from './router.ts'

import { verifySignature } from './verify.ts'

/**
 * requests containing interactions,
 * verifies their signatures, routes them to the matching command
 * and returns responses containing interaction responses
 * @param publicKey the public key against which interactions will be verified
 * @param commands array of functions that take interactions and return interaction responses
 * @returns a function that takes requests and returns responses
 * */
function slash (publicKey: string, commands: Array<Command>) {

	const router = routeInteraction(commands)

	// see if the interaction is signed for this app
	// if verification passed, respond using interaction handler
	// otherwise, respond with 401 Unauthorized
	return async (request: Request) => {

		const signature		= request.headers.get('x-signature-timestamp') || ''
		
		const interaction	= await request.text()
		
		const verified		= await verifySignature(publicKey, signature, interaction)
		
		if (verified) return new Response(
			JSON.stringify( router( JSON.parse(interaction) ) ),
			{ headers: { 'Content-Type' : 'application/json' } } )
		
		return new Response( null, { status: 401, statusText: 'Unauthorized' } )
	}
}
