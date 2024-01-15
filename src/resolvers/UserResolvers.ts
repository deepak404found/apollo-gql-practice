import {Resolvers} from "@graphql"
import UsersModel from "../models/UsersModel"
import {BadUserInputError, ErrorHandler, NotFoundError} from "../helpers/errors/ErrorHandler"
import {PasswordIncorrectError, UserExistsError} from "../helpers/errors/Users"
import {createAccessToken} from "../controller/auth"

const userResolvers: Resolvers = {
    Mutation: {
        createUser: async (_, {form}) => {
            try {
                const checkUser = await UsersModel.exists({username: form.username})
                if (checkUser) {
                    throw new UserExistsError('User already exists', form.username)
                }

                if (form.password.length < 8) {
                    throw new PasswordIncorrectError('Password is too short')
                }

                const user = await UsersModel.create(form)
                return {
                    __typename: 'User',
                    ...user.toObject() as any
                }
            } catch (e) {
                console.log(e, 'error in createUser resolver')
                return ErrorHandler.handle(e)
            }
        },
        login: async (_, {username, password}) => {
            try {
                const user = await UsersModel.findOne({username})

                if (!user) {
                    throw new NotFoundError('User not found')
                }

                let isPasswordCorrect = await user.comparePassword(password)

                if (!isPasswordCorrect) {
                    throw new BadUserInputError('Invalid Credentials')
                }

                const accessToken = createAccessToken(user.uid, user.fullName)
                const refreshToken = createAccessToken(user.uid, user.fullName)

                user.refreshToken = refreshToken.token
                await user.save()

                return {
                    __typename: 'LoginUser',
                    accessToken: accessToken.token,
                    refreshToken: refreshToken.token,
                    user,
                }

            } catch (e) {
                console.log(e, 'error in login resolver')
                return ErrorHandler.handle(e)
            }
        },
    },
    Query: {
        getUser: async (_, __, context) => {
            return {
                __typename: 'User',
                ...(context.user.toObject() as any)
            }
        }
    }
}

export default userResolvers