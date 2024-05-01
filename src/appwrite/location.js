import conf from "../conf/conf";
import { Client, Locale } from "appwrite";
export class Location {
    client = new Client()
    locale

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.locale = new Locale(this.client)
    }

    async GetLocation() {
        try {
            return await this.locale.get()
        } catch (error) {
            return null
        }
    }

}

const location = new Location()
export default location