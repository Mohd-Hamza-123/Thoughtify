import conf from "@/conf/conf";
import { Client, Avatars } from "appwrite";

class AvatarService {
    
    client = new Client()
    avatar = new Avatars(this.client)

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
    }

    createAvatar({ name }) {
        try {
            const avatar = this.avatar.getInitials(name)
            return avatar
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
    }
}

const avatarService = new AvatarService();
export default avatarService;