import conf from '../conf/conf'
import { Query, ID, Storage, Client, Databases } from 'appwrite'

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

    async createProfile({
        name,
        userId,
        profileImage
    }) {

        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                userId,
                {
                    name,
                    profileImage
                })
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateEveryProfileAttribute({
        profileID = null,
        following = null,
        blockedUsers = null,
        followers = null,
        othersCanFilterYourOpinions = null,
        othersCanFilterYourPosts = null,
        othersSeeYourFollowers_Following = null,
        bookmarks = []
    }) {

        let updateObj = {}
        const profile = {
            ...(following && { following }),
            ...(blockedUsers && { blockedUsers }),
            ...(followers && { followers }),
            ...(othersCanFilterYourOpinions && { othersCanFilterYourOpinions }),
            ...(othersCanFilterYourPosts && { othersCanFilterYourPosts }),
            ...(othersSeeYourFollowers_Following && { othersSeeYourFollowers_Following }),
            ...(bookmarks && { bookmarks })
        }


        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                profileID,
                profile
            )
        } catch (error) {

            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }

            throw error
        }
    }

    async updateProfile(id, {
        bio,
        links,
        occupation,
        educationLvl,
        interestedIn,
        profileImage,
    }) {

        let payload = {
            ...(bio && { bio }),
            ...(links && { links }),
            ...(occupation && { occupation }),
            ...(educationLvl && { educationLvl }),
            ...(profileImage && { profileImage }),
            ...(interestedIn && { interestedIn })
        }

        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                id,
                payload
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async updateProfileWithQueries({
        profileID,
        likedQuestions,
        dislikedQuestions,
        bookmarks }) {
        let obj = {}
        if (likedQuestions) obj.likedQuestions = likedQuestions
        if (dislikedQuestions) obj.dislikedQuestions = dislikedQuestions
        if (bookmarks) obj.bookmarks = bookmarks
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                profileID,
                obj
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async listProfile({ slug, name }) {

        let QueryArr = [];

        if (slug) QueryArr.push(Query.equal("$id", [slug]))
        if (name) QueryArr.push(Query.equal("name", [name]))

        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                QueryArr
            )
            return res
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async listProfiles({ senderSlug, receiverSlug }) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId,
                [Query.equal("userIdAuth", [senderSlug, receiverSlug])]
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async listProfilesWithQueries({ listResponders }) {

        let QueryArr = []
        if (listResponders === true) QueryArr.push(Query.equal("trustedResponder", true))

        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                QueryArr
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async getProfileById({ $id, query = [] }) {
        try {

            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                $id,
                [
                    Query.select(query)
                ]
            )

        } catch (error) {

            const errMessage = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(errMessage)
            }

            throw new Error("Profile not found", {
                cause: error
            })
        }
    }

    async listSingleProfile(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                slug,

            )
        } catch (error) {
            const errMessage = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(errMessage)
            }
            throw new Error(errMessage)
        }
    }

    // storage

    async createBucket({ file }) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async updateBucket({ fileid, file }) {
        try {
            return await this.storage.updateFile(conf.appwriteBucketId, fileid, file)
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async deleteStorage(fileid) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileid)
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw new Error(message)
        }
    }

    async getStoragePreview(fileid) {
        return this.storage.getFilePreview(conf.appwriteBucketId, fileid)
    }

}

const profile = new Profile()

export default profile;