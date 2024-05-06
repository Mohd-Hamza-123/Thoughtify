import conf from '../conf/conf'
import { Query, Storage, Client, Databases } from 'appwrite'

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


}

const personalChat = new PersonalChat()

export default personalChat;
