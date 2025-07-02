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
        whoCanMsgYou = null,
        trustedResponder = null,
        bookmarks = null
    }) {
        let updateObj = {}
        if (following) updateObj.following = following
        if (blockedUsers) updateObj.blockedUsers = blockedUsers
        if (followers) updateObj.followers = followers

        if (othersCanFilterYourOpinions || othersCanFilterYourOpinions === false) updateObj.othersCanFilterYourOpinions = othersCanFilterYourOpinions
        if (othersCanFilterYourPosts || othersCanFilterYourPosts === false) updateObj.othersCanFilterYourPosts = othersCanFilterYourPosts
        if (othersSeeYourFollowers_Following) updateObj.othersSeeYourFollowers_Following = othersSeeYourFollowers_Following
        if (whoCanMsgYou) updateObj.whoCanMsgYou = whoCanMsgYou
        if (trustedResponder || trustedResponder === false) {
            updateObj.trustedResponder = trustedResponder
        }
        if (bookmarks) updateObj.bookmarks = bookmarks
        console.log(bookmarks)
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteProfileCollectionId, 
                profileID,
                updateObj
            )
        } catch (error) {
            console.log(error?.message)
            return null
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

        let payload = {}
        if (bio) payload.bio = bio
        if (links) payload.links = links
        if (occupation) payload.occupation = occupation
        if (educationLvl) payload.educationLvl = educationLvl
        if (profileImage) payload.profileImage = profileImage
        if (interestedIn) payload.interestedIn = interestedIn

        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                id,
                payload
            )
        } catch (error) {
            return null
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
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, profileID,
                obj
            )
        } catch (error) {
            console.log(error)
            return null
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

        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                QueryArr
            )
            return res
        } catch (error) {
            return null
        }
    }

    async listProfiles({ senderSlug, receiverSlug }) {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId,
                [Query.equal("userIdAuth", [senderSlug, receiverSlug])]
            )
        } catch (error) {
            return null
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
            return null
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
            console.log(error?.message)
            return null
        }
    }

    // storage

    async createBucket({ file }) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updateBucket({ fileid, file }) {
        try {
            return await this.storage.updateFile(conf.appwriteBucketId, fileid, file)
        } catch (error) {

            return false
        }
    }

    async deleteStorage(fileid) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileid)
        } catch (error) {
            return null
        }
    }

    async getStoragePreview(fileid) {
        if (fileid) {
            return this.storage.getFilePreview(conf.appwriteBucketId, fileid)
        }
    }

}

const profile = new Profile()

export default profile;