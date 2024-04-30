
const conf = {
    appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteNewCollectionId: String(import.meta.env.VITE_APPWRITE_NEWCOLLECTION_ID),
    appwriteProfileCollectionId: String(import.meta.env.VITE_APPWRITE_PROFILECOLLECTION_ID),
    appwriteBucketIdThumbnail: String(import.meta.env.VITE_APPWRITE_BUCKET_ID_THUMBNAIL),
    appwritePersonalChatParticipantsCollectionId: String(import.meta.env.VITE_APPWRITE_PERSONALCHATPARTICIPANTS_COLLECTION_ID),
    appwritePersonalChatConverstionsCollectionId: String(import.meta.env.VITE_APPWRITE_PERSONALCHAT_CONVERSATIONS_COLLECTION_ID),
    appwrite_Feedback_CollectionId: String(import.meta.env.VITE_APPWRITE_FEEDBACK_COLLECTION_ID),
    appwrite_Notification_CollectionID: String(import.meta.env.VITE_APPWRITE_NOTIFICATION_COLLECTION_ID),
    unsplashApiKey: String(import.meta.env.VITE_UNSPLASH_API_KEY),
    myPrivateUserID: String(import.meta.env.VITE_MY_PRIVATE_USER_ID),
    tinyMCEapiKey: String(import.meta.env.VITE_TINYMCE_API_KEY)
}
// console.log(conf)
export default conf;