import { db } from "./db";

export async function findConversation(memberOneId: string, memberTwoId: string) {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
        return null
    }
}


export async function createConversation(memberOneId: string, memberTwoId: string) {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
        return null
    }
}


export async function getOrCreateConversation(memberOneId: string, memberTwoId: string) {
    const conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)
    return conversation || await createConversation(memberOneId, memberTwoId)
}