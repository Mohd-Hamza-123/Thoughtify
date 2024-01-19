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

    async createComment({ postid, commentContent, authid, name
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
                    name
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

    async listComment(postid, lastid, firstid) {
        try {
            if (lastid === undefined && firstid === undefined) {
                return await this.database.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteNewCollectionId,
                    [
                        Query.equal('postid', `${postid}`),
                        Query.limit(5),
                    ])
            }
            else if (lastid) {
                console.log("after page")
                let res = await this.database.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteNewCollectionId,
                    [
                        Query.equal('postid', `${postid}`),
                        Query.limit(5),
                        Query.cursorAfter(lastid),
                    ])
                if (res.documents.length === 0) {
                    return undefined
                }
                return res
            } else if (firstid) {
                console.log("previous page")
                let res = await this.database.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteNewCollectionId,
                    [
                        Query.equal('postid', `${postid}`),
                        Query.limit(5),
                        Query.cursorBefore(firstid),
                    ])
                console.log(res)
                if (res.documents.length === 0) {
                    return undefined
                }
                return res
            }
        } catch (error) {
            console.log("listCommnets error in realtime.js")
        }
    }


    async subscribeChannel() {
        try {
            this.client.subscribe(`databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`, (res) => {
                console.log(res)
            })
        } catch (error) {
            console.log("RealTime error in realtime.js")
        }
    }
}

const realTime = new RealTime()
export default realTime;