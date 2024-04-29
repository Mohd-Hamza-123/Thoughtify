import conf from '../conf/conf'
import { Client, Databases, ID } from 'appwrite'

export class FeedbackService {
    client = new Client();
    account

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
    }

    async createFeedBack({ feedback, username, userID, email }) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwrite_Feedback_CollectionId, ID.unique(), {
                feedback,
                username,
                userID,
                email,
            })
        } catch (error) {
            return null
        }
    }

}

const feedbackService = new FeedbackService();
export default feedbackService;