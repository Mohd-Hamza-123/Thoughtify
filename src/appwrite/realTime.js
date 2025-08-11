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

    async updateComment({ messageid, postid, commentContent, authid }, subComment) {
        try {
            return await this.database.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                messageid,
                {
                    postid,
                    commentContent,
                    subComment,
                    authid
                })
        } catch (error) {
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
    async listComment(postid, lastid) {
        let QueryArr = [Query.limit(4), Query.equal("postId", [`${postid}`]), Query.orderDesc('$createdAt')]
        if (lastid) {
            QueryArr = [Query.limit(4), Query.cursorAfter(lastid), Query.equal("postId", [`${postid}`]), Query.orderDesc('$createdAt')]
        }

        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                QueryArr
            )
        } catch (error) {
            return false
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
        BeforeDate, AfterDate, PostAge, UserID, lastPostID
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


        if (UserID) {
            QueryArr.push(Query.equal("authid", [UserID]))
        }

        try {

            if (QueryArr.length <= 1) return []
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                QueryArr
            )
        } catch (error) {
            return null
        }
    }

}

const realTime = new RealTime()
export default realTime;