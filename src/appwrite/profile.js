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

    async createProfile({ bio, links, educationLvl, interestedIn, occupation, userIdAuth, gender, featuredImgId, name, profileImgID, profileImgURL }) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, ID.unique(), {
                userIdAuth,
                gender,
                name,
                profileImgID,
                profileImgURL
            })
        } catch (error) {
            console.log("Appwrite serive :: createProfile :: profile.js :: error", error)
        }
    }

    async updateEveryProfileAttribute({ profileID = null, following = null, blockedUsers = null, followers }) {
        let updateObj = {}
        if (following) {
            updateObj.following = following
        }
        if (blockedUsers) {
            updateObj.blockedUsers = blockedUsers
        }
        if (followers) {
            updateObj.followers = followers
        }
        console.log(updateObj)
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, profileID,
                updateObj
            )
        } catch (error) {
            console.log("Appwrite serive :: updateProfile :: profile.js :: error", error);
        }
    }
    async updateProfile(id, { bio, educationLvl, occupation,
        profileImgID, profileImgURL
    }, links, interestedIn) {
        // console.log(profileImgID)
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, id, {
                bio,
                links,
                educationLvl,
                occupation,
                interestedIn,
                profileImgID,
                profileImgURL
            })
        } catch (error) {
            console.log("Appwrite serive :: updateProfile :: profile.js :: error", error);
        }
    }
    async updateProfileWithQueries({ profileID, likedQuestions, dislikedQuestions, bookmarks }) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, profileID, {
                likedQuestions,
                dislikedQuestions,
                bookmarks,
            })
        } catch (error) {
            console.log("Appwrite serive :: updateProfile :: profile.js :: error", error);
        }
    }
    async listProfile({ slug, name }) {
        // console.log(name)
        let QueryArr = []
        if (slug) {
            QueryArr.push(Query.equal("userIdAuth", [`${slug}`]))
        }
        if (name) {
            QueryArr.push(Query.equal("name", [`${name}`]))
        }
        // console.log(QueryArr)
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId,
                QueryArr
            )
        } catch (error) {
            console.log("Appwrite serive :: listProfile :: profile.js :: error", error);
        }
    }

    async listProfiles({ senderSlug, receiverSlug }) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId,
                [Query.equal("userIdAuth", [senderSlug, receiverSlug])]
            )
        } catch (error) {
            console.log("Appwrite serive :: listProfile :: profile.js :: error", error);
        }
    }
    async listProfilesWithQueries({ listResponders }) {
        let QueryArr = []
        if (listResponders === true) QueryArr.push(Query.equal("trustedResponder", true))
        // console.log(QueryArr)
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId,
                QueryArr
            )
        } catch (error) {
            console.log("Appwrite serive :: listProfilesWithQueries :: profile.js :: error", error);
        }
    }
    async listSingleProfile(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                slug
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

    async updateBucket({ fileid, file }) {
        try {
            return await this.storage.updateFile(conf.appwriteBucketId, fileid, file)
        } catch (error) {
            console.log("Appwrite serive :: updateBucket :: config.js :: error", error);
            return false
        }
    }

    async deleteStorage(fileid) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileid)
        } catch (error) {

        }
    }

    async getStoragePreview(fileid) {
        // console.log(fileid)
        if (fileid) {
            return this.storage.getFilePreview(conf.appwriteBucketId, fileid)
        }
    }

}

const profile = new Profile()

export default profile;