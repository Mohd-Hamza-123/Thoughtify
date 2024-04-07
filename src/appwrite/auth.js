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
            console.log()
            const userAccount = await this.account.create(
                ID.unique(), email, password, name);
            // console.log(userAccount)
            if (userAccount) {
                return await this.login({ email, password })
            } else { return undefined }
        } catch (error) {
            console.log("Create Account :: ERROR " + error);
            return `${error}`
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("Login :: ERROR " + error);
        }
    }

    googleAuth() {
        try {
            return this.account.createOAuth2Session(
                'google',
                'http://localhost:5173/',
                'http://localhost:5173/login'
            )
        } catch (error) {
            console.log("Login_Google :: ERROR " + error);
        }
    }
    githubAuth() {
        try {
            this.account.createOAuth2Session(
                'github',
                'http://localhost:5173/',
                'http://localhost:5173/login'
            )
        } catch (error) {
            console.log("Login_Google :: ERROR " + error);
        }
    }
    facebookAuth() {
        try {
            this.account.createOAuth2Session(
                'facebook',
                'http://localhost:5173/',
                'http://localhost:5173/login'
            )
        } catch (error) {
            console.log("Login_Google :: ERROR " + error);
        }
    }

    async emailVerification() {
        try {
            return await this.account.createVerification(`http://localhost:5173/`);

        } catch (error) {
            console.log("Login_Google :: ERROR " + error);
        }
    }

    async verifyWithUserId_secret(id, secret) {
        try {
            return await this.account.updateVerification(id, secret)

        } catch (error) {
            console.log("update Verification:: ERROR " + error);
        }
    }

    async forgetPassword(email) {
        try {
            const promise = this.account.createRecovery(email, 'http://localhost:5173/reset-password');

            return promise
        } catch (error) {
            console.log("Forget Password :: ERROR " + error);
        }
    }
    
    async resetPassword(userID, secret, password, RepeatPassword) {
        try {
            const promise = this.account.updateRecovery(userID, secret, password, RepeatPassword)

            return promise
        } catch (error) {
            console.log("Reset Password :: ERROR " + error);
            return false
        }
    }


    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log(" GetCurrentUser :: ERROR " + error);
        }
        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("LogOut :: ERROR " + error);
        }
    }

    async listUsers() {
        try {
            return await this.account.listIdentities()
        } catch (error) {
            console.log("ListUsers :: ERROR" + error)
        }
    }


}

const authService = new AuthService();
export default authService;