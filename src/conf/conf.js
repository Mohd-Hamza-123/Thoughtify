
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
    appwritePersonalChatConverstionsCollectionId: String(import.meta.env.VITE_APPWRITE_PERSONALCHAT_CONVERSATIONS_COLLECTION_ID)
}

export default conf;