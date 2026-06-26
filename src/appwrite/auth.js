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

            await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            return await this.login({
                email,
                password
            })

        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.error(message)
            }
            throw new Error("Account not created")
        }
    }

    async login({ email, password }) {
        try {

            const session = await this.account.createEmailSession(email, password);
            return { success: true, session }

        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            return { success: false, error: message }
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

            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }

        }
    }

    async emailVerification() {

        try {

            const env = process.env.NODE_ENV
            const path = env === "production" ? conf.viteThoughtifyDomain : 'http://localhost:5173/'
            return await this.account.createVerification(path);

        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async verifyWithUserId_secret(id, secret) {
        try {
            return await this.account.updateVerification(id, secret)
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async forgetPassword(email) {
        try {
            const environment = process.env.NODE_ENV;
            const path = environment === "production" ? 'https://thoughtify.vercel.app/reset-password' : "http://localhost:5173/reset-password"

            const promise = this.account.createRecovery(email, path);
            return promise
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async resetPassword(userID, secret, password, RepeatPassword) {
        try {
            const promise = this.account.updateRecovery(userID, secret, password, RepeatPassword)
            return promise
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async logout() {
        try {
            const logout = await this.account.deleteSessions();
            return logout ? true : false
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async listUsers() {
        try {
            return await this.account.listIdentities()
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async deleteAccount(userId) {
        try {

            const { jwt } = await this.account.createJWT()

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
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            return {
                success: false,
                error: process.env.NODE_ENV === "development" ? error?.message : "Something went wrong"
            }
        }
    }
}

const authService = new AuthService();
export default authService;