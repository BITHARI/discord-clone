import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Message } from "@prisma/client"
import { NextResponse } from "next/server"

const MESSAGES_BATCH = 15

export async function GET(req: Request) {
    try {
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const channelId = searchParams.get("channelId")
        if (!channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 })
        }
        let messages: Message[] = []
        const cursor = searchParams.get("cursor")
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor : {
                    id : cursor
                },
                where: {
                    channelId,
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }
        let nextCursor = null
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id
        }
        return NextResponse.json({
            items: messages,
            nextCursor
        })
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}