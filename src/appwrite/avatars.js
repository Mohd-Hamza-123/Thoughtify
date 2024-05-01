import conf from "../conf/conf";
import { Client, Avatars } from 'appwrite'
export class Avatar {

    client = new Client();
    avatars;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.avatars = new Avatars(this.client)
    }

    async getFlag(flag, width, height) {
        try {
            return this.avatars.getFlag(flag, width, height, 100)
        } catch (error) {
            return null
        }
    }

    async profileAvatar(name) {
        try {
            return this.avatars.getInitials(name)
        } catch (error) {
            return null
        }
    }
}

const avatar = new Avatar();
export default avatar;

