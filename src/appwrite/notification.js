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

    async createNotification({
        name = null,
        slug = null,
        userID = null,
        postID = null,
        content = null,
        isRead = false,
        userProfilePic = null,
        userIDofReceiver = null,
    }) {

        const notification = {
            isRead,
            ...(userID && { userID }),
            ...(slug && { slug }),
            ...(content && { content }),
            ...(name && { name }),
            ...(postID && { postID }),
            ...(userProfilePic && { userProfilePic }),
            ...(userIDofReceiver && { userIDofReceiver }),
        }

        try {
            return this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwrite_Notification_CollectionID,
                ID.unique(),
                notification,
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async getNotification({ userID, limit = null }) {

        let arr = [Query.orderDesc("$createdAt")];

        if (userID) {
            arr.push(Query.equal("userIDofReceiver", userID))
            arr.push(Query.notEqual("userID", userID));
        }

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
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async deleteNotication({ notificationID }) {

        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID, notificationID)
        } catch (error) {
            return null
        }
    }
    async updateNotification({ notificationID, isRead }) {

        try {
            return this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwrite_Notification_CollectionID, notificationID,
                {
                    isRead
                }
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }
}

const notification = new Notification()

export default notification