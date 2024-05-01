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

    async createAccount({ email, password, name, gender = null }) {

        try {

            const userAccount = await this.account.create(
                ID.unique(), email, password, name);

            if (userAccount) {
                return await this.login({ email, password })
            } else { return undefined }
        } catch (error) {

            return `${error}`
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            return null
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
            const promise = this.account.createRecovery(email, 'http://localhost:5173/reset-password');

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
            return null
        }

    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            return null
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