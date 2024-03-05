async function generateChatroomId(user1Id, user2Id) {
    // Sort user IDs alphabetically
    const sortedUserIds = [user1Id, user2Id].sort();

    // Concatenate user IDs
    const concatenatedIds = sortedUserIds.join('');

    // Convert the concatenated string to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(concatenatedIds);

    try {
        // Generate a SHA-256 hash using the Web Crypto API
        const buffer = await crypto.subtle.digest('SHA-256', data);

        // Convert the hash buffer to a hex string
        const hashArray = Array.from(new Uint8Array(buffer));
        const chatroomId = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        // Limit the length to 36 characters
        const truncatedChatroomId = chatroomId.substring(0, 36);

        return truncatedChatroomId;
    } catch (error) {
        console.error('Error generating chatroom ID:', error);
        // Handle the error as needed
        return null;
    }
}

export default generateChatroomId