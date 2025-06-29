'use client'

import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import UserAvatar from "../user-avatar"
import { useParams, useRouter } from "next/navigation"

interface ServerMemberProps {
    member: Member & { profile: Profile },
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500 flex-shrink-0" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500 flex-shrink-0" />
}

export default function ServerMember({ member, server }: ServerMemberProps) {

    const params = useParams()
    const router = useRouter()

    return (
        <button
        onClick={() => router.push(`/servers/${server.id}/conversations/${member.id}`)}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700/60"
            )}>
            <UserAvatar src={member.profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
            <p className={cn(
                "text-start w-full font-semibold line-clamp-1 text-md text-zinc-500 dark:text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
            >
                {member.profile.name}
            </p>
            {roleIconMap[member.role]}
        </button>
    )
}
