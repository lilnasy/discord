import { Command } from './types.ts'
import { route } from './router.ts'
import { verify } from 'https://github.com/lilnasy/noble-ed25519/raw/main/index.ts'

/**
 * handler for requests containing discord interactions:
 * verifies their signatures, routes them to the matching command
 * and returns responses containing interaction responses
 * @param publicKey the public key against which interactions will be verified
 * @param commands array of functions that take interactions and return interaction responses
 * @returns a function that takes requests and returns responses
 * */
export function slash (publicKey: string, commands: Array<Command>) {
	const router = route(commands)
	// see if the interaction is signed for this app
	// if verification passed, respond using interaction handler
	// otherwise, respond with 401 Unauthorized
	return async (request: Request) => {
		const signature		= request.headers.get('x-signature-ed25519') || ''
		const timestamp		= request.headers.get('x-signature-timestamp') || ''
		const interaction	= await request.text()
		const verified		= await verify( signature, new TextEncoder().encode(timestamp + interaction), publicKey).catch( _ => false )
		if (!verified) return new Response( null, { status: 401, statusText: 'Unauthorized' } )
		return new Response(
			JSON.stringify( router( JSON.parse(interaction) ) ),
			{ headers: { 'Content-Type' : 'application/json' } }
		)
	}
}
