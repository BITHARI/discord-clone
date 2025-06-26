'use client'

import { Member } from "@prisma/client"
import ChatWelcome from "./ChatWelcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment } from "react"
import { MessageWithMemberWithProfile } from "@/types"
import ChatItem from "./ChatItem"
import { format } from "date-fns"

interface ChatMessagesProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "memberId",
    paramValue: string,
    type: "channel" | "conversation"
}

const DATE_FORMAT = "d MMMM yyyy, HH:mm"

export default function ChatMessages({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) {

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ queryKey: chatId, apiUrl, paramKey, paramValue, })

    if (status === "pending") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Chargement des messages ...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Une erreur s'est produite</p>
            </div>
        )
    }
    return (
        <div className="flex flex-1 flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome name={name} type={type} />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items?.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                content={message.content}
                                member={message.member}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                currentMember={member}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
