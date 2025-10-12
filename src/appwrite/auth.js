import conf from '../conf/conf'
import { Client, Account, ID, Functions } from 'appwrite'

export class AuthService {
    client = new Client();
    account

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client);
        this.functions = new Functions(this.client)
    }

    async createAccount({ email, password, name }) {

        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (userAccount) {
                const login = await this.login({
                    email,
                    password
                })
                // console.log(login)
                return login
            } else { return undefined }
        } catch (error) {
            console.log(error?.message)
            throw new Error(error?.message)
        }
    }

    async login({ email, password }) {
        try {
            const session = await this.account.createEmailSession(email, password);
            return { success: true, session }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    googleAuth() {
        try {
            return this.account.createOAuth2Session(
                'google',
                'https://thoughtify.vercel.app/',
                'https://thoughtify.vercel.app/login'
            )
        } catch (error) {
            return null
        }
    }

    async emailVerification() {
        try {
            return await this.account.createVerification(`https://thoughtify.vercel.app/`);

        } catch (error) {
            return null
        }
    }

    async verifyWithUserId_secret(id, secret) {
        try {
            return await this.account.updateVerification(id, secret)

        } catch (error) {
            return null
        }
    }

    async forgetPassword(email) {
        try {
            const environment = process.env.NODE_ENV;
            const path = environment === "production" ? 'https://thoughtify.vercel.app/reset-password' : "http://localhost:5173/reset-password"

            const promise = this.account.createRecovery(email, path);
            return promise
        } catch (error) {
            return null
        }
    }

    async resetPassword(userID, secret, password, RepeatPassword) {
        try {
            const promise = this.account.updateRecovery(userID, secret, password, RepeatPassword)

            return promise
        } catch (error) {
            return false
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.error(error?.message)
            return null
        }
    }

    async logout() {
        try {
            const logout = await this.account.deleteSessions();
            return logout ? true : false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async listUsers() {
        try {
            return await this.account.listIdentities()
        } catch (error) {
            return null
        }
    }

    async deleteAccount(userId) {
        try {
            // console.log(userId)
            const { jwt } = await this.account.createJWT()
            // console.log(jwt)
            this.client.setJWT(jwt)
            const payload = { jwt, userId }
            const exec = await this.functions.createExecution(
                "68de0d1a00016e46e7f1",
                JSON.stringify(payload),
                false,
                '/ping'
            )
            // console.log(exec)
            return exec
        } catch (error) {
            console.log(error?.message)
            return {
                success: false,
                error: process.env.NODE_ENV === "development" ? error?.message : "Something went wrong"
            }
        }
    }
}

const authService = new AuthService();
export default authService;