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

    async createComment({ postid, commentContent, authid, name,
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

}

const realTime = new RealTime()
export default realTime;