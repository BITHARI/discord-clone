import ChatHeader from "@/components/chat/ChatHeader"
import ChatInput from "@/components/chat/ChatInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { MediaRoom } from "@/components/media-room"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface MemberPageProps {
    params: Promise<{
        serverId: string
        memberId: string
    }>,
    searchParams: Promise<{
        video?: string
    }>
}

export default async function MemberPage({
    params,
    searchParams
}: MemberPageProps) {

    const { serverId, memberId } = await params
    const { video } = await searchParams
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

    const { memberOne, memberTwo } = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className="h-full bg-white dark:bg-[#313338] flex flex-col">
            <ChatHeader
                serverId={serverId}
                name={otherMember.profile.name}
                imageUrl={otherMember.profile.imageUrl}
                type="conversation"
            />
            {!video
                ? <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        type='conversation'
                        chatId={conversation.id}
                        apiUrl={`/api/direct-messages`}
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{ conversationId: conversation.id }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl={`/api/socket/direct-messages`}
                        query={{ conversationId: conversation.id }}
                    />
                </>
                : <MediaRoom chatId={conversation.id} video={true} audio={true} />
            }
        </div>
    )
}
