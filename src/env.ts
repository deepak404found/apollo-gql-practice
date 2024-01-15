export const vars = {
	MONOGO_URI: process.env.MONGO_URI!,
	PORT: parseInt(process.env.PORT) || 4001,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET! || 'secret',
	REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET! || 'supersecret',
	AT_EXPIRY: process.env.AT_EXPIRY! || '15m',
	RT_EXPIRY: process.env.RT_EXPIRY! || '7d',
}
