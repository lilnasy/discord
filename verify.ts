import { verify } from 'https://github.com/lilnasy/noble-ed25519/raw/main/index.ts'

export async function verifySignature (
	publicKey: string,
	signature: string,
	body: string
) {
	return await verify
                ( signature
		, signature + body
		, publicKey )
                .catch( _ => false )
}
