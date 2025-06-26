import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ memberId: string }> }) {
    try {
        const { memberId } = await params
        if (!memberId) {
            return new NextResponse("Member ID Missing", { status: 400 })
        }
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get("serverId")
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }
        const { role } = await req.json()
        if (!role) {
            return new NextResponse("Role Missing", { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[MEMBER_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ memberId: string }> }) {
    try {
        const { memberId } = await params
        if (!memberId) {
            return new NextResponse("Member ID Missing", { status: 400 })
        }
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get("serverId")
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[MEMBER_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}