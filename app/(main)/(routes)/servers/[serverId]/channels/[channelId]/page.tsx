import ChatHeader from "@/components/chat/ChatHeader"
import ChatInput from "@/components/chat/ChatInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { MediaRoom } from "@/components/media-room"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function page({
    params
}: { params: Promise<{ serverId: string, channelId: string }> }) {

    const { serverId, channelId } = await params
    const profile = await currentProfile()
    if (!profile) {
        return redirect(`/sign-in?fallbackUrl=/servers/${serverId}/channels/${channelId}`)
    }

    const channel = await db.channel.findUnique({
        where: {
            id: channelId,
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        }
    })

    if (!channel || !member) {
        return redirect(`/`)
    }

    return (
        <div className="h-full bg-white dark:bg-[#313338] flex flex-col">
            <ChatHeader
                serverId={serverId}
                name={channel.name}
                type="channel"
            />
            {channel.type === "TEXT" && (
                <>
                    <ChatMessages
                        name={channel.name}
                        member={member}
                        chatId={channel.id}
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channelId,
                            serverId: serverId
                        }}
                        paramKey="channelId"
                        paramValue={channelId}
                        type="channel"
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{ channelId: channelId, serverId: serverId }}
                    />
                </>
            )}
            {channel.type === "AUDIO" && (
                <MediaRoom chatId={channel.id} video={false} audio={true} />
            )}
            {channel.type === "VIDEO" && (
                <MediaRoom chatId={channel.id} video={true} audio={true} />
            )}
        </div>
    )
}
