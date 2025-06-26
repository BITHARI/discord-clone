import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import ServerHeader from "./ServerHeader"
import { ScrollArea } from "../ui/scroll-area"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { ChannelType, MemberRole } from "@prisma/client"
import ServerSearch from "./ServerSearch"
import { Separator } from "../ui/separator"
import ServerSection from "./ServerSection"
import ServerChannel from "./ServerChannel"
import ServerMember from "./ServerMember"

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {

    const profile = await currentProfile()
    if (!profile) {
        return redirect('/')
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === 'TEXT')
    const audioChannels = server?.channels.filter((channel) => channel.type === 'AUDIO')
    const videoChannels = server?.channels.filter((channel) => channel.type === 'VIDEO')

    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect('/')
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role
    return <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role!} />
        <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
                <ServerSearch
                    data={[
                        {
                            label: 'Canaux de texte',
                            type: 'channel',
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Canaux audio',
                            type: 'channel',
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Canaux vidéo',
                            type: 'channel',
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Membres',
                            type: 'member',
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        }
                    ]}
                />
            </div>
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            {!!textChannels?.length && <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType="TEXT"
                        role={role!}
                        label="Canaux de texte"
                        server={server}
                    />
                    {textChannels?.map(channel => (
                        <ServerChannel key={channel.id} channel={channel} role={role!} server={server} />
                    ))}
                </div>
            }
            {!!audioChannels?.length && <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType="AUDIO"
                        role={role!}
                        label="Canaux audio"
                        server={server}
                    />
                    {audioChannels?.map(channel => (
                        <ServerChannel key={channel.id} channel={channel} role={role!} server={server} />
                    ))}
                </div>
            }
            {!!videoChannels?.length && <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType="VIDEO"
                        role={role!}
                        label="Canaux video"
                        server={server}
                    />
                    {videoChannels?.map(channel => (
                        <ServerChannel key={channel.id} channel={channel} role={role!} server={server} />
                    ))}
                </div>
            }
            {!!members?.length && <div className="mb-2">
                    <ServerSection
                        sectionType="members"
                        role={role!}
                        label="Membres"
                        server={server}
                    />
                    {members?.map(member => (
                        <ServerMember key={member.id} member={member} server={server} />
                    ))}
                </div>
            }
        </ScrollArea>
    </div>
}
