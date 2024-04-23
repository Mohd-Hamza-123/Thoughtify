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

    async createNotification({ userID = null, slug = null, content = null, name = null, isRead = false, postID = null, userIDofReceiver = null, userProfilePic = null }) {
        let obj = {}

        if (userID) obj.userID = userID
        if (slug) obj.slug = slug
        if (content) obj.content = content
        if (name) obj.name = name
        if (postID) obj.postID = postID
        if (isRead) obj.isRead = false
        if (userIDofReceiver) obj.userIDofReceiver = userIDofReceiver
        if (userProfilePic) obj.userProfilePic = userProfilePic

        try {
            return this.databases.createDocument(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID, ID.unique(),
                obj
            )
        } catch (error) {
            console.log("Notification error : " + error)
        }
    }

    async getNotification({ userID, limit = null }) {
        let arr = [Query.orderDesc("$createdAt")];

        if (userID) arr.push(Query.equal("userIDofReceiver", userID));

        if (limit) {
            arr = [
                Query.orderAsc("$createdAt"),
                Query.equal("userIDofReceiver", userID),
                Query.limit(limit)
            ]
        }
        try {
            const notifications = await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID,
                arr
            )
            return notifications
        } catch (error) {
            console.log("Error in Get Notification : " + error)
        }
    }
    async deleteNotication({ notificationID }) {

        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID, notificationID)
        } catch (error) {
            console.log("Error in Deleting Notification : " + error)
        }
    }
    async updateNotification({ notificationID, isRead }) {
        let obj = {}
        if (isRead) {
            obj.isRead = isRead
        }
        try {
            return this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID, notificationID,
                obj
            )
        } catch (error) {
            console.log("Notification error : " + error)
        }
    }
}

const notification = new Notification()

export default notification