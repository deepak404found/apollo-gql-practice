import { Resolvers } from '@graphql'

export default {
	Query: {
		hello: () => {
			return {
				__typename: 'helloMessage',
				number: 123,
			}
		},
		myDate: () => new Date(),
	},
} as Resolvers
