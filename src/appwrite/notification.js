import conf from '../conf/conf'
import { Query, ID, Storage, Client, Databases } from 'appwrite'

export class Notification {
    client = new Client()
    databases;
    storage

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
        this.storage = new Storage(this.client)
    }

    async createNotification({ userID = null, slug = null, content = null, name = null, isRead = false, postID = null, userIDofReceiver = null }) {
        let obj = {}

        if (userID) obj.userID = userID
        if (slug) obj.slug = slug
        if (content) obj.content = content
        if (name) obj.name = name
        if (postID) obj.postID = postID
        if (isRead) obj.isRead = false
        if (userIDofReceiver) obj.userIDofReceiver = userIDofReceiver

        try {
            return this.databases.createDocument(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID, ID.unique(),
                obj
            )
        } catch (error) {
            console.log("Notification error : " + error)
        }
    }

    async getNotification({ userID }) {
        let arr = []
        if (userID) arr.push(Query.equal("userIDofReceiver", userID))
        try {
            const notifications = await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID,
                arr
            )
            return notifications
        } catch (error) {
            console.log("Error in Get Notification : " + error)
        }
    }

}

const notification = new Notification()

export default notification