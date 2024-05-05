import conf from '../conf/conf'
import { Account, Query, ID, Storage, Client, Databases } from 'appwrite'

export class PersonalChat {
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

    async createPersonalChatRoom({ ChatRoomID }, participantsDetails) {

        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatParticipantsCollectionId, ChatRoomID, {
                participantsDetails
            })
        } catch (error) {
            return false
        }
    }

    async getPersonalChatRoom(slug) {

        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatParticipantsCollectionId, slug)
        } catch (error) {
            return null
        }
    }

    async deleteMessage(messageid) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatConverstionsCollectionId, messageid)
        } catch (error) {

            return false
        }
    }

    async getPersonalChatRooms(chatRoomID) {
        if (!chatRoomID) return false
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwritePersonalChatParticipantsCollectionId, [
                Query.equal("ChatRoomID", [`${chatRoomID}`])
            ])
        } catch (error) {

            return false
        }
    }

    async sendPersonalMessage({ text, chatRoomID, username, userId, participantsIDs,createdDateTime }) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatConverstionsCollectionId, ID.unique(), {
                text,
                chatRoomID,
                username,
                userId,
                participantsIDs,
                createdDateTime
            })
        } catch (error) {
            return null
        }
    }

    async listPersonalMessages({ ChatRoomID, limit, notEqualArr }) {

        if (!ChatRoomID) return null

        let arr = []

        if (ChatRoomID) {
            arr.push(Query.equal("chatRoomID", [`${ChatRoomID}`]))
        }
        if (limit) {
            arr.push(Query.orderAsc('$createdAt'));
        }
        if (notEqualArr?.length > 0) {
            for (let i = 0; i < notEqualArr?.length; i++) {
                arr.push(Query.notEqual("$id", [`${notEqualArr[i]}`]))
            }
        }

        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwritePersonalChatConverstionsCollectionId,
                arr
            )
        } catch (error) {
            return null
        }
    }

}

const personalChat = new PersonalChat()

export default personalChat;
