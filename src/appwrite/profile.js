import conf from '../conf/conf'
import { Account, Query, ID, Storage, Client, Databases } from 'appwrite'

export class Profile {
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

    async createProfile({ bio, links, educationLvl, interestedIn, occupation, userIdAuth, gender, featuredImgId, name }) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, ID.unique(), {
                bio,
                userIdAuth,
                gender,
                name
            })
        } catch (error) {
            console.log("Appwrite serive :: createProfile :: profile.js :: error", error)
        }
    }

    async updateProfile(id, { bio }) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, id, {
                bio
            })
        } catch (error) {
            console.log("Appwrite serive :: updateProfile :: profile.js :: error", error);
        }
    }

    async listProfile({ slug }) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId,
                [Query.equal("userIdAuth", [`${slug}`])]
            )
        } catch (error) {
            console.log("Appwrite serive :: listProfile :: profile.js :: error", error);
        }
    }

    // storage

    async createBucket({ file }) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch (error) {
            console.log("Appwrite serive :: createBucket :: config.js :: error", error);
            return false
        }
    }

    async deleteStorage({ fileid }) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileid)
        } catch (error) {

        }
    }

    async getStoragePreview(fileid) {
        return this.storage.getFilePreview(conf.appwriteBucketId, fileid)
    }

}

const profile = new Profile()

export default profile;