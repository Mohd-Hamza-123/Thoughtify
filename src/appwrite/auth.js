import conf from '../conf/conf'
import { Client, Account, ID } from 'appwrite'

export class AuthService {
    client = new Client();
    account

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client);
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
            const promise = this.account.createRecovery(email, 'https://thoughtify.vercel.app/reset-password');

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

}

const authService = new AuthService();
export default authService;