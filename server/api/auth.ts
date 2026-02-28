export default defineEventHandler(async (event) => {
	const { token } = await readBody(event);
	if (!token) {
		return { message: 'failed' }
	}
	const { tokenName, appUrl } = useRuntimeConfig().public;
	setCookie(event, tokenName, token, {
		maxAge: 60 * 60 * 24 * 7,
		sameSite: 'lax',
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		domain: (appUrl as string).replace(/(^\w+:|^)\/\//, ''),
	});
	return { message: 'ok' }
})