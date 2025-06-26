'use client'

import { cn } from "@/lib/utils"
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import ActionTooltip from "../action-tooltip"
import { useModal } from "@/hooks/use-modal-store"

interface ServerChannelProps {
    channel: Channel,
    server: Server,
    role?: MemberRole
}
const classname = "mr-2 h-4 w-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400"
const iconMap: Record<ChannelType, React.ReactNode> = {
    [ChannelType.TEXT]: <Hash className={classname} />,
    [ChannelType.AUDIO]: <Mic className={classname} />,
    [ChannelType.VIDEO]: <Video className={classname} />
}

export default function ServerChannel({
    channel,
    server,
    role
}: ServerChannelProps) {

    const params = useParams()
    const router = useRouter()
    const {onOpen} = useModal()

    const handleAction = (e: React.MouseEvent, callback : (params?: any) => void) => {
        e.stopPropagation()
        callback()
    }

    return (
        <button
            onClick={() => router.push(`/servers/${server.id}/channels/${channel.id}`)}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700/60"
            )}>
            {iconMap[channel.type]}
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
            <div className="ml-auto flex items-center gap-x-2">

                {channel.name !== "general"
                    ? role !== MemberRole.GUEST && (
                        <>
                            <ActionTooltip label='Modifier'>
                                <Edit
                                    onClick={undefined}
                                    className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                            </ActionTooltip>
                            <ActionTooltip label='Supprimer'>
                                <Trash
                                    onClick={(e) => handleAction(e, () => onOpen("deleteServer", {server}))}
                                    className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 transition" />
                            </ActionTooltip>
                        </>
                    )
                    : <ActionTooltip label='Canal par défaut' side="right">
                        <Lock
                            onClick={undefined}
                            className="h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                    </ActionTooltip>
                }
            </div>
        </button>
    )
}
