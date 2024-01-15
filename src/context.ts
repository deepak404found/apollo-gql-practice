import {TokenResult} from "./controller/auth";
import {UserDoc} from "./models/UsersModel";

export interface Context {
    authorization?: string
    user?: UserDoc
    token: TokenResult
}