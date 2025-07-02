import conf from "../conf/conf";
import { Client, ID, Databases, Query } from 'appwrite';

export class RealTime {
    client = new Client();
    database;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.database = new Databases(this.client)
    }

    async createComment({
        postId,
        commentContent,
        authId,
        name,
        category
    }) {
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                ID.unique(),
                {
                    name,
                    postId,
                    authId,
                    category,
                    commentContent,
                    subComment: [],
                }
            )
        } catch (error) {
            console.log(error?.message)
            return null
        }
    }

    async updateComment({
        commentId,
        subComment,
    }) {
        const payload = {}
        if (subComment) payload.subComment = subComment
        try {
            return await this.database.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                commentId,
                payload
            )
        } catch (error) {
            console.log(error?.message)
            return null
        }
    }

    async deleteComment(documentid) {
        try {
            return await this.database.deleteDocument(conf.appwriteDatabaseId, conf.appwriteNewCollectionId, documentid)
        } catch (error) {
            return null
        }
    }

    async getSingleComment(documentid) {
        try {
            return await this.database.getDocument(conf.appwriteDatabaseId, conf.appwriteNewCollectionId, documentid)
        } catch (error) {
            return null
        }
    }

    async listComment(postId, lastId) {

        console.log(lastId)
        
        let QueryArr = [
            Query.limit(4),
            Query.equal("postId", [`${postId}`]),
            Query.orderDesc("$createdAt")
        ]

        if (lastId) {
            QueryArr = [
                Query.limit(4),
                Query.cursorAfter(lastId),
                Query.equal("postId", [`${postId}`]),
                Query.orderDesc("$createdAt")
            ]
        }

        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                QueryArr
            )
        } catch (error) {
            console.log(error?.message)
            return null
        }
    }

    async customCommentFilter(queryArr) {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                queryArr
            )
        } catch (error) {
            return null
        }
    }

    async getCommentsWithQueries({ Title, category,
        BeforeDate, AfterDate, PostAge, userID, lastPostID
    }) {

        let QueryArr = [Query.limit(5)];
        if (lastPostID) {
            QueryArr.push(Query.cursorAfter(lastPostID))
        }

        if (Title) QueryArr.push(Query.startsWith("title", Title))
        if (category !== 'All Category' && category !== undefined) QueryArr.push(Query.equal('category', [`${category}`]))
        if (BeforeDate) QueryArr.push(Query.lessThanEqual('date', BeforeDate))
        if (AfterDate) QueryArr.push(Query.greaterThanEqual('date', AfterDate))

        if (PostAge === "Oldest") { QueryArr.push(Query.orderAsc("$createdAt")) } else if (PostAge === 'Recent') {
            QueryArr.push(Query.orderDesc("$createdAt"))
        }


        if (userID) {
            QueryArr.push(Query.equal("authId", [userID]))
        }

        try {

            if (QueryArr.length <= 1) return []
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                QueryArr
            )
        } catch (error) {
            console.log(error?.message)
            return null
        }
    }

}

const realTime = new RealTime()
export default realTime;