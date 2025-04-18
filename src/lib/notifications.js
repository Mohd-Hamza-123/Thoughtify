import notification from "@/appwrite/notification";

export const updateNotification = async (notificationID) => {
    notification
        .updateNotification({ notificationID, isRead: true })
        .then((res) => {
            const newNotificationArr = notifications?.map((note) => {
                if (note.$id !== notificationID) {
                    return note;
                } else {
                    return res;
                }
            });
            return newNotificationArr
        }).catch((err) => [])
};

