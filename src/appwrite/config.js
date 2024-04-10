import conf from '../conf/conf'
import { Query, ID, Storage, Client, Databases } from 'appwrite'

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

    async createPost({ title, content, slug, userId, queImage, name, opinionsFrom, status, queImageID, pollQuestion, pollOptions, pollAnswer, profileImgID, date }, category) {
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
                date
                // commentBody: ["hello", "how are you"]
            })
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error)
        }
    }
    async updatePost(slug, { title, content, queImageID, pollOptions, pollQuestion, opinionsFrom, status, pollAnswer, queImage }, category) {
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
                queImage
            })
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }
    async updatePostViews(postId, views, commentCount) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, postId, {
                views,
                commentCount
            })
        } catch (error) {
            console.log(error)
        }
    }
    async updatePostWithQueries({ pollOptions, postId, totalPollVotes, pollVotersID }) {
        console.log(pollOptions)
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, postId, {
                pollOptions,
                totalPollVotes,
                pollVotersID
            })
        } catch (error) {
            console.log(error)
        }
    }
    async updatePost_Like_DisLike({ postId, like, dislike }) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, postId, {
                like,
                dislike,
            })
        } catch (error) {
            console.log("UpdatePost_like_dislike_bookmark" + error)
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
    // Infinte Scroll
    async getPosts(lastPostID) {
        // console.log(lastPostID)
        let QueryArr = [Query.limit(4), Query.orderDesc(`$createdAt`), Query.equal("status", ['public'])]
        if (lastPostID) {
            QueryArr = [Query.limit(4), Query.orderDesc(`$createdAt`), Query.cursorAfter(lastPostID), Query.equal("status", ['public'])]
        }
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId,
                QueryArr
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }
    async getPostsWithQueries({ Title, category,
        BeforeDate, AfterDate, From, To, PostAge, Viewed,
        Commented, UserID, Like_Dislike, lastPostID,
    }) {
       
        let QueryArr = [Query.limit(5)]
        if (lastPostID) {
            QueryArr.push(Query.cursorAfter(lastPostID))
        }
        if (Like_Dislike === 'Most Liked') {
            QueryArr.push(Query.orderDesc("like"))
        } else if (Like_Dislike === 'Most Disliked') {
            QueryArr.push(Query.orderDesc("dislike"))
        }
        if (Title) QueryArr.push(Query.startsWith("title", Title))
        if (category !== 'All Category') { QueryArr.push(Query.equal('category', [`${category}`])) }

        if (BeforeDate) QueryArr.push(Query.lessThanEqual('date', BeforeDate))
        if (AfterDate) QueryArr.push(Query.greaterThanEqual('date', AfterDate))
        if (From && To) {
            QueryArr.push(Query.greaterThanEqual('date', From))
            QueryArr.push(Query.lessThanEqual('date', To))
        }
        if (PostAge === "Oldest") { QueryArr.push(Query.orderAsc("$createdAt")) } else if (PostAge === 'Recent') {
            QueryArr.push(Query.orderDesc("$createdAt"))
        }
        if (Viewed === 'MostViewed') {
            QueryArr.push(Query.orderDesc("views"))
        }
        else if (Viewed === 'lessViewed') {
            QueryArr.push(Query.orderAsc("views"))
        }
        if (Commented === 'Most Commented') {
            QueryArr.push(Query.orderDesc("commentCount"))
        } else if (Commented === 'Least Commented') {
            QueryArr.push(Query.orderAsc('commentCount'))
        }
        if (UserID) {
            QueryArr.push(Query.equal("userId", [UserID]))
        }

        console.log(QueryArr)
        try {

            if (QueryArr.length < 1) return []
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId,
                QueryArr
            )
        } catch (error) {
            console.log("Appwrite serive :: getPostsWithQueries :: error", error);
            return null
        }
    }
    async getPostWithBookmark(postID) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, postID
            )
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
