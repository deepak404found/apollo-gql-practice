import {Resolvers} from "@graphql";
import UsersModel from "../models/UsersModel";
import {ErrorHandler, NotFoundError} from "../helpers/errors/ErrorHandler";
import {PasswordIncorrectError, UserExistsError} from "../helpers/errors/Users";

const userResolvers: Resolvers = {
    Mutation: {
        createUser: async (_, {form}) => {
            try {
                const checkUser = await UsersModel.exists({username: form.username});
                if (checkUser) {
                    throw new UserExistsError('User already exists', form.username)
                }

                if (form.password.length < 8) {
                    throw new PasswordIncorrectError('Password is too short')
                }

                const user = await UsersModel.create(form);
                return {
                    __typename: 'User',
                    ...user.toObject() as any
                }
            } catch (e) {
                console.log(e, 'error in createUser resolver');
                return ErrorHandler.handle(e);
            }
        }
    },
    Query: {
        getUser: async (_, {id}) => {
            try {
                const user = await UsersModel.findOne({uid: id});
                if (!user) {
                    throw new NotFoundError('User not found')
                }
                return {
                    __typename: 'User',
                    createdAt: user.createdAt,
                    password: user.password,
                    fullName: user.fullName,
                    username: user.username,
                    uid: user.uid
                }
            } catch (e) {
                console.log(e, 'error in getUser resolver');
                return ErrorHandler.handle(e);
            }
        }
    }
}

export default userResolvers;