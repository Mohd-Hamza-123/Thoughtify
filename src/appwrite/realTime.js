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

    async createComment({ postid, commentContent, authid, name, date, category
    }) {
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteNewCollectionId,
                ID.unique(),
                {
                    postid,
                    commentContent,
                    authid,
                    subComment: [],
                    name,
                    date,
                    category,
                }
            )
        } catch (error) {
            console.log("createComment error in realtime.js")
        }
    }

    async updateComment({ messageid, postid, commentContent, textAreaVisible, authid }, subComment) {
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
            console.log("updateComment error in realtime.js")
        }
    }

    async deleteComment(documentid) {
        try {
            return await this.database.deleteDocument(conf.appwriteDatabaseId, conf.appwriteNewCollectionId, documentid)
        } catch (error) {
            console.log("DeleteComment error in realtime.js")
        }
    }

    async getSingleComment(documentid) {
        try {
            return await this.database.getDocument(conf.appwriteDatabaseId, conf.appwriteNewCollectionId, documentid)
        } catch (error) {
            console.log("DeleteComment error in realtime.js")
        }
    }
    async listComment(postid, lastid, IgnoredCommentsIDs) {
        let QueryArr = [Query.limit(4), Query.equal("postid", [`${postid}`]), Query.orderDesc('$createdAt')]
        if (lastid) {
            QueryArr = [Query.limit(4), Query.cursorAfter(lastid), Query.equal("postid", [`${postid}`]), Query.orderDesc('$createdAt')]
        }
        // return
        try {
            try {
                return await this.database.listDocuments(conf.appwriteDatabaseId, conf.appwriteNewCollectionId,
                    QueryArr
                )
            } catch (error) {
                console.log("Appwrite serive :: getPosts :: error", error);
                return false
            }

        } catch (error) {
            console.log("listCommnets error in realtime.js")
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
            console.log("customProfileFilter error in realtime.js")
        }
    }

    async getCommentsWithQueries({ Title, category,
        BeforeDate, AfterDate, PostAge, UserID, lastPostID
    }) {
        // console.log(lastPostID)
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
            console.log("Appwrite serive :: getPostsWithQueries :: error", error);
            return null
        }
    }

}

const realTime = new RealTime()
export default realTime;