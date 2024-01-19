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

    async createAccount({ email, password, name, gender = null, ID }) {
        console.log(ID)
        try {
            console.log()
            const userAccount = await this.account.create(
                ID + `_-.${gender}`, email, password, name);
            console.log(userAccount)
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