import ChatHeader from "@/components/chat/ChatHeader"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function MemberPage({
    params
}: { params: Promise<{ serverId: string, memberId: string }> }) {

    const { serverId, memberId } = await params
    const profile = await currentProfile()
    if (!profile) {
        return redirect(`/sign-in?fallbackUrl=/servers/${serverId}/conversations/${memberId}`)
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) {
        return redirect(`/`)
    }

    const conversation = await getOrCreateConversation(currentMember.id, memberId)

    if (!conversation) {
        return redirect(`/servers/${serverId}`)
    }

    const {memberOne, memberTwo} = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className="h-full bg-white dark:bg-[#313338] flex flex-col">
            <ChatHeader
                serverId={serverId}
                name={otherMember.profile.name}
                imageUrl={otherMember.profile.imageUrl}
                type="conversation"
            />
        </div>
    )
}
