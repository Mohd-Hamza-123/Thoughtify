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
            console.log("getFlag Error in avatars.js", error)
        }
    }

    async profileAvatar() {
        try {
            return this.avatars.getInitials()
        } catch (error) {
            console.log("ProfileAvatar Error in avatars.js", error)
        }
    }
}

const avatar = new Avatar();
export default avatar;

