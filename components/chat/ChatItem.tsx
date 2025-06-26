'use client'

import { Member, MemberRole, Profile } from "@prisma/client"
import UserAvatar from "../user-avatar"
import ActionTooltip from "../action-tooltip"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChatItemProps {
    id: string,
    content: string,
    member: Member & { profile: Profile },
    timestamp: string,
    fileUrl: string | null,
    deleted: boolean,
    currentMember: Member,
    isUpdated: boolean,
    socketUrl: string,
    socketQuery: Record<string, string>
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500 flex-shrink-0" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500 flex-shrink-0" />
}


export default function ChatItem({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) {

    const [isPDF, setIsPDF] = useState(false)
    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = isAdmin || currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id
    const canDeleteMessage = (isModerator || isOwner) && !deleted
    const canEditMessage = isOwner && !deleted && !isUpdated

    return (

        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex items-start gap-x-2 w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role.toLowerCase()}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {fileUrl && !isPDF && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                                onError={() => setIsPDF(true)}
                            />
                        </a>
                    )}
                    {fileUrl && isPDF && (
                        <div className="flex items-center p-2 gap-x-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-8 w-8 fill-indigo-200 stroke-indigo-400" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-start text-indigo-500 w-full line-clamp-1 dark:text-indigo-400  hover:underline">
                                Document
                            </a>
                        </div>
                    )}
                    {!fileUrl && (
                        <p className={cn(
                            "text-sm text-zinc-900 dark:text-zinc-100",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edité)
                                </span>
                            )}
                        </p>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Modifier">
                            <Edit
                                className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                onClick={() => { }}
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Supprimer">
                        <Trash
                            className="w-4 h-4 cursor-pointer text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300 transition"
                            onClick={() => { }}
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}
