import { Resolvers } from "@graphql";
import UsersModel from "../models/UsersModel";

export const userResolvers: Resolvers = {
    Mutation: {
        createUser: async (_, { form }) => {
            const user = await UsersModel.create(form);
            return user;
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
                    return {
                        code: 404,
                        success: false,
                        message: 'User not found'
                    }
                }
                return {
                    code: 200,
                    success: true,
                    message: 'success',
                    payload: [user]
                }
            } catch (error) {
                console.log(error);
                return {
                    code: 500,
                    success: false,
                    message: error.message
                };
            }
        }
    }
}

export default userResolvers;