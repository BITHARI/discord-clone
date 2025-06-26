'use client'

import { Member } from "@prisma/client"
import ChatWelcome from "./ChatWelcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment, useRef } from "react"
import { MessageWithMemberWithProfile } from "@/types"
import ChatItem from "./ChatItem"
import { format } from "date-fns"
import { useChatSocket } from "@/hooks/use-chat-socket"
import { useChatScroll } from "@/hooks/use-chat-scroll"

interface ChatMessagesProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
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
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue, })
    useChatSocket({ addKey, updateKey, queryKey })

    const chatRef = useRef<HTMLDivElement | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)
    useChatScroll({
        chatRef,
        bottomRef,
        count: data?.pages?.[0]?.items?.length || 0,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        loadMore: fetchNextPage
    })

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
        <div className="flex flex-1 flex-col py-4 overflow-y-auto" ref={chatRef}>
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && <ChatWelcome name={name} type={type} />}
            {hasNextPage && <div className="flex justify-center mb-4">
                {isFetchingNextPage
                    ? <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                    : <button 
                    onClick={() => fetchNextPage()} 
                    className="text-zinc-500 dark:text-zinc-400 text-xs my-4 hover:text-zinc-600 dark:hover:text-zinc-300 transition">
                        Messages précédents
                    </button>
                }
            </div>
            }
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
            <div ref={bottomRef} />
        </div>
    )
}
