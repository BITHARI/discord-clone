import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: "general",
                            profileId: profile.id
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVERS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ serverId: string }> }) {
    try {
        const { serverId } = await params
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                profileId: profile.id
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVERS_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}