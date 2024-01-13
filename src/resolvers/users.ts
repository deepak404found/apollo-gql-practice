import { Resolvers } from "@graphql";
import UsersModel from "../models/UsersModel";
import { BadUserInputError, ErrorHandler, NotFoundError } from "../helpers/errors/ErrorHandler";
import { UserExistsError } from "../helpers/errors/Users";

export const userResolvers: Resolvers = {
    Mutation: {
        createUser: async (_, { form }) => {
            try {
                const userExists = await UsersModel.exists({ username: form.username });
                if (userExists) {
                    throw new UserExistsError('User already exists', form.username);
                }

                if (form.password.length < 8) {
                    throw new BadUserInputError('Password must be at least 8 characters long');
                }
                const user = await UsersModel.create(form);
                return {
                    __typename: 'User',
                    ...user.toObject(),
                }
            } catch (error) {
                console.log(error);
                return ErrorHandler.handle(error);
            }
        }
    },
    Query: {
        getUsers: async () => {
            try {
                const users = await UsersModel.find({})
                return {
                    code: 200,
                    success: true,
                    message: 'success',
                    payload: users
                }
            } catch (error) {
                console.log(error);
                return {
                    code: 500,
                    success: false,
                    message: error.message
                };
            }
        },
        getUser: async (_, { uid }) => {
            // const user = await UsersModel.findOne({ uid });
            // return user;
            try {
                const user = await UsersModel.findOne({ uid });
                if (!user) {
                    throw new NotFoundError('User not found');
                }
                return {
                    __typename: 'User',
                    ...user.toObject(),
                }
            } catch (error) {
                return ErrorHandler.handle(error);
            }
        }
    }
}

export default userResolvers;