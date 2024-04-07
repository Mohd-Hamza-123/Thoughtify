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
            console.log("PersonalChat :: createChatRoom:: error", error)
            return false
        }
    }

    async updatePersonalChatRoom() {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatParticipantsCollectionId, {
                // chatRoomID : 
            })
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async getPersonalChatRoom(slug) {

        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatParticipantsCollectionId, slug)
        } catch (error) {
            // console.log("Appwrite serive :: getPost :: error", error);
            return null
        }
    }

    async deleteMessage(messageid) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatConverstionsCollectionId, messageid)
        } catch (error) {
            console.log("Personal Chat :: delete Message :: error", error);
            return false
        }
    }



    async getPersonalChatRooms(chatRoomID) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwritePersonalChatParticipantsCollectionId, [
                Query.equal("ChatRoomID", [`${chatRoomID}`])
            ])
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // personal Chat
    async sendPersonalMessage({ text, chatRoomID, username, userId }) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwritePersonalChatConverstionsCollectionId, ID.unique(), {
                text,
                chatRoomID,
                username,
                userId
            })
        } catch (error) {
            console.log("PersonalChat :: sendPersonalMessage :: error", error);
        }
    }

    async listPersonalMessages({ ChatRoomID }) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwritePersonalChatConverstionsCollectionId,
                [
                    Query.equal("chatRoomID", [`${ChatRoomID}`])
                ]
            )
        } catch (error) {
            console.log("PersonalChat :: listPersonalMessages :: error", error);
        }
    }

    subscribeChannel() {
        try {
            let unsubscribe = this.client.subscribe(`databases.${conf.appwriteDatabaseId}.collections.${conf.appwritePersonalChatConverstionsCollectionId}.documents`, (res) => {
                console.log(res)
            })
            unsubscribe()
        } catch (error) {
            console.log("RealTime error in personalChat.js")
        }
    }


}

const personalChat = new PersonalChat()

export default personalChat;
