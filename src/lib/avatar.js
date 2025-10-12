import avatarService from "@/appwrite/avatar";

export function getAvatar(name) {
    const avatar = avatarService.createAvatar({ name })
    return avatar.href || "NoProfile.png"
}

