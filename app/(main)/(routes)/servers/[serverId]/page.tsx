import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function ServerPage({
    params
}: {
    params: Promise<{ serverId: string }>
}) {
    const { serverId } = await params
    const profile = await currentProfile()

    if (!profile) {
        return redirect(`/sign-in?fallbackUrl=/servers/${serverId}`)
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }, include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                },
                where: {
                    name: "general"
                }
            }
        }
    })

    const initialChannel = server?.channels[0]

    if (initialChannel?.name !== "general") {
        return null
    }

    return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}
