import conf from '../conf/conf'
import { Account, Query, ID, Storage, Client, Databases } from 'appwrite'

export class Service {
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

    async createPost({ title, content, slug, userId, queImage, name, opinionsFrom, status, queImageID, pollQuestion, pollOptions, pollAnswer, profileImgID, gender }, category) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, ID.unique(), {
                title,
                content,
                userId,
                queImage,
                name,
                category,
                opinionsFrom,
                status,
                queImageID,
                pollOptions,
                pollQuestion,
                pollAnswer,
                profileImgID,
                gender
                // commentBody: ["hello", "how are you"]
            })
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error)
        }
    }

    async updatePost(slug, { title, content, queImageID, pollOptions, pollQuestion, opinionsFrom, status, pollAnswer }, category) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
                title,
                content,
                category,
                queImageID,
                pollOptions,
                pollQuestion,
                opinionsFrom,
                status,
                pollAnswer,
            })
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts() {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId)
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }


    async createThumbnail({ file }) {
        try {
            return await this.storage.createFile(conf.appwriteBucketIdThumbnail, ID.unique(), file)
        } catch (error) {
            console.log("Appwrite serive :: createBucket :: config.js :: error", error);
            return false
        }
    }

    async updateThumbnail(fileID, file) {
        try {
            return await this.storage.updateFile(conf.appwriteBucketIdThumbnail, fileID, 'HElloWorld')
        } catch (error) {
            console.log("Appwrite serive :: updateBucket :: config.js :: error", error);
            return false
        }
    }

    async deleteThumbnail(fileid) {

        try {
            return await this.storage.deleteFile(conf.appwriteBucketIdThumbnail, fileid)
        } catch (error) {
            console.log("Appwrite serive :: deleteBucket :: config.js :: error", error);
            return false
        }
    }
    async getThumbnailPreview(fileid) {
        return this.storage.getFilePreview(conf.appwriteBucketIdThumbnail, fileid)
    }

}

const appwriteService = new Service()

export default appwriteService;
