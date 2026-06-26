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

    async createComment(payload) {
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                ID.unique(),
                payload
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
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
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
        }
    }

    async deleteComment(documentid) {
        try {
            return await this.database.deleteDocument(conf.appwriteDatabaseId, conf.appwriteNewCollectionId, documentid)
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
        }
    }

    async getSingleComment(documentid) {
        try {
            return await this.database.getDocument(conf.appwriteDatabaseId, conf.appwriteNewCollectionId, documentid)
        } catch (error) {
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
        }
    }

    async listComment(postId, lastId) {

        let QueryArr = [
            Query.limit(4),
            Query.equal("postId", [`${postId}`]),
            Query.orderDesc("$createdAt"),
            Query.select([
                "$id",
                "name",
                "commentContent",
                "subComment",
                "profile.profileImage"
            ])
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
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
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
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
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
            const message = error instanceof Error ? error.message : error
            if (import.meta.env.DEV) {
                console.log(message)
            }
            throw error
        }
    }

}

const realTime = new RealTime()
export default realTime;